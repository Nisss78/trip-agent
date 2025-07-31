"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users, MapPin } from "lucide-react"
import Link from "next/link"

export default function PlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">しおり一覧</h1>
          <p className="text-gray-600 dark:text-gray-400">作成済みの旅行プラン</p>
        </div>
        <Link href="/create/step1">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        </Link>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample Plan 1 */}
        <Link href="/plan/sample-plan">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base">京都の紅葉を楽しむ旅</CardTitle>
                <Badge className="text-xs">進行中</Badge>
              </div>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3" />
                11月15日 〜 11月17日
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-3 w-3" />
                京都府
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="h-3 w-3" />
                2名参加
              </div>
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  田
                </div>
                <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  佐
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Sample Plan 2 */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">沖縄リゾート旅行</CardTitle>
              <Badge variant="secondary" className="text-xs">
                計画中
              </Badge>
            </div>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3" />
              12月20日 〜 12月23日
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-3 w-3" />
              沖縄県
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="h-3 w-3" />
              4名参加
            </div>
            <div className="flex gap-1">
              {["山", "鈴", "高", "中"].map((name, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 text-white rounded-full flex items-center justify-center text-xs font-semibold ${
                    ["bg-purple-600", "bg-orange-600", "bg-pink-600", "bg-indigo-600"][i]
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add New Plan Card */}
        <Link href="/create/step1">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              <Plus className="h-8 w-8 mb-2" />
              <p className="font-medium text-sm">新しいプランを作成</p>
              <p className="text-xs text-center">AIが最適なプランを提案します</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
