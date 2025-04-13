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

    @Column(columnDefinition = "TEXT")
    private String learning;
    // 이런 걸 배울 수 있어요요
    @Column(columnDefinition = "TEXT")
    private String recommendation;
    // 이런 분들께 추천합니다
    @Column(columnDefinition = "TEXT")
    private String requirement;
    // 선수 지식이 필요한가요?
    @Column(length = 255)
    private String target;

    @Column(nullable = false)
    private Integer price = 0;

    @Column(precision = 5, scale = 2)
    private BigDecimal discountRate = BigDecimal.ZERO;

    @Column
    private LocalDateTime startDate;

    @Column
    private LocalDateTime endDate;

    // @Column(columnDefinition = "TEXT") 를 붙이는 이유: 긴 설명을 저장할 수 있게 하기 위해!
    @Column(columnDefinition = "TEXT")
    private String detailedDescription;

    @Column
    private LocalDateTime updateDate = LocalDateTime.now();

    @Column(length = 50)
    private String viewLimit;

    // @Column(length = 50)
    // private String durationType; 겹치는 영역이라 프론트에서도 주석처리함함

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CourseStatus status = CourseStatus.PREPARING;

    public enum CourseStatus {
        PREPARING, ACTIVE, CLOSED
    }
} 
