"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, QrCode, Camera } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function JoinPlan() {
  const [step, setStep] = useState<"scan" | "confirm">("scan")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">プランに参加</h1>
            <p className="text-gray-600 dark:text-gray-400">QRコードで旅行プランに参加</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {step === "scan" ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>QRコードを読み取り</CardTitle>
                <CardDescription>カメラでQRコードを読み取って旅行プランに参加しましょう</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    QRコードをカメラに向けてください
                  </p>
                </div>

                <div className="text-center">
                  <Button onClick={() => setStep("confirm")} className="w-full">
                    <QrCode className="h-4 w-4 mr-2" />
                    QRコードを読み取る
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">または</p>
                  <Button variant="outline" className="w-full mt-2 bg-transparent">
                    招待コードを入力
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>参加確認</CardTitle>
                <CardDescription>以下の旅行プランに参加しますか？</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">京都の紅葉を楽しむ旅</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">2024年11月15日 〜 11月17日</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">作成者: 田中さん</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">あなたの名前</Label>
                  <Input id="name" placeholder="例: 佐藤" />
                </div>

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/plan/sample-plan">参加する</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setStep("scan")}>
                    戻る
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
