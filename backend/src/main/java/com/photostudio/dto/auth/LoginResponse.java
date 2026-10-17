package com.photostudio.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String tokenType;
    private Long expiresIn;

    // Getter bổ sung alias token để tương thích tối đa các client
    public String getToken() {
        return accessToken;
    }
}
