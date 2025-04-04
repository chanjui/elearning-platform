package com.elearning.coding.service;

import org.springframework.stereotype.Service;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
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

  // language: "python", "java", "javascript", "c"
  public Submissions executeCode(Long problemId, String language, String code, Long userId) {
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
      String result = runCode(language, code, inputCases[i]);
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
    submission.setLanguage(Submissions.Language.valueOf(language.toUpperCase()));

    return submissionRepository.save(submission);
  }

  // 언어에 따라 적절한 실행 메서드를 호출합니다.
  private String runCode(String language, String code, String input) {
    switch(language.toLowerCase()) {
      case "python":
        return runPythonCode(code, input);
      case "java":
        return runJavaCode(code, input);
      case "javascript":
        return runJavaScriptCode(code, input);
      case "c":
        return runCCode(code, input);
      default:
        return "지원하지 않는 언어입니다.";
    }
  }

  private String runPythonCode(String code, String input) {
    try {
      File scriptFile = File.createTempFile("user_code", ".py");
      try (BufferedWriter writer = new BufferedWriter(new FileWriter(scriptFile))) {
        writer.write(code);
      }

      // Python 실행 명령어를 시스템에 따라 결정
      String pythonCommand = System.getProperty("os.name").toLowerCase().contains("windows") ? "python" : "python3";
      ProcessBuilder processBuilder = new ProcessBuilder(pythonCommand, scriptFile.getAbsolutePath());
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

  private String runJavaCode(String code, String input) {
    try {
      // 임시 디렉토리를 생성하고 "Main.java"로 저장
      Path tempDir = Files.createTempDirectory("java_code");
      File sourceFile = new File(tempDir.toFile(), "Main.java");
      try (BufferedWriter writer = new BufferedWriter(new FileWriter(sourceFile))) {
        writer.write(code);
      }
      // 자바 컴파일
      ProcessBuilder compilePB = new ProcessBuilder("javac", sourceFile.getAbsolutePath());
      compilePB.directory(tempDir.toFile());
      Process compileProcess = compilePB.start();
      int compileResult = compileProcess.waitFor();
      if (compileResult != 0) {
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()));
        StringBuilder compileError = new StringBuilder();
        String line;
        while ((line = errorReader.readLine()) != null) {
          compileError.append(line).append("\n");
        }
        return "Compilation error: " + compileError.toString();
      }
      // 실행: "java -cp [tempDir] Main"
      ProcessBuilder runPB = new ProcessBuilder("java", "-cp", tempDir.toFile().getAbsolutePath(), "Main");
      runPB.directory(tempDir.toFile());
      runPB.redirectErrorStream(true);
      Process runProcess = runPB.start();
      try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()))) {
        writer.write(input);
        writer.newLine();
        writer.flush();
      }
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()))) {
        return reader.readLine();
      }
    } catch (IOException | InterruptedException e) {
      return "ERROR: " + e.getMessage();
    }
  }

  private String runJavaScriptCode(String code, String input) {
    try {
      File scriptFile = File.createTempFile("user_code", ".js");
      try (BufferedWriter writer = new BufferedWriter(new FileWriter(scriptFile))) {
        writer.write(code);
      }
      ProcessBuilder processBuilder = new ProcessBuilder("node", scriptFile.getAbsolutePath());
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

  private String runCCode(String code, String input) {
    try {
      // 임시 디렉토리를 생성하고 "program.c"로 저장
      Path tempDir = Files.createTempDirectory("c_code");
      File sourceFile = new File(tempDir.toFile(), "program.c");
      try (BufferedWriter writer = new BufferedWriter(new FileWriter(sourceFile))) {
        writer.write(code);
      }
      // gcc를 사용해 컴파일
      ProcessBuilder compilePB = new ProcessBuilder("gcc", sourceFile.getAbsolutePath(), "-o", "program");
      compilePB.directory(tempDir.toFile());
      Process compileProcess = compilePB.start();
      int compileResult = compileProcess.waitFor();
      if (compileResult != 0) {
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()));
        StringBuilder compileError = new StringBuilder();
        String line;
        while ((line = errorReader.readLine()) != null) {
          compileError.append(line).append("\n");
        }
        return "Compilation error: " + compileError.toString();
      }
      // 실행: "./program"
      ProcessBuilder runPB = new ProcessBuilder("./program");
      runPB.directory(tempDir.toFile());
      runPB.redirectErrorStream(true);
      Process runProcess = runPB.start();
      try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()))) {
        writer.write(input);
        writer.newLine();
        writer.flush();
      }
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()))) {
        return reader.readLine();
      }
    } catch (IOException | InterruptedException e) {
      return "ERROR: " + e.getMessage();
    }
  }
}