package com.elearning.user.repository;

import org.springframework.stereotype.Repository;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmailRepository {

  // 이메일과 인증번호 임시 저장을 위한 Map
  private final ConcurrentHashMap<String, String> emailAuthCodeMap = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Boolean> emailVerifiedMap = new ConcurrentHashMap<>();

  // 이메일과 인증코드 저장
  public void saveAuthCode(String email, String authCode) {
    emailAuthCodeMap.put(email, authCode);
    emailVerifiedMap.put(email, false); // 인증 시도를 처음 하므로 false로 초기화
  }

  // 이메일로 인증코드 조회
  public String getAuthCode(String email) {
    return emailAuthCodeMap.get(email);
  }

  // 인증 성공 후 인증코드 삭제
  public void verifyComplete(String email) {
    emailVerifiedMap.put(email, true); // true로 설정 (인증 완료)
    emailAuthCodeMap.remove(email);    // 인증 코드 삭제
  }

  // 인증 완료 여부 조회
  public boolean isVerified(String email) {
    return emailVerifiedMap.getOrDefault(email, false);
  }
}
