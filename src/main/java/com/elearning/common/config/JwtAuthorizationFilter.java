package com.elearning.common.config;

import com.elearning.common.ResultData;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import com.elearning.common.config.JwtUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

  private final RequestService requestService;
  private final UserService userService;
  private final AntPathMatcher antPathMatcher = new AntPathMatcher();

  @Override
  @SneakyThrows
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {

    // 인증이 필요 없는 경로는 바로 통과
    String path = request.getRequestURI();
    if (isPublicPath(path)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // accessToken 확인
      String accessToken = requestService.getCookie("accessToken");

      if (accessToken != null && !accessToken.isBlank()) {
        // accessToken 유효성 검증
        if (userService.validateToken(accessToken)) {
          JwtUser jwtUser = userService.getUserFromAccessToken(accessToken);
          System.out.println(">> [JwtFilter] JWT에서 추출한 userId = " + jwtUser.getId());
          requestService.setMember(jwtUser);
          request.setAttribute("userId", jwtUser.getId());
        } else {
          // 만료된 토큰인 경우 refreshToken으로 재발급 시도
          String refreshToken = requestService.getCookie("refreshToken");
          if (refreshToken != null && !refreshToken.isBlank()) {
            ResultData<String> resultData = userService.refreshAccessToken(refreshToken);
            String newAccessToken = resultData.getData();
            requestService.setHeaderCookie("accessToken", newAccessToken);

            JwtUser jwtUser = userService.getUserFromAccessToken(newAccessToken);
            requestService.setMember(jwtUser);
            request.setAttribute("userId", jwtUser.getId());
          }
        }
      }
    } catch (Exception e) {
      // 인증 실패 시 다음 필터로 넘어감 (예: 로그인 필요)
     // System.out.println(">> [JwtFilter] 인증 중 예외 발생: " + e.getMessage());
    }

    // 반드시 래핑된 요청 객체 전달
    filterChain.doFilter(request, response);
  }

  private boolean isPublicPath(String path) {
    return antPathMatcher.match("/api/user/**", path)
      || antPathMatcher.match("/api/courses/**", path)
      || antPathMatcher.match("/api/categories/**", path);
  }
}
