/eLearningBackend
├── pom.xml                                // Maven 의존성 및 빌드 설정
├── README.md
└── src
    ├── main
    │   ├── java
    │   │     └── com  
    │   │          └── elearning
    │   │               ├── ElearningApplication.java       // 메인 애플리케이션 클래스
    │   │               ├── config                          // 공통 설정 (보안, DB 등)
    │   │               │   ├── SecurityConfig.java
    │   │               │   └── DatabaseConfig.java
    │   │               ├── controller                    // 컨트롤러 (역할/기능별로 분리)
    │   │               │   ├── user                      // [사용자 팀]
    │   │               │   │   ├── UserController.java
    │   │               │   │   ├── BoardController.java           // Q&A, 질문 게시판
    │   │               │   │   ├── LectureProgressController.java // 강의 시청 진도
    │   │               │   │   ├── LectureMemoController.java     // 영상 메모
    │   │               │   │   ├── ProblemController.java         // 코딩 테스트 문제
    │   │               │   │   ├── SubmissionController.java      // 코딩 테스트 제출
    │   │               │   │   ├── CartController.java            // 장바구니
    │   │               │   │   ├── NotificationController.java    // 알림
    │   │               │   │   └── LikeController.java            // 좋아요 기능
    │   │               │   ├── instructor                // [강사 팀]
    │   │               │   │   ├── InstructorController.java
    │   │               │   │   ├── CourseController.java          // 강의 등록/수정
    │   │               │   │   ├── CategoryController.java        // 대분류 (필요시)
    │   │               │   │   ├── SubCategoryController.java     // 하위 분류
    │   │               │   │   ├── CourseSectionController.java   // 강의 섹션
    │   │               │   │   ├── LectureVideoController.java    // 강의 영상
    │   │               │   │   ├── CourseRatingController.java    // 수강평
    │   │               │   │   ├── CourseEnrollmentController.java// 수강 등록
    │   │               │   │   └── PaymentHistoryController.java  // 강사 정산 내역
    │   │               │   └── admin                     // [관리자 팀]
    │   │               │       ├── AdminController.java
    │   │               │       ├── PaymentController.java         // 결제 내역 관리
    │   │               │       ├── CouponController.java          // 쿠폰 관리
    │   │               │       ├── CouponUsageController.java     // 쿠폰 사용 내역
    │   │               │       ├── PassController.java            // 패스 상품 관리
    │   │               │       ├── UserPassController.java        // 사용자 패스 관리
    │   │               │       └── ActivityLogController.java     // 활동 로그
    │   │               ├── domain                        // 도메인 엔티티 (팀별로 분리)
    │   │               │   ├── user                      // [사용자 팀 도메인]
    │   │               │   │   ├── User.java                    // 사용자 테이블
    │   │               │   │   ├── Board.java                   // 게시판(수강 Q&A 등)
    │   │               │   │   ├── LectureProgress.java         // 강의 시청 진도
    │   │               │   │   ├── LectureMemo.java             // 강의 영상 메모
    │   │               │   │   ├── Problem.java                 // 코딩 테스트 문제
    │   │               │   │   ├── Submission.java              // 코딩 테스트 제출
    │   │               │   │   ├── Cart.java                    // 장바구니
    │   │               │   │   ├── Notification.java            // 알림
    │   │               │   │   └── Like.java                    // 좋아요 테이블
    │   │               │   ├── instructor               // [강사 팀 도메인]
    │   │               │   │   ├── Instructor.java            // 강사 테이블
    │   │               │   │   ├── Course.java                // 강의 테이블
    │   │               │   │   ├── Category.java              // 강의 대분류 카테고리
    │   │               │   │   ├── SubCategory.java           // 강의 하위 분류
    │   │               │   │   ├── CourseSection.java         // 강의 섹션
    │   │               │   │   ├── LectureVideo.java          // 강의 영상
    │   │               │   │   ├── CourseRating.java          // 강의 평점
    │   │               │   │   ├── CourseEnrollment.java      // 강의 수강 등록
    │   │               │   │   └── PaymentHistory.java        // 정산 내역 (강사)
    │   │               │   └── admin                    // [관리자 팀 도메인]
    │   │               │       ├── Admin.java                 // 관리자 테이블
    │   │               │       ├── Payment.java               // 결제 내역
    │   │               │       ├── Coupon.java                // 쿠폰 테이블
    │   │               │       ├── CouponUsage.java           // 쿠폰 사용 내역
    │   │               │       ├── Pass.java                  // 패스 테이블
    │   │               │       ├── UserPass.java              // 사용자 패스 소유 내역
    │   │               │       └── ActivityLog.java           // 활동 로그
    │   │               ├── dto                           // DTO (요청/응답 데이터, 팀별 분리)
    │   │               │   ├── user
    │   │               │   │   ├── UserDto.java
    │   │               │   │   ├── BoardDto.java
    │   │               │   │   ├── LectureProgressDto.java
    │   │               │   │   ├── LectureMemoDto.java
    │   │               │   │   ├── ProblemDto.java
    │   │               │   │   ├── SubmissionDto.java
    │   │               │   │   ├── CartDto.java
    │   │               │   │   ├── NotificationDto.java
    │   │               │   │   └── LikeDto.java
    │   │               │   ├── instructor
    │   │               │   │   ├── InstructorDto.java
    │   │               │   │   ├── CourseDto.java
    │   │               │   │   ├── CategoryDto.java
    │   │               │   │   ├── SubCategoryDto.java
    │   │               │   │   ├── CourseSectionDto.java
    │   │               │   │   ├── LectureVideoDto.java
    │   │               │   │   ├── CourseRatingDto.java
    │   │               │   │   ├── CourseEnrollmentDto.java
    │   │               │   │   └── PaymentHistoryDto.java
    │   │               │   └── admin
    │   │               │       ├── AdminDto.java
    │   │               │       ├── PaymentDto.java
    │   │               │       ├── CouponDto.java
    │   │               │       ├── CouponUsageDto.java
    │   │               │       ├── PassDto.java
    │   │               │       ├── UserPassDto.java
    │   │               │       └── ActivityLogDto.java
    │   │               ├── repository                    // Repository (도메인별/팀별 분리)
    │   │               │   ├── user
    │   │               │   │   ├── UserRepository.java
    │   │               │   │   ├── BoardRepository.java
    │   │               │   │   ├── LectureProgressRepository.java
    │   │               │   │   ├── LectureMemoRepository.java
    │   │               │   │   ├── ProblemRepository.java
    │   │               │   │   ├── SubmissionRepository.java
    │   │               │   │   ├── CartRepository.java
    │   │               │   │   ├── NotificationRepository.java
    │   │               │   │   └── LikeRepository.java
    │   │               │   ├── instructor
    │   │               │   │   ├── InstructorRepository.java
    │   │               │   │   ├── CourseRepository.java
    │   │               │   │   ├── CategoryRepository.java
    │   │               │   │   ├── SubCategoryRepository.java
    │   │               │   │   ├── CourseSectionRepository.java
    │   │               │   │   ├── LectureVideoRepository.java
    │   │               │   │   ├── CourseRatingRepository.java
    │   │               │   │   ├── CourseEnrollmentRepository.java
    │   │               │   │   └── PaymentHistoryRepository.java
    │   │               │   └── admin
    │   │               │       ├── AdminRepository.java
    │   │               │       ├── PaymentRepository.java
    │   │               │       ├── CouponRepository.java
    │   │               │       ├── CouponUsageRepository.java
    │   │               │       ├── PassRepository.java
    │   │               │       ├── UserPassRepository.java
    │   │               │       └── ActivityLogRepository.java
    │   │               ├── service                         // Service (비즈니스 로직, 팀별 분리)
    │   │               │   ├── user
    │   │               │   │   ├── UserService.java
    │   │               │   │   ├── BoardService.java
    │   │               │   │   ├── LectureProgressService.java
    │   │               │   │   ├── LectureMemoService.java
    │   │               │   │   ├── ProblemService.java
    │   │               │   │   ├── SubmissionService.java
    │   │               │   │   ├── CartService.java
    │   │               │   │   ├── NotificationService.java
    │   │               │   │   └── LikeService.java
    │   │               │   ├── instructor
    │   │               │   │   ├── InstructorService.java
    │   │               │   │   ├── CourseService.java
    │   │               │   │   ├── CategoryService.java
    │   │               │   │   ├── SubCategoryService.java
    │   │               │   │   ├── CourseSectionService.java
    │   │               │   │   ├── LectureVideoService.java
    │   │               │   │   ├── CourseRatingService.java
    │   │               │   │   ├── CourseEnrollmentService.java
    │   │               │   │   └── PaymentHistoryService.java
    │   │               │   └── admin
    │   │               │       ├── AdminService.java
    │   │               │       ├── PaymentService.java
    │   │               │       ├── CouponService.java
    │   │               │       ├── CouponUsageService.java
    │   │               │       ├── PassService.java
    │   │               │       ├── UserPassService.java
    │   │               │       └── ActivityLogService.java
    │   │               └── exception                     // 글로벌 예외 처리
    │   │                   └── GlobalExceptionHandler.java
    │   └── resources
    │       ├── application.properties              // DB, JPA, Security 등 설정
    │       ├── static                              // 정적 리소스 (이미지, JS, CSS)
    │       └── templates                           // 템플릿 파일 (Thymeleaf 등 사용 시)
    └── test
        └── java
            └── com
                └── projectname
                    └── elearning
                        └── ElearningApplicationTests.java   // 단위 및 통합 테스트
