import { create } from 'zustand'
import { fetchHotels } from '../utils/fetchHotels'

export type Hotel = {
  id: number
  name: string
  city: string
  daily_rate: number
  image: string
  has_member_rate: boolean
}

export type Destination = {
  city: string
}

type State = {
  hotels: Hotel[]
  destinations: string[]
  loading: boolean
  query: string
  setQuery: (q: string) => void
  loadHotels: () => Promise<void>
}

export const useHotelStore = create<State>((set) => ({
  hotels: [],
  destinations: [],
  loading: false,
  query: '',
  setQuery: (q) => set({ query: q }),
  loadHotels: async () => {
    set({ loading: true })
    try {
      const data = await fetchHotels() as Hotel[] 
      const cities = Array.from(new Set(data.map((h: Hotel) => h.city)))
      set({ hotels: data, destinations: cities })
    } catch (err) {
      console.error(err)
    } finally {
      set({ loading: false })
    }
  }  
}))
