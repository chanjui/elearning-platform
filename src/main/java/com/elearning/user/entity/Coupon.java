package com.elearning.user.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.course.entity.Course;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "coupon")
@Getter
@Setter
public class Coupon extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;
    
    @Column(nullable = false, length = 255)
    private String code;
    
    @Column(nullable = false)
    private Integer discount;
} 