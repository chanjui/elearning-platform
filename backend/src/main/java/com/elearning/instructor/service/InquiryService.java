package com.elearning.instructor.service;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.Comment;
import com.elearning.course.repository.BoardRepository;
import com.elearning.course.repository.CommentRepository;
import com.elearning.instructor.dto.inquiries.InquiryDTO;
import com.elearning.instructor.dto.inquiries.InquiryQueryDTO;
import com.elearning.instructor.dto.inquiries.InquiryReplyDTO;
import com.elearning.instructor.repository.query.inquiries.InquiryQueryRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InquiryService {

  private final BoardRepository boardRepository;
  private final CommentRepository commentRepository;
  private final InquiryQueryRepository inquiryQueryRepository;
  private final UserRepository userRepository; // 추가

  /**
   * 수강 전 문의 리스트 조회
   */
  public List<InquiryDTO> getInquiries(Long instructorId, Long courseId, String query, String status) {
    List<InquiryQueryDTO> list = inquiryQueryRepository.searchInquiries(instructorId, courseId, query, status);

    return list.stream()
      .map(dto -> {
        List<InquiryReplyDTO> replies = commentRepository.findByBoardIdAndIsDel(dto.getId(), false)
          .stream()
          .map(reply -> new InquiryReplyDTO(
            reply.getId(),
            reply.getUser().getNickname(),
            reply.getRegDate().toString(),
            reply.getContent()
          ))
          .collect(Collectors.toList());

        return new InquiryDTO(
          dto.getId(),
          dto.getCourseTitle(),
          dto.getSubject(),
          dto.getContent(),
          dto.getAuthor(),
          dto.getRegDate(),
          dto.getReplyCount(),
          dto.getReplyCount() > 0 ? "답변완료" : "미답변",
          replies
        );
      })
      .collect(Collectors.toList());
  }



  /**
   * 답변 등록
   */
  @Transactional
  public void addReply(Long boardId, InquiryReplyDTO dto, Long userId) {
    Board board = boardRepository.findById(boardId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 문의입니다."));

    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

    Comment reply = new Comment();
    reply.setBoard(board);
    reply.setUser(user);
    reply.setContent(dto.getContent());

    commentRepository.save(reply);
  }

  /**
   * 답변 수정
   */
  @Transactional
  public void updateReply(Long replyId, InquiryReplyDTO dto, Long userId) {
    Comment reply = commentRepository.findById(replyId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 답변입니다."));

    if (!reply.getUser().getId().equals(userId)) {
      throw new RuntimeException("수정 권한이 없습니다.");
    }

    reply.setContent(dto.getContent());
    reply.setEditDate(java.time.LocalDateTime.now()); // editDate 직접 세팅
  }

  /**
   * 답변 삭제
   */
  @Transactional
  public void deleteReply(Long replyId, Long userId) {
    Comment reply = commentRepository.findById(replyId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 답변입니다."));

    if (!reply.getUser().getId().equals(userId)) {
      throw new RuntimeException("삭제 권한이 없습니다.");
    }

    reply.setDel(true); // 소프트 삭제 처리
  }
}
