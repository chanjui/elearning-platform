package com.elearning.instructor.repository.query.inquiries;

import com.elearning.instructor.dto.inquiries.InquiryQueryDTO;

import java.util.List;

public interface InquiryQueryRepository {

  List<InquiryQueryDTO> searchInquiries(Long instructorId, Long courseId, String query, String filterStatus);
}
