package com.elearning.coding.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.util.Optional;

import com.elearning.coding.entity.Problems;
import com.elearning.coding.entity.Submissions;
import com.elearning.coding.repository.ProblemRepository;
import com.elearning.coding.repository.SubmissionRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;

@Service
public class CodeExecutionService {
  private final SubmissionRepository submissionRepository;
  private final ProblemRepository problemRepository;
  private final UserRepository userRepository;

  public CodeExecutionService(SubmissionRepository submissionRepository, ProblemRepository problemRepository, UserRepository userRepository) {
    this.submissionRepository = submissionRepository;
    this.problemRepository = problemRepository;
    this.userRepository = userRepository;
  }

  public Submissions executeCode(Long problemId, String code, Long userId) {
    Optional<Problems> problemOpt = problemRepository.findById(problemId);
    if (problemOpt.isEmpty()) {
      throw new IllegalArgumentException("해당 문제를 찾을 수 없습니다.");
    }
    Problems problem = problemOpt.get();

    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
      throw new IllegalArgumentException("해당 유저를 찾을 수 없습니다.");
    }
    User user = userOpt.get();

    String[] inputCases = problem.getInputExample().split("\n");
    String[] expectedOutputs = problem.getOutputExample().split("\n");

    boolean allPassed = true;
    String actualOutput = "";

    for (int i = 0; i < inputCases.length; i++) {
      String result = runPythonCode(code, inputCases[i]);
      actualOutput = result;  

      if (!result.trim().equals(expectedOutputs[i].trim())) {
        allPassed = false;
        break;
      }
    }

    Submissions.SubmissionStatus status = allPassed ? Submissions.SubmissionStatus.ACCEPTED : Submissions.SubmissionStatus.WRONG_ANSWER;

    Submissions submission = new Submissions();
    submission.setProblem(problem);
    submission.setUser(user);
    submission.setCode(code);
    submission.setStatus(status);
    submission.setActualOutput(actualOutput); 

    return submissionRepository.save(submission);
  }

  private String runPythonCode(String code, String input) {
    try {
      File scriptFile = File.createTempFile("user_code", ".py");
      try (BufferedWriter writer = new BufferedWriter(new FileWriter(scriptFile))) {
        writer.write(code);
      }

      ProcessBuilder processBuilder = new ProcessBuilder("python", scriptFile.getAbsolutePath());
      processBuilder.redirectErrorStream(true);
      Process process = processBuilder.start();

      try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
        writer.write(input);
        writer.newLine();
        writer.flush();
      }

      try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
        return reader.readLine();
      }

    } catch (IOException e) {
      return "ERROR: " + e.getMessage();
    }
  }
}
