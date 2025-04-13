package com.elearning.course.dto.CourseLearn;

import com.elearning.course.dto.CourseParticular.BoardDTO;
import com.elearning.user.dto.LectureMemoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@Builder
public class CourseLearnDTO {
  private Long id;
  private String title;
  private String instructor;
  private int progress;
  private int totalLectures;
  private int completedLectures;
  private List<LearnCourseSectionDTO> curriculum;
  private List<BoardDTO> questions;
  private List<LectureMemoDTO> lectureMemos;  // 강의 메모 추가
}
