
import React, { useState } from 'react';
import { WeddingData } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AdminPanelProps {
  data: WeddingData;
  onUpdate: (data: WeddingData) => void;
  onPreview: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdate, onPreview }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...data, [name]: value });
  };

  const handleGenerateText = async () => {
    if (!data.groomName || !data.brideName) {
      alert("Please enter names first!");
      return;
    }
    
    setLoading(true);
    try {
      let apiKey = process.env.API_KEY;
      
      try {
        if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
          apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || apiKey;
        }
      } catch (e) {
        console.warn("Environment check skipped", e);
      }

      if (!apiKey) {
        throw new Error("API Key not found. Please set it in your environment.");
      }

      const ai = new GoogleGenAI({ apiKey: apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write an elegant, poetic Islamic wedding invitation welcome message starting with "Bismillah-ir-Rahman-ir-Raheem" for the Nikah of ${data.groomName} and ${data.brideName}. Keep it under 3 sentences.`,
      });
      if (response.text) {
        onUpdate({ ...data, welcomeMessage: response.text.trim() });
      }
    } catch (error) {
      console.error("AI Generation failed", error);
      alert(`AI Generation failed: ${error instanceof Error ? error.message : "Check console"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const encoded = btoa(JSON.stringify(data));
    const baseUrl = window.location.href.split('#')[0];
    const url = `${baseUrl}#view=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Invitation link copied to clipboard! Share this link to show ONLY the invitation.");
  };

  const inputClass = "w-full p-3 rounded-lg border border-gray-400 bg-white text-black outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all placeholder:text-gray-400";
  const labelClass = "block text-xs font-bold text-gray-700 uppercase tracking-tighter mb-1";

  return (
    <div className="max-w-5xl mx-auto p-8 islamic-bg min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-serif mb-2 gold-shimmer font-bold">Islamic Invitation Builder</h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest">Personalize your sacred celebration</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-serif mb-6 text-[#d4af37] border-b pb-2">The Blessed Couple</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Bride's Name</label>
                <input type="text" name="brideName" value={data.brideName} onChange={handleChange} className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Groom's Name</label>
                <input type="text" name="groomName" value={data.groomName} onChange={handleChange} className={inputClass}/>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-serif mb-6 text-[#d4af37] border-b pb-2">Nikah Details (Scratch Reveal)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Nikah Date</label>
                <input type="date" name="nikahDate" value={data.nikahDate} onChange={handleChange} className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Nikah Time</label>
                <input type="text" name="nikahTime" value={data.nikahTime} onChange={handleChange} placeholder="e.g. 11:00 AM" className={inputClass}/>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Venue Name & Address</label>
                <input type="text" name="nikahVenue" value={data.nikahVenue} onChange={handleChange} placeholder="Venue Name" className={`${inputClass} mb-2`}/>
                <input type="text" name="nikahAddress" value={data.nikahAddress} onChange={handleChange} placeholder="Display Address" className={`${inputClass} mb-2`}/>
                <input type="text" name="nikahMapLink" value={data.nikahMapLink} onChange={handleChange} placeholder="Google Maps Link" className={inputClass}/>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <h3 className="text-xl font-serif mb-6 text-[#d4af37] border-b pb-2">Valima Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Valima Date</label>
                <input type="date" name="valimaDate" value={data.valimaDate} onChange={handleChange} className={inputClass}/>
              </div>
              <div>
                <label className={labelClass}>Valima Time</label>
                <input type="text" name="valimaTime" value={data.valimaTime} onChange={handleChange} placeholder="e.g. 08:00 PM" className={inputClass}/>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Venue Name & Address</label>
                <input type="text" name="valimaVenue" value={data.valimaVenue} onChange={handleChange} placeholder="Venue Name" className={`${inputClass} mb-2`}/>
                <input type="text" name="valimaAddress" value={data.valimaAddress} onChange={handleChange} placeholder="Display Address" className={`${inputClass} mb-2`}/>
                <input type="text" name="valimaMapLink" value={data.valimaMapLink} onChange={handleChange} placeholder="Google Maps Link" className={inputClass}/>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h3 className="text-xl font-serif text-[#d4af37]">Welcome Msg</h3>
              <button onClick={handleGenerateText} disabled={loading} className="text-[10px] bg-[#d4af37]/10 text-[#d4af37] px-2 py-1 rounded font-bold uppercase tracking-widest hover:bg-[#d4af37]/20 transition-all">
                {loading ? '...' : '✨ AI'}
              </button>
            </div>
            <textarea name="welcomeMessage" value={data.welcomeMessage} onChange={handleChange} rows={5} className={`${inputClass} text-sm`}/>
          </section>

          <section className="bg-white p-8 rounded-3xl shadow-md border border-gray-200">
             <h3 className="text-xl font-serif mb-6 text-[#d4af37] border-b pb-2">Appearance</h3>
             <div className="space-y-4">
                <div>
                  <label className={labelClass}>Dress Code</label>
                  <input type="text" name="dressCode" value={data.dressCode} onChange={handleChange} className={`${inputClass} text-xs`}/>
                </div>
                <div>
                  <label className={labelClass}>Theme Accent Color</label>
                  <input type="color" name="themeColor" value={data.themeColor} onChange={handleChange} className="w-full h-10 rounded cursor-pointer border border-gray-400 shadow-sm"/>
                </div>
             </div>
          </section>

          <div className="flex flex-col gap-3">
             <button onClick={onPreview} className="w-full bg-[#d4af37] text-white py-4 rounded-2xl font-bold shadow-xl shadow-[#d4af37]/20 hover:bg-[#c09a2d] transition-all">
               Live Preview
             </button>
             <button onClick={handleShare} className="w-full bg-white text-[#d4af37] border-2 border-[#d4af37] py-4 rounded-2xl font-bold hover:bg-[#d4af37]/5 transition-all">
               Copy Shareable Link
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
