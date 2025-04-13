package com.elearning.course.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LearningStatsDto {
    private Integer weeklyStudyTime;
    private Integer monthlyStudyTime;
    private Double completionRate;
    private Double averageQuizScore;
    private Integer studyStreak;
    private Integer totalCertificates;
} 