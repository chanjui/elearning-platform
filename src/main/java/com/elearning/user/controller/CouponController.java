// package com.elearning.user.controller;
//
// import com.elearning.common.ResultData;
// import com.elearning.user.dto.Coupon.CouponUseDTO;
// import com.elearning.user.dto.Coupon.UserCouponDTO;
// import com.elearning.user.service.Coupon.CouponService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.web.bind.annotation.*;
//
// import java.util.List;
//
// @RestController
// @RequestMapping("/api/coupons")
// @RequiredArgsConstructor
// public class CouponController {
//   private final CouponService couponService;
//
//   // 사용자가 보유한 모든 쿠폰 목록 조회
//   @GetMapping("/user/{userId}")
//   public ResultData<List<UserCouponDTO>> getUserCoupons(@PathVariable Long userId) {
//     List<UserCouponDTO> coupons = couponService.getUserCoupons(userId);
//     return ResultData.of(1, "쿠폰 목록 조회 성공", coupons);
//   }
//
//   // 특정 강의에 적용 가능한 쿠폰 목록 조회
//   @GetMapping("/available")
//   public ResultData<List<UserCouponDTO>> getAvailableCoupons(
//     @RequestParam Long userId,
//     @RequestParam Long courseId) {
//     List<UserCouponDTO> coupons = couponService.getAvailableCouponsForCourse(userId, courseId);
//     return ResultData.of(1, "적용 가능한 쿠폰 조회 성공", coupons);
//   }
//
//   // 쿠폰 사용 처리
//   @PostMapping("/use")
//   public ResultData<String> useCoupon(@RequestBody CouponUseDTO couponUseDTO) {
//     boolean result = couponService.useCoupon(couponUseDTO);
//     if (result) {
//       return ResultData.of(1, "쿠폰이 성공적으로 적용되었습니다.");
//     } else {
//       return ResultData.of(0, "쿠폰 적용에 실패했습니다.");
//     }
//   }
// }