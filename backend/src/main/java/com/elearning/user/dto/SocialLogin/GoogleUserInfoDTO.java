package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GoogleUserInfoDTO {
  private String id;
  private String email;
  private String name;
  private String picture;
  private boolean verified_email;
}
