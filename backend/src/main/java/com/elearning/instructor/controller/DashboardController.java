package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.dashboard.InstructorDashboardDTO;
import com.elearning.instructor.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instructor/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  @GetMapping("/{instructorId}")
  public ResultData<InstructorDashboardDTO> getDashboard(@PathVariable Long instructorId) {
    InstructorDashboardDTO dashboardDto = dashboardService.getDashboardData(instructorId);
    // totalCount는 1(한 개의 결과)로 처리, 메시지는 상황에 맞게 작성 가능
    return ResultData.of(1, "success", dashboardDto);
  }


}
