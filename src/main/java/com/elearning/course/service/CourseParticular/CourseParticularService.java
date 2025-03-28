package com.elearning.course.service.CourseParticular;

import com.elearning.course.dto.CourseParticular.*;
import com.elearning.course.entity.Board;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.*;
import com.elearning.user.repository.CourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseParticularService {
  private final BoardRepository boardRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CourseRepository courseRepository;
  private final CourseSectionRepository courseSectionRepository;
  private final LectureVideoRepository lectureVideoRepository;
  private final CourseRatingRepository courseRatingRepository;

  public CourseInfoDTO getCourseParticular(Long courseId) {
    Course course = courseRepository.findById(courseId).orElse(null);
    if (course == null) {
      return null;
    }

    List<CourseSectionDTO> curriculum = courseSectionRepository.findByCourseId(courseId).stream().map(
      section -> new CourseSectionDTO(
        section.getId(),
        section.getSubject(),
        lectureVideoRepository.findBySectionId(section.getId()).stream().map(
          lecture -> new LectureVideoDTO(
            lecture.getId(),
            lecture.getTitle(),
            lecture.getDuration(),
            lecture.isFree()
          )).collect(Collectors.toList())
      )).collect(Collectors.toList());

    List<CourseRatingDTO> reviews = courseRatingRepository.findByCourseId(courseId).stream().map(
      rating -> new CourseRatingDTO(
        rating.getId(),
        rating.getUser() != null ? rating.getUser().getNickname() : "Unknown",
        rating.getRating(),
        rating.getRegDate(),
        rating.getContent()
      )).collect(Collectors.toList());

    List<BoardDTO> questions = boardRepository.findByCourseIdAndBname(courseId, Board.BoardType.수강전질문)
      .stream()
      .map(q -> new BoardDTO(
        q.getId(),
        q.getUser() != null ? q.getUser().getNickname() : "Unknown",
        q.getSubject(),
        q.getContent(),
        q.getRegDate()
      ))
      .collect(Collectors.toList());

    int students = courseEnrollmentRepository.countCourseEnrollmentByCourseId(courseId);
    double averageRating = reviews.stream().mapToInt(CourseRatingDTO::getRating).average().orElse(0.0);
    int totalLectures = curriculum.stream().mapToInt(section -> section.getLectures().size()).sum();
    double totalHours = curriculum.stream().flatMap(section -> section.getLectures().stream()).mapToInt(
      LectureVideoDTO::getDuration).sum() / 60.0;

    CourseInfoDTO result = new CourseInfoDTO(
      course.getId(),
      course.getSubject(),
      course.getDescription(),
      course.getInstructor().getUser().getNickname(),
      course.getPrice(),
      averageRating,
      students,
      totalLectures,
      totalHours,
      course.getTarget(),
      course.getUpdateDate(),
      course.getThumbnailUrl(),
      curriculum,
      reviews,
      questions
    );

    return result;

  }
}
