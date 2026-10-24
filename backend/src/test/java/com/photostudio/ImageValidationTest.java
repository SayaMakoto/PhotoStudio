package com.photostudio;

import com.photostudio.dto.images.ImageRequest;
import com.photostudio.dto.images.ImageResponse;
import com.photostudio.model.images.Image;
import com.photostudio.model.images.ImageableType;
import com.photostudio.repository.ImageRepository;
import com.photostudio.service.impl.ImageServiceImpl;
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
class ImageValidationTest {

    @Mock
    private ImageRepository imageRepository;

    @InjectMocks
    private ImageServiceImpl imageService;

    private ImageRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new ImageRequest();
        validRequest.setImageableType("package");
        validRequest.setImageableId(3L);
        validRequest.setImageUrl("/uploads/packages/goi-cuoi-1.jpg");
        validRequest.setDescription("Ảnh gói chụp cưới");
        validRequest.setIsPrimary(false);
    }

    private Image buildImage(Long id, ImageableType type, Long imageableId, boolean primary) {
        Image image = new Image();
        image.setId(id);
        image.setImageableType(type);
        image.setImageableId(imageableId);
        image.setImageUrl("/uploads/x.jpg");
        image.setIsPrimary(primary);
        return image;
    }

    @Test
    @DisplayName("Tạo hình ảnh thành công khi dữ liệu hợp lệ")
    void testCreateImage_Success() {
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> {
            Image image = invocation.getArgument(0);
            image.setId(100L);
            return image;
        });

        ImageResponse response = imageService.create(validRequest);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("package", response.getImageableType());
        assertEquals(3L, response.getImageableId());
        assertEquals("/uploads/packages/goi-cuoi-1.jpg", response.getImageUrl());
        assertFalse(response.getIsPrimary());
        verify(imageRepository, times(1)).save(any(Image.class));
        verify(imageRepository, never()).findPrimaryImages(any(), any(), any());
    }

    @Test
    @DisplayName("isPrimary mặc định là false khi không truyền")
    void testCreateImage_DefaultIsPrimaryFalse() {
        validRequest.setIsPrimary(null);
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ImageResponse response = imageService.create(validRequest);

        assertFalse(response.getIsPrimary());
    }

    @Test
    @DisplayName("Tạo ảnh đại diện mới sẽ bỏ cờ primary của ảnh đại diện cũ")
    void testCreateImage_PrimaryClearsOthers() {
        validRequest.setIsPrimary(true);
        Image oldPrimary = buildImage(7L, ImageableType.PACKAGE, 3L, true);

        when(imageRepository.findPrimaryImages(eq(ImageableType.PACKAGE), eq(3L), isNull()))
                .thenReturn(List.of(oldPrimary));
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ImageResponse response = imageService.create(validRequest);

        assertTrue(response.getIsPrimary());
        assertFalse(oldPrimary.getIsPrimary());
        verify(imageRepository, times(1)).saveAll(List.of(oldPrimary));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu loại đối tượng gắn ảnh")
    void testCreateImage_MissingType_ThrowsException() {
        validRequest.setImageableType(null);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Loại đối tượng gắn ảnh (imageableType) không được để trống"));
        verify(imageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi loại đối tượng gắn ảnh không hợp lệ")
    void testCreateImage_InvalidType_ThrowsException() {
        validRequest.setImageableType("room");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Loại đối tượng gắn ảnh không hợp lệ"));
        verify(imageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi imageableId thiếu hoặc không hợp lệ")
    void testCreateImage_InvalidImageableId_ThrowsException() {
        validRequest.setImageableId(null);
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Mã đối tượng gắn ảnh (imageableId) không hợp lệ"));

        validRequest.setImageableId(0L);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Mã đối tượng gắn ảnh (imageableId) không hợp lệ"));

        verify(imageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu đường dẫn ảnh hoặc vượt quá 255 ký tự")
    void testCreateImage_InvalidImageUrl_ThrowsException() {
        validRequest.setImageUrl("  ");
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Đường dẫn ảnh (imageUrl) không được để trống"));

        validRequest.setImageUrl("a".repeat(256));
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Đường dẫn ảnh tối đa 255 ký tự"));

        verify(imageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi mô tả vượt quá 255 ký tự")
    void testCreateImage_DescriptionTooLong_ThrowsException() {
        validRequest.setDescription("a".repeat(256));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Mô tả hình ảnh tối đa 255 ký tự"));
        verify(imageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật hình ảnh thành công")
    void testUpdateImage_Success() {
        Image existing = buildImage(10L, ImageableType.SERVICE, 1L, false);

        when(imageRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ImageResponse response = imageService.update(10L, validRequest);

        assertEquals("package", response.getImageableType());
        assertEquals(3L, response.getImageableId());
        assertEquals("/uploads/packages/goi-cuoi-1.jpg", response.getImageUrl());
        verify(imageRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật hình ảnh không tồn tại")
    void testUpdateImage_NotFound_ThrowsException() {
        when(imageRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.update(99L, validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy hình ảnh có id: 99"));
        verify(imageRepository, never()).save(any());
    }

    @Test
    @DisplayName("Đặt ảnh làm đại diện và bỏ cờ primary của ảnh khác")
    void testSetPrimary_Success() {
        Image target = buildImage(5L, ImageableType.PACKAGE, 3L, false);
        Image oldPrimary = buildImage(7L, ImageableType.PACKAGE, 3L, true);

        when(imageRepository.findById(5L)).thenReturn(Optional.of(target));
        when(imageRepository.findPrimaryImages(eq(ImageableType.PACKAGE), eq(3L), eq(5L)))
                .thenReturn(List.of(oldPrimary));
        when(imageRepository.save(any(Image.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ImageResponse response = imageService.setPrimary(5L);

        assertTrue(response.getIsPrimary());
        assertFalse(oldPrimary.getIsPrimary());
        verify(imageRepository, times(1)).save(target);
    }

    @Test
    @DisplayName("Lấy ảnh đại diện: ném ngoại lệ khi đối tượng chưa có ảnh đại diện")
    void testFindPrimary_NotFound_ThrowsException() {
        when(imageRepository.findPrimaryImages(eq(ImageableType.PACKAGE), eq(3L), isNull()))
                .thenReturn(List.of());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.findPrimary("package", 3L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy ảnh đại diện"));
    }

    @Test
    @DisplayName("Tìm ảnh theo đối tượng: ném ngoại lệ khi tham số không hợp lệ")
    void testFindByImageable_InvalidParams_ThrowsException() {
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.findByImageable(null, 3L)
        );
        assertTrue(ex1.getMessage().contains("Loại đối tượng gắn ảnh không được để trống"));

        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.findByImageable("package", -1L)
        );
        assertTrue(ex2.getMessage().contains("Mã đối tượng gắn ảnh không hợp lệ"));

        IllegalArgumentException ex3 = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.findByImageable("room", 3L)
        );
        assertTrue(ex3.getMessage().contains("Loại đối tượng gắn ảnh không hợp lệ"));

        verify(imageRepository, never()).findByImageable(any(), any());
    }

    @Test
    @DisplayName("Xóa hình ảnh không tồn tại ném ngoại lệ")
    void testDeleteImage_NotFound_ThrowsException() {
        when(imageRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> imageService.delete(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy hình ảnh có id: 99"));
        verify(imageRepository, never()).delete(any());
    }
}
