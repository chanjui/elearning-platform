📂 CinemaProject/  
├── 📂 db/  # DB 관련 문서 및 초기 SQL 파일  
├── 📂 docs/  # 설계 문서, 기획 자료  
├── 📂 src/  
│   └── 📂 main/  
│       ├── 📂 java/  (Java 소스 파일, 패키지별 관리)  
│       │   ├── 📂 action/  
│       │   │   ├── 📂 admin/  
│       │   │   ├── 📂 user/  
│       │   │   ├── 📝 Action.java  # Action 인터페이스  
│       │   ├── 📂 control/  
│       │   │   ├── 📝 AdminController.java  # AdminController 서블릿  
│       │   │   ├── 📝 UserController.java  # UserController 서블릿  
│       │   ├── 📂 mybatis/  
│       │   │   ├── 📂 mybatis.service.dao/  
│       │   │   ├── 📂 service/  
│       │   │   │   ├── 📝 FactoryService.java  
│       │   │   ├── 📂 mybatis.service.vo/  
│       │   ├── 📂 util/  
│       │   │   ├── 📝 Paging.java  
│       ├── 📂 resources/  
│       │   ├── 📂 config/  
│       │   ├── 📂 mapper/  
│       └── 📂 webapp/  
│           ├── 📂 WEB-INF/  # JSP 배치를 위한 디렉토리  
│           │   ├── 📝 user_action.properties  # 사용자 관련 액션 설정 파일  
│           │   ├── 📝 admin_action.properties  # 관리자 관련 액션 설정 파일  
│           ├── 📂 css/  
│           ├── 📂 jsp/  
│               ├── 📂 user/  # 사용자 관련 JSP 파일  
│               ├── 📂 admin/  # 관리자 관련 JSP 파일  
├── README.md (프로젝트 소개 및 실행 방법)  
└── .gitignore (Git 관리에서 제외할 파일/폴더) 
