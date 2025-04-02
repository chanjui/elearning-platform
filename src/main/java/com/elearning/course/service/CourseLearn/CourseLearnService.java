package com.elearning.course.service.CourseLearn;

import com.elearning.common.entity.LectureProgress;
import com.elearning.common.repository.LectureProgressRepository;
import com.elearning.course.dto.CourseLearn.CourseLearnDTO;
import com.elearning.course.dto.CourseLearn.LearnCourseSectionDTO;
import com.elearning.course.dto.CourseLearn.LearnLectureVideoDTO;
import com.elearning.course.dto.CourseParticular.BoardDTO;
import com.elearning.course.dto.CourseParticular.CommentDTO;
import com.elearning.course.entity.Board;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.entity.LectureVideo;
import com.elearning.course.repository.*;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseLearnService {
  private final CourseRepository courseRepository;
  private final CourseSectionRepository courseSectionRepository;
  private final LectureVideoRepository lectureVideoRepository;
  private final BoardRepository boardRepository;
  private final CommentRepository commentRepository;
  private final LectureProgressRepository lectureProgressRepository;

  private final UserRepository userRepository;

  public CourseLearnDTO getCourseDetails(Long courseId, User user) {
    if (user == null) {
      user = userRepository.findById(14l).get();
    }
    // 1. 강의 정보 가져오기
    Course course = courseRepository.findById(courseId)
      .orElseThrow(() -> new IllegalArgumentException("Course not found"));

    // 2. 강의 섹션 정보 가져오기
    List<CourseSection> sections = courseSectionRepository.findByCourseId(course.getId());

    // 3. 각 섹션에 해당하는 강의 정보 가져오기
    User finalUser = user;
    List<LearnCourseSectionDTO> curriculum = sections.stream()
      .map(section -> {
        List<LearnLectureVideoDTO> lectures = lectureVideoRepository.findBySectionId(section.getId())
          .stream()
          .map(video -> {
            // 강의 진행 상태 및 완료 여부 가져오기
            int currentTime = getCurrentLectureProgress(finalUser, video);
            boolean isCompleted = currentTime > video.getDuration() - 30;
            return new LearnLectureVideoDTO(
              video.getId(),
              video.getTitle(),
              video.getDuration(),
              video.isFree(),
              currentTime,
              isCompleted
            );
          })
          .collect(Collectors.toList());
        return new LearnCourseSectionDTO(section.getId(), section.getSubject(), lectures);
      })
      .collect(Collectors.toList());

    // 4. 질문 및 답변 가져오기
    List<BoardDTO> questions = boardRepository.findByCourseIdAndBname(course.getId(), Board.BoardType.질문및답변)
      .stream()
      .map(board -> {
        List<CommentDTO> comments = commentRepository.findByBoardId(board.getId())
          .stream()
          .map(comment -> new CommentDTO(
            comment.getId(),
            comment.getUser().getId(),
            comment.getUser().getNickname(),
            comment.getUser().getProfileUrl(),
            comment.getContent(),
            comment.getEditDate().toLocalDate()
          ))
          .collect(Collectors.toList());

        return new BoardDTO(
          board.getId(),
          board.getUser().getId(),
          board.getUser().getNickname(),
          board.getUser().getProfileUrl(),
          board.getSubject(),
          board.getContent(),
          board.getRegDate().toLocalDate(),
          comments
        );
      })
      .collect(Collectors.toList());

    int totalLectures = curriculum.stream().flatMap(section -> section.getLectures().stream()).collect(Collectors.toList()).size();
    // 5. CourseLearnDTO 반환
    return new CourseLearnDTO(
      course.getId(),
      course.getSubject(),
      course.getInstructor().getUser().getNickname(),
      calculateProgress(user, course),
      totalLectures,
      (int) curriculum.stream().flatMap(section -> section.getLectures().stream()).filter(LearnLectureVideoDTO::isCompleted).count(),
      curriculum,
      questions
    );
  }

  // 유저의 강의 진행 상황을 계산하는 메서드
  private int calculateProgress(User user, Course course) {
    // 강의의 총 시간 계산 (모든 섹션에 포함된 모든 강의의 총 시간 합산)
    int totalDuration = 0;

    // CourseId로 섹션들을 찾고, 각 섹션에 해당하는 강의들을 찾아 총 시간을 계산
    List<CourseSection> sections = courseSectionRepository.findByCourseId(course.getId());

    for (CourseSection section : sections) {
      // 각 섹션의 강의 시간 합산
      List<LectureVideo> lectures = lectureVideoRepository.findBySectionId(section.getId());
      for (LectureVideo video : lectures) {
        totalDuration += video.getDuration();
      }
    }

    // 유저가 현재까지 본 시간 합산
    int totalWatchedTime = 0;

    for (CourseSection section : sections) {
      List<LectureVideo> lectures = lectureVideoRepository.findBySectionId(section.getId());
      for (LectureVideo video : lectures) {
        totalWatchedTime += getCurrentLectureProgress(user, video); // 유저의 강의 진행 시간 합산
      }
    }

    // 진행 비율 계산
    if (totalDuration == 0) {
      return 0; // 강의 시간이 없으면 진행도는 0
    }

    // 진행 비율 (전체 진행 시간 / 총 시간 * 100)
    return (int) ((double) totalWatchedTime / totalDuration * 100);
  }


  // 유저가 특정 강의를 얼마나 진행했는지 가져오는 메서드
  private int getCurrentLectureProgress(User user, LectureVideo video) {
    // LectureProgress 엔티티에서 유저와 강의에 해당하는 진행 상태를 가져옴
    LectureProgress progress = lectureProgressRepository.findByUserIdAndLectureVideoId(user.getId(), video.getId());
    if (progress == null) {
      return 0;
    }
    return progress.getCurrentTime(); // 현재 진행 시간을 반환 (초 단위)
  }


}
