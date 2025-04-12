package com.elearning.course.dto.Community;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommunityBoardCommentDTO {
  private Long commentId;
  private String content;
  private String userNickname;
  private String userProfileImage;
  private LocalDateTime createdDate;
  private LocalDateTime editDate;
  private Long userId;
}