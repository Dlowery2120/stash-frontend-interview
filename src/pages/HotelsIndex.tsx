import { useEffect } from 'react';
import { useHotelStore } from '../store/useHotelStore';
import { Link } from 'react-router-dom';

export default function HotelsIndex() {
  const { hotels, loadHotels, loading } = useHotelStore();

  useEffect(() => {
    if (hotels.length === 0) {
      loadHotels();
    }
  }, [hotels, loadHotels]);

  // Deduplicate hotel names per city
  const hotelsByCity = hotels.reduce<Record<string, Set<string>>>(
    (acc, hotel) => {
      if (!acc[hotel.city]) acc[hotel.city] = new Set();
      acc[hotel.city].add(hotel.name);
      return acc;
    },
    {}
  );

  const sortedCityEntries = Object.entries(hotelsByCity).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div className='p-4 space-y-6'>
      <div className='flex'>
        <div className='flex flex-col'>
          <h2 className='text-[42px] mb-0 text-[#e08923]'>
            The best hotels are independent hotels.
          </h2>
          <h3 className='text-[24px] text-muted-foreground'>
            That's not hyperbole. It's a fact.
          </h3>
          <div className='text-[18px]'>
            <p>
              It's why you love them. It's why we stand up for them. It's why
              travel magazines rave about them. And it's why the big chains are
              going to great lengths to mimic them.
            </p>
            <p>
              At Stash, we're obsessed with the real-deal: Grade-A, free-range,
              certified-independent hotels.
            </p>
            <p>
              So that's what our loyalty program delivers. (You really can taste
              the difference.)
            </p>
          </div>
        </div>
        <img
          src='/images/certified-independent-hotel-logo-2019-grey_c.png'
          alt='Certified Independent Hotel'
          className='mt-6 w-64 self-center'
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className='grid grid-cols-3 space-y-2'>
          {sortedCityEntries.map(([city, hotelSet]) => (
            <div key={city}>
              <Link
                to={`/travel/destination/${encodeURIComponent(city)}`}
                className='text-lg font-bold text-[#e08923] hover:underline underline-offset-4'
              >
                {city}
              </Link>
              <ul className='ml-4 mt-1 space-y-1 list-none'>
                {[...hotelSet].sort().map((name) => {
                  const hotel = hotels.find(
                    (h) => h.name === name && h.city === city
                  );
                  return (
                    <li key={name}>
                      <Link
                        to={hotel ? `/hotel/${hotel.id}` : '#'}
                        className='hover:underline underline-offset-2 text-sm'
                      >
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
