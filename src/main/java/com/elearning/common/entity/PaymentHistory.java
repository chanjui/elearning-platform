package com.elearning.common.entity;

import com.elearning.instructor.entity.Instructor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
} 