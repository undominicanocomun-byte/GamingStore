import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  HardDrive, 
  Zap, 
  Box, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  ShoppingCart, 
  RotateCcw, 
  Plus, 
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, PCBuildSelection } from '../types/index';

interface SlotConfig {
  key: keyof PCBuildSelection;
  title: string;
  category: ProductCategory;
  icon: React.ElementType;
  description: string;
}

const SLOTS: SlotConfig[] = [
  { key: 'cpu', title: '1. Procesador (CPU)', category: 'cpus', icon: Cpu, description: 'El cerebro de tu máquina gaming' },
  { key: 'motherboard', title: '2. Placa Base (Motherboard)', category: 'motherboards', icon: Layers, description: 'Conecta todos los componentes y define el socket' },
  { key: 'ram', title: '3. Memoria RAM', category: 'ram', icon: Zap, description: 'Velocidad DDR5 para máxima tasa de FPS' },
  { key: 'gpu', title: '4. Tarjeta Gráfica (GPU)', category: 'gpus', icon: Zap, description: 'El motor gráfico para Ray Tracing y 4K' },
  { key: 'storage', title: '5. Almacenamiento NVMe', category: 'storage', icon: HardDrive, description: 'Carga instantánea de juegos AAA' },
  { key: 'psu', title: '6. Fuente de Poder (PSU)', category: 'power-supplies', icon: Zap, description: 'Energía certificada y estable' },
  { key: 'case', title: '7. Gabinete Gaming', category: 'cases', icon: Box, description: 'Flujo de aire óptimo y estética ARGB' },
  { key: 'cooler', title: '8. Refrigeración Líquida', category: 'cooling', icon: Wind, description: 'Mantén temperaturas bajo control extremo' },
];

