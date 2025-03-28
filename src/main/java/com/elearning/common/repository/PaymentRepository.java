package com.elearning.common.repository;

import com.elearning.common.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

  // 강사의 강의로 발생한 총 수익 (결제 완료 상태만 합산)
  @Query("SELECT COALESCE(SUM(p.price), 0) " +
    "FROM Payment p JOIN p.course c " +
    "WHERE c.instructor.id = :instructorId AND p.status = 1")
  Long findTotalRevenueByInstructorId(Long instructorId);

  // 특정 연월에 대한 수익 (예: 이번 달)
  @Query("SELECT COALESCE(SUM(p.price), 0) " +
    "FROM Payment p JOIN p.course c " +
    "WHERE c.instructor.id = :instructorId " +
    "  AND p.status = 1 " +
    "  AND FUNCTION('YEAR', p.regDate) = :year " +
    "  AND FUNCTION('MONTH', p.regDate) = :month")
  Long findMonthlyRevenueByInstructorId(Long instructorId, int year, int month);
}
