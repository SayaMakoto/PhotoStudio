package com.photostudio.service;

import com.photostudio.dto.packages.PackageBackgroundRequest;
import com.photostudio.dto.packages.PackageBackgroundResponse;

import java.util.List;

public interface PackageBackgroundService {

    List<PackageBackgroundResponse> getBackgroundsByPackageId(Long packageId);

    PackageBackgroundResponse getById(Long id);

    PackageBackgroundResponse addBackgroundToPackage(PackageBackgroundRequest request);

    PackageBackgroundResponse updatePackageBackground(Long id, PackageBackgroundRequest request);

    void removeBackgroundFromPackage(Long id);
}
