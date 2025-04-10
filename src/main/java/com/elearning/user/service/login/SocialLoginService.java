package com.elearning.user.service.login;

import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.SocialLogin.GithubUserInfoDTO;
import com.elearning.user.dto.SocialLogin.GoogleUserInfoDTO;
import com.elearning.user.dto.SocialLogin.KakaoUserInfoDTO;
import com.elearning.user.dto.UserDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SocialLoginService {

  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;

  // 카카오 로그인 처리
  public UserDTO loginWithKakao(KakaoUserInfoDTO kakaoUserInfo) {
    // KakaoUserInfoDTO에서 필요한 데이터 추출
    if (kakaoUserInfo.getKakaoAccount() == null) {
      throw new RuntimeException("카카오 계정 정보가 없습니다.");
    }

    String email = kakaoUserInfo.getKakaoAccount().getEmail();
    String nickname = null;

    // kakao_account.profile이 존재하는지 우선 체크
    if (kakaoUserInfo.getKakaoAccount().getProfile() != null) {
      nickname = kakaoUserInfo.getKakaoAccount().getProfile().getNickname();
    }

    // 만약 kakao_account.profile이 null이면 properties에서 nickname을 가져옵니다.
    if (nickname == null && kakaoUserInfo.getProperties() != null) {
      nickname = kakaoUserInfo.getProperties().getNickname();
    }

    // nickname이 여전히 null인 경우, 오류 처리
    if (nickname == null) {
      throw new RuntimeException("카카오 사용자 정보에 닉네임이 없습니다.");
    }
    String profileUrl = kakaoUserInfo.getKakaoAccount().getProfile().getProfileImageUrl();

    // 로그인 또는 회원가입 처리
    return loginOrRegisterUser(email, nickname, profileUrl, "KAKAO");
  }

  // 구글 로그인 처리
  public UserDTO loginWithGoogle(GoogleUserInfoDTO googleUserInfo) {
    String email = googleUserInfo.getEmail();
    String nickname = googleUserInfo.getName();
    String profileUrl = googleUserInfo.getPicture();

    // 로그인 또는 회원가입 처리
    return loginOrRegisterUser(email, nickname, profileUrl, "GOOGLE");
  }

  // 깃허브 로그인 처리
  public UserDTO loginWithGithub(GithubUserInfoDTO githubUserInfo) {
    String email = githubUserInfo.getEmail();
    String nickname = githubUserInfo.getName() != null ? githubUserInfo.getName() : githubUserInfo.getLogin();
    String profileUrl = githubUserInfo.getAvatar_url();

    // 로그인 또는 회원가입 처리
    return loginOrRegisterUser(email, nickname, profileUrl, "GITHUB");
  }

  // 공통 로그인/회원가입 처리 로직
  private UserDTO loginOrRegisterUser(String email, String nickname, String profileUrl, String provider) {
    // 이메일로 사용자 찾기
    Optional<User> userOptional = userRepository.findByEmail(email);
    User user;

    if (userOptional.isPresent()) {
      user = userOptional.get();

      // 기존 사용자의 프로필 정보 업데이트 (선택적)
      // user.updateProfile(nickname, profileUrl);
      // userRepository.save(user);
    } else {
      // 신규 사용자 등록
      user = User.builder()
        .email(email)
        .nickname(nickname)
        .profileUrl(profileUrl)
        .password("")  // 소셜 로그인은 비밀번호 불필요
        .regDate(LocalDateTime.now())
        .isDel(false)
        .isInstructor(false)
        // .provider(provider)  // 제공자 정보 저장 (선택적)
        .build();

      user = userRepository.save(user);
    }

    // JWT 토큰 생성을 위한 클레임 구성
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", user.getId());
    claims.put("email", user.getEmail());
    claims.put("role", user.getIsInstructor() ? "0" : "1");

    // JWT 토큰 생성
    String accessToken = jwtProvider.getAccessToken(claims);
    String refreshToken = jwtProvider.getRefreshToken(claims);
    System.out.println(refreshToken);

    // 리프레시 토큰 DB에 저장
    user.setRefreshToken(refreshToken);
    userRepository.save(user);

    // UserDTO 반환
    return UserDTO.builder()
      .id(user.getId())
      .email(user.getEmail())
      .nickname(user.getNickname())
      .profileUrl(user.getProfileUrl())
      .regDate(user.getRegDate())
      .isDel(user.getIsDel())
      .refreshToken(refreshToken)
      .accessToken(accessToken)
      .isInstructor(user.getIsInstructor())
      .build();
  }
}