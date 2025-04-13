package com.elearning.user.entity;

import com.elearning.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_learning_dashboard")
@Getter
@Setter
public class UserLearningDashboard extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer weeklyStudyTime = 0;

    @Column(nullable = false)
    private Integer monthlyStudyTime = 0;

    @Column(nullable = false)
    private Double completionRate = 0.0;

    @Column(nullable = false)
    private Double averageQuizScore = 0.0;

    @Column(nullable = false)
    private Integer studyStreak = 0;

    @Column(nullable = false)
    private Integer totalCertificates = 0;

    @Column(nullable = false)
    private Integer weeklyGoal = 0;

    @Column(nullable = false)
    private Integer weeklyProgress = 0;

    @Column(nullable = false)
    private Integer courseGoal = 0;

    @Column(nullable = false)
    private Integer courseProgress = 0;

    @Column
    private LocalDateTime lastStudyDate;

    @Column
    private LocalDateTime lastUpdateDate = LocalDateTime.now();
} 