import type { AccommodationInfo } from '@/types/trip'

interface RakutenHotelResponse {
  hotels: Array<{
    hotel: Array<{
      hotelBasicInfo: {
        hotelNo: number
        hotelName: string
        hotelInformationUrl: string
        planListUrl: string
        dpPlanListUrl: string
        reviewUrl: string
        hotelKanaName: string
        hotelSpecial: string
        hotelMinCharge: number
        latitude: number
        longitude: number
        postalCode: string
        address1: string
        address2: string
        telephoneNo: string
        faxNo: string
        access: string
        parkingInformation: string
        nearestStation: string
        hotelImageUrl: string
        hotelThumbnailUrl: string
        roomImageUrl: string
        roomThumbnailUrl: string
        hotelMapImageUrl: string
        reviewCount: number
        reviewAverage: number
        userReview: string
      }
    }>
  }>
  pageCount: number
}

interface RakutenHotelChainResponse {
  hotelChains: Array<{
    hotelChainInfo: {
      hotelChainId: string
      hotelChainName: string
    }
  }>
}

export class RakutenClient {
  private readonly baseUrl = 'https://app.rakuten.co.jp/services/api/Travel'
  private readonly applicationId = process.env.RAKUTEN_APPLICATION_ID

  constructor() {
    if (!this.applicationId) {
      console.warn('RAKUTEN_APPLICATION_ID is not set in environment variables')
    }
  }

