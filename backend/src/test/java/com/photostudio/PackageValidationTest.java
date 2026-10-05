package com.photostudio;

import com.photostudio.dto.packages.PackageEquipmentItemRequest;
import com.photostudio.dto.packages.PackageRequest;
import com.photostudio.dto.packages.PackageResponse;
import com.photostudio.model.packages.Package;
import com.photostudio.repository.PackageRepository;
import com.photostudio.service.impl.PackageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PackageValidationTest {

    @Mock
    private PackageRepository packageRepository;

    @InjectMocks
    private PackageServiceImpl packageService;

    private PackageRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new PackageRequest();
        validRequest.setName("Gói Chụp Nàng Thơ");
        validRequest.setDescription("Gói chụp cá nhân ngoài trời hoặc studio");
        validRequest.setDuration(60);
        validRequest.setPrice(1200000.0);
        validRequest.setStatus("active");
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thêm package với equipment_type không tồn tại (vd: 'drone')")
    void testCreatePackage_WithInvalidEquipmentType_ThrowsException() {
        PackageEquipmentItemRequest invalidEquipment = new PackageEquipmentItemRequest("drone", 1);
        validRequest.setEquipments(List.of(invalidEquipment));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> packageService.create(validRequest)
        );

        assertTrue(exception.getMessage().contains("Loại thiết bị 'drone' không tồn tại"));
        assertTrue(exception.getMessage().contains("camera, lens, lighting, tripod, other"));
        verify(packageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thêm package với equipment_type bị bỏ trống")
    void testCreatePackage_WithBlankEquipmentType_ThrowsException() {
        PackageEquipmentItemRequest emptyTypeEquipment = new PackageEquipmentItemRequest("", 1);
        validRequest.setEquipments(List.of(emptyTypeEquipment));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> packageService.create(validRequest)
        );

        assertEquals("Loại thiết bị không được để trống", exception.getMessage());
        verify(packageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Thêm package thành công khi tất cả equipment_type đều hợp lệ (camera, lighting)")
    void testCreatePackage_WithValidEquipmentTypes_Success() {
        PackageEquipmentItemRequest eq1 = new PackageEquipmentItemRequest("camera", 1);
        PackageEquipmentItemRequest eq2 = new PackageEquipmentItemRequest("lighting", 2);
        validRequest.setEquipments(List.of(eq1, eq2));

        when(packageRepository.save(any(Package.class))).thenAnswer(invocation -> {
            Package saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        PackageResponse response = packageService.create(validRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Gói Chụp Nàng Thơ", response.getName());
        assertEquals(2, response.getEquipments().size());
        assertEquals("camera", response.getEquipments().get(0).getEquipmentType());
        assertEquals("lighting", response.getEquipments().get(1).getEquipmentType());
        verify(packageRepository, times(1)).save(any(Package.class));
    }
}
