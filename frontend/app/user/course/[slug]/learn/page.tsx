"use client"
import {useEffect, useState} from "react"
import Link from "next/link"
import {ChevronLeft, List, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useParams} from "next/navigation"
import LearnVideoComponent from "@/components/user/course/learn"
import Sidebar from "@/components/user/course/sidebar"

interface Course {
  id: number
  subject: string
}

export default function CourseLearnPage() {
  const params = useParams()
  const {slug} = params
  const API_URL = `/api/course/${slug}/learn`

  const [course, setCourse] = useState<Course>({
    id: 0,
    subject: "",
  })

  // 강의 선택을 위한 상태값 추가
  const [currentLectureId, setCurrentLectureId] = useState<number | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setCourse(data.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData().catch(console.error)
  }, [slug])

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* 상단 헤더 */}
      <header className="bg-black border-b border-gray-800 flex items-center justify-between px-4 py-2 h-14">
        <div className="flex items-center">
          <Link href={`/user`} className="flex items-center text-gray-300 hover:text-white">
            <ChevronLeft className="h-5 w-5 mr-1"/>
            <span className="hidden sm:inline">돌아가기</span>
          </Link>
        </div>

        <div className="flex-1 mx-4 text-center">
          <h1 className="text-lg font-medium truncate">{course.subject}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            {sidebarOpen ? <X className="h-4 w-4"/> : <List className="h-4 w-4"/>}
            <span className="ml-1 hidden sm:inline">{sidebarOpen ? "목차 닫기" : "목차 보기"}</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 사이드바 */}
        {sidebarOpen && (
          <div className="w-80 h-full shrink-0 transition-all duration-300">
            <Sidebar
              courseId={course.id}
              setCurrentLectureId={setCurrentLectureId}
              currentLectureId={currentLectureId}
            />
          </div>
        )}
        {/* 메인 영역 */}
        <main className={`flex-1 bg-gray-900 transition-all duration-300`}>
          {currentLectureId ? (
            <LearnVideoComponent
              key={currentLectureId}
              id={currentLectureId}
              onNext={(nextId) => setCurrentLectureId(nextId)}
            />
          ) : (
            <p className="text-white text-center mt-10">강의를 선택하세요.</p>
          )}
        </main>
      </div>
    </div>
  )
}
