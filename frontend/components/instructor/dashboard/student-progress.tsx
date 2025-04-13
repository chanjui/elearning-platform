import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

interface ProgressStatusItem {
  rangeLabel: string
  studentCount: number
}

// 고정된 구간 정의
const allRanges = [
  "0~10%",
  "10~20%",
  "20~30%",
  "30~40%",
  "40~50%",
  "50~60%",
  "60~70%",
  "70~80%",
  "80~90%",
  "90~100%",
]

export default function StudentProgress({ progressStatus }: { progressStatus: ProgressStatusItem[] }) {
  // 백엔드에서 받은 데이터 기반으로 누락된 구간 0으로 채우기
  const progressData = allRanges.map((range) => {
    const match = progressStatus.find((item) => item.rangeLabel === range)
    return {
      range,
      count: match ? match.studentCount : 0,
    }
  })

  const maxCount = Math.max(...progressData.map((item) => item.count), 1)

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">수강생 진행률 현황</CardTitle>
      </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-2">
            {progressData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-16 text-xs text-gray-400">{item.range}</div>
                <div className="flex-1 h-8 bg-gray-800 relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-red-500 transition-all duration-300"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  ></div>
                  <div className="absolute inset-y-0 right-2 flex items-center text-xs">{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
    </Card>
  )
}

export type { ProgressStatusItem }

