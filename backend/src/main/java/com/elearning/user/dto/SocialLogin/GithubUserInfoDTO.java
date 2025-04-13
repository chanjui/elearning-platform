package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GithubUserInfoDTO {
  private Long id;
  private String login; // 깃허브 사용자명
  private String avatar_url; // 프로필 이미지
  private String name;
  private String email;
}
