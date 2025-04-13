package com.elearning.user.dto.Coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserCouponDTO {
  private Long id;               // 쿠폰 매핑 ID
  private Long couponId;         // 쿠폰 ID
  private String code;           // 쿠폰 코드
  private Integer discount;      // 할인 금액
  private Long courseId;         // 적용 가능한 강의 ID (null이면 전체 강의)
  private String courseName;     // 강의 이름
  private LocalDateTime regDate; // 쿠폰 발급일
  private Boolean isDel;         // 사용 여부 (0: 미사용, 1: 사용)
}
