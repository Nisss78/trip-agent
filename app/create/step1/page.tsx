"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CreateStep1() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">プラン作成</h1>
            <p className="text-gray-600 dark:text-gray-400">ステップ 1/4: 基本情報</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div className="flex-1 h-2 bg-blue-600 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div className="flex-1 h-2 bg-gray-300 rounded"></div>
            <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>どんな旅をしたいですか？</CardTitle>
            <CardDescription>あなたの希望を教えてください。AIが最適なプランを提案します。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">旅行のタイトル</Label>
              <Input id="title" placeholder="例: 京都の紅葉を楽しむ旅" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">行き先</Label>
              <Input id="destination" placeholder="例: 京都府" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">出発日</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">帰着日</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="members">参加人数</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="人数を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1人</SelectItem>
                  <SelectItem value="2">2人</SelectItem>
                  <SelectItem value="3">3人</SelectItem>
                  <SelectItem value="4">4人</SelectItem>
                  <SelectItem value="5">5人以上</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">予算（一人あたり）</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="予算を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">〜3万円</SelectItem>
                  <SelectItem value="medium">3〜5万円</SelectItem>
                  <SelectItem value="high">5〜10万円</SelectItem>
                  <SelectItem value="luxury">10万円〜</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">旅行の目的・希望</Label>
              <Textarea
                id="purpose"
                placeholder="例: 紅葉を見たい、美味しいものを食べたい、温泉に入りたい など"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Link href="/create/step2">
                <Button>
                  次へ
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
