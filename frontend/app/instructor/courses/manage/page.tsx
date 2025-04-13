"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

// 예시 강의 데이터
const courses = [
  {
    id: "1",
    title: "프로그래밍 시작하기 : 도전! 45가지 파이썬 기초 문법 실습 (Inflearn Original)",
    coverImage: "/placeholder.svg?height=160&width=280&text=Python",
    status: "published",
    students: 222,
    rating: 5.0,
    reviews: 45,
    revenue: 999999,
    lastUpdated: "2025-02-15",
    isOnSale: true,
  },
  {
    id: "2",
    title: "Kotlin & Spring 네트워킹 방식 다시보기",
    coverImage: "/placeholder.svg?height=160&width=280&text=Kotlin",
    status: "published",
    students: 1352,
    rating: 5.0,
    reviews: 120,
    revenue: 0,
    lastUpdated: "2025-01-20",
    isOnSale: false,
  },
  {
    id: "3",
    title: "인프런 리뉴얼 알아보기 Node.js 다시보기",
    coverImage: "/placeholder.svg?height=160&width=280&text=Node.js",
    status: "published",
    students: 793,
    rating: 4.9,
    reviews: 89,
    revenue: 0,
    lastUpdated: "2025-03-10",
    isOnSale: false,
  },
  {
    id: "4",
    title: "시작해보자! 엔진과 첫 지식공유",
    coverImage: "/placeholder.svg?height=160&width=280&text=Engine",
    status: "published",
    students: 550,
    rating: 4.9,
    reviews: 67,
    revenue: 0,
    lastUpdated: "2025-03-05",
    isOnSale: false,
  },
  {
    id: "5",
    title: "UX/UI 사작하기 : UX 개념 (Inflearn Original)",
    coverImage: "/placeholder.svg?height=160&width=280&text=UX/UI",
    status: "published",
    students: 16495,
    rating: 4.5,
    reviews: 1,
    revenue: 999999,
    lastUpdated: "2025-02-28",
    isOnSale: true,
  },
  {
    id: "6",
    title: "코딩가 되는 파이썬 : 동시성과 병렬성 알아보기 Part. 원리 스레드 vs 멀티프로세싱 (Inflearn Original)",
    coverImage: "/placeholder.svg?height=160&width=280&text=Python",
    status: "published",
    students: 1910,
    rating: 4.7,
    reviews: 1,
    revenue: 999999,
    lastUpdated: "2025-02-20",
    isOnSale: true,
  },
]

export default function InstructorCoursesManagePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("온라인 강의")

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 강의 필터링
  const filteredCourses = courses.filter((course) => {
    // 검색어 필터링
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())

    // 상태 필터링
    const matchesStatus = filterStatus === "all" || course.status === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">강의 관리</h1>
            <Link href="/instructor/courses/create">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-1" />새 강의 만들기
              </Button>
            </Link>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="강의 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-1" />
                  필터
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      상태: {filterStatus === "all" ? "전체" : filterStatus === "published" ? "공개" : "임시저장"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("published")}>공개</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("draft")}>임시저장</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-4 border-b border-gray-800">
              <div className="flex">
                <button
                  className={`px-4 py-2 ${activeTab === "온라인 강의" ? "border-b-2 border-red-600 text-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("온라인 강의")}
                >
                  온라인 강의
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "오프라인 강의" ? "border-b-2 border-red-600 text-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("오프라인 강의")}
                >
                  오프라인 강의
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="pb-3 pl-4">이미지</th>
                    <th className="pb-3">강의명</th>
                    <th className="pb-3">평점</th>
                    <th className="pb-3">수강생수</th>
                    <th className="pb-3">질문</th>
                    <th className="pb-3">가격</th>
                    <th className="pb-3">상태</th>
                    <th className="pb-3">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 pl-4">
                        <div className="flex items-center">
                          <Image
                            src={course.coverImage || "/placeholder.svg"}
                            alt={course.title}
                            width={80}
                            height={45}
                            className="w-16 h-10 object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="max-w-xs truncate">{course.title}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">{course.rating.toFixed(1)}</div>
                      </td>
                      <td className="py-4">{course.students}</td>
                      <td className="py-4">0</td>
                      <td className="py-4">{course.revenue > 0 ? `₩${formatPrice(course.revenue)}` : "₩0"}</td>
                      <td className="py-4">
                        <Badge className="bg-green-600">공개</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1">
                          {course.isOnSale ? (
                            <Badge className="bg-blue-600 cursor-pointer">할인중</Badge>
                          ) : (
                            <Link href={`/instructor/courses/discount/${course.id}`}>
                              <Badge className="bg-gray-700 hover:bg-gray-600 cursor-pointer">할인설정</Badge>
                            </Link>
                          )}
                          <Link href={`/instructor/courses/create`}>
                            <Badge className="bg-gray-700 hover:bg-gray-600 cursor-pointer">강의 수정</Badge>
                          </Link>
                          <Badge className="bg-gray-700 hover:bg-gray-600 cursor-pointer">통계보기</Badge>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

