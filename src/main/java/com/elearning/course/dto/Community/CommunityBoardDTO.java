package com.elearning.course.dto.Community;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommunityBoardDTO {
  private Long id;
  private String title;
  private String content;
  private String category;
  private LocalDateTime createdAt;

  private int likes;
  private int views;
  private int comments;

  private AuthorDTO author;

  @Getter
  @Setter
  public static class AuthorDTO {
    private Long userId;
    private String name;
    private String image;
  }

}
