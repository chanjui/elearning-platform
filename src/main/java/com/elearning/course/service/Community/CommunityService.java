package com.elearning.course.service.Community;

import com.elearning.course.dto.Community.*;
import com.elearning.course.dto.Community.CommunityBoardDTO.AuthorDTO;
import com.elearning.course.entity.Board;
import com.elearning.course.entity.BoardLike;
import com.elearning.course.entity.Comment;
import com.elearning.course.repository.BoardLikeRepository;
import com.elearning.course.repository.BoardRepository;
import com.elearning.course.repository.CommentRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {
  private final BoardRepository boardRepository;
  private final BoardLikeRepository boardLikeRepository;
  private final CommentRepository commentRepository;
  private final UserRepository userRepository;

  // 통합 메서드: 전체 게시글 + 인기 게시글 포함
  public CommunityInfoDTO getCommunityInfo() {
    List<Board.BoardType> excludedTypes = List.of(Board.BoardType.수강평, Board.BoardType.수강전질문);

    // 전체 게시글 조회
    List<Board> boards = boardRepository.findAllByBnameNotInAndIsDelFalse(excludedTypes);

    // 전체 게시글 DTO 변환
    List<CommunityBoardDTO> allPosts = boards.stream().map(board -> {
      CommunityBoardDTO dto = new CommunityBoardDTO();
      dto.setId(board.getId());
      dto.setTitle(board.getSubject());
      dto.setContent(board.getContent());
      dto.setCategory(board.getBname().name());
      dto.setCreatedAt(board.getRegDate());

      dto.setLikes(boardLikeRepository.countByBoard(board));
      dto.setViews(board.getViewCount());
      dto.setComments(commentRepository.countByBoardAndIsDelFalse(board));

      String courseTitle = board.getCourse() != null ? board.getCourse().getSubject() : "";
      dto.setCourseSubject(courseTitle);


      AuthorDTO author = new AuthorDTO();
      author.setName(board.getUser().getNickname());
      author.setImage(board.getUser().getProfileUrl());
      author.setUserId(board.getUser().getId());
      dto.setAuthor(author);

      return dto;
    }).collect(Collectors.toList());

    // 인기 게시글 선별 (likes 기준, 정렬 후 상위 N개)
    List<PopularBoardDTO> weeklyPopularPosts = allPosts.stream()
      .sorted(Comparator.comparingInt(CommunityBoardDTO::getLikes).reversed())
      .limit(5)
      .map(post -> new PopularBoardDTO(post.getId(), post.getTitle(), post.getAuthor().getImage(), post.getAuthor().getUserId(), post.getAuthor().getName()))
      .collect(Collectors.toList());

    List<PopularBoardDTO> monthlyPopularPosts = allPosts.stream()
      .sorted(Comparator.comparingInt(CommunityBoardDTO::getComments).reversed()) // 예시로 댓글 수 기준
      .limit(5)
      .map(post -> new PopularBoardDTO(post.getId(), post.getTitle(), post.getAuthor().getImage(), post.getAuthor().getUserId(), post.getAuthor().getName()))
      .collect(Collectors.toList());

    return new CommunityInfoDTO(allPosts, weeklyPopularPosts, monthlyPopularPosts);
  }

  public CommunityBoardOneDTO getBoardDetail(Long boardId, Long userId) {
    // 게시글 조회
    Board board = boardRepository.findByIdAndIsDelFalse(boardId)
      .orElseThrow(() -> new EntityNotFoundException("해당 게시글을 찾을 수 없습니다."));

    // 댓글 목록 조회
    List<Comment> commentList = commentRepository.findByBoardAndIsDelFalse(board);

    // 댓글 DTO 변환
    List<CommunityBoardCommentDTO> commentDTOs = commentList.stream()
      .map(comment -> CommunityBoardCommentDTO.builder()
        .commentId(comment.getId())
        .content(comment.getContent())
        .userNickname(comment.getUser().getNickname())
        .userProfileImage(comment.getUser().getProfileUrl())
        .createdDate(comment.getRegDate())
        .editDate(comment.getEditDate())
        .userId(comment.getUser().getId())
        .build()
      ).collect(Collectors.toList());

    boolean liked = false;
    if (userId != null && userId != 0) {
      User user = userRepository.findById(userId)
        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
      liked = boardLikeRepository.findByBoardAndUser(board, user).isPresent();
    }

    // 게시글 DTO 반환
    return CommunityBoardOneDTO.builder()
      .boardId(board.getId())
      .subject(board.getSubject())
      .content(board.getContent())
      .fileData(board.getFileData())
      .userId(board.getUser().getId())
      .userNickname(board.getUser().getNickname())
      .userProfileImage(board.getUser().getProfileUrl())
      .createdDate(board.getRegDate())
      .editDate(board.getEditDate())
      .comments(commentDTOs)
      .category(board.getBname().name())
      .liked(liked)
      .build();
  }

  public boolean incrementViewCount(Long boardId) {
    try {
      boardRepository.findById(boardId).ifPresent(board -> {
        board.setViewCount(board.getViewCount() + 1);
        boardRepository.save(board);
      });
      return true;
    } catch (Exception e) {
      // 예외 발생 시 false 반환
      return false;
    }
  }

  public boolean addComment(CommunityCommentRequestDTO requestDTO) {
    Board board = boardRepository.findById(requestDTO.getBoardId())
      .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

    User user = userRepository.findById(requestDTO.getUserId())
      .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

    Comment comment = new Comment();
    comment.setBoard(board);
    comment.setUser(user);
    comment.setContent(requestDTO.getContent());
    comment.setEditDate(LocalDateTime.now());

    commentRepository.save(comment);

    return true;
  }

  public boolean editComment(Long commentId, CommunityCommentRequestDTO requestDTO) {
    Comment comment = commentRepository.findById(commentId)
      .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

    // 수정 권한 확인
    if (!comment.getUser().getId().equals(requestDTO.getUserId())) {
      throw new IllegalArgumentException("댓글 수정 권한이 없습니다.");
    }

    // 내용 업데이트
    comment.setContent(requestDTO.getContent());
    comment.setEditDate(LocalDateTime.now());

    commentRepository.save(comment);
    return true;
  }

  public boolean toggleBoardLike(Long boardId, Long userId) {
    Board board = boardRepository.findByIdAndIsDelFalse(boardId)
      .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

    User user = userRepository.findById(userId).orElse(null);

    return boardLikeRepository.findByBoardAndUser(board, user)
      .map(existingLike -> {
        boardLikeRepository.delete(existingLike);
        return false; // 좋아요 취소
      })
      .orElseGet(() -> {
        BoardLike newLike = new BoardLike();
        newLike.setBoard(board);
        newLike.setUser(user);
        newLike.setLikedAt(LocalDateTime.now());
        boardLikeRepository.save(newLike);
        return true; // 좋아요 추가
      });
  }

  public boolean deleteComment(Long commentId, Long userId) {
    if (userId == 0) {
      throw new IllegalArgumentException("유효하지 않은 사용자입니다.");
    }

    Comment comment = commentRepository.findById(commentId)
      .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 존재하지 않습니다."));

    if (!comment.getUser().getId().equals(userId)) {
      throw new SecurityException("본인의 댓글만 삭제할 수 있습니다.");
    }

    comment.setDel(true); // 실제 삭제가 아닌 소프트 딜리트
    commentRepository.save(comment);
    return true;
  }

  public boolean createBoard(BoardRequestDTO requestDTO) {
    try {
      User user = userRepository.findById(requestDTO.getUserId())
        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));

      Board board = new Board();
      board.setUser(user);
      board.setBname(Board.BoardType.valueOf(requestDTO.getBname())); // 문자열 → enum
      board.setSubject(requestDTO.getSubject());
      board.setContent(requestDTO.getContent());
      board.setFileData(requestDTO.getFileData());
      board.setRegDate(LocalDateTime.now());
      board.setViewCount(0);
      board.setDel(false);

      boardRepository.save(board);
      return true;

    } catch (Exception e) {
      // 예외 로깅을 원하시면 여기에 추가
      return false;
    }
  }

  public boolean editBoard(BoardRequestDTO requestDTO) {
    try {
      // 기존 게시글 찾기
      Board board = boardRepository.findById(requestDTO.getBoardId())
        .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

      // 사용자 정보가 바뀌는 경우에만 처리 (옵션)
      User user = userRepository.findById(requestDTO.getUserId())
        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
      board.setUser(user);

      // 게시글 내용 수정
      board.setBname(Board.BoardType.valueOf(requestDTO.getBname()));
      board.setSubject(requestDTO.getSubject());
      board.setContent(requestDTO.getContent());
      board.setFileData(requestDTO.getFileData());

      // 수정일을 따로 저장할 경우
      board.setEditDate(LocalDateTime.now());

      boardRepository.save(board);
      return true;

    } catch (Exception e) {
      // 로그 출력 등 예외 처리
      return false;
    }
  }


}
