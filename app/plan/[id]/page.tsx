"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Share2,
  Edit,
  Calendar,
  CheckSquare,
  Camera,
  FileText,
  Calculator,
  Users,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Plus,
  X,
  Save,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { TripPlan, ApiResponse } from "@/types/trip"

export default function PlanDetailPage() {
  const params = useParams()
  const [plan, setPlan] = useState<TripPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDay, setCurrentDay] = useState(1)
  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "身分証明書", checked: false, category: "持ち物" },
    { id: 2, text: "カメラ", checked: true, category: "持ち物" },
    { id: 3, text: "充電器", checked: false, category: "持ち物" },
    { id: 4, text: "着替え", checked: false, category: "持ち物" },
    { id: 5, text: "常備薬", checked: false, category: "持ち物" },
  ])
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: "ホテル予約確認", checked: true, category: "旅行前" },
    { id: 2, text: "新幹線チケット購入", checked: true, category: "旅行前" },
    { id: 3, text: "天気予報確認", checked: false, category: "旅行前" },
    { id: 4, text: "現金準備", checked: false, category: "旅行前" },
    { id: 5, text: "旅行保険加入", checked: false, category: "旅行前" },
  ])
  const [newItemText, setNewItemText] = useState("")
  const [isAddingItem, setIsAddingItem] = useState<string | null>(null)
  const [photos, setPhotos] = useState<Array<{id: number, src: string, caption: string, uploadedBy: string, date: string}>>([])
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [notes, setNotes] = useState([
    { id: 1, title: "おすすめグルメ情報", content: "祇園の「菊乃井」は予約必須だけど、本当に美味しい京料理が楽しめます。", author: "田中さん", date: "11月10日に投稿" },
    { id: 2, title: "撮影スポット", content: "清水寺の舞台からの眺めは絶景！朝早く行くと人が少なくて写真が撮りやすいです。", author: "佐藤さん", date: "11月12日に投稿" }
  ])
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })
  const [expenses, setExpenses] = useState([
    { id: 1, title: "新幹線チケット", amount: 26000, paidBy: "田中さん", date: "11月10日" },
    { id: 2, title: "ホテル代", amount: 32000, paidBy: "佐藤さん", date: "11月11日" }
  ])
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [newExpense, setNewExpense] = useState({ title: "", amount: "", paidBy: "あなた" })
  const [members, setMembers] = useState([
    { id: 1, name: "田中さん", role: "オーナー", avatar: "田", joinDate: "プラン作成者", isOwner: true },
    { id: 2, name: "佐藤さん", role: "メンバー", avatar: "佐", joinDate: "11月10日に参加", isOwner: false }
  ])
  const [showInviteLink, setShowInviteLink] = useState(false)

  useEffect(() => {
    fetchPlan()
  }, [params.id])

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/plans/${params.id}`)
      const result: ApiResponse<TripPlan> = await response.json()

      if (result.success && result.data) {
        setPlan(result.data)
      } else {
        setError(result.error || 'プランの取得に失敗しました')
      }
    } catch (err) {
      console.error('Failed to fetch plan:', err)
      setError('プランの読み込み中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const toggleChecklistItem = (id: number, category: string) => {
    if (category === "持ち物") {
      setChecklistItems(items => 
        items.map(item => 
          item.id === id ? {...item, checked: !item.checked} : item
        )
      )
    } else {
      setTodoItems(items => 
        items.map(item => 
          item.id === id ? {...item, checked: !item.checked} : item
        )
      )
    }
  }

  const addNewItem = (category: string) => {
    if (!newItemText.trim()) return
    
    const newId = Math.max(...checklistItems.map(i => i.id), ...todoItems.map(i => i.id)) + 1
    const newItem = { id: newId, text: newItemText.trim(), checked: false, category }
    
    if (category === "持ち物") {
      setChecklistItems(items => [...items, newItem])
    } else {
      setTodoItems(items => [...items, newItem])
    }
    
    setNewItemText("")
    setIsAddingItem(null)
  }

  const deleteItem = (id: number, category: string) => {
    if (category === "持ち物") {
      setChecklistItems(items => items.filter(item => item.id !== id))
    } else {
      setTodoItems(items => items.filter(item => item.id !== id))
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingPhoto(true)
    
    // Create a temporary URL for the uploaded file
    const reader = new FileReader()
    reader.onload = (e) => {
      const newPhoto = {
        id: Date.now(),
        src: e.target?.result as string,
        caption: file.name,
        uploadedBy: "あなた",
        date: new Date().toLocaleDateString('ja-JP')
      }
      setPhotos(prev => [...prev, newPhoto])
      setIsUploadingPhoto(false)
    }
    reader.readAsDataURL(file)
  }

  const deletePhoto = (id: number) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id))
  }

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return
    
    const note = {
      id: Date.now(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      author: "あなた",
      date: new Date().toLocaleDateString('ja-JP') + "に投稿"
    }
    
    setNotes(prev => [note, ...prev])
    setNewNote({ title: "", content: "" })
    setIsAddingNote(false)
  }

  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const addExpense = () => {
    if (!newExpense.title.trim() || !newExpense.amount.trim()) return
    
    const expense = {
      id: Date.now(),
      title: newExpense.title.trim(),
      amount: parseInt(newExpense.amount),
      paidBy: newExpense.paidBy,
      date: new Date().toLocaleDateString('ja-JP')
    }
    
    setExpenses(prev => [expense, ...prev])
    setNewExpense({ title: "", amount: "", paidBy: "あなた" })
    setIsAddingExpense(false)
  }

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getExpensesByPerson = () => {
    const byPerson: Record<string, number> = {}
    expenses.forEach(expense => {
      byPerson[expense.paidBy] = (byPerson[expense.paidBy] || 0) + expense.amount
    })
    return byPerson
  }

  const removeMember = (id: number) => {
    setMembers(prev => prev.filter(member => member.id !== id))
  }

  const generateInviteLink = () => {
    return `${window.location.origin}/plan/${params.id}/join?token=abc123`
  }

  const copyInviteLink = () => {
    const link = generateInviteLink()
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !plan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'プランが見つかりません'}</AlertDescription>
        </Alert>
        <Link href="/plans">
          <Button className="mt-4">
            プラン一覧に戻る
          </Button>
        </Link>
      </div>
    )
  }

  const totalDays = plan.totalDays || plan.days.length
  const currentDayData = plan.days[currentDay - 1]

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">{plan.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(plan.dates.start)} 〜 {formatDate(plan.dates.end)}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href={`/plan/${plan.id}/qr`}>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              QR共有
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            編集
          </Button>
        </div>
      </div>

      {/* Mobile Tabs */}
      <Tabs defaultValue="cover" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="inline-flex h-auto w-auto p-1 bg-muted rounded-lg">
            <TabsTrigger value="cover" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[50px] h-auto">
              <FileText className="h-4 w-4" />
              <span className="text-xs">表紙</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[50px] h-auto">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">予定</span>
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[50px] h-auto">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs">リスト</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[50px] h-auto">
              <Camera className="h-4 w-4" />
              <span className="text-xs">写真</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[50px] h-auto">
              <FileText className="h-4 w-4" />
              <span className="text-xs">ノート</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[50px] h-auto">
              <Calculator className="h-4 w-4" />
              <span className="text-xs">割勘</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex flex-col items-center gap-1 px-2 py-2 min-w-[60px] h-auto">
              <Users className="h-4 w-4" />
              <span className="text-xs">メンバー</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Cover Tab */}
        <TabsContent value="cover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">旅行概要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">目的地</span>
                  <p>{plan.destination}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">期間</span>
                  <p>{plan.totalDays}日間</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">参加者</span>
                  <p>{plan.participants}名</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">予算</span>
                  <p>{plan.budget}</p>
                </div>
              </div>
              {plan.totalEstimatedCost && (
                <div className="pt-3 border-t">
                  <span className="font-medium text-gray-600 dark:text-gray-400">総額見積もり</span>
                  <p className="text-lg font-semibold">¥{plan.totalEstimatedCost.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {plan.accommodation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">宿泊先</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium">{plan.accommodation.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{plan.accommodation.address}</p>
                  {plan.accommodation.amenities && plan.accommodation.amenities.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {plan.accommodation.amenities.map((amenity, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {plan.accommodation.priceRange && (
                    <p className="text-sm font-medium text-blue-600">
                      {plan.accommodation.priceRange}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {plan.recommendedRestaurants && plan.recommendedRestaurants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">おすすめグルメ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.recommendedRestaurants.slice(0, 4).map((restaurant, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{restaurant.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{restaurant.genre}</p>
                        {restaurant.description && (
                          <p className="text-xs text-gray-500 mt-1">{restaurant.description}</p>
                        )}
                        {restaurant.priceRange && (
                          <p className="text-xs font-medium text-blue-600 mt-1">
                            {restaurant.priceRange}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Schedule Tab with Day Navigation */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">スケジュール</h2>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={isEditingSchedule ? "default" : "outline"}
                onClick={() => setIsEditingSchedule(!isEditingSchedule)}
              >
                <Edit className="h-3 w-3 mr-1" />
                {isEditingSchedule ? "完了" : "編集"}
              </Button>
              {isEditingSchedule && (
                <Button size="sm" variant="outline" onClick={() => setEditingEvent({})}>
                  <Plus className="h-3 w-3 mr-1" />
                  追加
                </Button>
              )}
            </div>
          </div>

          {/* Day Navigation */}
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="text-center">
              <h3 className="font-semibold">{currentDayData?.title || `${currentDay}日目`}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentDayData ? formatDate(currentDayData.date) : ''}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDay(Math.min(totalDays, currentDay + 1))}
              disabled={currentDay === totalDays}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Day Indicators */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  currentDay === day
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Current Day Schedule */}
          <Card>
            <CardContent className="p-4 space-y-4">
              {currentDayData && currentDayData.events && currentDayData.events.length > 0 ? (
                currentDayData.events.map((event, i) => (
                  <div key={i} className={`flex gap-3 p-3 rounded-lg ${isEditingSchedule ? 'bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600' : ''}`}>
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs font-medium">{event.time}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{event.description}</p>
                      {event.location && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                      {event.cost && (
                        <p className="text-xs font-medium text-blue-600 mt-1">
                          ¥{event.cost.toLocaleString()}
                        </p>
                      )}
                    </div>
                    {isEditingSchedule && (
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0"
                          onClick={() => setEditingEvent({...event, index: i})}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">このプランにはまだ詳細なスケジュールがありません</p>
                  {isEditingSchedule && (
                    <Button 
                      className="mt-4" 
                      size="sm" 
                      onClick={() => setEditingEvent({})}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      最初のイベントを追加
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Edit Modal/Form */}
          {editingEvent !== null && (
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{editingEvent.index !== undefined ? 'イベント編集' : '新しいイベント追加'}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setEditingEvent(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">時間</label>
                    <input 
                      type="time" 
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      defaultValue={editingEvent.time || "09:00"}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">費用 (円)</label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      defaultValue={editingEvent.cost || ""}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">タイトル</label>
                  <input 
                    type="text" 
                    placeholder="イベント名を入力"
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={editingEvent.title || ""}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">場所</label>
                  <input 
                    type="text" 
                    placeholder="場所を入力"
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={editingEvent.location || ""}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">詳細</label>
                  <textarea 
                    rows={3}
                    placeholder="詳細な説明を入力"
                    className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={editingEvent.description || ""}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    <Save className="h-3 w-3 mr-1" />
                    保存
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingEvent(null)}>
                    キャンセル
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Other tabs remain the same... */}
        <TabsContent value="checklist" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">チェックリスト</h2>
          </div>

          <div className="space-y-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2 text-blue-600" />
                    持ち物チェック
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsAddingItem("持ち物")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <input 
                      type="checkbox" 
                      id={`item-${item.id}`} 
                      className="h-4 w-4 text-blue-600 rounded border-gray-300" 
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id, item.category)}
                    />
                    <label htmlFor={`item-${item.id}`} className={`flex-1 text-sm font-medium ${item.checked ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>
                      {item.text}
                    </label>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => deleteItem(item.id, item.category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {isAddingItem === "持ち物" && (
                  <div className="flex items-center space-x-3 p-2 border-2 border-dashed border-blue-300 rounded-lg">
                    <input 
                      type="text"
                      placeholder="新しい持ち物を入力..."
                      className="flex-1 text-sm bg-transparent border-none outline-none"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewItem("持ち物")}
                      autoFocus
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => addNewItem("持ち物")}
                      className="h-6 w-6 p-0"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsAddingItem(null)
                        setNewItemText("")
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    旅行前TODO
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsAddingItem("旅行前")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {todoItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <input 
                      type="checkbox" 
                      id={`todo-${item.id}`} 
                      className="h-4 w-4 text-green-600 rounded border-gray-300" 
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(item.id, item.category)}
                    />
                    <label htmlFor={`todo-${item.id}`} className={`flex-1 text-sm font-medium ${item.checked ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>
                      {item.text}
                    </label>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => deleteItem(item.id, item.category)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {isAddingItem === "旅行前" && (
                  <div className="flex items-center space-x-3 p-2 border-2 border-dashed border-green-300 rounded-lg">
                    <input 
                      type="text"
                      placeholder="新しいTODOを入力..."
                      className="flex-1 text-sm bg-transparent border-none outline-none"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewItem("旅行前")}
                      autoFocus
                    />
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => addNewItem("旅行前")}
                      className="h-6 w-6 p-0"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsAddingItem(null)
                        setNewItemText("")
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">写真共有</h2>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploadingPhoto}
              />
              <Button size="sm" variant="outline" disabled={isUploadingPhoto}>
                {isUploadingPhoto ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {isUploadingPhoto ? "アップロード中..." : "写真を追加"}
              </Button>
            </div>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {photos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow group">
                  <div className="aspect-square relative">
                    <img 
                      src={photo.src} 
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{photo.caption}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{photo.uploadedBy} • {photo.date}</p>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add Photo Placeholder */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploadingPhoto}
                />
                <Card className="overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    {isUploadingPhoto ? (
                      <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                    ) : (
                      <Plus className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-3 text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {isUploadingPhoto ? "アップロード中..." : "写真を追加"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploadingPhoto}
                />
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  {isUploadingPhoto ? (
                    <Loader2 className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-spin" />
                  ) : (
                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  )}
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {isUploadingPhoto ? "アップロード中..." : "最初の写真を追加"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    旅行の思い出を写真で共有しましょう
                  </p>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">旅行ノート</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsAddingNote(true)}
              disabled={isAddingNote}
            >
              <FileText className="h-4 w-4 mr-2" />
              ノート追加
            </Button>
          </div>

          <div className="space-y-4">
            {isAddingNote && (
              <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>新しいノートを作成</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsAddingNote(false)
                        setNewNote({ title: "", content: "" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">タイトル</label>
                    <input 
                      type="text" 
                      placeholder="ノートのタイトルを入力"
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">内容</label>
                    <textarea 
                      rows={4}
                      placeholder="ノートの内容を入力"
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={addNote}>
                      <Save className="h-3 w-3 mr-1" />
                      ノートを保存
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingNote(false)
                        setNewNote({ title: "", content: "" })
                      }}
                    >
                      キャンセル
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-600" />
                  共有ノート
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">{note.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{note.author}</span>
                          {note.author === "あなた" && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => deleteNote(note.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{note.content}</p>
                      <p className="text-xs text-gray-500">{note.date}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">まだノートがありません</p>
                    <p className="text-xs mt-1">最初のノートを追加してみましょう</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">割り勘管理</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsAddingExpense(true)}
              disabled={isAddingExpense}
            >              <Calculator className="h-4 w-4 mr-2" />
              支出追加
            </Button>
          </div>

          <div className="space-y-4">
            {isAddingExpense && (
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>新しい支出を追加</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsAddingExpense(false)
                        setNewExpense({ title: "", amount: "", paidBy: "あなた" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">支出項目</label>
                    <input 
                      type="text" 
                      placeholder="支出の項目を入力"
                      className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      value={newExpense.title}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">金額 (円)</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">支払者</label>
                      <select 
                        className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, paidBy: e.target.value }))}
                      >
                        <option value="あなた">あなた</option>
                        <option value="田中さん">田中さん</option>
                        <option value="佐藤さん">佐藤さん</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1" onClick={addExpense}>
                      <Save className="h-3 w-3 mr-1" />
                      支出を保存
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsAddingExpense(false)
                        setNewExpense({ title: "", amount: "", paidBy: "あなた" })
                      }}
                    >
                      キャンセル
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <CardTitle className="text-lg flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-emerald-600" />
                  支出一覧
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow group">
                      <div className="flex-1">
                        <p className="font-semibold text-base text-gray-900 dark:text-gray-100">{expense.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{expense.paidBy}が支払い • {expense.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg text-emerald-600">¥{expense.amount.toLocaleString()}</p>
                        {expense.paidBy === "あなた" && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">まだ支出がありません</p>
                    <p className="text-xs mt-1">最初の支出を追加してみましょう</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  精算状況
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">¥{getTotalExpenses().toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">総支出額</p>
                </div>
                <div className="space-y-3">
                  {Object.entries(getExpensesByPerson()).map(([person, amount]) => {
                    const participantCount = Object.keys(getExpensesByPerson()).length
                    const averagePerPerson = getTotalExpenses() / participantCount
                    const balance = amount - averagePerPerson
                    return (
                      <div key={person} className={`flex justify-between items-center p-3 rounded-lg ${balance >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{person}</span>
                        <span className={`font-bold text-lg ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {balance >= 0 ? '+' : ''}¥{Math.round(balance).toLocaleString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <Button className="w-full mt-4" size="sm">
                  精算完了
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">メンバー管理</h2>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowInviteLink(!showInviteLink)}
            >
              <Share2 className="h-4 w-4 mr-2" />
              メンバー招待
            </Button>
          </div>

          <div className="space-y-4">
            {showInviteLink && (
              <Card className="border-2 border-cyan-200 dark:border-cyan-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>招待リンク</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setShowInviteLink(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400">招待URL</label>
                    <div className="flex gap-2 mt-1">
                      <input 
                        type="text" 
                        readOnly
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800"
                        value={generateInviteLink()}
                      />
                      <Button size="sm" onClick={copyInviteLink}>
                        コピー
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    このリンクを共有して、メンバーを旅行プランに招待できます。
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-cyan-600" />
                    参加メンバー ({members.length}名)
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${member.id === 1 ? 'from-blue-500 to-blue-600' : 'from-green-500 to-green-600'} text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg`}>
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-base text-gray-900 dark:text-gray-100">{member.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${member.isOwner ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {member.role}
                      </Badge>
                      {!member.isOwner && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          onClick={() => removeMember(member.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {members.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">まだメンバーがいません</p>
                    <p className="text-xs mt-1">招待リンクを共有してメンバーを追加しましょう</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
                <CardTitle className="text-lg flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-amber-600" />
                  共有設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">プラン公開</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">メンバーがプランを閲覧・編集できます</p>
                  </div>
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">新規参加通知</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">新しいメンバーが参加したら通知します</p>
                  </div>
                  <div className="w-10 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
