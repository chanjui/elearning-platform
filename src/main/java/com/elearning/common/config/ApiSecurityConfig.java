package com.elearning.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApiSecurityConfig {

  @Bean
  public SecurityFilterChain apiFilterChain(HttpSecurity http, JwtAuthorizationFilter jwtAuthorizationFilter) throws Exception{
    http.csrf(AbstractHttpConfigurer::disable)
      .headers(headers -> headers.frameOptions(
        HeadersConfigurer.FrameOptionsConfig::sameOrigin))
      .securityMatcher("/api/**") // 설정된 경로로 들어오는 모든 것들 검사
      .authorizeHttpRequests( // 요청에 대한 권한을 지정
        authorize -> authorize
          // .requestMatchers("/api/*/user/**", "/api/*/user/**").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/user/join").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/user/login").permitAll()
          .requestMatchers(HttpMethod.POST, "/api/user/logout").permitAll()
          // 뭐가 들어오든 간에 bbs나 members인 경우 허락해줌
          .anyRequest().authenticated())
      .csrf(csrf -> csrf.disable()
        // csrf : 토큰 // 토큰 검사 비활성화
      ).httpBasic(
        httpBasic -> httpBasic.disable() //httpBasic 로그인 방법 비활성화
      ).formLogin(
        form -> form.disable()  // 폼 로그인 방식 비활성화
      ).sessionManagement(
        sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        // 세션 비활성화
      ).addFilterBefore( jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}