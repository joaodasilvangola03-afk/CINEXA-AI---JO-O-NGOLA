
import React, { useState, useEffect } from 'react';
import { User, PlanType } from '../types';
import { supabaseService } from '../services/supabaseService';
import { Button } from './Button';

export const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await supabaseService.db.getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    await supabaseService.db.updateUser(editingUser);
    setEditingUser(null);
    loadUsers();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-zinc-500 animate-pulse">Carregando usuários...</div>;

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#0a0a0a] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto">
                <input 
                    type="text" 
                    placeholder="Buscar usuário (ID, Email)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-input pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64"
                />
                <span className="absolute left-3 top-2.5 text-zinc-500">🔍</span>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-white/5">
                    <tr>
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Plano</th>
                        <th className="px-6 py-4">Créditos</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-zinc-800" />
                                <div>
                                    <div className="font-medium text-white">{u.name}</div>
                                    <div className="text-xs text-zinc-500">{u.email}</div>
                                    <div className="text-[9px] text-zinc-600 font-mono">{u.id}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${u.isActive !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {u.isActive !== false ? 'Ativo' : 'Bloqueado'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                                    u.plan === 'PREMIUM' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' :
                                    u.plan === 'PLUS' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/30'
                                }`}>
                                    {u.plan}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-zinc-300 font-mono">
                                {u.credits.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => setEditingUser({...u})}
                                    className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Edit Modal */}
        {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 w-full max-w-lg p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Editar Usuário</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-zinc-400 uppercase block mb-1">Status</label>
                                <select 
                                    className="glass-input w-full rounded-lg p-2 text-white bg-zinc-900"
                                    value={editingUser.isActive !== false ? 'true' : 'false'}
                                    onChange={(e) => setEditingUser({...editingUser, isActive: e.target.value === 'true'})}
                                >
                                    <option value="true">Ativo</option>
                                    <option value="false">Bloqueado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 uppercase block mb-1">Plano</label>
                                <select 
                                    className="glass-input w-full rounded-lg p-2 text-white bg-zinc-900"
                                    value={editingUser.plan}
                                    onChange={(e) => setEditingUser({...editingUser, plan: e.target.value as PlanType})}
                                >
                                    {Object.values(PlanType).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-zinc-400 uppercase block mb-1">Créditos</label>
                            <input 
                                type="number" 
                                className="glass-input w-full rounded-lg p-2 text-white"
                                value={editingUser.credits}
                                onChange={(e) => setEditingUser({...editingUser, credits: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <Button variant="secondary" onClick={() => setEditingUser(null)} className="flex-1">Cancelar</Button>
                        <Button onClick={handleSaveUser} className="flex-1">Salvar</Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
