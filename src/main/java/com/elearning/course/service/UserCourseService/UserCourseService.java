package com.elearning.course.service.UserCourseService;

import com.elearning.course.dto.UserMain.UserCourseDTO;
import com.elearning.course.dto.UserMain.UserMainDTO;
import com.elearning.course.dto.UserMain.UserReviewDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCourseService {
  private final CourseRepository courseRepository;
  private final CourseRatingRepository courseRatingRepository;

  // 메인 데이터를 모두 통합해서 반환하는 메서드
  public UserMainDTO getUserMainData() {
    List<UserCourseDTO> latestCourses = getLatestCourses();
    List<UserCourseDTO> freeCourses = getFreeCourses();
    List<UserReviewDTO> userReviews = getRandomUserReviews(4, 3);
    return UserMainDTO.builder()
      .latestCourses(latestCourses)
      .freeCourses(freeCourses)
      .userReviews(userReviews)
      .build();
  }

  // 최신 강의(Active) 목록
  public List<UserCourseDTO> getLatestCourses() {
    List<Course> courses = courseRepository.findByStatusOrderByRegDateDesc(Course.CourseStatus.ACTIVE);

    // 강의가 5개를 초과하면 최신 5개만 선택합니다.
    if (courses.size() > 5) {
      courses = courses.subList(0, 5);
    }

    // 모든 강의의 ID를 수집하여 평균 평점을 한 번에 조회
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
      .map(course -> UserCourseDTO.builder()
        .id(course.getId())
        .subject(course.getSubject())
        .instructor(course.getInstructor().getUser().getNickname())
        .thumbnailUrl(course.getThumbnailUrl())
        .price(course.getPrice())
        .discountRate(course.getDiscountRate())
        .rating(ratingsMap.getOrDefault(course.getId(), 0.0))
        .build())
      .collect(Collectors.toList());
  }

  // 무료 강의(Active) 목록
  public List<UserCourseDTO> getFreeCourses() {
    List<Course> courses = courseRepository.findByStatusAndPrice(Course.CourseStatus.ACTIVE, 0);

    // 강의가 5개를 초과하면 최신 5개만 선택합니다.
    if (courses.size() > 5) {
      courses = courses.subList(0, 5);
    }

    // 모든 강의의 ID를 수집하여 평균 평점을 한 번에 조회
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
      .map(course -> UserCourseDTO.builder()
        .id(course.getId())
        .subject(course.getSubject())
        .instructor(course.getInstructor().getUser().getNickname())
        .thumbnailUrl(course.getThumbnailUrl())
        .price(course.getPrice())
        .discountRate(course.getDiscountRate())
        .rating(ratingsMap.getOrDefault(course.getId(), 0.0))
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
