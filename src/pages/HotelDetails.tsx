import { useParams } from 'react-router-dom';

export default function HotelDetails() {
  const { id } = useParams();
  return <div className='p-4'>Details for Hotel ID: {id}</div>;
}
