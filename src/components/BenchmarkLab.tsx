import React, { useState } from 'react';
import { 
  Zap, 
  Activity, 
  Flame, 
  Gauge, 
  Cpu, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BenchmarkGame {
  id: string;
  name: string;
  genre: string;
  coverImage: string;
  recommendedFps: number;
}

const GAMES: BenchmarkGame[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077: Phantom Liberty',
    genre: 'Ray Tracing Overdrive / Path Tracing',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    recommendedFps: 90
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    genre: 'eSports Competitivo 500Hz',
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=600&q=80',
    recommendedFps: 360
  },
  {
    id: 'warzone',
    name: 'Call of Duty: Warzone 3',
    genre: 'Battle Royale 144Hz+',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    recommendedFps: 144
  },
  {
    id: 'wukong',
    name: 'Black Myth: Wukong',
    genre: 'Unreal Engine 5 Cinematic',
    coverImage: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=600&q=80',
    recommendedFps: 80
  }
];

interface GpuBenchmarkProfile {
  id: string;
  name: string;
  productId: string;
  vram: string;
  tdpWatts: number;
  tempCelsius: number;
  // FPS per game per resolution: [1080p, 1440p, 4K]
  fpsMap: Record<string, { fhd: number; qhd: number; uhd: number; low1Percent: number }>;
}

const GPU_PROFILES: GpuBenchmarkProfile[] = [
  {
    id: 'rtx-5090',
    name: 'GeForce RTX 5090 TUF Gaming',
    productId: 'prod-rtx-5090',
    vram: '32GB GDDR7',
    tdpWatts: 575,
    tempCelsius: 64,
    fpsMap: {
      cyberpunk: { fhd: 215, qhd: 168, uhd: 114, low1Percent: 88 },
      cs2: { fhd: 640, qhd: 520, uhd: 380, low1Percent: 310 },
      warzone: { fhd: 310, qhd: 245, uhd: 175, low1Percent: 142 },
      wukong: { fhd: 195, qhd: 152, uhd: 98, low1Percent: 78 }
    }
  },
  {
    id: 'rtx-4080s',
    name: 'GeForce RTX 4080 Super Gaming X',
    productId: 'prod-rtx-4080-super',
    vram: '16GB GDDR6X',
    tdpWatts: 320,
    tempCelsius: 61,
    fpsMap: {
      cyberpunk: { fhd: 165, qhd: 122, uhd: 76, low1Percent: 58 },
      cs2: { fhd: 510, qhd: 395, uhd: 260, low1Percent: 215 },
      warzone: { fhd: 235, qhd: 180, uhd: 120, low1Percent: 96 },
      wukong: { fhd: 145, qhd: 108, uhd: 68, low1Percent: 52 }
    }
  },
  {
    id: 'rx-7900xtx',
    name: 'Radeon RX 7900 XTX Nitro+ Vapor-X',
    productId: 'prod-rx-7900-xtx',
    vram: '24GB GDDR6',
    tdpWatts: 355,
    tempCelsius: 67,
    fpsMap: {
      cyberpunk: { fhd: 150, qhd: 110, uhd: 65, low1Percent: 49 },
      cs2: { fhd: 540, qhd: 410, uhd: 275, low1Percent: 220 },
      warzone: { fhd: 245, qhd: 192, uhd: 130, low1Percent: 104 },
      wukong: { fhd: 130, qhd: 96, uhd: 60, low1Percent: 46 }
    }
  }
];

