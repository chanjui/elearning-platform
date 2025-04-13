package com.elearning.coding.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.elearning.coding.entity.Problems;
import com.elearning.coding.service.ProblemService;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/coding/problems")
public class ProblemController {

  private final ProblemService problemService;

  public ProblemController(ProblemService problemService) {
    this.problemService = problemService;
  }

  @GetMapping
  public ResponseEntity<List<Map<String, Object>>> getProblems(
          @RequestParam(required = false) Long userId) {
    List<Problems> problems = problemService.getAllProblems();
    List<Map<String, Object>> response = new ArrayList<>();

    for (Problems problem : problems) {
      Map<String, Object> problemData = new HashMap<>();
      Map<String, Object> stats = problemService.getProblemStats(problem.getId());
      
      problemData.put("id", problem.getId());
      problemData.put("title", problem.getTitle());
      problemData.put("difficulty", problem.getDifficulty());
      problemData.put("description", problem.getDescription());
      problemData.put("inputExample", problem.getInputExample());
      problemData.put("outputExample", problem.getOutputExample());
      problemData.put("participants", stats.get("participants"));
      problemData.put("successRate", stats.get("successRate"));
      problemData.put("status", problemService.getProblemStatus(problem.getId(), userId));

      response.add(problemData);
    }

    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public Optional<Problems> getProblem(@PathVariable Long id) {
    return problemService.getProblemById(id);
  }

  @GetMapping("/{id}/stats")
  public ResponseEntity<Map<String, Object>> getProblemStats(@PathVariable Long id) {
    if (!problemService.getProblemById(id).isPresent()) {
      return ResponseEntity.notFound().build();
    }
    
    Map<String, Object> stats = problemService.getProblemStats(id);
    return ResponseEntity.ok(stats);
  }
}