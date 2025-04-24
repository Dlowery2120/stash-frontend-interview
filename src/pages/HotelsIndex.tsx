import { useEffect } from 'react';
import { useHotelStore } from '../store/useHotelStore';
import { SearchBar } from '../components/SearchBar';

export default function HotelsIndex() {
  const { hotels, loadHotels, loading } = useHotelStore();

  useEffect(() => {
    loadHotels();
  }, []);

  return (
    <div className='p-4 space-y-6'>
      <div>
        <h1 className='text-2xl font-bold mb-2'>Find Your Stay</h1>
        <SearchBar />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="border p-4 rounded-lg shadow">
              <img src={hotel.image} alt={hotel.name} className="h-40 w-full object-cover rounded" />
              <h2 className='text-lg font-semibold mt-2'>{hotel.name}</h2>
              <p className='text-muted-foreground'>{hotel.city}</p>
              <p className='mt-1'>${hotel.daily_rate.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
