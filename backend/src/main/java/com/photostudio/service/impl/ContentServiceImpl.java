package com.photostudio.service.impl;

import com.photostudio.dto.contents.ContentRequest;
import com.photostudio.dto.contents.ContentResponse;
import com.photostudio.mapper.ContentMapper;
import com.photostudio.model.contents.Content;
import com.photostudio.model.contents.ContentStatus;
import com.photostudio.model.contents.ContentType;
import com.photostudio.repository.ContentRepository;
import com.photostudio.service.ContentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContentServiceImpl implements ContentService {

    private final ContentRepository repository;

    public ContentServiceImpl(ContentRepository repository) {
        this.repository = repository;
    }

    private Content findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nội dung có id: " + id));
    }

    private void checkSlugConflict(String slug, Long excludeId) {
        boolean hasConflict = repository.existsSlugConflict(slug, excludeId);

        if (hasConflict) {
            throw new IllegalArgumentException("Slug '" + slug + "' đã tồn tại");
        }
    }

    private ContentStatus parseStatus(String status) {
        try {
            return ContentStatus.valueOf(status.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Trạng thái nội dung không hợp lệ. Hợp lệ: draft, published, hidden");
        }
    }

    private ContentType parseType(String type) {
        try {
            return ContentType.valueOf(type.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Loại nội dung không hợp lệ. Hợp lệ: page, post");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(ContentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ContentResponse findById(Long id) {
        return ContentMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public ContentResponse findBySlug(String slug) {
        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException("Slug không được để trống");
        }
        Content content = repository.findBySlug(slug.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nội dung có slug: " + slug));
        return ContentMapper.toResponse(content);
    }

    @Override
    public ContentResponse create(ContentRequest request) {
        request.validate();

        checkSlugConflict(request.getSlug().trim().toLowerCase(), null);

        Content content = ContentMapper.toEntity(request);
        Content saved = repository.save(content);
        return ContentMapper.toResponse(saved);
    }

    @Override
    public ContentResponse update(Long id, ContentRequest request) {
        request.validate();

        Content content = findEntity(id);

        checkSlugConflict(request.getSlug().trim().toLowerCase(), id);

        ContentMapper.updateEntity(request, content);
        Content saved = repository.save(content);
        return ContentMapper.toResponse(saved);
    }

    @Override
    public ContentResponse updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        ContentStatus contentStatus = parseStatus(status);

        Content content = findEntity(id);
        content.setStatus(contentStatus);
        Content saved = repository.save(content);
        return ContentMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        Content content = findEntity(id);
        repository.delete(content);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponse> findByType(String type) {
        if (type == null || type.isBlank()) {
            throw new IllegalArgumentException("Loại nội dung tìm kiếm không được để trống");
        }
        return repository.findByType(parseType(type))
                .stream()
                .map(ContentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponse> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Trạng thái tìm kiếm không được để trống");
        }
        return repository.findByStatus(parseStatus(status))
                .stream()
                .map(ContentMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContentResponse> search(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            throw new IllegalArgumentException("Từ khóa tìm kiếm không được để trống");
        }
        return repository.searchByTitle(keyword.trim())
                .stream()
                .map(ContentMapper::toResponse)
                .toList();
    }
}
