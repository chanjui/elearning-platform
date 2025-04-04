
package com.elearning.user.service;

import com.elearning.user.repository.EmailRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

  @Qualifier("gmailMailSender")
  private final JavaMailSender gmailMailSender;

  @Qualifier("naverMailSender")
  private final JavaMailSender naverMailSender;
  private final EmailRepository emailRepository;

  @Value("${email.auth-code-expiration-time}")
  private long codeExpirationTime;

  // 인증번호 6자리 무작위 생성 및 반환
  public String createCode() {
    Random random = new Random();
    StringBuilder key = new StringBuilder();

    for (int i = 0; i < 6; i++) {
      int idx = random.nextInt(3);
      switch (idx) {
        case 0:
          key.append((char) ((int) random.nextInt(26) + 97)); // 소문자
          break;
        case 1:
          key.append((char) ((int) random.nextInt(26) + 65)); // 대문자
          break;
        case 2:
          key.append(random.nextInt(9)); // 숫자
          break;
      }
    }
    return key.toString(); // 생성된 인증 코드 반환
  }

  // 인증번호 검증
  public boolean verifyEmailAuthCode(String email, String inputAuthCode) {
    String storedAuthCode = emailRepository.getAuthCode(email);
    Long storedTimestamp = emailRepository.getAuthCodeTimestamp(email);

    // 유효 시간 체크
    if (storedAuthCode == null || storedTimestamp == null || System.currentTimeMillis() > storedTimestamp + codeExpirationTime) {
      return false; // 인증 코드가 없거나, 만료된 경우
    }

    boolean isValid = inputAuthCode.equals(storedAuthCode);

    if (isValid) {
      emailRepository.verifyComplete(email); // 인증 완료 처리
    }
    return isValid;
  }

  // 이메일 인증 완료 여부 체크
  public boolean isEmailVerified(String email) {
    return emailRepository.isVerified(email);
  }

  // 받는 이메일에 따라 메일 발송기 선택
  private JavaMailSender resolveMailSender(String email) {
    if (email.endsWith("@naver.com")) {
      return naverMailSender;
    }
    return gmailMailSender;
  }

  // 메일 양식 작성
  public MimeMessage createEmailForm(JavaMailSender sender, String email, String authCode) throws MessagingException, UnsupportedEncodingException {
    String title = "회원가입 인증 코드";

    MimeMessage message = sender.createMimeMessage();
    message.addRecipients(MimeMessage.RecipientType.TO, email);
    message.setSubject(title);

    // 메일 내용
    String msgOfEmail = "<div style='margin:20px;'>";
    msgOfEmail += "<h1> 안녕하세요, eLearning입니다. </h1>";
    msgOfEmail += "<br>";
    msgOfEmail += "<p>아래 인증 코드를 입력해주세요.</p>";
    msgOfEmail += "<br>";
    msgOfEmail += "<div align='center' style='border:1px solid black; font-family:verdana;'>";
    msgOfEmail += "<h3 style='color:blue;'>회원가입 인증 코드입니다.</h3>";
    msgOfEmail += "<div style='font-size:130%'>";
    msgOfEmail += "CODE : <strong>" + authCode + "</strong><div><br/>";
    msgOfEmail += "</div>";

    // 보낸 사람 주소 설정 (자동)
    String from;
    if (sender instanceof JavaMailSenderImpl) {
      from = ((JavaMailSenderImpl) sender).getUsername();
    } else {
      from = "elearning0326@gmail.com"; // fallback
    }

    message.setFrom(from);
    message.setText(msgOfEmail, "utf-8", "html");

    return message;
  }

  // 이메일 전송
  public String sendEmail(String email) throws MessagingException, UnsupportedEncodingException {
    try {
      String authCode = createCode(); // 인증 코드 생성
      JavaMailSender sender = resolveMailSender(email);
      MimeMessage message = createEmailForm(sender, email, authCode); // 이메일 양식 생성
      sender.send(message);

      long expirationTime = System.currentTimeMillis() + codeExpirationTime; // 만료 시간 계산
      emailRepository.saveAuthCode(email, authCode); // 인증 코드 저장
      emailRepository.saveAuthCodeTimestamp(email, expirationTime); // 인증 코드 만료 시간 저장
      emailRepository.saveVerifiedStatus(email, false); // 이메일 인증 상태를 false로 초기화 (인증이 완료되지 않음)

      return authCode; // 인증 코드 반환
    } catch (MessagingException | UnsupportedEncodingException e) {
      // 이메일 발송 실패 시 예외 처리
      throw new RuntimeException("이메일 발송에 실패했습니다. 다시 시도해주세요.");
    }
  }

  // 인증 코드 재발급
  public String reissueAuthCode(String email) throws MessagingException, UnsupportedEncodingException {
    String newCode = createCode();
    long newExpirationTime = System.currentTimeMillis() + codeExpirationTime; // 새로운 만료 시간 계산

    emailRepository.saveAuthCode(email, newCode);  // 새로운 인증 코드 저장
    emailRepository.saveAuthCodeTimestamp(email, newExpirationTime);  // 새로운 만료 시간 저장
    emailRepository.saveVerifiedStatus(email, false); // 이메일 인증 상태를 false로 초기화 (인증이 완료되지 않음)

    // 새로운 인증 코드 발급 후 이메일 재전송
    JavaMailSender sender = resolveMailSender(email);
    MimeMessage message = createEmailForm(sender, email, newCode); // 이메일 양식 생성
    sender.send(message);

    return newCode; // 새로 발급된 인증 코드 반환
  }

}
