package com.photostudio.model.images;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ImageableTypeConverter implements AttributeConverter<ImageableType, String> {

    @Override
    public String convertToDatabaseColumn(ImageableType attribute) {
        return attribute != null ? attribute.getValue() : null;
    }

    @Override
    public ImageableType convertToEntityAttribute(String dbData) {
        return dbData != null ? ImageableType.fromValue(dbData) : null;
    }
}
