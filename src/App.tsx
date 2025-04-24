import { Routes, Route } from 'react-router-dom';
import HotelsIndex from './pages/HotelsIndex';
import HotelDetails from './pages/HotelDetails';
import DestinationResults from './pages/DestinationResults';

function App() {
  return (
    <div className='min-h-screen'>
      <Routes>
        <Route path="/" element={<HotelsIndex />} />
        <Route path="/hotel/:id" element={<HotelDetails />} />
        <Route path="/travel/destination/:city" element={<DestinationResults />} />
      </Routes>
    </div>
  );
}

export default App;
