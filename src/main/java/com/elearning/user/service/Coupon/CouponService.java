// package com.elearning.user.service.Coupon;
//
// import com.elearning.user.dto.Coupon.CouponUseDTO;
// import com.elearning.user.dto.Coupon.UserCouponDTO;
// import com.elearning.user.entity.Coupon;
// import com.elearning.user.entity.CouponUserMapping;
// import com.elearning.user.repository.CouponUserMappingRepository;
// import com.elearning.user.repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;
//
// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;
// import java.util.stream.Collectors;
//
// @Service
// @RequiredArgsConstructor
// public class CouponService {
//   private final CouponUserMappingRepository couponUserMappingRepository;
//   private final UserRepository userRepository;
//
//   // 사용자가 보유한 모든 쿠폰 목록 조회
//   @Transactional(readOnly = true)
//   public List<UserCouponDTO> getUserCoupons(Long userId) {
//     List<CouponUserMapping> userCoupons = couponUserMappingRepository.findAllByUserId(userId);
//
//     return userCoupons.stream()
//       .filter(mapping -> mapping.() != null && mapping.getIsDel() == 0)  // 사용되지 않은 쿠폰만 반환
//       .map(this::mapToUserCouponDTO)
//       .collect(Collectors.toList());
//   }
//
//   // 특정 강의에 적용 가능한 쿠폰 목록 조회
//   @Transactional(readOnly = true)
//   public List<UserCouponDTO> getAvailableCouponsForCourse(Long userId, Long courseId) {
//     List<CouponUserMapping> availableCoupons =
//       couponUserMappingRepository.findValidCouponsForUserAndCourse(userId, courseId);
//
//     return availableCoupons.stream()
//       .filter(mapping -> mapping.getIsDel() != null && mapping.getIsDel() == 0)  // 사용되지 않은 쿠폰만 반환
//       .map(this::mapToUserCouponDTO)
//       .collect(Collectors.toList());
//   }
//
//   // 쿠폰 사용 처리
//   @Transactional
//   public boolean useCoupon(CouponUseDTO couponUseDTO) {
//     Optional<CouponUserMapping> optionalMapping = couponUserMappingRepository.findById(couponUseDTO.getCouponMappingId());
//
//     if (!optionalMapping.isPresent()) {
//       throw new RuntimeException("존재하지 않는 쿠폰입니다.");
//     }
//
//     CouponUserMapping couponMapping = optionalMapping.get();
//
//     // 이미 사용된 쿠폰인지 확인
//     if (couponMapping.getIsDel() != null && couponMapping.getIsDel() == 1) {
//       throw new RuntimeException("이미 사용된 쿠폰입니다.");
//     }
//
//     // 특정 강의에만 적용 가능한 쿠폰인 경우 확인
//     Coupon coupon = couponMapping.getCoupon();
//     if (coupon.getCourse() != null && !coupon.getCourse().getId().equals(couponUseDTO.getCourseId())) {
//       throw new RuntimeException("해당 강의에 적용할 수 없는 쿠폰입니다.");
//     }
//
//     // 쿠폰 사용 처리
//     couponMapping.setIsDel(1);
//     couponMapping.setUseDate(LocalDateTime.now());
//     couponUserMappingRepository.save(couponMapping);
//
//     return true;
//   }
//
//   // Entity를 DTO로 변환하는 매핑 메소드
//   private UserCouponDTO mapToUserCouponDTO(CouponUserMapping mapping) {
//     Coupon coupon = mapping.getCoupon();
//
//     return UserCouponDTO.builder()
//       .id(mapping.getId())
//       .couponId(coupon.getId())
//       .code(coupon.getCode())
//       .discount(coupon.getDiscount())
//       .courseId(coupon.getCourse() != null ? coupon.getCourse().getId() : null)
//       .courseName(coupon.getCourse() != null ? coupon.getCourse().getSubject() : "전체 강의 적용")
//       .regDate(mapping.getRegDate())
//       .isDel(mapping.getIsDel())
//       .build();
//   }
// }