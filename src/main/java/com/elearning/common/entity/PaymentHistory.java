package com.elearning.common.entity;

import com.elearning.instructor.entity.Instructor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "paymentHistory")
@Getter
@Setter
public class PaymentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paymentId", nullable = false)
    private Payment payment;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructorId", nullable = false)
    private Instructor instructor;

    @Column(nullable = false, updatable = false)
    private LocalDateTime regDate = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
      this.regDate = LocalDateTime.now();
    }
} 