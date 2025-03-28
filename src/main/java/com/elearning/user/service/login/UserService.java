package com.elearning.user.service.login;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.common.config.JwtUser;
import com.elearning.user.dto.UserDto;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;
  private final PasswordEncoder passwordEncoder;
  // private final RequestService requestService;

  // 회원가입
  public UserDto signup(String nickname, String email, String password, String phone) {
    String encodedPassword = passwordEncoder.encode(password);
    User user = User.builder()
      .nickname(nickname)
      .email(email)
      .password(encodedPassword)
      .phone(phone)
      .isDel(false)
      .isInstructor(false)
      .build();

    User savedUser = userRepository.save(user);
    return convertToDto(savedUser);
  }

  // 로그인 및 토큰 생성
  public UserDto authAndMakeToken(String email, String rawPassword) {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

    if (passwordEncoder.matches(rawPassword, user.getPassword())) {
      Map<String, Object> claims = new HashMap<>();
      claims.put("id", user.getId());
      claims.put("nickname", user.getNickname());
      claims.put("email", user.getEmail());
      claims.put("phone", user.getPhone());

      String accessToken = jwtProvider.getAccessToken(claims);
      String refreshToken = jwtProvider.getRefreshToken(claims);

      user.setRefreshToken(refreshToken);
      userRepository.save(user); // 또는 updateRefreshToken 메서드 사용

      return UserDto.builder()
        .nickname(user.getNickname())
        .email(user.getEmail())
        .phone(user.getPhone())
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
    } else {
      throw new RuntimeException("비밀번호가 일치하지 않습니다.");
    }
  }

  // Entity -> DTO 변환 메서드
  private UserDto convertToDto(User user) {
    return UserDto.builder()
      .id(user.getId())
      .nickname(user.getNickname())
      .email(user.getEmail())
      .phone(user.getPhone())
      .build();
  }

  // 토큰으로부터 사용자 정보 얻기
  public JwtUser getUserFromAccessToken(String accessToken) {
    Map<String, Object> claims = jwtProvider.getClaims(accessToken);
    Number id = (Number) claims.get("id");
    String nickname = (String) claims.get("nickname");
    String email = (String) claims.get("email");
    String phone = (String) claims.get("phone");
    // 적절한 권한 리스트 생성
    List<GrantedAuthority> authorities = new ArrayList<>();
    return new JwtUser(nickname, email, "", authorities);
  }

  // 토큰 검증
  public boolean validateToken(String token) {
    return jwtProvider.verify(token);
  }

  // refreshToken을 이용한 accessToken 재발급
  public ResultData<String> refreshAccessToken(String refreshToken) {
    User user = userRepository.findByRefreshToken(refreshToken)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 refreshToken입니다."));
    Map<String, Object> claims = new HashMap<>();
    claims.put("id", user.getId());
    claims.put("email", user.getEmail());
    String newAccessToken = jwtProvider.getAccessToken(claims);
    // 필요한 경우 DB 업데이트
    return ResultData.of(1, "success", newAccessToken);
  }
}