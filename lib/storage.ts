import type { TripPlan } from '@/types/trip'
import fs from 'fs'
import path from 'path'

// グローバル変数でストレージを永続化（開発環境用）
declare global {
  var tripPlansStorage: Map<string, TripPlan> | undefined
}

// グローバル変数が存在しない場合は新しく作成、存在する場合は再利用
const tripPlans = globalThis.tripPlansStorage ?? new Map<string, TripPlan>()

// 開発環境でのホットリロード対応
if (process.env.NODE_ENV !== 'production') {
  globalThis.tripPlansStorage = tripPlans
}

// ファイルベースのバックアップ（開発環境用）
const STORAGE_FILE = path.join(process.cwd(), '.trip-plans-backup.json')

// 起動時にファイルからデータを復元
try {
  if (fs.existsSync(STORAGE_FILE)) {
    const data = fs.readFileSync(STORAGE_FILE, 'utf-8')
    const plans = JSON.parse(data) as Array<[string, TripPlan]>
    plans.forEach(([id, plan]) => tripPlans.set(id, plan))
    console.log('Restored', plans.length, 'plans from backup file')
  }
} catch (error) {
  console.error('Failed to restore from backup file:', error)
}

// 初回起動時にサンプルデータを追加（デモ用）
if (tripPlans.size === 0) {
  const samplePlan: TripPlan = {
    id: 'sample-kyoto-trip',
    title: '京都の紅葉を楽しむ旅',
    destination: '京都府',
    dates: {
      start: '2024-11-15',
      end: '2024-11-17'
    },
    participants: 2,
    budget: '3〜5万円',
    totalDays: 3,
    days: [
      {
        date: '2024-11-15',
        dayNumber: 1,
        title: '1日目',
        events: [
          {
            time: '09:00',
            title: '清水寺',
            description: '京都の代表的な観光地。紅葉の美しい景色を楽しみます。',
            type: 'sightseeing',
            location: '清水寺',
            cost: 400,
            reservationRequired: false
          },
          {
            time: '12:00',
            title: '昼食 - 湯豆腐料理',
            description: '清水寺周辺の老舗で湯豆腐をいただきます。',
            type: 'dining',
            location: '三嶋亭',
            cost: 2500,
            reservationRequired: true
          },
          {
            time: '14:00',
            title: '祇園散策',
            description: '古い街並みを散策し、舞妓さんに出会えるかも。',
            type: 'sightseeing',
            location: '祇園',
            cost: 0,
            reservationRequired: false
          },
          {
            time: '16:00',
            title: '金閣寺',
            description: '夕日に照らされた金閣寺の美しさを堪能。',
            type: 'sightseeing',
            location: '金閣寺',
            cost: 400,
            reservationRequired: false
          }
        ]
      },
      {
        date: '2024-11-16',
        dayNumber: 2,
        title: '2日目',
        events: [
          {
            time: '09:30',
            title: '嵐山竹林',
            description: '幻想的な竹林の小径を歩きます。',
            type: 'sightseeing',
            location: '嵐山',
            cost: 0,
            reservationRequired: false
          },
          {
            time: '11:00',
            title: '天龍寺',
            description: '美しい庭園と紅葉を楽しみます。',
            type: 'sightseeing',
            location: '天龍寺',
            cost: 600,
            reservationRequired: false
          },
          {
            time: '13:00',
            title: '嵐山グルメ散策',
            description: '湯葉料理や抹茶スイーツを楽しみます。',
            type: 'dining',
            location: '嵐山商店街',
            cost: 1500,
            reservationRequired: false
          },
          {
            time: '15:30',
            title: '伏見稲荷大社',
            description: '千本鳥居で有名な神社を参拝します。',
            type: 'sightseeing',
            location: '伏見稲荷大社',
            cost: 0,
            reservationRequired: false
          }
        ]
      },
      {
        date: '2024-11-17',
        dayNumber: 3,
        title: '3日目',
        events: [
          {
            time: '10:00',
            title: '二条城',
            description: '徳川家の歴史を感じる美しい城と庭園。',
            type: 'sightseeing',
            location: '二条城',
            cost: 800,
            reservationRequired: false
          },
          {
            time: '12:30',
            title: '京都駅でお土産購入',
            description: '帰路につく前に京都の名産品をお土産に。',
            type: 'activity',
            location: '京都駅',
            cost: 3000,
            reservationRequired: false
          },
          {
            time: '14:00',
            title: '帰路',
            description: '新幹線で帰路につきます。',
            type: 'transport',
            location: '京都駅',
            cost: 13000,
            reservationRequired: true
          }
        ]
      }
    ],
    accommodation: {
      name: 'ホテル京都ガーデンパレス',
      address: '京都市上京区下立売通新町西入薮ノ内町',
      checkIn: '15:00',
      checkOut: '10:00',
      amenities: ['WiFi', '朝食付き', '大浴場'],
      rating: 4.2,
      priceRange: '8,000〜12,000円',
      contactInfo: '075-431-8111'
    },
    recommendedRestaurants: [
      {
        name: '菊乃井',
        genre: '懐石料理',
        address: '京都市東山区下河原通八坂鳥居前下ル下河原町',
        rating: 4.8,
        priceRange: '15,000〜25,000円',
        description: '京都を代表する老舗料亭。ミシュラン三つ星の絶品懐石料理。',
        openHours: '12:00-14:30, 17:30-21:00',
        contactInfo: '075-561-0015'
      },
      {
        name: '豆腐料理 奥丹',
        genre: '豆腐料理',
        address: '京都市東山区清水3-340',
        rating: 4.1,
        priceRange: '2,000〜3,500円',
        description: '創業370年の歴史を持つ湯豆腐専門店。',
        openHours: '11:00-16:30',
        contactInfo: '075-525-2051'
      }
    ],
    totalEstimatedCost: 45000,
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z'
  }
  
  tripPlans.set(samplePlan.id, samplePlan)
  console.log('Sample plan added for demo purposes')
  saveToFile()
}

