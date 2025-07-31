"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Calendar, Users, QrCode, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              みんなで作る
              <br />
              <span className="text-blue-500">素敵な旅行プラン</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
              簡単な質問に答えるだけで、
              <br />
              最適な旅行プランを提案します
            </p>
          </div>

          {/* Main CTA */}
          <div className="mb-8">
            <Link href="/create/step1">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
              >
                <Plus className="mr-3 h-5 w-5" />
                新しいプランを作成
              </Button>
            </Link>
          </div>

          {/* Secondary Action */}
          <Link href="/join">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-6 font-medium border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 rounded-xl transition-all duration-200 bg-transparent"
            >
              <QrCode className="mr-2 h-4 w-4" />
              QRコードで参加
            </Button>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/plans">
              <Card className="group hover:shadow-lg transition-all duration-200 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">作成済みプラン</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">しおりを確認・編集</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">共同編集</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">みんなで一緒に計画</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">最近の活動</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">京都の紅葉を楽しむ旅</span> が更新されました
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">2時間前</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">佐藤さん</span> が参加しました
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">1日前</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
