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
import org.springframework.util.AntPathMatcher;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

  private final RequestService requestService;
  private final UserService userService;
  private final AntPathMatcher antPathMatcher = new AntPathMatcher();

  @Override
  @SneakyThrows
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    // 1. 인증이 필요없는 경로는 필터 통과
    String path = request.getRequestURI();
    if (isPublicPath(path)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // 2. accessToken 확인
      String accessToken = requestService.getCookie("accessToken");
      
      // 3. accessToken이 없는 경우
      if (accessToken == null || accessToken.isBlank()) {
        filterChain.doFilter(request, response);
        return;
      }

      // 4. accessToken이 유효한 경우
      if (userService.validateToken(accessToken)) {
        JwtUser jwtUser = userService.getUserFromAccessToken(accessToken);
        requestService.setMember(jwtUser);
        filterChain.doFilter(request, response);
        return;
      }

      // 5. accessToken이 만료된 경우, refreshToken으로 갱신 시도
      String refreshToken = requestService.getCookie("refreshToken");
      if (refreshToken != null && !refreshToken.isBlank()) {
        ResultData<String> resultData = userService.refreshAccessToken(refreshToken);
        String newAccessToken = resultData.getData();
        requestService.setHeaderCookie("accessToken", newAccessToken);
        
        JwtUser jwtUser = userService.getUserFromAccessToken(newAccessToken);
        requestService.setMember(jwtUser);
      }
      
    } catch (Exception e) {
      // 오류 발생시 그냥 다음 필터로 진행 (인증 실패로 처리)
    }
    
    filterChain.doFilter(request, response);
  }

  private boolean isPublicPath(String path) {
    return antPathMatcher.match("/api/user/**", path) ||
           antPathMatcher.match("/api/courses/**", path) ||
           antPathMatcher.match("/api/categories/**", path);
  }
}
