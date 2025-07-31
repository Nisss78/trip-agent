import { NextRequest, NextResponse } from 'next/server'
import { GeminiClient } from '@/lib/api-clients/gemini'
import { RecruitClient } from '@/lib/api-clients/recruit'
import { RakutenClient } from '@/lib/api-clients/rakuten'
import { storage } from '@/lib/storage'
import type { TripPlanInput, TripPlan, ApiResponse } from '@/types/trip'

export async function POST(request: NextRequest) {
  try {
    const input: TripPlanInput = await request.json()
    
    // Validate required fields
    if (!input.title || !input.origin || !input.destination || !input.startDate || !input.endDate) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Missing required fields: title, origin, destination, startDate, endDate are required'
      }, { status: 400 })
    }

    console.log('Generating trip plan for:', input.title)
    console.log('Input data:', JSON.stringify(input, null, 2))

    // Initialize API clients
    const geminiClient = new GeminiClient()
    const recruitClient = new RecruitClient()
    const rakutenClient = new RakutenClient()

    // Parallel API calls for better performance
    const [restaurants, accommodations] = await Promise.allSettled([
      // Get restaurant recommendations
      recruitClient.getRecommendedRestaurants(
        input.destination,
        input.budget
      ),
      // Get hotel recommendations (only if accommodation is undecided)
      input.accommodationType === 'undecided' 
        ? rakutenClient.getRecommendedHotels(
            input.destination,
            input.startDate,
            input.endDate,
            input.participants,
            input.budget
          )
        : Promise.resolve([])
    ])

    // Extract results from Promise.allSettled
    const restaurantData = restaurants.status === 'fulfilled' ? restaurants.value : []
    const accommodationData = accommodations.status === 'fulfilled' ? accommodations.value : []

    // Log any errors from the API calls
    if (restaurants.status === 'rejected') {
      console.error('Restaurant API error:', restaurants.reason)
    }
    if (accommodations.status === 'rejected') {
      console.error('Accommodation API error:', accommodations.reason)
    }

    console.log(`Found ${restaurantData.length} restaurants and ${accommodationData.length} accommodations`)

    // Generate comprehensive trip plan using Gemini AI
    const tripPlan = await geminiClient.generateTripPlan(
      input,
      restaurantData,
      accommodationData
    )

    // Add accommodation info if available
    if (accommodationData.length > 0 && input.accommodationType === 'undecided') {
      tripPlan.accommodation = accommodationData[0] // Use the best rated hotel
    } else if (input.accommodationDetails) {
      // Use provided accommodation details
      tripPlan.accommodation = {
        name: input.accommodationDetails.name,
        address: input.accommodationDetails.address,
        checkIn: input.accommodationDetails.checkIn,
        checkOut: input.accommodationDetails.checkOut,
        amenities: [],
        priceRange: '予約済み',
        contactInfo: ''
      }
    }

    // Store the plan
    storage.saveTripPlan(tripPlan)
    console.log('Trip plan generated and saved successfully:', tripPlan.id)

    return NextResponse.json<ApiResponse<TripPlan>>({
      success: true,
      data: tripPlan,
      message: 'Trip plan generated successfully'
    })

  } catch (error) {
    console.error('Error generating trip plan:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate trip plan',
      message: 'An error occurred while generating your trip plan. Please try again.'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Trip Plan Generation API',
    status: 'active',
    endpoints: {
      'POST /api/generate-trip-plan': 'Generate a new trip plan'
    }
  })
}