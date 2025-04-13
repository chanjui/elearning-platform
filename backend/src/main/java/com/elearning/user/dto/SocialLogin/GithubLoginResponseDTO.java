package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GithubLoginResponseDTO {
  private String accessToken;
  private String refreshToken;
  private String email;
  private String nickname;
  private String profileUrl;
  private boolean isNewUser; // 신규 가입 여부
}
