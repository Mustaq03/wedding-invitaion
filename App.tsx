
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
  palaceLogo: '6-61554_wedding-hall-logo-png-transparent-png.png',
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
          const encodedData = hash.replace('#view=', '');
          const decodedData = JSON.parse(atob(encodedData));
          setWeddingData(decodedData);
          setMode(AppMode.VIEWER);
          setIsSharedView(true); // LOCK GUESTS OUT OF ADMIN
        } catch (e) {
          console.error("Failed to parse shared data", e);
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
          <InvitationView data={weddingData} />
          
          {/* Dashboard button only visible to YOU (the admin) when NOT using a shared link */}
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
