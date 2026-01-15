
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
    // Basic field validation
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
      setError("Request failed. Please ensure the API Key is configured in your project settings.");
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
          <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">For Indian Telegram Groups</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          Casino Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-black">Master</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-2">
          Generate high-converting, Unicode-bold, Hinglish-supported betting posts. Optimized by <span className="text-indigo-400 font-bold">@Its_Gods</span> for premium performance.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-sm h-fit">
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-sliders text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-bold text-white">Post Settings</h2>
            </div>
            <button 
              onClick={handleReset}
              className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Casino Type" icon="fa-solid fa-tag">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.casinoType}
                  onChange={(e) => handleInputChange('casinoType', e.target.value as any)}
                >
                  {CASINO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Signup Bonus" icon="fa-solid fa-indian-rupee-sign">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.signupBonus}
                  placeholder="e.g. 500"
                  onChange={(e) => handleInputChange('signupBonus', e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Wagering" icon="fa-solid fa-rotate">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.wagering}
                  placeholder="e.g. 1x / No wager"
                  onChange={(e) => handleInputChange('wagering', e.target.value)}
                />
              </InputGroup>

              <InputGroup label="Min Withdraw" icon="fa-solid fa-money-bill-transfer">
                <input 
                  type="text" 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.minWithdrawal}
                  placeholder="e.g. 100"
                  onChange={(e) => handleInputChange('minWithdrawal', e.target.value)}
                />
              </InputGroup>
            </div>

            <InputGroup label="Casino Link" icon="fa-solid fa-link">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.casinoLink}
                placeholder="Paste your link here"
                onChange={(e) => handleInputChange('casinoLink', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Telegram Username (Optional)" icon="fa-solid fa-at">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.telegramHandle}
                placeholder="@YourChannel"
                onChange={(e) => handleInputChange('telegramHandle', e.target.value)}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Tone" icon="fa-solid fa-bolt">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value as any)}
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Language" icon="fa-solid fa-language">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value as any)}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </InputGroup>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <i className="fa-solid fa-circle-exclamation"></i>
                <p>{error}</p>
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all ${
                loading 
                ? 'bg-slate-800 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  Generating Magic...
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
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          {result ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col h-full shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600/20 text-green-400 h-8 w-8 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <h3 className="font-bold text-white">Generated Telegram Post</h3>
                </div>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                    copySuccess 
                    ? 'bg-green-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                  {copySuccess ? 'Copied!' : 'Copy Post'}
                </button>
              </div>
              
              <div className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-300 select-all overflow-y-auto">
                {result.content}
              </div>

              <div className="mt-4 text-xs text-slate-500 flex items-center gap-2">
                <i className="fa-regular fa-clock"></i>
                Generated {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-paper-plane text-slate-600 text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to convert?</h3>
              <p className="text-slate-500 max-w-sm">
                Enter your casino details on the left and click generate to create a high-impact Telegram post.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-12 text-slate-600 text-sm flex flex-col items-center gap-2">
        <p>© 2024 Telegram Casino Master. Powered by Gemini 3 Flash.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
};

// @fix: Add the missing default export for index.tsx
export default App;
