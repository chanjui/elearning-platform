import { Card, CardContent, CardHeader } from "../../ui/card"
import { ReactNode } from "react"

interface CourseEnrollmentItem {
  courseTitle: string
  completionRate: number
}

export default function CourseData({ courseEnrollment }: { courseEnrollment: CourseEnrollmentItem[] }) {
  const courseData = courseEnrollment.map(item => ({
    name: item.courseTitle,
    percentage: Math.round(item.completionRate),
  }))

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">학습 현황</CardTitle>
        <div className="text-sm text-gray-400 mt-1">
          전체 수강생 중 강의의 90% 이상 수강한 유저의 비율
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mt-4">
          {courseData.map((course, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{course.name}</span>
              </div>
              <div className="h-8 bg-gray-800 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-pink-500"
                  style={{ width: `${course.percentage}%` }}
                ></div>
                <div className="absolute inset-y-0 flex items-center justify-end w-full pr-2 text-xs">
                  {course.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-sm">완강률</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 디자인 손대지 않기 위해 별도로 유지
function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>
}

export type { CourseEnrollmentItem }

