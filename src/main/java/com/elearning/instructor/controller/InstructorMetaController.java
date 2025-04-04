package com.elearning.instructor.controller;

import com.elearning.instructor.dto.ExpertiseDTO;
import com.elearning.instructor.entity.Expertise;
import com.elearning.course.entity.Category;
import com.elearning.course.repository.CategoryRepository;
import com.elearning.instructor.repository.ExpertiseRepository;
import com.elearning.course.dto.CategoryDTO;
import com.elearning.common.ResultData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructor/meta")
@RequiredArgsConstructor
public class InstructorMetaController {

  private final ExpertiseRepository expertiseRepository;
  private final CategoryRepository categoryRepository;

  @GetMapping("/expertise")
  public ResultData<List<ExpertiseDTO>> getAllExpertise() {
    List<ExpertiseDTO> list = expertiseRepository.findAll().stream()
      .map(e -> new ExpertiseDTO(e.getId(), e.getName()))
      .collect(Collectors.toList());

    return ResultData.of(1, "전문 분야 조회 성공", list);
  }

  @GetMapping("/categories")
  public ResultData<List<CategoryDTO>> getAllCategories() {
    List<CategoryDTO> list = categoryRepository.findAll().stream()
      .map(c -> new CategoryDTO(c.getId(), c.getName()))
      .collect(Collectors.toList());

    return ResultData.of(1, "카테고리 조회 성공", list);
  }
}
