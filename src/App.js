import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
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
              background: '#1a0f14',
              border: '1px solid rgba(232,64,90,0.25)',
              color: '#f0e8e8',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              borderRadius: '2px',
              padding: '14px 24px',
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}
