package com.elearning.common.entity;

import com.elearning.instructor.entity.Instructor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "paymentHistory")
@Getter
@Setter
public class PaymentHistory extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "paymentId", nullable = false)
  private Payment payment;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "instructorId", nullable = false)
  private Instructor instructor;

  @Column(nullable = false)
  private Integer amount; // 실수령액

  @Column(nullable = false, precision = 5, scale = 2)
  private BigDecimal feeRate = BigDecimal.valueOf(30.00); // 수수료율 (%)
}
