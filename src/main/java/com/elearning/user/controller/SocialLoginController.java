package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.SocialLogin.GithubUserInfoDTO;
import com.elearning.user.dto.SocialLogin.GoogleUserInfoDTO;
import com.elearning.user.dto.SocialLogin.KakaoTokenResponseDTO;
import com.elearning.user.dto.SocialLogin.KakaoUserInfoDTO;
import com.elearning.user.dto.UserDTO;
import com.elearning.user.service.login.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

// package com.elearning.user.controller;
//
// import com.elearning.common.ResultData;
// import com.elearning.user.dto.SocialLogin.*;
// import com.elearning.user.dto.UserDTO;
// import com.elearning.user.service.login.SocialLoginService;
// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import com.fasterxml.jackson.databind.PropertyNamingStrategies;
// import jakarta.servlet.http.Cookie;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.ParameterizedTypeReference;
// import org.springframework.http.*;
// import org.springframework.http.converter.FormHttpMessageConverter;
// import org.springframework.util.LinkedMultiValueMap;
// import org.springframework.util.MultiValueMap;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.HttpClientErrorException;
// import org.springframework.web.client.RestTemplate;
//
// import java.io.IOException;
// import java.util.*;
//
// @RestController
// @RequestMapping("/api/auth")
// @RequiredArgsConstructor
// public class SocialLoginController {
//   private final SocialLoginService socialLoginService;
//
//   @Value("${oauth.kakao.client-id}")
//   private String kakaoClientId;
//
//   @Value("${oauth.kakao.redirect-uri}")
//   private String kakaoRedirectUri;
//
//   @Value("${oauth.kakao.client-secret}")
//   private String kakaoSecret;
//
//   @Value("${oauth.google.client-id}")
//   private String googleClientId;
//
//   @Value("${oauth.google.redirect-uri}")
//   private String googleRedirectUri;
//
//   @Value("${oauth.google.client-secret}")
//   private String googleSecret;
//
//   @Value("${oauth.github.client-id}")
//   private String githubClientId;
//
//   @Value("${oauth.github.client-secret}")
//   private String githubClientSecret;
//
//   @Value("${oauth.github.redirect-uri}")
//   private String githubRedirectUri;
//
//   @Value("${frontend.url}")
//   private String frontendUrl;
//
//   //초기 인증 요청을 위한 엔드포인트 (예: /api/auth/kakao)
//   @GetMapping("/kakao")
//   public void initiateKakaoLogin(HttpServletResponse response) throws IOException {
//     String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize" +
//       "?client_id=" + kakaoClientId +
//       // "&client_secret=" + kakaoSecret +
//       "&redirect_uri=" + kakaoRedirectUri +
//       "&response_type=code"
//       + "&scope=account_email, profile_nickname, profile_image";  // 이메일 정보 요청을 위한 스코프 추가
//
//     response.sendRedirect(kakaoAuthUrl);
//   }
//
//   // 카카오로부터 인증 코드(code)를 받아 처리하는 콜백 엔드포인트 (예: /api/auth/callback/kakao)
//   @GetMapping("/callback/kakao")
//   public ResultData<UserDTO> handleKakaoCallback(HttpServletRequest request) throws JsonProcessingException {
//     String code = request.getParameter("code");
//     String clientIP = request.getRemoteAddr();
//     System.out.println("[" + java.time.LocalDateTime.now() + "] Received authorization code from " + clientIP + ": " + code);
//
//     if (code == null) {
//       return ResultData.of(-1, "카카오 인증 코드가 전달되지 않았습니다.", null);
//     }
//     // 카카오 토큰 교환 API 호출을 위한 파라미터
//     MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//     params.add("grant_type", "authorization_code");
//     params.add("client_id", kakaoClientId);
//     params.add("client_secret", kakaoSecret);
//     params.add("redirect_uri", kakaoRedirectUri);
//     params.add("code", code);
//
//     // Content-Type 헤더 설정
//     HttpHeaders headers = new HttpHeaders();
//     headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//
//     // 파라미터와 헤더를 포함하는 HttpEntity 생성
//     HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
//
//     RestTemplate restTemplate = new RestTemplate();
//     if (restTemplate.getMessageConverters().stream().noneMatch(mc -> mc instanceof FormHttpMessageConverter)) {
//       restTemplate.getMessageConverters().add(new FormHttpMessageConverter());
//     }
//
//     try {
//       // 토큰 교환 요청
//       KakaoTokenResponseDTO tokenResponse = restTemplate.postForObject(
//         "https://kauth.kakao.com/oauth/token",
//         requestEntity,
//         KakaoTokenResponseDTO.class
//       );
//
//       if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
//         return ResultData.of(-1, "토큰 발급 실패", null);
//       }
//
//       // 사용자 정보 조회: access token을 활용하여 카카오 사용자 정보 API 호출
//       HttpHeaders userHeaders = new HttpHeaders();
//       userHeaders.setBearerAuth(tokenResponse.getAccessToken());
//       HttpEntity<?> userRequestEntity = new HttpEntity<>(userHeaders);
//
//       // 응답을 String으로 받아서 로깅하기
//       ResponseEntity<String> rawResponse = restTemplate.exchange(
//         "https://kapi.kakao.com/v2/user/me",
//         HttpMethod.GET,
//         userRequestEntity,
//         String.class
//       );
//       String responseBody = rawResponse.getBody();
//       System.out.println("Kakao API raw response: " + responseBody);
//
//       // ObjectMapper를 사용해서 DTO로 변환
//       ObjectMapper mapper = new ObjectMapper();
//       mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
//       KakaoUserInfoDTO kakaoUserInfo = mapper.readValue(responseBody, KakaoUserInfoDTO.class);
//
//       // kakaoUserInfo가 null 체크
//       if (kakaoUserInfo == null) {
//         return ResultData.of(-1, "사용자 정보 조회 실패", null);
//       }
//
//       // 소셜 로그인 서비스 호출하여 로그인 처리 및 JWT 토큰 발급
//       UserDTO userDto = socialLoginService.loginWithKakao(kakaoUserInfo);
//       return ResultData.of(1, "로그인 성공", userDto);
//     } catch (HttpClientErrorException.TooManyRequests e) {
//       // 429 오류 발생 시 안내 메시지 전달
//       return ResultData.of(-1, "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", null);
//     } catch (Exception e) {
//       e.printStackTrace();
//       return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
//     }
//   }
//
//   // Google 초기 인증 요청 - 프론트엔드에서 클릭 시 이 엔드포인트로 요청
//   @GetMapping("/google")
//   public void initiateGoogleLogin(HttpServletResponse response) throws IOException {
//     String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
//       "?client_id=" + googleClientId +
//       "&redirect_uri=" + googleRedirectUri +
//       "&response_type=code" +
//       "&scope=email%20profile";
//
//     response.sendRedirect(googleAuthUrl);
//   }
//
//   // Google 콜백 처리
//   @GetMapping("/google/callback")
//   public ResultData<UserDTO> handleGoogleCallback(@RequestParam String code) throws JsonProcessingException {
//     try {
//       // 구글 사용자 정보 직접 획득
//       GoogleUserInfoDTO userInfo = socialLoginService.getGoogleUserInfoByCode(code);
//
//       // 소셜 로그인 서비스를 통해 사용자 정보 처리 및 JWT 토큰 발급
//       UserDTO userDto = socialLoginService.loginWithGoogle(userInfo);
//
//       return ResultData.of(1, "구글 로그인 성공", userDto);
//     } catch (Exception e) {
//       e.printStackTrace();
//       return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
//     }
//   }
//   // public void handleGoogleCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
//   //   try {
//   //     GoogleLoginResponseDTO responseDto = socialLoginService.googleLogin(code);
//   //
//       // 쿠키에 토큰 저장
//       Cookie accessTokenCookie = new Cookie("accessToken", responseDto.getAccessToken());
//       accessTokenCookie.setHttpOnly(true);
//       accessTokenCookie.setPath("/");
//       accessTokenCookie.setMaxAge(3600); // 1시간
//
//       Cookie refreshTokenCookie = new Cookie("refreshToken", responseDto.getRefreshToken());
//       refreshTokenCookie.setHttpOnly(true);
//       refreshTokenCookie.setPath("/");
//       refreshTokenCookie.setMaxAge(604800); // 7일
//
//       response.addCookie(accessTokenCookie);
//       response.addCookie(refreshTokenCookie);
//   //
//   //     // 바로 메인 페이지로 리다이렉트
//   //     response.sendRedirect(frontendUrl);
//   //
//   //   } catch (Exception e) {
//   //     e.printStackTrace();
//   //     response.sendRedirect(frontendUrl + "/auth/login?error=login_failure");
//   //   }
//   // }
//   //
//   //=== 깃허브 로그인 ===//
//   @GetMapping("/github")
//   public void initiateGithubLogin(HttpServletResponse response) throws IOException {
//     String githubAuthUrl = "https://github.com/login/oauth/authorize" +
//       "?client_id=" + githubClientId +
//       "&redirect_uri=" + githubRedirectUri +
//       "&scope=user:email";
//
//     response.sendRedirect(githubAuthUrl);
//   }
//
//   @GetMapping("/callback/github")
//   public ResultData<UserDTO> handleGithubCallback(@RequestParam String code) {
//     return ResultData.of(1, "깃허브 로그인 성공", socialLoginService.loginWithGithub(code));
//   }
// }
// package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.SocialLogin.*;
import com.elearning.user.dto.UserDTO;
import com.elearning.user.service.login.GithubOAuthService;
import com.elearning.user.service.login.GoogleOAuthService;
import com.elearning.user.service.login.KakaoOAuthService;
import com.elearning.user.service.login.SocialLoginService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SocialLoginController {
  private final SocialLoginService socialLoginService;
  private final KakaoOAuthService kakaoOAuthService;
  private final GoogleOAuthService googleOAuthService;
  private final GithubOAuthService githubOAuthService;
  private final RequestService requestService;

  @Value("${oauth.kakao.client-id}")
  private String kakaoClientId;

  @Value("${oauth.kakao.redirect-uri}")
  private String kakaoRedirectUri;

  @Value("${oauth.kakao.client-secret}")
  private String kakaoSecret;

  @Value("${oauth.google.client-id}")
  private String googleClientId;

  @Value("${oauth.google.redirect-uri}")
  private String googleRedirectUri;

  @Value("${oauth.github.client-id}")
  private String githubClientId;

  @Value("${oauth.github.redirect-uri}")
  private String githubRedirectUri;

  // 카카오 초기 인증 요청
  @GetMapping("/kakao")
  public void initiateKakaoLogin(HttpServletResponse response) throws IOException {
    String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize" +
      "?client_id=" + kakaoClientId +
      "&redirect_uri=" + kakaoRedirectUri +
      "&response_type=code" +
      "&scope=account_email,profile_nickname,profile_image";

    response.sendRedirect(kakaoAuthUrl);
  }

  // 카카오 콜백 처리 - JSON 응답
  @GetMapping("/kakao-callback")
  // public ResultData<UserDTO> handleKakaoCallback(HttpServletRequest request) throws JsonProcessingException {
  //   String code = request.getParameter("code");
  //   String clientIP = request.getRemoteAddr();
  //   System.out.println("[" + java.time.LocalDateTime.now() + "] Received authorization code from " + clientIP + ": " + code);
  //
  //   if (code == null) {
  //     return ResultData.of(-1, "카카오 인증 코드가 전달되지 않았습니다.", null);
  //   }
  //   // 카카오 토큰 교환 API 호출을 위한 파라미터
  //   MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
  //   params.add("grant_type", "authorization_code");
  //   params.add("client_id", kakaoClientId);
  //   params.add("client_secret", kakaoSecret);
  //   params.add("redirect_uri", kakaoRedirectUri);
  //   params.add("code", code);
  //
  //   // Content-Type 헤더 설정
  //   HttpHeaders headers = new HttpHeaders();
  //   headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
  //
  //   // 파라미터와 헤더를 포함하는 HttpEntity 생성
  //   HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, headers);
  //
  //   RestTemplate restTemplate = new RestTemplate();
  //   if (restTemplate.getMessageConverters().stream().noneMatch(mc -> mc instanceof FormHttpMessageConverter)) {
  //     restTemplate.getMessageConverters().add(new FormHttpMessageConverter());
  //   }
  //
  //   try {
  //     // 토큰 교환 요청
  //     KakaoTokenResponseDTO tokenResponse = restTemplate.postForObject(
  //       "https://kauth.kakao.com/oauth/token",
  //       requestEntity,
  //       KakaoTokenResponseDTO.class
  //     );
  //
  //     if (tokenResponse == null || tokenResponse.getAccessToken() == null) {
  //       return ResultData.of(-1, "토큰 발급 실패", null);
  //     }
  //
  //     // 사용자 정보 조회: access token을 활용하여 카카오 사용자 정보 API 호출
  //     HttpHeaders userHeaders = new HttpHeaders();
  //     userHeaders.setBearerAuth(tokenResponse.getAccessToken());
  //     HttpEntity<?> userRequestEntity = new HttpEntity<>(userHeaders);
  //
  //     // 응답을 String으로 받아서 로깅하기
  //     ResponseEntity<String> rawResponse = restTemplate.exchange(
  //       "https://kapi.kakao.com/v2/user/me",
  //       HttpMethod.GET,
  //       userRequestEntity,
  //       String.class
  //     );
  //     String responseBody = rawResponse.getBody();
  //     System.out.println("Kakao API raw response: " + responseBody);
  //
  //     // ObjectMapper를 사용해서 DTO로 변환
  //     ObjectMapper mapper = new ObjectMapper();
  //     mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
  //     KakaoUserInfoDTO kakaoUserInfo = mapper.readValue(responseBody, KakaoUserInfoDTO.class);
  //
  //     // kakaoUserInfo가 null 체크
  //     if (kakaoUserInfo == null) {
  //       return ResultData.of(-1, "사용자 정보 조회 실패", null);
  //     }
  //
  //     // 소셜 로그인 서비스 호출하여 로그인 처리 및 JWT 토큰 발급
  //     UserDTO userDto = socialLoginService.loginWithKakao(kakaoUserInfo);
  //     return ResultData.of(1, "로그인 성공", userDto);
  //   } catch (HttpClientErrorException.TooManyRequests e) {
  //     // 429 오류 발생 시 안내 메시지 전달
  //     return ResultData.of(-1, "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.", null);
  //   } catch (Exception e) {
  //     e.printStackTrace();
  //     return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
  //   }
  // }
  public ResultData<UserDTO> handleKakaoCallback(@RequestParam String code) {
    try {
      // 카카오 액세스 토큰 획득
      String accessToken = kakaoOAuthService.getAccessToken(code);

      // 카카오 사용자 정보 요청
      KakaoUserInfoDTO userInfo = kakaoOAuthService.getUserInfo(accessToken);

      // 로그인 또는 회원가입 처리
      UserDTO userDto = socialLoginService.loginWithKakao(userInfo);
      System.out.println("로그인 처리 후 UserDTO: " + userDto);
      System.out.println("UserDTO.accessToken: " + userDto.getAccessToken());

      // 쿠키에 토큰 저장
      requestService.setHeaderCookie("access_token", userDto.getAccessToken());
      requestService.setHeaderCookie("refresh_token", userDto.getRefreshToken());

      return ResultData.of(1, "카카오 로그인 성공", userDto);
    } catch (Exception e) {
      e.printStackTrace();
      return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
    }
  }

  // 구글 초기 인증 요청
  @GetMapping("/google")
  public void initiateGoogleLogin(HttpServletResponse response) throws IOException {
    String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
      "?client_id=" + googleClientId +
      "&redirect_uri=" + googleRedirectUri +
      "&response_type=code" +
      "&scope=email%20profile";

    response.sendRedirect(googleAuthUrl);
  }

  // 구글 콜백 처리 - JSON 응답
  @GetMapping("/google-callback")
  public ResultData<UserDTO> handleGoogleCallback(@RequestParam String code) {
    try {
      // 구글 액세스 토큰 획득
      String accessToken = googleOAuthService.getAccessToken(code);

      // 구글 사용자 정보 요청
      GoogleUserInfoDTO userInfo = googleOAuthService.getUserInfo(accessToken);

      // 로그인 또는 회원가입 처리
      UserDTO userDto = socialLoginService.loginWithGoogle(userInfo);

      // 쿠키에 토큰 저장
      requestService.setHeaderCookie("access_token", userDto.getAccessToken());
      requestService.setHeaderCookie("refresh_token", userDto.getRefreshToken());

      return ResultData.of(1, "구글 로그인 성공", userDto);
    } catch (Exception e) {
      e.printStackTrace();
      return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
    }
  }

  // 깃허브 초기 인증 요청
  @GetMapping("/github")
  public void initiateGithubLogin(HttpServletResponse response) throws IOException {
    String githubAuthUrl = "https://github.com/login/oauth/authorize" +
      "?client_id=" + githubClientId +
      "&redirect_uri=" + githubRedirectUri +
      "&scope=user:email";

    response.sendRedirect(githubAuthUrl);
  }

  // 깃허브 콜백 처리 - JSON 응답
  @GetMapping("/github-callback")
  public ResultData<UserDTO> handleGithubCallback(@RequestParam String code) {
    try {
      // 깃허브 액세스 토큰 획득
      String accessToken = githubOAuthService.getAccessToken(code);

      // 깃허브 사용자 정보 요청
      GithubUserInfoDTO userInfo = githubOAuthService.getUserInfo(accessToken);

      // 로그인 또는 회원가입 처리
      UserDTO userDto = socialLoginService.loginWithGithub(userInfo);

      // 쿠키에 토큰 저장
      requestService.setHeaderCookie("access_token", userDto.getAccessToken());
      requestService.setHeaderCookie("refresh_token", userDto.getRefreshToken());

      return ResultData.of(1, "깃허브 로그인 성공", userDto);
    } catch (Exception e) {
      e.printStackTrace();
      return ResultData.of(-1, "로그인 처리 중 오류가 발생했습니다.", null);
    }
  }
}