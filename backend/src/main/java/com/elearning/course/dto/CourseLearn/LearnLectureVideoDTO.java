package com.elearning.course.dto.CourseLearn;

import com.elearning.course.dto.CourseParticular.LectureVideoDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LearnLectureVideoDTO extends LectureVideoDTO {
  private int currentTime;  // 사용자가 마지막으로 본 위치 (초 단위)
  private boolean isCompleted;  // 해당 강의를 완료했는지 여부

  public LearnLectureVideoDTO(Long id, String title, int duration, boolean isFree, int currentTime, boolean isCompleted) {
    // 부모 클래스의 생성자를 호출하며, 올바른 인자를 전달
    super(id, title, duration, isFree);
    this.currentTime = currentTime;
    this.isCompleted = isCompleted;
  }
}
