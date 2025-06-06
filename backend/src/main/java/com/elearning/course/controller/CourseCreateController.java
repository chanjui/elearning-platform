package com.elearning.course.controller;

import com.elearning.course.dto.CourseBasicInfoRequest;
import com.elearning.course.dto.CourseCurriculumRequest;
import com.elearning.course.dto.CourseRequest;
import com.elearning.course.entity.Category;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CategoryRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import com.elearning.course.dto.CourseDetailedDescriptionRequest;
import com.elearning.course.dto.CourseFaqRequest;
import com.elearning.course.dto.CoursePricingRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseCreateController {

    private final CourseService courseService;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CourseRequest request) {
        Long courseId = courseService.createCourse(request);
        Map<String, Object> response = new HashMap<>();
        response.put("courseId", courseId);
        response.put("message", "강의가 성공적으로 생성되었습니다.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // 강의 기본 정보 업데이트
    @PatchMapping("/{id}/basic-info")
    public ResponseEntity<String> updateBasicInfo(
            @PathVariable Long id,
            @RequestBody CourseBasicInfoRequest request) {
        courseService.updateCourseTitleAndDescription(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getCategoryId(),
                request.getLearning(),
                request.getRecommendation(),
                request.getRequirement());
        return ResponseEntity.ok("강의 기본 정보가 수정되었습니다.");
    }

    // 강의 상세 설명 업데이트
    @PatchMapping("/{id}/detailed-description")
    public ResponseEntity<String> updateDetailedDescription(
            @PathVariable Long id,
            @RequestBody CourseDetailedDescriptionRequest request) {
        courseService.updateDetailedDescription(id, request.getDetailedDescription());
        return ResponseEntity.ok("강의 상세 설명이 저장되었습니다.");
    }

    @PatchMapping("/{id}/pricing")
    public ResponseEntity<String> updatePricing(
            @PathVariable Long id,
            @RequestBody CoursePricingRequest request) {
        courseService.updatePricing(
                id,
                request.getPrice(),
                request.getDiscountRate(),
                request.isPublic(),
                request.getViewLimit(),
                request.getTarget(),
                request.getStartDate(),
                request.getEndDate());
        // request.getDurationType());
        return ResponseEntity.ok("강의 가격 및 설정 정보가 저장되었습니다.");
    }

    @PostMapping("/{id}/faq")
    public ResponseEntity<String> addFaqs(
            @PathVariable Long id,
            @RequestBody List<CourseFaqRequest> faqRequests) {

        courseService.addCourseFaq(id, faqRequests);
        return ResponseEntity.ok("자주 묻는 질문이 저장되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/curriculum")
    public ResponseEntity<String> saveCurriculum(
            @PathVariable Long id,
            @RequestBody CourseCurriculumRequest request) {

        request.setCourseId(id); // URL 경로에서 받은 ID를 DTO에 주입
        courseService.saveCurriculum(request);
        return ResponseEntity.ok("커리큘럼 저장 완료");
    }

    @PatchMapping("/{id}/cover-image")
    public ResponseEntity<String> updateCoverImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String imageUrl = request.get("backImageUrl");

        // 예외 처리 포함
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

        course.setBackImageUrl(imageUrl);
        courseRepository.save(course);

        return ResponseEntity.ok("커버 이미지가 저장되었습니다.");
    }

}