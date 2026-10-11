package com.photostudio.mapper;

import com.photostudio.dto.banners.BannerRequest;
import com.photostudio.dto.banners.BannerResponse;
import com.photostudio.model.banners.Banner;
import com.photostudio.model.banners.BannerStatus;

public class BannerMapper {

    public static Banner toEntity(BannerRequest request) {
        Banner banner = new Banner();
        banner.setTitle(request.getTitle().trim());
        banner.setImageUrl(request.getImageUrl().trim());
        banner.setLink(normalizeLink(request.getLink()));

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            banner.setStatus(BannerStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            banner.setStatus(BannerStatus.active);
        }
        return banner;
    }

    public static void updateEntity(BannerRequest request, Banner banner) {
        banner.setTitle(request.getTitle().trim());
        banner.setImageUrl(request.getImageUrl().trim());
        banner.setLink(normalizeLink(request.getLink()));

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            banner.setStatus(BannerStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }

    public static BannerResponse toResponse(Banner banner) {
        return new BannerResponse(
                banner.getId(),
                banner.getTitle(),
                banner.getImageUrl(),
                banner.getLink(),
                banner.getStatus() != null ? banner.getStatus().name() : null
        );
    }

    // Link rỗng thì lưu null
    private static String normalizeLink(String link) {
        return (link == null || link.isBlank()) ? null : link.trim();
    }
}
