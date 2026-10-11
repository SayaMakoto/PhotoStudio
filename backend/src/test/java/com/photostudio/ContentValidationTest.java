package com.photostudio;

import com.photostudio.dto.contents.ContentRequest;
import com.photostudio.dto.contents.ContentResponse;
import com.photostudio.model.contents.Content;
import com.photostudio.model.contents.ContentStatus;
import com.photostudio.model.contents.ContentType;
import com.photostudio.repository.ContentRepository;
import com.photostudio.service.impl.ContentServiceImpl;
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
class ContentValidationTest {

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private ContentServiceImpl contentService;

    private ContentRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new ContentRequest();
        validRequest.setType("post");
        validRequest.setTitle("Top 5 concept chụp ảnh cưới đẹp nhất 2026");
        validRequest.setSlug("top-5-concept-chup-anh-cuoi-2026");
        validRequest.setContent("Nội dung chi tiết bài viết...");
        validRequest.setImageUrl("/uploads/contents/concept-cuoi.jpg");
        validRequest.setStatus("published");
    }

    @Test
    @DisplayName("Tạo nội dung thành công khi dữ liệu hợp lệ và slug chưa tồn tại")
    void testCreateContent_Success() {
        when(contentRepository.existsSlugConflict(eq("top-5-concept-chup-anh-cuoi-2026"), isNull()))
                .thenReturn(false);
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> {
            Content content = invocation.getArgument(0);
            content.setId(100L);
            return content;
        });

        ContentResponse response = contentService.create(validRequest);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("post", response.getType());
        assertEquals("Top 5 concept chụp ảnh cưới đẹp nhất 2026", response.getTitle());
        assertEquals("top-5-concept-chup-anh-cuoi-2026", response.getSlug());
        assertEquals("published", response.getStatus());
        verify(contentRepository, times(1)).save(any(Content.class));
    }

    @Test
    @DisplayName("Trạng thái mặc định là draft khi không truyền status")
    void testCreateContent_DefaultStatusDraft() {
        validRequest.setStatus(null);
        when(contentRepository.existsSlugConflict(anyString(), isNull())).thenReturn(false);
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContentResponse response = contentService.create(validRequest);

        assertEquals("draft", response.getStatus());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu loại nội dung (type)")
    void testCreateContent_MissingType_ThrowsException() {
        validRequest.setType(null);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Loại nội dung (type) không được để trống"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi loại nội dung không hợp lệ")
    void testCreateContent_InvalidType_ThrowsException() {
        validRequest.setType("video");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Loại nội dung không hợp lệ"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi thiếu tiêu đề hoặc slug")
    void testCreateContent_MissingTitleOrSlug_ThrowsException() {
        validRequest.setTitle("  ");
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Tiêu đề (title) không được để trống"));

        validRequest.setTitle("Tiêu đề hợp lệ");
        validRequest.setSlug(null);
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Đường dẫn thân thiện (slug) không được để trống"));

        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi slug sai định dạng")
    void testCreateContent_InvalidSlugFormat_ThrowsException() {
        validRequest.setSlug("Bài Viết Mới!");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Slug không hợp lệ"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trạng thái không hợp lệ")
    void testCreateContent_InvalidStatus_ThrowsException() {
        validRequest.setStatus("archived");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("Trạng thái nội dung không hợp lệ"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi tiêu đề hoặc đường dẫn ảnh vượt quá 255 ký tự")
    void testCreateContent_TooLongFields_ThrowsException() {
        validRequest.setTitle("a".repeat(256));
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );
        assertTrue(ex1.getMessage().contains("Tiêu đề tối đa 255 ký tự"));

        validRequest.setTitle("Tiêu đề hợp lệ");
        validRequest.setImageUrl("a".repeat(256));
        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );
        assertTrue(ex2.getMessage().contains("Đường dẫn ảnh đại diện tối đa 255 ký tự"));

        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trùng slug")
    void testCreateContent_SlugConflict_ThrowsException() {
        when(contentRepository.existsSlugConflict(eq("top-5-concept-chup-anh-cuoi-2026"), isNull()))
                .thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.create(validRequest)
        );

        assertTrue(ex.getMessage().contains("đã tồn tại"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật nội dung thành công")
    void testUpdateContent_Success() {
        Content existing = new Content();
        existing.setId(10L);
        existing.setType(ContentType.page);
        existing.setTitle("Giới thiệu");
        existing.setSlug("gioi-thieu");
        existing.setStatus(ContentStatus.draft);

        ContentRequest updateRequest = new ContentRequest();
        updateRequest.setType("page");
        updateRequest.setTitle("Giới thiệu Studio");
        updateRequest.setSlug("gioi-thieu-studio");
        updateRequest.setContent("Nội dung mới");
        updateRequest.setStatus("published");

        when(contentRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(contentRepository.existsSlugConflict(eq("gioi-thieu-studio"), eq(10L))).thenReturn(false);
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContentResponse response = contentService.update(10L, updateRequest);

        assertEquals("Giới thiệu Studio", response.getTitle());
        assertEquals("gioi-thieu-studio", response.getSlug());
        assertEquals("published", response.getStatus());
        verify(contentRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật nội dung không tồn tại")
    void testUpdateContent_NotFound_ThrowsException() {
        when(contentRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.update(99L, validRequest)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy nội dung có id: 99"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật trùng slug của nội dung khác")
    void testUpdateContent_SlugConflict_ThrowsException() {
        Content existing = new Content();
        existing.setId(10L);

        when(contentRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(contentRepository.existsSlugConflict(eq("top-5-concept-chup-anh-cuoi-2026"), eq(10L)))
                .thenReturn(true);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.update(10L, validRequest)
        );

        assertTrue(ex.getMessage().contains("đã tồn tại"));
        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Cập nhật trạng thái thành công (draft -> published)")
    void testUpdateStatus_Success() {
        Content existing = new Content();
        existing.setId(50L);
        existing.setType(ContentType.post);
        existing.setTitle("Bài viết");
        existing.setSlug("bai-viet");
        existing.setStatus(ContentStatus.draft);

        when(contentRepository.findById(50L)).thenReturn(Optional.of(existing));
        when(contentRepository.save(any(Content.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ContentResponse response = contentService.updateStatus(50L, "published");

        assertEquals("published", response.getStatus());
        verify(contentRepository, times(1)).save(existing);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật trạng thái rỗng hoặc không hợp lệ")
    void testUpdateStatus_InvalidStatus_ThrowsException() {
        IllegalArgumentException ex1 = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.updateStatus(50L, null)
        );
        assertTrue(ex1.getMessage().contains("không được để trống"));

        IllegalArgumentException ex2 = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.updateStatus(50L, "deleted")
        );
        assertTrue(ex2.getMessage().contains("Trạng thái nội dung không hợp lệ"));

        verify(contentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xóa nội dung không tồn tại ném ngoại lệ")
    void testDeleteContent_NotFound_ThrowsException() {
        when(contentRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> contentService.delete(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy nội dung có id: 99"));
        verify(contentRepository, never()).delete(any());
    }
}
