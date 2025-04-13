"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Search, ChevronDown, MessageSquare, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"
import useUserStore from "@/app/auth/userStore"

interface Inquiry {
  id: number
  courseTitle: string
  author: string
  subject: string
  content: string
  regDate: string
  replyCount: number
  replies: Reply[]
}
//확인용
interface Reply {
  id: number
  author: string
  regDate: string
  content: string
}

export default function InstructorInquiriesPage() {
  // 강사 ID를 기반으로 대시보드 데이터 가져오기
  const { user, restoreFromStorage } = useUserStore();

  // 컴포넌트 마운트 시 localStorage에서 user 복원
  useEffect(() => {
    if (!user) {
      restoreFromStorage();
    }
  }, [user, restoreFromStorage]);

  const instructorId = user?.instructorId;

  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("전체")
  const [filterCourse, setFilterCourse] = useState("전체")

  // 댓글 관련 상태
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null)
  const [editReplyContent, setEditReplyContent] = useState("")

  // 문의 목록 조회 (API는 각 Inquiry에 replies 배열과 replyCount 필드를 내려온다고 가정)
  const fetchInquiries = async () => {
    const paramsObj = new URLSearchParams()
    if (searchQuery) paramsObj.append("query", searchQuery)
    if (filterStatus !== "전체") paramsObj.append("status", filterStatus)
    if (filterCourse !== "전체") paramsObj.append("courseId", filterCourse)

    const res = await fetch(`/api/instructor/inquiries/${instructorId}?${paramsObj.toString()}`)
    const json = await res.json()
    setInquiries(json.data || [])
  }

  useEffect(() => {
    if (instructorId) fetchInquiries()
  }, [instructorId, searchQuery, filterStatus, filterCourse])

  // 댓글 등록
  const handleReplySubmit = async (boardId: number) => {
    await fetch(`/api/instructor/inquiries/${boardId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent })
    })
    setReplyingTo(null)
    setReplyContent("")
    fetchInquiries()
  }

  // 댓글 수정
  const handleUpdateReply = async (replyId: number) => {
    await fetch(`/api/instructor/inquiries/reply/${replyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editReplyContent })
    })
    setEditingReplyId(null)
    setEditReplyContent("")
    fetchInquiries()
  }

  // 댓글 삭제
  const handleDeleteReply = async (replyId: number) => {
    await fetch(`/api/instructor/inquiries/reply/${replyId}`, { method: "DELETE" })
    fetchInquiries()
  }

  // 댓글 수정 버튼 클릭 시
  const handleEditReply = (replyId: number, content: string) => {
    setEditingReplyId(replyId)
    setEditReplyContent(content)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />
      <div className="flex">
        <InstructorSidebar />
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <h1 className="text-2xl font-bold mb-6">수강전 문의관리</h1>

          {/* 검색 및 필터 영역 */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="문의 제목, 내용, 작성자 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    상태: {filterStatus}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  {["전체", "미답변", "답변완료"].map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setFilterStatus(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 문의 목록 렌더링 */}
            <div className="space-y-6">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="border border-gray-800 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{inquiry.subject}</h3>
                      <Badge className={inquiry.replyCount === 0 ? "bg-red-600" : "bg-green-600"}>
                        {inquiry.replyCount === 0 ? "미답변" : "답변완료"}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {inquiry.author} • {new Date(inquiry.regDate).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900">
                    <p className="mb-4">{inquiry.content}</p>

                    {/* 댓글 목록 */}
                    {inquiry.replyCount > 0 &&
                      inquiry.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-800 p-3 rounded-lg mb-2">
                          <div className="flex justify-between">
                            <div className="text-green-400">{reply.author}</div>
                            <div className="text-gray-400 text-sm">{new Date(reply.regDate).toLocaleString()}</div>
                          </div>
                          {editingReplyId === reply.id ? (
                            <>
                              <Textarea
                                value={editReplyContent}
                                onChange={(e) => setEditReplyContent(e.target.value)}
                                placeholder="댓글 수정"
                                className="bg-gray-700 border-gray-600 text-white mt-2"
                              />
                              <div className="flex justify-end gap-2 mt-2">
                                <Button variant="outline" onClick={() => setEditingReplyId(null)}>취소</Button>
                                <Button onClick={() => handleUpdateReply(reply.id)} className="bg-green-600">수정완료</Button>
                              </div>
                            </>
                          ) : (
                            <div className="mt-2">{reply.content}</div>
                          )}
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { setEditingReplyId(reply.id); setEditReplyContent(reply.content) }}
                            >
                              <Pencil className="h-4 w-4 mr-1" /> 수정
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteReply(reply.id)}
                              className="text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> 삭제
                            </Button>
                          </div>
                        </div>
                      ))
                    }

                    {/* 댓글 추가 입력 영역 (댓글이 없을 때만 표시) */}
                    {inquiry.replyCount === 0 && replyingTo === inquiry.id && (
                      <>
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="댓글을 입력하세요"
                          className="bg-gray-700 border-gray-600 text-white mb-3"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" onClick={() => setReplyingTo(null)}>취소</Button>
                          <Button onClick={() => handleReplySubmit(inquiry.id)} className="bg-green-600">댓글 제출</Button>
                        </div>
                      </>
                    )}

                    {inquiry.replyCount === 0 && replyingTo !== inquiry.id && (
                      <div className="flex justify-end">
                        <Button onClick={() => setReplyingTo(inquiry.id)} className="bg-green-600">
                          <MessageSquare className="h-4 w-4 mr-1" /> 댓글 작성
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
