package com.elearning.user.service;

import com.elearning.user.repository.EmailRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

  private final JavaMailSender emailSender;
  private final EmailRepository emailRepository;

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

  // 메일 양식 작성
  public MimeMessage createEmailForm(String email, String authCode) throws MessagingException, UnsupportedEncodingException {
    String setFrom = "eLearning0326@gmail.com";
    String toEmail = email;
    String title = "회원가입 인증 코드";

    MimeMessage message = emailSender.createMimeMessage();
    message.addRecipients(MimeMessage.RecipientType.TO, toEmail);
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

    message.setFrom(setFrom);
    message.setText(msgOfEmail, "utf-8", "html");

    return message;
  }

  // 이메일 전송
  public String sendEmail(String email) throws MessagingException, UnsupportedEncodingException {
    try {
      String authCode = createCode(); // 인증 코드 생성
      MimeMessage emailForm = createEmailForm(email, authCode); // 이메일 양식 생성
      emailSender.send(emailForm); // 이메일 발송
      emailRepository.saveAuthCode(email, authCode); // 인증 코드 저장
      return authCode; // 인증 코드 반환
    } catch (MessagingException | UnsupportedEncodingException e) {
      // 이메일 발송 실패 시 예외 처리
      throw new RuntimeException("이메일 발송에 실패했습니다. 다시 시도해주세요.");
    }
  }

}
