package com.elearning.instructor.controller;

import com.elearning.instructor.dto.dashboard.InstructorDashboardDto;
import com.elearning.instructor.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instructor")
public class DashboardController {

  private final DashboardService dashboardService;

  @GetMapping("/{instructorId}/dashboard")
  public InstructorDashboardDto getDashboard(@PathVariable Long instructorId) {
    return dashboardService.getDashboardData(instructorId);
  }
}
