package com.photostudio.service;

import com.photostudio.dto.banners.BannerRequest;
import com.photostudio.dto.banners.BannerResponse;

import java.util.List;

public interface BannerService {

    List<BannerResponse> findAll();

    BannerResponse findById(Long id);

    BannerResponse create(BannerRequest request);

    BannerResponse update(Long id, BannerRequest request);

    BannerResponse updateStatus(Long id, String status);

    void delete(Long id);

    List<BannerResponse> findByStatus(String status);

    List<BannerResponse> search(String keyword);
}
