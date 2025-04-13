package com.elearning.course.service.UserCourseService;

import com.elearning.course.dto.UserMain.*;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.CourseSectionRepository;
import com.elearning.course.repository.CourseTechMappingRepository;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.course.entity.CourseSection;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCourseService {
  private final CourseRepository courseRepository;
  private final CourseRatingRepository courseRatingRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final InstructorRepository instructorRepository;
  private final CourseSectionRepository courseSectionRepository;
  private final CourseTechMappingRepository courseTechMappingRepository;
  
  // 메인 데이터를 모두 통합해서 반환하는 메서드
  public UserMainDTO getUserMainData(Long userId) {
    List<UserSliderDTO> sliderData = getSliderData(userId);
    List<UserCourseDTO> latestCourses = getLatestCourses();
    List<UserCourseDTO> freeCourses = getFreeCourses();
    List<UserCourseDTO> popularCourses = getPopularCourses();
    List<UserRecInstructorDTO> recommendedInstructors = instructorRepository.findRandomRecInstructors(PageRequest.of(0, 3));
    List<UserReviewDTO> userReviews = getRandomUserReviews(4, 3);
    return UserMainDTO.builder()
      .sliderList(sliderData)
      .popularCourses(popularCourses)
      .latestCourses(latestCourses)
      .freeCourses(freeCourses)
      .recommendedInstructors(recommendedInstructors)
      .userReviews(userReviews)
      .build();
  }

  // 슬라이더 데이터 : 로그인한 사용자가 수강 중인 강의가 있으면 해당 데이터를, 아니면 카테고리별 top1 강의를 사용
  public List<UserSliderDTO> getSliderData(Long userId) {
    if (userId == null) {
        return getDefaultSliderData();
    }
    
    try {
        // findEnrolledSliderCourses 대신 findEnrolledCourses 사용
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findEnrolledCourses(userId, PageRequest.of(0, 5));
        
        if (enrollments.isEmpty()) {
            return getDefaultSliderData();
        }
        
        List<UserSliderDTO> result = new ArrayList<>();
        Set<Long> processedCourseIds = new HashSet<>();  // 중복 체크를 위한 Set
        
        for (CourseEnrollment enrollment : enrollments) {
            Course course = enrollment.getCourse();
            
            // 이미 처리된 강의는 건너뛰기
            if (!processedCourseIds.add(course.getId())) {
                continue;
            }
            
            // techStack 목록 조회
            List<String> techStacks = courseTechMappingRepository.findTechStackNamesByCourseId(course.getId());
            String techStackStr = techStacks.isEmpty() ? "" : String.join(",", techStacks);
            
            // 강의의 총 수강생 수 조회
            Long totalStudents = courseEnrollmentRepository.countTotalStudentsByCourseId(course.getId());
            
            // 단일 강의의 평균 평점 조회
            List<Object[]> avgRatingList = courseRatingRepository.findAverageRatingsByCourseIds(Collections.singletonList(course.getId()));
            Double avgRating = 0.0;
            if (!avgRatingList.isEmpty()) {
                Object[] row = avgRatingList.get(0);
                avgRating = (Double) row[1];
            }
            
            // BigDecimal을 Double로 변환
            Double progress = enrollment.getProgress().doubleValue();
            
            UserSliderDTO dto = UserSliderDTO.builder()
                .courseId(course.getId())
                .subject(course.getSubject())
                .sectionTitle(getFirstSection(course))
                .category(course.getCategory() != null ? course.getCategory().getName() : "")
                .techStack(techStackStr)
                .instructor(course.getInstructor().getUser().getNickname())
                .description(course.getDescription())
                .backImageUrl(course.getBackImageUrl())
                .target(course.getTarget())
                .rating(avgRating)
                .totalStudents(totalStudents)
                .progress(progress)
                .build();
                
            result.add(dto);
        }
        
        return result;
    } catch (Exception e) {
        System.out.println("사용자 강의 조회 중 오류 발생: " + e.getMessage());
        e.printStackTrace();
        return getDefaultSliderData();
    }
  }

  private String getFirstSection(Course course) {
    // 첫 번째 섹션 가져오는 로직
    try {
        // courseSectionRepository를 사용하여 첫 번째 섹션을 조회
        return courseSectionRepository.findFirstSectionTitleByCourseId(course.getId());
    } catch (Exception e) {
        return "";
    }
  }

  private List<UserSliderDTO> getDefaultSliderData() {
    List<UserSliderDTO> sliderData = new ArrayList<>();
    Set<Long> processedCourseIds = new HashSet<>();  // 중복 체크를 위한 Set
    
    // 카테고리 1 ~ 5에서 top1 강의를 조회
    for (long categoryId = 1; categoryId <= 5; categoryId++) {
      List<Course> topCourses = courseRepository.findTopByCategoryIdAndStatusOrderByAverageRatingDesc(
        categoryId,
        Course.CourseStatus.ACTIVE,
        PageRequest.of(0, 1)
      );
      if (!topCourses.isEmpty()) {
        Course course = topCourses.get(0);
        
        // 이미 처리된 강의는 건너뛰기
        if (!processedCourseIds.add(course.getId())) {
          continue;
        }
        
        // 첫 섹션 제목 조회
        String sectionTitle = courseSectionRepository.findFirstSectionTitleByCourseId(course.getId());
        // techStack 목록 조회
        List<String> techStacks = courseTechMappingRepository.findTechStackNamesByCourseId(course.getId());
        String techStackStr = techStacks.isEmpty() ? "" : String.join(", ", techStacks);
        // 강의의 총 수강생 수 조회
        Long totalStudents = courseEnrollmentRepository.countTotalStudentsByCourseId(course.getId());
        // 단일 강의의 평균 평점 조회: course.getId() 대신 singletonList로 전달
        List<Object[]> avgRatingList = courseRatingRepository.findAverageRatingsByCourseIds(Collections.singletonList(course.getId()));
        Double avgRating = 0.0;
        if (!avgRatingList.isEmpty()) {
          Object[] row = avgRatingList.get(0);
          avgRating = (Double) row[1];
        }
        UserSliderDTO dto = UserSliderDTO.builder()
          .courseId(course.getId())
          .subject(course.getSubject())
          .sectionTitle(sectionTitle)
          .category(course.getCategory().getName())
          .techStack(techStackStr)
          .instructor(course.getInstructor().getUser().getNickname())
          .description(course.getDescription())
          .backImageUrl(course.getBackImageUrl())
          .target(course.getTarget())
          .rating(avgRating)
          .totalStudents(totalStudents)
          .progress(0.0) // 진행률은 로그인하지 않은 경우 0%
          .build();
        sliderData.add(dto);
      }
    }
    return sliderData;
  }

  // 인기 강의(수강 등록 많은 순) TOP 5
  public List<UserCourseDTO> getPopularCourses() {
    // 1) 수강 등록 많은 순으로 상위 5개 [courseId, enrollCount] 가져오기
    List<Object[]> result = courseEnrollmentRepository.findTopCoursesByEnrollmentCount(
      PageRequest.of(0, 5) // 상위 5개
    );
    if (result.isEmpty()) {
      return new ArrayList<>();
    }

    // 2) courseId 리스트 추출
    List<Long> courseIds = result.stream()
      .map(row -> (Long) row[0]) // row[0] = courseId
      .collect(Collectors.toList());

    // 3) 실제 Course 엔티티 조회
    List<Course> courses = courseRepository.findAllById(courseIds);

    // 4) (선택) 평점 조회
    List<Object[]> avgRatings = courseRatingRepository.findAverageRatingsByCourseIds(courseIds);
    Map<Long, Double> ratingsMap = new HashMap<>();
    for (Object[] row : avgRatings) {
      Long courseId = (Long) row[0];
      Double avgRating = (Double) row[1];
      ratingsMap.put(courseId, avgRating);
    }

    // 5) 엔티티 -> DTO 변환
    return courses.stream()
      .map(course -> {
        Long cId = course.getId();
        return UserCourseDTO.builder()
          .id(cId)
          .subject(course.getSubject())
          .instructor(course.getInstructor().getUser().getNickname())
          .thumbnailUrl(course.getThumbnailUrl())
          .price(course.getPrice())
          .discountRate(course.getDiscountRate())
          // 평점 매핑
          .rating(ratingsMap.getOrDefault(cId, 0.0))
          .build();
      })
      .collect(Collectors.toList());
  }

  // 최신 강의(Active) 목록
  public List<UserCourseDTO> getLatestCourses() {
    List<Course> courses = courseRepository.findTop5ByStatusOrderByRegDateDesc(Course.CourseStatus.ACTIVE);

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
      // .filter(dto -> dto.getRating() >= 4.0) // 신규강의는 평점이
      .collect(Collectors.toList());
  }

  // 무료 강의(Active) 목록
  public List<UserCourseDTO> getFreeCourses() {
    List<Course> courses = courseRepository.findTop5ByStatusAndPrice(Course.CourseStatus.ACTIVE, 0);

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
