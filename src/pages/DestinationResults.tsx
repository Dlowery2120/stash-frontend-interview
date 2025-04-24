import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHotelStore } from '@/store/useHotelStore';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
export default function DestinationResults() {
  const { city } = useParams();
  const { hotels, loadHotels, loading } = useHotelStore();

  useEffect(() => {
    loadHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    if (!city) return [];
    return hotels.filter(
      (hotel) =>
        hotel.city.toLowerCase() === decodeURIComponent(city).toLowerCase()
    );
  }, [hotels, city]);

  return (
    <div className='w-full p-4 space-y-6'>
      <h2 className='text-[42px] mb-0 text-[#e08923]'>
        The Best Independent Hotels
      </h2>
      <p className='text-[24px] text-muted-foreground'>
        Earn the most points at the best independent hotels
      </p>

      {loading ? (
        <p>Loading hotels...</p>
      ) : filteredHotels.length === 0 ? (
        <p>No hotels found in {city}.</p>
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {filteredHotels.map((hotel) => {
            const price = hotel.has_member_rate
              ? (hotel.daily_rate * 0.9).toFixed(2)
              : hotel.daily_rate.toFixed(2);

            return (
              <div
                key={hotel.id}
                className='relative border rounded-xl shadow flex flex-col sm:flex-row hover:shadow-md transition bg-[#54656f] text-white'
              >
                <div className='relative w-full md:w-[500px] h-[325px] overflow-hidden rounded group'>
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-75'
                  />

                  <button className='absolute top-1/2 left-2 transform -translate-y-1/2 text-[#e08923] rounded-full z-10'>
                    <ArrowBigLeft />
                  </button>
                  <button className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 p-2 rounded-full text-[#e08923] z-10'>
                    <ArrowBigRight />
                  </button>

                  {/* Member rate badge */}
                  {hotel.has_member_rate && (
                    <img
                      src='/images/member-rate-badge-small.png'
                      alt='Member Rate Badge'
                      className='absolute top-2 right-2 w-16 h-16 z-10'
                    />
                  )}
                </div>

                <div className='flex flex-col justify-between flex-1'>
                  <div className='p-4'>
                    <h3 className='text-[38px] font-bold leading-10'>
                      {hotel.name}
                    </h3>
                    <p className='text-3xl'>{hotel.city}</p>
                    <p className='text-xl mt-2'>
                      <span className='text-[#e08923]'>
                        {(Math.random() * (5.0 - 3.5) + 3.5).toFixed(1)}
                      </span>{' '}
                      ({Math.floor(Math.random() * (999 - 50 + 1)) + 50} reviews
                      ) |{' '}
                      <span className='text-[#e08923]'>
                        {(Math.random() * 10).toFixed(1)}
                      </span>{' '}
                      mi from destination
                    </p>
                  </div>
                  <div className='mt-2 border-t-2'>
                    <div className='flex items-center justify-between px-4 py-4'>
                      {hotel.has_member_rate ? (
                        <div className='text-md outline-2 p-2 bg-white outline-[#e08923] rounded-xl text-[#54656f] font-semibold'>
                          <span className='line-through text-gray-400 mr-2'>
                            ${hotel.daily_rate.toFixed(2)}
                          </span>
                          <span className='text-[#e08923] font-semibold text-2xl'>
                            ${price}
                          </span>
                        </div>
                      ) : (
                        <div className='text-2xl font-semibold  outline-2 p-2 bg-white text-[#e08923] outline-[#e08923] rounded-xl'>
                          ${price}
                        </div>
                      )}
                      <Link
                        to={`/hotel/${hotel.id}`}
                        className='text-xl text-white hover:underline outline-2 rounded-xl p-2 bg-[#e08923] font-semibold'
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
