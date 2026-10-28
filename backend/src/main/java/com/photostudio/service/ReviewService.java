package com.photostudio.service;

import com.photostudio.dto.reviews.EmployeeRatingResponse;
import com.photostudio.dto.reviews.ReviewRequest;
import com.photostudio.dto.reviews.ReviewResponse;

import java.util.List;

public interface ReviewService {

    List<ReviewResponse> findAll();

    ReviewResponse findById(Long id);

    ReviewResponse reply(Long id, String reply);

    ReviewResponse create(ReviewRequest request);

    ReviewResponse update(Long id, ReviewRequest request);

    void delete(Long id);

    ReviewResponse findByBookingId(Long bookingId);

    List<ReviewResponse> findByCustomerId(Long customerId);

    List<ReviewResponse> findByEmployeeId(Long employeeId);

    EmployeeRatingResponse getEmployeeRating(Long employeeId);
}
