package com.elearning.user.service.Payment;

import com.elearning.common.entity.Payment;
import com.elearning.course.entity.Course;
import com.elearning.user.dto.Payment.PurchaseHistoryDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.PaymentRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseHistoryService {
  private final PaymentRepository paymentRepository;
  private final UserRepository userRepository;

  // 사용자의 구매 내역을 조회하는 메서드
  public List<PurchaseHistoryDTO> getPurchaseHistory(Long userId) {
    // 사용자 정보 조회
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    // 사용자가 구매한 결제 내역을 조회
    List<Payment> payments = paymentRepository.findByUser(user);

    // Payment 객체를 PurchaseHistoryDTO로 변환하여 반환
    return payments.stream().map(payment -> {
      Course course = payment.getCourse(); // 결제된 강의 정보
      return PurchaseHistoryDTO.builder()
        .orderId(payment.getId().toString())
        .courseTitle(course.getSubject())
        .instructorName(course.getInstructor().getUser().getNickname())
        .paymentMethod(payment.getPaymentMethod())
        .originalPrice(course.getPrice())
        .discountPrice(payment.getPrice())  // 할인된 가격
        .paymentStatus(payment.getStatus() == 0 ? "결제완료" : "환불완료")
        .paymentDate(payment.getRegDate().toString()) // 결제일자
        .imageUrl(course.getThumbnailUrl()) // 강의 이미지 URL
        .build();
    }).collect(Collectors.toList());
  }
}
