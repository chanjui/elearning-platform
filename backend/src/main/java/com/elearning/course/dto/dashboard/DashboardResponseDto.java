package com.elearning.course.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDto {
    private CourseDto lastLearningCourse;
    private List<CourseDto> enrolledCourses;
    private List<CourseDto> completedCourses;
    private List<CourseDto> recommendedCourses;
    private LearningStatsDto learningStats;
    private LearningGoalsDto learningGoals;
}

