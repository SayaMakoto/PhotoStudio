package com.photostudio.service;

import com.photostudio.dto.employeereviews.EmployeeReviewRequest;
import com.photostudio.dto.employeereviews.EmployeeReviewResponse;

import java.util.List;
import java.util.Map;

public interface EmployeeReviewService {

    List<EmployeeReviewResponse> findAll();

    EmployeeReviewResponse findById(Long id);

    EmployeeReviewResponse reply(Long id, String reply);

    EmployeeReviewResponse create(EmployeeReviewRequest request);

    EmployeeReviewResponse update(Long id, EmployeeReviewRequest request);

    void delete(Long id);

    List<EmployeeReviewResponse> findByReviewId(Long reviewId);

    List<EmployeeReviewResponse> findByEmployeeId(Long employeeId);

    Map<String, Object> getEmployeeRatingSummary(Long employeeId);
}
