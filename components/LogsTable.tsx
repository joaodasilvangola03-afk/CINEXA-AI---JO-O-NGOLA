
import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';
import { supabaseService } from '../services/supabaseService';

export const LogsTable: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
        const data = await supabaseService.db.getLogs();
        setLogs(data);
        setLoading(false);
    };
    fetchLogs();
  }, []);

  if (loading) return <div className="text-zinc-500 animate-pulse">Carregando logs...</div>;

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden max-h-96 flex flex-col">
        <div className="overflow-y-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Usuário ID</th>
                        <th className="px-6 py-3">AI Engine</th>
                        <th className="px-6 py-3">Modo</th>
                        <th className="px-6 py-3">Custo</th>
                        <th className="px-6 py-3">Saldo Final</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-3 text-zinc-400 font-mono text-xs">
                                {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-3 text-zinc-300 font-mono text-xs">
                                {log.userId}
                            </td>
                            <td className="px-6 py-3">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                    log.aiUsed === 'gemini' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                    log.aiUsed === 'openai' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                    'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'
                                }`}>
                                    {log.aiUsed}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-zinc-300 capitalize text-xs">
                                {log.mode}
                            </td>
                            <td className="px-6 py-3 text-red-400 font-medium text-xs">
                                -{log.cost}
                            </td>
                            <td className="px-6 py-3 text-zinc-300 font-bold text-xs">
                                {log.creditsLeft}
                            </td>
                        </tr>
                    ))}
                    {logs.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                                Nenhum registro de uso encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};
