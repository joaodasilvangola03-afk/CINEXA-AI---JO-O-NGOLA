
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Generation, PlanType } from '../types';
import { Button } from '../components/Button';
import { geminiService } from '../services/geminiService';
import { supabaseService } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { THUMBNAIL_MODELS } from '../constants';

interface Props {
  user: User;
  refreshUser: () => void;
}

const THUMBNAIL_STYLES = [
  { id: 'gaming', name: 'Gaming', desc: 'Neon, contraste alto, energético', color: '#ec4899' },
  { id: 'vlog', name: 'Vlog / Lifestyle', desc: 'Brilhante, rostos focados, limpo', color: '#facc15' },
  { id: 'business', name: 'Business / Tech', desc: 'Profissional, azul escuro, minimalista', color: '#3b82f6' },
  { id: 'news', name: 'Notícias / Impacto', desc: 'Sério, vermelho alerta, texto grande', color: '#ef4444' },
  { id: 'tutorial', name: 'Tutorial / How-To', desc: 'Instrutivo, setas, foco no objeto', color: '#10b981' },
];

export const GenerateThumbnail: React.FC<Props> = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [bgPrompt, setBgPrompt] = useState('');
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(THUMBNAIL_STYLES[0].id);
  const [selectedModelId, setSelectedModelId] = useState(THUMBNAIL_MODELS[0].id);
  
  // Controls how text is rendered
  const [renderTextOnAi, setRenderTextOnAi] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const styleData = THUMBNAIL_STYLES.find(s => s.id === selectedStyle) || THUMBNAIL_STYLES[0];
  const selectedModel = useMemo(() => THUMBNAIL_MODELS.find(m => m.id === selectedModelId) || THUMBNAIL_MODELS[0], [selectedModelId]);

  const handleGenerate = async () => {
    setError(null);
    setResultUrl(null);

    if (!bgPrompt.trim()) {
        setError("Descreva o fundo da sua thumbnail.");
        return;
    }
    if (!titleText.trim() && !renderTextOnAi) {
        setError("Adicione um título para o overlay ou selecione 'Texto via IA'.");
        return;
    }

    if (user.credits < 1 && !user.isAdmin) {
        setError("Créditos insuficientes.");
        return;
    }

    if (selectedModel.isPremium && user.plan === PlanType.FREE && !user.isAdmin) {
        setError(`O modelo ${selectedModel.name} é exclusivo para planos Plus e Premium.`);
        return;
    }

    setIsLoading(true);
    try {
        // Use the new service parameter 'burnText' which controls prompt engineering
        const thumbUrl = await geminiService.generateThumbnail(
            bgPrompt, 
            titleText, 
            styleData.name, 
            selectedModelId, 
            renderTextOnAi
        );
        
        setResultUrl(thumbUrl);
        
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100);

        const newGen: Generation = {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            type: 'THUMBNAIL',
            prompt: `Thumbnail (${selectedModel.name}): ${titleText} - ${bgPrompt}`,
            status: 'COMPLETED',
            url: thumbUrl,
            thumbnailUrl: thumbUrl,
            createdAt: new Date().toISOString(),
            settings: { 
                modelId: selectedModelId,
                style: selectedStyle,
                textOverlay: {
                    title: titleText,
                    subtitle: subtitleText,
                    colorTheme: styleData.color
                }
            }
        };

        await supabaseService.db.createGeneration(newGen).catch(err => console.warn("Storage warning:", err));
        refreshUser();

    } catch (e) {
        setError("Erro ao criar thumbnail. Tente novamente.");
    } finally {
        setIsLoading(false);
    }
  };

  // Function to merge image + text onto canvas for download
  const handleDownloadComposite = async () => {
    if (!resultUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load Image
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = resultUrl;
    
    img.onload = () => {
        // Set canvas to HD resolution (16:9)
        canvas.width = 1280;
        canvas.height = 720;

        // Draw Background
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // If text was NOT rendered by AI, we draw it here
        if (!renderTextOnAi && titleText) {
            
            // Text Config
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 15;
            ctx.lineJoin = 'round';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 20;

            // Draw Title (Rotated slightly for impact)
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-2 * Math.PI / 180);
            
            ctx.font = '900 120px "Outfit", sans-serif';
            ctx.strokeText(titleText.toUpperCase(), 0, 0);
            ctx.fillText(titleText.toUpperCase(), 0, 0);
            
            // Draw Subtitle
            if (subtitleText) {
                ctx.restore(); // reset rotation for subtitle
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2 + 120);
                
                // Background box for subtitle
                const subFont = 'bold 60px "Inter", sans-serif';
                ctx.font = subFont;
                const textWidth = ctx.measureText(subtitleText).width;
                const padding = 20;
                
                ctx.fillStyle = styleData.color; // Style Color
                ctx.shadowColor = 'transparent';
                ctx.fillRect(-(textWidth/2) - padding, -40, textWidth + (padding*2), 80);
                
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.fillText(subtitleText, 0, 15);
            }
            ctx.restore();
        }

        // Trigger Download
        const link = document.createElement('a');
        link.download = `cinexa_thumbnail_${Date.now()}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    };

    img.onerror = () => {
        alert("Erro ao carregar imagem para composição. Tente baixar a versão simples.");
    };
  };

  const getProviderBadgeColor = (provider: string) => {
    switch(provider) {
        case 'Ideogram': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
        case 'Midjourney': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'Black Forest': return 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30';
        case 'OpenAI': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Thumbnail Maker ⚡</h1>
            <p className="text-zinc-400">Crie capas virais para YouTube com IA e tipografia otimizada.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-6">
            
            {/* AI Model Selector */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">1</span>
                    Modelo de Inteligência
                </h3>
                <div className="space-y-3">
                    <div className="relative">
                        <select 
                            value={selectedModelId}
                            onChange={(e) => setSelectedModelId(e.target.value)}
                            className="glass-input w-full rounded-xl p-3 text-white appearance-none cursor-pointer text-lg font-medium"
                        >
                            {THUMBNAIL_MODELS.map(m => (
                                <option key={m.id} value={m.id} className="bg-zinc-900 text-zinc-300">
                                    {m.name} {m.version} {m.isPremium ? '★' : ''} - {m.provider}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">▼</div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 bg-white/5 p-3 rounded-lg border border-white/5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded border tracking-wider ${getProviderBadgeColor(selectedModel.provider)}`}>
                            {selectedModel.provider.toUpperCase()}
                        </span>
                         <span className="text-xs text-zinc-400">{selectedModel.description}</span>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
                    Estilo & Fundo
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                    {THUMBNAIL_STYLES.map(style => (
                        <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                                selectedStyle === style.id 
                                ? 'bg-white/10 border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                : 'bg-black/20 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="w-full h-1 rounded-full mb-2" style={{ backgroundColor: style.color }}></div>
                            <div className="font-bold text-sm text-white">{style.name}</div>
                            <div className="text-[10px] text-zinc-500 truncate">{style.desc}</div>
                        </button>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase">Cenário / Imagem de Fundo</label>
                    <textarea 
                        value={bgPrompt}
                        onChange={(e) => setBgPrompt(e.target.value)}
                        placeholder="Ex: Um setup gamer futurista com luzes neon roxas, expressão de surpresa, fundo desfocado..."
                        className="glass-input w-full rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none min-h-[80px] text-sm resize-none"
                    />
                </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs">3</span>
                    Tipografia & Renderização
                </h3>
                
                {/* Render Mode Toggle */}
                <div className="bg-white/5 p-1 rounded-lg flex mb-4">
                    <button 
                        onClick={() => setRenderTextOnAi(false)}
                        className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${!renderTextOnAi ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Overlay (Recomendado)
                    </button>
                    <button 
                        onClick={() => setRenderTextOnAi(true)}
                        className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${renderTextOnAi ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Texto via IA (Beta)
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Texto Principal (Chamativo)</label>
                        <input 
                            type="text"
                            value={titleText}
                            onChange={(e) => setTitleText(e.target.value)}
                            placeholder="Ex: INACREDITÁVEL!"
                            maxLength={25}
                            className="glass-input w-full rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none text-lg font-bold tracking-wide"
                        />
                         <p className="text-[10px] text-zinc-600 text-right">{titleText.length}/25 caracteres</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase">Texto Secundário (Opcional)</label>
                        <input 
                            type="text"
                            value={subtitleText}
                            onChange={(e) => setSubtitleText(e.target.value)}
                            placeholder="Ex: Ganhei $1M em 1 dia"
                            maxLength={40}
                            className="glass-input w-full rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

             {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">{error}</div>}

            <Button onClick={handleGenerate} isLoading={isLoading} className="w-full py-4 text-lg font-bold shadow-lg shadow-indigo-900/20">
                {isLoading ? 'Renderizando Thumbnail...' : 'Gerar Thumbnail (1 Crédito)'}
            </Button>
        </div>

        {/* Right Column: Live Preview & Result */}
        <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Hidden Canvas for Composition */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Final Result Section */}
            {resultUrl ? (
                <div className="bg-[#0a0a0a] rounded-2xl border border-indigo-500/50 p-6 shadow-[0_0_50px_rgba(79,70,229,0.15)] animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="text-indigo-400">✨</span> Resultado Gerado
                        </h3>
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">100% IA</span>
                    </div>

                    <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                        {/* Display Result based on mode */}
                        <div className="relative w-full aspect-video">
                            <img 
                                src={resultUrl} 
                                alt="Generated Thumbnail" 
                                className="w-full h-full object-cover"
                            />
                            
                            {/* If Overlay Mode, preview text on top using HTML for immediate feedback */}
                            {!renderTextOnAi && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
                                    <h2 
                                        className="text-4xl md:text-5xl font-black text-white uppercase leading-none mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.9)]"
                                        style={{ 
                                            textShadow: `3px 3px 0px black, -1px -1px 0 black`,
                                            transform: 'rotate(-2deg)'
                                        }}
                                    >
                                        {titleText}
                                    </h2>
                                    {subtitleText && (
                                        <div className="mt-2 bg-black text-white font-bold px-3 py-1 text-lg rounded transform rotate-1 border-b-4" style={{ borderColor: styleData.color }}>
                                            {subtitleText}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                         <Button variant="primary" onClick={handleDownloadComposite} className="w-full py-3">
                            ⬇️ Baixar Thumbnail Final {renderTextOnAi ? '' : '(Composto)'}
                         </Button>
                         <p className="text-xs text-zinc-500 text-center">
                            {renderTextOnAi ? 'O texto foi gerado pela IA na imagem.' : 'O sistema irá combinar a imagem e o texto ao baixar.'}
                         </p>
                         
                         <div className="flex gap-3 mt-2">
                             <Button variant="secondary" onClick={() => navigate('/history')} className="flex-1 text-sm">
                                Galeria
                             </Button>
                             <Button variant="secondary" onClick={() => {setResultUrl(null); window.scrollTo({top:0, behavior:'smooth'})}} className="flex-1 text-sm">
                                Nova
                             </Button>
                         </div>
                    </div>
                </div>
            ) : (
                <div className="sticky top-6">
                    <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 p-4 shadow-2xl opacity-80">
                        <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest flex justify-between">
                            <span>Preview (Simulação)</span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white">16:9</span>
                        </h3>

                        {/* Simulation Canvas */}
                        <div className="aspect-video w-full bg-zinc-800 rounded-lg relative overflow-hidden group shadow-inner">
                            {/* Background Placeholder */}
                            <div className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity" style={{ 
                                backgroundImage: 'url(https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000)',
                                filter: 'blur(2px)'
                            }}></div>
                            
                            {/* Dynamic Overlay based on Style */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                                
                                {/* Title Render */}
                                <h2 
                                    className="text-5xl md:text-6xl font-black text-white uppercase leading-none mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] transition-all duration-300"
                                    style={{ 
                                        textShadow: `4px 4px 0px ${styleData.color}, -2px -2px 0 #000`,
                                        transform: 'rotate(-2deg)'
                                    }}
                                >
                                    {titleText || "SEU TÍTULO"}
                                </h2>

                                {/* Subtitle Render */}
                                {subtitleText && (
                                    <span className="text-xl md:text-2xl font-bold text-white bg-black/80 px-4 py-1 rounded-lg transform rotate-1 border-b-4" style={{ borderColor: styleData.color }}>
                                        {subtitleText}
                                    </span>
                                )}
                            </div>

                            {/* Style Badge overlay */}
                            <div className="absolute top-4 left-4 flex gap-2">
                                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-zinc-300">
                                    {styleData.name}
                                </div>
                                <div className={`backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-bold tracking-wide ${getProviderBadgeColor(selectedModel.provider)}`}>
                                    {selectedModel.provider}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                            <h4 className="text-xs font-bold text-white mb-2">Modo Selecionado: {renderTextOnAi ? 'Texto via IA' : 'Overlay (Manual)'}</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                {renderTextOnAi 
                                    ? "A IA tentará escrever o texto na imagem. Ideal para modelos como Ideogram. Pode haver erros ortográficos." 
                                    : "A IA criará um fundo limpo e o sistema adicionará o texto perfeito na hora do download. Mais seguro."}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
