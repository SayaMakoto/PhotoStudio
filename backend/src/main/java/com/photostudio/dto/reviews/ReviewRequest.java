package com.photostudio.dto.reviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    private Long bookingId;
    // Ghi chú: kiểm tra tồn tại, trạng thái completed và chủ đơn ở Service

    private Long customerId;

    private Double rating;

    private String comment;

    private List<EmployeeReviewRequest> employeeReviews;

    public void validate() {
        if (bookingId == null || bookingId <= 0) {
            throw new IllegalArgumentException("Mã đơn đặt lịch (bookingId) không hợp lệ");
        }
        if (customerId == null || customerId <= 0) {
            throw new IllegalArgumentException("Mã khách hàng (customerId) không hợp lệ");
        }
        if (rating != null && (rating < 1.0 || rating > 5.0)) {
            throw new IllegalArgumentException("Số sao đánh giá phải từ 1.0 đến 5.0");
        }
        if (comment != null && comment.length() > 255) {
            throw new IllegalArgumentException("Bình luận của khách hàng tối đa 255 ký tự");
        }
        if (employeeReviews != null) {
            Set<Long> employeeIds = new HashSet<>();
            for (EmployeeReviewRequest item : employeeReviews) {
                if (item == null) {
                    throw new IllegalArgumentException("Đánh giá nhân viên không được để trống");
                }
                item.validate();
                if (!employeeIds.add(item.getEmployeeId())) {
                    throw new IllegalArgumentException(
                            "Nhân viên (employeeId: " + item.getEmployeeId() + ") bị đánh giá trùng");
                }
            }
        }
    }
}
