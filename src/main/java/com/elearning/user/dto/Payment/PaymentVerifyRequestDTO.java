package com.elearning.user.dto.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyRequestDTO {
  private String impUid;
  private String merchantUid;
  private BigDecimal expectedAmount; // 프론트에서 계산한 총 결제 금액
  private List<Long> courseIds;      // 결제할 강의들의 ID 배열
  private Long couponMappingId;      // 사용할 쿠폰의 매핑 ID (null이면 쿠폰 미사용)
}
