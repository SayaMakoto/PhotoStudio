package com.photostudio.mapper;

import com.photostudio.dto.employeereviews.EmployeeReviewRequest;
import com.photostudio.dto.employeereviews.EmployeeReviewResponse;
import com.photostudio.model.employeereviews.EmployeeReview;
import com.photostudio.model.employees.Employee;

public class EmployeeReviewMapper {

    public static EmployeeReview toEntity(EmployeeReviewRequest request, Employee employee) {
        EmployeeReview review = new EmployeeReview();
        review.setReviewId(request.getReviewId());
        review.setEmployee(employee);
        review.setRating(request.getRating() != null ? request.getRating() : 5.0);
        review.setComment(request.getComment());
        return review;
    }

    public static void updateEntity(EmployeeReviewRequest request, EmployeeReview review, Employee employee) {
        review.setReviewId(request.getReviewId());
        review.setEmployee(employee);
        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        review.setComment(request.getComment());
    }

    public static EmployeeReviewResponse toResponse(EmployeeReview review) {
        Employee employee = review.getEmployee();
        return new EmployeeReviewResponse(
                review.getId(),
                review.getReviewId(),
                employee != null ? employee.getId() : null,
                employee != null && employee.getUser() != null ? employee.getUser().getFullname() : null,
                employee != null && employee.getPosition() != null ? employee.getPosition().name() : null,
                review.getRating(),
                review.getComment()
        );
    }
}
