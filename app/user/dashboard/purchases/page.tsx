"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import NetflixHeader from "@/components/netflix-header"
import axios from 'axios'
import useUserStore from "@/app/auth/userStore";


interface Purchase {
  orderId: string
  paymentDate: string
  courseId: string
  courseTitle: string
  instructorName: string
  originalPrice: number
  discountPrice: number
  paymentMethod: string
  paymentStatus: string
  imageUrl: string
  impUid: string
  payMethod: string
}

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [visibleCount, setVisibleCount] = useState(5)

  const { user, restoreFromStorage } = useUserStore();

  useEffect(() => {
    restoreFromStorage();  // 페이지 로드 시 사용자 정보 복원
  }, [restoreFromStorage]);

  useEffect(() => {
    if (!user) return;  // 사용자가 없으면 리턴

    // 쿠키에 담긴 자동 인증 정보로 API 호출
    axios.get(`/api/purchases`, { withCredentials: true, params: {userId: user.id} })
      .then((res) => {
        console.log("구매 내역 조회 성공", res.data)
        if (res.data) {
          setPurchases(res.data);
        }
      })
      .catch((err) => {
        console.error("구매 내역 조회 오류", err);
      });
  }, [user]);  // user 상태가 변경될 때마다 실행

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 날짜 포맷팅 함수 (예: "2025.04.02 23:30")
  const formatDateCustom = (dateStr: string) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = date.getHours()
    const minutes = ('0' + date.getMinutes()).slice(-2)
    // 예: "2025-04-07 오후 04:29"
    const ampm = hours >= 12 ? "오후" : "오전"
    const adjustedHour = hours % 12 === 0 ? 12 : hours % 12
    return `${year}-${month}-${day} ${ampm} ${('0' + adjustedHour).slice(-2)}:${minutes}`
  }

  // 필터링된 구매 내역
  const filteredPurchases = (purchases || []).filter((purchase) => {
    const matchesSearch = purchase.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    let matchesPeriod = true
    if (filterPeriod !== "all") {
      const purchaseDate = new Date(purchase.paymentDate)
      const today = new Date()
      const monthsAgo = new Date()

      if (filterPeriod === "1month") {
        monthsAgo.setMonth(today.getMonth() - 1)
        matchesPeriod = purchaseDate >= monthsAgo
      } else if (filterPeriod === "3months") {
        monthsAgo.setMonth(today.getMonth() - 3)
        matchesPeriod = purchaseDate >= monthsAgo
      } else if (filterPeriod === "6months") {
        monthsAgo.setMonth(today.getMonth() - 6)
        matchesPeriod = purchaseDate >= monthsAgo
      }
    }

    // 필터링 상태에 따른 조건 추가
    const matchesStatus = filterStatus === "all" || purchase.paymentStatus === filterStatus;
    return matchesSearch && matchesPeriod && matchesStatus;
  })

  // 최신순으로 정렬 (내림차순: 최신이 맨 위)
  const sortedFilteredPurchases = filteredPurchases.sort((a, b) => {
    return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime();
  })

  // 보여줄 항목만 잘라내기
  const visiblePurchases = sortedFilteredPurchases.slice(0, visibleCount)

  useEffect(() => {
    console.log("현재 상태의 구매 내역:", purchases);
  }, [purchases]);

  // 더보기 버튼 클릭 시 visibleCount 증가
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  // 환불 요청 함수: 선택한 결제의 impUid refund 금액을 백엔드 환불 API로 요청
  const handleRefund = async (impUid: string, refundAmount: number) => {
    try {
      // JWT 토큰은 jwtProvider.resolveToken을 사용해서 일관되게 추출합니다.
      const token = localStorage.getItem("accessToken") || "";
      console.log("환불 요청 데이터:", { impUid, cancelAmount: refundAmount });

      const response = await axios.post(
        "/api/payment/refund",
        { impUid, cancelAmount: refundAmount },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data && response.data.success) {
        alert("환불이 성공적으로 처리되었습니다.");
        // 환불 성공 후 구매 내역을 재조회하거나, 상태 업데이트
        // 예: setPurchases(prev => prev.map(item => item.impUid === impUid ? {...item, paymentStatus: "환불완료"} : item));
      } else {
        alert("환불 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("환불 요청 오류:", error);
      alert("환불 요청 중 오류가 발생했습니다.");
    }

  }
  const displayPaymentMethod = (purchase: Purchase) => {
    const methodMap: { [key: string]: string } = {
      card: "카드",
      point: "포인트",
      phone: "휴대폰 결제",
      vbank: "가상계좌",
      trans: "실시간 계좌이체",
    }

    const payName = methodMap[purchase.paymentMethod] || purchase.paymentMethod

    return payName
  }


  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">구매 내역</h1>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="h-4 w-4 mr-1" /> 내역 다운로드
          </Button>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="강의명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">전체 기간</SelectItem>
                  <SelectItem value="1month">최근 1개월</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="결제완료">결제완료</SelectItem>
                  <SelectItem value="환불완료">환불완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 구매 내역 목록 */}
          <div className="mt-0">
            {visiblePurchases.length > 0 ? (
              <div className="space-y-4">
                {visiblePurchases.map((purchase) => (
                  <div key={purchase.orderId} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={purchase.imageUrl || "/placeholder.svg"}
                          alt={purchase.courseTitle}
                          width={140}
                          height={80}
                          className="w-full md:w-[140px] h-auto object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{purchase.courseTitle}</h3>
                            <p className="text-sm text-gray-400">{purchase.instructorName}</p>
                          </div>
                          <Badge className={purchase.paymentStatus === "결제완료" ? "bg-green-600" : "bg-red-600"}>
                            {purchase.paymentStatus === "결제완료" ? "결제완료" : "환불완료"}
                          </Badge>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
                          <div className="text-gray-400">
                            주문일: {formatDateCustom(purchase.paymentDate)} | 결제수단: {displayPaymentMethod(purchase)}
                          </div>
                          <div className="font-bold">
                            {purchase.originalPrice !== purchase.discountPrice && (
                              <span className="line-through text-gray-400 mr-2">
                                ₩{formatPrice(purchase.originalPrice)}
                              </span>
                            )}
                            ₩{formatPrice(purchase.discountPrice)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Link href={`/user/course/${purchase.courseId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            >
                              강의 보기
                            </Button>
                          </Link>
                          <Link href={`/user/dashboard/purchases/${purchase.impUid}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            >
                              상세 내역
                            </Button>
                            {/* 환불 요청 버튼: 결제 상태가 "결제완료"이면 환불 버튼 표시 */}
                            {purchase.paymentStatus === "결제완료" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRefund(purchase.impUid, purchase.discountPrice)}
                              >
                                환불 요청
                              </Button>
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="구매 내역 없음"
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">구매 내역이 없습니다</h3>
                <p className="text-gray-400 mb-4">
                  아직 구매한 강의가 없습니다. 다양한 강의를 둘러보세요.
                </p>
                <Link href="/user/courses">
                  <Button className="bg-red-600 hover:bg-red-700">강의 둘러보기</Button>
                </Link>
              </div>
            )}
          </div>

          {/* 더보기 버튼: 전체 목록이 visibleCount 보다 많을 경우 */}
          {sortedFilteredPurchases.length > visibleCount && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleLoadMore} className="bg-gray-700 hover:bg-gray-600">
                더보기
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}