package com.photostudio;

import com.photostudio.dto.banners.BannerRequest;
import com.photostudio.dto.banners.BannerResponse;
import com.photostudio.model.banners.Banner;
import com.photostudio.model.banners.BannerStatus;
import com.photostudio.repository.BannerRepository;
import com.photostudio.service.impl.BannerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BannerValidationTest {

    @Mock
    private BannerRepository bannerRepository;

    @InjectMocks
    private BannerServiceImpl bannerService;

    private BannerRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new BannerRequest();
        validRequest.setTitle("Ưu đãi chụp ảnh cưới mùa thu");
        validRequest.setImageUrl("/uploads/banners/uu-dai-thu.jpg");
        validRequest.setLink("/packages/wedding");
        validRequest.setStatus("active");
    }

    @Test
    @DisplayName("Tạo banner thành công khi dữ liệu hợp lệ")
    void testCreateBanner_Success() {
        when(bannerRepository.save(any(Banner.class))).thenAnswer(invocation -> {
            Banner banner = invocation.getArgument(0);
            banner.setId(100L);
            return banner;
        });

        BannerResponse response = bannerService.create(validRequest);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Ưu đãi chụp ảnh cưới mùa thu", response.getTitle());
        assertEquals("/uploads/banners/uu-dai-thu.jpg", response.getImageUrl());
        assertEquals("/packages/wedding", response.getLink());
        assertEquals("active", response.getStatus());
        verify(bannerRepository, times(1)).save(any(Banner.class));
    }

    @Test
    @DisplayName("Trạng thái mặc định là active và link rỗng được lưu null")
    void testCreateBanner_DefaultStatusAndEmptyLink() {
        validRequest.setStatus(null);
        validRequest.setLink("   ");
        when(bannerRepository.save(any(Banner.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BannerResponse response = bannerService.create(validRequest);

        assertEquals("active", response.getStatus());
        assertNull(response.getLink());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu tiêu đề")
    void testCreateBanner_MissingTitle_ThrowsException() {
        validRequest.setTitle("  ");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Tiêu đề banner (title) không được để trống"));
        verify(bannerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu đường dẫn ảnh")
    void testCreateBanner_MissingImageUrl_ThrowsException() {
        validRequest.setImageUrl(null);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Đường dẫn ảnh banner (imageUrl) không được để trống"));
        verify(bannerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi các trường vượt quá 255 ký tự")
    void testCreateBanner_TooLongFields_ThrowsException() {
        validRequest.setTitle("a".repeat(256));
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Tiêu đề banner tối đa 255 ký tự"));

        validRequest.setTitle("Tiêu đề hợp lệ");
        validRequest.setLink("a".repeat(256));
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Đường dẫn liên kết (link) tối đa 255 ký tự"));

        verify(bannerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trạng thái không hợp lệ")
    void testCreateBanner_InvalidStatus_ThrowsException() {
        validRequest.setStatus("hidden");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Trạng thái banner không hợp lệ"));
        verify(bannerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật banner thành công")
    void testUpdateBanner_Success() {
        Banner existing = new Banner();
        existing.setId(10L);
        existing.setTitle("Banner cũ");
        existing.setImageUrl("/old.jpg");
        existing.setStatus(BannerStatus.active);

        when(bannerRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(bannerRepository.save(any(Banner.class))).thenAnswer(invocation -> invocation.getArgument(0));

        validRequest.setStatus("inactive");
        BannerResponse response = bannerService.update(10L, validRequest);

        assertEquals("Ưu đãi chụp ảnh cưới mùa thu", response.getTitle());
        assertEquals("inactive", response.getStatus());
        verify(bannerRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật banner không tồn tại")
    void testUpdateBanner_NotFound_ThrowsException() {
        when(bannerRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.update(99L, validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy banner có id: 99"));
        verify(bannerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật trạng thái thành công (active -> inactive)")
    void testUpdateStatus_Success() {
        Banner existing = new Banner();
        existing.setId(50L);
        existing.setTitle("Banner");
        existing.setImageUrl("/b.jpg");
        existing.setStatus(BannerStatus.active);

        when(bannerRepository.findById(50L)).thenReturn(Optional.of(existing));
        when(bannerRepository.save(any(Banner.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BannerResponse response = bannerService.updateStatus(50L, "inactive");

        assertEquals("inactive", response.getStatus());
        verify(bannerRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật trạng thái rỗng hoặc không hợp lệ")
    void testUpdateStatus_InvalidStatus_ThrowsException() {
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.updateStatus(50L, null)
        );
        assertTrue(ex1.getMessage().contains("Trạng thái không được để trống"));

        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.updateStatus(50L, "deleted")
        );
        assertTrue(ex2.getMessage().contains("Trạng thái banner không hợp lệ"));

        verify(bannerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xóa banner không tồn tại ném ngoại lệ")
    void testDeleteBanner_NotFound_ThrowsException() {
        when(bannerRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> bannerService.delete(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy banner có id: 99"));
        verify(bannerRepository, never()).delete(any());
    }
}
