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
}
