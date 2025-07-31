export interface TripPlanInput {
  title: string
  origin: string // 出発地
  destination: string
  startDate: string
  endDate: string
  participants: number
  budget: 'low' | 'medium' | 'high' | 'luxury'
  purpose: string
  accommodationType: 'undecided' | 'decided' | 'daytrip'
  accommodationDetails?: {
    name: string
    address: string
    checkIn: string
    checkOut: string
    notes: string
  }
  transportation: {
    preferences: string[]
    priority: 'fast' | 'cheap' | 'comfort' | 'balanced'
    isDecided: boolean
    details?: {
      outbound: string
      return: string
      localTransport: string
    }
  }
}

export interface ScheduleEvent {
  time: string
  title: string
  description: string
  type: 'transport' | 'accommodation' | 'sightseeing' | 'dining' | 'activity'
  location?: string
  cost?: number
  reservationRequired?: boolean
  contactInfo?: string
  mapUrl?: string
}

export interface DaySchedule {
  date: string
  dayNumber: number
  title?: string
  events: ScheduleEvent[]
}

export interface AccommodationInfo {
  name: string
  address: string
  checkIn: string
  checkOut: string
  amenities: string[]
  rating?: number
  priceRange: string
  bookingUrl?: string
  contactInfo?: string
}

export interface RestaurantInfo {
  name: string
  genre: string
  address: string
  rating?: number
  priceRange: string
  description: string
  openHours?: string
  reservationUrl?: string
  contactInfo?: string
}

export interface TripPlan {
  id: string
  title: string
  destination: string
  dates: {
    start: string
    end: string
  }
  participants: number
  budget: string
  totalDays: number
  days: DaySchedule[]
  accommodation?: AccommodationInfo
  recommendedRestaurants: RestaurantInfo[]
  totalEstimatedCost?: number
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}