package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.sales.CourseSimpleDTO;
import com.elearning.instructor.dto.sales.SalesHistoryDTO;
import com.elearning.instructor.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instructor/sales")
public class SalesController {

  private final SalesService salesService;

  /**
   * 강사의 월별 수익 내역을 조회하는 API
   */
  @GetMapping("/{instructorId}")
  public ResultData<List<SalesHistoryDTO>> getSalesHistory(
    @PathVariable Long instructorId,
    @RequestParam int year,
    @RequestParam int month,
    @RequestParam(required = false) Long courseId,
    @RequestParam(required = false) Long categoryId,
    @RequestParam(required = false) String searchQuery) {

    List<SalesHistoryDTO> salesList = salesService.getMonthlySalesHistory(instructorId, year, month, courseId, categoryId, searchQuery);
    int totalRevenue = salesService.calculateTotalRevenue(salesList);

    return ResultData.of(salesList.size(), "강사 수익 목록 조회 완료 (총 수익: " + totalRevenue + ")", salesList);
  }

  /**
   * 강사가 등록한 강의 목록을 조회하는 API
   */
  @GetMapping("/{instructorId}/courses")
  public ResultData<List<CourseSimpleDTO>> getInstructorCourses(@PathVariable Long instructorId) {
    List<CourseSimpleDTO> courseList = salesService.getCoursesByInstructor(instructorId);
    return ResultData.of(courseList.size(), "강사 강의 목록 조회 완료", courseList);
  }

}
