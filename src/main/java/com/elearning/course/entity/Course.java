package com.elearning.course.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.instructor.entity.Instructor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "course")
@Getter
@Setter
public class Course extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructorId", nullable = false)
    private Instructor instructor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", nullable = false)
    private Category category;
    
    @Column(nullable = false, length = 100)
    private String subject;
    
    @Column(length = 255)
    private String thumbnailUrl;
    
    @Column(length = 255)
    private String backImageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 255)
    private String target;
    
    @Column(nullable = false)
    private Integer price = 0;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal discountRate = BigDecimal.ZERO;
    
    @Column
    private LocalDateTime updateDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.PREPARING;
    
    public enum CourseStatus {
        PREPARING, ACTIVE, CLOSED
    }
} 