"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Hotel, Home, MapPin } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateStep2() {
  const [accommodationType, setAccommodationType] = useState("undecided")
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/create/step1">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">プラン作成</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">ステップ 2/4: 宿泊先</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              ✓
            </div>
            <div className="flex-1 h-1 bg-green-600 rounded"></div>
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <div className="flex-1 h-1 bg-blue-600 rounded"></div>
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
              3
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
              4
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">宿泊先はお決まりですか？</CardTitle>
            <CardDescription>宿泊先の状況を教えてください。未定の場合はAIが提案します。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={accommodationType} onValueChange={setAccommodationType} className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="undecided" id="undecided" />
                <Label htmlFor="undecided" className="flex items-center gap-3 cursor-pointer flex-1">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">未定（AIに提案してもらう）</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      予算や希望に合わせて最適な宿泊先を提案します
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="decided" id="decided" />
                <Label htmlFor="decided" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Hotel className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">決定済み</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      既に宿泊先を予約済み、または決定している
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="daytrip" id="daytrip" />
                <Label htmlFor="daytrip" className="flex items-center gap-3 cursor-pointer flex-1">
                  <Home className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">日帰り旅行</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">宿泊せずに日帰りで楽しむ旅行</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {accommodationType === "decided" && (
              <Card className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Hotel className="h-4 w-4" />
                    宿泊先の詳細
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hotel-name">宿泊先名</Label>
                    <Input id="hotel-name" placeholder="例: 京都ホテル東山" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotel-address">住所</Label>
                    <Input id="hotel-address" placeholder="例: 京都府京都市東山区..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check-in">チェックイン日時</Label>
                    <Input id="check-in" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check-out">チェックアウト日時</Label>
                    <Input id="check-out" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hotel-notes">備考・特記事項</Label>
                    <Textarea id="hotel-notes" placeholder="例: 温泉付き、朝食付きプラン、駐車場あり など" rows={3} />
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/create/step1">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </Link>
          <Link href="/create/step3">
            <Button>
              次へ
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
