package com.elearning.user.repository;

import com.elearning.common.entity.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {

  // 강사 ID로 여러 정산 이력 조회
  List<PaymentHistory> findByInstructorId(Long instructorId);

  // 결제 ID로 여러 강의의 정산 내역 조회
  List<PaymentHistory> findByPaymentId(Long paymentId);


}
