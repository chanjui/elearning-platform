"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play, Clock, BarChart3, Calendar, BookOpen, CheckCircle2, ChevronRight, BookMarked, Timer, Trophy, Flame, Award, TrendingUp, Sparkles } from 'lucide-react'
import NetflixHeader from "@/components/netflix-header"
import userStore from "@/app/auth/userStore"
import { Skeleton } from "@/components/ui/skeleton"

interface Course {
  id: number
  title: string
  instructor: string
  progress: number | null
  lastAccessed: string | null
  imageUrl: string
  slug: string
  totalLectures: number
  completedLectures: number
  nextLecture?: string
  estimatedTimeLeft?: string
  category: string
  lastStudyDate: string
  completed?: boolean | null
  completedDate?: string | null
  certificateAvailable?: boolean | null
  courseStatus?: string
  courseProgress?: string
  rating?: number
  students?: number
  level?: string
  relatedTo?: string
}

interface LearningStats {
  weeklyStudyTime: number
  monthlyStudyTime: number
  completionRate: number
  averageQuizScore: number
  studyStreak: number
  totalCertificates: number
}

interface LearningGoals {
  weekly: {
    target: number
    current: number
    progress: number
  }
  courses: {
    target: number
    current: number
    progress: number
  }
}

interface DashboardData {
  lastLearningCourse: Course | null
  enrolledCourses: Course[]
  completedCourses: Course[]
  recommendedCourses: Course[]
  learningStats: LearningStats
  learningGoals: LearningGoals
}

