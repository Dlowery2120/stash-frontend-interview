import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHotelStore } from '@/store/useHotelStore';
import { SearchBar } from '@/components/SearchBar';
import { format, parseISO } from 'date-fns';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
export default function DestinationResults() {
  const { city } = useParams();
  const { hotels, loadHotels, loading } = useHotelStore();

  const search = JSON.parse(localStorage.getItem('search') || '{}');
  const checkin = search.checkin || '';
  const checkout = search.checkout || '';
  const adults = search.adults || '';
  const children = search.children || '';

  const formattedCheckin = checkin
    ? format(parseISO(checkin), 'LLL dd, yyyy')
    : 'Not selected';
  const formattedCheckout = checkout
    ? format(parseISO(checkout), 'LLL dd, yyyy')
    : 'Not selected';
  const formattedAdults = adults
    ? `${adults} Adult${adults !== 1 && adults !== '1' ? 's' : ''}`
    : 'No Adults';
  const formattedChildren = children
    ? `${children} Child${children !== 1 && children !== '1' ? 'ren' : ''}`
    : 'No children';

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
      {/* <div>
        <h2 className='text-xl font-bold'>Showing results for: {city}</h2>
        <p>
          Dates: {formattedCheckin} – {formattedCheckout}
        </p>
        <p>
          Travelers: {formattedAdults}, {formattedChildren}
        </p>
      </div> */}
      <h2 className='text-[42px] mb-0 text-[#e08923]'>The Best Independent Hotels</h2>
      <p className='text-[24px] text-muted-foreground'>Earn the most points at the best independent hotels</p>

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
                className='relative border rounded-xl shadow flex gap-4 hover:shadow-md transition bg-[#54656f] text-white'
              >
                <div className='relative w-[500px] h-[325px] overflow-hidden rounded group'>
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

                <div className='flex flex-col justify-between flex-1 p-4'>
                  <div>
                    <h3 className='text-[40px] font-bold'>{hotel.name}</h3>
                    <p className='text-3xl'>{hotel.city}</p>
                    <p className='text-xl mt-2'>
                      3.8 (1,885 reviews) | 0.1 mi from destination
                    </p>
                  </div>
                  <div className='mt-2 border-t-2'>
                    <div className='mt-4 flex items-center justify-between'>
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
                        <div className='text-2xl font-semibold'>
                          ${price} / night
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
