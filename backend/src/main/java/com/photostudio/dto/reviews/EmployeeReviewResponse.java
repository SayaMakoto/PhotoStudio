package com.photostudio.dto.reviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeReviewResponse {

    private Long id;

    private Long employeeId;

    private String employeeName;

    private String employeePosition;

    private Double rating;

    private String comment;

    private String adminReply;

    private LocalDateTime adminRepliedAt;

    public EmployeeReviewResponse(Long id, Long employeeId, Double rating, String comment) {
        this.id = id;
        this.employeeId = employeeId;
        this.rating = rating;
        this.comment = comment;
    }
}
