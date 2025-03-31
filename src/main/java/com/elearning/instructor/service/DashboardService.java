package com.elearning.instructor.service;

import com.elearning.common.repository.NotificationRepository;
import com.elearning.common.repository.PaymentRepository;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.instructor.dto.dashboard.*;
import com.elearning.instructor.entity.Instructor;
import com.elearning.common.entity.Notification;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.repository.CourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final InstructorRepository instructorRepository;
  private final CourseRepository courseRepository;
  private final CourseRatingRepository courseRatingRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final PaymentRepository paymentRepository;
  private final NotificationRepository notificationRepository;

  public InstructorDashboardDto getDashboardData(Long instructorId) {
    // 1) 강사 엔티티 조회 (userId 가져오기 등)
    Instructor instructor = instructorRepository.findById(instructorId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 강사입니다."));

    // 2) 기본 통계
    int totalCourseCount = courseRepository.countByInstructorId(instructorId);

    Double avgRating = courseRatingRepository.findAverageRatingByInstructorId(instructorId);
    double averageRating = (avgRating == null) ? 0.0 : avgRating; // null 방어

    // 중복 포함 or distinct로 구분 필요
    Long totalStudents = courseEnrollmentRepository.findDistinctStudentsByInstructorId(instructorId);
    if (totalStudents == null) totalStudents = 0L;

    Long totalRevenue = paymentRepository.findTotalRevenueByInstructorId(instructorId);
    if (totalRevenue == null) totalRevenue = 0L;

    // 이번 달 수익 (월별로 필터)
    LocalDate now = LocalDate.now();
    int currentYear = now.getYear();
    int currentMonth = now.getMonthValue();
    Long monthlyRevenue = paymentRepository.findMonthlyRevenueByInstructorId(instructorId, currentYear, currentMonth);
    if (monthlyRevenue == null) monthlyRevenue = 0L;

    // 3) 수강생 진행률 현황, 과목 수강 데이터, 수강생 학습 시간 등
    // -> 실제로는 LectureProgress, CourseEnrollment, LectureVideo 등과의 조인을 통해
    //    필요한 통계를 구해야 함. 아래는 예시로 비어있거나 Mock Data.
    List<ProgressStatusDto> progressStatus = courseEnrollmentRepository.getProgressStatsByInstructor(instructorId);
    List<CourseEnrollmentDataDto> courseEnrollment = courseEnrollmentRepository.getCourseEnrollmentData(instructorId);
    List<StudyTimeDto> studyTimeData = courseEnrollmentRepository.getStudyTimeByInstructor(instructorId);

    // 4) 최근 알림 5개
    List<Notification> notifications = notificationRepository
      .findTop5ByUserIdOrderByCreatedAtDesc(instructor.getId());

    List<NotificationDto> recentNotifications = notifications.stream()
      .map(n -> NotificationDto.builder()
        .id(n.getId())
        .title(n.getTitle())
        .message(n.getMessage())
        .notificationType(n.getNotificationType().name()) // enum일 경우 .name()
        .isRead(n.isRead())
        .createdAt(n.getCreatedAt()) // DateTime 변환
        .build())
      .collect(Collectors.toList());

    // 5) 최종 DTO 빌드
    return InstructorDashboardDto.builder()
      .instructorId(instructorId)
      .totalCourseCount(totalCourseCount)
      .averageRating(averageRating)
      .totalStudents(totalStudents)
      .totalRevenue(totalRevenue)
      .monthlyRevenue(monthlyRevenue)
      .progressStatus(progressStatus)
      .courseEnrollment(courseEnrollment)
      .studyTimeData(studyTimeData)
      .recentNotifications(recentNotifications)
      .build();
  }

}
