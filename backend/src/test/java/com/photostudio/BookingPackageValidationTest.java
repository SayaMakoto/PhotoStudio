package com.photostudio;

import com.photostudio.dto.bookings.BookingPackageRequest;
import com.photostudio.dto.bookings.BookingPackageResponse;
import com.photostudio.mapper.BookingPackageMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingPackage;
import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageStatus;
import com.photostudio.repository.BookingPackageRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.PackageRepository;
import com.photostudio.service.impl.BookingPackageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingPackageValidationTest {

    @Mock
    private BookingPackageRepository bookingPackageRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private PackageRepository packageRepository;

    @Mock
    private BookingPackageMapper bookingPackageMapper;

    @InjectMocks
    private BookingPackageServiceImpl bookingPackageService;

    private Booking testBooking;
    private Package testPackage;
    private BookingPackage testBookingPackage;
    private BookingPackageRequest validRequest;
    private BookingPackageResponse validResponse;

    @BeforeEach
    void setUp() {
        testBooking = new Booking();
        testBooking.setId(1L);

        testPackage = new Package();
        testPackage.setId(10L);
        testPackage.setName("Gói Chụp Ảnh Cưới Luxury");
        testPackage.setDuration(120);
        testPackage.setPrice(3500000.0);
        testPackage.setStatus(PackageStatus.active);

        testBookingPackage = new BookingPackage();
        testBookingPackage.setId(100L);
        testBookingPackage.setBooking(testBooking);
        testBookingPackage.setPackageEntity(testPackage);
        testBookingPackage.setQuantity(2);
        testBookingPackage.setUnitPrice(3500000.0);

        validRequest = new BookingPackageRequest();
        validRequest.setBookingId(1L);
        validRequest.setPackageId(10L);
        validRequest.setQuantity(2);
        validRequest.setUnitPrice(3500000.0);

        validResponse = new BookingPackageResponse(
                100L, 1L, 10L, "Gói Chụp Ảnh Cưới Luxury", 120, 2, 3500000.0, 7000000.0
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
    @DisplayName("Ném ngoại lệ khi packageId bị null hoặc <= 0")
    void testValidate_PackageId_ThrowsException() {
        validRequest.setPackageId(null);
        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex1.getMessage().contains("Mã gói chụp (packageId) không hợp lệ"));

        validRequest.setPackageId(-1L);
        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex2.getMessage().contains("Mã gói chụp (packageId) không hợp lệ"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi quantity <= 0")
    void testValidate_InvalidQuantity_ThrowsException() {
        validRequest.setQuantity(0);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Số lượng gói chụp phải lớn hơn 0"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi unitPrice < 0")
    void testValidate_NegativeUnitPrice_ThrowsException() {
        validRequest.setUnitPrice(-1000.0);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Đơn giá gói chụp không được âm"));
    }

    // ==========================================
    // 2. KIỂM THỬ MAPPER
    // ==========================================

    @Test
    @DisplayName("Chuyển đổi BookingPackageMapper sang Entity và Response DTO")
    void testMapper_Success() {
        BookingPackageMapper realMapper = new BookingPackageMapper();

        BookingPackage entity = realMapper.toEntity(validRequest, testBooking, testPackage);
        assertNotNull(entity);
        assertEquals(1L, entity.getBookingId());
        assertEquals(10L, entity.getPackageId());
        assertEquals(2, entity.getQuantity());
        assertEquals(3500000.0, entity.getUnitPrice());

        entity.setId(100L);
        BookingPackageResponse response = realMapper.toResponse(entity);
        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Gói Chụp Ảnh Cưới Luxury", response.getPackageName());
        assertEquals(7000000.0, response.getSubTotal());
    }

    // ==========================================
    // 3. KIỂM THỬ TẦNG SERVICE (BOOKING PACKAGE SERVICE)
    // ==========================================

    @Test
    @DisplayName("Thêm gói chụp mới vào đơn booking thành công")
    void testAddPackageToBooking_Success() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(packageRepository.findById(10L)).thenReturn(Optional.of(testPackage));
        when(bookingPackageRepository.findByBookingIdAndPackageEntityId(1L, 10L)).thenReturn(Optional.empty());
        when(bookingPackageMapper.toEntity(validRequest, testBooking, testPackage)).thenReturn(testBookingPackage);
        when(bookingPackageRepository.save(any(BookingPackage.class))).thenReturn(testBookingPackage);
        when(bookingPackageMapper.toResponse(testBookingPackage)).thenReturn(validResponse);

        BookingPackageResponse result = bookingPackageService.addPackageToBooking(validRequest);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals(7000000.0, result.getSubTotal());
        verify(bookingPackageRepository, times(1)).save(any(BookingPackage.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thêm gói chụp vào booking không tồn tại")
    void testAddPackageToBooking_BookingNotFound_ThrowsException() {
        when(bookingRepository.findById(99L)).thenReturn(Optional.empty());
        validRequest.setBookingId(99L);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingPackageService.addPackageToBooking(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy đơn đặt lịch với ID: 99"));
        verify(bookingPackageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi gói chụp không tồn tại")
    void testAddPackageToBooking_PackageNotFound_ThrowsException() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(packageRepository.findById(99L)).thenReturn(Optional.empty());
        validRequest.setPackageId(99L);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingPackageService.addPackageToBooking(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy gói chụp với ID: 99"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thêm gói chụp đang ở trạng thái ngưng hoạt động (inactive)")
    void testAddPackageToBooking_PackageInactive_ThrowsException() {
        testPackage.setStatus(PackageStatus.inactive);
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(packageRepository.findById(10L)).thenReturn(Optional.of(testPackage));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bookingPackageService.addPackageToBooking(validRequest)
        );

        assertTrue(ex.getMessage().contains("hiện đang ngưng hoạt động"));
    }

    @Test
    @DisplayName("Tự động tăng số lượng khi gói chụp đã tồn tại trong booking")
    void testAddPackageToBooking_AlreadyExists_IncrementsQuantity() {
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(testBooking));
        when(packageRepository.findById(10L)).thenReturn(Optional.of(testPackage));
        when(bookingPackageRepository.findByBookingIdAndPackageEntityId(1L, 10L)).thenReturn(Optional.of(testBookingPackage));
        when(bookingPackageRepository.save(any(BookingPackage.class))).thenAnswer(inv -> inv.getArgument(0));
        when(bookingPackageMapper.toResponse(any(BookingPackage.class))).thenReturn(validResponse);

        bookingPackageService.addPackageToBooking(validRequest);

        // Ban đầu testBookingPackage có quantity = 2, thêm 2 nữa là 4
        assertEquals(4, testBookingPackage.getQuantity());
        verify(bookingPackageRepository, times(1)).save(testBookingPackage);
    }

    @Test
    @DisplayName("Lấy danh sách các gói chụp thuộc đơn booking")
    void testGetPackagesByBookingId_Success() {
        when(bookingRepository.existsById(1L)).thenReturn(true);
        when(bookingPackageRepository.findByBookingId(1L)).thenReturn(List.of(testBookingPackage));
        when(bookingPackageMapper.toResponse(testBookingPackage)).thenReturn(validResponse);

        List<BookingPackageResponse> list = bookingPackageService.getPackagesByBookingId(1L);

        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Gói Chụp Ảnh Cưới Luxury", list.get(0).getPackageName());
    }

    @Test
    @DisplayName("Cập nhật số lượng và đơn giá gói chụp trong booking thành công")
    void testUpdateBookingPackage_Success() {
        when(bookingPackageRepository.findById(100L)).thenReturn(Optional.of(testBookingPackage));
        when(bookingPackageRepository.save(any(BookingPackage.class))).thenAnswer(inv -> inv.getArgument(0));
        when(bookingPackageMapper.toResponse(testBookingPackage)).thenReturn(validResponse);

        BookingPackageResponse result = bookingPackageService.updateBookingPackage(100L, 3, 3000000.0);

        assertEquals(3, testBookingPackage.getQuantity());
        assertEquals(3000000.0, testBookingPackage.getUnitPrice());
        assertNotNull(result);
    }

    @Test
    @DisplayName("Xóa gói chụp khỏi đơn booking thành công")
    void testRemovePackageFromBooking_Success() {
        when(bookingPackageRepository.existsById(100L)).thenReturn(true);
        doNothing().when(bookingPackageRepository).deleteById(100L);

        assertDoesNotThrow(() -> bookingPackageService.removePackageFromBooking(100L));
        verify(bookingPackageRepository, times(1)).deleteById(100L);
    }

    @Test
    @DisplayName("Tính tổng tiền các gói chụp trong đơn booking chính xác")
    void testCalculateTotalPackagePrice_Success() {
        when(bookingRepository.existsById(1L)).thenReturn(true);
        when(bookingPackageRepository.findByBookingId(1L)).thenReturn(List.of(testBookingPackage));

        Double total = bookingPackageService.calculateTotalPackagePrice(1L);

        // 2 * 3,500,000 = 7,000,000
        assertEquals(7000000.0, total);
    }
}
