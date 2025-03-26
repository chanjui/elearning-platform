package com.elearning.repository.instructor;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface CourseRepository  extends JpaRepository<com.elearning.domain.Course, Long> {
    
}
