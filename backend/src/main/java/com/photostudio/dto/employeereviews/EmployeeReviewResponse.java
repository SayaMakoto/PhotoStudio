package com.photostudio.dto.employeereviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeReviewResponse {

    private Long id;

    private Long reviewId;

    private Long employeeId;
    private String employeeName;
    private String employeePosition;

    private Double rating;
    private String comment;

    private String adminReply;
    private java.time.LocalDateTime adminRepliedAt;
}
