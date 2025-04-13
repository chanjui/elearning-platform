import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

interface DailyRevenueItem {
  courseId: number
  subject: string
  date: string
  amount: number
}

interface RevenueDataItem {
  courseId: number
  subject: string
  revenue: number
  percentage: number
}

interface RevenueChartProps {
  totalRevenue: number
  revenueData: RevenueDataItem[]
  dailyRevenueData: DailyRevenueItem[]
}

const bgColors = ["bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"]

export default function RevenueChart({ totalRevenue, revenueData, dailyRevenueData }: RevenueChartProps) {
  const [hoveredBar, setHoveredBar] = useState<{ dateIndex: number; barIndex: number } | null>(null)
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 1) 모든 subject(과목) 고정 순서로 수집
  //    - dailyRevenueData에 나오는 모든 subject를 Set에 담고, Array로 변환
  //    - 필요하면 .sort() 해서 알파벳 순 등 원하는 순서로 고정
  const subjects = Array.from(
    new Set(dailyRevenueData.map((item) => item.subject))
  )
  // subjects.sort() // 필요하면 정렬

  // 2) subject => colorIndex 매핑 (항상 같은 과목은 같은 색상)
  const subjectColorMap = subjects.reduce((acc, subject, idx) => {
    acc[subject] = idx % bgColors.length
    return acc
  }, {} as Record<string, number>)

  // 3) 날짜별로 데이터 그룹화
  const grouped = dailyRevenueData.reduce((acc, cur) => {
    if (!acc[cur.date]) acc[cur.date] = []
    acc[cur.date].push(cur)
    return acc
  }, {} as Record<string, DailyRevenueItem[]>)

  // 4) dateEntries 만들기
  //    - 각 date마다 subjects 순서대로 amount를 찾아서 percentage 계산
  const dateEntries = Object.entries(grouped).map(([date, list]) => {
    const total = list.reduce((acc, item) => acc + item.amount, 0)

    // subject별 amount 매핑
    const subjectAmountMap = list.reduce((acc, item) => {
      acc[item.subject] = (acc[item.subject] || 0) + item.amount
      return acc
    }, {} as Record<string, number>)

    // subjects 순서대로 bars 배열 생성
    const bars = subjects.map((subject) => {
      const amount = subjectAmountMap[subject] ?? 0
      const percentage = total > 0 ? (amount / total) * 100 : 0
      return {
        subject,
        amount,
        percentage,
        colorIndex: subjectColorMap[subject], // 색상 인덱스
      }
    })

    return { date, bars }
  })

  // 도넛 차트용 offset
  let offset = 0
  const colors = ["#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"]

  return (
    <Card className="bg-gray-900 border-gray-800 text-white mb-8">
      <CardHeader className="border-b border-gray-800 flex justify-between items-center">
        <CardTitle className="text-lg font-medium">강의 수익</CardTitle>
        <div className="flex items-center text-sm text-gray-400">
          <span>이번 달 현황</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400">이번 달 수익</div>
            <div className="text-xl font-bold">{formatPrice(totalRevenue)}원</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 도넛 차트 영역 */}
          <div>
            <div className="flex justify-center mb-6 relative">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* 배경 원 */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" strokeWidth="20" />
                  {/* 강의별 세그먼트 */}
                  {revenueData.map((item, index) => {
                    const dasharray = `${item.percentage * 2.51} ${100 * 2.51}`
                    const dashoffset = -offset * 2.51
                    offset += item.percentage
                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={colors[index % colors.length]}
                        strokeWidth="20"
                        strokeDasharray={dasharray}
                        strokeDashoffset={dashoffset}
                        transform="rotate(-90 50 50)"
                        onMouseEnter={() => setHoveredSegment(index)}
                        onMouseLeave={() => setHoveredSegment(null)}
                        className="cursor-pointer"
                      />
                    )
                  })}
                  {/* 중앙 원 */}
                  <circle cx="50" cy="50" r="30" fill="#111827" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">{formatPrice(totalRevenue)}원</div>
                </div>
                {/* 도넛 차트 툴팁 */}
                {hoveredSegment !== null && (
                  <div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 
                      bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[180px] text-xs z-50"
                  >
                    <div className="font-bold mb-2 border-b border-gray-700 pb-1">
                      {revenueData[hoveredSegment].subject}
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">금액:</span>
                      <span className="font-semibold">
                        {formatPrice(revenueData[hoveredSegment].revenue)}원
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">비율:</span>
                      <span className="font-semibold">
                        {revenueData[hoveredSegment].percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div
                      className="w-3 h-3 bg-gray-900 border-l border-b border-gray-700 
                        transform rotate-45 absolute left-1/2 -translate-x-1/2 bottom-[-6px]"
                    ></div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${bgColors[index % bgColors.length]}`} />
                    <span className="text-sm truncate max-w-[200px]">{item.subject}</span>
                  </div>
                  <div className="text-sm">
                    {formatPrice(item.revenue)}원 ({item.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 막대 그래프 영역 */}
          <div className="relative">
            <div className="text-sm text-gray-400 mb-4 flex justify-between items-center">
              <span>강의 수익 분포</span>
              <div className="text-xs px-2 py-1 bg-gray-800 rounded-md">일별 수익 비율</div>
            </div>

            <div className="h-[300px] relative overflow-visible">
              {/* 그리드 라인 */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-px bg-gray-800" style={{ top: `${i * 25}%` }} />
                ))}
              </div>

              {/* Y축 레이블 */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                <div>100%</div>
                <div>75%</div>
                <div>50%</div>
                <div>25%</div>
                <div>0%</div>
              </div>

              {/* 막대 그래프 컨테이너 */}
              <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end">
                {dateEntries.map(({ date, bars }, dateIndex) => (
                  <div key={dateIndex} className="flex-1 h-full relative flex justify-center">
                    {/* 
                      flex-col-reverse를 써서
                      bars[0] = 맨 아래,
                      bars[1] = 그 위...
                      항상 subjects 배열 순서대로 동일 위치
                    */}
                    <div className="w-10 h-full flex flex-col-reverse justify-start relative">
                      {bars.map((bar, barIndex) => (
                        <div
                          key={barIndex}
                          className={`w-full ${bgColors[bar.colorIndex]} 
                            transition-all duration-200 cursor-pointer relative`}
                          style={{
                            height: `${bar.percentage}%`,
                            // 맨 아래(첫 번째)만 border-radius 줄 수도 있음
                            borderTopLeftRadius: "0",
                            borderTopRightRadius: "0",
                          }}
                          onMouseEnter={() => setHoveredBar({ dateIndex, barIndex })}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          {hoveredBar &&
                            hoveredBar.dateIndex === dateIndex &&
                            hoveredBar.barIndex === barIndex && (
                              <div
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 
                                  bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-[180px] text-xs z-50"
                              >
                                <div className="font-bold mb-2 border-b border-gray-700 pb-1">{date}</div>
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 flex-shrink-0 rounded-full mr-2 ${bgColors[bar.colorIndex]}`} />
                                  <span className="font-medium">{bar.subject}</span>
                                </div>
                                <div className="mt-1 pl-4">
                                  <div className="flex justify-between gap-3">
                                    <span className="text-gray-400">금액:</span>
                                    <span className="font-semibold">{formatPrice(bar.amount)}원</span>
                                  </div>
                                  <div className="flex justify-between gap-3">
                                    <span className="text-gray-400">비율:</span>
                                    <span className="font-semibold">{bar.percentage.toFixed(1)}%</span>
                                  </div>
                                </div>
                                <div
                                  className="w-3 h-3 bg-gray-900 border-l border-b border-gray-700 
                                    transform rotate-45 absolute left-1/2 -translate-x-1/2 bottom-[-6px]"
                                />
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    {/* X축 날짜 레이블 */}
                    <div className="absolute bottom-[-24px] left-0 right-0 text-center">
                      <div className="text-xs text-gray-400 font-medium">{date}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 그래프 하단 가로선 */}
              <div className="absolute bottom-0 left-10 right-0 h-px bg-gray-700"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export type { RevenueDataItem, DailyRevenueItem }
