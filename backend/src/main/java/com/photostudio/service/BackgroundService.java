package com.photostudio.service;

import com.photostudio.dto.backgrounds.BackgroundRequest;
import com.photostudio.dto.backgrounds.BackgroundResponse;

import java.util.List;

public interface BackgroundService {

    List<BackgroundResponse> findAll();

    BackgroundResponse findById(Long id);

    BackgroundResponse create(BackgroundRequest request);

    BackgroundResponse update(Long id, BackgroundRequest request);

    void delete(Long id);

    List<BackgroundResponse> findByName(String name);

    List<BackgroundResponse> findByStatus(String status);

    List<BackgroundResponse> findTrash();

    BackgroundResponse restore(Long id);

    void permanentlyDelete(Long id);
}
