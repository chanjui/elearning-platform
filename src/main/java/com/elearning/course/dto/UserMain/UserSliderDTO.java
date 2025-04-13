package com.elearning.course.dto.UserMain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSliderDTO {
  private Long courseId;       // 강의 ID
  private String subject;      // 강의 제목
  private String sectionTitle; // 현재 섹션(예: 첫 번째 섹션)의 제목
  private String category;     // 카테고리
  private String techStack;    // 강의 관련 언어 태그
  private String instructor;   // 강사 이름
  private String description;  // 강의 설명
  private String backImageUrl; // 배경 이미지
  private String target;       // 대상 (입문, 초급, 중급, 고급)
  private Double rating;       // 강의 평점
  private Long totalStudents;  // 총 수강생
  private Double progress;     // 수강 진행률 (%)
}
