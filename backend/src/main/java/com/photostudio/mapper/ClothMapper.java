package com.photostudio.mapper;

import com.photostudio.dto.clothes.ClothRequest;
import com.photostudio.dto.clothes.ClothResponse;
import com.photostudio.model.clothes.Cloth;
import com.photostudio.model.clothes.ClothStatus;
import com.photostudio.model.clothes.ClothType;
import com.photostudio.model.users.UserGender;

public class ClothMapper {

    // Chấp nhận "male", "MALE", "Male"... và quy về enum Male/Female
    private static UserGender parseGender(String gender) {
        if (gender == null || gender.isBlank()) {
            return null;
        }
        return "male".equals(gender.trim().toLowerCase()) ? UserGender.Male : UserGender.Female;
    }

    public static Cloth toEntity(ClothRequest request) {
        Cloth cloth = new Cloth();
        cloth.setType(ClothType.valueOf(request.getType().trim().toLowerCase()));
        cloth.setName(request.getName().trim());
        cloth.setSize(request.getSize());
        cloth.setGender(parseGender(request.getGender()));
        cloth.setColor(request.getColor());
        cloth.setDescription(request.getDescription());
        cloth.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            cloth.setStatus(ClothStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            cloth.setStatus(ClothStatus.available);
        }

        return cloth;
    }

    public static void updateEntity(ClothRequest request, Cloth cloth) {
        cloth.setType(ClothType.valueOf(request.getType().trim().toLowerCase()));
        cloth.setName(request.getName().trim());
        cloth.setSize(request.getSize());
        cloth.setGender(parseGender(request.getGender()));
        cloth.setColor(request.getColor());
        cloth.setDescription(request.getDescription());
        if (request.getPrice() != null) {
            cloth.setPrice(request.getPrice());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            cloth.setStatus(ClothStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static ClothResponse toResponse(Cloth cloth) {
        return new ClothResponse(
                cloth.getId(),
                cloth.getType() != null ? cloth.getType().name() : null,
                cloth.getName(),
                cloth.getSize(),
                cloth.getGender() != null ? cloth.getGender().name() : null,
                cloth.getColor(),
                cloth.getDescription(),
                cloth.getPrice(),
                cloth.getStatus() != null ? cloth.getStatus().name() : null
        );
    }
}
