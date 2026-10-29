package com.photostudio.dto.reviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;

    private Long bookingId;

    private Long customerId;

    private String customerName;

    private Double rating;

    private String comment;

    private List<EmployeeReviewResponse> employeeReviews;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String adminReply;

    private LocalDateTime adminRepliedAt;

    private String packageName;

    private String roomName;

    public ReviewResponse(
            Long id,
            Long bookingId,
            Long customerId,
            String customerName,
            Double rating,
            String comment,
            List<EmployeeReviewResponse> employeeReviews,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String adminReply,
            LocalDateTime adminRepliedAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.rating = rating;
        this.comment = comment;
        this.employeeReviews = employeeReviews;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.adminReply = adminReply;
        this.adminRepliedAt = adminRepliedAt;
    }
}
