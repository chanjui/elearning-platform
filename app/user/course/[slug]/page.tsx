'use client'
import Image from "next/image"
import Link from "next/link"
import {Award, ChevronDown, Clock, Heart, MessageSquare, Play, ShoppingCart, Star} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Progress} from "@/components/ui/progress"
import NetflixHeader from "@/components/netflix-header"
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import useUserStore from "@/app/auth/userStore";
import axios from "axios"


interface CourseInfoDTO {
  id: number;
  title: string;
  description: string;
  instructor: string;
  price: number;
  rating: number;
  students: number;
  totalLectures: number;
  totalHours: number;
  level: string;
  lastUpdated: string;
  image: string;
  curriculum: CourseSectionDTO[];
  reviews: CourseRatingDTO[];
  questions: BoardDTO[];
  isEnrolled: boolean;
  isLike: boolean;
}


interface CourseSectionDTO {
  id: number;
  title: string;
  lectures: LectureVideoDTO[];
}

interface LectureVideoDTO {
  id: number;
  title: string;
  duration: number;
  free: boolean;
}

interface CourseRatingDTO {
  id: number;
  userId: number;
  user: string;
  profile: string;
  rating: number;
  date: string;
  content: string;
}

interface BoardDTO {
  id: number;
  userId: number;
  user: string;
  profile: string;
  subject: string;
  content: string;
  date: string;
  comments: CommentDTO[];
}

interface CommentDTO {
  id: number;
  userId: number;
  user: string;
  profile: string;
  content: string;
  editDate: string;
}


