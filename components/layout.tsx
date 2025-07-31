"use client"

import type React from "react"

import { MapPin, Home, List, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/plans", label: "しおり一覧", icon: List },
    { href: "/settings", label: "設定", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">旅行プランナー</h1>
            </div>

            {/* User Avatar */}
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Desktop Navigation - Below Header */}
        <div className="hidden md:block bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-1 py-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 font-medium ${
                        isActive
                          ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-24 pb-20 md:pb-4">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="grid grid-cols-3 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                  isActive
                    ? "text-blue-500 scale-105"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "drop-shadow-sm" : ""}`} />
                <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
