import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import StarField from './components/Petals';
import Home from './pages/Home';
import PlanDate from './pages/Plan';
import Upcoming from './pages/Upcoming';
import Memories from './pages/Memories';
import './index.css';

// Global aurora blobs shown on every page
function GlobalAurora() {
  return (
    <div style={{position:'fixed',inset:'-40%',zIndex:0,pointerEvents:'none'}}>
      <div style={{
        position:'absolute',width:'65vw',height:'65vw',top:'-10%',left:'-15%',
        borderRadius:'50%',filter:'blur(90px)',mixBlendMode:'screen',
        background:'radial-gradient(circle,rgba(109,40,217,0.28) 0%,transparent 68%)',
        animation:'aurora 14s ease-in-out infinite',
      }}/>
      <div style={{
        position:'absolute',width:'55vw',height:'55vw',bottom:'-15%',right:'-10%',
        borderRadius:'50%',filter:'blur(90px)',mixBlendMode:'screen',
        background:'radial-gradient(circle,rgba(76,29,149,0.20) 0%,transparent 68%)',
        animation:'aurora 14s ease-in-out infinite',
        animationDelay:'-5s',
      }}/>
      <div style={{
        position:'absolute',width:'38vw',height:'38vw',top:'40%',left:'42%',
        borderRadius:'50%',filter:'blur(90px)',mixBlendMode:'screen',
        background:'radial-gradient(circle,rgba(167,139,250,0.12) 0%,transparent 68%)',
        animation:'aurora 14s ease-in-out infinite',
        animationDelay:'-9s',
      }}/>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Cursor />
        <StarField />
        <GlobalAurora />
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
            style:{
              background:'rgba(167,139,250,0.12)',
              backdropFilter:'blur(20px)',
              border:'1px solid rgba(167,139,250,0.25)',
              color:'#fff',
              fontFamily:'Inter,sans-serif',
              borderRadius:'50px',
              padding:'12px 24px',
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}
