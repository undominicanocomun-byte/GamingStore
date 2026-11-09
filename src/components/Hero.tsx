import React from 'react';
import { ShieldCheck, Truck, Zap, Flame, Award, ArrowRight, Cpu } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setCurrentView, setFilters, formatPrice } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0e121d] via-[#090a10] to-[#090a0f] border-b border-cyan-950/40">
      {/* Background cyber grid & glow effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-tech tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
              <span>Lanzamiento Exclusivo 2026: Serie NVIDIA Blackwell & Ryzen 3D V-Cache</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight font-heading">
              DOMINA EL JUEGO CON <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                POTENCIA EXTREMA
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              La tienda definitiva de los gamers profesionales. Ensamblamos rigs de máxima categoría, componentes verificados en banco de estrés y periféricos de grado de competición con garantía directa.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, category: 'gpus', search: '' }));
                  setCurrentView('catalog');
                }}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold font-heading text-sm rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all flex items-center space-x-2.5 cursor-pointer"
              >
                <span>EXPLORAR SERIE RTX 50</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('pc-builder')}
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 font-extrabold font-heading text-sm rounded-xl border border-cyan-500/40 hover:border-cyan-400 shadow-lg transition-all flex items-center space-x-2.5 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>ARMAR MI PC GAMER</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('ofertas-flash');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black font-extrabold font-heading text-sm rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center space-x-2 cursor-pointer hover:scale-105"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>OFERTAS FLASH (-30%)</span>
              </button>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-tech">100%</div>
                <div className="text-xs text-slate-400 font-medium">Garantía Directa</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-tech">24/48h</div>
                <div className="text-xs text-slate-400 font-medium">Despacho Express</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-tech">0%</div>
                <div className="text-xs text-slate-400 font-medium">Cuotas sin Interés</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#101322] border border-cyan-900/60 p-6 shadow-2xl backdrop-blur-sm">
              <div className="absolute -top-3 -right-3 bg-red-600 text-white font-tech font-bold text-xs uppercase px-3 py-1 rounded-full shadow-lg tracking-wider animate-pulse">
                TOP TIER 2026
              </div>

              <div className="aspect-[4/3] rounded-xl overflow-hidden relative mb-4 bg-slate-950">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
                  alt="NEXUS VALKYRIE TITAN RTX 5090"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-tech">
                      RIG INSIGNIA DE TORNEO
                    </span>
                    <h3 className="text-lg font-bold text-white font-heading">
                      NEXUS VALKYRIE TITAN RTX 5090
                    </h3>
                  </div>
                </div>
              </div>

              {/* Specs highlights */}
              <div className="space-y-2 text-xs text-slate-300 pb-4 border-b border-slate-800">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">GPU:</span>
                  <span className="font-semibold text-white">NVIDIA GeForce RTX 5090 32GB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">CPU:</span>
                  <span className="font-semibold text-white">AMD Ryzen 7 7800X3D (3D V-Cache)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">RAM & SSD:</span>
                  <span className="font-semibold text-white">64GB DDR5 + 4TB NVMe Gen4</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <span className="text-[11px] text-slate-400 block">Precio exclusivo online:</span>
                  <span className="text-2xl font-extrabold text-cyan-400 font-tech">
                    {formatPrice(4399.99)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, category: 'prebuilt-pcs', search: '' }));
                    setCurrentView('catalog');
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-tech text-xs rounded-lg transition-colors cursor-pointer"
                >
                  VER DETALLES
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Trust Badges Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-cyan-950/40">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <Truck className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">Envío Blindado</div>
              <div className="text-slate-400 text-[11px]">Seguro 100% contra daños</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">3 Años de Garantía</div>
              <div className="text-slate-400 text-[11px]">Reemplazo directo de fábrica</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <Zap className="w-6 h-6 text-yellow-400 shrink-0" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">Prueba de Estrés 24h</div>
              <div className="text-slate-400 text-[11px]">Cero throttling garantizado</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <Award className="w-6 h-6 text-purple-400 shrink-0" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">Distribuidores Oficiales</div>
              <div className="text-slate-400 text-[11px]">NVIDIA, AMD, ASUS, Razer</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
