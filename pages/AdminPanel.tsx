
import React, { useEffect } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { UserTable } from '../components/UserTable';
import { LogsTable } from '../components/LogsTable';
import { AiUsage } from '../components/AiUsage';
import { GenerateImage } from './GenerateImage';
import { PaymentMethodsTable } from '../components/PaymentMethodsTable'; // Importar novo componente

interface Props {
  user: User;
}

export const AdminPanel: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAdmin) {
        navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12 pb-20">
        <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
            <div>
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                    CINEXA AI <span className="text-zinc-500 text-2xl font-light ml-2">Admin</span>
                </h1>
                <p className="text-zinc-400">Painel de Controle e Gestão Financeira</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <div className="bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold border border-red-500/20 uppercase tracking-widest animate-pulse">
                    Live Environment
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                    v3.1.0-stable
                </div>
            </div>
        </header>

        <section className="animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl p-2 bg-indigo-500/20 rounded-lg">💳</span>
                <div>
                    <h2 className="text-2xl font-semibold text-white">Financeiro & Pagamentos</h2>
                    <p className="text-sm text-zinc-500">Gerencie as contas bancárias e métodos de pagamento visíveis no checkout.</p>
                </div>
            </div>
            <PaymentMethodsTable />
        </section>

        <section className="animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl p-2 bg-blue-500/20 rounded-lg">👥</span>
                <div>
                    <h2 className="text-2xl font-semibold text-white">Gestão de Usuários</h2>
                    <p className="text-sm text-zinc-500">Controle de acesso, planos e créditos manuais.</p>
                </div>
            </div>
            <UserTable />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="animate-[fadeIn_0.4s_ease-out]">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl p-2 bg-orange-500/20 rounded-lg">📜</span>
                    <h2 className="text-2xl font-semibold text-white">Logs do Sistema</h2>
                </div>
                <LogsTable />
            </section>

            <section className="animate-[fadeIn_0.5s_ease-out]">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl p-2 bg-emerald-500/20 rounded-lg">⚡</span>
                    <h2 className="text-2xl font-semibold text-white">Uso das IAs (Analytics)</h2>
                </div>
                <AiUsage />
            </section>
        </div>

        <section className="animate-[fadeIn_0.6s_ease-out] bg-[#050505] rounded-3xl border border-white/10 p-2 mt-12">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl p-2 bg-purple-500/20 rounded-lg">🎨</span>
                    <div>
                         <h2 className="text-2xl font-semibold text-white">Sandbox de Geração</h2>
                         <p className="text-sm text-zinc-500">Teste rápido de modelos sem descontar créditos reais.</p>
                    </div>
                </div>
                {/* Embedded simplified generation for admin testing */}
                <GenerateImage user={user} refreshUser={() => {}} />
            </div>
        </section>
    </div>
  );
};
