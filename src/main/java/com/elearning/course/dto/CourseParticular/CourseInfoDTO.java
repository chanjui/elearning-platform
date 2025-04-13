package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CourseInfoDTO {
  private Long id;
  private String title;
  private String description;
  private String instructor;
  private double price;
  private double rating;
  private int students;
  private int totalLectures;
  private double totalHours;
  private String level;
  private LocalDate lastUpdated;
  private String image;
  private List<CourseSectionDTO> curriculum;
  private List<CourseRatingDTO> reviews;
  private List<BoardDTO> questions;
  private Boolean isEnrolled;
  private Boolean isLiked;
}
