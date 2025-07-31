import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import type { ApiResponse, TripPlan } from '@/types/trip'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('=== GET /api/plans/[id] ===')
    const { id } = await params
    console.log('Requested plan ID:', id)
    console.log('ID type:', typeof id)
    console.log('ID length:', id.length)
    
    const plan = storage.getTripPlan(id)
    
    if (!plan) {
      console.log('Plan not found, returning 404')
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Trip plan not found'
      }, { status: 404 })
    }

    console.log('Plan found, returning success')
    return NextResponse.json<ApiResponse<TripPlan>>({
      success: true,
      data: plan
    })
  } catch (error) {
    console.error('Error fetching trip plan:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to fetch trip plan'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    const updatedPlan = storage.updateTripPlan(id, updates)
    
    if (!updatedPlan) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Trip plan not found'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<TripPlan>>({
      success: true,
      data: updatedPlan
    })
  } catch (error) {
    console.error('Error updating trip plan:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to update trip plan'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deleted = storage.deleteTripPlan(id)
    
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Trip plan not found'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Trip plan deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting trip plan:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to delete trip plan'
    }, { status: 500 })
  }
}