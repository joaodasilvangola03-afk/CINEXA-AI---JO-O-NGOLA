
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [autoPrompt, setAutoPrompt] = useState('');
  const autoInputRef = useRef<HTMLInputElement>(null);

  // CINEXA AUTO™ Logic
  const handleAutoCreate = () => {
    if (!autoPrompt.trim()) return;
    
    const lower = autoPrompt.toLowerCase();
    
    // Simple heuristic to route based on intent
    // In a real app, this would use an LLM router
    if (lower.includes('video') || lower.includes('filme') || lower.includes('movie') || lower.includes('clip') || lower.includes('trailer')) {
        navigate('/video'); 
    } else if (lower.includes('thumb') || lower.includes('youtube') || lower.includes('capa') || lower.includes('banner')) {
        navigate('/thumbnail');
    } else {
        // Default to image for generic descriptions
        navigate('/image');
    }
  };

  const scrollToCreate = () => {
      if (autoInputRef.current) {
          autoInputRef.current.focus();
          autoInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  };

  return (
    <div className="relative min-h-[80vh]">
      {/* Background AI Brain / Neural Network Images */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Top Right Brain Network */}
         <div className="absolute top-[-10%] right-[-10%] w-[900px] h-[900px] opacity-10 mix-blend-screen pointer-events-none">
            <img 
                src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop" 
                alt="AI Neural Network" 
                className="w-full h-full object-contain animate-pulse" 
                style={{ animationDuration: '4s' }}
            />
         </div>
         
         {/* Bottom Left Abstract Synapse */}
         <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] opacity-5 mix-blend-screen pointer-events-none">
             <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop" 
                alt="AI Synapse" 
                className="w-full h-full object-contain rotate-12 scale-110" 
            />
         </div>
      </div>

      <div className="relative z-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                {t('dashboard.hello')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">{user.name}</span>
              </h1>
              <p className="text-zinc-400 text-lg">{t('dashboard.subtitle')}</p>
            </div>
            
            <button 
                onClick={scrollToCreate}
                className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all transform hover:-translate-y-1"
            >
                {t('dashboard.new_project')}
            </button>
          </div>

          {/* CINEXA AUTO™ SECTION */}
          <div className="relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 animate-gradient-xy"></div>
             <div className="relative glass-panel rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider mb-2">
                    <span className="text-yellow-400">★</span> CINEXA AUTO™
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">O que você quer criar hoje?</h2>
                <p className="text-zinc-400 max-w-lg">
                    Nossa IA detecta automaticamente se você precisa de um vídeo, imagem ou thumbnail. Apenas descreva.
                </p>
                
                <div className="w-full max-w-2xl relative">
                    <input 
                        ref={autoInputRef}
                        type="text" 
                        value={autoPrompt}
                        onChange={(e) => setAutoPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAutoCreate()}
                        placeholder="Ex: Um trailer cinematográfico de sci-fi em marte..." 
                        className="w-full bg-black/50 border border-white/20 rounded-full py-4 pl-6 pr-32 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all shadow-inner"
                    />
                    <button 
                        onClick={handleAutoCreate}
                        className="absolute right-2 top-2 bottom-2 bg-white text-black hover:bg-zinc-200 px-6 rounded-full font-bold transition-colors"
                    >
                        Criar 🪄
                    </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl">💎</span>
                </div>
              <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">{t('dashboard.credits')}</div>
              <div className="text-4xl font-bold text-white mb-2">{user.isAdmin ? '∞' : user.credits}</div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                 <span>{t('dashboard.renews')}</span>
              </div>
            </div>
            
            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-6xl">🚀</span>
                </div>
              <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">{t('dashboard.plan')}</div>
              <div className="text-4xl font-bold text-brand-400 mb-2">{user.plan}</div>
              <Link to="/pricing" className="text-sm text-zinc-300 hover:text-white border-b border-zinc-600 hover:border-white transition-colors">{t('dashboard.upgrade_link')}</Link>
            </div>

            <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-6xl">⚡</span>
                </div>
              <div className="text-zinc-400 text-sm font-medium mb-1 uppercase tracking-wider">{t('dashboard.status')}</div>
              <div className="flex items-center gap-3 mb-2 mt-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xl font-bold text-white">Online</span>
              </div>
              <div className="text-xs text-zinc-500">Orquestrador Multi-IA Ativo</div>
            </div>
          </div>

          <div id="start-creating">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-brand-500 rounded-full"></span>
                {t('dashboard.start')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/video" className="group relative overflow-hidden rounded-3xl h-64 border border-white/10 transition-all duration-500 hover:border-brand-500/50 hover:shadow-[0_0_30px_rgba(var(--brand-500),0.2)]">
                <img 
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                    alt="Video AI" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-brand-600 group-hover:border-brand-400 transition-colors">
                    <span className="text-2xl">🎥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{t('card.video.title')}</h3>
                  <p className="text-zinc-300 text-sm">{t('card.video.desc')}</p>
                </div>
              </Link>

              <Link to="/image" className="group relative overflow-hidden rounded-3xl h-64 border border-white/10 transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                 <img 
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" 
                    alt="Image AI" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-emerald-600 group-hover:border-emerald-400 transition-colors">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{t('card.image.title')}</h3>
                  <p className="text-zinc-300 text-sm">{t('card.image.desc')}</p>
                </div>
              </Link>

              <Link to="/thumbnail" className="group relative overflow-hidden rounded-3xl h-64 border border-white/10 transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                 <img 
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" 
                    alt="Thumbnail AI" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:bg-yellow-600 group-hover:border-yellow-400 transition-colors">
                    <span className="text-2xl">🖼️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{t('card.thumb.title')}</h3>
                  <p className="text-zinc-300 text-sm">{t('card.thumb.desc')}</p>
                </div>
              </Link>
            </div>
          </div>
      </div>
    </div>
  );
};
