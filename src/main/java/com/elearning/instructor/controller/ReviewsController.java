package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.reviews.CourseRatingReviewDTO;
import com.elearning.instructor.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instructor/reviews")
public class ReviewsController {

  private final ReviewService reviewService;

  /**
   * 통합형 수강평 조회 API
   * instructorId는 필수, courseId와 query는 optional
   * 프론트에서 정렬은 별도로 처리 (최신순, 평점 등)
   */
  @GetMapping("/{instructorId}")
  public ResultData<List<CourseRatingReviewDTO>> getFilteredReviews(
    @PathVariable Long instructorId,
    @RequestParam(required = false) Long courseId,
    @RequestParam(required = false) String query
  ) {
    List<CourseRatingReviewDTO> list = reviewService.searchReviews(instructorId, courseId, query);
    return ResultData.of(list.size(), "수강평 조회 완료", list);
  }

}

