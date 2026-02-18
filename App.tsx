
import React from 'react';
import { InvitationView } from './components/InvitationView';
import { WeddingData } from './types';

const WEDDING_DATA: WeddingData = {
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
  return (
    <div className="min-h-screen">
      <InvitationView data={WEDDING_DATA} isShared={true} />
    </div>
  );
};

export default App;
