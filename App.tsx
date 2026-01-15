
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
      setError("Please enter a Casino Link.");
      return;
    }
    if (!inputs.signupBonus.trim()) {
      setError("Please enter a Signup Bonus.");
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
      // Detailed error reporting to help users debugging Vercel deployments
      const errorMessage = err.message || "Unknown error";
      setError(`Generation Failed: ${errorMessage}. (Note: Ensure API_KEY is set in your Vercel/Project Environment Variables)`);
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
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      {/* Header with @Its_Gods branding */}
      <header className="w-full text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-4">
          <i className="fa-brands fa-telegram text-blue-400 text-xl"></i>
          <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Verified by @Its_Gods</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
          Casino Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-black">Master</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-2 text-lg font-medium">
          Premium Telegram templates for high conversion.
        </p>
        <p className="text-blue-500 font-black text-sm uppercase tracking-widest">
          Signature: @Its_Gods
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md h-fit">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                <i className="fa-solid fa-gear text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Setup Post</h2>
            </div>
            <button 
              onClick={handleReset}
              className="text-[10px] font-black text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.2em]"
            >
              Reset
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Casino Type" icon="fa-solid fa-dice">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                  value={inputs.casinoType}
                  onChange={(e) => handleInputChange('casinoType', e.target.value as any)}
                >
                  {CASINO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Signup Bonus" icon="fa-solid fa-coins">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.signupBonus}
                  placeholder="₹500 / Free Spin"
                  onChange={(e) => handleInputChange('signupBonus', e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Wagering" icon="fa-solid fa-arrows-spin">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.wagering}
                  placeholder="1x / No Wager"
                  onChange={(e) => handleInputChange('wagering', e.target.value)}
                />
              </InputGroup>

              <InputGroup label="Min Withdraw" icon="fa-solid fa-receipt">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.minWithdrawal}
                  placeholder="₹100"
                  onChange={(e) => handleInputChange('minWithdrawal', e.target.value)}
                />
              </InputGroup>
            </div>

            <InputGroup label="Casino Link" icon="fa-solid fa-link">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.casinoLink}
                placeholder="https://loot-casino.com/join"
                onChange={(e) => handleInputChange('casinoLink', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Telegram Username" icon="fa-brands fa-telegram">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.telegramHandle}
                placeholder="@Offersgod"
                onChange={(e) => handleInputChange('telegramHandle', e.target.value)}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Post Tone" icon="fa-solid fa-fire-flame-curved">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                  value={inputs.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value as any)}
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Language" icon="fa-solid fa-comments">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value as any)}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </InputGroup>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex flex-col gap-2 text-red-400 text-sm animate-pulse">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider text-xs">
                   <i className="fa-solid fa-triangle-exclamation"></i>
                   System Error
                </div>
                <p className="font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all uppercase tracking-[0.15em] shadow-xl ${
                loading 
                ? 'bg-slate-800 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:scale-[1.02] active:scale-[0.98] hover:shadow-blue-500/30'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-rocket"></i>
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          {result ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col h-full shadow-2xl backdrop-blur-md relative animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600/20 text-blue-400 h-10 w-10 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <i className="fa-solid fa-align-left"></i>
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl tracking-tight uppercase">Template Ready</h3>
                    <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">High CTR Optimized</p>
                  </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`px-8 py-3 rounded-xl font-black text-sm transition-all uppercase tracking-[0.1em] ${
                    copySuccess 
                    ? 'bg-green-600 text-white scale-105' 
                    : 'bg-slate-100 text-slate-950 hover:bg-white'
                  }`}
                >
                  <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-copy'} mr-2`}></i>
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
              </div>
              
              <div className="flex-grow bg-black/40 border border-slate-800/50 rounded-2xl p-6 font-sans text-base leading-relaxed whitespace-pre-wrap text-white selection:bg-blue-600 overflow-y-auto">
                {result.content}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-regular fa-clock"></i>
                  Created {new Date(result.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-xs text-blue-400 font-black uppercase tracking-[0.1em]">
                  Verified by @Its_Gods
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/10 border-2 border-dashed border-slate-800/40 rounded-3xl p-16 flex flex-col items-center justify-center text-center h-full">
              <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mb-8 border border-slate-800/50">
                <i className="fa-brands fa-telegram text-slate-700 text-5xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-500 mb-3 uppercase tracking-tighter">No Post Generated</h3>
              <p className="text-slate-600 max-w-sm leading-relaxed text-sm font-medium">
                Your high-converting casino post will appear here. Input your details to start.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 mb-10 w-full flex flex-col items-center gap-6">
        <div className="h-px w-24 bg-slate-800"></div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
          <div className="flex items-center gap-3">
             <i className="fa-solid fa-code text-blue-600"></i>
             <span className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Designed by @Its_Gods</span>
          </div>
          <div className="flex items-center gap-3">
             <i className="fa-brands fa-telegram text-blue-500"></i>
             <a href="https://t.me/Its_Gods" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">Join Channel</a>
          </div>
        </div>
        <p className="text-slate-800 text-[9px] font-black uppercase tracking-[0.4em]">© 2025 PREMIUM CASINO GENERATOR</p>
      </footer>
    </div>
  );
};

export default App;
