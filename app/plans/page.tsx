"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { TripPlan, ApiResponse } from "@/types/trip"

export default function PlansPage() {
  const [plans, setPlans] = useState<TripPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      const result: ApiResponse<TripPlan[]> = await response.json()

      if (result.success && result.data) {
        // 完成したプランのみを表示（days配列が存在し、空でないもの）
        const completedPlans = result.data.filter(plan => 
          plan.days && plan.days.length > 0 && 
          plan.days.some(day => day.events && day.events.length > 0)
        )
        
        // 作成日時の新しい順でソート
        completedPlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        
        setPlans(completedPlans)
      } else {
        setError(result.error || 'プランの取得に失敗しました')
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err)
      setError('プランの読み込み中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { 
      month: 'numeric', 
      day: 'numeric'
    })
  }
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Plans Grid */}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Add New Plan Card - 最初に配置 */}
          <Link href="/create/step1">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
                <Plus className="h-8 w-8 mb-2" />
                <p className="font-medium text-sm">新しいプランを作成</p>
                <p className="text-xs text-center">AIが最適なプランを提案します</p>
              </CardContent>
            </Card>
          </Link>

          {/* Actual Plans */}
          {plans.map((plan) => (
            <Link key={plan.id} href={`/plan/${plan.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base line-clamp-2">{plan.title}</CardTitle>
                    <div className="flex gap-1">
                      {plan.id === 'sample-kyoto-trip' && (
                        <Badge variant="secondary" className="text-xs">サンプル</Badge>
                      )}
                      <Badge className="text-xs">完了</Badge>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3" />
                    {formatDate(plan.dates.start)} 〜 {formatDate(plan.dates.end)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {plan.destination}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-3 w-3" />
                    {plan.participants}名参加
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {plan.totalDays}日間 • {plan.budget}
                  </div>
                  {plan.totalEstimatedCost && (
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      総額 ¥{plan.totalEstimatedCost.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Empty State */}
          {plans.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                まだプランがありません
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                初めての旅行プランを作成してみましょう
              </p>
              <Link href="/create/step1">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  プランを作成
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
