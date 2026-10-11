package com.photostudio.dto.banners;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BannerResponse {

    private Long id;

    private String title;

    private String imageUrl;

    private String link;

    private String status;
}
