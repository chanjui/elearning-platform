package com.elearning.user.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.course.entity.Course;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart")
@Getter
@Setter
public class Cart extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;
    
    @Column(name = "addedAt")
    private LocalDateTime addedAt = LocalDateTime.now();
} 