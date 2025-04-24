import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useHotelStore } from '@/store/useHotelStore'
import { SearchBar } from '@/components/SearchBar'
import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'

export default function DestinationResults() {
  const { city } = useParams()
  const { hotels, loadHotels, loading } = useHotelStore()

  // Pull from localStorage 'search' object
  const search = JSON.parse(localStorage.getItem('search') || '{}')
  const checkin = search.checkin || ''
  const checkout = search.checkout || ''
  const adults = search.adults || ''
  const children = search.children || ''

  const formattedCheckin = checkin ? format(parseISO(checkin), 'LLL dd, yyyy') : 'Not selected'
  const formattedCheckout = checkout ? format(parseISO(checkout), 'LLL dd, yyyy') : 'Not selected'
  const formattedAdults = adults ? `${adults} Adult${adults !== 1 && adults !== '1' ? 's' : ''}` : 'Not specified'
  const formattedChildren = children ? `${children} Child${children !== 1 && children !== '1' ? 'ren' : ''}` : 'Not specified'

  useEffect(() => {
    loadHotels()
  }, [])

  const filteredHotels = useMemo(() => {
    if (!city) return []
    return hotels.filter((hotel) =>
      hotel.city.toLowerCase() === decodeURIComponent(city).toLowerCase()
    )
  }, [hotels, city])

  return (
    <div className="p-4 space-y-4">
      <SearchBar />
      <div>
        <h2 className="text-xl font-bold">Showing results for: {city}</h2>
        <p>Dates: {formattedCheckin} – {formattedCheckout}</p>
        <p>Travelers: {formattedAdults}, {formattedChildren}</p>
      </div>

      {loading ? (
        <p>Loading hotels...</p>
      ) : filteredHotels.length === 0 ? (
        <p>No hotels found in {city}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHotels.map((hotel) => (
            <Link
              key={hotel.id}
              to={`/hotel/${hotel.id}`}
              className="border p-4 rounded shadow block hover:shadow-md transition"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-lg font-bold mt-2">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground">{hotel.city}</p>
              <p className="text-sm mt-1">${hotel.daily_rate.toFixed(2)} / night</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
