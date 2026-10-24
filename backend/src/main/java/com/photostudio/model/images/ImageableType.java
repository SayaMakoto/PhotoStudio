package com.photostudio.model.images;

/**
 * Loại đối tượng được gắn ảnh. Giá trị lưu trong DB (cột imageable_type) là chữ thường.
 * Lưu ý: "package" là từ khóa của Java nên không thể đặt tên hằng số là package,
 * vì vậy enum dùng trường value để ánh xạ giá trị DB <-> hằng số (xem ImageableTypeConverter).
 */
public enum ImageableType {
    BACKGROUND("background"),
    EQUIPMENT("equipment"),
    CLOTHING("clothing"),
    ACCESSORY("accessory"),
    PACKAGE("package"),
    SERVICE("service");

    private final String value;

    ImageableType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ImageableType fromValue(String value) {
        if (value != null) {
            String normalized = value.trim().toLowerCase();
            for (ImageableType type : values()) {
                if (type.value.equals(normalized)) {
                    return type;
                }
            }
        }
        throw new IllegalArgumentException(
                "Loại đối tượng gắn ảnh không hợp lệ. Hợp lệ: background, equipment, clothing, accessory, package, service");
    }
}
