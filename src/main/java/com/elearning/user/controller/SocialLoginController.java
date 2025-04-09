package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.SocialLogin.KakaoTokenResponseDTO;
import com.elearning.user.dto.SocialLogin.KakaoUserInfoDTO;
import com.elearning.user.dto.UserDTO;
import com.elearning.user.service.login.SocialLoginService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SocialLoginController {
  // private final RequestService requestService;
  // private final UserService userService;
  // private final HttpServletRequest request;
  // private final HttpServletResponse response;
  private final SocialLoginService socialLoginService;

  @Value("${oauth.kakao.client-id}")
  private String kakaoClientId;

  @Value("${oauth.kakao.redirect-uri}")
  private String kakaoRedirectUri;

  @Value("${oauth.kakao.client-secret}")
  private String kakaoSecret;

  //초기 인증 요청을 위한 엔드포인트 (예: /api/auth/kakao)
  @GetMapping("/kakao")
  public void initiateKakaoLogin(HttpServletResponse response) throws IOException {
    String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize" +
      "?client_id=" + kakaoClientId +
      // "&client_secret=" + kakaoSecret +
      "&redirect_uri=" + kakaoRedirectUri +
      "&response_type=code"
      + "&scope=account_email, profile_nickname, profile_image";  // 이메일 정보 요청을 위한 스코프 추가

    response.sendRedirect(kakaoAuthUrl);
  }

  // 카카오로부터 인증 코드(code)를 받아 처리하는 콜백 엔드포인트 (예: /api/auth/callback/kakao)
  @GetMapping("/callback/kakao")
  public ResultData<UserDTO> handleKakaoCallback(HttpServletRequest request) throws JsonProcessingException {
    String code = request.getParameter("code");
    String clientIP = request.getRemoteAddr();
    System.out.println("[" + java.time.LocalDateTime.now() + "] Received authorization code from " + clientIP + ": " + code);

    if (code == null) {
      return ResultData.of(-1, "카카오 인증 코드가 전달되지 않았습니다.", null);
    }
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

    RestTemplate restTemplate = new RestTemplate();
    if (restTemplate.getMessageConverters().stream().noneMatch(mc -> mc instanceof FormHttpMessageConverter)) {
      restTemplate.getMessageConverters().add(new FormHttpMessageConverter());
    }

    try {
      // 토큰 교환 요청
      KakaoTokenResponseDTO tokenResponse = restTemplate.postForObject(
        "https://kauth.kakao.com/oauth/token",
        requestEntity,
        KakaoTokenResponseDTO.class
      );

      if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
        return ResultData.of(-1, "토큰 발급 실패", null);
      }

      // 사용자 정보 조회: access token을 활용하여 카카오 사용자 정보 API 호출
      HttpHeaders userHeaders = new HttpHeaders();
      userHeaders.setBearerAuth(tokenResponse.getAccessToken());
      HttpEntity<?> userRequestEntity = new HttpEntity<>(userHeaders);

      // 응답을 String으로 받아서 로깅하기
      ResponseEntity<String> rawResponse = restTemplate.exchange(
        "https://kapi.kakao.com/v2/user/me",
        HttpMethod.GET,
        userRequestEntity,
        String.class
      );
      String responseBody = rawResponse.getBody();
      System.out.println("Kakao API raw response: " + responseBody);

      // ObjectMapper를 사용해서 DTO로 변환
      ObjectMapper mapper = new ObjectMapper();
      mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
      KakaoUserInfoDTO kakaoUserInfo = mapper.readValue(responseBody, KakaoUserInfoDTO.class);

      // kakaoUserInfo가 null 체크
      if (kakaoUserInfo == null) {
        return ResultData.of(-1, "사용자 정보 조회 실패", null);
      }

      // 소셜 로그인 서비스 호출하여 로그인 처리 및 JWT 토큰 발급
      UserDTO userDto = socialLoginService.loginWithKakao(kakaoUserInfo);
      return ResultData.of(1, "로그인 성공", userDto);
    } catch (HttpClientErrorException.TooManyRequests e) {
      // 429 오류 발생 시 안내 메시지 전달
      return ResultData.of(-1, "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", null);
    } catch (Exception e) {
      e.printStackTrace();
      return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
    }
  }
}
