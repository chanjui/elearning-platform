package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GoogleLoginResponseDTO {
  private String accessToken;
  private String refreshToken;
  private String email;
  private String nickname;
  private String profileUrl;
  private boolean isNewUser; // 신규 가입 여부
  private GoogleUserInfoDTO userInfo; // 추가

  // 기존 생성자
  public GoogleLoginResponseDTO(String accessToken, String refreshToken,
                                String email, String nickname, String profileUrl,
                                boolean isNewUser) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.email = email;
    this.nickname = nickname;
    this.profileUrl = profileUrl;
    this.isNewUser = isNewUser;
  }
}
