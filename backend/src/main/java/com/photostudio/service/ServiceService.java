package com.photostudio.service;

import com.photostudio.dto.services.ServiceRequest;
import com.photostudio.dto.services.ServiceResponse;

import java.util.List;

public interface ServiceService {

    List<ServiceResponse> findAll();

    ServiceResponse findById(Long id);

    ServiceResponse create(ServiceRequest request);

    ServiceResponse update(Long id, ServiceRequest request);

    void delete(Long id);

    List<ServiceResponse> findByName(String name);

    List<ServiceResponse> findByType(String type);

    List<ServiceResponse> findByStatus(String status);

    List<ServiceResponse> findTrash();

    ServiceResponse restore(Long id);

    void permanentlyDelete(Long id);
}
