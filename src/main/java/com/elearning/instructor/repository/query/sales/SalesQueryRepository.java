package com.elearning.instructor.repository.query.sales;

import com.elearning.instructor.dto.sales.CourseSimpleDTO;
import com.elearning.instructor.dto.sales.SalesHistoryDTO;
import java.util.List;

public interface SalesQueryRepository {

  List<CourseSimpleDTO> findCoursesByInstructorId(Long instructorId);

  List<SalesHistoryDTO> findSalesHistory(Long instructorId, int year, int month,
                                         Long courseId, Long categoryId, String searchQuery);

}

