"use client"

import {useEffect, useState} from "react"
import {useParams, useRouter} from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {ArrowLeft, Flag, MessageSquare, MoreHorizontal, Pencil, Share2, ThumbsUp, Trash} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import NetflixHeader from "@/components/netflix-header"
import useUserStore from "@/app/auth/userStore"
import {Textarea} from "@/components/ui/textarea"

// 색상 배열 및 함수
const colors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-gray-500",
]
const getColorById = (id: number) => colors[id % colors.length]

// DTO 인터페이스
export interface CommunityBoardCommentDTO {
  commentId: number
  content: string
  createdDate: string
  editDate: string | null
  userId: number
  userNickname: string
  userProfileImage: string
}

export interface CommunityBoardOneDTO {
  boardId: number
  subject: string
  content: string
  fileData?: string | null
  userId: number
  userNickname: string
  userProfileImage: string
  createdDate: string
  editDate: string | null
  likes: number
  category: string
  comments: CommunityBoardCommentDTO[]
  liked: boolean
}

export default function CommunityPostDetailPage() {
  const params = useParams()
  const boardId = Number(params.id)
  const API_URL = `/api/community`;
  const [post, setPost] = useState<CommunityBoardOneDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState("")
  const {user, restoreFromStorage} = useUserStore();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const router = useRouter();


  const handleEditClick = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId)
    setEditContent(currentContent)
  }

  const handleEditSubmit = async () => {
    if (!editingCommentId || !editContent.trim()) return
    try {
      const res = await fetch(`${API_URL}/${editingCommentId}/editComments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: user?.id,
          content: editContent,
        }),
      })
      if (!res.ok) throw new Error("댓글 수정에 실패했습니다.")
      setEditingCommentId(null)
      setEditContent("")
      await fetchPost() // 수정 후 댓글 목록 새로고침
    } catch (err: any) {
      alert(err.message || "알 수 없는 오류")
    }
  }


  // 게시글 가져오기 함수
  const fetchPost = async () => {
    try {
      const res = await fetch(`${API_URL}/${boardId}?userId=${user?.id || 0}`)
      const json = await res.json()
      setPost(json.data)
      setLiked(post?.liked || false);
      setLikeCount(post?.likes || 0);

    } catch (err: any) {
      console.log(err);
      setError(err.message || "알 수 없는 오류가 발생했습니다.")
    }
  }

  useEffect(() => {
    const initialize = async () => {
      restoreFromStorage();  // 먼저 user 복원
    };

    initialize();
  }, []);

  useEffect(() => {

    const fetchAndCountView = async () => {
      const viewed = JSON.parse(localStorage.getItem("viewedPosts") || "[]") as number[]
      if (!viewed.includes(boardId)) {
        try {
          await fetch(`${API_URL}/${boardId}/view`, {method: "POST"})
          localStorage.setItem("viewedPosts", JSON.stringify([...viewed, boardId]))
        } catch { /* 조회수 실패 무시 */
        }
      }

      await fetchPost()
      setLoading(false)
    }

    fetchAndCountView()
  }, [boardId])

  // 댓글 등록 핸들러
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return
    try {
      const res = await fetch(`${API_URL}/${boardId}/addComments`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: user?.id,
          boardId: boardId,
          content: commentContent,
        }),
      })
      if (!res.ok) throw new Error("댓글 등록에 실패했습니다.")
      setCommentContent("")
      await fetchPost() // 댓글 등록 후 새로 가져오기
    } catch (err: any) {
      alert(err.message || "알 수 없는 오류")
    }
  }

  //댓글 삭제 함수
  const deleteComment = async (commentId: number) => {
    const response = await fetch(`${API_URL}/${commentId}/deleteComments?userId=${user?.id || 0}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("삭제 실패");
    }
  };

  //댓글 삭제 핸들러
  const handleDeleteClick = async (commentId: number) => {
    const confirmed = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteComment(commentId);
      await fetchPost() // 수정 후 댓글 목록 새로고침
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };


  const toggleLike = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    try {
      await fetch(`${API_URL}/like?boardId=${boardId}&userId=${user.id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLiked((prev) => !prev); // liked 상태 변경
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1)); // 좋아요 수 갱신
    } catch (error) {
      console.error("좋아요 처리 중 오류 발생:", error);
    }
  };


  if (loading) return <div className="text-center text-white py-20">게시글을 불러오는 중입니다...</div>
  if (error) return <div className="text-center text-red-500 py-20">{error}</div>
  if (!post) return <div className="text-center text-gray-400 py-20">게시글이 존재하지 않습니다.</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader/>

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/user/community" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1"/>
            커뮤니티로 돌아가기
          </Link>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          {/* 상단 배지 및 메뉴 */}
          <div className="flex justify-between mb-2">
            <Badge className={
              post.category === "질문및답변" ? "bg-red-600" :
                post.category === "프로젝트" ? "bg-blue-600" :
                  post.category === "자유게시판" ? "bg-green-600" :
                    "bg-gray-600"
            }>
              {post.category}
            </Badge>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share2 className="h-4 w-4"/>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white p-1 h-auto"
                  >
                    <MoreHorizontal className="h-4 w-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                  {post.userId === user?.id ? (
                    <DropdownMenuItem onClick={() => {
                      router.push(`/user/community/edit/${post.boardId}`);
                    }}>
                      <Pencil className="h-4 w-4 mr-2"/>
                      수정하기
                    </DropdownMenuItem>

                  ) : (
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2"/>
                      신고하기
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold mb-2">{post.subject}</h1>

          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <div>{new Date(post.createdDate).toLocaleString()}</div>
            <div className="flex items-center gap-1">
              {post.userProfileImage ? (
                <Image
                  src={post.userProfileImage}
                  alt={post.userNickname}
                  width={30}
                  height={30}
                  className="rounded-full object-cover"
                />
              ) : (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorById(post.userId)}`}
                >
                  <span className="text-white font-semibold">
                    {post.userNickname.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="font-medium text-sm">{post.userNickname}</span>
            </div>
          </div>

          <Separator className="my-4 bg-gray-800"/>

          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <p className="text-base leading-relaxed whitespace-pre-line min-h-80">{post.content}</p>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-6">
              <button
                onClick={toggleLike}
                className="flex items-center text-gray-400 hover:text-white"
              >
                <ThumbsUp className={`h-5 w-5 mr-2 ${liked ? "text-blue-500" : ""}`}/>
                좋아요 {likeCount}
              </button>

              <button className="flex items-center text-gray-400 hover:text-white">
                <MessageSquare className="h-5 w-5 mr-2"/>
                댓글 {post.comments.length}
              </button>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">댓글 {post.comments.length}</h2>
            {post.comments.map(c => (
              <div
                key={c.commentId}
                className="border border-gray-800 rounded-lg p-4 mb-4 bg-gray-800/50"
              >
                <div className="flex items-start gap-4">
                  {c.userProfileImage ? (
                    <Image
                      src={c.userProfileImage}
                      alt={c.userNickname}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorById(c.userId)}`}
                    >
                      <span className="text-white font-semibold">
                        {c.userNickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between mb-1 items-center">
                      <span className="font-medium">{c.userNickname}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <span>{new Date(c.createdDate).toLocaleString()}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white p-1 h-auto"
                            >
                              <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                            {c.userId === user?.id ? (
                              <>
                                <DropdownMenuItem onClick={() => handleEditClick(c.commentId, c.content)}>
                                  <Pencil className="h-4 w-4 mr-2"/>
                                  수정하기
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(c.commentId)}
                                  className="text-red-500 focus:text-red-400"
                                >
                                  <Trash className="h-4 w-4 mr-2"/>
                                  삭제하기
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2"/>
                                신고하기
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </div>
                    </div>
                    {editingCommentId === c.commentId ? (
                      <>
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[100px] bg-gray-800 border-gray-700 text-white mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" onClick={() => setEditingCommentId(null)}>취소</Button>
                          <Button className="bg-red-600 hover:bg-red-700" onClick={handleEditSubmit}>
                            수정 완료
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="whitespace-pre-line">{c.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </section>
        </div>

        <div className="mt-8">
          {user ? (
            <>
              <h3 className="text-lg font-medium mb-2">댓글 작성</h3>
              <Textarea
                placeholder="댓글을 작성해주세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-[100px] bg-gray-800 border-gray-700 text-white mb-2"
              />
              <div className="flex justify-end">
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCommentSubmit}
                >
                  댓글 등록
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              댓글 작성에는 로그인이 필요합니다.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
