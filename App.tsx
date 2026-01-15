
import React, { useState, useEffect } from 'react';
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

  // Check for API Key on load to help user debug deployment issues
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("API_KEY environment variable is not defined. Ensure it is set in Vercel settings.");
    }
  }, []);

  const handleInputChange = (field: keyof PostInput, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      setError("Configuration Error: API Key is missing in environment variables.");
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
    } catch (err) {
      setError("Failed to generate post. Please check your connection and API key.");
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

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      {/* Header */}
      <header className="w-full text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-4">
          <i className="fa-brands fa-telegram text-blue-400 text-xl"></i>
          <span className="text-blue-400 font-bold uppercase tracking-wider text-xs">For Indian Telegram Groups</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          Casino Post <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 font-black">Master</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Generate high-converting, Unicode-bold, Hinglish-supported betting posts in seconds. Optimized for Telegram Indian communities.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-sliders text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-bold text-white">Post Settings</h2>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Casino Type" icon="fa-solid fa-tag">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.casinoType}
                  onChange={(e) => handleInputChange('casinoType', e.target.value)}
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
                placeholder="https://..."
                onChange={(e) => handleInputChange('casinoLink', e.target.value)}
              />
            </InputGroup>

            <InputGroup label="Telegram Username (Optional)" icon="fa-solid fa-at">
              <input 
                type="text" 
                className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                value={inputs.telegramHandle}
                placeholder="@BotName"
                onChange={(e) => handleInputChange('telegramHandle', e.target.value)}
              />
            </InputGroup>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Tone" icon="fa-solid fa-bolt">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.tone}
                  onChange={(e) => handleInputChange('tone', e.target.value)}
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </InputGroup>

              <InputGroup label="Language" icon="fa-solid fa-language">
                <select 
                  className="bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  value={inputs.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </InputGroup>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 mt-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Generating Magic...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  GENERATE POST
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Column */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs font-bold text-slate-400 tracking-widest uppercase">Telegram Preview</span>
              </div>
              {result && (
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copySuccess 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <i className={copySuccess ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
                  {copySuccess ? 'COPIED!' : 'COPY POST'}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat">
              {result ? (
                <div className="bg-[#17212b] p-5 rounded-2xl max-w-md mx-auto shadow-xl relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-[#17212b] rotate-45"></div>
                  <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-[#f5f5f5] break-words select-all selection:bg-blue-500/30">
                    {result.content}
                  </pre>
                  <div className="mt-2 text-[11px] text-[#708499] text-right">
                    {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-triangle-exclamation text-red-500 text-2xl"></i>
                  </div>
                  <p className="text-red-400 font-semibold">{error}</p>
                  <button onClick={handleGenerate} className="mt-4 text-blue-400 hover:underline text-sm font-bold">Try again</button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <i className="fa-brands fa-telegram text-8xl mb-6 text-slate-600"></i>
                  <p className="text-slate-400 max-w-xs font-medium">Your high-converting post preview will appear here once generated.</p>
                </div>
              )}
            </div>

            {result && (
              <div className="bg-slate-800/30 p-4 border-t border-slate-700 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                  Tip: Copy-paste directly into your Telegram Desktop or Mobile client.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-slate-500 text-sm flex items-center gap-6">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-blue-500"></i>
          <span>Secure & Anonymous</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bolt-lightning text-yellow-500"></i>
          <span>Instant Generation</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
