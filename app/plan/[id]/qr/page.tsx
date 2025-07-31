"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Copy, Share2, QrCode } from "lucide-react"
import Link from "next/link"

export default function QRInvite() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/plan/sample-plan">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              しおりに戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">メンバー招待</h1>
            <p className="text-gray-600 dark:text-gray-400">QRコードで簡単に招待</p>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* QR Code */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle>QRコード</CardTitle>
              <CardDescription>このQRコードを読み取ってもらうことで、旅行プランに参加できます</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
                <QrCode className="h-32 w-32 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">京都の紅葉を楽しむ旅</p>
            </CardContent>
          </Card>

          {/* Share Options */}
          <Card>
            <CardHeader>
              <CardTitle>共有方法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                リンクをコピー
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                SNSで共有
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>参加方法</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>1. QRコードを読み取る</p>
              <p>2. 参加確認画面で名前を入力</p>
              <p>3. 「参加する」ボタンをタップ</p>
              <p>4. しおりが共有されます</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
