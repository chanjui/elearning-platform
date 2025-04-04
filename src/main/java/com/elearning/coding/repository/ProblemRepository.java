package com.elearning.coding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.elearning.coding.entity.Problems;

public interface ProblemRepository extends JpaRepository<Problems, Long> {
}
