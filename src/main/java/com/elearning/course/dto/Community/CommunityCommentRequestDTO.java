package com.elearning.course.dto.Community;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommunityCommentRequestDTO {
  private Long userId;
  private Long boardId;
  private String content;
}
