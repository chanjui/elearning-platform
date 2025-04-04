package com.elearning.instructor.dto;

import com.elearning.instructor.entity.Instructor;
import com.elearning.user.entity.User;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO {
  private Long userId;
  private String githubLink;
  private String bio;
  private String desiredField;
  private String referralSource;

  // DTO → Entity 변환
  public Instructor toEntity(User user) {
    return Instructor.builder()
      .user(user)
      .githubLink(this.githubLink)
      .bio(this.bio)
      .desiredField(this.desiredField)
      .referralSource(this.referralSource)
      .build();
  }

  // Entity → DTO 변환
  public static InstructorDTO fromEntity(Instructor instructor) {
    return InstructorDTO.builder()
      .userId(instructor.getUser().getId())
      .githubLink(instructor.getGithubLink())
      .bio(instructor.getBio())
      .desiredField(instructor.getDesiredField())
      .referralSource(instructor.getReferralSource())
      .build();
  }
}
