package com.elearning.user.controller;

import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.Payment.PaymentResponseDTO;
import com.elearning.user.dto.Payment.PaymentVerifyRequestDTO;
import com.elearning.user.service.Payment.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// // Spring Security를 통해 인증된 사용자 정보를 받아오기 위한 어노테이션 예시
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import com.elearning.user.security.CustomUserDetails; // 사용자 정보를 담은 CustomUserDetails 클래스

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
  private final PaymentService paymentService;
  private final JwtProvider jwtProvider;

  /**
   * 프론트엔드에서 결제 완료 후 imp_uid와 merchant_uid, courseId를 전송하면
   * Iamport API를 호출하여 결제 정보를 검증하고, DB에 결제 내역을 저장한 후 결과를 반환합니다.

   // * @param paymentRequest 프론트엔드에서 전달받은 결제 검증 요청 DTO
   // * @param user           인증된 사용자 정보 (JWT 토큰으로부터)
   * @return PaymentResponseDto - 결제 검증 결과
   */
  @PostMapping("/verify")
  public ResponseEntity<PaymentResponseDTO> verifyPaymentV2(
    @RequestBody PaymentVerifyRequestDTO paymentRequest, HttpServletRequest request
  ) {
    // JwtProvider의 resolveToken() 메서드를 통해 Authorization 헤더에서 JWT 토큰을 추출합니다.
    String jwtToken = jwtProvider.resolveToken(request);
    if (jwtToken == null || jwtToken.isBlank()) {
      return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, "인증 토큰이 없습니다."));
    }
    // PaymentService에 결제 검증 요청 및 JWT 토큰 전달
    PaymentResponseDTO result = paymentService.verifyPayment(paymentRequest, jwtToken);
    if (result.isSuccess()) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }
}
