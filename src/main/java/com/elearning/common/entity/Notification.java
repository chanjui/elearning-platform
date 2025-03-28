package com.elearning.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Getter
@Setter
public class Notification extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType notificationType = NotificationType.INFO;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isRead = false;
    
    @Column(name = "createdAt")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public enum NotificationType {
        INFO, WARNING, ERROR
    }
} 