package com.photostudio;

import com.photostudio.dto.clothes.ClothRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ClothValidationTest {

    private ClothRequest valid() {
        return new ClothRequest("wedding", "Váy Cưới Công Chúa", "M", "Female",
                "Trắng", "Váy ren cao cấp", 500000.0, "available");
    }

    @Test
    @DisplayName("Dữ liệu hợp lệ thì không ném lỗi")
    void validRequest_passes() {
        assertDoesNotThrow(() -> valid().validate());
    }

    @Test
    @DisplayName("Loại trang phục trống hoặc sai bị từ chối")
    void invalidType_rejected() {
        ClothRequest r = valid();
        r.setType(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setType("spacesuit");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Tên trang phục trống bị từ chối")
    void blankName_rejected() {
        ClothRequest r = valid();
        r.setName("");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Giới tính phải là Male/Female (không phân biệt hoa thường)")
    void gender_checked() {
        ClothRequest r = valid();
        r.setGender("male");
        assertDoesNotThrow(r::validate);
        r.setGender("other");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Giá thuê âm bị từ chối")
    void negativePrice_rejected() {
        ClothRequest r = valid();
        r.setPrice(-1.0);
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Trạng thái retired hợp lệ, trạng thái lạ bị từ chối")
    void status_checked() {
        ClothRequest r = valid();
        r.setStatus("retired");
        assertDoesNotThrow(r::validate);
        r.setStatus("lost");
        assertThrows(IllegalArgumentException.class, r::validate);
    }
}
