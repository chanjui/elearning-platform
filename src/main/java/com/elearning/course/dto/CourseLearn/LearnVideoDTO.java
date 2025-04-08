package com.elearning.course.dto.CourseLearn;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LearnVideoDTO {
  private Long id;
  private String title;
  private String videoUrl;
  private Integer duration;
  private String previewUrl;
  private Integer seq;
  private boolean isFree;
  private Integer currentTime;
  private boolean isCompleted;
  private Long nextVideoId;
}
