package com.photostudio.dto.packages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackageBackgroundResponse {

    private Long id;
    private Long packageId;
    private String packageName;
    private Long backgroundId;
    private String backgroundName;
    private String backgroundDescription;
    private String backgroundStatus;
}
