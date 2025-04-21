import { create } from 'zustand'
import { fetchHotels } from '../utils/fetchHotels'
type Hotel = {
  id: number
  name: string
  city: string
  daily_rate: number
  image: string
  has_member_rate: boolean
}

type State = {
  hotels: Hotel[]
  loading: boolean
  loadHotels: () => Promise<void>
}

export const useHotelStore = create<State>((set) => ({
  hotels: [],
  loading: false,
  loadHotels: async () => {
    set({ loading: true })
    try {
      const data = await fetchHotels()
      set({ hotels: data })
    } catch (err) {
      console.error(err)
    } finally {
      set({ loading: false })
    }
  }
}))
