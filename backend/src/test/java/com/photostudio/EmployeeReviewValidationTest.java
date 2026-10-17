package com.photostudio;

import com.photostudio.dto.employeereviews.EmployeeReviewRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeReviewValidationTest {

    private EmployeeReviewRequest valid() {
        return new EmployeeReviewRequest(1L, 1L, 4.5, "Chụp rất đẹp, thân thiện");
    }

    @Test
    @DisplayName("Dữ liệu hợp lệ thì không ném lỗi")
    void validRequest_passes() {
        assertDoesNotThrow(() -> valid().validate());
    }

    @Test
    @DisplayName("reviewId và employeeId phải dương")
    void invalidIds_rejected() {
        EmployeeReviewRequest r = valid();
        r.setReviewId(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setReviewId(1L);
        r.setEmployeeId(-1L);
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Số sao phải trong khoảng 1.0 - 5.0")
    void ratingRange_checked() {
        EmployeeReviewRequest r = valid();
        r.setRating(0.5);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setRating(5.5);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setRating(1.0);
        assertDoesNotThrow(r::validate);
        r.setRating(5.0);
        assertDoesNotThrow(r::validate);
    }

    @Test
    @DisplayName("Rating null được chấp nhận (dùng mặc định 5.0)")
    void nullRating_accepted() {
        EmployeeReviewRequest r = valid();
        r.setRating(null);
        assertDoesNotThrow(r::validate);
    }

    @Test
    @DisplayName("Bình luận quá 255 ký tự bị từ chối")
    void longComment_rejected() {
        EmployeeReviewRequest r = valid();
        r.setComment("x".repeat(256));
        assertThrows(IllegalArgumentException.class, r::validate);
    }
}
