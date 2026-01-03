
import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../types';
import { supabaseService } from '../services/supabaseService';
import { Button } from './Button';

export const PaymentMethodsTable: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<Partial<PaymentMethod> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    loadMethods();
  }, []);

  const loadMethods = async () => {
    const data = await supabaseService.db.getPaymentMethods();
    setMethods(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingMethod({
        id: Math.random().toString(36).substr(2, 9),
        name: '',
        detail: '',
        icon: '💳',
        isActive: true,
        bankName: '',
        accountNumber: '',
        beneficiary: ''
    });
    setIsNew(true);
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod({ ...method });
    setIsNew(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este método de pagamento?')) {
        await supabaseService.db.deletePaymentMethod(id);
        loadMethods();
    }
  };

  const handleSave = async () => {
    if (!editingMethod || !editingMethod.name) return;
    
    // Validate required fields roughly
    if (isNew) {
        await supabaseService.db.addPaymentMethod(editingMethod as PaymentMethod);
    } else {
        await supabaseService.db.updatePaymentMethod(editingMethod as PaymentMethod);
    }
    
    setEditingMethod(null);
    loadMethods();
  };

  if (loading) return <div className="text-zinc-500 animate-pulse">Carregando métodos...</div>;

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Configuração de Gateway / Bancos</h3>
            <Button onClick={handleAddNew} variant="secondary" className="text-xs py-2">
                + Adicionar Método
            </Button>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-zinc-500 uppercase bg-white/5">
                    <tr>
                        <th className="px-6 py-4">Ícone</th>
                        <th className="px-6 py-4">Nome do Método</th>
                        <th className="px-6 py-4">Detalhes (Front)</th>
                        <th className="px-6 py-4">Dados Bancários (Back)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {methods.map(m => (
                        <tr key={m.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-2xl">{m.icon}</td>
                            <td className="px-6 py-4 font-bold text-white">{m.name}</td>
                            <td className="px-6 py-4 text-zinc-400">{m.detail}</td>
                            <td className="px-6 py-4 text-xs font-mono text-zinc-500">
                                {m.bankName && <div>{m.bankName}</div>}
                                {m.accountNumber && <div>{m.accountNumber}</div>}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${m.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {m.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button onClick={() => handleEdit(m)} className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold">
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold">
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Modal Edição */}
        {editingMethod && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-[#0f0f0f] rounded-2xl border border-white/10 w-full max-w-2xl p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                        {isNew ? 'Adicionar Novo Método' : 'Editar Método de Pagamento'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                             <h4 className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Exibição (Frontend)</h4>
                             
                             <div>
                                <label className="text-xs text-zinc-500 uppercase block mb-1">Nome Visível</label>
                                <input 
                                    type="text" 
                                    className="glass-input w-full rounded-lg p-2 text-white"
                                    value={editingMethod.name}
                                    onChange={(e) => setEditingMethod({...editingMethod, name: e.target.value})}
                                    placeholder="Ex: Transferência Bancária"
                                />
                            </div>
                            
                            <div>
                                <label className="text-xs text-zinc-500 uppercase block mb-1">Subtítulo / Detalhe</label>
                                <input 
                                    type="text" 
                                    className="glass-input w-full rounded-lg p-2 text-white"
                                    value={editingMethod.detail}
                                    onChange={(e) => setEditingMethod({...editingMethod, detail: e.target.value})}
                                    placeholder="Ex: Aprovação em 24h"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="col-span-1">
                                    <label className="text-xs text-zinc-500 uppercase block mb-1">Ícone (Emoji)</label>
                                    <input 
                                        type="text" 
                                        className="glass-input w-full rounded-lg p-2 text-white text-center text-xl"
                                        value={editingMethod.icon}
                                        onChange={(e) => setEditingMethod({...editingMethod, icon: e.target.value})}
                                        placeholder="🏦"
                                        maxLength={4}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-zinc-500 uppercase block mb-1">Status</label>
                                    <select 
                                        className="glass-input w-full rounded-lg p-2.5 text-white bg-zinc-900"
                                        value={editingMethod.isActive ? 'true' : 'false'}
                                        onChange={(e) => setEditingMethod({...editingMethod, isActive: e.target.value === 'true'})}
                                    >
                                        <option value="true">Ativo</option>
                                        <option value="false">Inativo (Oculto)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Dados de Depósito (Backend)</h4>
                            
                            <div>
                                <label className="text-xs text-zinc-500 uppercase block mb-1">Nome do Banco / Wallet</label>
                                <input 
                                    type="text" 
                                    className="glass-input w-full rounded-lg p-2 text-white"
                                    value={editingMethod.bankName}
                                    onChange={(e) => setEditingMethod({...editingMethod, bankName: e.target.value})}
                                    placeholder="Ex: Banco BAI ou Binance"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase block mb-1">Número da Conta / IBAN / Endereço</label>
                                <input 
                                    type="text" 
                                    className="glass-input w-full rounded-lg p-2 text-white font-mono text-sm"
                                    value={editingMethod.accountNumber}
                                    onChange={(e) => setEditingMethod({...editingMethod, accountNumber: e.target.value})}
                                    placeholder="AO06..."
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase block mb-1">Beneficiário (Titular)</label>
                                <input 
                                    type="text" 
                                    className="glass-input w-full rounded-lg p-2 text-white"
                                    value={editingMethod.beneficiary}
                                    onChange={(e) => setEditingMethod({...editingMethod, beneficiary: e.target.value})}
                                    placeholder="Ex: João da Silva"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <Button variant="secondary" onClick={() => setEditingMethod(null)} className="flex-1">Cancelar</Button>
                        <Button onClick={handleSave} className="flex-1">
                            {isNew ? 'Criar Método' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
