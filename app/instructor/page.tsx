"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

import InstructorHeader from "@/components/netflix-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"
import StatsCards from "../../components/instructor/dashboard/stats-cards"
import RevenueChart from "../../components/instructor/dashboard/revenue-chart"
import StudentProgress from "../../components/instructor/dashboard/student-progress"
import CourseData from "../../components/instructor/dashboard/course-data"
import LearningTime from "../../components/instructor/dashboard/learning-time"
import Notifications from "../../components/instructor/dashboard/notifications"
import useUserStore from "@/app/auth/userStore"
import type { RevenueDataItem, DailyRevenueItem } from "../../components/instructor/dashboard/revenue-chart"
import type { ProgressStatusItem } from "@/components/instructor/dashboard/student-progress"
import type { CourseEnrollmentItem } from "@/components/instructor/dashboard/course-data"
import type { StudyTimeItem } from "@/components/instructor/dashboard/learning-time"
import type { NotificationItem } from "@/components/instructor/dashboard/notifications"

export interface DashboardData {
  instructorId: number
  totalCourseCount: number
  averageRating: number
  recentAverageRating: number
  totalStudents: number
  recentStudents: number
  totalRevenue: number
  monthlyRevenue: number
  revenueData: RevenueDataItem[]
  dailyRevenueData: DailyRevenueItem[]
  progressStatus: ProgressStatusItem[]
  courseEnrollment: CourseEnrollmentItem[]
  studyTimeData: StudyTimeItem[]
  recentNotifications: NotificationItem[]
}

export default function InstructorDashboardPage() {

  // 강사 ID를 기반으로 대시보드 데이터 가져오기
  const { user, restoreFromStorage } = useUserStore();

  // 컴포넌트 마운트 시 localStorage에서 user 복원
  useEffect(() => {
    if (!user) {
      restoreFromStorage();
    }
  }, [user, restoreFromStorage]);

  const instructorId = user?.instructorId;
  
  const [dateRange, setDateRange] = useState("2025-02-23 ~ 2025-03-23")

  // 대시보드 데이터
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const [isScrolled, setIsScrolled] = useState(false)

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 대시보드 데이터 가져오기
  useEffect(() => {
    if (!instructorId) return

    console.log("instructorId", instructorId)

    fetch(`/api/instructor/dashboard/${instructorId}`)
      .then((res) => res.json())
      .then((res) => setDashboardData(res.data))
      .catch((err) => console.error("대시보드 데이터 로딩 실패", err))
  }, [instructorId])

  // // 수익 차트 데이터
  // const revenueData = [
  //   { date: "2025/02", revenue: 1100000, sales: 35 },
  //   { date: "2025/02", revenue: 800000, sales: 28 },
  //   { date: "2025/02", revenue: 1000000, sales: 32 },
  //   { date: "2025/02", revenue: 600000, sales: 20 },
  //   { date: "2025/02", revenue: 900000, sales: 30 },
  //   { date: "2025/03", revenue: 1050000, sales: 34 },
  //   { date: "2025/03", revenue: 850000, sales: 27 },
  //   { date: "2025/03", revenue: 950000, sales: 31 },
  //   { date: "2025/03", revenue: 750000, sales: 25 },
  //   { date: "2025/03", revenue: 1200000, sales: 38 },
  // ]

  // // 수강생 진행률 데이터
  // const progressData = [
  //   { range: "0-10%", count: 450 },
  //   { range: "10-20%", count: 350 },
  //   { range: "20-30%", count: 300 },
  //   { range: "30-40%", count: 250 },
  //   { range: "40-50%", count: 200 },
  //   { range: "50-60%", count: 150 },
  //   { range: "60-70%", count: 120 },
  //   { range: "70-80%", count: 100 },
  //   { range: "80-90%", count: 90 },
  //   { range: "90-100%", count: 80 },
  // ]

  // // 과목 수강 데이터
  // const courseData = [
  //   { name: "마케팅 정복하는 법", percentage: 85 },
  //   { name: "전공처럼 개발자가 알려주는 웹 개발", percentage: 70 },
  //   { name: "누구나 할 수 있는 코딩 - C언어", percentage: 55 },
  //   { name: "구글 시트로 일 잘하는 법", percentage: 60 },
  //   { name: "블록체인 NFT/코인 - 기본", percentage: 40 },
  // ]

  // // 수강생 학습 시간 데이터
  // const learningTimeData = [
  //   {
  //     course: "전공처럼 개발자가 알려주는 웹 개발",
  //     views: 13,
  //     completionRate: 10,
  //     totalTime: 15,
  //     avgTime: "1시간 미만",
  //   },
  //   { course: "마케팅 정복하는 법", views: 11, completionRate: 12, totalTime: 21, avgTime: "1시간 미만" },
  //   { course: "구글 시트로 일 잘하는 법", views: 20, completionRate: 23, totalTime: 45, avgTime: "1시간 미만" },
  //   { course: "한수위 자바스크립트 - 기본", views: 14, completionRate: 31, totalTime: 50, avgTime: "2시간" },
  //   { course: "누구나 할 수 있는 코딩 - C언어", views: 30, completionRate: 11, totalTime: 60, avgTime: "1시간 미만" },
  // ]

  // // 수익 분포 데이터
  // const revenueDistribution = [
  //   { course: "누구나 할 수 있는 코딩 - C언어", amount: 350000, percentage: 50 },
  //   { course: "전공처럼 개발자가 알려주는 웹 개발", amount: 150000, percentage: 22 },
  //   { course: "마케팅 정복하는 법", amount: 100000, percentage: 15 },
  //   { course: "구글 시트로 일 잘하는 법", amount: 50000, percentage: 8 },
  //   { course: "한수위 자바스크립트 - 기본", amount: 34278, percentage: 5 },
  // ]

  // // 최근 알림 데이터
  // const notifications = [
  //   { id: 1, date: "2023/10/27", content: "대용량 파일 처리와 이미지 압축 처리 강의 등록" },
  //   { id: 2, date: "2023/10/25", content: "[React] Container 컴포넌트 1-3 등록 완료" },
  //   { id: 3, date: "2023/10/20", content: "새로운 강의 '코딩테스트 완전정복' 등록 및 판매 시작했습니다." },
  // ]

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // null이면 먼저 로딩 화면 보여주고 리턴
  if (!dashboardData) {
    return <div className="text-white text-center pt-24">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <StatsCards
            data={{
              totalCourseCount: dashboardData.totalCourseCount,
              averageRating: dashboardData.averageRating,
              recentAverageRating: dashboardData.recentAverageRating,
              totalStudents: dashboardData.totalStudents,
              totalRevenue: dashboardData.totalRevenue,
              recentStudents: dashboardData.recentStudents
            }}
          />

          <RevenueChart
            totalRevenue={dashboardData.totalRevenue}
            revenueData={dashboardData.revenueData}
            dailyRevenueData={dashboardData.dailyRevenueData}
          />


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StudentProgress 
              progressStatus={dashboardData.progressStatus} 
            />
            <CourseData 
              courseEnrollment={dashboardData.courseEnrollment}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LearningTime 
            studyTimeData={dashboardData.studyTimeData}
          />
          <Notifications 
            recentNotifications={dashboardData.recentNotifications}
          />
          </div>
        
        </main>
      </div>
    </div>
  )
}

