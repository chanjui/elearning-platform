package com.elearning.user.repository;

import org.springframework.stereotype.Repository;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmailRepository {

  // 이메일과 인증번호 임시 저장을 위한 Map
  private final ConcurrentHashMap<String, String> emailAuthCodeMap = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Long> emailAuthCodeTimestampMap = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Boolean> emailVerifiedMap = new ConcurrentHashMap<>();

  // 이메일과 인증코드 저장
  public void saveAuthCode(String email, String authCode) {
    emailAuthCodeMap.put(email, authCode);
  }

  // 이메일과 인증코드의 만료 시간 저장
  public void saveAuthCodeTimestamp(String email, long expirationTime) {
    emailAuthCodeTimestampMap.put(email, expirationTime);
  }

  // 이메일 인증 상태 저장
  public void saveVerifiedStatus(String email, boolean status) {
    emailVerifiedMap.put(email, status);
  }

  // 이메일로 인증코드 조회
  public String getAuthCode(String email) {
    return emailAuthCodeMap.get(email);
  }

  // 인증 코드의 만료 시간 조회
  public Long getAuthCodeTimestamp(String email) {
    return emailAuthCodeTimestampMap.get(email);
  }

  // 인증 성공 후 인증코드 삭제
  public void verifyComplete(String email) {
    emailVerifiedMap.put(email, true);  // 인증 완료 처리
    removeAuthCode(email);  // 인증 코드 및 만료 시간 삭제
  }

  // 인증 완료 여부 조회
  public boolean isVerified(String email) {
    return emailVerifiedMap.getOrDefault(email, false);
  }

  // 이메일로 인증코드 삭제
  public void removeAuthCode(String email) {
    emailAuthCodeMap.remove(email);    // 인증 코드 삭제
    emailAuthCodeTimestampMap.remove(email); // 만료 시간 삭제
  }

  // 만료된 인증코드 여부 확인
  public boolean isAuthCodeExpired(String email) {
    Long expirationTime = emailAuthCodeTimestampMap.get(email);
    return expirationTime == null || System.currentTimeMillis() > expirationTime;
  }
}
