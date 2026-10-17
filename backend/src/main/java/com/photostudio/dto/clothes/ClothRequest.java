package com.photostudio.dto.clothes;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClothRequest {

    private String type;
    private String name;
    private String size;
    private String gender;
    private String color;
    private String description;
    private Double price;
    private String status;

    private static final Set<String> VALID_TYPES = Set.of(
            "wedding", "traditional", "casual", "suit", "cosplay", "other");
    private static final Set<String> VALID_GENDERS = Set.of("male", "female");
    private static final Set<String> VALID_STATUSES = Set.of(
            "available", "rented", "maintenance", "damaged", "retired");

    public void validate() {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại trang phục không được để trống");
        }
        if (!VALID_TYPES.contains(type.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Loại trang phục không hợp lệ. Các loại hợp lệ: wedding, traditional, casual, suit, cosplay, other");
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Tên trang phục không được để trống");
        }
        if (name.length() > 255) {
            throw new IllegalArgumentException("Tên trang phục tối đa 255 ký tự");
        }

        if (size != null && size.length() > 255) {
            throw new IllegalArgumentException("Kích cỡ tối đa 255 ký tự");
        }

        if (gender != null && !gender.isBlank() && !VALID_GENDERS.contains(gender.trim().toLowerCase())) {
            throw new IllegalArgumentException("Giới tính trang phục không hợp lệ. Các giá trị hợp lệ: Male, Female");
        }

        if (color != null && color.length() > 255) {
            throw new IllegalArgumentException("Màu sắc tối đa 255 ký tự");
        }

        if (description != null && description.length() > 255) {
            throw new IllegalArgumentException("Mô tả trang phục tối đa 255 ký tự");
        }

        if (price != null && price < 0) {
            throw new IllegalArgumentException("Giá thuê trang phục không được âm");
        }

        if (status != null && !status.isBlank() && !VALID_STATUSES.contains(status.trim().toLowerCase())) {
            throw new IllegalArgumentException(
                    "Trạng thái trang phục không hợp lệ. Các trạng thái hợp lệ: available, rented, maintenance, damaged, retired");
        }
    }
}
