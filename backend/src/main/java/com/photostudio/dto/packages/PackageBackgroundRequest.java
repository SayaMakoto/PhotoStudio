package com.photostudio.dto.packages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageBackgroundRequest {

    private Long packageId;
    private Long backgroundId;

    public void validate() {
        if (packageId == null || packageId <= 0) {
            throw new IllegalArgumentException("Mã gói chụp (packageId) không hợp lệ");
        }
        if (backgroundId == null || backgroundId <= 0) {
            throw new IllegalArgumentException("Mã bối cảnh (backgroundId) không hợp lệ");
        }
    }
}
