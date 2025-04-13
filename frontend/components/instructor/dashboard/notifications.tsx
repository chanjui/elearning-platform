import { ArrowRight } from "lucide-react"
import { Button } from "../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

// 최근 알림 데이터
interface NotificationItem {
  id: number
  createdAt: string
  message: string
}

interface NotificationsProps {
  recentNotifications: NotificationItem[]
}

export default function Notifications({ recentNotifications }: NotificationsProps) {

  // 날짜 & 시간 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
  
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" }) // (월), (화) 등
  
    const ampm = hours < 12 ? "오전" : "오후"
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
  
    return `${month}월 ${day}일(${weekday}) ${ampm} ${hour12}시`
  }  

  return (
    <Card className="bg-gray-900 border-gray-800 text-white mb-8">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">최근 알림</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
              <th className="p-4">날짜</th>
              <th className="p-4">알림 내용</th>
            </tr>
          </thead>
          <tbody>
            {recentNotifications.map((notification) => (
              <tr key={notification.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 text-sm">
                  {formatDate(notification.createdAt)}
                </td>
                <td className="p-4">{notification.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-center">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            더보기 <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export type { NotificationItem }
