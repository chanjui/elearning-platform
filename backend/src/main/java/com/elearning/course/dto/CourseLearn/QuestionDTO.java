package com.elearning.course.dto.CourseLearn;

import com.elearning.course.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
  private Long userId;
  private Long courseId;
  private String subject;
  private String content;
  private Board.BoardType bname = Board.BoardType.질문및답변;
}
