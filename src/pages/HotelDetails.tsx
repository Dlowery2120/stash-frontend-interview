import { useParams } from 'react-router-dom'
import { useHotelStore } from '@/store/useHotelStore'

export default function HotelDetails() {
  const { id } = useParams()
  const { hotels } = useHotelStore()

  const hotel = hotels.find(h => h.id === Number(id))

  if (!hotel) return <div className="p-4">Hotel not found.</div>

  return (
    <div className="p-4 space-y-4">
      <img
        src={hotel.image}
        alt={hotel.name}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-2xl font-bold">{hotel.name}</h1>
      <p className="text-lg text-muted-foreground">{hotel.city}</p>
      <p className="text-md mt-2">${hotel.daily_rate.toFixed(2)} / night</p>
      <p className="text-sm">
        {hotel.has_member_rate ? 'Stash Member Rate Available' : 'Standard Rate'}
      </p>
    </div>
  )
}
