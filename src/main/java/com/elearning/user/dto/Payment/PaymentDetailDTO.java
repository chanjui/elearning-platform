package com.elearning.user.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetailDTO {
  private String orderId;        // 주문 번호
  private String impUid;         // 아임포트 imp_uid
  private String courseTitle;
  private String instructor;
  private int originalPrice;
  private int discountPrice;
  private int discountAmount;
  private String payMethod;      // "card"
  private String cardName;       // "신한카드"
  private String cardNumber;     // "****-****-****-1234"
  private String paymentStatus;  // "결제완료" or "환불완료"
  private String paymentDate;    // ISO 포맷으로 저장한 결제 일시
  private String imageUrl;
  private String pgProvider;     // 예: kakaopay, html5_inicis

  // 구매자 정보
  private String buyerName;
  private String buyerEmail;
  private String buyerPhone;
}
