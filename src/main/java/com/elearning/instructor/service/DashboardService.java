package com.elearning.instructor.service;

import com.elearning.course.entity.Course;
import com.elearning.instructor.dto.dashboard.*;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.instructor.repository.query.DashboardQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final InstructorRepository instructorRepository;
  private final DashboardQueryRepository dashboardQueryRepository;

  public InstructorDashboardDto getDashboardData(Long instructorId) {
    // 1) 강사 엔티티 조회 (userId 가져오기 등)
    Instructor instructor = instructorRepository.findById(instructorId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 강사입니다."));

    // 날짜 기준
    LocalDate now = LocalDate.now();
    int currentYear = now.getYear();
    int currentMonth = now.getMonthValue();
    LocalDateTime fromDate = LocalDateTime.now().minusDays(30);
    LocalDate sevenDaysAgo = LocalDate.now().minusDays(7); // 오늘 포함 최근 7일

    // 대시보드 통계
    int totalCourseCount = dashboardQueryRepository.countCoursesByInstructorId(instructorId);
    double averageRating = dashboardQueryRepository.findAverageRatingByInstructorId(instructorId) != null
      ? dashboardQueryRepository.findAverageRatingByInstructorId(instructorId) : 0.0;
    Long totalStudents = dashboardQueryRepository.findDistinctStudentsByInstructorId(instructorId);
    Long totalRevenue = dashboardQueryRepository.findTotalRevenueByInstructorId(instructorId);
    Long monthlyRevenue = dashboardQueryRepository.findMonthlyRevenueByInstructorId(instructorId, currentYear, currentMonth);
    Long recentStudents = dashboardQueryRepository.countDistinctRecentStudentsByInstructor(instructorId, fromDate);

    // 각종 통계 리스트
    // List<CourseRevenueDto> revenueData = dashboardQueryRepository.findCourseRevenueDistribution(instructorId, currentYear, currentMonth);
    // 테스트용으로 2025 년 3 월로 데이터 조회
    List<CourseRevenueDto> revenueData = dashboardQueryRepository.findCourseRevenueDistribution(instructorId, 2025, 3);
    // 최근 7일 수익 데이터
    List<DailyRevenuePerCourseDto> dailyRevenueData = dashboardQueryRepository.findDailyRevenueForLast7Days(instructorId, sevenDaysAgo);
    List<ProgressStatusDto> progressStatus = dashboardQueryRepository.getProgressStatsByInstructor(instructorId);
    List<CourseEnrollmentDataDto> courseEnrollment = dashboardQueryRepository.getCourseEnrollmentData(instructorId);
    List<StudyTimeDto> studyTimeData = dashboardQueryRepository.getStudyTimeByInstructor(instructorId);

    // 최근 알림
    List<NotificationDto> recentNotifications = dashboardQueryRepository.findTop5NotificationsByUserId(instructor.getId()).stream()
      .map(n -> NotificationDto.builder()
        .id(n.getId())
        .title(n.getTitle())
        .message(n.getMessage())
        .notificationType(n.getNotificationType().name())
        .isRead(n.isRead())
        .createdAt(n.getCreatedAt())
        .build())
      .collect(Collectors.toList());

    return InstructorDashboardDto.builder()
      .instructorId(instructorId)
      .totalCourseCount(totalCourseCount)
      .averageRating(averageRating)
      .totalStudents(totalStudents != null ? totalStudents : 0L)
      .totalRevenue(totalRevenue != null ? totalRevenue : 0L)
      .monthlyRevenue(monthlyRevenue != null ? monthlyRevenue : 0L)
      .recentStudents(recentStudents != null ? recentStudents : 0L)
      .revenueData(revenueData)
      .dailyRevenueData(dailyRevenueData)
      .progressStatus(progressStatus)
      .courseEnrollment(courseEnrollment)
      .studyTimeData(studyTimeData)
      .recentNotifications(recentNotifications)
      .build();
  }

}
