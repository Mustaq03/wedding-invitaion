
export interface WeddingData {
  brideName: string;
  groomName: string;
  
  // Nikah Details
  nikahDate: string; 
  nikahTime: string;
  nikahVenue: string;
  nikahAddress: string;
  nikahMapLink: string;
  
  // Valima Details
  valimaDate: string;
  valimaTime: string;
  valimaVenue: string;
  valimaAddress: string;
  valimaMapLink: string;

  palaceLogo: string; // URL to logo
  welcomeMessage: string;
  themeColor: string;
  dressCode: string;
  nasheedUrl?: string;
}

export enum AppMode {
  LOGIN = 'LOGIN',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER'
}
