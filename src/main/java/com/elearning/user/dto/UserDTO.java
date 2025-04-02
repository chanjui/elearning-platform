package com.elearning.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
  private Long id;
  private String nickname;
  private String password;
  private String email;
  private String phone;
  private LocalDateTime regDate;
  private Boolean isDel;
  private String refreshToken;
  private Boolean isInstructor;
  private String accessToken;
}
