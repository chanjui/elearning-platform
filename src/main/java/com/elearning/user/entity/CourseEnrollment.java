package com.elearning.user.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.course.entity.Course;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courseEnrollment")
@Getter
@Setter
public class CourseEnrollment extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;
    
    @Column(name = "enrolledAt")
    private LocalDateTime enrolledAt = LocalDateTime.now();
    
    @Column(precision = 5, scale = 2)
    private BigDecimal progress = BigDecimal.ZERO;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean completionStatus = false;
} 