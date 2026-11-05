package com.photostudio;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import com.photostudio.model.users.User;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.BookingEmployeeAssignmentRepository;
import com.photostudio.repository.RoomRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingValidationTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingEmployeeAssignmentRepository assignmentRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private BookingRequest validRequest;
    private User testCustomer;
    private Room testRoom;

    @BeforeEach
    void setUp() {
        validRequest = new BookingRequest();
        validRequest.setCustomerId(1L);
        validRequest.setRoomId(2L);
        validRequest.setBookingDate(LocalDateTime.of(2026, 10, 15, 9, 0, 0));
        validRequest.setStartTime(LocalTime.of(9, 0));
        validRequest.setEndTime(LocalTime.of(11, 0));
        validRequest.setStatus("pending");
        validRequest.setCustomerNote("Chụp ảnh cá nhân phong cách vintage");

        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setFullname("Đỗ Thành Thương");
        testCustomer.setPhone("0987654321");

        testRoom = new Room();
        testRoom.setId(2L);
        testRoom.setName("Phòng Studio Vintage");
        testRoom.setDescription("Phòng concept cổ điển châu Âu");
        testRoom.setCapacity(5);
        testRoom.setStatus(RoomStatus.active);
    }

    @Test
    @DisplayName("Tạo đơn đặt lịch thành công khi kết nối cả User và Room hợp lệ và không trùng phòng")
    void testCreateBooking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(testRoom));

        when(bookingRepository.existsRoomBookingConflict(
                eq(2L),
                eq(LocalDateTime.of(2026, 10, 15, 9, 0, 0)),
                eq(LocalTime.of(9, 0)),
                eq(LocalTime.of(11, 0)),
                eq(BookingStatus.cancelled),
                isNull()
        )).thenReturn(false);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> {
            Booking booking = invocation.getArgument(0);
            booking.setId(100L);
            return booking;
        });

        BookingResponse response = bookingService.create(validRequest);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(1L, response.getCustomerId());
        assertEquals("Đỗ Thành Thương", response.getCustomerName());
        assertEquals("0987654321", response.getCustomerPhone());
        assertEquals(2L, response.getRoomId());
        assertEquals("Phòng Studio Vintage", response.getRoomName());
        assertEquals(LocalDateTime.of(2026, 10, 15, 9, 0, 0), response.getBookingDate());
        assertEquals(LocalTime.of(9, 0), response.getStartTime());
        assertEquals(LocalTime.of(11, 0), response.getEndTime());
        assertEquals("pending", response.getStatus());

        verify(userRepository, times(1)).findById(1L);
        verify(roomRepository, times(1)).findById(2L);
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi phòng chụp (Room) không tồn tại")
    void testCreateBooking_RoomNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(roomRepository.findById(2L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy phòng chụp có id: 2"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi khách hàng (User) không tồn tại")
    void testCreateBooking_CustomerNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy khách hàng có id: 1"));
        verify(roomRepository, never()).findById(any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu roomId hoặc customerId")
    void testCreateBooking_MissingRoomIdOrCustomerId_ThrowsException() {
        validRequest.setRoomId(null);

        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Mã phòng chụp (roomId) không hợp lệ"));

        validRequest.setRoomId(2L);
        validRequest.setCustomerId(null);

        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Mã khách hàng (customerId) không hợp lệ"));

        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thời gian kết thúc trước hoặc bằng thời gian bắt đầu")
    void testCreateBooking_EndTimeBeforeStartTime_ThrowsException() {
        validRequest.setStartTime(LocalTime.of(14, 0));
        validRequest.setEndTime(LocalTime.of(13, 0));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Thời gian kết thúc phải sau thời gian bắt đầu"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trùng lịch phòng chụp trong cùng khung giờ")
    void testCreateBooking_RoomConflict_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(roomRepository.findById(2L)).thenReturn(Optional.of(testRoom));

        when(bookingRepository.existsRoomBookingConflict(
                eq(2L),
                eq(LocalDateTime.of(2026, 10, 15, 9, 0, 0)),
                eq(LocalTime.of(9, 0)),
                eq(LocalTime.of(11, 0)),
                eq(BookingStatus.cancelled),
                isNull()
        )).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Phòng chụp (roomId: 2) đã có người đặt"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật đơn đặt lịch thành công với Room mới")
    void testUpdateBooking_WithNewRoom_Success() {
        Booking existing = new Booking();
        existing.setId(10L);
        existing.setCustomer(testCustomer);
        existing.setRoom(testRoom);
        existing.setBookingDate(LocalDateTime.of(2026, 10, 15, 9, 0, 0));
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(11, 0));
        existing.setStatus(BookingStatus.pending);

        Room newRoom = new Room();
        newRoom.setId(3L);
        newRoom.setName("Phòng Studio Hiện Đại");
        newRoom.setStatus(RoomStatus.active);

        BookingRequest updateRequest = new BookingRequest();
        updateRequest.setCustomerId(1L);
        updateRequest.setRoomId(3L);
        updateRequest.setBookingDate(LocalDateTime.of(2026, 10, 15, 14, 0, 0));
        updateRequest.setStartTime(LocalTime.of(14, 0));
        updateRequest.setEndTime(LocalTime.of(16, 0));
        updateRequest.setStatus("confirmed");

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(roomRepository.findById(3L)).thenReturn(Optional.of(newRoom));

        when(bookingRepository.existsRoomBookingConflict(
                eq(3L),
                eq(LocalDateTime.of(2026, 10, 15, 14, 0, 0)),
                eq(LocalTime.of(14, 0)),
                eq(LocalTime.of(16, 0)),
                eq(BookingStatus.cancelled),
                eq(10L)
        )).thenReturn(false);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.update(10L, updateRequest);

        assertNotNull(response);
        assertEquals(3L, response.getRoomId());
        assertEquals("Phòng Studio Hiện Đại", response.getRoomName());
        assertEquals("confirmed", response.getStatus());
        verify(bookingRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật đặt lịch với Room không tồn tại")
    void testUpdateBooking_RoomNotFound_ThrowsException() {
        Booking existing = new Booking();
        existing.setId(10L);
        existing.setCustomer(testCustomer);
        existing.setRoom(testRoom);

        BookingRequest updateRequest = new BookingRequest();
        updateRequest.setCustomerId(1L);
        updateRequest.setRoomId(99L);
        updateRequest.setBookingDate(LocalDateTime.of(2026, 10, 15, 14, 0, 0));
        updateRequest.setStartTime(LocalTime.of(14, 0));
        updateRequest.setEndTime(LocalTime.of(16, 0));

        when(bookingRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(roomRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.update(10L, updateRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy phòng chụp có id: 99"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Không cho phép xác nhận lại đơn đã huỷ")
    void testUpdateStatus_FromCancelledToConfirmed_IsRejected() {
        Booking existing = new Booking();
        existing.setId(50L);
        existing.setCustomer(testCustomer);
        existing.setRoom(testRoom);
        existing.setBookingDate(LocalDateTime.of(2026, 10, 15, 9, 0, 0));
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(11, 0));
        existing.setStatus(BookingStatus.cancelled);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(existing));
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.updateStatus(50L, "confirmed"));

        assertTrue(ex.getMessage().contains("Không thể chuyển trạng thái đơn"));
        verify(bookingRepository, never()).existsRoomBookingConflict(anyLong(), any(), any(), any(), any(), any());
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Không cho phép xác nhận lại đơn đã hoàn tất")
    void testUpdateStatus_FromCompletedToConfirmed_IsRejected() {
        Booking existing = new Booking();
        existing.setId(51L);
        existing.setCustomer(testCustomer);
        existing.setRoom(testRoom);
        existing.setBookingDate(LocalDateTime.of(2026, 10, 15, 9, 0, 0));
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(11, 0));
        existing.setStatus(BookingStatus.completed);
        when(bookingRepository.findById(51L)).thenReturn(Optional.of(existing));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.updateStatus(51L, "confirmed"));

        assertTrue(ex.getMessage().contains("Không thể chuyển trạng thái đơn"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cho phép chuyển đơn đã xác nhận sang hoàn tất")
    void testUpdateStatus_FromConfirmedToCompleted_IsAllowed() {
        Booking existing = new Booking();
        existing.setId(52L);
        existing.setCustomer(testCustomer);
        existing.setRoom(testRoom);
        existing.setBookingDate(LocalDateTime.of(2026, 10, 15, 9, 0, 0));
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(11, 0));
        existing.setStatus(BookingStatus.confirmed);
        when(bookingRepository.findById(52L)).thenReturn(Optional.of(existing));
        when(bookingRepository.existsRoomBookingConflict(
                eq(2L), eq(existing.getBookingDate()), eq(existing.getStartTime()), eq(existing.getEndTime()),
                eq(BookingStatus.cancelled), eq(52L))).thenReturn(false);
        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.updateStatus(52L, "completed");

        assertEquals("completed", response.getStatus());
        verify(bookingRepository).save(existing);
    }
}
