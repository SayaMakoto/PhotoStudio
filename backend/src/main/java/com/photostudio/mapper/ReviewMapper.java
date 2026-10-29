package com.photostudio.mapper;

import com.photostudio.dto.reviews.EmployeeReviewRequest;
import com.photostudio.dto.reviews.EmployeeReviewResponse;
import com.photostudio.dto.reviews.ReviewRequest;
import com.photostudio.dto.reviews.ReviewResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.reviews.EmployeeReview;
import com.photostudio.model.reviews.Review;
import com.photostudio.model.users.User;

import java.util.ArrayList;
import java.util.List;

public class ReviewMapper {

    private static final double DEFAULT_RATING = 5.0;

    public static Review toEntity(ReviewRequest request) {
        return toEntity(request, null, null);
    }

    public static Review toEntity(ReviewRequest request, Booking booking, User customer) {
        Review review = new Review();

        if (booking != null) {
            review.setBooking(booking);
        } else if (request.getBookingId() != null) {
            review.setBookingId(request.getBookingId());
        }

        if (customer != null) {
            review.setCustomer(customer);
        } else if (request.getCustomerId() != null) {
            review.setCustomerId(request.getCustomerId());
        }

        review.setRating(request.getRating() != null ? request.getRating() : DEFAULT_RATING);
        review.setComment(request.getComment());
        replaceEmployeeReviews(request.getEmployeeReviews(), review);
        return review;
    }

    // Không đổi bookingId / customerId của bài đánh giá khi cập nhật
    public static void updateEntity(ReviewRequest request, Review review) {
        review.setRating(request.getRating() != null ? request.getRating() : DEFAULT_RATING);
        review.setComment(request.getComment());
        replaceEmployeeReviews(request.getEmployeeReviews(), review);
    }

    private static void replaceEmployeeReviews(List<EmployeeReviewRequest> items, Review review) {
        review.getEmployeeReviews().clear();
        if (items == null) {
            return;
        }
        for (EmployeeReviewRequest item : items) {
            EmployeeReview employeeReview = new EmployeeReview();
            employeeReview.setReview(review);
            employeeReview.setEmployeeId(item.getEmployeeId());
            employeeReview.setRating(item.getRating() != null ? item.getRating() : DEFAULT_RATING);
            employeeReview.setComment(item.getComment());
            review.getEmployeeReviews().add(employeeReview);
        }
    }

    public static EmployeeReviewResponse toEmployeeReviewResponse(EmployeeReview employeeReview) {
        String employeeName = null;
        String employeePosition = null;
        if (employeeReview.getEmployee() != null) {
            if (employeeReview.getEmployee().getUser() != null) {
                employeeName = employeeReview.getEmployee().getUser().getFullname();
            }
            if (employeeReview.getEmployee().getPosition() != null) {
                employeePosition = employeeReview.getEmployee().getPosition().name();
            }
        }
        return new EmployeeReviewResponse(
                employeeReview.getId(),
                employeeReview.getEmployeeId(),
                employeeName,
                employeePosition,
                employeeReview.getRating(),
                employeeReview.getComment(),
                employeeReview.getAdminReply(),
                employeeReview.getAdminRepliedAt()
        );
    }

    public static ReviewResponse toResponse(Review review) {
        List<EmployeeReviewResponse> employeeReviews = new ArrayList<>();
        if (review.getEmployeeReviews() != null) {
            for (EmployeeReview item : review.getEmployeeReviews()) {
                employeeReviews.add(toEmployeeReviewResponse(item));
            }
        }

        String roomName = null;
        if (review.getBooking() != null && review.getBooking().getRoom() != null) {
            roomName = review.getBooking().getRoom().getName();
        }

        ReviewResponse response = new ReviewResponse(
                review.getId(),
                review.getBookingId(),
                review.getCustomerId(),
                review.getCustomer() != null ? review.getCustomer().getFullname() : null,
                review.getRating(),
                review.getComment(),
                employeeReviews,
                review.getCreatedAt(),
                review.getUpdatedAt(),
                review.getAdminReply(),
                review.getAdminRepliedAt()
        );
        response.setRoomName(roomName);
        return response;
    }
}
