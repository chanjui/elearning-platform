package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstructorDashboardDto {

  // 강사 식별자 (사용 안하면 지울 예정)
  private Long instructorId;

  // 대시보드 상단에 표시할 주요 통계
  private int totalCourseCount;     // 총 강의 수
  private double averageRating;     // 평균 평점
  private long totalStudents;       // 총 수강생 수
  private long totalRevenue;        // 총 수익
  private long monthlyRevenue;      // 이번 달 수익

  // 차트 또는 그래프용 데이터
  private List<ProgressStatusDto> progressStatus;         // 수강생 진행률 현황
  private List<CourseEnrollmentDataDto> courseEnrollment; // 과목별 수강 데이터
  private List<StudyTimeDto> studyTimeData;               // 수강생 학습 시간

  // 최근 알림 목록
  private List<NotificationDto> recentNotifications;
}
