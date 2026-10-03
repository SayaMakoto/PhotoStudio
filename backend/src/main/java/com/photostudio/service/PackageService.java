package com.photostudio.service;

import com.photostudio.dto.PackageRequest;
import com.photostudio.dto.PackageResponse;

import java.util.List;

public interface PackageService {

    List<PackageResponse> findAll();

    PackageResponse findById(Long id);

    PackageResponse create(PackageRequest request);

    PackageResponse update(Long id, PackageRequest request);

    void delete(Long id);

    List<PackageResponse> findByName(String name);
}
