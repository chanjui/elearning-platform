"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import NetflixHeader from "@/components/netflix-header"

interface Problem {
  id: string
  title: string
}

interface Submission {
  id: string
  status: string
  language: string
  runtime: string
  memory: string
  submittedAt: string
  code: string
  actualOutput?: string
}

export default function SubmissionHistoryPage() {
  const params = useParams()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 문제 정보 가져오기
        const problemResponse = await fetch(`/api/coding/problems/${params.id}`)
        const problemData = await problemResponse.json()
        setProblem(problemData)

        // 제출 기록 가져오기
        const submissionsResponse = await fetch(`/api/coding/submissions?problemId=${params.id}`)
        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData)
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const getStatusInKorean = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "정답"
      case "WRONG_ANSWER":
        return "오답"
      case "TIME_LIMIT_EXCEEDED":
        return "시간 초과"
      case "MEMORY_LIMIT_EXCEEDED":
        return "메모리 초과"
      case "RUNTIME_ERROR":
        return "런타임 에러"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NetflixHeader />
        <div className="container mx-auto px-4 py-20">
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href={`/user/coding-test/${params.id}`} className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            문제로 돌아가기
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h1 className="text-2xl font-bold mb-6">{problem?.title}</h1>
          <h2 className="text-xl font-medium mb-4">내 제출 기록</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">상태</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">언어</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">실행 시간</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">메모리</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">제출 시간</th>
                  <th className="py-3 px-4 text-left text-gray-400 font-medium">코드</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-4 px-4">
                      <Badge className={submission.status === "ACCEPTED" ? "bg-green-600" : "bg-red-600"}>
                        {getStatusInKorean(submission.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="border-gray-700 text-gray-300">
                        {submission.language}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">{submission.runtime}</td>
                    <td className="py-4 px-4">{submission.memory}</td>
                    <td className="py-4 px-4">{formatDate(submission.submittedAt)}</td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setShowCodeModal(true)
                        }}
                      >
                        <Code className="h-4 w-4 mr-1" />
                        코드 보기
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 코드 표시 모달 */}
      <Dialog open={showCodeModal} onOpenChange={setShowCodeModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle>제출한 코드</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-950 rounded-md p-4">
              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300">
                {selectedSubmission?.code}
              </pre>
            </div>
            {selectedSubmission?.actualOutput && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">실제 출력</h3>
                <div className="bg-gray-950 rounded-md p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-300">
                    {selectedSubmission.actualOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 