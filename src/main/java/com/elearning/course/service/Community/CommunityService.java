package com.elearning.course.service.Community;

import com.elearning.course.dto.Community.*;
import com.elearning.course.dto.Community.CommunityBoardDTO.AuthorDTO;
import com.elearning.course.entity.Board;
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
      dto.setComments(commentRepository.countByBoard(board));

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

  public CommunityBoardOneDTO getBoardDetail(Long boardId) {
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


}
