"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import {ChevronDown, Clock, Eye, Filter, Flame, MessageSquare, Search, ThumbsUp} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {ScrollArea} from "@/components/ui/scroll-area"
import NetflixHeader from "@/components/netflix-header"
import Pagination from "@/components/user/coding-test/pagination"

const colors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-gray-500",
]
const getColorById = (id: number) => colors[id % colors.length]

interface Author {
  userId: number;
  name: string;
  image: string;
  level: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  likes: number;
  views: number;
  comments: number;
  courseSubject: string;
  createdAt: string;
  category: string;
}

interface PopularPost {
  id: number;
  title: string;
  userId: number;
  userName: string;
  profileImage: string;
}

interface CommunityInfo {
  allPosts: Post[];
  weeklyPopularPosts: PopularPost[];
  monthlyPopularPosts: PopularPost[];
}

const CATEGORIES = [
  {id: "all", name: "전체", icon: Filter},
  {id: "qna", name: "질문및답변", icon: MessageSquare},
  {id: "projects", name: "프로젝트", icon: Clock},
  {id: "free", name: "자유게시판", icon: Flame}
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [weeklyPopular, setWeeklyPopular] = useState<PopularPost[]>([])
  const [monthlyPopular, setMonthlyPopular] = useState<PopularPost[]>([])

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("latest")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const API_URL = `/api/community`

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL)
      const result = await response.json()
      const data: CommunityInfo = result.data  // ResultData<CommunityInfo>에서 data 만 추출

      setPosts(data.allPosts)
      setWeeklyPopular(data.weeklyPopularPosts)
      setMonthlyPopular(data.monthlyPopularPosts)
    } catch (err) {
      console.error("커뮤니티 데이터 로딩 실패:", err)
    }
  }


  useEffect(() => {
    fetchData()
  }, [])

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "popular":
        return b.likes - a.likes
      case "views":
        return b.views - a.views
      case "comments":
        return b.comments - a.comments
      default:
        return 0
    }
  })

  const selectedCategoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || ""

  const filteredPosts = sortedPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategoryName
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const indexOfLastPost = currentPage * itemsPerPage
  const indexOfFirstPost = indexOfLastPost - itemsPerPage
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader/>

      <main className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">개발자 커뮤니티</h1>
          <Link href="/user/community/write">
            <Button className="bg-red-600 hover:bg-red-700">글쓰기</Button>
          </Link>
        </div>

        {/* 검색 영역 */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
              <input
                type="text"
                placeholder="궁금한 내용을 검색해보세요!"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 좌측: 카테고리 필터 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-medium">카테고리</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="p-2">
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-red-500/10 text-red-500"
                            : "text-gray-400 hover:bg-gray-800/50"
                        }`}
                        onClick={() => {
                          setSelectedCategory(category.id)
                          setCurrentPage(1)
                        }}
                      >
                        <Icon className="h-5 w-5"/>
                        {category.name}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 중앙: 게시글 목록 */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                총 {filteredPosts.length}개의 게시글
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    {{
                      latest: "최신순",
                      popular: "인기순",
                      views: "조회순",
                      comments: "댓글순"
                    }[sortBy]}
                    <ChevronDown className="h-4 w-4 ml-2"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32 bg-gray-900 border-gray-800">
                  {["latest", "popular", "views", "comments"].map(option => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => {
                        setSortBy(option)
                        setCurrentPage(1)
                      }}
                      className="text-gray-300 focus:bg-gray-800 focus:text-white"
                    >
                      {{
                        latest: "최신순",
                        popular: "인기순",
                        views: "조회순",
                        comments: "댓글순"
                      }[option]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 게시글 리스트 */}
            <div className="space-y-4">
              {currentPosts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={
                            post.category === "질문및답변" ? "bg-red-600" :
                              post.category === "프로젝트" ? "bg-blue-600" :
                                post.category === "자유게시판" ? "bg-green-600" :
                                  "bg-gray-600"
                          }>
                            {post.category}
                          </Badge>
                          {post.author.level === "시니어" && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                              시니어
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-medium mb-2 group-hover:text-red-500 transition-colors">
                          <Link href={`/user/community/post/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        {post.author.image ? (
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full ring-2 ring-gray-800 object-cover"
                          />
                        ) : (
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${getColorById(post.author.userId)} ring-2 ring-gray-800`}
                          >
                            <span className="text-white text-xs font-semibold">
                              {post.author.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium text-gray-300">{post.author.name}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4"/> {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4"/> {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4"/> {post.comments}
                        </span>
                      </div>
                    </div>
                    {post.courseSubject && post.courseSubject.trim() !== "" && (
                      <span className="text-xs text-gray-500">From. {post.courseSubject}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length > itemsPerPage && (
              <Pagination
                totalItems={filteredPosts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          {/* 우측: 인기 게시글 */}
          <div className="lg:col-span-1 space-y-6 sticky">
            <PopularSection title="주간 인기 게시글" posts={weeklyPopular}/>
            <PopularSection title="월간 인기 게시글" posts={monthlyPopular}/>
          </div>
        </div>
      </main>
    </div>
  )
}

function PopularSection({title, posts}: { title: string; posts: PopularPost[] }) {
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 top-24">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <div className="p-4 space-y-3">
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/user/community/post/${post.id}`}
              className="block p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <p className="text-sm text-gray-300 font-medium truncate">{post.title}</p>
              <div className="flex items-center gap-2 mt-1">
                {post.profileImage ? (
                  <img
                    src={post.profileImage}
                    alt={post.userName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${getColorById(post.userId)}`}
                  >
                    <span className="text-xs text-white font-semibold">
                      {post.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-400">{post.userName}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

