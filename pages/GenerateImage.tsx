
import React, { useState, useMemo } from 'react';
import { User, Generation, PlanType } from '../types';
import { Button } from '../components/Button';
import { geminiService } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { IMAGE_MODELS, ASPECT_RATIOS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  user: User;
  refreshUser: () => void;
}

export const GenerateImage: React.FC<Props> = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [modelId, setModelId] = useState(IMAGE_MODELS[0].id);
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0].id);
  const [numImages, setNumImages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);

  const selectedModel = useMemo(() => 
    IMAGE_MODELS.find(m => m.id === modelId) || IMAGE_MODELS[0]
  , [modelId]);

  const cost = numImages; // 1 credit per image

  const handleGenerate = async () => {
    setError(null);
    setResults([]);
    
    if (!prompt.trim()) return;

    if (user.credits < cost && !user.isAdmin) {
        setError(`Créditos insuficientes. Custo: ${cost} créditos.`);
        return;
    }

    if (selectedModel.isPremium && user.plan === PlanType.FREE && !user.isAdmin) {
        setError(`O modelo ${selectedModel.name} é exclusivo para planos Plus e Premium.`);
        return;
    }

    setIsLoading(true);
    try {
        // Request multiple images
        const imgUrls = await geminiService.generateImage(prompt, modelId, aspectRatio, numImages);
        
        // Create Generation records for EACH image
        // This ensures they all appear in history as individual accessible items
        const generationPromises = imgUrls.map(url => {
            const newGen: Generation = {
                id: Math.random().toString(36).substr(2, 9),
                userId: user.id,
                type: 'IMAGE',
                prompt: `${prompt} ${numImages > 1 ? '(Variação)' : ''}`,
                status: 'COMPLETED',
                url: url,
                thumbnailUrl: url,
                createdAt: new Date().toISOString(),
                settings: { modelId, aspectRatio }
            };
            return supabaseService.db.createGeneration(newGen);
        });

        await Promise.all(generationPromises);
        
        if (!user.isAdmin) {
            await supabaseService.db.updateUserCredits(user.id, user.credits - cost);
            refreshUser();
        }

        setResults(imgUrls);
        
        // Scroll to results
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    } catch (e) {
        setError("Erro ao gerar imagens.");
    } finally {
        setIsLoading(false);
    }
  };

  const getProviderBadgeColor = (provider: string) => {
    switch(provider) {
        case 'Midjourney': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'OpenAI': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Google DeepMind': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'Stability AI': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'Black Forest': return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
        default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3">{t('gen.image.title')}</h1>
            <p className="text-zinc-400">{t('gen.image.subtitle')}</p>
        </div>

        <div className="glass-panel rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Model Selector */}
                <div>
                    <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-2">{t('gen.model')}</label>
                    <div className="relative">
                        <select 
                            value={modelId}
                            onChange={(e) => setModelId(e.target.value)}
                            className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer text-base font-medium"
                        >
                            {IMAGE_MODELS.map(m => (
                                <option key={m.id} value={m.id} className="bg-zinc-900 text-zinc-300">
                                    {m.name} {m.version} {m.isPremium ? '★' : ''} - {m.provider}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                    </div>
                    <div className="flex items-center gap-3 mt-3 bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider ${getProviderBadgeColor(selectedModel.provider)}`}>
                            {selectedModel.provider.toUpperCase()}
                        </span>
                        <span className="text-xs text-zinc-400 truncate">{selectedModel.description}</span>
                    </div>
                </div>

                {/* Settings Column */}
                <div className="space-y-6">
                     {/* Number of Images */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-2">Quantidade de Variações</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setNumImages(num)}
                                    className={`p-2 rounded-lg border text-sm font-bold transition-all ${
                                        numImages === num 
                                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                                    }`}
                                >
                                    {num}x
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Aspect Ratio Selector */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 uppercase tracking-wide mb-2">{t('gen.aspect')}</label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {ASPECT_RATIOS.map((ratio) => (
                                <button
                                    key={ratio.id}
                                    onClick={() => setAspectRatio(ratio.id)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                        aspectRatio === ratio.id 
                                        ? 'bg-white/10 border-white text-white' 
                                        : 'bg-white/5 border-white/5 text-zinc-500 hover:bg-white/10'
                                    }`}
                                    title={ratio.desc}
                                >
                                    <span className="text-xs font-bold">{ratio.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 relative">
                 <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 rounded text-[10px] text-zinc-500 uppercase tracking-widest font-bold border border-white/5 pointer-events-none">
                    AI Prompt
                </div>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Descreva a imagem detalhadamente... (Ex: Um astronauta andando em uma cidade cyberpunk, luzes neon, reflexos de chuva, 8k)"
                    className="glass-input w-full rounded-xl p-6 pt-10 text-white placeholder-zinc-600 focus:outline-none min-h-[120px] text-lg leading-relaxed resize-none"
                />
            </div>
            
            {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center">{error}</div>}
            
            <div className="flex flex-col items-center gap-4">
                <Button onClick={handleGenerate} isLoading={isLoading} className="w-full py-4 text-lg shadow-lg shadow-indigo-900/20">
                    {isLoading ? t('gen.loading') : `Gerar ${numImages} ${numImages > 1 ? 'Variações' : 'Imagem'} (${cost} Créditos)`}
                </Button>
                <p className="text-xs text-zinc-600">
                    Processado via {selectedModel.provider} Cloud
                </p>
            </div>
        </div>

        {/* Results Grid - Shown immediately */}
        {results.length > 0 && (
            <div className="space-y-4 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-indigo-400">✨</span> Resultados Gerados
                </h2>
                <div className={`grid gap-6 ${results.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {results.map((url, idx) => (
                        <div key={idx} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                             <img 
                                src={url} 
                                alt={`Result ${idx + 1}`} 
                                className="w-full h-auto object-contain max-h-[600px]"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                                <span className="text-white font-bold text-sm bg-black/50 px-3 py-1 rounded backdrop-blur-md">Variação {idx + 1}</span>
                                <a 
                                    href={url} 
                                    download={`cinexa_gen_${idx}.jpg`} 
                                    target="_blank"
                                    className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Baixar
                                </a>
                             </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                     <Button variant="secondary" onClick={() => navigate('/history')}>
                        Ver na Galeria
                     </Button>
                </div>
            </div>
        )}
    </div>
  );
};