export default function DashboardPage() {
  const { user } = userStore()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return

      try {
        const response = await fetch(`/api/user/dashboard?userId=${user.id}`)
        if (!response.ok) throw new Error("Failed to fetch dashboard data")
        const result = await response.json()
        console.log("result", result)
        setDashboardData(result)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setDashboardData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <NetflixHeader />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 bg-gray-800 mb-2" />
            <Skeleton className="h-4 w-96 bg-gray-800" />
          </div>

          <Skeleton className="h-[300px] w-full bg-gray-800 rounded-xl mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <Skeleton className="h-[200px] w-full bg-gray-800 rounded-lg" />
            <Skeleton className="h-[200px] w-full bg-gray-800 rounded-lg" />
          </div>

          <Skeleton className="h-8 w-48 bg-gray-800 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!dashboardData) {
    return (
      <main className="min-h-screen bg-black text-white">
        <NetflixHeader />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-lg">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">데이터를 불러올 수 없습니다</h2>
              <p className="text-gray-400 mb-4">대시보드 정보를 가져오는 중 문제가 발생했습니다.</p>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                다시 시도하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const { lastLearningCourse, enrolledCourses, completedCourses, recommendedCourses, learningStats, learningGoals } =
    dashboardData

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* 학습 요약 헤더 */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">나의 학습 대시보드</h1>
            {learningStats.studyStreak > 0 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Flame className="h-3 w-3 mr-1" /> {learningStats.studyStreak}일 연속 학습 중
              </Badge>
            )}
          </div>
          <p className="text-gray-400">
            {lastLearningCourse || enrolledCourses.length > 0
              ? "최근 학습 활동과 진행 상황을 확인하세요."
              : "아직 수강 중인 강의가 없습니다. 추천 강의를 둘러보세요!"}
          </p>
        </div>

        {/* 최근 학습 강의 */}
        {lastLearningCourse && (
          <div className="mb-10 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-gray-800 shadow-lg animate-fadeIn">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 lg:w-1/4">
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={lastLearningCourse.imageUrl || "/placeholder.svg"}
                      alt={lastLearningCourse.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-transform"
                      >
                        <Play className="h-4 w-4 mr-1" /> 이어보기
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl font-bold">{lastLearningCourse.title}</h2>
                    <Badge className="ml-3 bg-blue-600 shadow-sm">최근 학습</Badge>
                  </div>

                  <p className="text-gray-400 mb-4">{lastLearningCourse.instructor}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium mb-1 flex items-center">
                        <Play className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        다음 강의
                      </h3>
                      <p className="text-gray-300 text-sm">{lastLearningCourse.nextLecture}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium mb-1 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        최근 학습
                      </h3>
                      <p className="text-gray-300 text-sm">{lastLearningCourse.lastStudyDate}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium mb-1 flex items-center">
                        <BookOpen className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        진행 상황
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {lastLearningCourse.completedLectures}/{lastLearningCourse.totalLectures} 강의 완료
                      </p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <h3 className="text-sm font-medium mb-1 flex items-center">
                        <Timer className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                        남은 학습 시간
                      </h3>
                      <p className="text-gray-300 text-sm">{lastLearningCourse.estimatedTimeLeft}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>진행률</span>
                      <span>{lastLearningCourse.progress}%</span>
                    </div>
                    <Progress
                      value={lastLearningCourse.progress}
                      className="h-2 bg-gray-800"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link href={`/user/course/${lastLearningCourse.slug}/learn`}>
                      <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
                        <Play className="h-4 w-4 mr-1" /> 학습 계속하기
                      </Button>
                    </Link>
                    <Link href={`/user/course/${lastLearningCourse.slug}`}>
                      <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        강의 상세보기
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 학습 통계 및 목표 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="animate-fadeIn animation-delay-100">
            <Card className="bg-gray-900 border-gray-800 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-full -mr-12 -mt-12"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  학습 시간
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">이번 주</span>
                    <span className="font-bold">{learningStats.weeklyStudyTime}시간</span>
                  </div>
                  <Progress
                    value={learningStats.weeklyStudyTime * 5}
                    className="h-1.5 bg-gray-800"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">이번 달</span>
                    <span className="font-bold">{learningStats.monthlyStudyTime}시간</span>
                  </div>
                  <Progress
                    value={learningStats.monthlyStudyTime * 2}
                    className="h-1.5 bg-gray-800"
                  />
                </div>
                <div className="pt-2">
                  <Link href="/user/dashboard/analytics">
                    <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                      상세 분석 보기 <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fadeIn animation-delay-200">
            <Card className="bg-gray-900 border-gray-800 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/10 rounded-full -mr-12 -mt-12"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <BarChart3 className="h-5 w-5 text-green-500 mr-2" />
                  학습 목표
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">주간 학습 시간</span>
                    <span className="font-bold">
                      {learningGoals.weekly.current}/{learningGoals.weekly.target}시간
                    </span>
                  </div>
                  <Progress
                    value={learningGoals.weekly.progress}
                    className="h-1.5 bg-gray-800"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">강의 완료</span>
                    <span className="font-bold">
                      {learningGoals.courses.current}/{learningGoals.courses.target}개
                    </span>
                  </div>
                  <Progress
                    value={learningGoals.courses.progress}
                    className="h-1.5 bg-gray-800"
                  />
                </div>
                <div className="pt-2">
                  <Link href="/user/dashboard/goals">
                    <Button variant="link" className="text-gray-400 hover:text-white p-0 h-auto">
                      목표 설정하기 <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fadeIn animation-delay-300">
            <Card className="bg-gray-900 border-gray-800 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-full -mr-12 -mt-12"></div>
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium flex items-center">
                  <Trophy className="h-5 w-5 text-purple-500 mr-2" />
                  학습 성과
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">완료율</div>
                    <div className="text-lg font-bold flex items-center">
                      {learningStats.completionRate}%
                      <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">퀴즈 평균</div>
                    <div className="text-lg font-bold flex items-center">
                      {learningStats.averageQuizScore}점
                      <Sparkles className="h-4 w-4 ml-1 text-yellow-500" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">연속 학습</div>
                    <div className="text-lg font-bold flex items-center">
                      {learningStats.studyStreak}일
                      <Flame className="h-4 w-4 ml-1 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">수료증</div>
                    <div className="text-lg font-bold flex items-center">
                      {learningStats.totalCertificates}개
                      <Award className="h-4 w-4 ml-1 text-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 강의 목록 탭 */}
        {(enrolledCourses.length > 0 || completedCourses.length > 0) && (
          <div className="mb-10 animate-fadeIn animation-delay-400">
            <Tabs defaultValue="in-progress" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-gray-800">
                  <TabsTrigger value="in-progress" className="data-[state=active]:bg-gray-700">
                    수강 중인 강의 ({enrolledCourses.length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-gray-700">
                    완료한 강의 ({completedCourses.length})
                  </TabsTrigger>
                </TabsList>

                <Link href="/user/courses">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    모든 강의 보기
                  </Button>
                </Link>
              </div>

              <TabsContent value="in-progress" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {enrolledCourses.map((course, index) => (
                    <div
                      key={`enrolled-${course.id}-${index}`}
                      className={`border border-gray-800 rounded-lg overflow-hidden bg-gray-900 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-gray-900/20 group animate-fadeIn`}
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="relative">
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={course.imageUrl || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Link href={`/user/course/${course.slug}/learn`}>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 shadow-md transform hover:scale-105 transition-transform"
                              >
                                <Play className="h-3 w-3 mr-1" /> 학습하기
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-gray-800/80 text-xs backdrop-blur-sm">
                          {course.category}
                        </Badge>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{course.title}</h3>
                        <p className="text-gray-400 text-xs mb-2">{course.instructor}</p>

                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="text-gray-400">
                              {course.completedLectures}/{course.totalLectures} 강의
                            </span>
                          </div>
                          <span>{course.progress}%</span>
                        </div>

                        <Progress
                          value={course.progress}
                          className="h-1.5 bg-gray-800 mb-3"
                        />

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Timer className="h-3 w-3 mr-1" />
                            <span>{course.estimatedTimeLeft} 남음</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{course.lastStudyDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {completedCourses.map((course, index) => (
                    <div
                      key={`completed-${course.id}-${index}`}
                      className={`border border-gray-800 rounded-lg overflow-hidden bg-gray-900 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-gray-900/20 group animate-fadeIn`}
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="relative">
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={course.imageUrl || "/placeholder.svg"}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Link href={`/user/course/${course.slug}/learn`}>
                              <Button
                                size="sm"
                                className="bg-gray-700 hover:bg-gray-600 shadow-md transform hover:scale-105 transition-transform"
                              >
                                <Play className="h-3 w-3 mr-1" /> 다시 보기
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-600/90 text-xs backdrop-blur-sm">완료</Badge>
                        {course.certificateAvailable && (
                          <Badge className="absolute top-2 left-2 bg-yellow-600/90 text-xs backdrop-blur-sm">
                            <Award className="h-3 w-3 mr-1" /> 수료증
                          </Badge>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{course.title}</h3>
                        <p className="text-gray-400 text-xs mb-2">{course.instructor}</p>

                        <div className="flex items-center justify-between text-xs mb-3">
                          <div className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="text-gray-400">
                              {course.completedLectures}/{course.totalLectures} 강의
                            </span>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            <span className="text-green-500">100%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <Badge className="bg-gray-800/80 text-xs">{course.category}</Badge>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{course.completedDate?.split("T")[0]}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* 추천 강의 */}
        {recommendedCourses.length > 0 && (
          <div className="mt-10 animate-fadeIn animation-delay-500">
            <Card className="bg-gray-900 border-gray-800 text-white w-full shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center">
                    <BookMarked className="h-5 w-5 text-purple-400 mr-2" />
                    나를 위한 추천 강의
                  </h3>
                  <Link href="/user/courses/recommended">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      더보기 <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedCourses.map((course, index) => (
                    <div
                      key={`recommended-${course.id}-${index}`}
                      className={`flex bg-gray-800 rounded-lg overflow-hidden group hover:bg-gray-750 transition-colors shadow-md animate-fadeIn`}
                      style={{ animationDelay: `${(index + 1) * 100}ms` }}
                    >
                      <div className="w-1/3 relative">
                        <Image
                          src={course.imageUrl || "/placeholder.svg"}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                      </div>
                      <div className="w-2/3 p-3">
                        <h4 className="text-sm font-medium line-clamp-2 mb-1">{course.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{course.instructor}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Badge className="bg-gray-700 text-xs mr-2">{course.level}</Badge>
                          <span className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            {course.rating} ({course.students}명)
                          </span>
                        </div>
                        <Link href={`/user/course/${course.slug}`}>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-0 h-auto">
                            자세히 보기 <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/user/courses">
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 shadow-md">
                      모든 강의 둘러보기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
