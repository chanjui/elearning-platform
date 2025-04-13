package com.elearning.user.service.Payment;

import com.elearning.common.config.JwtProvider;
import com.elearning.common.entity.PaymentHistory;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.instructor.entity.Instructor;
import com.elearning.user.dto.Payment.PaymentResponseDTO;
import com.elearning.user.dto.Payment.PaymentVerifyRequestDTO;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.PaymentHistoryRepository;
import com.elearning.user.repository.PaymentRepository;
import com.elearning.user.repository.UserRepository;
import com.elearning.user.service.Cart.CartService;
import com.elearning.user.service.Coupon.CouponService;
import com.elearning.user.dto.Coupon.CouponUseDTO;
import com.elearning.user.entity.Coupon;
import com.elearning.user.entity.CouponUserMapping;
import com.elearning.user.repository.CouponUserMappingRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

  private final PaymentRepository paymentRepository;
  private final JwtProvider jwtProvider;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final CartService cartService;
  private final PaymentHistoryService paymentHistoryService;
  private final PaymentHistoryRepository paymentHistoryRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CouponUserMappingRepository couponUserMappingRepository;
  private final CouponService couponService;

  private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

  @Value("${iamport.apiKey}")
  private String apiKey;

  @Value("${iamport.apiSecret}")
  private String apiSecret;

  private IamportClient iamportClient;

  // IamportClient 초기화
  @PostConstruct
  public void init() {
    iamportClient = new IamportClient(apiKey, apiSecret);
    logger.info("IamportClient initialized with apiKey: {} and apiSecret: [PROTECTED]", apiKey);
  }

  // 결제 검증 메서드
  public PaymentResponseDTO verifyPayment(PaymentVerifyRequestDTO request, String jwtToken) {
    try {
      // 1. JWT 토큰에서 사용자 ID 추출
      Long userId = jwtProvider.getUserId(jwtToken);
      logger.info("Extracted userId: {}", userId);
      logger.info("Payment request: impUid={}, merchantUid={}, expectedAmount={}, courseIds={}, couponMappingId={}", 
          request.getImpUid(), request.getMerchantUid(), request.getExpectedAmount(), 
          request.getCourseIds(), request.getCouponMappingId());

      // 2. 쿠폰 검증 및 할인 금액 계산
      BigDecimal couponDiscount = BigDecimal.ZERO;
      if (request.getCouponMappingId() != null) {
        logger.info("쿠폰 매핑 ID {} 처리 시작", request.getCouponMappingId());
        try {
          CouponUserMapping couponMapping = couponUserMappingRepository.findById(request.getCouponMappingId())
              .orElseThrow(() -> new RuntimeException("존재하지 않는 쿠폰입니다."));
          
          logger.info("쿠폰 매핑 조회 성공: userId={}, couponId={}, isDel={}", 
              couponMapping.getUser().getId(), couponMapping.getCoupon().getId(), couponMapping.getIsDel());
          
          // 쿠폰이 이미 사용되었는지 확인
          if (couponMapping.getIsDel()) {
            logger.warn("이미 사용된 쿠폰입니다: {}", request.getCouponMappingId());
            return new PaymentResponseDTO(false, "이미 사용된 쿠폰입니다.", null);
          }

          // 쿠폰의 courseId가 null이 아니면 해당 강의에만 적용 가능한지 확인
          Coupon coupon = couponMapping.getCoupon();
          if (coupon.getCourse() != null && !request.getCourseIds().contains(coupon.getCourse().getId())) {
            logger.warn("해당 강의에 적용할 수 없는 쿠폰입니다: couponId={}, courseId={}, requestedCourseIds={}", 
                coupon.getId(), coupon.getCourse().getId(), request.getCourseIds());
            return new PaymentResponseDTO(false, "해당 강의에 적용할 수 없는 쿠폰입니다.", null);
          }

          // 쿠폰 할인 금액 설정
          couponDiscount = BigDecimal.valueOf(coupon.getDiscount());
          logger.info("쿠폰 할인 금액 설정: {}", couponDiscount);
        } catch (Exception e) {
          logger.error("쿠폰 처리 중 오류 발생: {}", e.getMessage(), e);
          return new PaymentResponseDTO(false, "쿠폰 처리 중 오류가 발생했습니다: " + e.getMessage(), null);
        }
      }

      // 3. Iamport API에서 결제 정보 조회
      IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(request.getImpUid());
      Payment paymentData = iamportResponse.getResponse();
      logger.info("Retrieved paymentData: {}", paymentData);

      if (paymentData == null) {
        logger.error("Payment data is null for impUid: {}", request.getImpUid());
        return new PaymentResponseDTO(false, "결제 정보가 조회되지 않습니다.", null);
      }

      // 4. 결제 상태 검증
      String status = paymentData.getStatus();
      logger.info("Payment status: {}", status);
      if (!"paid".equals(paymentData.getStatus())) {
        logger.error("Payment status is not 'paid': {}", status);
        return new PaymentResponseDTO(false, "결제 상태가 완료되지 않았습니다. (status: " + paymentData.getStatus() + ")", null);
      }

      // 5. 결제 금액 검증 (쿠폰 할인 적용)
      BigDecimal amountPaid = paymentData.getAmount();
      BigDecimal expectedAmountWithCoupon = request.getExpectedAmount().subtract(couponDiscount);
      
      if (amountPaid.compareTo(expectedAmountWithCoupon) != 0) {
        logger.error("Payment amount mismatch. Paid: {}, Expected with coupon: {}", 
            amountPaid, expectedAmountWithCoupon);
        return new PaymentResponseDTO(false, "결제 금액이 일치하지 않습니다.", null);
      }

      // 6. 결제 정보를 Payment 엔티티에 저장
      List<Course> courses = new ArrayList<>();
      int sumDiscountedPrices = 0;
      for (Long courseId : request.getCourseIds()) {
        Course course = courseRepository.findById(courseId)
          .orElseThrow(() -> new RuntimeException("존재하지 않는 강의입니다. courseId: " + courseId));
        courses.add(course);
        // 강의 원가와 할인율을 이용해 할인된 가격 계산
        BigDecimal originalPrice = BigDecimal.valueOf(course.getPrice());
        // 할인율은 course.getDiscountRate()로 가져오는데, 이는 예를 들어 25.00(25%) 형식으로 되어있다고 가정
        BigDecimal discountRate = course.getDiscountRate();
        // 할인된 가격 = 원가 × (100 - 할인율) / 100, 소수점은 반올림
        BigDecimal discountedPrice = originalPrice
          .multiply(BigDecimal.valueOf(100).subtract(discountRate))
          .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        
        // 쿠폰 할인이 있는 경우 추가 적용
        if (request.getCouponMappingId() != null) {
          Coupon coupon = couponUserMappingRepository.findById(request.getCouponMappingId())
              .get()
              .getCoupon();
          if (coupon.getCourse() == null || coupon.getCourse().getId().equals(courseId)) {
            discountedPrice = discountedPrice.subtract(couponDiscount);
          }
        }
        
        sumDiscountedPrices += discountedPrice.intValue();
        logger.info("Course id {}: originalPrice={}, discountRate={}, discountedPrice={}, couponDiscount={}",
          courseId, originalPrice, discountRate, discountedPrice, couponDiscount);
      }

      if (sumDiscountedPrices != expectedAmountWithCoupon.intValue()) {
        logger.error("Calculated total discounted price {} does not match expectedAmount with coupon {}.",
          sumDiscountedPrices, expectedAmountWithCoupon);
        return new PaymentResponseDTO(false, "결제 금액 불일치: 계산된 총 할인 금액 " + sumDiscountedPrices + 
            " vs. 전달된 금액 " + expectedAmountWithCoupon, null);
      }

      // 7. 사용자 조회
      User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
      logger.info("User retrieved: {}", user);

      // 8. 각 강의에 대해 Payment 엔티티 생성 및 저장 (강의별 할인 가격으로 저장)
      for (Course course : courses) {
        // 할인된 가격 계산 (위에서 계산한 로직을 다시 사용)
        BigDecimal originalPrice = BigDecimal.valueOf(course.getPrice());
        BigDecimal discountRate = course.getDiscountRate();
        BigDecimal discountedPrice = originalPrice
          .multiply(BigDecimal.valueOf(100).subtract(discountRate))
          .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
        
        // 쿠폰 할인이 있는 경우 추가 적용
        if (request.getCouponMappingId() != null) {
          Coupon coupon = couponUserMappingRepository.findById(request.getCouponMappingId())
              .get()
              .getCoupon();
          if (coupon.getCourse() == null || coupon.getCourse().getId().equals(course.getId())) {
            discountedPrice = discountedPrice.subtract(couponDiscount);
          }
        }

        // 결제 기록을 Payment 엔티티에 저장
        com.elearning.common.entity.Payment paymentRecord = new com.elearning.common.entity.Payment();
        paymentRecord.setUser(user);
        paymentRecord.setCourse(course);
        paymentRecord.setPrice(discountedPrice.intValue());
        paymentRecord.setPaymentMethod(paymentData.getPayMethod());
        paymentRecord.setStatus(0);  // 0: 결제완료
        paymentRecord.setRegDate(LocalDateTime.now());
        // DB에 결제 요청 시 발급받은 impUid 저장 (request 또는 paymentData에서 가져올 수 있음)
        paymentRecord.setImpUid(request.getImpUid());
        paymentRepository.save(paymentRecord);
        logger.info("Payment record saved: {}", paymentRecord);

        // 9. 쿠폰 사용 처리
        if (request.getCouponMappingId() != null) {
          logger.info("쿠폰 사용 처리 시작: couponMappingId={}, courseId={}", 
              request.getCouponMappingId(), course.getId());
          try {
            CouponUseDTO couponUseDTO = CouponUseDTO.builder()
                .couponMappingId(request.getCouponMappingId())
                .courseId(course.getId())
                .isDel(true)
                .build();
            logger.info("쿠폰 사용 DTO 생성: {}", couponUseDTO);
            couponService.useCoupon(couponUseDTO);
            logger.info("쿠폰 사용 처리 완료");
          } catch (Exception e) {
            logger.error("쿠폰 사용 처리 중 오류 발생: {}", e.getMessage(), e);
            // 쿠폰 사용 실패 시에도 결제는 계속 진행
          }
        }

        // 10. 정산 이력 생성
        // 강사 ID 가져오기 (course에서 instructor 가져오기)
        Long instructorId = course.getInstructor().getId();
        // 강사 객체 가져오기
        Instructor instructor = course.getInstructor();

        // 수수료율을 paymentHistory에서 가져오고, 없으면 기본 30%로 설정
        List<PaymentHistory> paymentHistoryList = paymentHistoryRepository.findByInstructorId(instructorId);

        // 여러 개의 PaymentHistory가 있을 수 있으므로, 첫 번째 값을 선택하거나 필요한 로직을 적용
        BigDecimal feeRate = (paymentHistoryList.isEmpty()) ? BigDecimal.valueOf(30.00) : paymentHistoryList.get(0).getFeeRate();

        // 실수령액 계산: 결제 금액에서 수수료를 제외한 금액
        BigDecimal amount = discountedPrice.subtract(discountedPrice.multiply(feeRate).divide(BigDecimal.valueOf(100)));

        // 정산 이력 생성
        PaymentHistory history = new PaymentHistory();
        history.setPayment(paymentRecord); // 결제와 연결
        history.setInstructor(instructor); // 강사의 ID 설정
        history.setAmount(amount.intValue()); // 실수령액 저장
        history.setFeeRate(feeRate); // 수수료율 설정
        paymentHistoryService.savePaymentHistory(history); // paymentHistoryService를 통해 저장
        logger.info("Payment history saved: {}", history);

        // 11. 수강 등록 처리
        CourseEnrollment enrollment = new CourseEnrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setPayment(paymentRecord); // 결제 정보 연결
        courseEnrollmentRepository.save(enrollment);

        logger.info("수강 등록 완료: {}", enrollment);
      }

      // 결제 성공 후, 결제된 강의들을 soft delete 처리
      List<Long> courseIds = request.getCourseIds(); // 결제된 강의 IDs
      for (Long courseId : courseIds) {
        cartService.removeFromCart(userId, courseId); // 각 강의에 대해 removeFromCart 호출
      }

      return new PaymentResponseDTO(true, "결제가 성공적으로 처리되었습니다.", null);

    } catch (IamportResponseException e) {
      logger.error("Iamport API error: ", e);
      return new PaymentResponseDTO(false, "Iamport API 오류: " + e.getMessage(), null);
    } catch (Exception e) {
      logger.error("Exception during payment verification: ", e);
      return new PaymentResponseDTO(false, "네트워크 오류로 결제 정보를 조회할 수 없습니다.", null);
    }
  }
}