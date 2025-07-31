"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateStep4() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // 3秒後にプラン詳細画面に遷移
    setTimeout(() => {
      window.location.href = "/plan/sample-plan"
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/create/step3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">プラン作成</h1>
            <p className="text-gray-600 dark:text-gray-400">ステップ 4/4: 確認・生成</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <div className="flex-1 h-2 bg-green-600 rounded"></div>
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <div className="flex-1 h-2 bg-blue-600 rounded"></div>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>入力内容の確認</CardTitle>
              <CardDescription>以下の内容でAIがプランを生成します。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">タイトル:</span>
                  <p>京都の紅葉を楽しむ旅</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">行き先:</span>
                  <p>京都府</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">日程:</span>
                  <p>2024年11月15日 〜 11月17日</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">人数:</span>
                  <p>2人</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">予算:</span>
                  <p>3〜5万円（一人あたり）</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">宿泊:</span>
                  <p>AIに提案してもらう</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">希望:</span>
                <p>紅葉を見たい、美味しいものを食べたい、温泉に入りたい</p>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Card>
            <CardContent className="pt-6">
              {!isGenerating ? (
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">準備完了！</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      AIがあなたの希望に合わせて最適な旅行プランを生成します。
                    </p>
                  </div>
                  <Button size="lg" onClick={handleGenerate} className="w-full">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AIプランを生成する
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">プラン生成中...</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      最適な宿泊先、交通手段、観光スポットを検索しています。
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {!isGenerating && (
            <div className="flex justify-start">
              <Link href="/create/step3">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  戻る
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
