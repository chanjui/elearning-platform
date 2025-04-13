package com.elearning.user.controller;

import com.elearning.course.dto.CourseListDTO;
import com.elearning.course.service.CourseListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user/courses")
@RequiredArgsConstructor
public class CourseListController {
    private final CourseListService courseListService;

    @GetMapping
    public ResponseEntity<List<CourseListDTO>> getAllCourses() {
        return ResponseEntity.ok(courseListService.getAllCourses());
    }

    @GetMapping("/new")
    public ResponseEntity<List<CourseListDTO>> getNewCourses() {
        return ResponseEntity.ok(courseListService.getNewCourses());
    }

    @GetMapping("/popular")
    public ResponseEntity<List<CourseListDTO>> getPopularCourses() {
        return ResponseEntity.ok(courseListService.getPopularCourses());
    }

    @GetMapping("/free")
    public ResponseEntity<List<CourseListDTO>> getFreeCourses() {
        return ResponseEntity.ok(courseListService.getFreeCourses());
    }
} 