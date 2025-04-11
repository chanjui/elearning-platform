package com.elearning.course.service.CourseLearn;

import com.elearning.common.entity.LectureProgress;
import com.elearning.common.repository.LectureProgressRepository;
import com.elearning.course.dto.CourseLearn.*;
import com.elearning.course.dto.CourseParticular.BoardDTO;
import com.elearning.course.dto.CourseParticular.CommentDTO;
import com.elearning.course.dto.CourseParticular.CourseBasicDTO;
import com.elearning.course.entity.Board;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.entity.LectureVideo;
import com.elearning.course.repository.*;
import com.elearning.user.dto.LectureMemoDTO;
import com.elearning.user.entity.LectureMemo;
import com.elearning.user.entity.User;
import com.elearning.user.repository.LectureMemoRepository;
import com.elearning.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
  private final LectureMemoRepository lectureMemoRepository;  // LectureMemo 레포지토리 추가

  private final UserRepository userRepository;

  public CourseLearnDTO getCourseDetails(Long courseId, Long userId) {
    User user;
    user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("User not found"));


    // 1. 강의 정보 가져오기
    Course course = courseRepository.findByIdAndStatus(courseId, Course.CourseStatus.ACTIVE)
      .orElseThrow(() -> new IllegalArgumentException("Course not found"));

    // 2. 강의 섹션 정보 가져오기
    List<CourseSection> sections = courseSectionRepository.findByCourseIdOrderByOrderNumAsc(course.getId());

    // 3. 각 섹션에 해당하는 강의 정보 가져오기
    User finalUser = user;
    List<LearnCourseSectionDTO> curriculum = sections.stream()
      .map(section -> {
        List<LearnLectureVideoDTO> lectures = lectureVideoRepository.findBySectionIdOrderBySeqAsc(section.getId())
          .stream()
          .map(video -> {
            // 강의 진행 상태 및 완료 여부 가져오기
            int currentTime = getCurrentLectureProgress(finalUser, video);
            // 강의 완료 여부를 확인하는 부분 수정
            boolean isCompleted = currentTime > 0 && currentTime > video.getDuration() * 0.9;
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

    // 5. 강의 메모 가져오기
    List<LectureMemoDTO> lectureMemos = sections.stream()
      .flatMap(section -> lectureVideoRepository.findBySectionId(section.getId()).stream())  // 각 섹션에 해당하는 강의 찾기
      .flatMap(video -> lectureMemoRepository.findByLectureVideoId(video.getId()).stream())  // 각 강의에 해당하는 메모 찾기
      .filter(Objects::nonNull)  // null 체크 추가
      .map(memo -> new LectureMemoDTO(
        memo.getId(),
        memo.getUser().getId(),
        memo.getLectureVideo().getId(),
        memo.getLectureVideo().getTitle(),
        memo.getMemo(),
        memo.getUpdatedAt().toLocalDate()
      ))
      .collect(Collectors.toList());


    int totalLectures = (int) curriculum.stream().mapToLong(section -> section.getLectures().size()).sum();

    // 6. CourseLearnDTO 반환
    return new CourseLearnDTO(
      course.getId(),
      course.getSubject(),
      course.getInstructor().getUser().getNickname(),
      calculateProgress(user, course),
      totalLectures,
      (int) curriculum.stream().flatMap(section -> section.getLectures().stream()).filter(LearnLectureVideoDTO::isCompleted).count(),
      curriculum,
      questions,
      lectureMemos  // 강의 메모 추가
    );
  }

  // 유저의 강의 진행 상황을 계산하는 메서드
  private int calculateProgress(User user, Course course) {
    // 강의의 총 개수 계산
    int totalLectures = 0;

    // CourseId로 섹션들을 찾고, 각 섹션에 해당하는 강의들을 찾아 총 강의 개수를 계산
    List<CourseSection> sections = courseSectionRepository.findByCourseId(course.getId());

    for (CourseSection section : sections) {
      // 각 섹션의 강의 개수 합산
      List<LectureVideo> lectures = lectureVideoRepository.findBySectionId(section.getId());
      totalLectures += lectures.size();
    }

    // 유저가 완료한 강의 개수 합산
    int completedLectures = 0;

    for (CourseSection section : sections) {
      List<LectureVideo> lectures = lectureVideoRepository.findBySectionId(section.getId());
      for (LectureVideo video : lectures) {
        // 강의가 완료되었는지 체크
        int currentTime = getCurrentLectureProgress(user, video);
        if (currentTime > 0 && currentTime >= video.getDuration() * 0.9) {
          completedLectures++;
        }
      }
    }

    // 진행 비율 계산
    if (totalLectures == 0) {
      return 0; // 강의 개수가 없으면 진행도는 0
    }

    // 진행 비율 (완료된 강의 수 / 총 강의 개수 * 100)
    return (int) ((double) completedLectures / totalLectures * 100);
  }


  // 유저가 특정 강의를 얼마나 진행했는지 가져오는 메서드
  private int getCurrentLectureProgress(User user, LectureVideo video) {
    // LectureProgress 엔티티에서 유저와 강의에 해당하는 진행 상태를 가져옴
    LectureProgress progress = lectureProgressRepository.findByUserIdAndLectureVideoId(user.getId(), video.getId());
    if (progress == null) {
      return -1;
    }
    return progress.getCurrentTime(); // 현재 진행 시간을 반환 (초 단위)
  }

  public CourseBasicDTO getBasicCourseInfo(Long courseId) {
    Course course = courseRepository.findById(courseId)
      .orElseThrow(() -> new IllegalArgumentException("강의를 찾을 수 없습니다."));
    return new CourseBasicDTO(course.getId(), course.getSubject());
  }

  public LearnVideoDTO getLearnVideo(Long lectureVideoId, Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new EntityNotFoundException("User not found"));

    LectureVideo video = lectureVideoRepository.findById(lectureVideoId)
      .orElseThrow(() -> new EntityNotFoundException("LectureVideo not found"));

    CourseSection section = video.getSection(); // ✅ 현재 영상이 속한 섹션
    Course course = section.getCourse();

    int currentTime = getCurrentLectureProgress(user, video);
    boolean isCompleted = currentTime > 0 && currentTime > video.getDuration() * 0.9;

    Long nextVideoId = 0L;

    // 1. 현재 Section 에서 다음 seq 영상 찾기
    Optional<LectureVideo> nextVideoInSameSection = lectureVideoRepository.findBySectionIdAndSeq(section.getId(), video.getSeq() + 1);

    if (nextVideoInSameSection.isPresent()) {
      nextVideoId = nextVideoInSameSection.get().getId();
    } else {
      // 2. 다음 Section 찾기
      Optional<CourseSection> nextSection = courseSectionRepository.findByCourseIdAndOrderNum(course.getId(), section.getOrderNum() + 1);

      if (nextSection.isPresent()) {
        // 3. 해당 Section 의 첫 번째 영상 찾기
        Optional<LectureVideo> firstVideoInNextSection = lectureVideoRepository.findBySectionIdAndSeq(nextSection.get().getId(), 1);

        if (firstVideoInNextSection.isPresent()) {
          nextVideoId = firstVideoInNextSection.get().getId();
        }
      }
    }

    return new LearnVideoDTO(
      video.getId(),
      video.getTitle(),
      video.getVideoUrl(),
      video.getDuration(),
      video.getPreviewUrl(),
      video.getSeq(),
      video.isFree(),
      currentTime,
      isCompleted,
      nextVideoId // ✅ 추가된 부분
    );
  }


  public boolean addQuestion(QuestionDTO questionDTO) {
    try {
      // 사용자 & 강의 정보 가져오기
      User user = userRepository.findById(questionDTO.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

      Course course = courseRepository.findByIdAndStatus(questionDTO.getCourseId(), Course.CourseStatus.ACTIVE)
        .orElseThrow(() -> new IllegalArgumentException("Course not found"));

      // 질문 객체 생성 및 매핑
      Board question = new Board();
      question.setUser(user);
      question.setCourse(course);
      question.setSubject(questionDTO.getSubject());
      question.setContent(questionDTO.getContent());
      question.setBname(Board.BoardType.질문및답변);
      question.setEditDate(LocalDateTime.now());

      // DB 저장
      boardRepository.save(question);
      return true;  // 성공적으로 저장되면 true 반환

    } catch (Exception e) {
      return false; // 예외 발생 시 false 반환
    }
  }

  public boolean addLectureMemo(Long lectureVideoId, Long userId, String memoContent) {
    try {
      // 사용자 및 강의 정보 가져오기
      User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

      LectureVideo lectureVideo = lectureVideoRepository.findById(lectureVideoId)
        .orElseThrow(() -> new IllegalArgumentException("Lecture video not found"));

      // 새로운 메모 객체 생성
      LectureMemo lectureMemo = new LectureMemo();
      lectureMemo.setUser(user);
      lectureMemo.setLectureVideo(lectureVideo);
      lectureMemo.setMemo(memoContent);
      lectureMemo.setCreatedAt(LocalDateTime.now());
      lectureMemo.setUpdatedAt(LocalDateTime.now());

      // 메모 저장
      lectureMemoRepository.save(lectureMemo);

      // 저장 성공 시 true 반환
      return true;
    } catch (Exception e) {
      // 예외 발생 시 false 반환
      return false;
    }
  }

  public boolean saveOrUpdateProgress(Long userId, Long lectureVideoId, int currentTime) {
    try {
      System.out.println("저장준비완료");
      User user = userRepository.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("User not found"));

      LectureVideo video = lectureVideoRepository.findById(lectureVideoId)
        .orElseThrow(() -> new IllegalArgumentException("Lecture video not found"));

      LectureProgress progress = lectureProgressRepository.findByUserIdAndLectureVideoId(userId, lectureVideoId);

      if (progress != null && Boolean.TRUE.equals(progress.getIsCompleted())) {
        // ✅ 이미 완료된 경우, 더 이상 업데이트하지 않음
        return true;
      }

      boolean isCompleted = currentTime > 0 && currentTime >= video.getDuration() * 0.9;

      BigDecimal progressRate = BigDecimal.valueOf(currentTime)
        .divide(BigDecimal.valueOf(video.getDuration()), 4, RoundingMode.HALF_UP)
        .multiply(BigDecimal.valueOf(100))
        .setScale(2, RoundingMode.HALF_UP);

      boolean shouldUpdate = false;

      if (progress == null) {
        progress = new LectureProgress();
        progress.setUser(user);
        progress.setLectureVideo(video);
        shouldUpdate = true;
      } else {
        // ✅ 기존 값과 비교해서 변경된 경우만 저장
        if (!Objects.equals(progress.getCurrentTime(), currentTime)) shouldUpdate = true;
        if (!Objects.equals(progress.getIsCompleted(), isCompleted)) shouldUpdate = true;
        if (progress.getProgress() == null || progress.getProgress().compareTo(progressRate) != 0) shouldUpdate = true;
      }

      if (shouldUpdate) {
        progress.setCurrentTime(currentTime);
        progress.setIsCompleted(isCompleted);
        progress.setProgress(progressRate);
        progress.setUpdatedAt(LocalDateTime.now());
        lectureProgressRepository.save(progress); // ✅ 변경된 경우에만 저장
      }

      return true;

    } catch (Exception e) {
      e.printStackTrace();
      return false;
    }
  }


}
