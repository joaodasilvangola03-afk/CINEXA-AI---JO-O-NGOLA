
import React from 'react';
import { Button } from '../components/Button';
import { PLANS } from '../constants';

interface Props {
  onLoginClick: () => void;
}

export const Landing: React.FC<Props> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center">
                     <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 to-purple-600 [mask-image:linear-gradient(white,white)] origin-border border-t-cyan-400 border-r-purple-500"></div>
                     <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <span className="text-xl font-bold tracking-tight font-['Outfit']">CINEXA AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                <a href="#features" className="hover:text-white transition-colors">Recursos</a>
                <a href="#engine" className="hover:text-white transition-colors">Multi-IA</a>
                <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={onLoginClick} className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                    Login
                </button>
                <Button onClick={onLoginClick} className="px-6 py-2 text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                    Começar Agora
                </Button>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="features" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-2/3 h-full bg-[url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-no-repeat opacity-20 mix-blend-screen mask-image-gradient-b"></div>
             <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617]"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent"></div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
            <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 animate-[fadeIn_0.5s_ease-out]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Nova Engine v3.0: Google Veo + Sora Integração
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 font-['Outfit'] leading-tight animate-[fadeIn_0.7s_ease-out]">
                Cinematic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">AI</span> <br />
                Professional Results.
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeIn_0.9s_ease-out]">
                A primeira plataforma SaaS que orquestra as melhores IAs do mundo (Sora, Veo, Midjourney) para criar vídeos e imagens de qualidade cinematográfica em um clique.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeIn_1.1s_ease-out]">
                <Button onClick={onLoginClick} className="w-full sm:w-auto px-8 py-4 text-lg">
                    Criar Conta Gratuita
                </Button>
                <button onClick={() => {
                    const el = document.getElementById('demo');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-medium flex items-center justify-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs">▶</span>
                    Ver Demo (1 min)
                </button>
            </div>

            {/* Dashboard Preview */}
            <div id="demo" className="mt-20 relative mx-auto max-w-5xl group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl transform rotate-x-12 group-hover:rotate-0 transition-transform duration-700 ease-out">
                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop" alt="Dashboard Preview" className="w-full opacity-50 hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Interface Profissional</h3>
                            <p className="text-zinc-400">Controle total sobre prompt, estilo e câmera.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Multi-AI Engine Section */}
      <section id="engine" className="py-24 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Orquestrador Multi-IA</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                    Não dependemos de apenas um modelo. A CINEXA AI escolhe automaticamente a melhor inteligência para o seu prompt.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Logos (Text Representation for Code) */}
                {['Google Veo', 'OpenAI Sora', 'Midjourney', 'Runway Gen-3', 'Stability AI', 'ElevenLabs'].map((ai, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-white/10 group-hover:scale-110 transition-all border border-white/5">
                            {['G', 'O', 'M', 'R', 'S', 'E'][i]}
                        </div>
                        <span className="text-sm font-semibold">{ai}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Planos Escaláveis</h2>
                <p className="text-zinc-400">De criadores independentes a estúdios de Hollywood.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Object.values(PLANS).map((plan) => (
                    <div key={plan.id} className={`p-8 rounded-3xl border flex flex-col ${plan.id === 'PREMIUM' ? 'bg-[#0f0f0f] border-indigo-500/50 relative' : 'bg-white/5 border-white/5'}`}>
                         {plan.id === 'PREMIUM' && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                MAIS POPULAR
                            </div>
                        )}
                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <div className="text-4xl font-bold mb-6">${plan.price}<span className="text-sm font-normal text-zinc-500">/mês</span></div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {plan.features.slice(0, 5).map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                                    <span className="text-indigo-400">✓</span> {feat}
                                </li>
                            ))}
                        </ul>
                        <Button variant={plan.id === 'PREMIUM' ? 'primary' : 'secondary'} onClick={onLoginClick} className="w-full">
                            Escolher {plan.name}
                        </Button>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#010205] text-zinc-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 text-white mb-4">
                    <span className="font-bold font-['Outfit'] text-lg">CINEXA AI</span>
                </div>
                <p className="max-w-xs">
                    Plataforma SaaS líder em geração de vídeo generativo para uso comercial e cinematográfico.
                </p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Produto</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Gerador de Vídeo</a></li>
                    <li><a href="#" className="hover:text-white">Gerador de Imagem</a></li>
                    <li><a href="#" className="hover:text-white">Preços</a></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                    <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                    <li><a href="#" className="hover:text-white">Privacidade</a></li>
                    <li><a href="#" className="hover:text-white">Licença Comercial</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 CINEXA AI Inc. Todos os direitos reservados.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <span>Twitter</span>
                <span>Instagram</span>
                <span>LinkedIn</span>
            </div>
        </div>
      </footer>
    </div>
  );
};
