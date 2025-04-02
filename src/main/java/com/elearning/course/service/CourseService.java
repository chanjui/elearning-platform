package com.elearning.course.service;

import com.elearning.course.dto.UserMain.CourseDto;
import com.elearning.course.dto.UserMain.UserMainDTO;
import com.elearning.course.dto.UserMain.UserReviewDTO;
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

  // 기존 메서드들 ...

  // 새로운 메서드: 모든 데이터를 하나의 DTO로 합쳐서 반환
  public UserMainDTO getUserMainData() {
    List<CourseDto> latestActiveCourses = getLatestActiveCourses();
    List<CourseDto> freeActiveCourses = getFreeActiveCourses();
    List<UserReviewDTO> userReviews = getRandomUserReviews(4, 3);

    return UserMainDTO.builder()
      .latestActiveCourses(latestActiveCourses)
      .freeActiveCourses(freeActiveCourses)
      .userReviews(userReviews)
      .build();
  }

  // 기존 메서드 구현은 그대로 유지합니다.
  public List<CourseDto> getLatestActiveCourses() {
    List<Course> courses = courseRepository.findByStatusOrderByRegDateDesc(CourseStatus.ACTIVE);
    List<Long> courseIds = courses.stream().map(Course::getId).collect(Collectors.toList());
    List<Object[]> avgRatings = courseRatingRepository.findAverageRatingsByCourseIds(courseIds);
    Map<Long, Double> ratingsMap = new HashMap<>();
    for (Object[] row : avgRatings) {
      Long courseId = (Long) row[0];
      Double avgRating = (Double) row[1];
      ratingsMap.put(courseId, avgRating);
    }
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

  public List<CourseDto> getFreeActiveCourses() {
    List<Course> courses = courseRepository.findByStatusAndPrice(CourseStatus.ACTIVE, 0);
    List<Long> courseIds = courses.stream()
      .map(Course::getId)
      .collect(Collectors.toList());
    List<Object[]> avgRatings = courseRatingRepository.findAverageRatingsByCourseIds(courseIds);
    Map<Long, Double> ratingsMap = new HashMap<>();
    for (Object[] row : avgRatings) {
      Long courseId = (Long) row[0];
      Double avgRating = (Double) row[1];
      ratingsMap.put(courseId, avgRating);
    }
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

  public List<UserReviewDTO> getRandomUserReviews(double minRating, int count) {
    List<UserReviewDTO> reviews = courseRatingRepository.findRandomUserReviews(minRating);
    if (reviews.size() > count) {
      return reviews.subList(0, count);
    }
    return reviews;
  }
}