console.log('Storage initialized. Existing plans:', tripPlans.size)
console.log('Global storage exists:', !!globalThis.tripPlansStorage)

// ファイルにバックアップを保存する関数
function saveToFile() {
  try {
    const data = Array.from(tripPlans.entries())
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2))
    console.log('Backup saved to file with', data.length, 'plans')
  } catch (error) {
    console.error('Failed to save backup file:', error)
  }
}

export const storage = {
  saveTripPlan(plan: TripPlan): void {
    console.log('Saving trip plan with ID:', plan.id)
    console.log('Plan keys:', Object.keys(plan))
    tripPlans.set(plan.id, plan)
    console.log('Total plans in storage:', tripPlans.size)
    console.log('All plan IDs:', Array.from(tripPlans.keys()))
    
    // ファイルにバックアップ
    saveToFile()
  },

  getTripPlan(id: string): TripPlan | undefined {
    console.log('Getting trip plan with ID:', id)
    console.log('Available plan IDs:', Array.from(tripPlans.keys()))
    console.log('Plan exists:', tripPlans.has(id))
    const plan = tripPlans.get(id)
    console.log('Retrieved plan:', plan ? 'Found' : 'Not found')
    return plan
  },

  getAllTripPlans(): TripPlan[] {
    console.log('Getting all trip plans, count:', tripPlans.size)
    return Array.from(tripPlans.values())
  },

  deleteTripPlan(id: string): boolean {
    console.log('Deleting trip plan with ID:', id)
    const result = tripPlans.delete(id)
    console.log('Deletion result:', result)
    
    // ファイルにバックアップ
    if (result) {
      saveToFile()
    }
    
    return result
  },

  updateTripPlan(id: string, updates: Partial<TripPlan>): TripPlan | undefined {
    console.log('Updating trip plan with ID:', id)
    const existing = tripPlans.get(id)
    if (!existing) {
      console.log('Plan not found for update')
      return undefined
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    tripPlans.set(id, updated)
    console.log('Plan updated successfully')
    
    // ファイルにバックアップ
    saveToFile()
    
    return updated
  }
}