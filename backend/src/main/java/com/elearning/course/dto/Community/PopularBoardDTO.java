package com.elearning.course.dto.Community;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PopularBoardDTO {
  private Long id;
  private String title;
  private String profileImage;
  private Long userId;
  private String userName;
}
