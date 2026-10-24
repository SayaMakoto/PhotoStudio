package com.photostudio.service.impl;

import com.photostudio.dto.reviews.EmployeeRatingResponse;
import com.photostudio.dto.reviews.EmployeeReviewRequest;
import com.photostudio.dto.reviews.ReviewRequest;
import com.photostudio.dto.reviews.ReviewResponse;
import com.photostudio.mapper.ReviewMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.reviews.Review;
import com.photostudio.model.users.User;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.EmployeeRepository;
import com.photostudio.repository.ReviewRepository;
import com.photostudio.repository.UserRepository;
import com.photostudio.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository repository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public ReviewServiceImpl(
            ReviewRepository repository,
            BookingRepository bookingRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository) {
        this.repository = repository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    private Review findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đánh giá có id: " + id));
    }

    private void checkEmployeesExist(List<EmployeeReviewRequest> employeeReviews) {
        if (employeeReviews == null) {
            return;
        }
        for (EmployeeReviewRequest item : employeeReviews) {
            if (!employeeRepository.existsById(item.getEmployeeId())) {
                throw new IllegalArgumentException("Không tìm thấy nhân viên có id: " + item.getEmployeeId());
            }
        }
    }

    private void checkId(Long id, String message) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException(message);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse findById(Long id) {
        return ReviewMapper.toResponse(findEntity(id));
    }

    @Override
    public ReviewResponse create(ReviewRequest request) {
        request.validate();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn đặt lịch có id: " + request.getBookingId()));

        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy khách hàng có id: " + request.getCustomerId()));

        if (!Objects.equals(booking.getCustomerId(), customer.getId())) {
            throw new IllegalArgumentException("Khách hàng không phải là người đặt đơn đặt lịch này");
        }

        if (booking.getStatus() != BookingStatus.completed) {
            throw new IllegalArgumentException("Chỉ được đánh giá khi đơn đặt lịch đã hoàn thành");
        }

        if (repository.existsByBookingId(request.getBookingId())) {
            throw new IllegalArgumentException(
                    "Đơn đặt lịch (bookingId: " + request.getBookingId() + ") đã được đánh giá");
        }

        checkEmployeesExist(request.getEmployeeReviews());

        Review review = ReviewMapper.toEntity(request, booking, customer);
        Review saved = repository.save(review);
        return ReviewMapper.toResponse(saved);
    }

    @Override
    public ReviewResponse update(Long id, ReviewRequest request) {
        request.validate();

        Review review = findEntity(id);

        if (!Objects.equals(review.getBookingId(), request.getBookingId())) {
            throw new IllegalArgumentException("Không thể thay đổi đơn đặt lịch của bài đánh giá");
        }
        if (!Objects.equals(review.getCustomerId(), request.getCustomerId())) {
            throw new IllegalArgumentException("Không thể thay đổi khách hàng của bài đánh giá");
        }

        checkEmployeesExist(request.getEmployeeReviews());

        ReviewMapper.updateEntity(request, review);
        Review saved = repository.save(review);
        return ReviewMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Review review = findEntity(id);
        repository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse findByBookingId(Long bookingId) {
        checkId(bookingId, "Mã đơn đặt lịch không hợp lệ");
        Review review = repository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Đơn đặt lịch (bookingId: " + bookingId + ") chưa có đánh giá"));
        return ReviewMapper.toResponse(review);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> findByCustomerId(Long customerId) {
        checkId(customerId, "Mã khách hàng không hợp lệ");
        return repository.findByCustomerId(customerId)
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> findByEmployeeId(Long employeeId) {
        checkId(employeeId, "Mã nhân viên không hợp lệ");
        return repository.findByEmployeeId(employeeId)
                .stream()
                .map(ReviewMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeRatingResponse getEmployeeRating(Long employeeId) {
        checkId(employeeId, "Mã nhân viên không hợp lệ");

        Double average = repository.findAverageRatingByEmployeeId(employeeId);
        long total = repository.countByEmployeeId(employeeId);
        double rounded = average != null ? Math.round(average * 100.0) / 100.0 : 0.0;

        return new EmployeeRatingResponse(employeeId, rounded, total);
    }
}
