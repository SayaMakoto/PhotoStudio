package com.photostudio.dto.images;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageRequest {

    private String imageableType;

    private Long imageableId;

    private String imageUrl;

    private String description;

    private Boolean isPrimary;

    private static final Set<String> VALID_TYPES = Set.of(
            "room", "background", "equipment", "clothing", "accessory", "package", "service");

    public void validate() {
        if (imageableType == null || imageableType.isBlank()) {
            throw new IllegalArgumentException("Loại đối tượng gắn ảnh (imageableType) không được để trống");
        }
        if (!VALID_TYPES.contains(imageableType.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Loại đối tượng gắn ảnh không hợp lệ. Hợp lệ: room, background, equipment, clothing, accessory, package, service");
        }
        if (imageableId == null || imageableId <= 0) {
            throw new IllegalArgumentException("Mã đối tượng gắn ảnh (imageableId) không hợp lệ");
        }
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Đường dẫn ảnh (imageUrl) không được để trống");
        }
        if (imageUrl.length() > 255) {
            throw new IllegalArgumentException("Đường dẫn ảnh tối đa 255 ký tự");
        }
        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả hình ảnh tối đa 255 ký tự");
        }
    }
}
