import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, Check, ChevronsUpDown, Users } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useHotelStore } from '@/store/useHotelStore';

export function SearchBar() {
  const navigate = useNavigate();
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const API_KEY = import.meta.env.VITE_MAPSCO_API_KEY;

  const { hotels } = useHotelStore();
  const [open, setOpen] = React.useState(false);
  const [locating, setLocating] = React.useState(false);

  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
    type: 'hotel' | 'city' | 'location';
  } | null>(null);

  const destinations = Array.from(new Set(hotels.map((h) => h.city)));

  const hotelOptions = hotels.map((h) => ({
    value: h.name,
    label: `${h.name}, ${h.city}`,
    type: 'hotel' as const,
  }));

  const cityOptions = destinations.map((city) => ({
    value: city,
    label: city,
    type: 'city' as const,
  }));

  const locationOption = {
    value: 'current-location',
    label: 'Use Current Location',
    type: 'location' as const,
  };

  const allOptions = [locationOption, ...hotelOptions, ...cityOptions];

  const handleSearch = async () => {
    if (!selectedOption || !date?.from || !date?.to) return;

    let city =
      selectedOption.type === 'hotel'
        ? selectedOption.label.split(', ').pop() ?? ''
        : selectedOption.value;

    let searchValue = selectedOption.value;

    if (selectedOption.type === 'location') {
      try {
        setLocating(true);
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            if (!navigator.geolocation) {
              console.warn('Geolocation not supported by this browser');
              alert('Geolocation is not supported on this device');
              return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${API_KEY}`
        );
        const data = await res.json();

        city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state ||
          'Unknown';
        searchValue = city;

        if (city === 'Unknown') {
          alert('Could not determine your location. Please try another city.');
          return;
        }
      } catch (err) {
        console.error(err);
        alert('Could not retrieve your location.');
        return;
      } finally {
        setLocating(false);
      }
    }

    const hotel = hotels.find((h) => h.name === searchValue);

    const searchData = {
      searchValue,
      city,
      adults,
      children,
      checkin: date.from.toISOString(),
      checkout: date.to.toISOString(),
    };

    localStorage.setItem('search', JSON.stringify(searchData));

    if (selectedOption.type === 'hotel' && hotel) {
      navigate(`/hotel/${hotel.id}`);
    } else {
      navigate(`/travel/destination/${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className='space-y-4 border p-4 rounded-lg shadow-sm bg-white'>
      <div className='grid md:grid-cols-4 gap-4 items-center'>
        {/* Combobox for destination */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Destination</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                className='w-full justify-between'
              >
                {selectedOption?.label || 'Select destination...'}
                <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput placeholder='Search hotels or cities...' />
                <CommandList>
                  <CommandEmpty>No match found.</CommandEmpty>
                  <CommandGroup heading='Location'>
                    <CommandItem
                      value={locationOption.value}
                      onSelect={() => {
                        setSelectedOption(locationOption);
                        setOpen(false);
                      }}
                    >
                      {locationOption.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedOption?.value === locationOption.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  </CommandGroup>

                  <CommandGroup heading='Stash Partner Hotels'>
                    {hotelOptions.map((option) => (
                      <CommandItem
                        key={option.label}
                        value={option.value}
                        onSelect={() => {
                          setSelectedOption(option);
                          setOpen(false);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedOption?.value === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandGroup heading='Destinations'>
                    {cityOptions.map((option) => (
                      <CommandItem
                        key={option.label}
                        value={option.value}
                        onSelect={() => {
                          setSelectedOption(option);
                          setOpen(false);
                        }}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedOption?.value === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date range picker */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Dates</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} –{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Select dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Travelers dropdown */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Travelers</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' className='w-full justify-between'>
                <Users className='h-4 w-4 mr-2' />
                {adults} Adult{adults !== 1 && 's'} & {children} Child
                {children !== 1 && 'ren'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-56 p-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <span>Adults</span>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                  >
                    –
                  </Button>
                  <span>{adults}</span>
                  <Button variant='ghost' onClick={() => setAdults(adults + 1)}>
                    +
                  </Button>
                </div>
              </div>
              <div className='flex items-center justify-between'>
                <span>Children</span>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                  >
                    –
                  </Button>
                  <span>{children}</span>
                  <Button
                    variant='ghost'
                    onClick={() => setChildren(children + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search button */}
        <div className='mt-6 md:mt-0'>
          <Button className='text-black' disabled={locating}>
            {locating ? 'Locating...' : 'Search'}
          </Button>
        </div>
      </div>
    </div>
  );
}
