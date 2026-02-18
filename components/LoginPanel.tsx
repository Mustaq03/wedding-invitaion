
import React, { useState } from 'react';

interface LoginPanelProps {
  onLogin: () => void;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For the demo, password is 'admin'
    if (password === 'admin') {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7] p-4 islamic-bg">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
        <h2 className="text-3xl font-serif mb-2 gold-shimmer font-bold">Admin Portal</h2>
        <p className="text-gray-400 text-sm mb-8 uppercase tracking-widest">Secure Access Required</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-tighter mb-2">Access Key</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all"
              placeholder="Enter your private key"
            />
            {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#d4af37] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#d4af37]/20 hover:bg-[#c09a2d] transition-colors"
          >
            Unlock Dashboard
          </button>
        </form>
        
        <div className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest">
          Protected by Encryption
        </div>
      </div>
    </div>
  );
};
