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
      setError("Request failed. Please ensure the API Key is configured in your project settings (Environment Variables).");
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
      {/* Header */}
      <header className="w-full text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-4">
          <i className="fa-brands fa-telegram text-blue-400 text-xl"></i>
          <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">Premium Casino Post Tool</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
          Casino Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-black">Master</span>
          <span className="ml-2 bg-indigo-600 text-[10px] uppercase px-2 py-0.5 rounded align-middle">PRO</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-2 text-lg">
          High-converting Telegram templates by <span className="text-blue-400 font-bold">@Its_Gods</span>
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-md h-fit">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-bolt text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">Configuration</h2>
            </div>
            <button 
              onClick={handleReset}
              className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
            >
              Reset Form
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Casino Type" icon="fa-solid fa-cube">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                  value={inputs.casinoType}
                  onChange={(e) => handleInputChange('casinoType', e.target.value as any)}
                >
                  {CASINO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Signup Bonus" icon="fa-solid fa-indian-rupee-sign">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.signupBonus}
                  placeholder="89 / 500"
                  onChange={(e) => handleInputChange('signupBonus', e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Wagering" icon="fa-solid fa-rotate-right">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.wagering}
                  placeholder="3x / 10x"
                  onChange={(e) => handleInputChange('wagering', e.target.value)}
                />
              </InputGroup>

              <InputGroup label="Min Withdraw" icon="fa-solid fa-wallet">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.minWithdrawal}
                  placeholder="100 / 500"
                  onChange={(e) => handleInputChange('minWithdrawal', e.target.value)}
                />
              </InputGroup>
            </div>

            <InputGroup label="Casino Link" icon="fa-solid fa-globe">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.casinoLink}
                placeholder="https://casino.com"
                onChange={(e) => handleInputChange('casinoLink', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Telegram Username (Optional)" icon="fa-brands fa-telegram">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.telegramHandle}
                placeholder="@Offersgod"
                onChange={(e) => handleInputChange('telegramHandle', e.target.value)}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Tone" icon="fa-solid fa-fire">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                  value={inputs.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value as any)}
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Language" icon="fa-solid fa-earth-asia">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value as any)}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </InputGroup>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3 text-red-400 text-sm animate-pulse">
                <i className="fa-solid fa-circle-exclamation mt-0.5"></i>
                <p className="font-medium leading-snug">{error}</p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-3 transition-all uppercase tracking-widest shadow-lg ${
                loading 
                ? 'bg-slate-800 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/20 active:scale-[0.97]'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[550px]">
          {result ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col h-full shadow-2xl backdrop-blur-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 text-green-400 h-9 w-9 rounded-xl flex items-center justify-center border border-green-500/20">
                    <i className="fa-solid fa-paper-plane text-sm"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Telegram Preview</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Ready to copy & paste</p>
                  </div>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all uppercase tracking-wide shadow-sm ${
                    copySuccess 
                    ? 'bg-green-600 text-white scale-105' 
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
              </div>
              
              <div className="flex-grow bg-[#17212b] border border-slate-800/50 rounded-2xl p-6 font-sans text-[15px] leading-relaxed whitespace-pre-wrap text-[#f5f5f5] select-all overflow-y-auto custom-scrollbar shadow-inner">
                {result.content}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 flex items-center gap-2 font-bold uppercase tracking-widest">
                  <i className="fa-regular fa-clock"></i>
                  Generated {new Date(result.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                  Verified by @Its_Gods
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full group transition-colors hover:border-slate-700">
              <div className="w-24 h-24 bg-slate-800/30 rounded-full flex items-center justify-center mb-8 border border-slate-800 group-hover:bg-slate-800/50 transition-all">
                <i className="fa-brands fa-telegram text-slate-700 text-5xl group-hover:text-blue-500 transition-colors"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-400 mb-3 tracking-tight uppercase">Ready for Hype?</h3>
              <p className="text-slate-500 max-w-sm leading-relaxed font-medium">
                Fill the details and generate your professional casino promotion post. Created for speed and high CTR.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-16 mb-8 w-full border-t border-slate-900 pt-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <a href="https://t.me/Its_Gods" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors font-bold text-sm uppercase tracking-widest">
            <i className="fa-brands fa-telegram text-lg"></i>
            Developer: @Its_Gods
          </a>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
          <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">Powered by Gemini 3 Flash</span>
        </div>
        <p className="text-slate-700 text-[10px] uppercase font-black tracking-[0.2em]">© 2025 CASINO POST MASTER PRO</p>
      </footer>
    </div>
  );
};

export default App;
