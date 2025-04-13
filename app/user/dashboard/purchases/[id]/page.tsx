"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Printer, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import NetflixHeader from "@/components/netflix-header"
import axios from "axios"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface PurchaseDetail {
  orderId: string
  impUid: string
  courseTitle: string
  instructor: string
  originalPrice: number
  discountPrice: number
  discountAmount: number
  payMethod: string
  cardName: string
  cardNumber: string
  paymentStatus: string
  paymentDate: string
  imageUrl: string
  pgProvider: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
}

export default function PurchaseDetailPage({ params }: { params: { id: string } }) {
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null)
  const receiptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    axios
      .get(`/api/payment/detail`, { params: { impUid: params.id } })
      .then((res) => setPurchase(res.data))
      .catch((err) => console.error("결제 상세 정보 불러오기 오류", err))
  }, [params.id])

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
    const ampm = hours >= 12 ? "오후" : "오전"
    const adjustedHour = hours % 12 === 0 ? 12 : hours % 12
    return `${year}-${month}-${day} ${ampm} ${('0' + adjustedHour).slice(-2)}:${minutes}`
  }

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !purchase) return
  
    const canvas = await html2canvas(receiptRef.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
  
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
  
    // 날짜: yyyy-MM-dd 형식
    const date = new Date(purchase.paymentDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
  
    // 이름, 강의명 파일 이름용 포맷
    const buyer = purchase.buyerName.replace(/\s+/g, "") || "사용자"
    const title = purchase.courseTitle.replace(/[^가-힣a-zA-Z0-9\s]/g, "_" ).slice(0, 20)
  
    const fileName = `${formattedDate}_${buyer}_${title}_영수증.pdf`
    pdf.save(fileName)
  }

  const displayPaymentMethod = () => {
    if (!purchase) return ""
  
    const isEasyPay = ["kakaopay", "tosspay", "naverpay"].includes(purchase.pgProvider)
  
    // 결제 방식 한글 매핑
    const methodMap: { [key: string]: string } = {
      card: "카드",
      point: "포인트",
      phone: "휴대폰 결제",
      vbank: "가상계좌",
      trans: "실시간 계좌이체",
    }

    const translatedMethod = methodMap[purchase.payMethod] || purchase.payMethod

    if (purchase.payMethod === "card" && isEasyPay) {
      return `${getPgName(purchase.pgProvider)} (${purchase.cardName})`
    } else if (purchase.payMethod === "card") {
      return `${translatedMethod} (${purchase.cardName})`
    } else {
      return translatedMethod
    }
  }

  const getPgName = (pg: string) => {
    switch (pg) {
      case "kakaopay":
        return "카카오페이"
      case "tosspay":
        return "토스페이"
      case "naverpay":
        return "네이버페이"
      default:
        return "간편결제"
    }
  }

  if (!purchase) return <div className="text-white p-10">로딩중</div>

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/user/dashboard/purchases" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            구매 내역으로 돌아가기
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">주문 상세 내역</h1>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">주문번호: ORDER-{purchase.orderId}{purchase.impUid.replace("imp_", "")}</h2>
                <p className="text-gray-400">주문일시: {purchase.paymentDate ? formatDateCustom(purchase.paymentDate) : "날짜 없음"} </p>
              </div>
              <Badge className={purchase.paymentStatus === "결제완료" ? "bg-green-600" : "bg-red-600"}>
                {purchase.paymentStatus}
              </Badge>
            </div>

            <Separator className="bg-gray-800 mb-6" />

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src={purchase.imageUrl || "/placeholder.svg"}
                  alt={purchase.courseTitle}
                  width={280}
                  height={160}
                  className="w-full md:w-[280px] h-auto object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{purchase.courseTitle}</h3>
                <p className="text-gray-400 mb-4">{purchase.instructor}</p>

                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">평생 무제한 수강</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">정가</div>
                    <div className="line-through">₩{formatPrice(purchase.originalPrice)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">할인</div>
                    <div className="text-green-500">-₩{formatPrice(purchase.discountAmount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">결제 금액</div>
                    <div className="font-bold">₩{formatPrice(purchase.discountPrice)}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-800 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">결제 정보</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>결제 방법</span>
                    <span>{displayPaymentMethod()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>카드 정보</span>
                    <span>{purchase.payMethod === "point"
                      ? getPgName(purchase.pgProvider)
                      : `${purchase.cardName} (${purchase.cardNumber})`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제일</span>
                    <span>{purchase.paymentDate.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>주문 상태</span>
                    <span className="font-medium text-green-500">{purchase.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">구매자 정보</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>이름</span>
                    <span>{purchase.buyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>이메일</span>
                    <span>{purchase.buyerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>연락처</span>
                    <span>{purchase.buyerPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8"
            ref={receiptRef}
          >
            <h2 className="text-xl font-bold mb-4">영수증 정보</h2>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">전자 영수증</div>
                  <div className="text-sm text-gray-400">PDF 형식으로 다운로드할 수 있습니다.</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleDownloadReceipt}
              >
                <Download className="h-4 w-4 mr-1" />
                다운로드
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/user/dashboard/purchases">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                구매 내역으로 돌아가기
              </Button>
            </Link>
            <Link href={`/user/course/${purchase.orderId}`}>
              <Button className="bg-red-600 hover:bg-red-700">강의 바로가기</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


