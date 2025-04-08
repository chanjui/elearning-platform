package com.elearning.common.config;

import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class JwtProvider {
  @Value("${custom.jwt.secretKey}")
  private String secretKeyCode;
  private SecretKey secretKey;

  public SecretKey getSecretKey() {
    if (secretKey == null) {
      String encoding = Base64.getEncoder().encodeToString(secretKeyCode.getBytes());
      secretKey = Keys.hmacShaKeyFor(secretKeyCode.getBytes(StandardCharsets.UTF_8));
    }
    return secretKey;
  }

  // 토큰 생성
  public String genToken(Map<String, Object> map, int seconds) {
    long now = new Date().getTime();
    Date accessTokenExpiresIn = new Date(now + seconds * 1000L);

    JwtBuilder jwtBuilder = Jwts.builder()
        .subject("elearning")
        .expiration(accessTokenExpiresIn);

    Set<String> keys = map.keySet();
    Iterator<String> it = keys.iterator();
    while (it.hasNext()) {
      String key = it.next(); // map에 저장된 key
      Object value = map.get(key); // map에 해당 키로 저장된 값
      jwtBuilder.claim(key, value);
    }
    return jwtBuilder.signWith(getSecretKey()).compact();
  }

  // 토큰 검증
  public boolean verify(String token) {
    boolean value = true;
    try {
      Jwts.parser().verifyWith(getSecretKey())
          .build()
          .parseSignedClaims(token);
    } catch (Exception e) { // 토큰의 인증이 안되면 예외가 발생함
      e.printStackTrace();
      value = false; // 요놈이 굉장히 중요함
    }
    return value;
  }

  // 토큰에 있는 정보 반환
  public Map<String, Object> getClaims(String token) {
    return Jwts.parser().verifyWith(getSecretKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }

  // AccessToken을 반환
  public String getAccessToken(Map<String, Object> map) {
    return genToken(map, 60 * 30);
  }

  // RefreshToken을 반환
  public String getRefreshToken(Map<String, Object> map) {
    return genToken(map, 60 * 60 * 24 * 100); // 100일
  }

  public Long getUserId(String token) {
    Map<String, Object> claims = getClaims(token);
    Object id = claims.get("id");
    //System.out.println(">> claim id: " + id + " (" + id.getClass() + ")");
    return (id instanceof Integer) ? ((Integer) id).longValue() : (Long) id;
  }

  // Authorization 헤더에서 Bearer 토큰 추출
  public String resolveToken(HttpServletRequest request) {
    String bearer = request.getHeader("Authorization");
    if (bearer != null && bearer.startsWith("Bearer ")) {
      return bearer.substring(7);
    }
    return null;
  }

}
