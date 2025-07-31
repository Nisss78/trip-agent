"use client"

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { TripPlanInput } from '@/types/trip'

// Initial state
const initialState: TripPlanInput = {
  title: '',
  origin: '',
  destination: '',
  startDate: '',
  endDate: '',
  participants: 2,
  budget: 'medium',
  purpose: '',
  accommodationType: 'undecided',
  accommodationDetails: undefined,
  transportation: {
    preferences: [],
    priority: 'balanced',
    isDecided: false,
    details: undefined
  }
}

// Action types
type TripPlanAction =
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<Pick<TripPlanInput, 'title' | 'origin' | 'destination' | 'startDate' | 'endDate' | 'participants' | 'budget' | 'purpose'>> }
  | { type: 'UPDATE_ACCOMMODATION'; payload: { accommodationType: TripPlanInput['accommodationType']; accommodationDetails?: TripPlanInput['accommodationDetails'] } }
  | { type: 'UPDATE_TRANSPORTATION'; payload: Partial<TripPlanInput['transportation']> }
  | { type: 'LOAD_FROM_STORAGE'; payload: TripPlanInput }
  | { type: 'RESET' }

// Reducer
function tripPlanReducer(state: TripPlanInput, action: TripPlanAction): TripPlanInput {
  switch (action.type) {
    case 'UPDATE_BASIC_INFO':
      return { ...state, ...action.payload }
    
    case 'UPDATE_ACCOMMODATION':
      return {
        ...state,
        accommodationType: action.payload.accommodationType,
        accommodationDetails: action.payload.accommodationDetails
      }
    
    case 'UPDATE_TRANSPORTATION':
      return {
        ...state,
        transportation: { ...state.transportation, ...action.payload }
      }
    
    case 'LOAD_FROM_STORAGE':
      return action.payload
    
    case 'RESET':
      return initialState
    
    default:
      return state
  }
}

// Context type
interface TripPlanContextType {
  state: TripPlanInput
  updateBasicInfo: (info: Partial<Pick<TripPlanInput, 'title' | 'origin' | 'destination' | 'startDate' | 'endDate' | 'participants' | 'budget' | 'purpose'>>) => void
  updateAccommodation: (accommodationType: TripPlanInput['accommodationType'], accommodationDetails?: TripPlanInput['accommodationDetails']) => void
  updateTransportation: (transportation: Partial<TripPlanInput['transportation']>) => void
  resetPlan: () => void
  isStep1Complete: () => boolean
  isStep2Complete: () => boolean
  isStep3Complete: () => boolean
}

// Create context
const TripPlanContext = createContext<TripPlanContextType | undefined>(undefined)

// Local storage key
const STORAGE_KEY = 'trip-plan-draft'

// Provider component
interface TripPlanProviderProps {
  children: React.ReactNode
}

export function TripPlanProvider({ children }: TripPlanProviderProps) {
  const [state, dispatch] = useReducer(tripPlanReducer, initialState)
  const [isClient, setIsClient] = React.useState(false)

  // Set client flag after mount
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load from localStorage on mount (only on client)
  useEffect(() => {
    if (!isClient) return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed })
      }
    } catch (error) {
      console.error('Failed to load trip plan from storage:', error)
    }
  }, [isClient])

  // Save to localStorage whenever state changes (only on client)
  useEffect(() => {
    if (!isClient) return
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save trip plan to storage:', error)
    }
  }, [state, isClient])

  // Action creators
  const updateBasicInfo = (info: Partial<Pick<TripPlanInput, 'title' | 'origin' | 'destination' | 'startDate' | 'endDate' | 'participants' | 'budget' | 'purpose'>>) => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: info })
  }

  const updateAccommodation = (accommodationType: TripPlanInput['accommodationType'], accommodationDetails?: TripPlanInput['accommodationDetails']) => {
    dispatch({ type: 'UPDATE_ACCOMMODATION', payload: { accommodationType, accommodationDetails } })
  }

  const updateTransportation = (transportation: Partial<TripPlanInput['transportation']>) => {
    dispatch({ type: 'UPDATE_TRANSPORTATION', payload: transportation })
  }

  const resetPlan = () => {
    dispatch({ type: 'RESET' })
    if (isClient) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // Validation helpers
  const isStep1Complete = () => {
    return !!(
      state.title &&
      state.origin &&
      state.destination &&
      state.startDate &&
      state.endDate &&
      state.participants > 0 &&
      state.budget &&
      state.purpose
    )
  }

  const isStep2Complete = () => {
    if (state.accommodationType === 'decided') {
      return !!(
        state.accommodationDetails?.name &&
        state.accommodationDetails?.address &&
        state.accommodationDetails?.checkIn &&
        state.accommodationDetails?.checkOut
      )
    }
    return !!state.accommodationType
  }

  const isStep3Complete = () => {
    return state.transportation.preferences.length > 0 || state.transportation.isDecided
  }

  const value: TripPlanContextType = {
    state,
    updateBasicInfo,
    updateAccommodation,
    updateTransportation,
    resetPlan,
    isStep1Complete,
    isStep2Complete,
    isStep3Complete
  }

  return (
    <TripPlanContext.Provider value={value}>
      {children}
    </TripPlanContext.Provider>
  )
}

// Custom hook
export function useTripPlan() {
  const context = useContext(TripPlanContext)
  if (context === undefined) {
    throw new Error('useTripPlan must be used within a TripPlanProvider')
  }
  return context
}