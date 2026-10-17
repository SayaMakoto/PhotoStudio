package com.photostudio.dto.banners;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BannerRequest {

    private String title;

    private String imageUrl;

    private String link;

    private String status;

    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive");

    public void validate() {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Tiêu đề banner (title) không được để trống");
        }
        if (title.length() > 255) {
            throw new IllegalArgumentException("Tiêu đề banner tối đa 255 ký tự");
        }
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new IllegalArgumentException("Đường dẫn ảnh banner (imageUrl) không được để trống");
        }
        if (imageUrl.length() > 255) {
            throw new IllegalArgumentException("Đường dẫn ảnh banner tối đa 255 ký tự");
        }
        if (link != null && link.length() > 255) {
            throw new IllegalArgumentException("Đường dẫn liên kết (link) tối đa 255 ký tự");
        }
        if (status != null && !status.isBlank()
                && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái banner không hợp lệ. Hợp lệ: active, inactive");
        }
    }
}
