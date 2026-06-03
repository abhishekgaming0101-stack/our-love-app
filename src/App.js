import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import Petals from './components/Petals';
import Home from './pages/Home';
import PlanDate from './pages/Plan';
import Upcoming from './pages/Upcoming';
import Memories from './pages/Memories';
import './index.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Cursor />
        <Petals count={16} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<PlanDate />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/memories/:id" element={<Memories />} />
        </Routes>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(232,120,138,0.2)',
              color: '#2d1a20',
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '50px',
              padding: '12px 24px',
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}
