package com.elearning.user.service.Payment;

import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.Payment.PaymentResponseDTO;
import com.elearning.user.repository.PaymentRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment; // 아임포트의 Payment 클래스
import com.siot.IamportRestClient.request.CancelData;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentRefundService {
  private static final Logger logger = LoggerFactory.getLogger(PaymentRefundService.class);

  private final JwtProvider jwtProvider;
  private final PaymentRepository paymentRepository;

  @Value("${iamport.apiKey}")
  private String apiKey;

  @Value("${iamport.apiSecret}")
  private String apiSecret;

  private IamportClient iamportClient;

  @PostConstruct
  public void init() {
    iamportClient = new IamportClient(apiKey, apiSecret);
    logger.info("IamportClient (refund) initialized with apiKey: {} and apiSecret: [PROTECTED]", apiKey);
  }

  /**
   * 결제 취소(환불) 메서드
   * @param impUid  결제 내역을 식별할 impUid (Payment 테이블의 고유 식별 값)
   * @param cancelAmount 환불 금액 (전체 환불이면 결제 금액과 동일)
   * @param jwtToken     사용자 JWT 토큰 (추가 인증 처리에 활용 가능)
   * @return 결제 취소 결과를 담은 PaymentResponseDTO
   */
  public PaymentResponseDTO cancelPayment(String impUid,
                                          BigDecimal cancelAmount,
                                          String jwtToken) {
    try {
      // 1. CancelData 생성자 사용 (merchantUid를 키로 사용하는 경우 -> isMerchantUid = true)
      // 1) CancelData 생성자 (3개 인자) 사용
      CancelData cancelData = new CancelData(impUid, true, cancelAmount);

      // 2. 결제 취소 요청
      IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
      Payment refundResult = cancelResponse.getResponse();
      logger.info("Iamport refund response: {}", refundResult);

      // 3. 환불 결과 상태 확인
      if (refundResult == null || !"cancelled".equalsIgnoreCase(refundResult.getStatus())) {
        logger.error("Refund failed, Iamport response status: {}",
          refundResult != null ? refundResult.getStatus() : "null");
        return new PaymentResponseDTO(false, "환불 실패: Iamport 상태 "
          + (refundResult != null ? refundResult.getStatus() : "null"), null);
      }

      // 4. DB의 Payment 테이블 업데이트 (status=1, cancelDate 설정)
      com.elearning.common.entity.Payment paymentRecord = paymentRepository.findByImpUid(impUid)
        .orElseThrow(() -> new RuntimeException("결제 내역을 찾을 수 없습니다. impUid=" + impUid));

      paymentRecord.setStatus(1);  // 1: 결제 취소
      paymentRecord.setCancelDate(LocalDateTime.now());
      paymentRepository.save(paymentRecord);
      logger.info("Payment record updated for refund: {}", paymentRecord);

      return new PaymentResponseDTO(true, "환불이 성공적으로 처리되었습니다.", null);
    } catch (IamportResponseException e) {
      logger.error("Iamport API 환불 오류: ", e);
      return new PaymentResponseDTO(false, "환불 실패: Iamport API 오류 - " + e.getMessage(), null);
    } catch (Exception e) {
      logger.error("환불 처리 중 예외 발생: ", e);
      return new PaymentResponseDTO(false, "환불 처리 중 오류가 발생했습니다.", null);
    }
  }
}