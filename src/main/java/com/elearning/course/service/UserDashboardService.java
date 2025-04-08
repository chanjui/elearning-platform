package com.elearning.course.service;

import com.elearning.course.dto.DashboardResponseDTO;
import com.elearning.course.entity.Course;
import com.elearning.common.entity.LectureProgress;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.course.repository.CourseRepository;
import com.elearning.common.repository.LectureProgressRepository;
import com.elearning.user.repository.CourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserDashboardService {

    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final LectureProgressRepository lectureProgressRepository;
    private final CourseRepository courseRepository;

    public DashboardResponseDTO getDashboardData(Long userId) {
        DashboardResponseDTO dashboard = new DashboardResponseDTO();
        
        // 1. 수강 중인 강의 조회
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndCompletionStatusFalse(userId);
        
        // 2. 완료한 강의 조회
        List<CourseEnrollment> completedEnrollments = courseEnrollmentRepository.findByUserIdAndCompletionStatusTrue(userId);
        
        // 3. 최근 학습 강의
        LectureProgress lastProgress = lectureProgressRepository.findTopByUserIdOrderByUpdatedAtDesc(userId);
        
        // 4. 학습 통계 계산
        DashboardResponseDTO.LearningStatsDTO stats = calculateLearningStats(userId);
        
        // 5. 학습 목표 설정
        DashboardResponseDTO.LearningGoalsDTO goals = getLearningGoals(userId);
        
        // 데이터 설정
        if (lastProgress != null) {
            dashboard.setLastLearningCourse(convertToCourseDTO(lastProgress));
        }
        dashboard.setEnrolledCourses(convertToCourseDTOs(enrollments));
        dashboard.setCompletedCourses(convertToCourseDTOs(completedEnrollments));
        dashboard.setLearningStats(stats);
        dashboard.setLearningGoals(goals);
        
        return dashboard;
    }

    private DashboardResponseDTO.CourseDTO convertToCourseDTO(LectureProgress progress) {
        Course course = progress.getLectureVideo().getSection().getCourse();
        CourseEnrollment enrollment = courseEnrollmentRepository.findByUserIdAndCourseId(
            progress.getUser().getId(), course.getId());
        
        DashboardResponseDTO.CourseDTO courseDTO = new DashboardResponseDTO.CourseDTO();
        courseDTO.setId(course.getId());
        courseDTO.setTitle(course.getSubject());
        courseDTO.setInstructor(course.getInstructor().getUser().getNickname());
        courseDTO.setProgress(enrollment.getProgress().intValue());
        courseDTO.setLastAccessed(progress.getUpdatedAt());
        courseDTO.setImageUrl(course.getThumbnailUrl());
        courseDTO.setSlug("course-" + course.getId());
        courseDTO.setTotalLectures(10); // 임시 값
        courseDTO.setCompletedLectures(5); // 임시 값
        courseDTO.setNextLecture(progress.getLectureVideo().getTitle());
        courseDTO.setEstimatedTimeLeft(formatEstimatedTimeLeft(enrollment));
        courseDTO.setCategory(course.getCategory().getName());
        courseDTO.setLastStudyDate(formatLastStudyDate(progress.getUpdatedAt()));
        courseDTO.setCompleted(enrollment.isCompletionStatus());
        courseDTO.setCompletedDate(enrollment.isCompletionStatus() ? progress.getUpdatedAt() : null);
        courseDTO.setCertificateAvailable(enrollment.isCompletionStatus());
        
        return courseDTO;
    }

    private List<DashboardResponseDTO.CourseDTO> convertToCourseDTOs(List<CourseEnrollment> enrollments) {
        return enrollments.stream()
            .map(enrollment -> {
                Course course = enrollment.getCourse();
                LectureProgress lastProgress = lectureProgressRepository.findTopByUserIdAndCourseIdOrderByUpdatedAtDesc(
                    enrollment.getUser().getId(), course.getId());
                
                DashboardResponseDTO.CourseDTO courseDTO = new DashboardResponseDTO.CourseDTO();
                courseDTO.setId(course.getId());
                courseDTO.setTitle(course.getSubject());
                courseDTO.setInstructor(course.getInstructor().getUser().getNickname());
                courseDTO.setProgress(enrollment.getProgress().intValue());
                courseDTO.setLastAccessed(lastProgress != null ? lastProgress.getUpdatedAt() : enrollment.getEnrolledAt());
                courseDTO.setImageUrl(course.getThumbnailUrl());
                courseDTO.setSlug("course-" + course.getId());
                courseDTO.setTotalLectures(10); // 임시 값
                courseDTO.setCompletedLectures(5); // 임시 값
                courseDTO.setNextLecture(getNextLectureTitle(enrollment));
                courseDTO.setEstimatedTimeLeft(formatEstimatedTimeLeft(enrollment));
                courseDTO.setCategory(course.getCategory().getName());
                courseDTO.setLastStudyDate(formatLastStudyDate(lastProgress != null ? lastProgress.getUpdatedAt() : enrollment.getEnrolledAt()));
                courseDTO.setCompleted(enrollment.isCompletionStatus());
                courseDTO.setCompletedDate(enrollment.isCompletionStatus() && lastProgress != null ? lastProgress.getUpdatedAt() : null);
                courseDTO.setCertificateAvailable(enrollment.isCompletionStatus());
                return courseDTO;
            })
            .collect(Collectors.toList());
    }

    private DashboardResponseDTO.LearningStatsDTO calculateLearningStats(Long userId) {
        DashboardResponseDTO.LearningStatsDTO stats = new DashboardResponseDTO.LearningStatsDTO();
        
        LocalDateTime weekStart = LocalDateTime.now().minusWeeks(1);
        LocalDateTime monthStart = LocalDateTime.now().minusMonths(1);
        
        // 주간 학습 시간 계산
        Double weeklyStudyTime = lectureProgressRepository.calculateWeeklyStudyTime(userId, weekStart);
        stats.setWeeklyStudyTime(weeklyStudyTime != null ? weeklyStudyTime : 0.0);
        
        // 월간 학습 시간 계산
        Double monthlyStudyTime = lectureProgressRepository.calculateMonthlyStudyTime(userId, monthStart);
        stats.setMonthlyStudyTime(monthlyStudyTime != null ? monthlyStudyTime : 0.0);
        
        // 완료율 계산
        Integer completionRate = calculateCompletionRate(userId);
        stats.setCompletionRate(completionRate);
        
        // 평균 퀴즈 점수 계산
        Integer averageQuizScore = calculateAverageQuizScore(userId);
        stats.setAverageQuizScore(averageQuizScore);
        
        // 학습 스트릭 계산
        Integer studyStreak = calculateStudyStreak(userId);
        stats.setStudyStreak(studyStreak);
        
        // 수료증 수 계산
        Integer totalCertificates = calculateTotalCertificates(userId);
        stats.setTotalCertificates(totalCertificates);
        
        return stats;
    }

    private DashboardResponseDTO.LearningGoalsDTO getLearningGoals(Long userId) {
        DashboardResponseDTO.LearningGoalsDTO goals = new DashboardResponseDTO.LearningGoalsDTO();
        
        // 주간 목표
        DashboardResponseDTO.LearningGoalsDTO.GoalDTO weeklyGoal = new DashboardResponseDTO.LearningGoalsDTO.GoalDTO();
        weeklyGoal.setTarget(20); // 기본값
        weeklyGoal.setCurrent(calculateWeeklyStudyHours(userId));
        weeklyGoal.setProgress(calculateProgress(weeklyGoal.getCurrent(), weeklyGoal.getTarget()));
        goals.setWeekly(weeklyGoal);
        
        // 강의 목표
        DashboardResponseDTO.LearningGoalsDTO.GoalDTO coursesGoal = new DashboardResponseDTO.LearningGoalsDTO.GoalDTO();
        coursesGoal.setTarget(5); // 기본값
        coursesGoal.setCurrent(calculateCompletedCoursesCount(userId));
        coursesGoal.setProgress(calculateProgress(coursesGoal.getCurrent(), coursesGoal.getTarget()));
        goals.setCourses(coursesGoal);
        
        return goals;
    }

    private String formatEstimatedTimeLeft(CourseEnrollment enrollment) {
        int totalMinutes = 360; // TODO: 실제 강의 시간 계산
        int completedMinutes = (int) (totalMinutes * (enrollment.getProgress().doubleValue() / 100.0));
        int remainingMinutes = totalMinutes - completedMinutes;
        
        int hours = remainingMinutes / 60;
        int minutes = remainingMinutes % 60;
        
        return hours + "시간 " + minutes + "분";
    }

    private String formatLastStudyDate(LocalDateTime lastAccessed) {
        if (lastAccessed == null) return "학습 기록 없음";
        
        LocalDateTime now = LocalDateTime.now();
        if (lastAccessed.toLocalDate().equals(now.toLocalDate())) {
            return "오늘";
        } else if (lastAccessed.toLocalDate().equals(now.minusDays(1).toLocalDate())) {
            return "어제";
        } else {
            return lastAccessed.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }
    }

    private Integer calculateProgress(int current, int target) {
        if (target == 0) return 0;
        return (int) ((double) current / target * 100);
    }

    private Integer calculateCompletionRate(Long userId) {
        List<CourseEnrollment> allEnrollments = courseEnrollmentRepository.findByUserId(userId);
        if (allEnrollments.isEmpty()) return 0;
        
        long completedCount = allEnrollments.stream()
            .filter(CourseEnrollment::isCompletionStatus)
            .count();
            
        return (int) ((double) completedCount / allEnrollments.size() * 100);
    }

    private Integer calculateAverageQuizScore(Long userId) {
        // TODO: 실제 퀴즈 점수 계산 로직 구현
        return 85;
    }

    private Integer calculateStudyStreak(Long userId) {
        // TODO: 실제 학습 스트릭 계산 로직 구현
        return 5;
    }

    private Integer calculateTotalCertificates(Long userId) {
        return courseEnrollmentRepository.countByUserIdAndCompletionStatusTrue(userId);
    }

    private Integer calculateWeeklyStudyHours(Long userId) {
        LocalDateTime weekStart = LocalDateTime.now().minusWeeks(1);
        Double weeklyHours = lectureProgressRepository.calculateWeeklyStudyTime(userId, weekStart);
        return weeklyHours != null ? weeklyHours.intValue() : 0;
    }

    private Integer calculateCompletedCoursesCount(Long userId) {
        return courseEnrollmentRepository.countByUserIdAndCompletionStatusTrue(userId);
    }

    private String getNextLectureTitle(CourseEnrollment enrollment) {
        // TODO: 다음 강의 제목 조회 로직 구현
        return "다음 강의";
    }
} 