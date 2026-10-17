package com.photostudio.dto.employeereviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeReviewRequest {

    private Long reviewId;
    private Long employeeId;
    private Double rating;
    private String comment;

    public void validate() {
        if (reviewId == null || reviewId <= 0) {
            throw new IllegalArgumentException("Mã bài đánh giá (reviewId) không hợp lệ");
        }

        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Mã nhân viên (employeeId) không hợp lệ");
        }

        if (rating != null && (rating < 1.0 || rating > 5.0)) {
            throw new IllegalArgumentException("Số sao đánh giá phải nằm trong khoảng từ 1.0 đến 5.0");
        }

        if (comment != null && comment.length() > 255) {
            throw new IllegalArgumentException("Bình luận đánh giá nhân viên tối đa 255 ký tự");
        }
    }
}
