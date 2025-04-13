package com.elearning.course.dto.Community;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommunityInfoDTO {
  private List<CommunityBoardDTO> allPosts;
  private List<PopularBoardDTO> weeklyPopularPosts;
  private List<PopularBoardDTO> monthlyPopularPosts;

}
