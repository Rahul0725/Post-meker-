
import React, { useState } from 'react';
import { PostInput, GeneratedPost } from './types';
import { DEFAULT_INPUTS, CASINO_TYPES, TONES, LANGUAGES } from './constants';
import { generateTelegramPost } from './services/geminiService';
import { InputGroup } from './components/InputGroup';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<PostInput>(DEFAULT_INPUTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (field: keyof PostInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); 
  };

  const handleGenerate = async () => {
    if (!inputs.casinoLink.trim()) {
      setError("Missing Field: Casino Link is required.");
      return;
    }
    if (!inputs.signupBonus.trim()) {
      setError("Missing Field: Signup Bonus is required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const postText = await generateTelegramPost(inputs);
      setResult({
        content: postText,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error("API Error details:", err);
      // More descriptive error for Vercel users
      const rawError = err.message || "Unknown Connection Error";
      setError(`Critical Error: ${rawError}. 
      
      Troubleshooting:
      1. Go to Vercel Dashboard > Project Settings > Environment Variables.
      2. Add a key named "API_KEY" with your Gemini API key.
      3. Redeploy the application.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 p-4 md:p-8 flex flex-col items-center max-w-7xl mx-auto">
      {/* Premium Header */}
      <header className="w-full text-center mb-8 pt-4">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-6">
          <i className="fa-brands fa-telegram text-blue-500 text-sm"></i>
          <span className="text-blue-500 font-black uppercase tracking-widest text-[9px]">Official Generator</span>
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-white mb-3 tracking-tighter uppercase italic">
          POST <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">MASTER</span>
        </h1>
        <div className="flex flex-col items-center gap-1">
          <p className="text-slate-400 font-medium text-base md:text-xl">
            Premium Templates by <span className="text-blue-400 font-bold tracking-tight">@Its_Gods</span>
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-transparent rounded-full mt-2"></div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl">
        {/* Input Controls */}
        <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800/60 p-5 md:p-7 rounded-[2rem] shadow-2xl backdrop-blur-xl h-fit">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
              Details
            </h2>
            <button 
              onClick={handleReset}
              className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] border border-slate-800 px-3 py-1 rounded-lg"
            >
              Clear
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <InputGroup label="Casino Type" icon="fa-solid fa-layer-group">
                <select 
                  className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-sm font-bold"
                  value={inputs.casinoType}
                  onChange={(e) => handleInputChange('casinoType', e.target.value as any)}
                >
                  {CASINO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Bonus" icon="fa-solid fa-gift">
                <input 
                  type="text" 
                  className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700"
                  value={inputs.signupBonus}
                  placeholder="₹500 / Free"
                  onChange={(e) => handleInputChange('signupBonus', e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputGroup label="Wager" icon="fa-solid fa-spinner">
                <input 
                  type="text" 
                  className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700"
                  value={inputs.wagering}
                  placeholder="1x / 10x"
                  onChange={(e) => handleInputChange('wagering', e.target.value)}
                />
              </InputGroup>

              <InputGroup label="Min Pay" icon="fa-solid fa-money-bill-wave">
                <input 
                  type="text" 
                  className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700"
                  value={inputs.minWithdrawal}
                  placeholder="₹100"
                  onChange={(e) => handleInputChange('minWithdrawal', e.target.value)}
                />
              </InputGroup>
            </div>

            <InputGroup label="Landing Page Link" icon="fa-solid fa-link">
              <input 
                type="text" 
                className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700"
                value={inputs.casinoLink}
                placeholder="https://casino-link.com"
                onChange={(e) => handleInputChange('casinoLink', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="TG Username" icon="fa-solid fa-user-tag">
              <input 
                type="text" 
                className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all text-sm font-bold placeholder:text-slate-700"
                value={inputs.telegramHandle}
                placeholder="@Offersgod"
                onChange={(e) => handleInputChange('telegramHandle', e.target.value)}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-3">
              <InputGroup label="Vibe" icon="fa-solid fa-fire">
                <select 
                  className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-sm font-bold"
                  value={inputs.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value as any)}
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Lang" icon="fa-solid fa-language">
                <select 
                  className="bg-black/40 border border-slate-800 text-white rounded-2xl px-4 py-3.5 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-sm font-bold"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value as any)}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </InputGroup>
            </div>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl text-red-400 text-xs animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-2 font-black uppercase mb-1">
                   <i className="fa-solid fa-triangle-exclamation"></i>
                   Error Log
                </div>
                <p className="font-medium whitespace-pre-wrap leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4.5 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all uppercase tracking-[0.2em] text-sm shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] ${
                loading 
                ? 'bg-slate-800 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magic"></i>
                  Magic Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[450px]">
          {result ? (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-[2rem] p-6 flex flex-col h-full shadow-2xl backdrop-blur-xl relative animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/20 text-blue-400 h-10 w-10 rounded-xl flex items-center justify-center border border-blue-500/30 shadow-inner">
                    <i className="fa-solid fa-code"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg tracking-tight uppercase">Template</h3>
                    <p className="text-[9px] text-slate-500 font-black tracking-[0.2em] uppercase">Conversion Optimized</p>
                  </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`px-8 py-3 rounded-xl font-black text-xs transition-all uppercase tracking-widest ${
                    copySuccess 
                    ? 'bg-green-600 text-white scale-105 shadow-green-500/20 shadow-lg' 
                    : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
              </div>
              
              <div className="flex-grow bg-[#0c111d] border border-slate-800 rounded-2xl p-6 font-sans text-[15px] leading-relaxed whitespace-pre-wrap text-white selection:bg-blue-600 overflow-y-auto max-h-[400px]">
                {result.content}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800/50 pt-5">
                <div className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <i className="fa-regular fa-clock"></i>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] italic">
                  Signed: @Its_Gods
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/10 border-2 border-dashed border-slate-800/40 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center h-full">
              <div className="w-20 h-20 bg-slate-900/50 rounded-full flex items-center justify-center mb-8 border border-slate-800/30">
                <i className="fa-brands fa-telegram text-slate-700 text-4xl"></i>
              </div>
              <h3 className="text-xl font-black text-slate-600 mb-2 uppercase tracking-tighter italic">Preview Area</h3>
              <p className="text-slate-700 max-w-xs text-xs font-bold leading-relaxed uppercase tracking-widest">
                Your post content will appear here after generation.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Footer Signature */}
      <footer className="mt-auto py-10 w-full flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-16 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
             <i className="fa-solid fa-code text-blue-600 text-xs"></i>
             <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Dev: @Its_Gods</span>
          </div>
          <div className="flex items-center gap-2">
             <i className="fa-brands fa-telegram text-blue-500 text-xs"></i>
             <a href="https://t.me/Its_Gods" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em]">Contact Support</a>
          </div>
        </div>
        <div className="text-slate-800 text-[8px] font-black uppercase tracking-[0.5em] text-center">
          HIGH CONVERSION ENGINE • VERSION 2.1 • @ITS_GODS
        </div>
      </footer>
    </div>
  );
};

export default App;
