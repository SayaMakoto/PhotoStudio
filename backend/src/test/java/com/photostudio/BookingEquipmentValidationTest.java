package com.photostudio;

import com.photostudio.dto.bookings.BookingEquipmentRequest;
import com.photostudio.dto.bookings.BookingEquipmentResponse;
import com.photostudio.mapper.BookingEquipmentMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingEquipment;
import com.photostudio.model.bookings.BookingEquipmentStatus;
import com.photostudio.model.equipment.Equipment;
import com.photostudio.model.equipment.EquipmentStatus;
import com.photostudio.model.equipment.EquipmentType;
import com.photostudio.repository.BookingEquipmentRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.EquipmentRepository;
import com.photostudio.service.impl.BookingEquipmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingEquipmentValidationTest {

    @Mock
    private BookingEquipmentRepository bookingEquipmentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private EquipmentRepository equipmentRepository;

    @Mock
    private BookingEquipmentMapper bookingEquipmentMapper;

    @InjectMocks
    private BookingEquipmentServiceImpl bookingEquipmentService;

    private Booking testBooking;
    private Equipment testEquipment;
    private BookingEquipment testBookingEquipment;
    private BookingEquipmentRequest validRequest;
    private BookingEquipmentResponse validResponse;

    @BeforeEach
    void setUp() {
        testBooking = new Booking();
        testBooking.setId(1L);

        testEquipment = new Equipment();
        testEquipment.setId(5L);
        testEquipment.setName("Sony A7 IV");
        testEquipment.setType(EquipmentType.camera);
        testEquipment.setSerialNumber("SN-SONY-001");
        testEquipment.setStatus(EquipmentStatus.available);

        testBookingEquipment = new BookingEquipment();
        testBookingEquipment.setId(50L);
        testBookingEquipment.setBooking(testBooking);
        testBookingEquipment.setEquipment(testEquipment);
        testBookingEquipment.setAssignedAt(LocalDateTime.of(2026, 10, 15, 8, 30));
        testBookingEquipment.setStatus(BookingEquipmentStatus.assigned);
        testBookingEquipment.setNote("Kèm 2 pin và thẻ nhớ 128GB");

        validRequest = new BookingEquipmentRequest();
        validRequest.setBookingId(1L);
        validRequest.setEquipmentId(5L);
        validRequest.setAssignedAt(LocalDateTime.of(2026, 10, 15, 8, 30));
        validRequest.setStatus("assigned");
        validRequest.setNote("Kèm 2 pin và thẻ nhớ 128GB");

        validResponse = new BookingEquipmentResponse(
                50L, 1L, 5L, "Sony A7 IV", "camera", "SN-SONY-001",
                LocalDateTime.of(2026, 10, 15, 8, 30), null, "assigned", "Kèm 2 pin và thẻ nhớ 128GB"
        );
    }

    // ==========================================
    // 1. KIỂM THỬ XÁC THỰC DỮ LIỆU ĐẦU VÀO (REQUEST VALIDATION)
    // ==========================================

    @Test
    @DisplayName("Ném ngoại lệ khi bookingId bị null hoặc <= 0")
    void testValidate_BookingId_ThrowsException() {
        validRequest.setBookingId(null);
        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex1.getMessage().contains("Mã đơn đặt lịch (bookingId) không hợp lệ"));

        validRequest.setBookingId(0L);
        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex2.getMessage().contains("Mã đơn đặt lịch (bookingId) không hợp lệ"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi equipmentId bị null hoặc <= 0")
    void testValidate_EquipmentId_ThrowsException() {
        validRequest.setEquipmentId(null);
        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex1.getMessage().contains("Mã thiết bị (equipmentId) không hợp lệ"));

        validRequest.setEquipmentId(-5L);
        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex2.getMessage().contains("Mã thiết bị (equipmentId) không hợp lệ"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trạng thái cấp phát không hợp lệ")
    void testValidate_InvalidStatus_ThrowsException() {
        validRequest.setStatus("unknown_status");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Trạng thái cấp phát không hợp lệ"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi ghi chú vượt quá 255 ký tự")
    void testValidate_NoteExceedsLength_ThrowsException() {
        validRequest.setNote("N".repeat(256));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Ghi chú tối đa 255 ký tự"));
    }

    // ==========================================
    // 2. KIỂM THỬ MAPPER
    // ==========================================

    @Test
    @DisplayName("Chuyển đổi BookingEquipmentMapper sang Entity và Response DTO")
    void testMapper_Success() {
        BookingEquipmentMapper realMapper = new BookingEquipmentMapper();

        BookingEquipment entity = realMapper.toEntity(validRequest, testBooking, testEquipment);
        assertNotNull(entity);
        assertEquals(1L, entity.getBookingId());
        assertEquals(5L, entity.getEquipmentId());
        assertEquals(BookingEquipmentStatus.assigned, entity.getStatus());

        entity.setId(50L);
        BookingEquipmentResponse response = realMapper.toResponse(entity);
        assertNotNull(response);
        assertEquals(50L, response.getId());
        assertEquals("Sony A7 IV", response.getEquipmentName());
        assertEquals("camera", response.getEquipmentType());
        assertEquals("SN-SONY-001", response.getEquipmentSerialNumber());
    }

    // ==========================================
    // 3. KIỂM THỬ TẦNG SERVICE (BOOKING EQUIPMENT SERVICE)
    // ==========================================

    @Test
    @DisplayName("Cấp phát thiết bị cho đơn booking thành công (chuyển thiết bị sang in_use)")
    void testAssignEquipmentToBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(equipmentRepository.findById(5L)).thenReturn(Optional.of(testEquipment));
        when(bookingEquipmentRepository.existsByEquipmentIdAndStatus(5L, BookingEquipmentStatus.assigned)).thenReturn(false);
        when(bookingEquipmentMapper.toEntity(validRequest, testBooking, testEquipment)).thenReturn(testBookingEquipment);
        when(bookingEquipmentRepository.save(any(BookingEquipment.class))).thenReturn(testBookingEquipment);
        when(bookingEquipmentMapper.toResponse(testBookingEquipment)).thenReturn(validResponse);

        BookingEquipmentResponse result = bookingEquipmentService.assignEquipmentToBooking(validRequest);

        assertNotNull(result);
        assertEquals(50L, result.getId());
        assertEquals(EquipmentStatus.in_use, testEquipment.getStatus());
        verify(equipmentRepository, times(1)).save(testEquipment);
        verify(bookingEquipmentRepository, times(1)).save(testBookingEquipment);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiết bị đang bị hỏng hoặc ngừng sử dụng")
    void testAssignEquipmentToBooking_EquipmentBroken_ThrowsException() {
        testEquipment.setStatus(EquipmentStatus.broken);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(equipmentRepository.findById(5L)).thenReturn(Optional.of(testEquipment));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingEquipmentService.assignEquipmentToBooking(validRequest)
        );

        assertTrue(ex.getMessage().contains("đang bị hỏng hoặc ngừng sử dụng"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiết bị đang bảo trì")
    void testAssignEquipmentToBooking_EquipmentMaintenance_ThrowsException() {
        testEquipment.setStatus(EquipmentStatus.maintenance);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(equipmentRepository.findById(5L)).thenReturn(Optional.of(testEquipment));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingEquipmentService.assignEquipmentToBooking(validRequest)
        );

        assertTrue(ex.getMessage().contains("đang trong quá trình bảo trì"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiết bị đang được cấp phát cho đơn khác chưa hoàn trả")
    void testAssignEquipmentToBooking_AlreadyAssigned_ThrowsException() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(equipmentRepository.findById(5L)).thenReturn(Optional.of(testEquipment));
        when(bookingEquipmentRepository.existsByEquipmentIdAndStatus(5L, BookingEquipmentStatus.assigned)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingEquipmentService.assignEquipmentToBooking(validRequest)
        );

        assertTrue(ex.getMessage().contains("hiện đang được cấp phát cho một buổi chụp khác"));
    }

    @Test
    @DisplayName("Hoàn trả thiết bị thành công (đổi trạng thái thiết bị về available và ghi nhận returnedAt)")
    void testReturnEquipment_Success() {
        testEquipment.setStatus(EquipmentStatus.in_use);
        testBookingEquipment.setEquipment(testEquipment);

        when(bookingEquipmentRepository.findById(50L)).thenReturn(Optional.of(testBookingEquipment));
        when(bookingEquipmentRepository.save(any(BookingEquipment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(bookingEquipmentMapper.toResponse(any(BookingEquipment.class))).thenReturn(validResponse);

        BookingEquipmentResponse result = bookingEquipmentService.returnEquipment(50L, "Trả đủ phụ kiện");

        assertNotNull(result);
        assertEquals(BookingEquipmentStatus.returned, testBookingEquipment.getStatus());
        assertNotNull(testBookingEquipment.getReturnedAt());
        assertEquals("Trả đủ phụ kiện", testBookingEquipment.getNote());
        assertEquals(EquipmentStatus.available, testEquipment.getStatus());
        verify(equipmentRepository, times(1)).save(testEquipment);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi hoàn trả thiết bị đã được trả trước đó")
    void testReturnEquipment_AlreadyReturned_ThrowsException() {
        testBookingEquipment.setStatus(BookingEquipmentStatus.returned);
        when(bookingEquipmentRepository.findById(50L)).thenReturn(Optional.of(testBookingEquipment));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingEquipmentService.returnEquipment(50L, null)
        );

        assertTrue(ex.getMessage().contains("đã được hoàn trả trước đó"));
    }

    @Test
    @DisplayName("Cập nhật trạng thái cấp phát sang cancelled trả thiết bị về available")
    void testUpdateAssignmentStatus_Cancelled_Success() {
        testEquipment.setStatus(EquipmentStatus.in_use);
        testBookingEquipment.setEquipment(testEquipment);

        when(bookingEquipmentRepository.findById(50L)).thenReturn(Optional.of(testBookingEquipment));
        when(bookingEquipmentRepository.save(any(BookingEquipment.class))).thenAnswer(inv -> inv.getArgument(0));
        when(bookingEquipmentMapper.toResponse(any(BookingEquipment.class))).thenReturn(validResponse);

        bookingEquipmentService.updateAssignmentStatus(50L, "cancelled", "Khách hủy lịch chụp");

        assertEquals(BookingEquipmentStatus.cancelled, testBookingEquipment.getStatus());
        assertEquals(EquipmentStatus.available, testEquipment.getStatus());
        verify(equipmentRepository, times(1)).save(testEquipment);
    }

    @Test
    @DisplayName("Xóa phân công thiết bị khỏi booking trả lại trạng thái available nếu đang assigned")
    void testRemoveEquipmentFromBooking_Success() {
        testEquipment.setStatus(EquipmentStatus.in_use);
        testBookingEquipment.setEquipment(testEquipment);

        when(bookingEquipmentRepository.findById(50L)).thenReturn(Optional.of(testBookingEquipment));
        doNothing().when(bookingEquipmentRepository).deleteById(50L);

        assertDoesNotThrow(() -> bookingEquipmentService.removeEquipmentFromBooking(50L));

        assertEquals(EquipmentStatus.available, testEquipment.getStatus());
        verify(equipmentRepository, times(1)).save(testEquipment);
        verify(bookingEquipmentRepository, times(1)).deleteById(50L);
    }

    @Test
    @DisplayName("Lấy danh sách thiết bị được cấp phát cho đơn booking")
    void testGetEquipmentsByBookingId_Success() {
        when(bookingRepository.existsById(1L)).thenReturn(true);
        when(bookingEquipmentRepository.findByBookingId(1L)).thenReturn(List.of(testBookingEquipment));
        when(bookingEquipmentMapper.toResponse(testBookingEquipment)).thenReturn(validResponse);

        List<BookingEquipmentResponse> list = bookingEquipmentService.getEquipmentsByBookingId(1L);

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Sony A7 IV", list.get(0).getEquipmentName());
    }
}
