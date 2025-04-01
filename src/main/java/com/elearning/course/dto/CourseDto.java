package com.elearning.course.dto;

import com.elearning.course.entity.Course;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
  private Long id;
  private Long instructorId;
  private Long categoryId;
  private String subject;
  private String thumbnailUrl;
  private String backImageUrl;
  private String description;
  private String target;
  private Integer price;
  private BigDecimal discountRate;
  private LocalDateTime regDate;
  private LocalDateTime updateDate;
  @Enumerated(EnumType.STRING)
  private Course.CourseStatus status;
  private Boolean isDel;

  // courseRating
  private Double rating;
}
