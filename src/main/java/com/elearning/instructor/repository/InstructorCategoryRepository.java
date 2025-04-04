package com.elearning.instructor.repository;

import com.elearning.instructor.entity.InstructorCategoryMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorCategoryRepository extends JpaRepository<InstructorCategoryMapping, Long> {
}
