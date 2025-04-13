package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.inquiries.InquiryDTO;
import com.elearning.instructor.dto.inquiries.InquiryReplyDTO;
import com.elearning.instructor.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instructor/inquiries")
public class InquiryController {

  private final InquiryService inquiryService;

  /**
   * 수강 전 문의 조회 API
   */
  @GetMapping("/{instructorId}")
  public ResultData<List<InquiryDTO>> getInquiries(
    @PathVariable Long instructorId,
    @RequestParam(required = false) Long courseId,
    @RequestParam(required = false) String query,
    @RequestParam(required = false) String status
  ) {
    List<InquiryDTO> list = inquiryService.getInquiries(instructorId, courseId, query, status);
    return ResultData.of(list.size(), "수강 전 문의 조회 완료", list);
  }

  /**
   * 답변 등록 API
   */
  @PostMapping("/{boardId}/reply")
  public ResultData<?> addReply(
    @PathVariable Long boardId,
    @RequestBody InquiryReplyDTO dto,
    @RequestParam Long userId
  ) {
    inquiryService.addReply(boardId, dto, userId);
    return ResultData.of(1, "답변 등록 완료");
  }

  /**
   * 답변 수정 API
   */
  @PutMapping("/reply/{replyId}")
  public ResultData<?> updateReply(
    @PathVariable Long replyId,
    @RequestBody InquiryReplyDTO dto,
    @RequestParam Long userId
  ) {
    inquiryService.updateReply(replyId, dto, userId);
    return ResultData.of(1, "답변 수정 완료");
  }

  /**
   * 답변 삭제 API
   */
  @DeleteMapping("/reply/{replyId}")
  public ResultData<?> deleteReply(
    @PathVariable Long replyId,
    @RequestParam Long userId
  ) {
    inquiryService.deleteReply(replyId, userId);
    return ResultData.of(1, "답변 삭제 완료");
  }
}
