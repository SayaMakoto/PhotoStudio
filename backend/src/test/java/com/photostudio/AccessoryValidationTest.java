package com.photostudio;

import com.photostudio.model.accessories.Accessory;
import com.photostudio.model.accessories.AccessoryStatus;
import com.photostudio.model.accessories.AccessoryType;
import com.photostudio.repository.AccessoryRepository;
import com.photostudio.service.impl.AccessoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccessoryServiceTest {

    @Mock
    private AccessoryRepository accessoryRepository;

    @InjectMocks
    private AccessoryServiceImpl accessoryService;

    private Accessory validAccessory;

    @BeforeEach
    void setUp() {
        validAccessory = new Accessory();
        validAccessory.setId(1L);
        validAccessory.setType(AccessoryType.fashion);
        validAccessory.setName("Váy cưới công chúa");
        validAccessory.setDescription("Váy ren trắng cao cấp");
        validAccessory.setQuantity(5);
        validAccessory.setPrice(500.0);
        validAccessory.setStatus(AccessoryStatus.available);
    }

    @Test
    @DisplayName("Tạo phụ kiện thành công khi dữ liệu hợp lệ")
    void testCreateAccessory_Success() {
        when(accessoryRepository.save(any(Accessory.class))).thenAnswer(invocation -> {
            Accessory accessory = invocation.getArgument(0);
            accessory.setId(10L);
            return accessory;
        });

        Accessory result = accessoryService.createAccessory(validAccessory);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Váy cưới công chúa", result.getName());
        assertEquals(AccessoryType.fashion, result.getType());
        assertEquals(5, result.getQuantity());
        assertEquals(500.0, result.getPrice());
        assertEquals(AccessoryStatus.available, result.getStatus());
        verify(accessoryRepository, times(1)).save(any(Accessory.class));
    }

    @Test
    @DisplayName("Tự động gán giá trị mặc định (available, quantity=0, price=0.0) khi tạo phụ kiện thiếu thông tin")
    void testCreateAccessory_DefaultValuesAssigned() {
        Accessory incompleteAccessory = new Accessory();
        incompleteAccessory.setName("Đèn flash studio");
        incompleteAccessory.setType(AccessoryType.vintage);
        // Không truyền status, quantity, price

        when(accessoryRepository.save(any(Accessory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Accessory result = accessoryService.createAccessory(incompleteAccessory);

        assertNotNull(result);
        assertEquals(AccessoryStatus.available, result.getStatus());
        assertEquals(0, result.getQuantity());
        assertEquals(0.0, result.getPrice());
        verify(accessoryRepository, times(1)).save(any(Accessory.class));
    }

    @Test
    @DisplayName("Cập nhật phụ kiện thành công khi tìm thấy ID tồn tại")
    void testUpdateAccessory_Success() {
        Accessory detailsToUpdate = new Accessory();
        detailsToUpdate.setType(AccessoryType.concept);
        detailsToUpdate.setName("Đèn LED đổi màu");
        detailsToUpdate.setDescription("Phiên bản mới 2026");
        detailsToUpdate.setQuantity(8);
        detailsToUpdate.setPrice(750.0);
        detailsToUpdate.setStatus(AccessoryStatus.maintenance);

        when(accessoryRepository.findById(1L)).thenReturn(Optional.of(validAccessory));
        when(accessoryRepository.save(any(Accessory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Accessory updated = accessoryService.updateAccessory(1L, detailsToUpdate);

        assertNotNull(updated);
        assertEquals(AccessoryType.concept, updated.getType());
        assertEquals("Đèn LED đổi màu", updated.getName());
        assertEquals(8, updated.getQuantity());
        assertEquals(750.0, updated.getPrice());
        assertEquals(AccessoryStatus.maintenance, updated.getStatus());
        verify(accessoryRepository, times(1)).findById(1L);
        verify(accessoryRepository, times(1)).save(validAccessory);
    }

    @Test
    @DisplayName("Ném ngoại lệ RuntimeException khi cập nhật phụ kiện không tồn tại ID")
    void testUpdateAccessory_NotFound_ThrowsException() {
        when(accessoryRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> accessoryService.updateAccessory(99L, validAccessory)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy phụ kiện với ID: 99"));
        verify(accessoryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xóa phụ kiện thành công khi ID tồn tại")
    void testDeleteAccessory_Success() {
        when(accessoryRepository.existsById(1L)).thenReturn(true);
        doNothing().when(accessoryRepository).deleteById(1L);

        assertDoesNotThrow(() -> accessoryService.deleteAccessory(1L));
        verify(accessoryRepository, times(1)).existsById(1L);
        verify(accessoryRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Ném ngoại lệ RuntimeException khi xóa phụ kiện không tồn tại ID")
    void testDeleteAccessory_NotFound_ThrowsException() {
        when(accessoryRepository.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(
                RuntimeException.class,
                () -> accessoryService.deleteAccessory(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy phụ kiện với ID: 99"));
        verify(accessoryRepository, never()).deleteById(anyLong());
    }

    @Test
    @DisplayName("Tìm kiếm phụ kiện theo tên trả về danh sách chính xác")
    void testSearchAccessoriesByName() {
        List<Accessory> mockList = List.of(validAccessory);
        when(accessoryRepository.findByNameContainingIgnoreCase("Váy")).thenReturn(mockList);

        List<Accessory> result = accessoryService.searchAccessoriesByName("Váy");

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Váy cưới công chúa", result.get(0).getName());
        verify(accessoryRepository, times(1)).findByNameContainingIgnoreCase("Váy");
    }
}