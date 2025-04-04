package com.elearning.instructor.dto;

import com.elearning.instructor.entity.Instructor;
import com.elearning.user.entity.User;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO {
  private Long userId;
  private String githubLink;
  private String bio;
  private String referralSource;
  private Long expertiseId;

  // 희망 분야 ID 목록 (다중 선택)
  private List<Long> fieldIds;

  // DTO → Entity 변환
  public Instructor toEntity(User user) {
    return Instructor.builder()
      .user(user)
      .githubLink(this.githubLink)
      .bio(this.bio)
      .referralSource(this.referralSource)
      .build();
  }

  // Entity → DTO 변환
  public static InstructorDTO fromEntity(Instructor instructor) {
    return InstructorDTO.builder()
      .userId(instructor.getUser().getId())
      .githubLink(instructor.getGithubLink())
      .bio(instructor.getBio())
      .referralSource(instructor.getReferralSource())
      .expertiseId(
        instructor.getExpertise() != null ? instructor.getExpertise().getId() : null
      )
      .fieldIds(instructor.getDesiredFields().stream()
        .map(mapping -> mapping.getCategory().getId())
        .collect(Collectors.toList()))
      .build();
    }
}
