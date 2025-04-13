"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Clock, Award, User, PlayCircle, CheckCircle, Calendar } from "lucide-react"
import UserHeader from "@/components/user/user-header"

export default function MyLearningPage() {
  const [activeTab, setActiveTab] = useState("in-progress")

  // 더미 데이터 - 진행 중인 강의
  const inProgressCourses = [
    {
      id: 1,
      title: "React 완벽 가이드: 기초부터 고급까지",
      instructor: "김강사",
      progress: 45,
      lastAccessed: "2023-10-25",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "Next.js로 풀스택 웹 개발하기",
      instructor: "이개발",
      progress: 72,
      lastAccessed: "2023-10-28",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  // 더미 데이터 - 완료한 강의
  const completedCourses = [
    {
      id: 3,
      title: "JavaScript 기초 마스터하기",
      instructor: "박자바",
      completedDate: "2023-09-15",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 */}
          <div className="w-full md:w-64 space-y-4">
            <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="relative mb-4">
                <Image
                  src="/placeholder.svg?height=120&width=120"
                  alt="프로필 이미지"
                  width={120}
                  height={120}
                  className="rounded-full bg-gray-800"
                />
              </div>
              <h2 className="text-xl font-bold mb-1">홍길동</h2>
              <p className="text-sm text-gray-400 mb-4">inflearn.com/users/@user123</p>

              <div className="grid grid-cols-2 w-full gap-2 text-center">
                <div className="p-2 bg-gray-800 rounded-md">
                  <p className="text-xs text-gray-400">수강한 강좌</p>
                  <p className="font-bold">3</p>
                </div>
                <div className="p-2 bg-gray-800 rounded-md">
                  <p className="text-xs text-gray-400">작성한 리뷰</p>
                  <p className="font-bold">1</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-4 font-medium">메뉴</div>
              <Separator className="bg-gray-800" />
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link href="/user/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                      <span>대시보드</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/dashboard/settings"
                      className="flex items-center p-2 rounded-md hover:bg-gray-800"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      <span>계정 정보</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/dashboard/purchases"
                      className="flex items-center p-2 rounded-md hover:bg-gray-800"
                    >
                      <Award className="h-4 w-4 mr-3 text-gray-400" />
                      <span>구매 내역</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/user/my-learning"
                      className="flex items-center p-2 rounded-md bg-gray-800 text-red-500"
                    >
                      <Clock className="h-4 w-4 mr-3 text-red-500" />
                      <span>내 학습</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">내 학습</h1>
              <p className="text-gray-400">진행 중인 강의와 완료한 강의를 확인하세요.</p>
            </div>

            <Tabs defaultValue="in-progress" className="space-y-6">
              <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none h-auto p-0">
                <TabsTrigger
                  value="in-progress"
                  className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500"
                >
                  진행 중인 강의
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500"
                >
                  완료한 강의
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarks"
                  className="px-6 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:bg-transparent data-[state=active]:text-red-500"
                >
                  북마크
                </TabsTrigger>
              </TabsList>

              <TabsContent value="in-progress" className="space-y-4">
                {inProgressCourses.length > 0 ? (
                  inProgressCourses.map((course) => (
                    <Card key={course.id} className="bg-gray-900 border-gray-800 text-white overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <Image
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            width={200}
                            height={120}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 flex-1">
                          <h3 className="text-lg font-medium mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-400 mb-4">{course.instructor}</p>

                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm">{course.progress}% 완료</span>
                            <span className="text-xs text-gray-400">최근 학습: {course.lastAccessed}</span>
                          </div>
                          <Progress
                            value={course.progress}
                            className="h-2 bg-gray-800"
                            indicatorClassName="bg-red-500"
                          />

                          <div className="mt-4 flex justify-end">
                            <Button className="bg-red-600 hover:bg-red-700">
                              <PlayCircle className="h-4 w-4 mr-2" />
                              이어서 학습하기
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                    <p className="text-gray-400">진행 중인 강의가 없습니다.</p>
                    <Button className="mt-4 bg-red-600 hover:bg-red-700">강의 둘러보기</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedCourses.length > 0 ? (
                  completedCourses.map((course) => (
                    <Card key={course.id} className="bg-gray-900 border-gray-800 text-white overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <Image
                            src={course.thumbnail || "/placeholder.svg"}
                            alt={course.title}
                            width={200}
                            height={120}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium">{course.title}</h3>
                            <Badge className="ml-2 bg-green-600 text-white">완료</Badge>
                          </div>
                          <p className="text-sm text-gray-400 mb-4">{course.instructor}</p>

                          <div className="flex items-center text-sm text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>완료일: {course.completedDate}</span>
                          </div>

                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              수료증 보기
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700">다시 학습하기</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                    <p className="text-gray-400">완료한 강의가 없습니다.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookmarks" className="space-y-4">
                <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="text-gray-400">북마크한 강의가 없습니다.</p>
                  <Button className="mt-4 bg-red-600 hover:bg-red-700">강의 둘러보기</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

// Badge 컴포넌트 (필요한 경우)
function Badge({ children, className = "" }) {
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>{children}</span>
}

