package com.photostudio.dto.packages;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PackageServiceRequest {
    private Long packageId;
    private Long serviceId;
    private Integer quantity;

    public void validate() {
        if (packageId == null || packageId <= 0) throw new IllegalArgumentException("Mã gói chụp (packageId) không hợp lệ");
        if (serviceId == null || serviceId <= 0) throw new IllegalArgumentException("Mã dịch vụ (serviceId) không hợp lệ");
        if (quantity != null && quantity <= 0) throw new IllegalArgumentException("Số lượng dịch vụ phải lớn hơn 0");
    }
}
