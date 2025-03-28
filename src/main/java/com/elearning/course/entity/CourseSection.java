package com.elearning.course.entity;

import com.elearning.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "courseSection")
@Getter
@Setter
public class CourseSection extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;
    
    @Column(nullable = false, length = 255)
    private String subject;
    
    @Column(nullable = false)
    private Integer orderNum = 1;
} 