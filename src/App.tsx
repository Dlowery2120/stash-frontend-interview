import { Routes, Route } from 'react-router-dom';
import HotelsIndex from './pages/HotelsIndex';
import HotelDetails from './pages/HotelDetails';
import DestinationResults from './pages/DestinationResults';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen w-full min-w-screen">
      <Navbar />

      <main className="flex justify-center px-4">
        <div className="w-full max-w-7xl">
          <Routes>
            <Route path="/" element={<HotelsIndex />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/travel/destination/:city" element={<DestinationResults />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
