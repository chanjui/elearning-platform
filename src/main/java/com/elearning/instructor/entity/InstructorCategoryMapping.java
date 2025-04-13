package com.elearning.instructor.entity;

import com.elearning.course.entity.Category;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "instructorCategoryMapping")
public class InstructorCategoryMapping {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "instructorId")
  private Instructor instructor;

  @ManyToOne
  @JoinColumn(name = "categoryId")
  private Category category;
}
