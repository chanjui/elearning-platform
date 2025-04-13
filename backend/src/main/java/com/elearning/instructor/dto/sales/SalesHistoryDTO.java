package com.elearning.instructor.dto.sales;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesHistoryDTO {
  private String date;                // yyyy-MM-dd 형식
  private String time;                // HH:mm 또는 오후/오전 HH:mm 형식
  private String courseTitle;         // 강의 제목
  private String studentName;         // 수강생 이름
  private int originalPrice;          // 정가
  private int actualPrice;            // 실제 결제 가격
  private int instructorRevenue;      // 강사 실수익
}

