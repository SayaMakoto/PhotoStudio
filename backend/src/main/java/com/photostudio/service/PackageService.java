package com.photostudio.service;

import com.photostudio.dto.packages.PackageRequest;
import com.photostudio.dto.packages.PackageResponse;
import java.util.List;

public interface PackageService {

    List<PackageResponse> findAll();

    PackageResponse findById(Long id);

    PackageResponse create(PackageRequest request);

    PackageResponse update(Long id, PackageRequest request);

    void delete(Long id);

    List<PackageResponse> findByName(String name);

    List<PackageResponse> findByStatus(String status);

    List<PackageResponse> findTrash();

    PackageResponse restore(Long id);

    void permanentlyDelete(Long id);
}