export const BenchmarkLab: React.FC = () => {
  const { openProductDetail, setCurrentView } = useStore();
  const [selectedGpuId, setSelectedGpuId] = useState<string>('rtx-5090');
  const [resolution, setResolution] = useState<'fhd' | 'qhd' | 'uhd'>('uhd');
  const [rayTracingEnabled, setRayTracingEnabled] = useState<boolean>(true);

  const selectedGpu = GPU_PROFILES.find(g => g.id === selectedGpuId) || GPU_PROFILES[0];

  const getMultiplier = () => {
    return rayTracingEnabled ? 1 : 1.25;
  };

  return (
    <section className="bg-gradient-to-b from-[#090a0f] via-[#0d1222] to-[#090a0f] py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-950/60 border border-cyan-500/40 px-3.5 py-1.5 rounded-full text-xs font-tech text-cyan-300 uppercase tracking-widest shadow-lg shadow-cyan-950/50">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NEXUS PERFORMANCE LAB &bull; VERIFICACIÓN EN VIVO</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            BENCHMARKS REALES &bull; FPS CERTIFICADOS
          </h2>
          
          <p className="text-sm text-slate-300">
            Compara el rendimiento real en juegos AAA y eSports antes de invertir. Métricas capturadas en bancos de prueba con refrigeración líquida industrial.
          </p>
        </div>

        {/* Control Center Bar */}
        <div className="bg-[#12172b]/90 border border-slate-700/80 rounded-2xl p-5 mb-8 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* GPU Selector Pills */}
          <div className="w-full lg:w-auto">
            <label className="text-[11px] font-bold text-slate-400 uppercase font-tech block mb-2">
              Seleccionar Tarjeta Gráfica:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {GPU_PROFILES.map(gpu => (
                <button
                  key={gpu.id}
                  onClick={() => setSelectedGpuId(gpu.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                    selectedGpuId === gpu.id
                      ? 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold font-heading truncate">{gpu.name}</span>
                  <span className="text-[10px] text-cyan-400 font-tech mt-0.5">{gpu.vram} &bull; {gpu.tdpWatts}W</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Selector & Ray Tracing Toggle */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
            
            {/* Resolution Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase font-tech block mb-2">
                Resolución:
              </label>
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => setResolution('fhd')}
                  className={`px-3 py-1.5 text-xs font-tech font-bold rounded-lg transition-colors ${
                    resolution === 'fhd' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1080p FHD
                </button>
                <button
                  onClick={() => setResolution('qhd')}
                  className={`px-3 py-1.5 text-xs font-tech font-bold rounded-lg transition-colors ${
                    resolution === 'qhd' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  1440p 2K
                </button>
                <button
                  onClick={() => setResolution('uhd')}
                  className={`px-3 py-1.5 text-xs font-tech font-bold rounded-lg transition-colors ${
                    resolution === 'uhd' ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  2160p 4K UHD
                </button>
              </div>
            </div>

            {/* Ray Tracing Switch */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase font-tech block mb-2">
                Ray Tracing:
              </label>
              <button
                onClick={() => setRayTracingEnabled(prev => !prev)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-tech font-bold flex items-center space-x-2 transition-all ${
                  rayTracingEnabled 
                    ? 'bg-purple-950/70 border-purple-500 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{rayTracingEnabled ? 'ULTRA ON' : 'DESACTIVADO'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Live FPS Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {GAMES.map(game => {
            const rawFps = selectedGpu.fpsMap[game.id][resolution];
            const displayFps = Math.round(rawFps * getMultiplier());
            const lowFps = Math.round(selectedGpu.fpsMap[game.id].low1Percent * (rayTracingEnabled ? 1 : 1.15));
            const target = game.recommendedFps;
            const progress = Math.min(100, Math.round((displayFps / Math.max(target * 1.5, 300)) * 100));

            return (
              <div 
                key={game.id} 
                className="bg-[#101422] rounded-2xl border border-slate-800/90 overflow-hidden hover:border-cyan-500/40 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <img 
                      src={game.coverImage} 
                      alt={game.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0" 
                    />
                    <div>
                      <h4 className="font-heading font-extrabold text-white text-base">
                        {game.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {game.genre}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-extrabold font-tech text-cyan-400 flex items-baseline justify-end space-x-1">
                      <span>{displayFps}</span>
                      <span className="text-xs text-slate-400">FPS</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-tech">
                      1% Low: <strong className="text-slate-300">{lowFps} FPS</strong>
                    </span>
                  </div>
                </div>

                {/* Performance Visualizer Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-tech">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Gauge className="w-3 h-3 text-cyan-400" />
                      <span>Estabilidad: Fluidez Absoluta</span>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{displayFps >= target ? 'Supera Recomendado' : 'Jugable'}</span>
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-400 font-tech">
                    <span>60 FPS</span>
                    <span>144 FPS Pro</span>
                    <span>240 FPS+ eSports</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Telemetry Footer Call to Action */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Temp Media: <strong className="text-white font-tech">{selectedGpu.tempCelsius}°C</strong> (Liquid Cooled)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Consumo TDP: <strong className="text-white font-tech">{selectedGpu.tdpWatts} Watts</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Memoria de Vídeo: <strong className="text-white font-tech">{selectedGpu.vram}</strong></span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => openProductDetail(selectedGpu.productId)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-tech font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ver Ficha Técnica
            </button>
            <button
              onClick={() => setCurrentView('pc-builder')}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-tech font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-950/50 flex items-center justify-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <span>EQUIPAR EN PC BUILDER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
};
