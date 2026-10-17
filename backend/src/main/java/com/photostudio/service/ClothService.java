package com.photostudio.service;

import com.photostudio.dto.clothes.ClothRequest;
import com.photostudio.dto.clothes.ClothResponse;

import java.util.List;

public interface ClothService {

    List<ClothResponse> findAll();

    ClothResponse findById(Long id);

    ClothResponse create(ClothRequest request);

    ClothResponse update(Long id, ClothRequest request);

    void delete(Long id);

    List<ClothResponse> findByName(String name);

    List<ClothResponse> findByType(String type);

    List<ClothResponse> findByStatus(String status);
}
