"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"
import useUserStore from "@/app/auth/userStore"

interface Review {
  id: string
  content: string
  rating: number
  regDate: string
  userId: number
  nickname: string
  courseId: number
  subject: string
}

export default function InstructorReviewsPage() {

  // 강사 ID를 기반으로 대시보드 데이터 가져오기
  const { user, restoreFromStorage } = useUserStore();

  // 컴포넌트 마운트 시 localStorage에서 user 복원
  useEffect(() => {
    if (!user) {
      restoreFromStorage();
    }
  }, [user, restoreFromStorage]);

  const instructorId = user?.instructorId;

  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("최신순") // ✅ 정렬 기준 상태
  const [filterCourse, setFilterCourse] = useState("전체")

  const [reviews, setReviews] = useState<Review[]>([])
  const [courseList, setCourseList] = useState<{ id: number; title: string }[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5 // 한 페이지에 5개씩 표시
  const totalPages = Math.ceil(reviews.length / itemsPerPage)

  const pageGroup = Math.floor((currentPage - 1) / 10)
  const startPage = pageGroup * 10 + 1
  const endPage = Math.min(startPage + 9, totalPages)

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (!instructorId) return

    const fetchCourses = async () => {
      const res = await fetch(`/api/instructor/sales/${instructorId}/courses`)
      const json = await res.json()
      setCourseList(json.data || [])
    }
    fetchCourses()
  }, [instructorId])

  useEffect(() => {
    if (!instructorId) return

    const queryParams = new URLSearchParams()
    if (searchQuery) queryParams.append("query", searchQuery)
    if (filterCourse !== "전체") queryParams.append("courseId", filterCourse)

    fetch(`/api/instructor/reviews/${instructorId}?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        const list: Review[] = json.data || []
        setReviews(list)
      })
  }, [instructorId, filterCourse, searchQuery])

  // ✅ 정렬 처리
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "높은 평점순") return b.rating - a.rating
    if (sortOption === "낮은 평점순") return a.rating - b.rating
    return new Date(b.regDate).getTime() - new Date(a.regDate).getTime()
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />
      <div className="flex">
        <InstructorSidebar />
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">수강평 리스트</h1>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="내용 또는 작성자명으로 검색하세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* ✅ 정렬 기준 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      {sortOption}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    {["최신순", "높은 평점순", "낮은 평점순"].map((option) => (
                      <DropdownMenuItem key={option} onClick={() => setSortOption(option)}>
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 강의 필터 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      강의: {filterCourse === "전체" ? "전체" : courseList.find(c => c.id.toString() === filterCourse)?.title || "선택됨"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white max-h-60 overflow-y-auto">
                    <DropdownMenuItem onClick={() => setFilterCourse("전체")}>전체</DropdownMenuItem>
                    {courseList.map((course) => (
                      <DropdownMenuItem key={course.id} onClick={() => setFilterCourse(course.id.toString())}>
                        {course.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* 수강평 리스트 */}
            <div className="space-y-4">
              {paginatedReviews.map((review) => (
                <div key={review.id} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">
                          {review.nickname} • {review.regDate}
                        </span>
                      </div>
                      <p className="text-white mb-2">{review.content}</p>
                      <div className="text-sm text-gray-400">{review.subject}</div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        답글 달기
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이징 */}
            <div className="mt-6 flex justify-center items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setCurrentPage(Math.max(startPage - 1, 1))}
                  disabled={startPage === 1}
                >
                  이전
                </Button>

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                  <Button
                    key={startPage + i}
                    variant="outline"
                    className={`border-gray-700 ${
                      currentPage === startPage + i
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                    onClick={() => setCurrentPage(startPage + i)}
                  >
                    {startPage + i}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setCurrentPage(endPage + 1)}
                  disabled={endPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
