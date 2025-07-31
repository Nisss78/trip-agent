"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useState } from "react"
import { useTripPlan } from "@/contexts/TripPlanContext"
import type { TripPlan, ApiResponse } from "@/types/trip"

export default function CreateStep4() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { state, isStep1Complete, isStep2Complete, isStep3Complete } = useTripPlan()

  const canGenerate = isStep1Complete() && isStep2Complete() && isStep3Complete()

  const handleGenerate = async () => {
    if (!canGenerate) {
      setError('すべてのステップを完了してください')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-trip-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      })

      const result: ApiResponse<TripPlan> = await response.json()

      if (result.success && result.data) {
        // 生成されたプランのページに遷移
        window.location.href = `/plan/${result.data.id}`
      } else {
        setError(result.error || 'プランの生成に失敗しました')
      }
    } catch (err) {
      console.error('API Error:', err)
      setError('サーバーエラーが発生しました。しばらく待ってからもう一度お試しください。')
    } finally {
      setIsGenerating(false)
    }
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
                  <p>{state.title || '未設定'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">行き先:</span>
                  <p>{state.destination || '未設定'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">日程:</span>
                  <p>{state.startDate && state.endDate ? `${state.startDate} 〜 ${state.endDate}` : '未設定'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">人数:</span>
                  <p>{state.participants}人</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">予算:</span>
                  <p>{
                    state.budget === 'low' ? '〜3万円' :
                    state.budget === 'medium' ? '3〜5万円' :
                    state.budget === 'high' ? '5〜10万円' :
                    state.budget === 'luxury' ? '10万円〜' : '未設定'
                  }（一人あたり）</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">宿泊:</span>
                  <p>{
                    state.accommodationType === 'undecided' ? 'AIに提案してもらう' :
                    state.accommodationType === 'decided' ? '決定済み' :
                    state.accommodationType === 'daytrip' ? '日帰り' : '未設定'
                  }</p>
                </div>
              </div>
              {state.purpose && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">希望:</span>
                  <p>{state.purpose}</p>
                </div>
              )}
              {state.transportation.preferences.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">交通手段:</span>
                  <p>{state.transportation.preferences.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <Card>
            <CardContent className="pt-6">
              {!isGenerating ? (
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {canGenerate ? '準備完了！' : '入力を完了してください'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {canGenerate 
                        ? 'AIがあなたの希望に合わせて最適な旅行プランを生成します。'
                        : '前のステップに戻って、必要な情報をすべて入力してください。'
                      }
                    </p>
                  </div>
                  <Button 
                    size="lg" 
                    onClick={handleGenerate} 
                    className="w-full"
                    disabled={!canGenerate}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    AIプランを生成する
                  </Button>
                  
                  {/* Progress indicator */}
                  <div className="flex justify-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${isStep1Complete() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Step1 {isStep1Complete() ? '✓' : '○'}
                    </span>
                    <span className={`px-2 py-1 rounded ${isStep2Complete() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Step2 {isStep2Complete() ? '✓' : '○'}
                    </span>
                    <span className={`px-2 py-1 rounded ${isStep3Complete() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      Step3 {isStep3Complete() ? '✓' : '○'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">プラン生成中...</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      最適な宿泊先、交通手段、観光スポット、グルメ情報を検索しています。<br />
                      しばらくお待ちください...
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
