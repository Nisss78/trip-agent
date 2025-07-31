"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Moon, Globe, Bell, Shield, HelpCircle } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="text-gray-600 dark:text-gray-400">アプリの設定を変更</p>
      </div>

      <div className="space-y-4">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-4 w-4" />
              プロフィール
            </CardTitle>
            <CardDescription>あなたの基本情報を設定します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">表示名</Label>
              <Input id="name" placeholder="例: 田中太郎" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス（任意）</Label>
              <Input id="email" type="email" placeholder="例: tanaka@example.com" />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="h-4 w-4" />
              外観
            </CardTitle>
            <CardDescription>アプリの見た目を設定します</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>ダークモード</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">暗いテーマを使用します</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-4 w-4" />
              通知
            </CardTitle>
            <CardDescription>通知の設定を変更します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>プラン更新通知</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">プランが更新された時に通知</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>新メンバー参加通知</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">新しいメンバーが参加した時に通知</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>リマインダー</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">旅行前日にリマインダーを送信</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-4 w-4" />
              プライバシー
            </CardTitle>
            <CardDescription>プライバシーとセキュリティの設定</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>データ保存</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">ローカルにデータを保存</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              データをエクスポート
            </Button>
            <Button variant="destructive" className="w-full" size="sm">
              全データを削除
            </Button>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-4 w-4" />
              ヘルプ・サポート
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              よくある質問
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              利用規約
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              プライバシーポリシー
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
              お問い合わせ
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="pt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>旅行AIエージェント v1.0.0</p>
            <p>© 2024 Travel AI Agent</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
