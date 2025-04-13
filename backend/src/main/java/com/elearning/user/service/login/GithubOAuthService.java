package com.elearning.user.service.login;

import com.elearning.common.config.JwtProvider;
import com.elearning.common.config.JwtUser;
import com.elearning.user.dto.SocialLogin.GithubUserInfoDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GithubOAuthService {

  @Value("${oauth.github.client-id}")
  private String githubClientId;
  @Value("${oauth.github.client-secret}")
  private String githubClientSecret;
  @Value("${oauth.github.redirect-uri}")
  private String githubRedirectUri;

  private final RestTemplate restTemplate;
  private final JwtProvider jwtProvider;
  private final RequestService requestService;
  private final UserRepository userRepository;

  public String getAccessToken(String code) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    Map<String, String> body = Map.of(
      "client_id", githubClientId,
      "client_secret", githubClientSecret,
      "code", code
    );

    HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

    ResponseEntity<Map> response = restTemplate.exchange(
      "https://github.com/login/oauth/access_token",
      HttpMethod.POST,
      request,
      Map.class
    );

    return (String) response.getBody().get("access_token");
  }

  public GithubUserInfoDTO getUserInfo(String accessToken) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(accessToken);
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    HttpEntity<String> request = new HttpEntity<>(headers);

    ResponseEntity<GithubUserInfoDTO> response = restTemplate.exchange(
      "https://api.github.com/user",
      HttpMethod.GET,
      request,
      GithubUserInfoDTO.class
    );

    GithubUserInfoDTO userInfo = response.getBody();

    if (userInfo.getEmail() == null) {
      userInfo.setEmail(getUserEmail(accessToken));
    }

    return userInfo;
  }

  private String getUserEmail(String accessToken) {
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(accessToken);
    headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

    HttpEntity<String> request = new HttpEntity<>(headers);

    ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
      "https://api.github.com/user/emails",
      HttpMethod.GET,
      request,
      new ParameterizedTypeReference<>() {}
    );

    return response.getBody().stream()
      .filter(e -> Boolean.TRUE.equals(e.get("primary")) && Boolean.TRUE.equals(e.get("verified")))
      .map(e -> (String) e.get("email"))
      .findFirst()
      .orElse("github-" + UUID.randomUUID() + "@example.com");
  }

  // GitHub 로그인 처리 및 JWT 토큰 생성 후 쿠키에 저장
  @Transactional
  public User processGithubLogin(String code) {
    // 1. GitHub에서 액세스 토큰 받기
    String githubAccessToken = getAccessToken(code);

    // 2. GitHub에서 사용자 정보 받기
    GithubUserInfoDTO userInfo = getUserInfo(githubAccessToken);

    // 3. 사용자 정보로 DB에서 사용자 찾거나 새로 생성
    User user = findOrCreateUser(userInfo);

    // 4. JWT 토큰 생성을 위한 사용자 정보 맵 생성
    Map<String, Object> userClaims = new HashMap<>();
    userClaims.put("id", user.getId());
    userClaims.put("email", user.getEmail());
    userClaims.put("nickname", user.getNickname());
    userClaims.put("provider", "github");

    // 5. JWT 액세스 토큰 및 리프레시 토큰 생성
    String accessToken = jwtProvider.getAccessToken(userClaims);
    String refreshToken = jwtProvider.getRefreshToken(userClaims);

    // 6. 쿠키에 토큰 저장 (기존 RequestService 사용)
    requestService.setHeaderCookie("access_token", accessToken);
    requestService.setHeaderCookie("refresh_token", refreshToken);

    // 7. 스프링 시큐리티 컨텍스트에 사용자 정보 설정
    JwtUser jwtUser = createJwtUser(user);
    requestService.setMember(jwtUser);

    return user;
  }

  /**
   * GitHub 사용자 정보로 DB에서 사용자를 찾거나 새로 생성
   * @param userInfo GitHub에서 받은 사용자 정보
   * @return 찾거나 생성된 사용자 엔티티
   */
  private User findOrCreateUser(GithubUserInfoDTO userInfo) {
    return userRepository.findByEmail(userInfo.getEmail())
      .orElseGet(() -> {
        User newUser = new User();
        newUser.setEmail(userInfo.getEmail());
        newUser.setNickname(userInfo.getName() != null ? userInfo.getName() : userInfo.getLogin());
        // newUser.setProvider("github");
        // newUser.setProviderId(String.valueOf(userInfo.getId()));
        newUser.setProfileUrl(userInfo.getAvatar_url());
        return userRepository.save(newUser);
      });
  }

  /**
   * User 엔티티로부터 JwtUser 생성
   * @param user 사용자 엔티티
   * @return JwtUser 객체
   */
  private JwtUser createJwtUser(User user) {
    List<SimpleGrantedAuthority> authorities = Collections.singletonList(
      new SimpleGrantedAuthority("ROLE_USER")
    );

    return new JwtUser(
      user.getId().toString(),
      user.getEmail(),
      user.getNickname(),
      "", // 비밀번호 없음
      authorities
    );
  }

  /**
   * 리프레시 토큰으로 새 액세스 토큰 발급
   * @return 새 액세스 토큰을 받은 사용자 정보
   */
  public User refreshAccessToken() {
    // 1. 쿠키에서 리프레시 토큰 가져오기
    String refreshToken = requestService.getCookie("refresh_token");

    if (refreshToken == null || refreshToken.isEmpty()) {
      throw new RuntimeException("리프레시 토큰이 없습니다");
    }

    // 2. 리프레시 토큰 검증
    if (!jwtProvider.verify(refreshToken)) {
      throw new RuntimeException("유효하지 않은 리프레시 토큰입니다");
    }

    // 3. 리프레시 토큰에서 사용자 정보 추출
    Map<String, Object> claims = jwtProvider.getClaims(refreshToken);
    Long userId = jwtProvider.getUserId(refreshToken);

    // 4. 사용자 정보 조회
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

    // 5. 새 액세스 토큰 생성
    String newAccessToken = jwtProvider.getAccessToken(claims);

    // 6. 쿠키에 새 액세스 토큰 저장
    requestService.setHeaderCookie("access_token", newAccessToken);

    // 7. 스프링 시큐리티 컨텍스트에 사용자 정보 설정
    JwtUser jwtUser = createJwtUser(user);
    requestService.setMember(jwtUser);

    return user;
  }

  /**
   * 로그아웃 처리
   */
  public void logout() {
    // 쿠키에서 토큰 제거
    requestService.removeHeaderCookie("access_token");
    requestService.removeHeaderCookie("refresh_token");

    // 스프링 시큐리티 컨텍스트에서 인증 정보 제거
    SecurityContextHolder.clearContext();
  }
}