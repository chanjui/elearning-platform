package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class DashboardResponseDTO {
    private CourseDTO lastLearningCourse;
    private List<CourseDTO> enrolledCourses;
    private List<CourseDTO> completedCourses;
    private List<RecommendedCourseDTO> recommendedCourses;
    private LearningStatsDTO learningStats;
    private LearningGoalsDTO learningGoals;

    @Getter
    @Setter
    public static class CourseDTO {
        private Long id;
        private String title;
        private String instructor;
        private Integer progress;
        private LocalDateTime lastAccessed;
        private String imageUrl;
        private String slug;
        private Integer totalLectures;
        private Integer completedLectures;
        private String nextLecture;
        private String estimatedTimeLeft;
        private String category;
        private String lastStudyDate;
        private boolean completed;
        private LocalDateTime completedDate;
        private boolean certificateAvailable;
    }

    @Getter
    @Setter
    public static class RecommendedCourseDTO {
        private Long id;
        private String title;
        private String instructor;
        private String imageUrl;
        private String slug;
        private String category;
        private Double rating;
        private Integer students;
        private String level;
        private String relatedTo;
    }

    @Getter
    @Setter
    public static class LearningStatsDTO {
        private Double weeklyStudyTime;
        private Double monthlyStudyTime;
        private Integer completionRate;
        private Integer averageQuizScore;
        private Integer studyStreak;
        private Integer totalCertificates;
    }

    @Getter
    @Setter
    public static class LearningGoalsDTO {
        private GoalDTO weekly;
        private GoalDTO courses;

        @Getter
        @Setter
        public static class GoalDTO {
            private Integer target;
            private Integer current;
            private Integer progress;
        }
    }
} 