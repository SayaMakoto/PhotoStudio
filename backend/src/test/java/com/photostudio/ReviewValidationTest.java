package com.photostudio;

import com.photostudio.dto.reviews.EmployeeRatingResponse;
import com.photostudio.dto.reviews.EmployeeReviewRequest;
import com.photostudio.dto.reviews.ReviewRequest;
import com.photostudio.dto.reviews.ReviewResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.reviews.EmployeeReview;
import com.photostudio.model.reviews.Review;
import com.photostudio.model.users.User;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.EmployeeRepository;
import com.photostudio.repository.ReviewRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.impl.ReviewServiceImpl;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewValidationTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private ReviewRequest validRequest;
    private User testCustomer;
    private Booking testBooking;

    @BeforeEach
    void setUp() {
        testCustomer = new User();
        testCustomer.setId(1L);
        testCustomer.setFullname("Đỗ Thành Thương");

        testBooking = new Booking();
        testBooking.setId(5L);
        testBooking.setCustomer(testCustomer);
        testBooking.setStatus(BookingStatus.completed);

        EmployeeReviewRequest employeeReview = new EmployeeReviewRequest();
        employeeReview.setEmployeeId(3L);
        employeeReview.setRating(4.5);
        employeeReview.setComment("Thợ chụp nhiệt tình");

        validRequest = new ReviewRequest();
        validRequest.setBookingId(5L);
        validRequest.setCustomerId(1L);
        validRequest.setRating(5.0);
        validRequest.setComment("Buổi chụp rất tuyệt vời");
        validRequest.setEmployeeReviews(List.of(employeeReview));
    }

    private Review buildReview(Long id) {
        Review review = new Review();
        review.setId(id);
        review.setBooking(testBooking);
        review.setCustomer(testCustomer);
        review.setRating(4.0);
        review.setComment("Cũ");
        return review;
    }

    @Test
    @DisplayName("Tạo đánh giá thành công kèm đánh giá nhân viên")
    void testCreateReview_Success() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(reviewRepository.existsByBookingId(5L)).thenReturn(false);
        when(employeeRepository.existsById(3L)).thenReturn(true);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> {
            Review review = invocation.getArgument(0);
            review.setId(100L);
            return review;
        });

        ReviewResponse response = reviewService.create(validRequest);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(5L, response.getBookingId());
        assertEquals(1L, response.getCustomerId());
        assertEquals("Đỗ Thành Thương", response.getCustomerName());
        assertEquals(5.0, response.getRating());
        assertEquals("Buổi chụp rất tuyệt vời", response.getComment());
        assertEquals(1, response.getEmployeeReviews().size());
        assertEquals(3L, response.getEmployeeReviews().get(0).getEmployeeId());
        assertEquals(4.5, response.getEmployeeReviews().get(0).getRating());
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    @DisplayName("Số sao mặc định là 5.0 khi không truyền rating")
    void testCreateReview_DefaultRating() {
        validRequest.setRating(null);
        validRequest.setEmployeeReviews(null);

        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(reviewRepository.existsByBookingId(5L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReviewResponse response = reviewService.create(validRequest);

        assertEquals(5.0, response.getRating());
        assertTrue(response.getEmployeeReviews().isEmpty());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu bookingId hoặc customerId")
    void testCreateReview_MissingIds_ThrowsException() {
        validRequest.setBookingId(null);
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Mã đơn đặt lịch (bookingId) không hợp lệ"));

        validRequest.setBookingId(5L);
        validRequest.setCustomerId(null);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Mã khách hàng (customerId) không hợp lệ"));

        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi số sao ngoài khoảng 1.0 - 5.0")
    void testCreateReview_InvalidRating_ThrowsException() {
        validRequest.setRating(0.5);
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Số sao đánh giá phải từ 1.0 đến 5.0"));

        validRequest.setRating(5.5);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Số sao đánh giá phải từ 1.0 đến 5.0"));

        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi bình luận vượt quá 255 ký tự")
    void testCreateReview_CommentTooLong_ThrowsException() {
        validRequest.setComment("a".repeat(256));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Bình luận của khách hàng tối đa 255 ký tự"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi đánh giá nhân viên không hợp lệ hoặc trùng nhân viên")
    void testCreateReview_InvalidEmployeeReviews_ThrowsException() {
        EmployeeReviewRequest bad = new EmployeeReviewRequest();
        bad.setEmployeeId(0L);
        validRequest.setEmployeeReviews(List.of(bad));
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Mã nhân viên (employeeId) không hợp lệ"));

        EmployeeReviewRequest a = new EmployeeReviewRequest();
        a.setEmployeeId(3L);
        EmployeeReviewRequest b = new EmployeeReviewRequest();
        b.setEmployeeId(3L);
        validRequest.setEmployeeReviews(List.of(a, b));
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("bị đánh giá trùng"));

        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi đơn đặt lịch không tồn tại")
    void testCreateReview_BookingNotFound_ThrowsException() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy đơn đặt lịch có id: 5"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi khách hàng không tồn tại")
    void testCreateReview_CustomerNotFound_ThrowsException() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy khách hàng có id: 1"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi khách hàng không phải người đặt đơn")
    void testCreateReview_NotBookingOwner_ThrowsException() {
        User other = new User();
        other.setId(2L);
        validRequest.setCustomerId(2L);

        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(2L)).thenReturn(Optional.of(other));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("không phải là người đặt đơn đặt lịch này"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi đơn đặt lịch chưa hoàn thành")
    void testCreateReview_BookingNotCompleted_ThrowsException() {
        testBooking.setStatus(BookingStatus.confirmed);

        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Chỉ được đánh giá khi đơn đặt lịch đã hoàn thành"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi đơn đặt lịch đã được đánh giá")
    void testCreateReview_AlreadyReviewed_ThrowsException() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(reviewRepository.existsByBookingId(5L)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("đã được đánh giá"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi nhân viên được đánh giá không tồn tại")
    void testCreateReview_EmployeeNotFound_ThrowsException() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(testBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testCustomer));
        when(reviewRepository.existsByBookingId(5L)).thenReturn(false);
        when(employeeRepository.existsById(3L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy nhân viên có id: 3"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật đánh giá thành công và thay thế danh sách đánh giá nhân viên")
    void testUpdateReview_Success() {
        Review existing = buildReview(10L);
        EmployeeReview old = new EmployeeReview();
        old.setReview(existing);
        old.setEmployeeId(9L);
        old.setRating(3.0);
        existing.getEmployeeReviews().add(old);

        when(reviewRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(employeeRepository.existsById(3L)).thenReturn(true);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReviewResponse response = reviewService.update(10L, validRequest);

        assertEquals(5.0, response.getRating());
        assertEquals("Buổi chụp rất tuyệt vời", response.getComment());
        assertEquals(1, response.getEmployeeReviews().size());
        assertEquals(3L, response.getEmployeeReviews().get(0).getEmployeeId());
        verify(reviewRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật đánh giá không tồn tại")
    void testUpdateReview_NotFound_ThrowsException() {
        when(reviewRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.update(99L, validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy đánh giá có id: 99"));
        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật đổi đơn đặt lịch hoặc khách hàng của đánh giá")
    void testUpdateReview_ChangeBookingOrCustomer_ThrowsException() {
        Review existing = buildReview(10L);
        when(reviewRepository.findById(10L)).thenReturn(Optional.of(existing));

        validRequest.setBookingId(6L);
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.update(10L, validRequest)
        );
        assertTrue(ex1.getMessage().contains("Không thể thay đổi đơn đặt lịch của bài đánh giá"));

        validRequest.setBookingId(5L);
        validRequest.setCustomerId(2L);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.update(10L, validRequest)
        );
        assertTrue(ex2.getMessage().contains("Không thể thay đổi khách hàng của bài đánh giá"));

        verify(reviewRepository, never()).save(any());
    }

    @Test
    @DisplayName("Tính điểm trung bình của nhân viên (làm tròn 2 chữ số)")
    void testGetEmployeeRating_Success() {
        when(reviewRepository.findAverageRatingByEmployeeId(3L)).thenReturn(4.6666666);
        when(reviewRepository.countByEmployeeId(3L)).thenReturn(3L);

        EmployeeRatingResponse response = reviewService.getEmployeeRating(3L);

        assertEquals(3L, response.getEmployeeId());
        assertEquals(4.67, response.getAverageRating());
        assertEquals(3L, response.getTotalReviews());
    }

    @Test
    @DisplayName("Nhân viên chưa có đánh giá thì điểm trung bình là 0.0")
    void testGetEmployeeRating_NoReviews() {
        when(reviewRepository.findAverageRatingByEmployeeId(3L)).thenReturn(null);
        when(reviewRepository.countByEmployeeId(3L)).thenReturn(0L);

        EmployeeRatingResponse response = reviewService.getEmployeeRating(3L);

        assertEquals(0.0, response.getAverageRating());
        assertEquals(0L, response.getTotalReviews());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi tìm theo đơn, khách hàng, nhân viên với mã không hợp lệ")
    void testFind_InvalidIds_ThrowsException() {
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.findByBookingId(null)
        );
        assertTrue(ex1.getMessage().contains("Mã đơn đặt lịch không hợp lệ"));

        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.findByCustomerId(0L)
        );
        assertTrue(ex2.getMessage().contains("Mã khách hàng không hợp lệ"));

        IllegalArgumentException ex3 = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.findByEmployeeId(-1L)
        );
        assertTrue(ex3.getMessage().contains("Mã nhân viên không hợp lệ"));
    }

    @Test
    @DisplayName("Đơn đặt lịch chưa có đánh giá thì báo lỗi")
    void testFindByBookingId_NotReviewed_ThrowsException() {
        when(reviewRepository.findByBookingId(5L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.findByBookingId(5L)
        );

        assertTrue(ex.getMessage().contains("chưa có đánh giá"));
    }

    @Test
    @DisplayName("Xóa đánh giá không tồn tại ném ngoại lệ")
    void testDeleteReview_NotFound_ThrowsException() {
        when(reviewRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> reviewService.delete(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy đánh giá có id: 99"));
        verify(reviewRepository, never()).delete(any());
    }
}
