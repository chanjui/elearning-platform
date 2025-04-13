package com.elearning.instructor.repository;

import com.elearning.instructor.entity.Expertise;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpertiseRepository extends JpaRepository<Expertise, Long> {
}
