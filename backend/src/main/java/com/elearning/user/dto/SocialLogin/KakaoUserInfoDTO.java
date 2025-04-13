package com.elearning.user.dto.SocialLogin;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class KakaoUserInfoDTO {
  private Long id;

  @JsonProperty("connected_at")
  private String connectedAt;

  private Properties properties;

  @JsonProperty("kakao_account")
  private KakaoAccount kakaoAccount;

  @Data
  @NoArgsConstructor  // 내부 클래스에도 기본 생성자 필요
  @AllArgsConstructor
  public static class Properties {
    private String nickname;

    @JsonProperty("profile_image")
    private String profileImage;

    @JsonProperty("thumbnail_image")
    private String thumbnailImage;
  }

  @Data
  @NoArgsConstructor  // 내부 클래스에도 기본 생성자 필요
  @AllArgsConstructor
  @JsonIgnoreProperties(ignoreUnknown = true)
  public static class KakaoAccount {
    @JsonProperty("profile_needs_agreement")
    private Boolean profileNeedsAgreement;

    private Profile profile;

    @JsonProperty("has_email")
    private Boolean hasEmail;

    @JsonProperty("email_needs_agreement")
    private Boolean emailNeedsAgreement;

    @JsonProperty("is_email_valid")
    private Boolean isEmailValid;

    @JsonProperty("is_email_verified")
    private Boolean isEmailVerified;

    private String email;
  }

  @Data
  @NoArgsConstructor  // 내부 클래스에도 기본 생성자 필요
  @AllArgsConstructor
  @JsonIgnoreProperties(ignoreUnknown = true)
  public static class Profile {
    @JsonProperty("profile_nickname")
    private String nickname;

    @JsonProperty("profile_image_url")
    private String profileImageUrl;

    @JsonProperty("thumbnail_image_url")
    private String thumbnailImageUrl;
  }
}
