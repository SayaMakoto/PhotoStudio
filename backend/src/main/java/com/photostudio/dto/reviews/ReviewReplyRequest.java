package com.photostudio.dto.reviews;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewReplyRequest {

    private String reply;

    public void validate() {
        if (reply == null || reply.isBlank()) {
            throw new IllegalArgumentException("Nội dung phản hồi không được để trống");
        }
        if (reply.trim().length() > 2000) {
            throw new IllegalArgumentException("Nội dung phản hồi tối đa 2000 ký tự");
        }
    }
}
