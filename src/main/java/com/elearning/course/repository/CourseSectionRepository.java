package com.elearning.course.repository;

import com.elearning.course.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
}
