import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { Layout } from "@/components/layout"
import { TripPlanProvider } from "@/contexts/TripPlanContext"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "旅行プランナー",
  description: "みんなで作る、素敵な旅行プラン",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className} suppressHydrationWarning={true}>
        <TripPlanProvider>
          <Layout>{children}</Layout>
        </TripPlanProvider>
      </body>
    </html>
  )
}
