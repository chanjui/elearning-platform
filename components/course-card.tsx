import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  //id: number
  subject: string
  instructor: string | null
  price: number
  thumbnail: string
  originalPrice?: number
  discountRate?: number
  rating?: number
  ratingCount?: number
  students?: number
  isNew?: boolean
  isUpdated?: boolean
}

export default function CourseCard({
  thumbnail,
  subject,
  instructor,
  price,
  originalPrice,
  discountRate,
  rating,
  ratingCount = 0,
  students,
  isNew = false,
  isUpdated = false,
}: CourseCardProps) {
  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={subject}
          width={280}
          height={160}
          className="w-full h-[160px] object-cover"
        />
        {isNew && <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">New</div>}
        {isUpdated && (
          <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">Update</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 line-clamp-2 h-10">{subject}</h3>
        <p className="text-gray-600 text-xs mb-2">{instructor ?? "강사 정보 없음"}</p>

        <div className="flex items-center mb-2">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">
            {rating !== undefined ? rating.toFixed(1) : "4.5"}
          </span>
          <span className="text-xs text-gray-400 ml-1">
            ({ratingCount})
          </span>
        </div>

        <div className="flex items-center">
          {discountRate ? (
            <>
              <div className="text-red-500 text-xs mr-2">
                {discountRate}% 할인
              </div>
              <div className="line-through text-gray-400 text-xs mr-2">₩{formatPrice(originalPrice || 0)}</div>
            </>
          ) : null}

          <div className={cn("font-bold", price === 0 ? "text-red-500" : "")}>
            {price === 0 ? "무료" : `₩${formatPrice(price)}`}
          </div>
        </div>
      </div>
    </div>
  )
}