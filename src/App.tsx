import { Routes, Route } from 'react-router-dom';
import HotelsIndex from './pages/HotelsIndex';
import HotelDetails from './pages/HotelDetails';
import DestinationResults from './pages/DestinationResults';

function App() {
  return (
    <div className='min-h-screen'>
      <Routes>
        <Route path='/' element={<HotelsIndex />} />
        <Route path='/hotels/:id' element={<HotelDetails />} />
        <Route path='/destinations/:city' element={<DestinationResults />} />
      </Routes>
    </div>
  );
}

export default App;
