package com.elearning.user.service.login;

import com.elearning.common.config.JwtProvider;
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

  // 소셜 로그인
  // @param email 소셜 제공자에서 받은 이메일 (고유 식별자)
  // @param nickname 소셜 사용자 이름(혹은 닉네임)
  // @param profileUrl 프로필 이미지 URL 등 추가 정보
  // @return UserDTO에 JWT 토큰 포함한 사용자 정보

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

    Optional<User> userOptional = userRepository.findByEmail(email);
    User user;
    if (userOptional.isPresent()) {
      user = userOptional.get();
    } else {
      user = User.builder()
        .email(email)
        .nickname(nickname)
        .profileUrl(profileUrl)
        .password("")  // 소셜 로그인은 비밀번호 불필요
        .regDate(LocalDateTime.now())
        .isDel(false)
        .isInstructor(false)
        .build();
      user = userRepository.save(user);
    }

    // Claim 구성
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", user.getId());
    claims.put("email", user.getEmail());
    claims.put("nickname", user.getNickname());

    // JWT 토큰 생성
    String accessToken = jwtProvider.getAccessToken(claims);
    String refreshToken = jwtProvider.getRefreshToken(claims);

    // 리프레시 토큰 DB 저장
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
