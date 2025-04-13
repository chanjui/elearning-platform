"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

// 예시 질문 데이터
const questions = [
  {
    id: "1",
    title: "아이템 드랍 확률 조정 질문",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part1: MMO 컨텐츠 구현 (1)",
    author: "qwerty123",
    date: "2023-03-21",
    status: "미답변",
    likes: 0,
    comments: 2,
    views: 15,
  },
  {
    id: "2",
    title: "학습자료 실행 관련 문의",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part7: MMO 컨텐츠 구현 (Unity + C# 서버)",
    author: "gamedev332",
    date: "2023-03-15",
    status: "답변완료",
    likes: 0,
    comments: 0,
    views: 8,
  },
  {
    id: "3",
    title: "Spinlock에서 Compare exchange를 사용하지 않고",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part4: 멀티 서버",
    author: "Heca",
    date: "2023-03-10",
    status: "답변완료",
    likes: 0,
    comments: 1,
    views: 12,
  },
  {
    id: "4",
    title: "강의에서 쓰레드 생성되는게 제가 이해하게 맞을까요?",
    course: "[C++] 리눅스 서버 프로그래밍 입문",
    author: "dev123",
    date: "2023-03-05",
    status: "답변완료",
    likes: 1,
    comments: 3,
    views: 25,
  },
  {
    id: "5",
    title: "동일한 쓰레드의 소유권 정책에 대해 궁금합니다.",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part5: 게임 서버",
    author: "SeungHun Yim",
    date: "2023-03-01",
    status: "답변완료",
    likes: 0,
    comments: 2,
    views: 18,
  },
]

export default function InstructorQuestionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("전체")
  const [filterCourse, setFilterCourse] = useState("전체")

  // 질문 필터링
  const filteredQuestions = questions.filter((question) => {
    // 검색어 필터링
    const matchesSearch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.author.toLowerCase().includes(searchQuery.toLowerCase())

    // 상태 필터링
    const matchesStatus = filterStatus === "전체" || question.status === filterStatus

    // 강의 필터링
    const matchesCourse = filterCourse === "전체" || question.course.includes(filterCourse)

    return matchesSearch && matchesStatus && matchesCourse
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">강의 질문 관리</h1>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="질문 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      상태: {filterStatus}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterStatus("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("미답변")}>미답변</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("답변완료")}>답변완료</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      강의: {filterCourse === "전체" ? "전체" : "선택됨"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterCourse("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("C++")}>C++ 강의</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("Unity")}>Unity 강의</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="bg-blue-600 hover:bg-blue-700">검색</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="pb-3 pl-4">제목</th>
                    <th className="pb-3">작성자</th>
                    <th className="pb-3">작성일</th>
                    <th className="pb-3 text-center">좋아요</th>
                    <th className="pb-3 text-center">댓글</th>
                    <th className="pb-3 text-center">조회수</th>
                    <th className="pb-3 text-center">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question) => (
                    <tr key={question.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 pl-4">
                        <Link href={`/instructor/questions/${question.id}`} className="hover:text-blue-400">
                          <div className="font-medium">{question.title}</div>
                          <div className="text-xs text-gray-400 mt-1">{question.course}</div>
                        </Link>
                      </td>
                      <td className="py-4">{question.author}</td>
                      <td className="py-4">{question.date}</td>
                      <td className="py-4 text-center">{question.likes}</td>
                      <td className="py-4 text-center">{question.comments}</td>
                      <td className="py-4 text-center">{question.views}</td>
                      <td className="py-4 text-center">
                        <Badge className={question.status === "미답변" ? "bg-red-600" : "bg-green-600"}>
                          {question.status}
                        </Badge>
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

