package com.elearning.user.service.login;

import com.elearning.common.config.JwtUser;
import com.elearning.user.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import java.util.Arrays;
import java.util.Optional;

@Component
@RequestScope // 요청이 발생할 때마다 Bean객체가 생성되어 자동적으로 주입됨
@RequiredArgsConstructor
public class RequestService {
  private final HttpServletRequest request;
  private final HttpServletResponse response;
  private final EntityManager entityManager;


  private User user;

  // JwtAuthorizationFilter에 있는 getCookie 가져오기
  public String getCookie(String name){
    Cookie[] cookies = request.getCookies();

    if (cookies == null) {
      return null;
    }

    return Arrays.stream(cookies) // cookies배열에서 스트림 생성
      .filter(cookie -> cookie.getName().equals(name))  //name과 같은 이름을 가진 쿠키만 필터링 함
      .findFirst()  // 필터링된 결과가 여러개가 있을 수 있는데 첫 번째 것만 가져오겠다
      .map(Cookie::getValue)  // 찾은 쿠키 값 가져옴 Cookie를 반환하는 getValue함수를 참조
      .orElse("");  // 필터링된 쿠키가 없다면 공백을 반환함
  }

  // JWTAuthorizationFilter에 있는 setHeaderCookie 가져오기
  public void setHeaderCookie(String tokenName, String token){
    ResponseCookie cookie = ResponseCookie.from(tokenName, token)
      .path("/")
      .sameSite("None")
      .secure(true)
      .httpOnly(true)
      .build();
    response.addHeader("Set-Cookie", cookie.toString());
  }

  // JWTAuthorizationFilter에 있는 인가처리된 부분 가져오기
  public void setMember(JwtUser jwtUser){
    SecurityContextHolder.getContext().setAuthentication(
      jwtUser.getAuthentication()
    );
  }

  // 스프링 Context (Spring SecurityContextHolder : 보안 컨텍스트) 에서
  public JwtUser getJwtUser(){
    // 보안 컨텍스트를 얻어 그것이 NULL인 경우는 Optional의 empty를 반환함
    return Optional.ofNullable(SecurityContextHolder.getContext())  // 컨텍스트에서 현재
      .map(context -> context.getAuthentication())
      // 인증객체(Authentication)를 가져옴 정상적이면 우리가
      .filter(authentication -> authentication.getPrincipal() instanceof JwtUser)
      // 저장한 JwtUser일 것이다. 아니면 orElse가 발생하며 null이 반환
      .map(authentication ->
        (JwtUser)authentication.getPrincipal())
      .orElse(null);
  }

  private boolean checkLogin(){
    return getJwtUser() != null;
  }

  private boolean isLogout(){
    return !checkLogin(); // 로그인 상태면 false 반환
  }

  // 다음은 현재 인증된 사용자의 Member를 찾아 반환하는 기능
  public User getUser(){
    // 로그인 상태인지? 확인
    if(!checkLogin())
      return null;
    if(user == null)
      user = entityManager.getReference(User.class, getJwtUser().getId()); // 아이디를 던져서 찾기
    // entityManager는 JPA기능이며 getReference함수는 DB를 로드하는 기능이며
    // 인자가 Member라는 Entity로 인해 Member테이블 인식하여 두 번째 인자인 mid로 검색함
    return user;
  }

  // 로그아웃
  public void removeHeaderCookie(String tokenName){
    ResponseCookie cookie = ResponseCookie.from(tokenName, null)
      .path("/")
      .sameSite("None")
      .secure(true)
      .httpOnly(true)
      .maxAge(0)
      .build();
    response.addHeader("Set-Cookie", cookie.toString());
  }
}