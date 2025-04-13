package com.elearning.user.service.login;

import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.SocialLogin.GoogleUserInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoogleOAuthService {

  @Value("${oauth.google.client-id}")
  private String googleClientId;

  @Value("${oauth.google.client-secret}")
  private String googleClientSecret;

  @Value("${oauth.google.redirect-uri}")
  private String googleRedirectUri;

  private final RestTemplate restTemplate;
  private final JwtProvider jwtProvider;

  public String getAccessToken(String code) {
    String tokenUrl = "https://oauth2.googleapis.com/token";

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("code", code);
    params.add("client_id", googleClientId);
    params.add("client_secret", googleClientSecret);
    params.add("redirect_uri", googleRedirectUri);
    params.add("grant_type", "authorization_code");

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

    ResponseEntity<Map> response = restTemplate.exchange(
      tokenUrl,
      HttpMethod.POST,
      request,
      Map.class
    );

    return (String) response.getBody().get("access_token");
  }

  public GoogleUserInfoDTO getUserInfo(String accessToken) {
    String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(accessToken);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(headers);

    ResponseEntity<GoogleUserInfoDTO> response = restTemplate.exchange(
      userInfoUrl,
      HttpMethod.GET,
      request,
      GoogleUserInfoDTO.class
    );

    return response.getBody();
  }
}