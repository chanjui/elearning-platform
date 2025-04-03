package com.elearning.common.config;

import lombok.Getter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class JwtUser extends User {
  @Getter
  // private String id; // 사용자의 고유 식별자
  //
  // public JwtUser(String id, String username, String password, Collection<? extends GrantedAuthority> authorities) {
  //   super(username, password, authorities); // 부모객체의 생성자 호출
  //   // 그래서 사용자 정보를 초기화함
  //   this.id = id;
  // }
  //
  // // Authentication 객체를 반환하므로 Spring Security에서 인증함
  // public Authentication getAuthentication() {
  //   Authentication auth = new UsernamePasswordAuthenticationToken(
  //       this, this.getPassword(), this.getAuthorities());
  //   return auth;
  // }

  private String id;
  private String email;
  private String nickname;

  public JwtUser(String id, String email, String nickname, String password, Collection<? extends GrantedAuthority> authorities) {
    super(email, password, authorities); // username 역할로 email 사용
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }

  public Authentication getAuthentication() {
    return new UsernamePasswordAuthenticationToken(this, this.getPassword(), this.getAuthorities());
  }
}
