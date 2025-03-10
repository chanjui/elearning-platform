/eLearningBackend
├── pom.xml                                // Maven 의존성 및 빌드 설정
├── README.md
└── src
    ├── main
    │   ├── java
    │   │   └── com  
    │   │       └── elearning
    │   │           ├── ElearningApplication.java       // 메인 애플리케이션 클래스
    │   │           ├── config                          // 공통 설정 (보안, DB 등)
    │   │           │   ├── SecurityConfig.java
    │   │           │   └── DatabaseConfig.java
    │   │           ├── controller                    // 컨트롤러 (역할/기능별로 분리)
    │   │           │   ├── user                      // [사용자 팀]
    │   │           │   │   ├── UserController.java
    │   │           │   │   ├── BoardController.java           // Q&A, 질문 게시판
    │   │           │   │   ├── LectureProgressController.java // 강의 시청 진도
    │   │           │   │   ├── LectureMemoController.java     // 영상 메모
    │   │           │   │   ├── ProblemController.java         // 코딩 테스트 문제
    │   │           │   │   ├── SubmissionController.java      // 코딩 테스트 제출
    │   │           │   │   ├── CartController.java            // 장바구니
    │   │           │   │   ├── NotificationController.java    // 알림
    │   │           │   │   └── LikeController.java            // 좋아요 기능