  async searchHotels(
    checkinDate: string,
    checkoutDate: string,
    adultNum: number = 2,
    destination: string = '東京'
  ): Promise<AccommodationInfo[]> {
    if (!this.applicationId) {
      console.error('Rakuten API application ID is not set')
      return []
    }

    try {
      // 楽天APIは日付をYYYYMMDD形式で要求
      const formattedCheckinDate = checkinDate.replace(/-/g, '')
      const formattedCheckoutDate = checkoutDate.replace(/-/g, '')
      const coordinates = this.getCoordinates(destination)
      
      const params = new URLSearchParams({
        applicationId: this.applicationId,
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
        searchRadius: '3',
        datumType: '1',
        checkinDate: formattedCheckinDate,
        checkoutDate: formattedCheckoutDate,
        adultNum: adultNum.toString(),
        hits: '10',
        page: '1',
        format: 'json'
      })

      const url = `${this.baseUrl}/SimpleHotelSearch/20170426?${params.toString()}`
      console.log('Calling Rakuten API:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Rakuten API response error:', errorText)
        throw new Error(`Rakuten API error: ${response.status} - ${errorText}`)
      }

      const data: RakutenHotelResponse = await response.json()
      
      return this.transformToAccommodationInfo(data.hotels)
    } catch (error) {
      console.error('Rakuten Hotel Search API error:', error)
      return []
    }
  }

  async searchHotelsByLocation(
    destination: string,
    checkinDate: string,
    checkoutDate: string,
    adultNum: number = 2,
    budget?: string
  ): Promise<AccommodationInfo[]> {
    const coordinates = this.getCoordinates(destination)
    
    try {
      // 楽天APIは日付をYYYYMMDD形式で要求
      const formattedCheckinDate = checkinDate.replace(/-/g, '')
      const formattedCheckoutDate = checkoutDate.replace(/-/g, '')
      
      const paramsObj: Record<string, string> = {
        applicationId: this.applicationId || '',
        latitude: coordinates.latitude.toString(),
        longitude: coordinates.longitude.toString(),
        searchRadius: '3', // 3km圏内
        datumType: '1', // 日本測地系
        checkinDate: formattedCheckinDate,
        checkoutDate: formattedCheckoutDate,
        adultNum: adultNum.toString(),
        hits: '20',
        page: '1',
        sort: '+roomCharge', // 料金順
        format: 'json'
      }
      const params = new URLSearchParams(paramsObj)

      // 予算による絞り込み
      if (budget) {
        const priceRange = this.getBudgetRange(budget)
        if (priceRange.min) params.append('minCharge', priceRange.min.toString())
        if (priceRange.max) params.append('maxCharge', priceRange.max.toString())
      }

      const url = `${this.baseUrl}/SimpleHotelSearch/20170426?${params.toString()}`
      console.log('Calling Rakuten API:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Rakuten API response error:', errorText)
        throw new Error(`Rakuten API error: ${response.status} - ${errorText}`)
      }

      const data: RakutenHotelResponse = await response.json()
      
      return this.transformToAccommodationInfo(data.hotels)
    } catch (error) {
      console.error('Rakuten Hotel Search by Location API error:', error)
      return []
    }
  }

  async getHotelChains(): Promise<Array<{ id: string; name: string }>> {
    try {
      const paramsObj: Record<string, string> = {
        applicationId: this.applicationId || '',
        format: 'json'
      }
      const params = new URLSearchParams(paramsObj)

      const url = `${this.baseUrl}/GetHotelChainList/20131024?${params.toString()}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Rakuten Hotel Chain API error: ${response.status}`)
      }

      const data: RakutenHotelChainResponse = await response.json()
      
      return data.hotelChains.map(chain => ({
        id: chain.hotelChainInfo.hotelChainId,
        name: chain.hotelChainInfo.hotelChainName
      }))
    } catch (error) {
      console.error('Rakuten Hotel Chain API error:', error)
      return []
    }
  }

  async getRecommendedHotels(
    destination: string,
    checkinDate: string,
    checkoutDate: string,
    participants: number,
    budget: string
  ): Promise<AccommodationInfo[]> {
    const hotels = await this.searchHotelsByLocation(
      destination,
      checkinDate,
      checkoutDate,
      participants,
      budget
    )

    // 評価が高く、価格帯が適切なホテルを優先
    return hotels
      .filter(hotel => hotel.rating && hotel.rating >= 3.5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
  }

  private transformToAccommodationInfo(hotels: any[]): AccommodationInfo[] {
    return hotels.map(hotelData => {
      const hotel = hotelData.hotel[0].hotelBasicInfo
      
      return {
        name: hotel.hotelName,
        address: `${hotel.address1}${hotel.address2}`,
        checkIn: '15:00', // デフォルト値
        checkOut: '10:00', // デフォルト値
        amenities: this.extractAmenities(hotel.hotelSpecial),
        rating: hotel.reviewAverage ? parseFloat(hotel.reviewAverage.toFixed(1)) : undefined,
        priceRange: this.formatPriceRange(hotel.hotelMinCharge),
        bookingUrl: hotel.planListUrl,
        contactInfo: hotel.telephoneNo
      }
    })
  }

  private extractAmenities(hotelSpecial: string): string[] {
    const amenities: string[] = []
    
    if (hotelSpecial.includes('温泉')) amenities.push('温泉')
    if (hotelSpecial.includes('朝食')) amenities.push('朝食付き')
    if (hotelSpecial.includes('夕食')) amenities.push('夕食付き')
    if (hotelSpecial.includes('駐車場')) amenities.push('駐車場')
    if (hotelSpecial.includes('WiFi') || hotelSpecial.includes('無線LAN')) amenities.push('WiFi')
    if (hotelSpecial.includes('大浴場')) amenities.push('大浴場')
    if (hotelSpecial.includes('露天風呂')) amenities.push('露天風呂')
    
    return amenities
  }

  private formatPriceRange(minCharge: number): string {
    if (minCharge < 5000) return '〜5,000円'
    if (minCharge < 10000) return '5,000〜10,000円'
    if (minCharge < 15000) return '10,000〜15,000円'
    if (minCharge < 20000) return '15,000〜20,000円'
    return '20,000円〜'
  }

  private getBudgetRange(budget: string): { min?: number; max?: number } {
    switch (budget) {
      case 'low':
        return { max: 8000 }
      case 'medium':
        return { min: 8000, max: 15000 }
      case 'high':
        return { min: 15000, max: 30000 }
      case 'luxury':
        return { min: 30000 }
      default:
        return {}
    }
  }

  private getCoordinates(destination: string): { latitude: number; longitude: number } {
    // 主要都市の座標
    const coordinatesMap: Record<string, { latitude: number; longitude: number }> = {
      '北海道': { latitude: 43.0642, longitude: 141.3469 },
      '札幌': { latitude: 43.0642, longitude: 141.3469 },
      '仙台': { latitude: 38.2682, longitude: 140.8694 },
      '東京': { latitude: 35.6762, longitude: 139.6503 },
      '横浜': { latitude: 35.4437, longitude: 139.6380 },
      '名古屋': { latitude: 35.1815, longitude: 136.9066 },
      '京都': { latitude: 35.0116, longitude: 135.7681 },
      '大阪': { latitude: 34.6937, longitude: 135.5023 },
      '神戸': { latitude: 34.6901, longitude: 135.1956 },
      '奈良': { latitude: 34.6851, longitude: 135.8048 },
      '広島': { latitude: 34.3853, longitude: 132.4553 },
      '福岡': { latitude: 33.5904, longitude: 130.4017 },
      '那覇': { latitude: 26.2124, longitude: 127.6792 }
    }

    // 部分マッチで検索
    for (const [key, value] of Object.entries(coordinatesMap)) {
      if (destination.includes(key)) {
        return value
      }
    }
    
    // デフォルトは東京
    return { latitude: 35.6762, longitude: 139.6503 }
  }

  private getAreaCode(destination: string): { large: string; middle: string } {
    // 楽天トラベルの正しいエリアコード（公式API仕様に基づく）
    const areaMap: Record<string, { large: string; middle: string }> = {
      '北海道': { large: 'hokkaido', middle: 'sapporo' },
      '青森': { large: 'aomori', middle: 'aomori' },
      '岩手': { large: 'iwate', middle: 'morioka' },
      '宮城': { large: 'miyagi', middle: 'sendai' },
      '秋田': { large: 'akita', middle: 'akita' },
      '山形': { large: 'yamagata', middle: 'yamagata' },
      '福島': { large: 'fukushima', middle: 'fukushima' },
      '茨城': { large: 'ibaraki', middle: 'mito' },
      '栃木': { large: 'tochigi', middle: 'utsunomiya' },
      '群馬': { large: 'gunma', middle: 'maebashi' },
      '埼玉': { large: 'saitama', middle: 'saitama' },
      '千葉': { large: 'chiba', middle: 'chiba' },
      '東京': { large: 'tokyo', middle: 'tokyo' },
      '神奈川': { large: 'kanagawa', middle: 'yokohama' },
      '新潟': { large: 'niigata', middle: 'niigata' },
      '富山': { large: 'toyama', middle: 'toyama' },
      '石川': { large: 'ishikawa', middle: 'kanazawa' },
      '福井': { large: 'fukui', middle: 'fukui' },
      '山梨': { large: 'yamanashi', middle: 'kofu' },
      '長野': { large: 'nagano', middle: 'nagano' },
      '岐阜': { large: 'gifu', middle: 'gifu' },
      '静岡': { large: 'shizuoka', middle: 'shizuoka' },
      '愛知': { large: 'aichi', middle: 'nagoya' },
      '三重': { large: 'mie', middle: 'tsu' },
      '滋賀': { large: 'shiga', middle: 'otsu' },
      '京都': { large: 'kyoto', middle: 'kyoto' },
      '大阪': { large: 'osaka', middle: 'osaka' },
      '兵庫': { large: 'hyogo', middle: 'kobe' },
      '奈良': { large: 'nara', middle: 'nara' },
      '和歌山': { large: 'wakayama', middle: 'wakayama' },
      '鳥取': { large: 'tottori', middle: 'tottori' },
      '島根': { large: 'shimane', middle: 'matsue' },
      '岡山': { large: 'okayama', middle: 'okayama' },
      '広島': { large: 'hiroshima', middle: 'hiroshima' },
      '山口': { large: 'yamaguchi', middle: 'yamaguchi' },
      '徳島': { large: 'tokushima', middle: 'tokushima' },
      '香川': { large: 'kagawa', middle: 'takamatsu' },
      '愛媛': { large: 'ehime', middle: 'matsuyama' },
      '高知': { large: 'kochi', middle: 'kochi' },
      '福岡': { large: 'fukuoka', middle: 'fukuoka' },
      '佐賀': { large: 'saga', middle: 'saga' },
      '長崎': { large: 'nagasaki', middle: 'nagasaki' },
      '熊本': { large: 'kumamoto', middle: 'kumamoto' },
      '大分': { large: 'oita', middle: 'oita' },
      '宮崎': { large: 'miyazaki', middle: 'miyazaki' },
      '鹿児島': { large: 'kagoshima', middle: 'kagoshima' },
      '沖縄': { large: 'okinawa', middle: 'naha' }
    }

    // 部分マッチで検索
    for (const [key, value] of Object.entries(areaMap)) {
      if (destination.includes(key)) {
        return value
      }
    }
    
    return { large: '130000', middle: '130100' } // デフォルトは東京
  }
}