export default function CoursePage(/*{params}: { params: { slug: string } }*/) {
  // 실제 구현에서는 params.slug 를 사용하여 API 에서 강의 데이터를 가져옵니다
  // 여기서는 예시 데이터를 사용합니다
  const params = useParams();
  const {slug} = params;
  const API_URL = `/api/course/${slug}`;
  const {user, restoreFromStorage} = useUserStore();
  const [isVisible, setIsVisible] = useState(false);

  const [course, setCourse] = useState<CourseInfoDTO>({
    id: 0,
    title: "",
    description: "",
    instructor: "",
    price: 0,
    rating: 0,
    students: 0,
    totalLectures: 0,
    totalHours: 0,
    level: "",
    lastUpdated: "",
    image: "/placeholder.svg?height=400&width=800",
    curriculum: [], // CourseSectionDTO 배열
    reviews: [], // CourseRatingDTO 배열
    questions: [], // BoardDTO 배열
    isEnrolled: false,
    isLike: false
  });
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(5);
  const totalReviews = course.reviews.length;
  

  // 별점 비율 계산
  const ratingCounts = [5, 4, 3].map((score) => {
    const count = course.reviews.filter((review) => review.rating === score).length;
    return {score, count, percentage: totalReviews ? (count / totalReviews) * 100 : 0};
  });

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-gray-500'
  ];

  const getColorById = (id: number) => {
    const colorIndex = id % colors.length;  // user.id를 색상 배열의 인덱스로 변환
    return colors[colorIndex]; // 해당 색상 반환
  };

  const setData = async () => {
    try {
      console.log("API 요청 URL:", `${API_URL}?userId=${user?.id || 0}`);
      const response = await fetch(`${API_URL}?userId=${user?.id || 0}`);
      console.log("API 응답 상태:", response.status);
      if (!response.ok) {
        console.error("API 응답 에러:", response.statusText);
        return;
      }
      const data = await response.json();
      console.log("전체 API 응답:", data);
      if (!data.data) {
        console.error("API 응답에 data 필드가 없습니다:", data);
        alert("잘못된 접근입니다.");
        window.location.href = "/"; // 메인 화면으로 이동
        return;
      }
      console.log("API 응답 데이터:", data.data);
      // isEnrolled 값이 없는 경우 기본값 설정
      const courseData = {
        ...data.data,
        isEnrolled: data.data.isEnrolled ?? false
      };
      console.log("처리된 course 데이터:", courseData);
      setCourse(courseData);
    } catch (error) {
      console.error("API 호출 중 에러 발생:", error);
    }
  };

   // 장바구니
   const handleAddToCartAndRedirect = async () => {
    const user = useUserStore.getState().user;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const response = await axios.post( "/api/cart/add", { courseId: course.id }, { withCredentials: true });
      const data = response.data;
      console.log(data);
      if (data.totalCount === 1) {
        alert("장바구니에 담았습니다.");
        router.push("/user/cart"); // ✅ 여기서 안전하게 이동!
      } else {
        alert("이미 장바구니에 담긴 강의입니다.");
        router.push("/user/cart"); // ❓ 이미 담겨있을 때도 이동할지 말지는 선택
      }
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("장바구니 추가 중 오류가 발생했습니다.");
    }
  };


  useEffect(() => {
    console.log("useEffect 실행");
    console.log("현재 user 정보:", user);
    restoreFromStorage();
    setData().then(() => {
      console.log("setData 완료 후 course 상태:", course);
      console.log("isEnrolled 값:", course.isEnrolled);
    });
    // 애니메이션을 위한 상태 설정
    setIsVisible(true);
  }, [])
  const [liked, setLiked] = useState(course.isLike ?? false);

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  const handleInquirySubmit = async () => {
    const subjectInput = document.getElementById("inquiry-title") as HTMLInputElement;
    const contentTextarea = document.getElementById("inquiry-content") as HTMLTextAreaElement;

    const subject = subjectInput?.value.trim();
    const content = contentTextarea?.value.trim();

    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    if (!subject || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const userId = user?.id || 14;
    const url = `/api/course/${slug}/addInquiry` +
      `?userId=${userId}` +
      `&courseId=${slug}` +
      `&subject=${subject}` +
      `&content=${content}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) throw new Error("서버 오류");

      alert("문의가 성공적으로 접수되었습니다.");
      subjectInput.value = "";
      contentTextarea.value = "";
    } catch (error) {
      console.error("❌ 문의 전송 실패:", error);
      alert("문의 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    try {
      await fetch(`${API_URL}/like?userId=${user?.id || 0}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    setLiked((prev) => !prev);
  };

  function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    } else {
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader/>

      {/* 강의 헤더 */}
      <div className="relative pt-24">
        <div className="relative h-[20vh] w-full">
          <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        </div>
      </div>

      {/* 강의 정보 */}
      <section className="container mx-auto px-4 py-8 -mt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼: 강의 정보 */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                <span className="ml-1 font-medium">{course.rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-gray-300">
                {course.students >= 100 ? "100+" : course.students} 수강생
              </span>

              {/*<span className="mx-2 text-gray-500">|</span>
                            <Link href="#reviews" className="text-blue-400 hover:underline">
                                수강평 보기
                            </Link>*/}
            </div>

            <div className="flex items-center mb-6">
              <span className="font-medium text-gray-300">지식공유자:</span>
              <Link href="#" className="text-blue-400 hover:underline ml-2">
                {course.instructor}
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2"/>
                <div>
                  <div className="text-sm text-gray-400">총 강의 수</div>
                  <div className="font-medium">{course.totalLectures}개 강의</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2"/>
                <div>
                  <div className="text-sm text-gray-400">총 강의 시간</div>
                  <div className="font-medium">
                    {course.totalHours < 60
                      ? "1시간 미만"
                      : `${(course.totalHours / 60).toFixed(1)}시간`}
                  </div>

                </div>
              </div>

              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Award className="h-5 w-5 text-gray-400 mr-2"/>
                <div>
                  <div className="text-sm text-gray-400">난이도</div>
                  <div className="font-medium">{course.level}</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2"/>
                <div>
                  <div className="text-sm text-gray-400">최근 업데이트</div>
                  <div className="font-medium">{course.lastUpdated}</div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="introduction" className="mb-8">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="introduction" className="data-[state=active]:bg-gray-700">
                  강의소개
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-gray-700">
                  커리큘럼
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-700">
                  수강평
                </TabsTrigger>
                <TabsTrigger value="inquiry" className="data-[state=active]:bg-gray-700">
                  수강전문의
                </TabsTrigger>
              </TabsList>

              <TabsContent value="introduction" className="mt-4">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">강의 소개</h3>
                  <div className="prose prose-invert max-w-none bg-gray-800 p-4 rounded-lg">
                    <p className="mb-4 min-h-80">{course.description}</p>

                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-4">
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border-b border-gray-700 last:border-b-0">
                      <div
                        className="flex items-center justify-between p-4 bg-gray-800 cursor-pointer">
                        <h3 className="font-medium">{section.title}</h3>
                        <ChevronDown className="h-5 w-5"/>
                      </div>
                      <div className="p-4 bg-gray-900">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <div
                            key={lectureIndex}
                            className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0"
                          >
                            <div className="flex items-center">
                              <Play className="h-4 w-4 mr-2 text-gray-400"/>
                              <span className="mr-2">{lecture.title}</span>
                              {lecture.free && (
                                <span
                                  className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">무료 공개</span>
                              )}
                            </div>
                            <span className="text-sm text-gray-400">
                              {formatDuration(Number(lecture.duration))}
                            </span>

                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" id="reviews" className="mt-4">
                <div className="mb-6 bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold">{course.rating.toFixed(1)}</div>
                    <div className="flex-1">
                      {ratingCounts.map(({score, percentage}) => (
                        <div key={`rating-stat-${score}`} className="flex items-center mb-1">
                          <div className="flex">
                            {[...Array(score)].map((_, i) => (
                              <Star key={`rating-stat-filled-${score}-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                            ))}
                            {[...Array(5 - score)].map((_, i) => (
                              <Star key={`rating-stat-empty-${score}-${i}`} className="h-4 w-4 text-gray-600"/>
                            ))}
                          </div>
                          <span className="ml-2">{score}점</span>
                          <Progress value={percentage} className="h-2 ml-2 w-40 bg-gray-700"/>
                          <span className="ml-2">{Math.round(percentage)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {course.reviews.slice(0, visibleCount).map((review, index) => (
                    <div
                      key={`review-${review.user}-${index}`}
                      className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 transition-all duration-500 hover:shadow-lg hover:border-gray-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                      style={{ transitionDelay: `${index * 100 + 300}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full ${getColorById(review.userId)} flex items-center justify-center mr-2 overflow-hidden`}>
                            {review.profile ? (
                              <img src={review.profile} alt="Profile"
                                   className="w-full h-full object-cover rounded-full"/>
                            ) : (
                              <span className="text-white">{review.user.charAt(0)}</span>
                            )}
                          </div>

                          <span className="font-medium">{review.user}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {Array.from({length: 5}).map((_, i) => (
                              <Star
                                key={`review-star-${review.user}-${i}`}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.content}</p>
                    </div>
                  ))}
                </div>

                {visibleCount < totalReviews && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            onClick={() => setVisibleCount((prev) => prev + 5)}>
                      수강평 더보기
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inquiry" className="mt-4">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">수강 전 문의하기</h3>
                  <p className="text-gray-300 mb-6">
                    강의에 대해 궁금한 점이 있으신가요? 수강 전 문의를 통해 강사님께 직접 질문해보세요.
                  </p>

                  <div className="mb-6">
                    {course.questions.length > 0 ? (
                      <div className="space-y-4">
                        {course.questions.map((question) => (
                          <div key={question.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 rounded-full ${getColorById(question.userId)} flex items-center justify-center mr-2 overflow-hidden`}>
                                  {question.profile ? (
                                    <img src={question.profile} alt="Profile"
                                         className="w-full h-full object-cover rounded-full"/>
                                  ) : (
                                    <span className="text-white">{question.user.charAt(0)}</span>
                                  )}
                                </div>
                                <span className="font-medium">{question.user}</span>
                              </div>
                              <span className="text-sm text-gray-400">{question.date}</span>
                            </div>

                            <h5 className="font-medium mb-3">{question.subject}</h5>
                            <hr/>
                            <p
                              className="block text-gray-300 bg-gray-700 rounded-lg min-h-20 p-2">{question.content}</p>

                            {/* ✅ 댓글이 존재할 경우에만 답변 표시 */}
                            {question.comments.length > 0 && (
                              <div className="mt-4 pl-6 border-l-2 border-gray-600">
                                <div className="bg-gray-300 rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div
                                        className={`w-8 h-8 rounded-full ${getColorById(question.comments[0].userId)} flex items-center justify-center mr-2 overflow-hidden`}>
                                        {question.comments[0].profile ? (
                                          <img src={question.comments[0].profile} alt="Profile"
                                               className="w-full h-full object-cover rounded-full"/>
                                        ) : (
                                          <span className="text-white">{question.comments[0].user.charAt(0)}</span>
                                        )}
                                      </div>
                                      <span className="font-medium text-gray-800">{question.comments[0].user}</span>
                                    </div>
                                    <span className="text-xs text-gray-800">{question.comments[0].editDate}</span>
                                  </div>
                                  <p className="text-gray-900 mt-2">{question.comments[0].content}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                        <p className="text-gray-400">등록된 문의가 없습니다.</p>
                      </div>
                    )}
                  </div>


                  <div>
                    <h4 className="font-medium mb-4">문의하기</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="inquiry-title" className="block text-sm font-medium mb-1">제목</label>
                        <input id="inquiry-title" type="text"
                               className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                               placeholder="문의 제목을 입력해주세요"/>
                      </div>
                      <div>
                        <label htmlFor="inquiry-content" className="block text-sm font-medium mb-1">내용</label>
                        <textarea id="inquiry-content"
                                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[150px]"
                                  placeholder="문의 내용을 입력해주세요"></textarea>
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleInquirySubmit}>문의하기</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

            </Tabs>

            {/*
            함께 들으면 좋은 강의 임시로 주석처리
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">함께 들으면 좋은 강의</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.relatedCourses.slice(0, 2).map((relatedCourse, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 netflix-card-hover"
                  >
                    <Image
                      src={relatedCourse.image || "/placeholder.svg"}
                      alt={relatedCourse.title}
                      width={280}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-1">{relatedCourse.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{relatedCourse.instructor}</p>
                      <div className="flex items-center justify-between">
                        <div className="font-bold">₩{formatPrice(relatedCourse.price)}</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1"/>
                          <span>{relatedCourse.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>*/}
          </div>

          {/* 오른쪽 컬럼: 강의 구매 정보 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 mb-4">
                <div className="relative aspect-video">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover"/>
                  {/*<div className="absolute inset-0 flex items-center justify-center">
                                        <Button
                                            className="bg-white text-black hover:bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
                                            <Play className="h-8 w-8"/>
                                        </Button>
                                    </div>*/}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold">₩{formatPrice(course.price)}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {course.isEnrolled == null || !course.isEnrolled ? (
                      <>
                        <Link href="/user/cart">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleAddToCartAndRedirect}>
                            <ShoppingCart className="h-4 w-4 mr-2"/>
                            수강신청 하기
                          </Button>
                        </Link>

                        <Button
                          variant={"outline"}
                          className={"w-full border-gray-700 text-gray-300 hover:bg-gray-800"}
                          onClick={toggleWishlist}
                        >
                          <Heart
                            className={`h-4 w-4 mr-2 ${
                              liked ? "fill-rose-500 text-rose-500" : "text-gray-300"
                            }`}
                          />
                          {liked ? "위시리스트에 추가됨" : "위시리스트에 추가"}
                        </Button>

                      </>
                    ) : (
                      <Link href={`/user/course/${slug}/learn`}>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Play className="h-4 w-4 mr-2"/>
                          강의 시청
                        </Button>
                      </Link>
                    )}
                  </div>

                  <div className="text-sm text-gray-400 space-y-2">
                    {/*
                    인원 수 너무 적어서 보이기 좀 애매한 부분 주석처리
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2"/>
                      <span>{course.students}명 이상 수강중</span>
                    </div>*/}
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2"/>
                      <span className="text-sm text-gray-400">
                        총
                        {course.totalHours < 60
                          ? " 1시간 미만 "
                          : ` ${(course.totalHours / 60).toFixed(1)}시간`}
                        수업
                      </span>

                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2"/>
                      <span>수강생 전용 Q&A 제공</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2"/>
                      <span>평생 무제한 수강</span>
                    </div>
                  </div>
                </div>
              </div>

              {/*
              함께 둘러볼 강의 임시로 주석처리
              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                <h3 className="font-medium mb-2">이 강의도 함께 둘러보세요</h3>
                <div className="space-y-4">
                  {course.relatedCourses.slice(2, 4).map((relatedCourse, index) => (
                    <div key={index} className="flex gap-2">
                      <Image
                        src={relatedCourse.image || "/placeholder.svg"}
                        alt={relatedCourse.title}
                        width={80}
                        height={45}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{relatedCourse.title}</h4>
                        <div
                          className="text-sm text-gray-400">₩{formatPrice(relatedCourse.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>*/}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}