package com.elearning.course.service;

import com.elearning.course.dto.CourseListDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.user.repository.CourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseListService {
    private final CourseRepository courseRepository;
    private final CourseRatingRepository courseRatingRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;

    public List<CourseListDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .filter(course -> course.getStatus() == Course.CourseStatus.ACTIVE)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseListDTO> getNewCourses() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return courseRepository.findAll().stream()
                .filter(course -> course.getStatus() == Course.CourseStatus.ACTIVE)
                .filter(course -> course.getRegDate().isAfter(thirtyDaysAgo))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseListDTO> getPopularCourses() {
        return courseRepository.findAll().stream()
                .filter(course -> course.getStatus() == Course.CourseStatus.ACTIVE)
                .sorted((a, b) -> {
                    Long aStudents = courseEnrollmentRepository.countByCourseId(a.getId());
                    Long bStudents = courseEnrollmentRepository.countByCourseId(b.getId());
                    return bStudents.compareTo(aStudents);
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseListDTO> getFreeCourses() {
        return courseRepository.findAll().stream()
                .filter(course -> course.getStatus() == Course.CourseStatus.ACTIVE)
                .filter(course -> course.getPrice() == 0)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CourseListDTO convertToDTO(Course course) {
        CourseListDTO dto = new CourseListDTO();
        dto.setId(course.getId());
        dto.setSlug(course.getSubject().toLowerCase().replace(" ", "-"));
        dto.setTitle(course.getSubject());
        dto.setInstructor(course.getInstructor().getUser().getNickname());
        dto.setPrice(course.getPrice());
        dto.setOriginalPrice(course.getPrice());
        dto.setDiscount(course.getDiscountRate().intValue());
        dto.setRating(courseRatingRepository.getAverageRatingByCourseId(course.getId()));
        dto.setRatingCount(courseRatingRepository.countRatingsByCourseId(course.getId()).intValue());
        dto.setStudents(courseEnrollmentRepository.countByCourseId(course.getId()).intValue());
        dto.setImage(course.getThumbnailUrl());
        dto.setNew(course.getRegDate().isAfter(LocalDateTime.now().minusDays(30)));
        dto.setUpdated(course.getUpdateDate() != null && 
                      course.getUpdateDate().isAfter(LocalDateTime.now().minusDays(30)));
        dto.setTarget(course.getTarget());
        return dto;
    }
} 