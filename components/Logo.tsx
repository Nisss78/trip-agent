"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export default function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const [logoError, setLogoError] = useState(false)
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  }
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  }

  return (
    <Link href="/" className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}>
      <div className={`${sizeClasses[size]} relative rounded-lg overflow-hidden bg-blue-500 flex items-center justify-center`}>
        {!logoError ? (
          <Image
            src="/logo.png"
            alt="プランgo ロゴ"
            width={size === "sm" ? 32 : size === "md" ? 40 : 48}
            height={size === "sm" ? 32 : size === "md" ? 40 : 48}
            className="object-cover"
            onError={() => setLogoError(true)}
            priority
          />
        ) : (
          // フォールバック: 画像が見つからない場合
          <span className="text-white font-bold text-sm">
            プ
          </span>
        )}
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 dark:text-white ${textSizeClasses[size]}`}>
          プランgo
        </span>
      )}
    </Link>
  )
}