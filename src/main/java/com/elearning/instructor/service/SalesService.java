package com.elearning.instructor.service;

import com.elearning.instructor.dto.sales.CourseSimpleDTO;
import com.elearning.instructor.dto.sales.SalesHistoryDTO;
import com.elearning.instructor.repository.query.sales.SalesQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {

  private final SalesQueryRepository salesQueryRepository;

  /**
   * 특정 강사의 월별 수익 내역을 조회한다.
   * @param instructorId 강사 ID
   * @param year 선택된 연도 (예: 2024)
   * @param month 선택된 월 (예: 3월 → 3)
   * @param courseId 특정 강의 ID (null이면 전체 강의)
   * @return 해당 월의 판매 수익 리스트
   */
  public List<SalesHistoryDTO> getMonthlySalesHistory(Long instructorId, int year, int month,
                                                      Long courseId, Long categoryId, String searchQuery) {
    return salesQueryRepository.findSalesHistory(instructorId, year, month, courseId, categoryId, searchQuery);
  }

  /**
   * 특정 강사의 월별 수익 합계를 계산한다.
   * @param salesList 수익 내역 리스트
   * @return 전체 수익 합계
   */
  public int calculateTotalRevenue(List<SalesHistoryDTO> salesList) {
    return salesList.stream()
      .mapToInt(SalesHistoryDTO::getInstructorRevenue)
      .sum();
  }

  public List<CourseSimpleDTO> getCoursesByInstructor(Long instructorId) {
    return salesQueryRepository.findCoursesByInstructorId(instructorId);
  }
}

