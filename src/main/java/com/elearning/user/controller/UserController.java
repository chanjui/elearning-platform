package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.EmailDTO;
import com.elearning.user.dto.UserDTO;
import com.elearning.user.entity.User;
import com.elearning.user.service.EmailService;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;
  private final HttpServletRequest request;
  private final RequestService requestService;
  private final EmailService emailService;

  // 1단계: 회원가입 정보 저장 (세션 사용하지 않고 바로 처리)
  @PostMapping("/signup/input")
  public ResultData<String> inputUserSignupInfo(@RequestBody UserDTO userDto) {
    // 클라이언트에서 받은 회원가입 정보를 그대로 세션에 저장하거나 별도로 처리할 필요 없음.
    // 이메일 인증 단계로 바로 넘어가도록 응답을 처리.
    // 이메일 인증 절차로 바로 이동.
    return ResultData.of(1, "회원가입 정보가 저장되었습니다. 이메일 인증을 진행해주세요.");
  }

  // 2단계: 이메일 인증 코드 발송 API
  @PostMapping("/signup/sendEmail")
  public ResultData<String> sendEmailVerification(@RequestBody EmailDTO emailDto) throws Exception {
    // 이메일로 인증 코드 발송
    String authCode = emailService.sendEmail(emailDto.getEmail()); // 인증 코드 발송
    return ResultData.of(1, "인증 코드가 발송되었습니다.", authCode); // 응답
  }

  // 3단계: 이메일 인증 코드 확인 후 회원가입 API
  @PostMapping("/signup/verifyEmail")
  public ResultData<String> verifyEmail(@RequestBody EmailDTO emailDto) {
    // 이메일 인증 코드 검증
    boolean isValid = emailService.verifyEmailAuthCode(emailDto.getEmail(), emailDto.getInputAuthCode());

    if (isValid) {
      return ResultData.of(1, "이메일 인증 성공");
    } else {
      return ResultData.of(0, "인증번호가 일치하지 않습니다.");
    }
  }

  // 4단계: 이메일 인증 후 회원가입 완료 및 로그인 처리 API
  @PostMapping("/signup")
  public ResultData<UserDTO> signup(@RequestBody UserDTO userDto) {
    // 이메일 인증이 완료되었는지 확인
    if (!emailService.isEmailVerified(userDto.getEmail())) {
      return ResultData.of(0, "이메일 인증이 완료되지 않았습니다.");
    }

    // 회원가입 진행
    User newUser = userService.registeredUser(userDto);  // `registeredUser` 호출

    // 평문 비밀번호 전달해서 match 검증
    UserDTO loginUser = userService.authAndMakeToken(newUser.getEmail(), userDto.getPassword());

    // 로그인 직후 쿠키 설정 (HttpServletResponse 필요)
    requestService.setHeaderCookie("accessToken", loginUser.getAccessToken());
    requestService.setHeaderCookie("refreshToken", loginUser.getRefreshToken());

    return ResultData.of(1, "회원가입 및 자동 로그인 성공", loginUser); // 응답
  }

  // 인증 코드 재발급 API
  @PostMapping("/signup/reissueAuthCode")
  public ResultData<String> reissueAuthCode(@RequestBody EmailDTO emailDto) throws Exception {
    // 인증 코드 재발급
    String newAuthCode = emailService.reissueAuthCode(emailDto.getEmail());
    return ResultData.of(1, "새로운 인증 코드가 발급되었습니다.", newAuthCode);
  }

  @PostMapping("/login")
  public ResultData<UserDTO> login(@RequestBody UserDTO userDto) {
    UserDTO loginUser = userService.authAndMakeToken(userDto.getEmail(), userDto.getPassword());

    // 로그인 직후 쿠키 설정 (HttpServletResponse 필요)
    requestService.setHeaderCookie("accessToken", loginUser.getAccessToken());
    System.out.println("accessToken"+loginUser.getAccessToken());
    requestService.setHeaderCookie("refreshToken", loginUser.getRefreshToken());

    return ResultData.of(1, "success", loginUser);
  }

  @PostMapping("/logout")
  public ResponseEntity<ResultData<String>> logout() {
    requestService.removeHeaderCookie("accessToken");
    requestService.removeHeaderCookie("refreshToken");
    return ResponseEntity.ok(ResultData.of(1, "로그아웃 성공"));
  }
}
