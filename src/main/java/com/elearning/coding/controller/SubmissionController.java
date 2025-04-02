package com.elearning.coding.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.elearning.coding.dto.SubmissionsDTO;
import com.elearning.coding.entity.Submissions;
import com.elearning.coding.service.SubmissionService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/coding/submissions")
public class SubmissionController {
  private final SubmissionService submissionService;

  public SubmissionController(SubmissionService submissionService) {
    this.submissionService = submissionService;
  }

  //  코드제출 
  @PostMapping("/{problemId}")
  public ResponseEntity<Submissions> submitCode(
    @PathVariable Long problemId,
    @RequestBody SubmissionsDTO request) {
    System.out.println("코드"+request.getCode());
    Submissions submission = submissionService.submitSolution(problemId, request.getLanguage().toString(), request.getCode(), request.getUserId());
    System.out.println("제출완료"+submission);
    return ResponseEntity.ok(submission);
  }

  // 문제 제출 기록 조회
  @GetMapping
  public ResponseEntity<List<SubmissionsDTO>> getSubmissionsByProblem(@RequestParam Long problemId) {
    System.out.println("problemId: " + problemId);
    List<SubmissionsDTO> submissions = submissionService.getSubmissionsByProblem(problemId);
    System.out.println("submissionssize: " + submissions.size());
    return ResponseEntity.ok(submissions);
  }
}
