
import React, { useState, useEffect } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { InvitationView } from './components/InvitationView';
import { LoginPanel } from './components/LoginPanel';
import { WeddingData, AppMode } from './types';

const DEFAULT_WEDDING: WeddingData = {
  brideName: 'Shaik Shahena',
  groomName: 'Shaik Hamza Thabraiz',
  nikahDate: '2026-03-29',
  nikahTime: '12:30 PM',
  nikahVenue: 'G.S.S Function Hall',
  nikahAddress: 'Boys High School Road, Shiva Nandhi Colony, Banaganapalli',
  nikahMapLink: 'https://maps.app.goo.gl/CRhdtKU3kkodH2gw6',
  valimaDate: '2026-03-30',
  valimaTime: '08:30 PM',
  valimaVenue: 'Imperial Convention',
  valimaAddress: 'Sunkesula Road, Kurnool',
  valimaMapLink: 'https://maps.app.goo.gl/zjK4jVFf8Jcfcuwk8',
  welcomeMessage: 'With the grace of Allah (SWT), we invite you to celebrate the union of our souls.',
  themeColor: '#d4af37',
  dressCode: 'Formal Islamic Attire / Modest Wear',
  nasheedUrl: ''
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.VIEWER);
  const [weddingData, setWeddingData] = useState<WeddingData>(DEFAULT_WEDDING);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#view=')) {
        try {
          // Robust Unicode-safe Base64 decoding
          let base64 = hash.replace('#view=', '').replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) base64 += '=';
          
          const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
          const decodedData = JSON.parse(new TextDecoder().decode(bytes));
          
          setWeddingData(decodedData);
          setMode(AppMode.VIEWER);
          setIsSharedView(true);
        } catch (e) {
          console.error("Failed to parse shared data (likely encoding issue)", e);
          setMode(AppMode.LOGIN);
          setIsSharedView(false);
        }
      } else {
        setMode(AppMode.LOGIN);
        setIsSharedView(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleUpdateData = (data: WeddingData) => {
    setWeddingData(data);
  };

  const handleLoginSuccess = () => {
    setMode(AppMode.ADMIN);
  };

  return (
    <div className="min-h-screen">
      {mode === AppMode.LOGIN && <LoginPanel onLogin={handleLoginSuccess} />}
      
      {mode === AppMode.ADMIN && (
        <AdminPanel 
          data={weddingData} 
          onUpdate={handleUpdateData} 
          onPreview={() => setMode(AppMode.VIEWER)} 
        />
      )}

      {mode === AppMode.VIEWER && (
        <div className="relative">
          <InvitationView data={weddingData} isShared={isSharedView} />
          
          {!isSharedView && (
            <button 
              onClick={() => setMode(AppMode.ADMIN)}
              className="fixed bottom-6 right-6 z-[9999] bg-white text-[#d4af37] px-6 py-3 rounded-full shadow-2xl border-2 border-[#d4af37] font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
