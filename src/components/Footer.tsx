import React, { useState } from 'react';
import { Gamepad2, ShieldCheck, Mail, Send, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setFilters, setCurrentView, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Ingresa un correo electrónico válido', 'error');
      return;
    }
    setSubscribed(true);
    showToast('¡Te has suscrito a las ofertas exclusivas y drops de hardware!', 'success');
  };

  const navigateCategory = (cat: any) => {
    setFilters(prev => ({ ...prev, category: cat, search: '' }));
    setCurrentView('catalog');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080d] border-t border-cyan-950/60 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#090a10] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-heading text-xl font-bold tracking-wider text-white">
                NEXUS<span className="text-cyan-400">GAMING</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Tu portal de referencia para hardware de ultra alto rendimiento, estaciones de trabajo de simulación y ensambles artesanales probados en banco de estrés continuo.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-slate-400">
              <span className="text-[11px] font-tech text-cyan-400 uppercase font-bold">
                DISTRIBUIDOR AUTORIZADO:
              </span>
              <span className="text-[11px] font-mono text-slate-300">NVIDIA &bull; AMD &bull; ASUS ROG &bull; CORSAIR</span>
            </div>
          </div>

          {/* Col 3: Hardware Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-sm tracking-wide">
              HARDWARE TOP
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigateCategory('gpus')} className="hover:text-cyan-400 transition-colors">
                  Tarjetas Gráficas RTX 50 & 40
                </button>
              </li>
              <li>
                <button onClick={() => navigateCategory('cpus')} className="hover:text-cyan-400 transition-colors">
                  Procesadores Ryzen 3D V-Cache
                </button>
              </li>
              <li>
                <button onClick={() => navigateCategory('monitors')} className="hover:text-cyan-400 transition-colors">
                  Monitores QD-OLED 240Hz
                </button>
              </li>
              <li>
                <button onClick={() => navigateCategory('prebuilt-pcs')} className="hover:text-cyan-400 transition-colors">
                  PCs Armadas de Competición
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('pc-builder')} className="text-cyan-400 font-bold hover:underline">
                  Configurador de PC Interactivo &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Soporte & Garantías */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-sm tracking-wide">
              SOPORTE Y SERVICIOS
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3 Años Garantía Directa</span>
              </li>
              <li>Envíos Blindados Asegurados</li>
              <li>Soporte Técnico Especializado 24/7</li>
              <li>Facturación Fiscal Digital Inmediata</li>
              <li>Devoluciones sin costo hasta 30 días</li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-sm tracking-wide">
              DROPS & NOVEDADES
            </h4>
            <p className="text-[11px] text-slate-400">
              Recibe alertas anticipadas de stock de la serie 50 y cupones de descuento exclusivos.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>¡Suscrito a la lista VIP!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu-correo@gamer.com"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white pl-8 pr-3 py-2 rounded-lg focus:border-cyan-400 focus:outline-none"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-tech font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>UNIRSE AL VIP</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; 2026 NEXUS GAMING STORE &bull; Todos los derechos reservados &bull; Plataforma de E-Commerce para Gamers de Alto Rendimiento.
          </div>

          <div className="flex items-center space-x-2 font-mono text-[10px] text-slate-400">
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">VISA</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">MASTERCARD</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">PAYPAL</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">BINANCE PAY (USDT)</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">SPEI</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
