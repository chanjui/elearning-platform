package com.elearning.coding.service;

import com.elearning.coding.entity.Problems;
import com.elearning.coding.repository.ProblemRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProblemService {

  private final ProblemRepository problemRepository;

  public ProblemService(ProblemRepository problemRepository) {
    this.problemRepository = problemRepository;
  }

  public List<Problems> getAllProblems() {
    return problemRepository.findAll();
  }

  public Optional<Problems> getProblemById(Long id) {
    return problemRepository.findById(id);
  }
}