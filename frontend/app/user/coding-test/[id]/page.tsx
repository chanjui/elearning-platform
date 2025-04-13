"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Award, Tag, CheckCircle, Play, ChevronDown, ChevronUp, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import { codeTemplates } from '@/components/user/coding-test/code'
import useUserStore from "@/app/auth/userStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// 동적으로 헤더 import
const NetflixHeader = dynamic(() => import("@/components/netflix-header"), {
  ssr: false
})

// 타입 정의 추가
interface Example {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  submissionCount: number;
  passRate: number;
  createdAt: string;
  examples: Example[];
}

interface Submission {
  id: string;
  status: 'ACCEPTED' | 'ERROR' | 'PENDING' | 'WRONG_ANSWER';
  language: string;
  runtime: string;
  memory: string;
  submittedAt: string;
  errorMessage?: string;
  code: string;
  actualOutput?: string;
}

export default function CodingTestDetailPage() {
  const params = useParams()
  const id = Number(params?.id)
  const { user, restoreFromStorage } = useUserStore()  // restoreFromStorage 추가

  const [mounted, setMounted] = useState(false)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof codeTemplates>("JAVASCRIPT")
  const [code, setCode] = useState(codeTemplates.JAVASCRIPT)
  const [showHints, setShowHints] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  
  //
  
  useEffect(() => {
    setMounted(true)
    restoreFromStorage()  
  }, [])

  useEffect(() => {
    if (!mounted || !id) return

    const fetchProblemAndSubmissions = async () => {
      try {
        // 1. 문제 정보와 통계 정보를 따로 호출
        const [problemResponse, statsResponse] = await Promise.all([
          fetch(`/api/coding/problems/${id}`),
          fetch(`/api/coding/problems/${id}/stats`)
        ]);
        
        const problemData = await problemResponse.json();
        const statsData = await statsResponse.json();
        
        // 백엔드 데이터를 프론트엔드 구조에 맞게 변환
        const formattedProblem = {
          id: problemData.id,
          title: problemData.title,
          description: problemData.description,
          difficulty: problemData.difficulty === 'EASY' ? '쉬움' : 
                     problemData.difficulty === 'MEDIUM' ? '보통' : '어려움',
          category: "배열",
          submissionCount: statsData.totalSubmissions || 0,
          passRate: statsData.successRate ? Number(statsData.successRate.toFixed(1)) : 0,
          createdAt: problemData.createdAt,
          examples: [
            {
              input: problemData.inputExample,
              output: problemData.outputExample,
              explanation: "예제 설명"
            }
          ]
        }
        
        setProblem(formattedProblem)
        
        // 2. 제출 기록을 추가로 호출
        const submissionsResponse = await fetch(`/api/coding/submissions?problemId=${id}`)
        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData)
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error)
      }
    }

    fetchProblemAndSubmissions()
  }, [id, mounted])

  // 언어 변경 시 코드 템플릿 업데이트
  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage as keyof typeof codeTemplates)
    setCode(codeTemplates[newLanguage as keyof typeof codeTemplates])
  }

  if (!mounted || !problem) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NetflixHeader />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    )
  }
  const handleSubmit = async () => {
    try {
      // localStorage에서 한번 더 확인
      restoreFromStorage()
      
      if (!user) {
        alert('로그인이 필요합니다.');
        // 로그인 페이지로 리다이렉트 추가
        window.location.href = '/login';  // 또는 router.push('/login') 사용
        return;
      }

      const response = await fetch(`/api/coding/submissions/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: selectedLanguage,
          code: code,
          userId: user.id
        })
      })
      
      const result = await response.json()
       // 제출 후 제출 기록 새로고침
      const updatedSubmissions = await fetch(`/api/coding/submissions?problemId=${id}`)
      const updatedSubmissionsData = await updatedSubmissions.json()
      setSubmissions(updatedSubmissionsData)
      
      // 결과에 따른 알림 표시
      alert(result.status === 'ACCEPTED' ? '정답입니다!' : '틀렸습니다. 다시 시도해주세요.')
    } catch (error) {
      console.error('코드 제출에 실패했습니다:', error)
      alert('코드 제출 중 오류가 발생했습니다.')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-green-600 text-white"
      case "보통":
        return "bg-yellow-600 text-white"
      case "어려움":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  // status ENUM을 한글로 변환하는 함수 추가
  const getStatusInKorean = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return '성공';
      case 'ERROR':
        return '오류';
      case 'PENDING':
        return '대기중';
      case 'WRONG_ANSWER':
        return '실패';
      default:
        return status;
    }
  }

  // 날짜 포맷 함수 추가
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/coding-test" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            문제 목록으로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 문제 설명 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  <Badge variant="outline" className="border-gray-700 text-gray-300">
                    {problem.category}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>제출 수: {problem.submissionCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>통과율: {problem.passRate}%</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <h2 className="text-xl font-medium mb-2">문제 설명</h2>
                <p>{problem.description}</p>

                <h2 className="text-xl font-medium mt-6 mb-2">예제</h2>
                {problem.examples.map((example, index) => (
                  <div key={index} className="mb-4 bg-gray-800 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="font-medium">입력:</span> {example.input}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">출력:</span> {example.output}
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-medium">설명:</span> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">제출 기록</h2>
                {user && (
                  <Link href={`/user/coding-test/submissions/${id}`}>
                    <Button variant="outline" className="text-gray-300 hover:text-white">
                      <CheckCircle className="h-4 w-4 mr-1" />내 제출 기록
                    </Button>
                  </Link>
                )}
              </div>

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
                              // 코드 표시 모달 열기
                              setSelectedSubmission(submission)
                              setShowCodeModal(true)
                            }}
                          >
                            코드 보기
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {submissions.some((s) => s.status === "WRONG_ANSWER" && s.errorMessage) && (
                <div className="mt-4 bg-red-900/30 p-4 rounded-lg border border-red-800">
                  <h3 className="font-medium mb-2 text-red-400">오류 메시지</h3>
                  <p className="text-red-300">
                    {submissions.find((s) => s.status === "WRONG_ANSWER" && s.errorMessage)?.errorMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
          

          {/* 오른쪽: 코드 에디터 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">코드 작성</h2>
                <Select 
                  value={selectedLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                    <SelectValue placeholder="언어 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                    <SelectItem value="PYTHON">Python</SelectItem>
                    <SelectItem value="JAVA">Java</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="bg-gray-950 rounded-t-md p-2 text-sm text-gray-400 border border-gray-800 border-b-0">
                  {selectedLanguage === "JAVASCRIPT" && "solution.js"}
                  {selectedLanguage === "PYTHON" && "solution.py"}
                  {selectedLanguage === "JAVA" && "Main.java"}
                  {selectedLanguage === "C" && "solution.c"}
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[400px] bg-gray-950 text-white font-mono p-4 rounded-b-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-700"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Save className="h-4 w-4 mr-1" />
                  저장
                </Button>
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Play className="h-4 w-4 mr-1" />
                  실행
                </Button>
                <Button onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
                  <Send className="h-4 w-4 mr-1" />
                  제출
                </Button>
              </div>
            </div>
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