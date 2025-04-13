"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Play, Star, Award, Users, BookOpen, TrendingUp, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NetflixHeader from "@/components/netflix-header"
import CourseCard from "@/components/course-card"

import Slider, {SliderData} from "@/components/user/main/slider"
import CourseSection from "@/components/user/main/course-section"
import Footer from "@/components/footer"
import axios from "axios"
import userStore from "@/app/auth/userStore"


export default function UserHomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [sliderList, setSliderList] = useState<SliderData[]>([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const [recommendedInstructors, setRecommendedInstructors] = useState([]);
  interface UserReview {
    userName: string
    profileUrl?: string | null
    courseName: string
    review: string
    rating: number
  }
  
  
  const [userReviews, setUserReviews] = useState<UserReview[]>([])
  const { restoreFromStorage } = userStore()
  
  const API_URL = "/api";

  useEffect(() => {
    restoreFromStorage()
  }, [])

  useEffect(() => {
    console.log("유스이펙트시작")
    // 메인 정보
    axios.get(`${API_URL}/course/main`)
    .then(res => {
      const data = res.data.data
      setSliderList(data.sliderList)
      setPopularCourses(data.popularCourses);
      setNewCourses(data.latestCourses)
      setFreeCourses(data.freeCourses);
      setUserReviews(data.userReviews);
      setRecommendedInstructors(data.recommendedInstructors);
    })
    .catch(err => console.error("메인 강의 로드 실패", err));
  }, [])

  // 애니메이션을 위한 상태 설정
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 통계 데이터
  const stats = [
    { icon: BookOpen, value: "1,200+", label: "강의 수" },
    { icon: Users, value: "50만+", label: "수강생" },
    { icon: Award, value: "300+", label: "전문 강사진" },
    { icon: TrendingUp, value: "98%", label: "수강 만족도" },
  ]

  // 슬라이드 변경 함수
  const changeSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // 캐러셀 스크롤 함수
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.offsetWidth * 0.75 : current.offsetWidth * 0.75
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      {/* 메인 슬라이더 */}
      {/* <MainSlider /> */}
      <Slider slides={sliderList} />

      {/* 통계 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 강의 섹션 */}
      <CourseSection
        title="인기 강의"
        link="/user/course"
        scrollable
        carouselRef={carouselRef}
        onScrollLeft={() => scroll("left")}
        onScrollRight={() => scroll("right")}
        courses={popularCourses}
        sectionId="popular"
      />

      {/* 추천 강사 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">추천 강사</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedInstructors && recommendedInstructors.length > 0 ? (
              recommendedInstructors.map((inst: any, index: number) => (
                <div
                  key={`instructor-${inst.id}-${index}`}
                  className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="p-6 flex flex-col items-center">
                    <Image
                      src={inst.profileUrl || "/placeholder.svg"}
                      alt={inst.name}
                      width={120}
                      height={120}
                      className="rounded-full mb-4 border-4 border-red-600"
                    />
                    <h3 className="text-xl font-bold mb-1 text-center">{inst.name}</h3>
                    <p className="text-gray-300 mb-4 text-center line-clamp-3">{inst.bio}</p>
                    <div className="flex justify-center gap-6 mb-4 w-full">
                      <div className="flex flex-col items-center">
                        <BookOpen className="h-5 w-5 text-gray-400 mb-1" />
                        <p className="text-sm text-gray-300">{inst.coursesCount}개 강의</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Users className="h-5 w-5 text-gray-400 mb-1" />
                        <p className="text-sm text-gray-300">{inst.totalStudents}명</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Star className="h-5 w-5 text-yellow-400 mb-1" />
                        <p className="text-sm text-gray-300">{inst.averageRating.toFixed(1)}</p>
                      </div>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 transition-all hover:shadow-lg mt-4">
                      강사 프로필 보기
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-300">추천 강사가 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      {/* 신규 & 무료 강의 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="new" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="new" className="data-[state=active]:bg-red-600 transition-all">
                  신규 강의
                </TabsTrigger>
                <TabsTrigger value="free" className="data-[state=active]:bg-red-600 transition-all">
                  무료 강의
                </TabsTrigger>
              </TabsList>
              <Link href="/user/courses" className="text-red-500 hover:text-red-400 flex items-center group">
                더 보기
                <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 신규 강의 */}
            <TabsContent value="new" className="mt-0">
              <CourseSection
                showHeader={false}
                link="/user/courses"
                courses={newCourses}
                sectionId="new"
              />
            </TabsContent>

            {/* 무료 강의 */}
            <TabsContent value="free" className="mt-0">
              <CourseSection
                showHeader={false}
                link="/user/courses"
                courses={freeCourses}
                sectionId="free"
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 수강생 후기 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">수강생 후기</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userReviews? (
              userReviews.map((review, index) => (
                <div
                  key={index}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 transition-all duration-500 hover:shadow-lg hover:border-gray-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${index * 100 + 300}ms` }}
                >
                  <div className="flex items-center mb-4">
                    <Image
                      src={review.profileUrl || "/placeholder.svg"}
                      alt={review.userName}
                      width={50}
                      height={50}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h3 className="font-medium">{review.userName}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{review.courseName}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-300">{review.review}</p>
                </div>
              ))
            ) : (
              <div>
                <p className="text-center text-gray-300">후기가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-black opacity-50 bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">지금 시작하세요</h2>
            <p className="text-xl text-gray-300 mb-8">
              1,200개 이상의 강의와 함께 당신의 커리어를 한 단계 업그레이드할 준비가 되었나요?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-lg py-6 px-8 transition-transform hover:scale-105">
                무료 강의 둘러보기
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 text-lg py-6 px-8 transition-transform hover:scale-105"
              >
                멤버십 가입하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}