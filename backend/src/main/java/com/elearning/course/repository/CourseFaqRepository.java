package com.elearning.course.repository;

import com.elearning.course.entity.CourseFaq;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseFaqRepository extends JpaRepository<CourseFaq, Long> {
    List<CourseFaq> findByCourseId(Long courseId);
}