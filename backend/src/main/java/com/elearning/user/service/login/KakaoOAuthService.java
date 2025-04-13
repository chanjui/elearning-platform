package com.elearning.user.service.login;

import com.elearning.user.dto.SocialLogin.KakaoTokenResponseDTO;
import com.elearning.user.dto.SocialLogin.KakaoUserInfoDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

  @Value("${oauth.kakao.client-id}")
  private String kakaoClientId;

  @Value("${oauth.kakao.client-secret}")
  private String kakaoSecret;

  @Value("${oauth.kakao.redirect-uri}")
  private String kakaoRedirectUri;

  private final RestTemplate restTemplate;
  private final ObjectMapper objectMapper;

  public String getAccessToken(String code) {
    // 카카오 토큰 교환 API 호출을 위한 파라미터
    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("grant_type", "authorization_code");
    params.add("client_id", kakaoClientId);
    params.add("client_secret", kakaoSecret);
    params.add("redirect_uri", kakaoRedirectUri);
    params.add("code", code);

    // Content-Type 헤더 설정
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    // 파라미터와 헤더를 포함하는 HttpEntity 생성
    HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);

    // FormHttpMessageConverter 추가 확인
    if (restTemplate.getMessageConverters().stream().noneMatch(mc -> mc instanceof FormHttpMessageConverter)) {
      restTemplate.getMessageConverters().add(new FormHttpMessageConverter());
    }

    // 토큰 교환 요청
    KakaoTokenResponseDTO tokenResponse = restTemplate.postForObject(
      "https://kauth.kakao.com/oauth/token",
      requestEntity,
      KakaoTokenResponseDTO.class
    );

    if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
      throw new RuntimeException("카카오 액세스 토큰 발급 실패");
    }

    return tokenResponse.getAccessToken();
  }

  public KakaoUserInfoDTO getUserInfo(String accessToken) {
    // 사용자 정보 조회: access token을 활용하여 카카오 사용자 정보 API 호출
    HttpHeaders userHeaders = new HttpHeaders();
    userHeaders.setBearerAuth(accessToken);
    HttpEntity<?> userRequestEntity = new HttpEntity<>(userHeaders);

    // 응답을 String으로 받아서 로깅하기
    ResponseEntity<String> rawResponse = restTemplate.exchange(
      "https://kapi.kakao.com/v2/user/me",
      HttpMethod.GET,
      userRequestEntity,
      String.class
    );

    try {
      // ObjectMapper를 사용해서 DTO로 변환
      return objectMapper.readValue(rawResponse.getBody(), KakaoUserInfoDTO.class);
    } catch (Exception e) {
      throw new RuntimeException("카카오 사용자 정보 파싱 실패", e);
    }
  }
}