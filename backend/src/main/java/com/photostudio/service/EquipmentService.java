
package com.photostudio.service;

import com.photostudio.dto.equipment.EquipmentRequest;
import com.photostudio.dto.equipment.EquipmentResponse;

import java.util.List;

public interface EquipmentService {

    List<EquipmentResponse> findAll();

    List<EquipmentResponse> findTrash();

    EquipmentResponse findById(Long id);

    List<EquipmentResponse> findByName(String name);

    List<EquipmentResponse> findByType(String type);

    EquipmentResponse create(EquipmentRequest request);

    EquipmentResponse update(Long id, EquipmentRequest request);

    void delete(Long id);

    EquipmentResponse restore(Long id);

    void permanentlyDelete(Long id);
}
