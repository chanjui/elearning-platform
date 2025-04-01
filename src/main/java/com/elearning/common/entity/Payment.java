package com.elearning.common.entity;

import com.elearning.course.entity.Course;
import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courseId")
    private Course course;
    
    @Column(nullable = false)
    private Integer price;
    
    @Column(length = 50)
    private String paymentMethod;
    
    @Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private Integer status = 0;
    
    private LocalDateTime cancelDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime regDate = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
      this.regDate = LocalDateTime.now();
    }
}