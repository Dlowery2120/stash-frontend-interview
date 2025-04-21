import { useParams } from 'react-router-dom';

export default function DestinationResults() {
  const { city } = useParams();
  return <div className='p-4'>Search Results for: {city}</div>;
}
