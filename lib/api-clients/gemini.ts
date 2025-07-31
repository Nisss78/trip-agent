import { GoogleGenerativeAI } from '@google/generative-ai'
import type { TripPlanInput, TripPlan, RestaurantInfo, AccommodationInfo } from '@/types/trip'

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export class GeminiClient {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  async generateTripPlan(
    input: TripPlanInput,
    restaurants: RestaurantInfo[] = [],
    accommodations: AccommodationInfo[] = []
  ): Promise<TripPlan> {
    const prompt = this.buildTripPlanPrompt(input, restaurants, accommodations)
    
    try {
      console.log('Calling Gemini API with prompt length:', prompt.length)
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      console.log('Gemini API response received, length:', text.length)
      
      // Parse the structured response
      const planData = this.parseGeneratedPlan(text, input)
      return planData
    } catch (error) {
      console.error('Gemini API error details:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      throw new Error(`Failed to generate trip plan with AI: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async suggestTransportation(
    origin: string,
    destination: string,
    preferences: string[],
    priority: string,
    budget: string
  ): Promise<string[]> {
    const prompt = `
    ${origin}から${destination}への交通手段を提案してください。

    希望交通手段: ${preferences.join(', ')}
    優先度: ${priority}
    予算レベル: ${budget}

    以下の条件で最適な交通手段を3つまで提案し、それぞれの特徴（所要時間、費用、快適さ）を含めて説明してください。
    日本語で回答してください。
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return text.split('\n').filter(line => line.trim().length > 0)
    } catch (error) {
      console.error('Transportation suggestion error:', error)
      throw new Error('Failed to suggest transportation')
    }
  }

  private buildTripPlanPrompt(
    input: TripPlanInput,
    restaurants: RestaurantInfo[],
    accommodations: AccommodationInfo[]
  ): string {
    const days = this.calculateDays(input.startDate, input.endDate)
    
    let prompt = `
    以下の条件で${days}日間の旅行プランを作成してください：

    【基本情報】
    - タイトル: ${input.title}
    - 出発地: ${input.origin}
    - 目的地: ${input.destination}
    - 出発日: ${input.startDate}
    - 帰着日: ${input.endDate}
    - 参加人数: ${input.participants}人
    - 予算: ${this.getBudgetDescription(input.budget)}
    - 旅行の目的: ${input.purpose}

    【宿泊】
    - 宿泊タイプ: ${this.getAccommodationDescription(input.accommodationType)}
    ${input.accommodationDetails ? `
    - 宿泊先: ${input.accommodationDetails.name}
    - 住所: ${input.accommodationDetails.address}
    ` : ''}

    【交通手段】
    - 希望する交通手段: ${input.transportation.preferences.join(', ')}
    - 優先度: ${input.transportation.priority}
    `

    if (restaurants.length > 0) {
      prompt += `\n【おすすめグルメ情報】\n`
      restaurants.forEach(restaurant => {
        prompt += `- ${restaurant.name}: ${restaurant.description} (${restaurant.genre})\n`
      })
    }

    if (accommodations.length > 0) {
      prompt += `\n【宿泊施設候補】\n`
      accommodations.forEach(accommodation => {
        prompt += `- ${accommodation.name}: ${accommodation.address} (${accommodation.priceRange})\n`
      })
    }

    prompt += `
    
    重要: 以下の形式で完全に有効なJSONのみ出力してください。説明文やコメントは一切含めず、JSONオブジェクトのみを返してください。

    {
      "days": [
        {
          "date": "YYYY-MM-DD",
          "dayNumber": 1,
          "title": "1日目",
          "events": [
            {
              "time": "09:00",
              "title": "イベント名",
              "description": "詳細説明",
              "type": "sightseeing",
              "location": "場所",
              "cost": 1000,
              "reservationRequired": false
            }
          ]
        }
      ],
      "recommendedRestaurants": [
        {
          "name": "レストラン名",
          "genre": "ジャンル", 
          "description": "説明",
          "priceRange": "価格帯"
        }
      ],
      "totalEstimatedCost": 50000
    }

    注意事項:
    - 文字列は必ずダブルクォートで囲む
    - 数値は数値のみ（クォートなし）
    - 真偽値はtrue/false（文字列ではない）
    - 末尾にカンマを付けない
    - 日本語で自然な旅行プランを作成
    - 時間配分を現実的にする
    - JSONのみ出力し、他の文章は一切含めない
    `

    return prompt
  }

  private parseGeneratedPlan(text: string, input: TripPlanInput): TripPlan {
    try {
      console.log('=== Original Gemini Response ===')
      console.log(text.substring(0, 1000))
      console.log('================================')
      
      // Clean the text and extract JSON more robustly
      let jsonText = this.extractAndCleanJSON(text)
      
      if (!jsonText) {
        console.error('No valid JSON found in response:', text.substring(0, 500))
        throw new Error('No valid JSON found in response')
      }

      console.log('=== Extracted JSON Text ===')
      console.log(jsonText.substring(0, 500))
      console.log('===========================')

      // Try multiple parsing attempts with different fixes
      let parsed = null
      const attempts = [
        () => JSON.parse(jsonText),
        () => JSON.parse(this.fixCommonJSONIssues(jsonText)),
        () => JSON.parse(this.aggressiveJSONFix(jsonText)),
        () => this.tryManualJSONParse(jsonText)
      ]

      for (let i = 0; i < attempts.length; i++) {
        try {
          console.log(`Attempting JSON parse method ${i + 1}...`)
          parsed = attempts[i]()
          console.log(`Success with method ${i + 1}`)
          break
        } catch (parseError) {
          console.log(`Method ${i + 1} failed:`, parseError instanceof Error ? parseError.message : parseError)
          if (i === attempts.length - 1) {
            throw parseError
          }
        }
      }

      if (!parsed) {
        throw new Error('All JSON parsing attempts failed')
      }
      
      return {
        id: this.generateId(),
        title: input.title,
        destination: input.destination,
        dates: {
          start: input.startDate,
          end: input.endDate
        },
        participants: input.participants,
        budget: this.getBudgetDescription(input.budget),
        totalDays: this.calculateDays(input.startDate, input.endDate),
        days: parsed.days || [],
        recommendedRestaurants: parsed.recommendedRestaurants || [],
        totalEstimatedCost: parsed.totalEstimatedCost,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to parse generated plan:', error)
      if (error instanceof SyntaxError) {
        console.error('JSON Syntax Error at:', error.message)
        // Log the problematic character position
        const jsonText = this.extractAndCleanJSON(text)
        if (jsonText) {
          console.error('Problematic JSON around position 65:')
          console.error(jsonText.substring(Math.max(0, 65-20), 65+20))
          console.error('                    ^')
        }
      }
      // Return a fallback plan
      return this.createFallbackPlan(input)
    }
  }

  private extractAndCleanJSON(text: string): string | null {
    try {
      let jsonText = ''
      
      // Method 1: Try to extract from markdown code blocks with more precise pattern
      const codeBlockPatterns = [
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/i,
        /```(?:json)?\n(\{[\s\S]*?\})\n```/i,
        /```(\{[\s\S]*?\})```/i
      ]
      
      for (const pattern of codeBlockPatterns) {
        const match = text.match(pattern)
        if (match && match[1]) {
          console.log('Found markdown code block with pattern:', pattern.toString())
          jsonText = match[1].trim()
          console.log('Raw extracted JSON (first 200 chars):', jsonText.substring(0, 200))
          break
        }
      }
      
      // Method 2: If no code block found, search for raw JSON
      if (!jsonText) {
        console.log('No markdown code block found, searching for raw JSON...')
        const startIndex = text.indexOf('{')
        if (startIndex === -1) return null
        
        let braceCount = 0
        let endIndex = -1
        
        for (let i = startIndex; i < text.length; i++) {
          if (text[i] === '{') braceCount++
          if (text[i] === '}') braceCount--
          if (braceCount === 0) {
            endIndex = i
            break
          }
        }
        
        if (endIndex === -1) return null
        jsonText = text.substring(startIndex, endIndex + 1)
      }
      
      // Clean up common JSON issues
      jsonText = this.fixCommonJSONIssues(jsonText)
      
      console.log('Final cleaned JSON (first 200 chars):', jsonText.substring(0, 200))
      return jsonText
    } catch (error) {
      console.error('Error extracting JSON:', error)
      return null
    }
  }

  private fixCommonJSONIssues(jsonText: string): string {
    console.log('Starting JSON fixes...')
    let fixed = jsonText
    
    // Remove any control characters first
    fixed = fixed.replace(/[\x00-\x1F\x7F]/g, '')
    
    // Fix trailing commas (most common issue)
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1')
    
    // Fix single quotes to double quotes for property names (but be careful not to break content)
    fixed = fixed.replace(/([{,]\s*)'([^']+)'(\s*:)/g, '$1"$2"$3')
    
    // Fix undefined values
    fixed = fixed.replace(/:\s*undefined/g, ': null')
    
    // Fix missing quotes around unquoted property names
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    
    // Fix missing commas between object properties (be very careful here) 
    fixed = fixed.replace(/"\s*\n\s*"/g, '",\n"')
    fixed = fixed.replace(/}\s*\n\s*"/g, '},\n"')
    fixed = fixed.replace(/]\s*\n\s*"/g, '],\n"')
    
    // Clean up any double commas that might have been introduced
    fixed = fixed.replace(/,,+/g, ',')
    
    // Final trailing comma cleanup
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1')
    
    console.log('JSON fixes completed. Changes made:', fixed !== jsonText)
    return fixed
  }

  private aggressiveJSONFix(jsonText: string): string {
    // More aggressive JSON fixing
    let fixed = jsonText
    
    // Remove any text before first { and after last }
    const start = fixed.indexOf('{')
    const end = fixed.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      fixed = fixed.substring(start, end + 1)
    }
    
    // Fix common Japanese text issues in JSON strings
    fixed = fixed.replace(/"/g, '"').replace(/"/g, '"')
    fixed = fixed.replace(/'/g, "'").replace(/'/g, "'")
    
    // Fix missing quotes around strings that look like property values
    fixed = fixed.replace(/:\s*([^",{}\[\]]+)\s*([,}])/g, (match, value, ending) => {
      // Don't quote numbers, booleans, or null
      if (/^(true|false|null|\d+(\.\d+)?)$/i.test(value.trim())) {
        return `: ${value.trim()}${ending}`
      }
      return `: "${value.trim()}"${ending}`
    })
    
    // Fix object property names without quotes
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    
    return fixed
  }

  private tryManualJSONParse(jsonText: string): any {
    // Last resort: try to construct a basic object manually
    console.log('Attempting manual JSON construction...')
    
    // Extract basic structure
    const result: any = {
      days: [],
      recommendedRestaurants: [],
      totalEstimatedCost: 50000
    }
    
    // Try to extract days array
    const daysMatch = jsonText.match(/"days"\s*:\s*\[([\s\S]*?)\]/i)
    if (daysMatch) {
      try {
        // Basic day structure
        result.days = [{
          date: new Date().toISOString().split('T')[0],
          dayNumber: 1,
          title: "1日目",
          events: [{
            time: "09:00",
            title: "観光開始",
            description: "AIプラン生成中にエラーが発生しました",
            type: "activity"
          }]
        }]
      } catch (e) {
        console.log('Failed to parse days:', e)
      }
    }
    
    return result
  }

  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  private getBudgetDescription(budget: string): string {
    switch (budget) {
      case 'low': return '〜3万円'
      case 'medium': return '3〜5万円'
      case 'high': return '5〜10万円'
      case 'luxury': return '10万円〜'
      default: return '予算未設定'
    }
  }

  private getAccommodationDescription(type: string): string {
    switch (type) {
      case 'undecided': return '未定（AI提案）'
      case 'decided': return '決定済み'
      case 'daytrip': return '日帰り'
      default: return '未設定'
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  private createFallbackPlan(input: TripPlanInput): TripPlan {
    const days = this.calculateDays(input.startDate, input.endDate)
    
    return {
      id: this.generateId(),
      title: input.title,
      destination: input.destination,
      dates: {
        start: input.startDate,
        end: input.endDate
      },
      participants: input.participants,
      budget: this.getBudgetDescription(input.budget),
      totalDays: days,
      days: Array.from({ length: days }, (_, i) => ({
        date: new Date(new Date(input.startDate).getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dayNumber: i + 1,
        title: `${i + 1}日目`,
        events: [
          {
            time: '09:00',
            title: 'プラン生成中',
            description: 'AIによるプラン生成でエラーが発生しました。手動で編集してください。',
            type: 'activity' as const
          }
        ]
      })),
      recommendedRestaurants: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}