import { useEffect } from 'react'
import { useHotelStore } from '../store/useHotelStore'

export default function HotelsIndex() {
  const { hotels, loadHotels, loading } = useHotelStore()

  useEffect(() => {
    loadHotels()
  }, [])

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        hotels.map((hotel) => (
          <div key={hotel.id}>
            <img src={hotel.image} alt={hotel.name} className="w-48" />
            <h2 className="text-lg font-semibold">{hotel.name}</h2>
            <p>{hotel.city}</p>
            <p>${hotel.daily_rate}</p>
          </div>
        ))
      )}
    </div>
  )
}
