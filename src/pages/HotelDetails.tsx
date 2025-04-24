import { useParams } from 'react-router-dom';
import { useHotelStore } from '@/store/useHotelStore';
import { SearchBar } from '@/components/SearchBar';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import { useEffect } from 'react';

export default function HotelDetails() {
  const { id } = useParams();
  const { hotels, loadHotels } = useHotelStore();

  useEffect(() => {
    if (hotels.length === 0) {
      loadHotels();
    }
  }, []);
  if (hotels.length === 0) {
    return <div className='p-4'>Loading hotel data...</div>;
  }

  const hotel = hotels.find((h) => h.id === Number(id));

  if (!hotel) {
    return <div className='p-4'>Hotel not found.</div>;
  }

  return (
    <div className='p-4 space-y-6 max-w-5xl mx-auto'>
      <img
        src={hotel.image}
        alt={hotel.name}
        className='w-full h-64 object-cover rounded'
      />

      <h1 className='text-4xl font-bold'>{hotel.name}</h1>
      <p className='text-xl text-muted-foreground'>A Stash Partner Hotel</p>
      <p className='text-md text-muted-foreground'>
        {`1501 Second Avenue, ${hotel.city}, Washington 98101 | 855.659.3655`}
      </p>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold text-[#e08923]'>Welcome</h2>
        <p>
          {`Indulge in a stay like no other at ${hotel.name}, perfectly situated
          in the heart of downtown ${hotel.city}. Here, the city's vibrant spirit is
          palpable. Step outside your door and find yourself immersed in the
          energy of Pike Place Market and ${hotel.city}'s waterfront. Discover hidden
          gems tailored to your tastes, or simply relax in comfort. At The State
          Hotel, your stay is a genuine immersion in local flavor and
          excitement, all within easy reach.`}
        </p>
        <h2 className='text-2xl font-bold text-[#e08923]'>What it's like</h2>
        <p>
          {`Creativity, tradition, and an adventurous spirit—you'll find all these
          qualities and more at ${hotel.name}. Much like its home city, The
          State pulses with vibrant energy. Originally built in 1904 as a
          medical office building, it was reimagined in the 1930s by ${hotel.city}
          entrepreneur Ben Paris, a man who didn't just sell fishing rods but
          sparked a movement. He launched the city's first salmon derby, helped
          shut down commercial salmon traps in Puget Sound, and championed the
          Pacific Northwest's natural bounty for all to enjoy. Today, that same
          spirit of bold thinking and local pride lives on at this unique and
          eclectic hotel in the heart of downtown ${hotel.city}.`}
        </p>
        <h2 className='text-2xl font-bold text-[#e08923]'>
          Independent spirit
        </h2>
        <p>{`Exceptional location, unparalleled service, distinctly ${hotel.city}.`}</p>
        <h2 className='text-2xl font-bold text-[#e08923]'>Small touches</h2>
        <p>
          {`Each of the 91 guestrooms at The State Hotel is a testament to classic
          style and a showcase of eclectic local art. Your bed is a haven of
          comfort, with triple-sheeted bedding atop a premium mattress. The
          spacious bathroom, complete with a walk-in shower and glass doors, is
          a sanctuary of relaxation. Most rooms offer stunning water or city
          views, with natural light pouring in through large windows. The State
          is a true reflection of ${hotel.city}, offering a unique experience that
          can't be found anywhere else in the world.`}
        </p>
        <h2 className='text-2xl font-bold text-[#e08923]'>Eat and drink</h2>
        <p>
          Nestled on the bustling corner of 2nd and Pike, Ben Paris Restaurant
          is a lively and inviting gathering spot that feels like the home of a
          good friend. It's the perfect place to savor ambitious cocktails and
          handcrafted American fare. Delight in selections from the adventurous
          cocktail menu, paired with a curated selection of wines and craft
          beers. Each dish is thoughtfully crafted and well-rounded. You'll find
          the food and drinks to be both approachable and delightfully
          unexpected, with flavors as distinctive as the ambiance. Whether
          you're dropping in for a quick bite, taking it to go, or relaxing and
          hanging out, the Ben Paris Restaurant offers a warm and welcoming
          experience.
        </p>
        <h2 className='text-2xl font-bold text-[#e08923] mt-8'>
          Rooms & Rates
        </h2>
        <SearchBar />
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
              <p className='text-3xl'>Queen</p>
              <p className='text-xl mt-2'>Suite</p>
            </div>
            <div className='mt-2 border-t-2'>
              <div className='mt-4 flex items-center justify-between'>
                {hotel.has_member_rate ? (
                  <div className='text-md outline-2 p-2 bg-white outline-[#e08923] rounded-xl text-[#54656f] font-semibold'>
                    <span className='line-through text-gray-400 mr-2'>
                      ${hotel.daily_rate.toFixed(2)}
                    </span>
                    <span className='font-semibold text-2xl p-2 bg-white text-[#e08923] rounded-xl'>
                      ${hotel.daily_rate}
                    </span>
                  </div>
                ) : (
                  <div className='text-2xl font-semibold outline-2 p-2 bg-white text-[#e08923] outline-[#e08923] rounded-xl'>
                    {hotel.daily_rate}
                  </div>
                )}
                <div className='text-xl text-white hover:underline outline-2 rounded-xl p-2 bg-[#e08923] font-semibold'>
                  Book
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      </div>
    </div>
  );
}
