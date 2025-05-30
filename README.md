# E-Learning Platform

## 프로젝트 개요
이 프로젝트는 온라인 교육 플랫폼으로, 일반 사용자가 강사로 전환하여 강의를 등록하고 판매할 수 있는 이러닝 사이트입니다.

## 기술 스택
### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- MySQL
- AWS S3
- Docker
- GitHub Actions (CI/CD)

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

## 시스템 아키텍처
```
[Frontend (Next.js)] <-> [Backend (Spring Boot)] <-> [Database (MySQL)]
                              |
                        [AWS S3 (Storage)]
```

## 주요 기능
1. 사용자 관리
   - 일반 사용자/강사 계정 분리
   - OAuth2.0 소셜 로그인 (Google, GitHub, Kakao)
   - JWT 기반 인증/인가

2. 강의 관리
   - 강의 등록 및 수정
   - 강의 검색 및 필터링
   - 강의 구매 및 결제

3. 코딩 테스트
   - 실시간 코드 실행
   - 문제 풀이 및 채점
   - 결과 분석

4. 파일 관리
   - AWS S3를 통한 이미지/비디오 저장
   - 파일 업로드/다운로드

## 보안 구현
1. 인증/인가
   - JWT 기반 토큰 인증
   - 관리자/일반 사용자 권한 분리
   - OAuth2.0 소셜 로그인 통합

2. API 보안
   - CORS 설정
   - CSRF 보호
   - Rate Limiting

3. 데이터 보안
   - 비밀번호 암호화 (BCrypt)
   - 민감 정보 환경 변수 관리
   - AWS S3 접근 제어

## 배포 환경
1. 백엔드
   - AWS EC2 인스턴스
   - Docker 컨테이너화
   - GitHub Actions를 통한 CI/CD

2. 프론트엔드
   - Vercel 배포
   - 자동 빌드 및 배포

## 담당 역할
1. 시스템 설계
   - 전체 시스템 아키텍처 설계
   - 데이터베이스 스키마 설계
   - API 엔드포인트 설계

2. 인프라 구축
   - AWS EC2 서버 설정
   - MySQL 데이터베이스 설치 및 설정
   - AWS S3 버킷 설정
   - Docker 컨테이너화

3. 보안 구현
   - JWT 기반 인증 시스템 구현
   - Spring Security 설정
   - CORS 및 CSRF 보안 설정

4. 개발 관리
   - GitHub 저장소 관리
   - 코드 리뷰 및 머지 관리
   - CI/CD 파이프라인 구축

5. 코딩 테스트 시스템
   - 실시간 코드 실행 환경 구축
   - 문제 풀이 및 채점 시스템 구현
   - 결과 분석 및 피드백 시스템

## 주요 기술적 도전과 해결
1. 실시간 코드 실행
   - Docker 컨테이너를 활용한 안전한 코드 실행 환경 구축
   - 리소스 제한 및 타임아웃 처리

2. 파일 업로드 시스템
   - AWS S3를 활용한 효율적인 파일 저장
   - 대용량 파일 처리 최적화

3. 보안 강화
   - JWT 토큰 기반의 안전한 인증 시스템
   - 역할 기반 접근 제어 (RBAC) 구현

## 향후 개선 사항
1. 성능 최적화
   - 캐싱 시스템 도입
   - 데이터베이스 쿼리 최적화

2. 보안 강화
   - 2단계 인증 (2FA) 도입
   - API 요청 제한 강화

3. 기능 확장
   - 실시간 채팅 시스템
   - 강의 평가 및 리뷰 시스템
   - 학습 진도 추적 시스템
