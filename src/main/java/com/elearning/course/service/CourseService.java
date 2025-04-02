package com.elearning.course.service;

import com.elearning.course.dto.CourseDto;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.elearning.course.entity.Course.CourseStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
  private final CourseRepository courseRepository;
  private final CourseRatingRepository courseRatingRepository;

  // 최신 강의 조회 (Active)
  public List<CourseDto> getLatestActiveCourses() {
    List<Course> courses = courseRepository.findByStatusOrderByRegDateDesc(CourseStatus.ACTIVE);
    // 모든 강좌의 ID를 수집합니다.
    List<Long> courseIds = courses.stream().map(Course::getId).collect(Collectors.toList());

    // 한 번의 쿼리로 모든 강좌의 평균 평점을 조회합니다.
    List<Object[]> avgRatings = courseRatingRepository.findAverageRatingsByCourseIds(courseIds);
    Map<Long, Double> ratingsMap = new HashMap<>();
    for (Object[] row : avgRatings) {
      Long courseId = (Long) row[0];
      Double avgRating = (Double) row[1];
      ratingsMap.put(courseId, avgRating);
    }

    // 각 강좌를 CourseDto로 매핑합니다. 조회된 평점이 없으면 0.0을 사용합니다.
    return courses.stream()
      .map(course -> CourseDto.builder()
        .id(course.getId())
        .subject(course.getSubject())
        .thumbnailUrl(course.getThumbnailUrl())
        .price(course.getPrice())
        .discountRate(course.getDiscountRate())
        .rating(ratingsMap.getOrDefault(course.getId(), 0.0))
        .regDate(course.getRegDate())
        .build())
      .collect(Collectors.toList());
  }

  // public List<CourseDto> getLatestActiveCourses() {
  //   return courseRepository.findByStatusOrderByRegDateDesc(CourseStatus.ACTIVE)
  //     .stream()
  //     .map(course -> {
  //         Double avgRating = courseRatingRepository.findAverageRatingByCourseId(course.getId());
  //         return CourseDto.builder()
  //           .id(course.getId())
  //           .subject(course.getSubject())
  //           .thumbnailUrl(course.getThumbnailUrl())
  //           .price(course.getPrice())
  //           .discountRate(course.getDiscountRate())
  //           .rating(avgRating != null ? avgRating : 0.0)
  //           .regDate(course.getRegDate())
  //           .build();
  //     })
  //     .toList();
  // }

  // 무료 강의 조회 (Active)
  public List<CourseDto> getFreeActiveCourses() {
    // Assuming free courses have a price of 0 and are ACTIVE
    List<Course> courses = courseRepository.findByStatusAndPrice(CourseStatus.ACTIVE, 0);

    // Collect all course IDs
    List<Long> courseIds = courses.stream()
      .map(Course::getId)
      .collect(Collectors.toList());

    // Fetch average ratings for all courses at once
    List<Object[]> avgRatings = courseRatingRepository.findAverageRatingsByCourseIds(courseIds);
    Map<Long, Double> ratingsMap = new HashMap<>();
    for (Object[] row : avgRatings) {
      Long courseId = (Long) row[0];
      Double avgRating = (Double) row[1];
      ratingsMap.put(courseId, avgRating);
    }

    // Map each course to its DTO, using the fetched average rating if available
    return courses.stream()
      .map(course -> CourseDto.builder()
        .id(course.getId())
        .subject(course.getSubject())
        .thumbnailUrl(course.getThumbnailUrl())
        .price(course.getPrice())
        .discountRate(course.getDiscountRate())
        .rating(ratingsMap.getOrDefault(course.getId(), 0.0))
        .regDate(course.getRegDate())
        .build())
      .collect(Collectors.toList());
  }
  // public List<CourseDto> getFreeActiveCourses() {
  //   return courseRepository.findByStatusAndPrice(CourseStatus.ACTIVE, 0)
  //     .stream()
  //     .map(course -> {
  //         Double avgRating = courseRatingRepository.findAverageRatingByCourseId(course.getId());
  //         return CourseDto.builder()
  //           .id(course.getId())
  //           .subject(course.getSubject())
  //           .thumbnailUrl(course.getThumbnailUrl())
  //           .price(course.getPrice())
  //           .discountRate(course.getDiscountRate())
  //           .rating(avgRating != null ? avgRating : 0.0)
  //           .build();
  //     })
  //     .toList();
  // }

}
