package com.photostudio.dto.packages;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PackageServiceResponse {
    private Long id;
    private Long packageId;
    private Long serviceId;
    private String serviceName;
    private String serviceType;
    private Integer quantity;
    private Double servicePrice;
    private Double subtotal;
}
