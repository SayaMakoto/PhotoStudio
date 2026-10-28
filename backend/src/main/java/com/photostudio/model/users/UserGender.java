package com.photostudio.model.users;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserGender {
    Male, Female;

    @JsonCreator
    public static UserGender fromString(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String clean = value.trim();
        if (clean.equalsIgnoreCase("male") || clean.equalsIgnoreCase("nam")) {
            return Male;
        }
        if (clean.equalsIgnoreCase("female") || clean.equalsIgnoreCase("nu") || clean.equalsIgnoreCase("nữ")) {
            return Female;
        }
        return null;
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
