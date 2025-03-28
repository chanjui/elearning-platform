package com.elearning.instructor.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * 알림 정보 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
  private Long id;                // 알림 고유 ID
  private String title;           // 알림 제목
  private String message;         // 알림 내용
  private String notificationType; // 'INFO', 'WARNING', 'ERROR' 등
  private boolean isRead;         // 읽음 여부
  private LocalDateTime createdAt; // 생성 일시
}

