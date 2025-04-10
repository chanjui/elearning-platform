package com.elearning.instructor.service;

import com.elearning.instructor.dto.sales.CourseSimpleDTO;
import com.elearning.instructor.dto.sales.SalesHistoryDTO;
import com.elearning.instructor.repository.query.sales.SalesQueryRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {

  private final SalesQueryRepository salesQueryRepository;

  /**
   * 특정 강사의 월별 수익 내역을 조회한다.
   * @param instructorId 강사 ID
   * @param year 선택된 연도 (예: 2024)
   * @param month 선택된 월 (예: 3월 → 3)
   * @param courseId 특정 강의 ID (null이면 전체 강의)
   * @return 해당 월의 판매 수익 리스트
   */
  public List<SalesHistoryDTO> getMonthlySalesHistory(Long instructorId, int year, int month,
                                                      Long courseId, Long categoryId, String searchQuery) {
    return salesQueryRepository.findSalesHistory(instructorId, year, month, courseId, categoryId, searchQuery);
  }

  /**
   * 특정 강사의 월별 수익 합계를 계산한다.
   * @param salesList 수익 내역 리스트
   * @return 전체 수익 합계
   */
  public int calculateTotalRevenue(List<SalesHistoryDTO> salesList) {
    return salesList.stream()
      .mapToInt(SalesHistoryDTO::getInstructorRevenue)
      .sum();
  }

  public List<CourseSimpleDTO> getCoursesByInstructor(Long instructorId) {
    return salesQueryRepository.findCoursesByInstructorId(instructorId);
  }

  public void exportSalesToExcel(List<SalesHistoryDTO> salesList, HttpServletResponse response) throws IOException {
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Sales Report");

    int rowIdx = 0;

    // 총 판매 건수 및 총 수익 추가
    int totalRevenue = salesList.stream()
      .mapToInt(SalesHistoryDTO::getInstructorRevenue)
      .sum();

    Row summaryRow1 = sheet.createRow(rowIdx++);
    summaryRow1.createCell(0).setCellValue("총 판매 건수");
    summaryRow1.createCell(1).setCellValue(salesList.size());

    Row summaryRow2 = sheet.createRow(rowIdx++);
    summaryRow2.createCell(0).setCellValue("총 수익 (₩)");
    summaryRow2.createCell(1).setCellValue(totalRevenue);

    rowIdx++; // 빈 줄 하나 추가

    // 헤더 생성
    Row headerRow = sheet.createRow(rowIdx++);
    String[] headers = { "날짜", "시간", "강의명", "수강생명", "정상가격", "실제가격", "실수익" };
    for (int i = 0; i < headers.length; i++) {
      headerRow.createCell(i).setCellValue(headers[i]);
    }

    // 데이터 채우기
    for (SalesHistoryDTO dto : salesList) {
      Row row = sheet.createRow(rowIdx++);
      row.createCell(0).setCellValue(dto.getDate());
      row.createCell(1).setCellValue(dto.getTime());
      row.createCell(2).setCellValue(dto.getCourseTitle());
      row.createCell(3).setCellValue(dto.getStudentName());
      row.createCell(4).setCellValue(dto.getOriginalPrice());
      row.createCell(5).setCellValue(dto.getActualPrice());
      row.createCell(6).setCellValue(dto.getInstructorRevenue());
    }

    // 응답 설정
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=sales.xlsx");
    workbook.write(response.getOutputStream());
    workbook.close();
  }
}

