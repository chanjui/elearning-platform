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
    │   │             ├── domain                       // 도메인 엔티티 (팀별로 분리)
    │   │             │   ├── user         
    │   │             │   ├── instructor            
    │   │             │   └── admin                     
    │   │             ├── dto                          // DTO (요청/응답 데이터, 팀별 분리)
    │   │             │   ├── user
    │   │             │   ├── instructor
    │   │             │   └── admin
    │   │             ├── repository                   // Repository (도메인별/팀별 분리)
    │   │             │   ├── user
    │   │             │   ├── instructor
    │   │             │   └── admin
    │   │             ├── service                      // Service (비즈니스 로직, 팀별 분리)
    │   │             │   ├── user
    │   │             │   ├── instructor
    │   │             │   └── admin
    │   │             └── exception                    // 예외 처리
    │   └── resources
    │       ├── application.properties    // DB, JPA, Security 등 설정
    │       ├── static                    // 정적 리소스
    │       └── templates                 // 템플릿 파일
```                      

