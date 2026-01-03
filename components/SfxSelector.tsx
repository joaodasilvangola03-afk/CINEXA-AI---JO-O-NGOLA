
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_SFX } from '../constants';

interface SfxSelectorProps {
    selectedSfxId: string | null;
    onSelect: (id: string | null) => void;
}

export const SfxSelector: React.FC<SfxSelectorProps> = ({ selectedSfxId, onSelect }) => {
    const [activeCategory, setActiveCategory] = useState<string>('Todos');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const categories = ['Todos', ...Array.from(new Set(MOCK_SFX.map(sfx => sfx.category)))];

    const filteredSfx = activeCategory === 'Todos' 
        ? MOCK_SFX 
        : MOCK_SFX.filter(sfx => sfx.category === activeCategory);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const togglePreview = (e: React.MouseEvent, sfx: typeof MOCK_SFX[0]) => {
        e.stopPropagation();

        if (playingId === sfx.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setPlayingId(null);
            return;
        }

        if (audioRef.current) {
            audioRef.current.pause();
        }

        const audio = new Audio(sfx.previewUrl);
        audioRef.current = audio;
        audio.volume = 0.6;
        
        audio.onended = () => setPlayingId(null);
        audio.onerror = () => {
            setPlayingId(null);
            // alert("Erro ao reproduzir preview"); // Suppress alert for better UX
            console.warn("Audio preview failed for", sfx.name);
        };

        setPlayingId(sfx.id);
        audio.play().catch(e => {
            console.error("Playback failed", e);
            setPlayingId(null);
        });
    };

    return (
        <div className="bg-white/5 rounded-xl border border-white/5 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🔊</span>
                    <label className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                        Sound Effects (SFX)
                    </label>
                </div>
                {selectedSfxId && (
                    <button 
                        onClick={() => onSelect(null)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-500/10 px-2 py-1 rounded border border-red-500/20"
                    >
                        Remover SFX
                    </button>
                )}
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-all border ${
                            activeCategory === cat
                            ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                            : 'bg-zinc-800 text-zinc-500 border-transparent hover:bg-zinc-700 hover:text-zinc-300'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* SFX List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                {filteredSfx.map(sfx => (
                    <div 
                        key={sfx.id}
                        onClick={() => onSelect(sfx.id === selectedSfxId ? null : sfx.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all group relative overflow-hidden ${
                            selectedSfxId === sfx.id 
                            ? 'bg-indigo-500/10 border-indigo-500/50' 
                            : 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10'
                        }`}
                    >
                        {selectedSfxId === sfx.id && (
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                        )}

                        <button
                            onClick={(e) => togglePreview(e, sfx)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 border ${
                                playingId === sfx.id 
                                ? 'bg-indigo-500 text-white border-indigo-400 animate-pulse' 
                                : 'bg-zinc-800 text-zinc-400 border-white/5 group-hover:bg-zinc-700 group-hover:text-white'
                            }`}
                        >
                            {playingId === sfx.id ? '❚❚' : '▶'}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${selectedSfxId === sfx.id ? 'text-indigo-300' : 'text-zinc-300'}`}>
                                {sfx.name}
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                    {sfx.category}
                                </div>
                                {selectedSfxId === sfx.id && (
                                    <span className="text-[10px] text-indigo-400 font-bold">Selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
