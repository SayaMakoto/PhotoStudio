package com.photostudio.service;

import java.util.List;

import com.photostudio.dto.contents.ContentRequest;
import com.photostudio.dto.contents.ContentResponse;

public interface ContentService {

    List<ContentResponse> findAll();

    ContentResponse findById(Long id);

    ContentResponse findBySlug(String slug);

    ContentResponse create(ContentRequest request);

    ContentResponse update(Long id, ContentRequest request);

    ContentResponse updateStatus(Long id, String status);

    void delete(Long id);

    List<ContentResponse> findByType(String type);

    List<ContentResponse> findByStatus(String status);

    List<ContentResponse> search(String keyword);
}
