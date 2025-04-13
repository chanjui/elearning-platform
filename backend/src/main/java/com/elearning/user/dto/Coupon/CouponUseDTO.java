package com.elearning.user.dto.Coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CouponUseDTO {
  private Long couponMappingId;  // 사용자 쿠폰 매핑 ID
  private Long courseId;         // 적용할 강의 ID
  private Boolean isDel;
}
