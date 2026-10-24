package com.photostudio.service;

import com.photostudio.dto.packages.PackageServiceRequest;
import com.photostudio.dto.packages.PackageServiceResponse;
import java.util.List;

public interface PackageServiceItemService {
    List<PackageServiceResponse> getServicesByPackageId(Long packageId);
    PackageServiceResponse getById(Long id);
    PackageServiceResponse addServiceToPackage(PackageServiceRequest request);
    PackageServiceResponse updatePackageService(Long id, PackageServiceRequest request);
    void removeServiceFromPackage(Long id);
}
