package com.elearning.course.dto.Community;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class CommunityBoardOneDTO {
  private Long boardId;
  private String subject;
  private String content;
  private String fileData;
  private Long userId;
  private String userNickname;
  private String userProfileImage;
  private LocalDateTime createdDate;
  private LocalDateTime editDate;
  private List<CommunityBoardCommentDTO> comments;
  private String category;
  private boolean liked;
}
