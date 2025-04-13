import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

// 수강생 학습 시간 데이터

interface StudyTimeItem {
  courseId: number
  courseTitle: string
  averageVideoTime: number // 영상 시간 평균 (분)
  videoCount: number       // 영상 개수
  avgStudyMinutes: number  // 학습 시간 (분)
}

interface LearningTimeProps {
  studyTimeData: StudyTimeItem[]
}

export default function LearningTime({ studyTimeData }: LearningTimeProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white mb-8">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">수강생 학습 시간</CardTitle>
        <div className="text-sm text-gray-400 mb-4">강의 50%이상 수강한 학습자 중 SVoD 학습자 10명 기준</div>
      </CardHeader>
      <CardContent className="p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400">
              <th className="pb-2">강의</th>
              <th className="pb-2">영상 시간</th>
              <th className="pb-2">영상 개수</th>
              <th className="pb-2">학습 시간</th>
              {/* <th className="pb-2">1일 학습 시간 평균</th> */}
            </tr>
          </thead>
          <tbody>
            {studyTimeData.map((item, index) => (
              <tr key={index} className="border-t border-gray-800">
                <td className="py-3">{item.courseTitle}</td>
                <td className="py-3">{item.averageVideoTime}분</td>
                <td className="py-3">{item.videoCount}개</td>
                <td className="py-3">{item.avgStudyMinutes}분</td>
                {/* <td className="py-3">{item.avgTime}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export type { StudyTimeItem }