export const PCBuilder: React.FC = () => {
  const { 
    products, 
    pcBuild, 
    setPCBuildComponent, 
    clearPCBuild, 
    addPCBuildToCart, 
    pcBuildValidation,
    formatPrice,
    setCurrentView
  } = useStore();

  const [activeSlot, setActiveSlot] = useState<SlotConfig | null>(null);

  // Filter products matching current active slot
  const slotProducts = activeSlot 
    ? products.filter(p => p.category === activeSlot.category)
    : [];

  const totalBuildPrice = Object.values(pcBuild)
    .filter((p): p is Product => Boolean(p))
    .reduce((sum, p) => sum + p.price, 0);

  const selectedCount = Object.values(pcBuild).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-tech uppercase mb-3 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Configurador Interactivo de Rig Gaming</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-wide">
              ARMA TU PC GAMER A MEDIDA
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-1">
              Selecciona componente por componente con verificación automática de socket, compatibilidad y cálculo de consumo energético (Watts) en tiempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={clearPCBuild}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-tech rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Ensamble</span>
            </button>
            <button
              onClick={() => setCurrentView('catalog')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-tech rounded-lg transition-colors"
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Component Slots Grid */}
        <div className="lg:col-span-8 space-y-3">
          {SLOTS.map((slot) => {
            const Icon = slot.icon;
            const selectedProduct = pcBuild[slot.key];

            return (
              <div
                key={slot.key}
                className={`p-4 rounded-xl border transition-all ${
                  selectedProduct
                    ? 'bg-[#101526] border-cyan-500/50 shadow-md'
                    : 'bg-[#0e111d] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      selectedProduct 
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-400 uppercase font-tech">
                        {slot.title}
                      </div>
                      {selectedProduct ? (
                        <div>
                          <h4 className="text-sm font-bold text-white truncate max-w-md">
                            {selectedProduct.name}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs mt-0.5">
                            <span className="text-cyan-400 font-extrabold font-tech">
                              {formatPrice(selectedProduct.price)}
                            </span>
                            {selectedProduct.socket && (
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-tech">
                                Socket: {selectedProduct.socket}
                              </span>
                            )}
                            {selectedProduct.watts && (
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-tech">
                                {selectedProduct.watts}W
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 truncate">
                          {slot.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {selectedProduct ? (
                      <>
                        <button
                          onClick={() => setActiveSlot(slot)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-tech rounded-lg transition-colors"
                        >
                          Cambiar
                        </button>
                        <button
                          onClick={() => setPCBuildComponent(slot.key, undefined)}
                          className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                          title="Quitar componente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setActiveSlot(slot)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs font-tech rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-cyan-900/30"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ELEGIR</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Diagnostics HUD & Summary */}
        <div className="lg:col-span-4 space-y-5 sticky top-28">
          
          <div className="bg-[#101422] rounded-2xl border border-cyan-900/60 p-6 space-y-6 shadow-2xl">
            <h3 className="font-heading font-extrabold text-lg text-white tracking-wider flex items-center justify-between pb-3 border-b border-slate-800">
              <span>RESUMEN DEL ENSAMBLE</span>
              <span className="text-xs text-cyan-400 font-tech">
                {selectedCount} / {SLOTS.length} partes
              </span>
            </h3>

            {/* Power TDP Gauge */}
            <div className="space-y-2 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs font-tech">
                <span className="text-slate-400">Consumo Estimado (TDP):</span>
                <span className="text-yellow-400 font-bold text-sm">
                  ~{pcBuildValidation.totalWatts} Watts
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-tech">
                <span className="text-slate-400">Fuente Recomendada:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {pcBuildValidation.recommendedPsuWatts}W+
                </span>
              </div>
              {pcBuild.psu && (
                <div className="flex items-center justify-between text-xs font-tech pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Fuente Seleccionada:</span>
                  <span className={`font-bold ${
                    (pcBuild.psu.watts || 0) >= pcBuildValidation.recommendedPsuWatts 
                      ? 'text-emerald-400' 
                      : 'text-amber-400'
                  }`}>
                    {pcBuild.psu.watts || 0}W
                  </span>
                </div>
              )}
            </div>

            {/* Compatibility Alerts */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase font-tech">
                Diagnóstico de Compatibilidad
              </div>

              {pcBuildValidation.isCompatible ? (
                <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Todos los componentes seleccionados son 100% compatibles entre sí.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {pcBuildValidation.warnings.map((warn, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2.5 p-3 rounded-xl bg-red-950/30 border border-red-500/50 text-red-300 text-xs"
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Total Componentes:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-tech">
                  {formatPrice(totalBuildPrice)}
                </span>
              </div>

              <button
                disabled={selectedCount === 0 || !pcBuildValidation.isCompatible}
                onClick={addPCBuildToCart}
                className={`w-full py-3.5 rounded-xl font-heading font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-xl ${
                  selectedCount > 0 && pcBuildValidation.isCompatible
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-900/40 cursor-pointer active:scale-98'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>AGREGAR TODO AL CARRITO ({selectedCount})</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Incluye ensamble profesional gratuito y pasta térmica de metal líquido de regalo.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Modal / Drawer for Selecting Component in Active Slot */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101422] rounded-2xl border border-cyan-800/80 w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Seleccionar {activeSlot.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {slotProducts.length} modelos disponibles en catálogo
                </p>
              </div>
              <button
                onClick={() => setActiveSlot(null)}
                className="text-slate-400 hover:text-white text-sm p-1 rounded"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {slotProducts.map(prod => {
                const isSelected = pcBuild[activeSlot.key]?.id === prod.id;

                return (
                  <div
                    key={prod.id}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase font-tech">
                          {prod.brand}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate max-w-md">
                          {prod.name}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
                          {prod.socket && (
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                              Socket {prod.socket}
                            </span>
                          )}
                          {prod.watts && (
                            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                              {prod.watts}W TDP
                            </span>
                          )}
                          <span className="text-slate-400 text-[11px]">
                            Stock: {prod.stock}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-extrabold text-cyan-400 font-tech mb-2">
                        {formatPrice(prod.price)}
                      </div>
                      <button
                        onClick={() => {
                          setPCBuildComponent(activeSlot.key, prod);
                          setActiveSlot(null);
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-tech font-bold transition-colors ${
                          isSelected
                            ? 'bg-emerald-500 text-black'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                        }`}
                      >
                        {isSelected ? 'SELECCIONADO' : 'ELEGIR'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
