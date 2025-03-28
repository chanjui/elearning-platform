package com.elearning.common.config;

import com.elearning.common.ResultData;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

  private final RequestService requestService;
  private final UserService userService;

  @Override
  @SneakyThrows
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    if(request.getRequestURI().equals("/api/user/login") ||
      request.getRequestURI().equals("/api/user/logout")){
      filterChain.doFilter(request, response);
      return;
    }   // 로그인과 로그아웃은 통과시킨다
    // accessToken 검증과 refreshToken 발급
    String accessToken = requestService.getCookie("accessToken");
    if(!accessToken.isBlank()){
      String newAccessToken = accessToken;

      if(!userService.validateToken(accessToken)){
        String refreshToken = requestService.getCookie("refreshToken");
        ResultData<String> resultData = userService.refreshAccessToken(refreshToken);
        newAccessToken = resultData.getData();
        requestService.setHeaderCookie("accessToken", newAccessToken);
      }

      JwtUser jwtUser = userService.getUserFromAccessToken(newAccessToken);
      // 인가 처리
      requestService.setMember(jwtUser);
    }
    filterChain.doFilter(request, response);
  }
}
