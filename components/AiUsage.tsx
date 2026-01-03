
import React, { useState, useEffect } from 'react';
import { AiUsageStats } from '../types';
import { supabaseService } from '../services/supabaseService';

export const AiUsage: React.FC = () => {
  const [usage, setUsage] = useState<AiUsageStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
        const data = await supabaseService.db.getAiUsage();
        setUsage(data);
        setLoading(false);
    };
    fetchUsage();
  }, []);

  if (loading) return <div className="text-zinc-500 animate-pulse">Calculando métricas...</div>;

  const total = (Object.values(usage) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(usage).map(([provider, count]) => (
            <div key={provider} className="glass-panel p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{provider}</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-zinc-300">
                        {(((count as number) / total) * 100).toFixed(0)}%
                    </span>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{count as number}</div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-500 group-hover:bg-indigo-400 transition-colors"
                        style={{ width: `${((count as number) / total) * 100}%` }}
                    ></div>
                </div>
            </div>
        ))}
        {total === 0 && (
            <div className="col-span-4 text-center p-8 bg-white/5 rounded-xl border border-white/5 border-dashed text-zinc-500">
                Sem dados de uso de IA registrados.
            </div>
        )}
    </div>
  );
};
