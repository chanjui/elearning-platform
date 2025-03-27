package com.elearning.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "course")
@Getter
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructorId", nullable = false)
    private Instructor instructor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", nullable = false)
    private Category category;

    @Column(length = 100, nullable = false)
    private String subject;

    @Column(length = 255)
    private String thumbnailUrl;

    @Column(length = 255)
    private String backImageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String target;

    @Column
    private Integer price;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount_rate;

    @Column
    private LocalDateTime regDate;

    @Column
    private LocalDateTime updateDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CourseStatus status;

    public enum CourseStatus {
        PREPARING, ACTIVE, CLOSED
    }
} 