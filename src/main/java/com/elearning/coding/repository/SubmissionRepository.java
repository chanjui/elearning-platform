package com.elearning.coding.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.elearning.coding.entity.Submissions;

import java.util.List;



public interface SubmissionRepository extends JpaRepository<Submissions, Long> {
  List<Submissions> findByProblem_Id(Long problemId);
}
