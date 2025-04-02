package com.elearning.course.service;

import com.elearning.course.dto.CourseFaqRequest;
import com.elearning.course.dto.CourseRequest;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseFaq;
import com.elearning.course.repository.CourseRepository;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.elearning.course.entity.Category;
import com.elearning.course.repository.CategoryRepository;
import com.elearning.course.repository.CourseFaqRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
public class CourseService {

        private final CourseRepository courseRepository;
        private final CategoryRepository categoryRepository;
        private final InstructorRepository instructorRepository;
        private final CourseFaqRepository courseFaqRepository;

        public Long createCourse(CourseRequest req) {
                Course course = new Course();

                // ✅ 저장 가능한 필드만 처리
                course.setSubject(req.getTitle()); // title -> subject
                course.setDescription(req.getDescription());
                course.setPrice(req.getPrice());

                BigDecimal discountRate = BigDecimal.valueOf(req.getDiscountRate());
                course.setDiscountRate(discountRate);
                // courseservice에서 실제 instructor를 찾아서 course에 세팅
                Instructor instructor = instructorRepository.findById(req.getInstructorId())
                                .orElseThrow(() -> new RuntimeException("Instructor not found"));

                course.setInstructor(instructor);
                // 드로박스에서 받은 categoryId를 통해 카테고리 조회 후 연결
                Category category = categoryRepository.findById(req.getCategoryId())
                                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

                course.setCategory(category);

                // TODO: 미지원 필드들
                // req.getTags()
                // req.getIntroVideo()
                // req.getDetailedDescription()
                // req.getSubCategory()
                // req.getDiscountPrice()
                // req.isPublic()
                // req.getCoverImage()

                courseRepository.save(course);
                return course.getId(); // 생성된 강의 ID 반환
        }

        public void updateCourseTitleAndDescription(Long courseId, String title, String description, Long categoryId) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));

                course.setSubject(title);
                course.setDescription(description);
                course.setCategory(category);

                courseRepository.save(course);
        }

        public void updateDetailedDescription(Long courseId, String detailedDescription) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setDetailedDescription(detailedDescription);
                courseRepository.save(course);
        }

        public void updatePricing(Long courseId, int price, int discountRate, boolean isPublic, String viewLimit,
                        String target, String startDate, String endDate) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setPrice(price);
                course.setDiscountRate(BigDecimal.valueOf(discountRate));
                course.setStatus(isPublic ? Course.CourseStatus.ACTIVE : Course.CourseStatus.PREPARING);
                course.setViewLimit(viewLimit);
                course.setTarget(target);
                // course.setDurationType(durationType);

                // 날짜 형식 변환
                try {
                        if (startDate != null && !startDate.isEmpty()) {
                                course.setStartDate(LocalDateTime.parse(startDate));
                        }
                        if (endDate != null && !endDate.isEmpty()) {
                                course.setEndDate(LocalDateTime.parse(endDate));
                        }
                } catch (DateTimeParseException e) {
                        throw new IllegalArgumentException("날짜 형식이 잘못되었습니다.");
                }

                courseRepository.save(course);
        }

        public void addCourseFaq(CourseFaqRequest request) {
                Course course = courseRepository.findById(request.getCourseId())
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                CourseFaq faq = new CourseFaq();
                faq.setCourse(course);
                faq.setContent(request.getContent());
                faq.setAnswer(request.getAnswer());
                faq.setVisible(request.isVisible());

                courseFaqRepository.save(faq);
        }
}