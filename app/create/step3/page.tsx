"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, Train, Car, Plane, Bus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CreateStep3() {
  const [transportationDecided, setTransportationDecided] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/create/step2">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">プラン作成</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">ステップ 3/4: 交通手段</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              ✓
            </div>
            <div className="flex-1 h-1 bg-green-600 rounded"></div>
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              ✓
            </div>
            <div className="flex-1 h-1 bg-blue-600 rounded"></div>
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
              3
            </div>
            <div className="flex-1 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
              4
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">交通手段の希望はありますか？</CardTitle>
              <CardDescription>移動手段の希望を教えてください。複数選択可能です。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" id="train" className="rounded" />
                  <Label htmlFor="train" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Train className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">電車・新幹線</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">早くて便利</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" id="car" className="rounded" />
                  <Label htmlFor="car" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Car className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">自家用車・レンタカー</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">自由度が高い</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" id="plane" className="rounded" />
                  <Label htmlFor="plane" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Plane className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">飛行機</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">長距離に最適</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <input type="checkbox" id="bus" className="rounded" />
                  <Label htmlFor="bus" className="flex items-center gap-3 cursor-pointer flex-1">
                    <Bus className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">高速バス</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">コスパ重視</div>
                    </div>
                  </Label>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3">優先度を選択</h4>
                <RadioGroup defaultValue="balanced" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fast" id="fast" />
                    <Label htmlFor="fast">早さ重視</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cheap" id="cheap" />
                    <Label htmlFor="cheap">安さ重視</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="comfort" id="comfort" />
                    <Label htmlFor="comfort">快適さ重視</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced">バランス重視</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">交通手段が決まっている</span>
                <input
                  type="checkbox"
                  checked={transportationDecided}
                  onChange={(e) => setTransportationDecided(e.target.checked)}
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>

          {transportationDecided && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">交通手段の詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="outbound">往路の詳細</Label>
                  <Textarea id="outbound" placeholder="例: 11/15 東京駅 9:00発 のぞみ123号 京都駅 11:15着" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="return">復路の詳細</Label>
                  <Textarea id="return" placeholder="例: 11/17 京都駅 16:00発 のぞみ456号 東京駅 18:15着" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="local-transport">現地での移動手段</Label>
                  <Input id="local-transport" placeholder="例: 市バス一日券、レンタカー、徒歩 など" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Link href="/create/step2">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
          </Link>
          <Link href="/create/step4">
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
