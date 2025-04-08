// package com.elearning.user.service.Payment;
//
// import com.elearning.common.config.JwtProvider;
// import com.elearning.user.dto.Payment.PaymentResponseDTO;
// import com.elearning.user.repository.PaymentRepository;
// import com.elearning.user.repository.UserRepository;
// import com.siot.IamportRestClient.IamportClient;
// import com.siot.IamportRestClient.exception.IamportResponseException;
// import com.siot.IamportRestClient.response.IamportResponse;
// import com.siot.IamportRestClient.response.Payment;
// import jakarta.annotation.PostConstruct;
// import lombok.RequiredArgsConstructor;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;
//
// import java.math.BigDecimal;
// import java.time.LocalDateTime;
//
// @Service
// @RequiredArgsConstructor
// public class PaymentRefundService {
//   private static final Logger logger = LoggerFactory.getLogger(PaymentRefundService.class);
//
//   private final JwtProvider jwtProvider;
//   private final PaymentRepository paymentRepository;  // Payment 테이블 관리 리포지토리
//   private final UserRepository userRepository;
//
//   @Value("${iamport.apiKey}")
//   private String apiKey;
//
//   @Value("${iamport.apiSecret}")
//   private String apiSecret;
//
//   private IamportClient iamportClient;
//
//   @PostConstruct
//   public void init() {
//     iamportClient = new IamportClient(apiKey, apiSecret);
//     logger.info("IamportClient (refund) initialized with apiKey: {} and apiSecret: [PROTECTED]", apiKey);
//   }
//
//   /**
//    * 결제 취소(환불) 메서드
//    *
//    * @param merchantUid  결제 내역을 식별할 merchantUid (Payment 테이블의 고유 식별 값)
//    // * @param impUid       아임포트에서 받은 impUid
//    * @param cancelAmount 환불 금액 (전체 환불이면 결제 금액과 동일)
//    * @param reason       환불 사유
//    * @param jwtToken     사용자 JWT 토큰 (필요하다면 추가 인증 처리)
//    * @return 결제 취소 결과를 담은 PaymentResponseDTO
//    */
//
//   public PaymentResponseDTO cancelPayment(String merchantUid,
//                                           BigDecimal cancelAmount,
//                                           String reason,
//                                           String jwtToken) {
//     try {
//       // 1. 아임포트 API를 통해 결제 취소 요청
//       IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid (
//         merchantUid,
//         cancelAmount,
//         reason,
//         false
//       );
//       Payment refundResult = cancelResponse.getResponse();
//       logger.info("Iamport refund response: {}", refundResult);
//
//       // 2. 아임포트 환불 결과 상태 확인
//       if (!"cancelled".equalsIgnoreCase(refundResult.getStatus())) {
//         logger.error("Refund failed, Iamport response status: {}", refundResult.getStatus());
//         return new PaymentResponseDTO(false, "환불 실패: Iamport 상태 " + refundResult.getStatus());
//       }
//
//
//       // 3. DB의 Payment 테이블에서 해당 결제 내역 업데이트 (status를 1로 변경, cancelDate 기록)
//       //  --> 당사 결제 내역 엔티티는 com.elearning.common.entity.Payment 입니다.
//       com.elearning.common.entity.Payment paymentRecord =
//         paymentRepository.findByMerchantUid(merchantUid)
//           .orElseThrow(() -> new RuntimeException("해당 결제 내역을 찾을 수 없습니다. merchantUid: " + merchantUid));
//       paymentRecord.setStatus(1);  // 1: 결제 취소
//       paymentRecord.setCancelDate(LocalDateTime.now());
//       paymentRepository.save(paymentRecord);
//       logger.info("Payment record updated for refund: {}", paymentRecord);
//
//       return new PaymentResponseDTO(true, "환불이 성공적으로 처리되었습니다.");
//     } catch (IamportResponseException e) {
//       logger.error("Iamport API 환불 오류: ", e);
//       return new PaymentResponseDTO(false, "환불 실패: Iamport API 오류 - " + e.getMessage());
//     } catch (Exception e) {
//       logger.error("환불 처리 중 예외 발생: ", e);
//       return new PaymentResponseDTO(false, "환불 처리 중 오류가 발생했습니다.");
//     }
//   }
// }
