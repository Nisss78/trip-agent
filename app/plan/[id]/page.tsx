"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Share2,
  Edit,
  Calendar,
  CheckSquare,
  Camera,
  FileText,
  Calculator,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PlanDetailPage() {
  const [currentDay, setCurrentDay] = useState(1)
  const totalDays = 3

  const scheduleData = {
    1: {
      date: "11月15日（金）",
      title: "1日目",
      events: [
        { time: "09:00", title: "東京駅出発", description: "新幹線のぞみ" },
        { time: "11:30", title: "京都駅到着", description: "ホテルに荷物を預ける" },
        { time: "13:00", title: "清水寺観光", description: "紅葉を楽しむ・写真撮影" },
        { time: "18:00", title: "夕食", description: "祇園で京料理" },
      ],
    },
    2: {
      date: "11月16日（土）",
      title: "2日目",
      events: [
        { time: "09:00", title: "金閣寺観光", description: "朝の静寂な時間を楽しむ" },
        { time: "14:00", title: "嵐山散策", description: "竹林の小径・渡月橋" },
        { time: "19:00", title: "温泉", description: "ホテルの温泉でリラックス" },
      ],
    },
    3: {
      date: "11月17日（日）",
      title: "3日目",
      events: [
        { time: "10:00", title: "伏見稲荷大社", description: "千本鳥居を歩く" },
        { time: "14:00", title: "お土産購入", description: "京都駅周辺" },
        { time: "16:00", title: "京都駅出発", description: "新幹線で東京へ" },
      ],
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">京都の紅葉を楽しむ旅</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">11/15 〜 11/17</p>
        </div>

        <div className="flex gap-2">
          <Link href="/plan/sample-plan/qr">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              QR共有
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <Tabs defaultValue="cover" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-7 w-max min-w-full">
            <TabsTrigger value="cover" className="flex flex-col items-center gap-1 px-2 py-3">
              <FileText className="h-4 w-4" />
              <span className="text-xs">表紙</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex flex-col items-center gap-1 px-2 py-3">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">予定</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex flex-col items-center gap-1 px-2 py-3">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs">リスト</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex flex-col items-center gap-1 px-2 py-3">
              <Camera className="h-4 w-4" />
              <span className="text-xs">写真</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex flex-col items-center gap-1 px-2 py-3">
              <FileText className="h-4 w-4" />
              <span className="text-xs">ノート</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex flex-col items-center gap-1 px-2 py-3">
              <Calculator className="h-4 w-4" />
              <span className="text-xs">割勘</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex flex-col items-center gap-1 px-2 py-3">
              <Users className="h-4 w-4" />
              <span className="text-xs">メンバー</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Cover Tab */}
        <TabsContent value="cover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">旅行概要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">目的地</span>
                  <p>京都府</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">期間</span>
                  <p>2泊3日</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">参加者</span>
                  <p>2名</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">予算</span>
                  <p>約8万円</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">宿泊先</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium">京都ホテル東山</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">東山区三十三間堂廻り644-2</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    温泉あり
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    朝食付き
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">主な観光スポット</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["清水寺", "嵐山", "金閣寺", "伏見稲荷大社"].map((spot, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm">{spot}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {i === 0 && "紅葉の名所"}
                        {i === 1 && "竹林と紅葉"}
                        {i === 2 && "黄金の寺院"}
                        {i === 3 && "千本鳥居"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab with Day Navigation */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">スケジュール</h2>
            <Button size="sm">
              <Edit className="h-3 w-3 mr-1" />
              編集
            </Button>
          </div>

          {/* Day Navigation */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <h3 className="font-semibold">{scheduleData[currentDay].title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{scheduleData[currentDay].date}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDay(Math.min(totalDays, currentDay + 1))}
              disabled={currentDay === totalDays}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Indicators */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentDay === day
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Current Day Schedule */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {scheduleData[currentDay].events.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs font-medium">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{event.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs remain the same... */}
        <TabsContent value="checklist" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">チェックリスト</h2>
            <Button size="sm">
              <Edit className="h-3 w-3 mr-1" />
              追加
            </Button>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">持ち物</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["身分証明書", "カメラ", "充電器", "着替え", "常備薬"].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input type="checkbox" id={`item-${i}`} className="rounded" defaultChecked={i === 1} />
                    <label htmlFor={`item-${i}`} className={`text-sm ${i === 1 ? "line-through text-gray-500" : ""}`}>
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">旅行前TODO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["ホテル予約確認", "新幹線チケット購入", "天気予報確認", "現金準備", "旅行保険加入"].map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input type="checkbox" id={`todo-${i}`} className="rounded" defaultChecked={i < 2} />
                    <label htmlFor={`todo-${i}`} className={`text-sm ${i < 2 ? "line-through text-gray-500" : ""}`}>
                      {item}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">写真共有</h2>
            <Button size="sm">
              <Camera className="h-3 w-3 mr-1" />
              追加
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-gray-400" />
                </div>
                <CardContent className="p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">写真 {i}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">ノート</h2>
            <Button size="sm">
              <FileText className="h-3 w-3 mr-1" />
              追加
            </Button>
          </div>

          <div className="space-y-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">おすすめグルメ情報</CardTitle>
                <p className="text-xs text-gray-600 dark:text-gray-400">田中さん - 11月10日</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">祇園の「菊乃井」は予約必須だけど、本当に美味しい京料理が楽しめます。</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">撮影スポット</CardTitle>
                <p className="text-xs text-gray-600 dark:text-gray-400">佐藤さん - 11月12日</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">清水寺の舞台からの眺めは絶景！朝早く行くと人が少なくて写真が撮りやすいです。</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">割り勘管理</h2>
            <Button size="sm">
              <Calculator className="h-3 w-3 mr-1" />
              追加
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">支出一覧</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">新幹線チケット</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">田中さんが支払い</p>
                </div>
                <p className="font-semibold">¥26,000</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm">ホテル代</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">佐藤さんが支払い</p>
                </div>
                <p className="font-semibold">¥32,000</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">精算状況</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">¥58,000</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">総支出額</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>田中さん</span>
                  <span className="text-red-600 font-semibold">-¥3,000</span>
                </div>
                <div className="flex justify-between">
                  <span>佐藤さん</span>
                  <span className="text-green-600 font-semibold">+¥3,000</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                精算完了
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">メンバー管理</h2>
            <Link href="/plan/sample-plan/qr">
              <Button size="sm">
                <Share2 className="h-3 w-3 mr-1" />
                招待
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">参加メンバー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    田
                  </div>
                  <div>
                    <p className="font-medium text-sm">田中さん</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">作成者</p>
                  </div>
                </div>
                <Badge className="text-xs">オーナー</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    佐
                  </div>
                  <div>
                    <p className="font-medium text-sm">佐藤さん</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">11月10日参加</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  メンバー
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
