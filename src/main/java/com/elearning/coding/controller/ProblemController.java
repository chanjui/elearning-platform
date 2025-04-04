package com.elearning.coding.controller;


import org.springframework.web.bind.annotation.*;

import com.elearning.coding.entity.Problems;
import com.elearning.coding.service.ProblemService;

import java.util.List;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/coding/problems")
public class ProblemController {

  private final ProblemService problemService;

  public ProblemController(ProblemService problemService) {
    this.problemService = problemService;
  }

  @GetMapping
  public List<Problems> getProblems() {
    return problemService.getAllProblems();
  }

  @GetMapping("/{id}")
  public Optional<Problems> getProblem(@PathVariable Long id) {
    return problemService.getProblemById(id);
  }
}