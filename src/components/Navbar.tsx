import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';

export function Navbar() {
  return (
    <header className='sticky top-0 z-50 w-full bg-white shadow'>
      <div className='flex flex-col gap-4 px-4 py-3 max-w-7xl mx-auto text-[#54656f]'>
        <nav className='flex items-center gap-12'>
          <Link to='/hotels' className='flex items-center gap-3'>
            <img
              src='/images/logo_primary.svg'
              alt='Logo'
              className='h-10 w-auto'
            />
            <h1 className='font-semibold text-xl hidden'>Stash Hotels</h1>
          </Link>

          {/* Nav Links */}
          <div className='flex gap-6 text-xl font-medium'>
            {/* <Link
              to="#"
              className="relative inline-block after:content-[''] after:block after:w-full after:h-[2px] after:bg-[#e08923] after:absolute after:bottom-0 after:left-0 after:translate-y-2 after:opacity-0 hover:after:opacity-100 transition-all duration-200"
            >
              Book Now
            </Link> */}
            {/* <Link
              to="#"
              className="relative inline-block after:content-[''] after:block after:w-full after:h-[2px] after:bg-[#e08923] after:absolute after:bottom-0 after:left-0 after:translate-y-2 after:opacity-0 hover:after:opacity-100 transition-all duration-200"
            >
              How It Works
            </Link> */}
            <Link
              to='/hotels'
              className="relative inline-block after:content-[''] after:block after:w-full after:h-[2px] after:bg-[#e08923] after:absolute after:bottom-0 after:left-0 after:translate-y-2 after:opacity-0 hover:after:opacity-100 transition-all duration-200"
            >
              Hotels
            </Link>
            {/* <Link
              to="#"
              className="relative inline-block after:content-[''] after:block after:w-full after:h-[2px] after:bg-[#e08923] after:absolute after:bottom-0 after:left-0 after:translate-y-2 after:opacity-0 hover:after:opacity-100 transition-all duration-200"
            >
              Groups
            </Link> */}
            {/* <Link
              to="#"
              className="relative inline-block after:content-[''] after:block after:w-full after:h-[2px] after:bg-[#e08923] after:absolute after:bottom-0 after:left-0 after:translate-y-2 after:opacity-0 hover:after:opacity-100 transition-all duration-200"
            >
              Deals
            </Link> */}
          </div>
        </nav>

        <div className='w-full'>
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
