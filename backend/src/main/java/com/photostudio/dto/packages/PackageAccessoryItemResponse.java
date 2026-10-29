package com.photostudio.dto.packages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageAccessoryItemResponse {
    private Long id;
    private Long accessoryId;
    private String accessoryName;
    private String type;
    private Integer quantity;
}
