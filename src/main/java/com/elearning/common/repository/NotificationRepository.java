package com.elearning.common.repository;

import com.elearning.common.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  // 특정 유저에 대한 최근 알림 5개
  List<Notification> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);
}
