package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GoogleLoginRequestDTO {
  private String code; // 클라이언트에서 받은 인증 코드
}
