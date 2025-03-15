# eLearning Web Application

---

## 주요 기능
- **사용자(수강생)**: 강의 탐색, 강의 시청, 결제, Q&A, 리뷰 작성, 코딩 테스트 (코드 에디터), 마이페이지
- **강사**: 강의 등록, 수강생 관리, 질문 답변, 과제 평가, 수익 관리, 쿠폰 등록, 마이페이지
- **관리자**: 회원 관리, 강의 승인, 결제 & 정산 관리, 이벤트 관리
- **결제 모듈**: 월정액, 강의 구매 결제 처리 기능 (결제 api 사용)

---

## 기술 스택
- **백엔드**: SpringBoot, Java, JSP
- **프론트엔드**: Next.JS, JavaScript
- **데이터베이스**: MySQL
- **서버**: AWS S3, AWS EC2
- **협업툴**: Git, GitHub, Notion

---

## 프로젝트 설정
- **JDK**: 17 이상
- **Maven**: 설치 및 환경변수 설정 필요
- **SpringBoot**: 3.4.3
- **MySQL**: 8.0.33 이상
- **IDE**: IntelliJ IDEA

---

## 프로젝트 구조

```
/my-springboot-eLearning
├── pom.xml                                // Maven 의존성 및 빌드 설정
├── README.md
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │        └── elearning
    │   │             ├── ElearningApplication.java    // 메인 애플리케이션 클래스
    │   │             ├── config                       // 공통 설정 (보안, DB 등)
    │   │             │   ├── SecurityConfig.java
    │   │             │   └── DatabaseConfig.java
    │   │             ├── controller                   // 컨트롤러 (역할/기능별로 분리)
    │   │             │   ├── user                     
    │   │             │   ├── instructor          
    │   │             │   └── admin               
    │   │             ├── domain                       // 도메인 엔티티
    │   │             │   ├── user         
    │   │             │   ├── instructor            
    │   │             │   └── admin                     
    │   │             ├── dto                          // DTO (요청/응답 데이터)
    │   │             │   ├── user
    │   │             │   ├── instructor
    │   │             │   └── admin
    │   │             ├── repository                   // Repository (도메인/기능별 분리)
    │   │             │   ├── user
    │   │             │   ├── instructor
    │   │             │   └── admin
    │   │             ├── service                      // Service (비즈니스 로직)
    │   │             │   ├── user
    │   │             │   ├── instructor
    │   │             │   └── admin
    │   │             └── exception                    // 예외 처리
    │   └── resources
    │       ├── application.properties    // DB, JPA, Security 등 설정
    │       ├── static                    // 정적 리소스
    │       └── templates                 // 템플릿 파일
```                      
