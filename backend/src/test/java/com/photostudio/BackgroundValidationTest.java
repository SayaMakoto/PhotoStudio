package com.photostudio;

import com.photostudio.dto.backgrounds.BackgroundRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BackgroundValidationTest {

    private BackgroundRequest valid() {
        return new BackgroundRequest("Phông Trơn Màu Pastel", "Bối cảnh tối giản", "active");
    }

    @Test
    @DisplayName("Dữ liệu hợp lệ thì không ném lỗi")
    void validRequest_passes() {
        assertDoesNotThrow(() -> valid().validate());
    }

    @Test
    @DisplayName("Tên bối cảnh trống bị từ chối")
    void blankName_rejected() {
        BackgroundRequest r = valid();
        r.setName("  ");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Tên bối cảnh quá 255 ký tự bị từ chối")
    void longName_rejected() {
        BackgroundRequest r = valid();
        r.setName("a".repeat(256));
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Trạng thái không hợp lệ bị từ chối")
    void invalidStatus_rejected() {
        BackgroundRequest r = valid();
        r.setStatus("deleted");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Trạng thái null được chấp nhận (dùng mặc định active)")
    void nullStatus_accepted() {
        BackgroundRequest r = valid();
        r.setStatus(null);
        assertDoesNotThrow(r::validate);
    }
}
