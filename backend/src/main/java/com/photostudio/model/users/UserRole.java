package com.photostudio.model.users;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {
    Customer, Employee, Admin, USER, ADMIN;

    @JsonCreator
    public static UserRole fromString(String value) {
        if (value == null || value.isBlank()) {
            return Customer;
        }
        for (UserRole role : UserRole.values()) {
            if (role.name().equalsIgnoreCase(value.trim())) {
                return role;
            }
        }
        return Customer;
    }
}
