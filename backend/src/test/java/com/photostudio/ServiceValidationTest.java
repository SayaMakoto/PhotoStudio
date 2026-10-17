package com.photostudio;

import com.photostudio.dto.services.ServiceRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ServiceValidationTest {

    private ServiceRequest valid() {
        return new ServiceRequest("Trang Điểm & Làm Tóc", "makeup", "Makeup cá nhân", 60, 300000.0, "active");
    }

    @Test
    @DisplayName("Dữ liệu hợp lệ thì không ném lỗi")
    void validRequest_passes() {
        assertDoesNotThrow(() -> valid().validate());
    }

    @Test
    @DisplayName("Tên dịch vụ trống bị từ chối")
    void blankName_rejected() {
        ServiceRequest r = valid();
        r.setName(" ");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Loại dịch vụ trống hoặc sai bị từ chối")
    void invalidType_rejected() {
        ServiceRequest r = valid();
        r.setType(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setType("cooking");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Thời lượng và giá âm bị từ chối")
    void negativeNumbers_rejected() {
        ServiceRequest r = valid();
        r.setDuration(-5);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setDuration(0);
        r.setPrice(-1.0);
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Trạng thái chỉ nhận active/inactive")
    void status_checked() {
        ServiceRequest r = valid();
        r.setStatus("inactive");
        assertDoesNotThrow(r::validate);
        r.setStatus("maintenance");
        assertThrows(IllegalArgumentException.class, r::validate);
    }
}
