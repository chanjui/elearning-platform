package com.elearning.user.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistoryDTO {
  private Long paymentId;        // 결제 ID (payment 테이블 참조)
  private Long instructorId;     // 강사 ID (instructor 테이블 참조)
  private int amount;            // 실수령액
  private double feeRate;        // 수수료율 (%)
  private boolean isDel;         // 정산 상태 (0: 예정, 1: 완료)
}
