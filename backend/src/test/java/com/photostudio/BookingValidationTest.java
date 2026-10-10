package com.photostudio;

import com.photostudio.dto.bookings.BookingRequest;
import com.photostudio.dto.bookings.BookingResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.users.User;
import com.photostudio.repository.BookingRepository;
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

    @InjectMocks
    private BookingServiceImpl bookingService;

    private BookingRequest validRequest;
    private User testCustomer;

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
    }

    @Test
    @DisplayName("Tạo đơn đặt lịch thành công khi dữ liệu hợp lệ và không trùng lịch phòng")
    void testCreateBooking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

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
        assertEquals(LocalDateTime.of(2026, 10, 15, 9, 0, 0), response.getBookingDate());
        assertEquals(LocalTime.of(9, 0), response.getStartTime());
        assertEquals(LocalTime.of(11, 0), response.getEndTime());
        assertEquals("pending", response.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi không tìm thấy khách hàng")
    void testCreateBooking_CustomerNotFound_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy khách hàng có id: 1"));
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
    @DisplayName("Ném ngoại lệ khi thiếu customerId hoặc roomId")
    void testCreateBooking_MissingCustomerIdOrRoomId_ThrowsException() {
        validRequest.setCustomerId(null);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Mã khách hàng (customerId) không hợp lệ"));
        verify(bookingRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trùng lịch phòng chụp trong cùng khung giờ")
    void testCreateBooking_RoomConflict_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

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
    @DisplayName("Cập nhật trạng thái thành công và kiểm tra xung đột phòng khi kích hoạt lại đơn đã huỷ")
    void testUpdateStatus_FromCancelled_ChecksConflict() {
        Booking existing = new Booking();
        existing.setId(50L);
        existing.setCustomer(testCustomer);
        existing.setRoomId(2L);
        existing.setBookingDate(LocalDateTime.of(2026, 10, 15, 9, 0, 0));
        existing.setStartTime(LocalTime.of(9, 0));
        existing.setEndTime(LocalTime.of(11, 0));
        existing.setStatus(BookingStatus.cancelled);

        when(bookingRepository.findById(50L)).thenReturn(Optional.of(existing));
        when(bookingRepository.existsRoomBookingConflict(
                eq(2L),
                eq(LocalDateTime.of(2026, 10, 15, 9, 0, 0)),
                eq(LocalTime.of(9, 0)),
                eq(LocalTime.of(11, 0)),
                eq(BookingStatus.cancelled),
                eq(50L)
        )).thenReturn(false);

        when(bookingRepository.save(any(Booking.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingResponse response = bookingService.updateStatus(50L, "confirmed");

        assertNotNull(response);
        assertEquals("confirmed", response.getStatus());
        verify(bookingRepository, times(1)).save(existing);
    }
}
