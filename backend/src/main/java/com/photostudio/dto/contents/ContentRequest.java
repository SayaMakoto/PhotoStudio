package com.photostudio.dto.contents;

import java.util.Set;
import java.util.regex.Pattern;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentRequest {

    private String type;

    private String title;

    private String slug;

    private String content;

    private String imageUrl;

    private String status;

    private static final Set<String> VALID_TYPES = Set.of("page", "post");

    private static final Set<String> VALID_STATUSES = Set.of("draft", "published", "hidden");

    // Slug thân thiện: chữ thường, số, ngăn cách bằng dấu gạch ngang (vd: gioi-thieu-studio)
    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");

    public void validate() {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại nội dung (type) không được để trống");
        }
        if (!VALID_TYPES.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException("Loại nội dung không hợp lệ. Hợp lệ: page, post");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Tiêu đề (title) không được để trống");
        }
        if (title.length() > 255) {
            throw new IllegalArgumentException("Tiêu đề tối đa 255 ký tự");
        }
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Đường dẫn thân thiện (slug) không được để trống");
        }
        if (slug.trim().length() > 255) {
            throw new IllegalArgumentException("Slug tối đa 255 ký tự");
        }
        if (!SLUG_PATTERN.matcher(slug.trim().toLowerCase()).matches()) {
            throw new IllegalArgumentException(
                    "Slug không hợp lệ. Chỉ gồm chữ thường, số và dấu gạch ngang (ví dụ: gioi-thieu-studio)");
        }
        if (imageUrl != null && imageUrl.length() > 255) {
            throw new IllegalArgumentException("Đường dẫn ảnh đại diện tối đa 255 ký tự");
        }
        if (status != null && !status.isBlank()
                && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Trạng thái nội dung không hợp lệ. Hợp lệ: draft, published, hidden");
        }
    }
}
