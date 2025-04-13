package com.elearning.user.controller;

import com.elearning.course.dto.dashboard.DashboardResponseDto;
import com.elearning.user.service.MyLearningDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/dashboard")
@RequiredArgsConstructor
public class MyLearningDashboardController {

    private final MyLearningDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardResponseDto> getDashboardData(@RequestParam Long userId) {
    
        DashboardResponseDto response = dashboardService.getDashboardData(userId);
        System.out.println("response: " + response);
        return ResponseEntity.ok(response);
    }
} 