'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronsUpDown, Users } from 'lucide-react';
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
  const { hotels, destinations, setQuery, query } = useHotelStore();
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
    type: 'hotel' | 'city' | 'location';
  } | null>(null);
  const API_KEY = import.meta.env.VITE_MAPSCO_API_KEY;

  const locationOption = {
    value: 'current-location',
    label: 'Use Current Location',
    type: 'location' as const,
  };

  React.useEffect(() => {
    const savedSearch = JSON.parse(localStorage.getItem('search') || '{}');

    if (savedSearch) {
      // Set adults/children
      if (savedSearch.adults) setAdults(savedSearch.adults);
      if (savedSearch.children) setChildren(savedSearch.children);

      // Set dates
      if (savedSearch.checkin && savedSearch.checkout) {
        setDate({
          from: new Date(savedSearch.checkin),
          to: new Date(savedSearch.checkout),
        });
      }

      // Set selected destination option
      const matchHotel = hotels.find((h) => h.name === savedSearch.searchValue);
      const matchCity = destinations.find(
        (c) => c.toLowerCase() === savedSearch.city?.toLowerCase()
      );

      if (matchHotel) {
        setSelectedOption({
          label: `${matchHotel.name}, ${matchHotel.city}`,
          value: matchHotel.name,
          type: 'hotel',
        });
      } else if (matchCity) {
        setSelectedOption({
          label: matchCity,
          value: matchCity,
          type: 'city',
        });
      }
    }
  }, [hotels, destinations]);

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

  const filteredHotelOptions = hotelOptions.filter(
    (option) =>
      query.length >= 3 &&
      option.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCityOptions = cityOptions.filter(
    (option) =>
      query.length >= 3 &&
      option.label.toLowerCase().includes(query.toLowerCase())
  );

  // Highlight matching query text in the dropdown options
  const highlightMatch = (label: string) => {
    const index = label.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return label; // If no match, return the original label

    const before = label.slice(0, index); // Text before the match
    const match = label.slice(index, index + query.length); // The matching text
    const after = label.slice(index + query.length); // Text after the match

    // Wrap the matching text in a bold span for emphasis
    return (
      <span>
        {before}
        <span className='font-bold'>{match}</span>
        {after}
      </span>
    );
  };

  const handleSearch = async () => {
    if (!selectedOption || !date?.from || !date?.to) return;

    let city =
      selectedOption.type === 'hotel'
        ? selectedOption.label.split(', ').pop() ?? ''
        : selectedOption.value;

    let searchValue = selectedOption.value;

    if (selectedOption.type === 'location') {
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
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
          'Unknown';
        searchValue = city;
      } catch {
        alert('Could not retrieve your location.');
        return;
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
    <div className='space-y-4 bg-white'>
      <div className='grid md:grid-cols-4 gap-4 items-center'>
        {/* Destination combobox */}
        <div className='flex flex-col gap-1 border border-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap'>
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
                <CommandInput
                  placeholder='Search hotels or cities...'
                  value={query}
                  onValueChange={(val) => setQuery(val)}
                />
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

                  {filteredHotelOptions.length > 0 && (
                    <CommandGroup heading='Stash Partner Hotels'>
                      {filteredHotelOptions.map((option) => (
                        <CommandItem
                          key={option.label}
                          value={option.value}
                          onSelect={() => {
                            setSelectedOption(option);
                            setOpen(false);
                          }}
                        >
                          {highlightMatch(option.label)}
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
                  )}

                  {filteredCityOptions.length > 0 && (
                    <CommandGroup heading='Destinations'>
                      {filteredCityOptions.map((option) => (
                        <CommandItem
                          key={option.label}
                          value={option.value}
                          onSelect={() => {
                            setSelectedOption(option);
                            setOpen(false);
                          }}
                        >
                          {highlightMatch(option.label)}
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
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Picker */}
        <div className='flex flex-col gap-1 border border-muted-foreground'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap',
                  !date && 'text-muted-foreground'
                )}
              >
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

        {/* Travelers */}
        <div className='flex flex-col gap-1 border border-muted-foreground'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal  overflow-hidden text-ellipsis whitespace-nowrap'
              >
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

        {/* Search Button */}
        <div className='border border-muted-foreground'>
          <Button
            className='w-full h-full text-muted-foreground hover:text-[#e08923]'
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
