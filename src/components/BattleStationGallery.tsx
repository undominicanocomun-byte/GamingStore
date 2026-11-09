import React, { useState } from 'react';
import { 
  Monitor, 
  Sparkles, 
  Layers, 
  ShoppingCart, 
  Wrench, 
  Check, 
  ShieldCheck, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface BattleStation {
  id: string;
  title: string;
  tagline: string;
  image: string;
  aesthetic: string;
  fpsScore: string;
  targetResolution: string;
  componentIds: string[];
  features: string[];
}

const SETUPS: BattleStation[] = [
  {
    id: 'setup-stealth',
    title: 'CYBERPUNK STEALTH TITAN',
    tagline: 'Máxima potencia silenciosa con refrigeración líquida custom y RTX 5090 TUF',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    aesthetic: 'Dark Industrial RGB Matrix',
    fpsScore: '144+ FPS en 4K Ultra',
    targetResolution: '3840 x 2160 UHD',
    componentIds: ['prod-rtx-5090', 'prod-ryzen-7800x3d', 'prod-case-h9-flow', 'prod-cooler-kraken-elite'],
    features: [
      'Overclock certificado de fábrica (+8% IPC)',
      'Tubos de refrigeración con líquido reactivo UV',
      'Certificación térmica acústica < 28dB bajo estrés'
    ]
  },
  {
    id: 'setup-white',
    title: 'PURE WHITE OLED 360HZ',
    tagline: 'Estética minimalista blanca para creadores de contenido y eSports de élite',
    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80',
    aesthetic: 'All-White Clean Architecture',
    fpsScore: '360+ FPS Competitivo',
    targetResolution: '2560 x 1440 QHD 360Hz',
    componentIds: ['prod-rtx-4080-super', 'prod-i9-14900ks', 'prod-ram-trident-32', 'prod-monitor-rog-oled'],
    features: [
      'Cables trenzados Sleeved blancos modulares',
      'Panel lateral templado panorámico Dual-Chamber',
      'RGB Aura Sync sincronizado con barra ambilight'
    ]
  },
  {
    id: 'setup-tournament',
    title: 'TOURNAMENT APEX ARENA',
    tagline: 'Latencia submilisegundo diseñada específicamente para streamers y CS2 / Valorant',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    aesthetic: 'Cyberpunk Neon Amber & Cyan',
    fpsScore: '500+ FPS eSports Ready',
    targetResolution: '1920 x 1080 FHD 540Hz',
    componentIds: ['prod-mouse-viper-v3', 'prod-keyboard-apex-pro', 'prod-headset-arctis-nova'],
    features: [
      'Sensor óptico 30,000 DPI con polling rate 8000Hz',
      'Switches OmniPoint magnéticos con Rapid Trigger',
      'Drivers optimizados con latencia ultra baja (NVIDIA Reflex)'
    ]
  }
];

export const BattleStationGallery: React.FC = () => {
  const { allProducts, addToCart, setCurrentView, showToast, formatPrice } = useStore();
  const [activeSetupId, setActiveSetupId] = useState<string>(SETUPS[0].id);

  const activeSetup = SETUPS.find(s => s.id === activeSetupId) || SETUPS[0];

  const productSource = allProducts && allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS;

  const matchedProducts = activeSetup.componentIds
    .map(id => productSource.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const setupTotal = matchedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddSetupToCart = () => {
    matchedProducts.forEach(prod => addToCart(prod, 1));
    showToast(`¡Configuración completa "${activeSetup.title}" agregada al carrito!`, 'success');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs text-cyan-400 font-tech uppercase tracking-widest font-bold mb-2">
            <Monitor className="w-4 h-4" />
            <span>GALERÍA DE BATTLESTATIONS &bull; PRO SETUPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            SETUPS INSPIRACIONALES LISTOS PARA JUGAR
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Diseñados por ingenieros de esports. Componentes ensamblados sin cuellos de botella, con balance térmico y calibración estética profesional.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          {SETUPS.map(setup => (
            <button
              key={setup.id}
              onClick={() => setActiveSetupId(setup.id)}
              className={`px-3 py-2 rounded-lg text-xs font-tech font-bold transition-all ${
                activeSetupId === setup.id
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {setup.title.split(' ')[0]} {setup.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase Panel */}
      <div className="bg-[#101422] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left: Showcase Photo with Hotspots */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[520px] bg-slate-950 overflow-hidden group">
          <img
            src={activeSetup.image}
            alt={activeSetup.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101422] via-transparent to-transparent opacity-80 lg:opacity-40"></div>

          {/* Floating Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            <span className="bg-black/75 backdrop-blur-md border border-cyan-500/50 text-cyan-300 text-xs font-tech font-extrabold px-3 py-1 rounded-lg">
              {activeSetup.aesthetic}
            </span>
            <span className="bg-black/75 backdrop-blur-md border border-amber-500/50 text-amber-300 text-xs font-tech font-extrabold px-3 py-1 rounded-lg flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>{activeSetup.fpsScore}</span>
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 lg:hidden bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800">
            <h3 className="text-lg font-extrabold font-heading text-white">{activeSetup.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{activeSetup.tagline}</p>
          </div>
        </div>

        {/* Right: Technical Spec Sheet & 1-Click Purchase */}
        <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div>
              <span className="text-[11px] font-tech text-cyan-400 font-extrabold tracking-widest uppercase">
                RESOLUCIÓN OBJETIVO: {activeSetup.targetResolution}
              </span>
              <h3 className="text-2xl font-extrabold font-heading text-white mt-1">
                {activeSetup.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeSetup.tagline}
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-slate-200 font-tech flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>VENTAJAS DE ESTE ENSAMBLE:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeSetup.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Included Key Components in Setup */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 font-tech uppercase block">
                Componentes Nucleares Incluidos:
              </span>
              <div className="space-y-2">
                {matchedProducts.map(prod => (
                  <div 
                    key={prod.id}
                    className="flex items-center justify-between p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0" 
                      />
                      <div className="truncate">
                        <span className="text-[10px] text-cyan-400 uppercase font-tech font-bold block">
                          {prod.category}
                        </span>
                        <span className="text-xs font-bold text-white truncate block">
                          {prod.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-tech font-extrabold text-cyan-400 shrink-0 ml-3">
                      {formatPrice(prod.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-tech">Inversión en Setup:</span>
                <span className="text-2xl font-extrabold text-cyan-400 font-tech">
                  {formatPrice(setupTotal)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-emerald-400 font-tech font-bold flex items-center justify-end space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>3 Años Garantía VIP</span>
                </span>
                <span className="text-[10px] text-slate-400 font-tech">Envío Seguro Incluido</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleAddSetupToCart}
                className="py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-tech font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-950/40 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>COMPRAR ESTE SETUP</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('pc-builder');
                  showToast('Abriendo el configurador de PC...', 'info');
                }}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-400 font-tech font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Wrench className="w-4 h-4" />
                <span>PERSONALIZAR EN BUILDER</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
