import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import type { ApiResponse, TripPlan } from '@/types/trip'

export async function GET() {
  try {
    console.log('=== GET /api/plans ===')
    const plans = storage.getAllTripPlans()
    console.log('Total plans found:', plans.length)
    
    return NextResponse.json<ApiResponse<TripPlan[]>>({
      success: true,
      data: plans
    })
  } catch (error) {
    console.error('Error fetching all trip plans:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch trip plans'
    }, { status: 500 })
  }
}