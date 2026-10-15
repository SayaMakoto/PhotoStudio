package com.photostudio;

import com.photostudio.dto.employees.EmployeeRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class EmployeeValidationTest {

    private EmployeeRequest valid() {
        return new EmployeeRequest(2L, "photographer", LocalDate.of(2023, 1, 15), "active");
    }

    @Test
    @DisplayName("Dữ liệu hợp lệ thì không ném lỗi")
    void validRequest_passes() {
        assertDoesNotThrow(() -> valid().validate());
    }

    @Test
    @DisplayName("userId null hoặc <= 0 bị từ chối")
    void invalidUserId_rejected() {
        EmployeeRequest r = valid();
        r.setUserId(null);
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setUserId(0L);
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Vị trí trống hoặc sai bị từ chối")
    void invalidPosition_rejected() {
        EmployeeRequest r = valid();
        r.setPosition("");
        assertThrows(IllegalArgumentException.class, r::validate);
        r.setPosition("manager");
        assertThrows(IllegalArgumentException.class, r::validate);
    }

    @Test
    @DisplayName("Trạng thái on_leave hợp lệ, trạng thái lạ bị từ chối")
    void status_checked() {
        EmployeeRequest r = valid();
        r.setStatus("on_leave");
        assertDoesNotThrow(r::validate);
        r.setStatus("fired");
        assertThrows(IllegalArgumentException.class, r::validate);
    }
}
