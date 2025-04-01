package com.elearning.course.service;

import com.elearning.course.dto.CourseDto;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.elearning.course.entity.Course.CourseStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseService {
  private final CourseRepository courseRepository;
  private final CourseRatingRepository courseRatingRepository;

  // 최신 강의 조회 (Active)
  public List<CourseDto> getLatestActiveCourses() {
    return courseRepository.findByStatusOrderByRegDateDesc(CourseStatus.ACTIVE)
      .stream()
      .map(course -> {
          Double avgRating = courseRatingRepository.findAverageRatingByCourseId(course.getId());
          return CourseDto.builder()
            .id(course.getId())
            .subject(course.getSubject())
            .thumbnailUrl(course.getThumbnailUrl())
            .price(course.getPrice())
            .discountRate(course.getDiscountRate())
            .rating(avgRating != null ? avgRating : 0.0)
            .regDate(course.getRegDate())
            .build();
      })
      .toList();
  }

  // 무료 강의 조회 (Active)
  public List<CourseDto> getFreeActiveCourses() {
    return courseRepository.findByStatusAndPrice(CourseStatus.ACTIVE, 0)
      .stream()
      .map(course -> {
          Double avgRating = courseRatingRepository.findAverageRatingByCourseId(course.getId());
          return CourseDto.builder()
            .id(course.getId())
            .subject(course.getSubject())
            .thumbnailUrl(course.getThumbnailUrl())
            .price(course.getPrice())
            .discountRate(course.getDiscountRate())
            .rating(avgRating != null ? avgRating : 0.0)
            .build();
      })
      .toList();
  }

}
