package com.photostudio.dto.reviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRatingResponse {

    private Long employeeId;

    // Điểm trung bình (làm tròn 2 chữ số), 0.0 nếu chưa có đánh giá nào
    private Double averageRating;

    private Long totalReviews;
}
