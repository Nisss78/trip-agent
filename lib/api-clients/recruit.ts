import type { RestaurantInfo } from '@/types/trip'

interface HotpepperResponse {
  results: {
    shop: Array<{
      id: string
      name: string
      genre: {
        name: string
      }
      address: string
      catch: string
      open: string
      budget: {
        name: string
        average: string
      }
      urls: {
        pc: string
      }
      photo: {
        pc: {
          l: string
        }
      }
    }>
    results_available: number
    results_returned: number
  }
}

export class RecruitClient {
  private readonly baseUrl = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/'
  private readonly apiKey = process.env.RECRUIT_HOTPEPPER_API_KEY

  constructor() {
    if (!this.apiKey) {
      console.warn('RECRUIT_HOTPEPPER_API_KEY is not set in environment variables')
    }
  }

  async searchRestaurants(
    location: string,
    genre?: string,
    budget?: string,
    count: number = 10
  ): Promise<RestaurantInfo[]> {
    if (!this.apiKey) {
      console.error('Recruit API key is not set')
      return []
    }

    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        keyword: location,
        count: count.toString(),
        format: 'json'
      })

      if (genre) {
        params.append('genre', this.getGenreCode(genre))
      }

      if (budget) {
        params.append('budget', this.getBudgetCode(budget))
      }

      const url = `${this.baseUrl}?${params.toString()}`
      console.log('Calling Recruit API:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Recruit API response error:', errorText)
        throw new Error(`Recruit API error: ${response.status} - ${errorText}`)
      }

      const data: HotpepperResponse = await response.json()
      
      return this.transformToRestaurantInfo(data.results.shop)
    } catch (error) {
      console.error('Recruit API error:', error)
      return []
    }
  }

  async searchByArea(
    areaCode: string,
    genre?: string,
    budget?: string,
    count: number = 10
  ): Promise<RestaurantInfo[]> {
    try {
      const paramsObj: Record<string, string> = {
        key: this.apiKey || '',
        large_area: areaCode,
        count: count.toString(),
        format: 'json'
      }
      const params = new URLSearchParams(paramsObj)

      if (genre) {
        params.append('genre', this.getGenreCode(genre))
      }

      if (budget) {
        params.append('budget', this.getBudgetCode(budget))
      }

      const url = `${this.baseUrl}?${params.toString()}`
      console.log('Calling Recruit API:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Recruit API response error:', errorText)
        throw new Error(`Recruit API error: ${response.status} - ${errorText}`)
      }

      const data: HotpepperResponse = await response.json()
      
      return this.transformToRestaurantInfo(data.results.shop)
    } catch (error) {
      console.error('Recruit API error:', error)
      return []
    }
  }

  async getRecommendedRestaurants(destination: string, budget: string): Promise<RestaurantInfo[]> {
    const areaCode = this.getAreaCode(destination)
    
    // Get diverse restaurant types
    const genres = ['居酒屋', '和食', '洋食・欧風料理', 'イタリアン・フレンチ', 'ラーメン']
    const allRestaurants: RestaurantInfo[] = []

    for (const genre of genres) {
      const restaurants = await this.searchByArea(areaCode, genre, budget, 3)
      allRestaurants.push(...restaurants)
    }

    // Remove duplicates and limit results
    const uniqueRestaurants = allRestaurants.filter((restaurant, index, self) =>
      index === self.findIndex(r => r.name === restaurant.name)
    )

    return uniqueRestaurants.slice(0, 15)
  }

  private transformToRestaurantInfo(shops: any[]): RestaurantInfo[] {
    return shops.map(shop => ({
      name: shop.name,
      genre: shop.genre?.name || '不明',
      address: shop.address,
      description: shop.catch || '詳細情報なし',
      priceRange: shop.budget?.average || '価格不明',
      openHours: shop.open || '営業時間不明',
      reservationUrl: shop.urls?.pc || '',
      contactInfo: ''
    }))
  }

  private getGenreCode(genre: string): string {
    const genreMap: Record<string, string> = {
      '居酒屋': 'G001',
      'ダイニングバー': 'G002',
      '創作料理': 'G003',
      '和食': 'G004',
      '洋食・欧風料理': 'G005',
      'イタリアン・フレンチ': 'G006',
      '中華': 'G007',
      '焼肉・ホルモン': 'G008',
      'アジア・エスニック料理': 'G009',
      'ラーメン': 'G013',
      'お好み焼き・もんじゃ': 'G016',
      'カフェ・スイーツ': 'G014'
    }
    
    return genreMap[genre] || 'G004' // デフォルトは和食
  }

  private getBudgetCode(budget: string): string {
    const budgetMap: Record<string, string> = {
      '低': 'B009', // 〜1500円
      '中': 'B010', // 1501〜2000円
      '高': 'B011', // 2001〜3000円
      '最高': 'B012' // 3001〜4000円
    }
    
    return budgetMap[budget] || 'B010' // デフォルトは中予算
  }

  private getAreaCode(destination: string): string {
    // 主要都市のエリアコード
    const areaMap: Record<string, string> = {
      '東京': 'Z011',
      '神奈川': 'Z012',
      '千葉': 'Z013',
      '埼玉': 'Z014',
      '大阪': 'Z021',
      '兵庫': 'Z022',
      '京都': 'Z023',
      '奈良': 'Z024',
      '愛知': 'Z031',
      '岐阜': 'Z032',
      '三重': 'Z033',
      '静岡': 'Z034',
      '北海道': 'Z041',
      '福岡': 'Z092',
      '広島': 'Z081',
      '宮城': 'Z051'
    }

    // 部分マッチで検索
    for (const [key, value] of Object.entries(areaMap)) {
      if (destination.includes(key)) {
        return value
      }
    }
    
    return 'Z011' // デフォルトは東京
  }
}