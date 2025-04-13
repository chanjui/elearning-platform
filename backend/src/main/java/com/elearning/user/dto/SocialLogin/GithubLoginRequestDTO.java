package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GithubLoginRequestDTO {
  private String code; // 깃허브 인증 코드
}
