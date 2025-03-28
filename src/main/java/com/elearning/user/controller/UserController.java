package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.UserDto;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
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

  @PostMapping("/signup")
  public ResultData<UserDto> signup(@RequestBody UserDto userDto) {
    UserDto newUser = userService.signup(
      userDto.getNickname(),
      userDto.getEmail(),
      userDto.getPassword(),
      userDto.getPhone()
    );
    return ResultData.of(1, "success", newUser);
  }

  @GetMapping("/select")
  public Map<String, Object> select() {
    Map<String, Object> map = new HashMap<>();
    map.put("name", "홍길동");
    map.put("age", 20);
    return map;
  }
  

  @PostMapping("/login")
  public ResultData<UserDto> login(@RequestBody UserDto userDto) {
    UserDto loginUser = userService.authAndMakeToken(userDto.getEmail(), userDto.getPassword());

    // 로그인 직후 쿠키 설정 (HttpServletResponse 필요)
    requestService.setHeaderCookie("accessToken", loginUser.getAccessToken());
    requestService.setHeaderCookie("refreshToken", loginUser.getRefreshToken());

    return ResultData.of(1, "success", loginUser);
  }
}
