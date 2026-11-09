import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Gift, 
  ShoppingCart, 
  Zap, 
  ArrowRight, 
  Copy, 
  Check, 
  PackageCheck,
  Percent,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/index';
import { calculateSavings, calculateBundleDiscount } from '../utils/pricing';

export const FlashDealsSection: React.FC = () => {
  const { products, addToCart, formatPrice, showToast, applyCoupon, setIsCartOpen, openProductDetail } = useStore();

  // Real-time ticking countdown timer (ends in ~6 hours, 42 minutes, 15 seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 6,
    minutes: 42,
    seconds: 15
  });

  // Mystery Loot Box state
  const [lootState, setLootState] = useState<'unopened' | 'opening' | 'opened'>('unopened');
  const [unlockedCoupon, setUnlockedCoupon] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 }; // Loop cycle
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filter flash deal products (products that have an originalPrice discount)
  const discountedProducts = products
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .slice(0, 4);

  // Bundles definition based on seeded products
  const keyboard = products.find(p => p.id === 'prod-keyboard-huntsman');
  const mouse = products.find(p => p.id === 'prod-mouse-superlight2');
  const gpu4080 = products.find(p => p.id === 'prod-rtx-4080-super');
  const monitorOled = products.find(p => p.id === 'prod-monitor-pg32ucdm');
  const cpu7800 = products.find(p => p.id === 'prod-ryzen-7800x3d');
  const moboX670 = products.find(p => p.id === 'prod-mobo-x670e');
  const ramDominator = products.find(p => p.id === 'prod-ram-dominator');

  const esportBundle = keyboard && mouse ? {
    id: 'bundle-esports',
    title: 'COMBO ESPORTS PRO ELITE',
    subtitle: 'Teclado Analógico Óptico Gen-2 + Ratón Inalámbrico 60g Lightspeed',
    items: [keyboard, mouse],
    badge: 'AHORRO EXTRA 25%',
    ...calculateBundleDiscount([keyboard.price, mouse.price], 25),
    claimedPercent: 88,
    unitsLeft: 3
  } : null;

  const ultra4kBundle = gpu4080 && monitorOled ? {
    id: 'bundle-4k-master',
    title: 'PACK DEFINITIVO 4K OLED 240Hz',
    subtitle: 'RTX 4080 Super 16GB OC + Monitor ROG Swift QD-OLED 0.03ms',
    items: [gpu4080, monitorOled],
    badge: 'AHORRO $350 USD',
    ...calculateBundleDiscount([gpu4080.price, monitorOled.price], 15),
    claimedPercent: 92,
    unitsLeft: 2
  } : null;

  const handleAddBundle = (bundle: { items: Product[]; title: string }) => {
    bundle.items.forEach(item => addToCart(item, 1));
    showToast(`¡${bundle.title} añadido con éxito al carrito!`, 'success');
    setIsCartOpen(true);
  };

  const handleOpenLootDrop = () => {
    setLootState('opening');
    setTimeout(() => {
      const dropCodes = ['CYBER2026', 'PROGAMER50', 'NEXUS10'];
      const chosen = dropCodes[Math.floor(Math.random() * dropCodes.length)];
      setUnlockedCoupon(chosen);
      setLootState('opened');
      showToast(`¡DROP ÉPICO DESBLOQUEADO: Cupón ${chosen}!`, 'success');
    }, 1200);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    applyCoupon(code);
    showToast(`Cupón ${code} copiado y aplicado a tu carrito`, 'success');
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="bg-gradient-to-b from-[#090a0f] via-[#101322] to-[#090a0f] border-y border-red-950/40 py-12 relative overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Flash Deals Header with Live Countdown Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/80 via-[#181126] to-slate-900 border border-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.2)]">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-tech font-extrabold tracking-wider uppercase border border-red-500/40">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>OFERTAS RELÁMPAGO DE TEMPORADA &bull; STOCK LIMITADO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading tracking-wide">
              HASTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-amber-300 to-yellow-400">-30% DE DESCUENTO DIRECTO</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Precios rebajados en hardware insignia con despacho prioritario y garantía oficial de 3 años. ¡Los precios suben al terminar el contador!
            </p>
          </div>

          {/* Live Countdown Display Box */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/60 border border-red-500/30 p-4 rounded-xl shrink-0 backdrop-blur-md">
            <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-tech uppercase">
              <Clock className="w-4 h-4 text-red-400 animate-spin" />
              <span>TERMINA EN:</span>
            </div>
            <div className="flex items-center space-x-2 font-mono font-extrabold">
              <div className="flex flex-col items-center bg-red-950/80 border border-red-500/50 text-white px-3 py-1.5 rounded-lg min-w-[50px]">
                <span className="text-xl text-red-400">{pad(timeLeft.hours)}</span>
                <span className="text-[9px] text-slate-400 font-tech">HORAS</span>
              </div>
              <span className="text-red-400 font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-red-950/80 border border-red-500/50 text-white px-3 py-1.5 rounded-lg min-w-[50px]">
                <span className="text-xl text-amber-400">{pad(timeLeft.minutes)}</span>
                <span className="text-[9px] text-slate-400 font-tech">MIN</span>
              </div>
              <span className="text-amber-400 font-bold text-lg">:</span>
              <div className="flex flex-col items-center bg-red-950/80 border border-red-500/50 text-white px-3 py-1.5 rounded-lg min-w-[50px]">
                <span className="text-xl text-yellow-300 animate-pulse">{pad(timeLeft.seconds)}</span>
                <span className="text-[9px] text-slate-400 font-tech">SEG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedProducts.map(product => {
            const savings = calculateSavings(product.price, product.originalPrice);
            const claimedPercent = Math.min(94, 70 + (product.stock * 3) % 25);

            return (
              <div
                key={product.id}
                className="bg-[#121626] rounded-xl border border-red-900/50 hover:border-red-500/70 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] group relative"
              >
                {/* Fire Discount Badge */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded shadow-lg font-tech flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>-{savings.percentSaved}% OFF</span>
                  </span>
                  <span className="bg-amber-500/90 text-black text-[10px] font-extrabold uppercase px-2 py-0.5 rounded font-tech">
                    AHORRAS {formatPrice(savings.amountSaved)}
                  </span>
                </div>

                {/* Product Image */}
                <div 
                  className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 mb-3 cursor-pointer relative"
                  onClick={() => openProductDetail(product.id)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121626] via-transparent to-transparent opacity-50"></div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase font-tech">
                      {product.brand} &bull; {product.category.replace('-', ' ')}
                    </span>
                    <h3 
                      onClick={() => openProductDetail(product.id)}
                      className="font-bold text-xs sm:text-sm text-white line-clamp-2 hover:text-cyan-300 transition-colors cursor-pointer mt-0.5"
                    >
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing with highlight */}
                  <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.originalPrice || product.price)}
                      </span>
                      <span className="text-lg font-extrabold text-amber-400 font-tech">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Claimed Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-tech">
                      <span className="text-slate-400">Progreso de oferta:</span>
                      <span className="text-red-400 font-bold">{claimedPercent}% Vendido</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                        style={{ width: `${claimedPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right font-tech">
                      ¡Quedan solo {product.stock} unidades a este precio!
                    </span>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black font-extrabold font-heading text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-red-950/40 cursor-pointer active:scale-98"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>APROVECHAR OFERTA</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* COMBOS GAMER & MYSTERY LOOT DROP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          
          {/* Left Column: Gaming Bundles (Combos con Descuento Extra) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="font-heading font-extrabold text-white text-lg tracking-wide">
                  COMBOS GAMER PRO: LLEVA EL PACK Y AHORRA EXTRA
                </h3>
              </div>
              <span className="text-xs text-purple-400 font-tech font-bold hidden sm:inline">
                Ahorro garantizado en bundle
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Bundle 1 */}
              {esportBundle && (
                <div className="bg-[#121626] rounded-2xl border border-purple-900/60 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-purple-500/70 transition-all shadow-xl">
                  <div className="absolute top-3 right-3 bg-purple-600 text-white font-tech font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg">
                    {esportBundle.badge}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-purple-400 font-bold uppercase font-tech tracking-wider">
                      COMBO ESPORTS PERIFÉRICOS
                    </span>
                    <h4 className="font-heading font-bold text-white text-base">
                      {esportBundle.title}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {esportBundle.subtitle}
                    </p>
                  </div>

                  {/* Bundled items preview */}
                  <div className="flex items-center space-x-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    {esportBundle.items.map((it, idx) => (
                      <React.Fragment key={it.id}>
                        <img src={it.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                        {idx === 0 && <span className="text-purple-400 font-bold text-sm">+</span>}
                      </React.Fragment>
                    ))}
                    <div className="ml-auto text-right">
                      <span className="text-xs text-slate-400 line-through block font-tech">
                        {formatPrice(esportBundle.originalTotal)}
                      </span>
                      <span className="text-lg font-extrabold text-purple-400 font-tech">
                        {formatPrice(esportBundle.bundlePrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-400 font-bold font-tech">
                      Ahorras {formatPrice(esportBundle.totalSavings)}
                    </span>
                    <button
                      onClick={() => handleAddBundle(esportBundle)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-extrabold font-tech text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      AÑADIR COMBO (2)
                    </button>
                  </div>
                </div>
              )}

              {/* Bundle 2 */}
              {ultra4kBundle && (
                <div className="bg-[#121626] rounded-2xl border border-cyan-900/60 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-cyan-500/70 transition-all shadow-xl">
                  <div className="absolute top-3 right-3 bg-cyan-500 text-black font-tech font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg">
                    {ultra4kBundle.badge}
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase font-tech tracking-wider">
                      PACK HARDWARE + MONITOR
                    </span>
                    <h4 className="font-heading font-bold text-white text-base">
                      {ultra4kBundle.title}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {ultra4kBundle.subtitle}
                    </p>
                  </div>

                  {/* Bundled items preview */}
                  <div className="flex items-center space-x-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    {ultra4kBundle.items.map((it, idx) => (
                      <React.Fragment key={it.id}>
                        <img src={it.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-900" />
                        {idx === 0 && <span className="text-cyan-400 font-bold text-sm">+</span>}
                      </React.Fragment>
                    ))}
                    <div className="ml-auto text-right">
                      <span className="text-xs text-slate-400 line-through block font-tech">
                        {formatPrice(ultra4kBundle.originalTotal)}
                      </span>
                      <span className="text-lg font-extrabold text-cyan-400 font-tech">
                        {formatPrice(ultra4kBundle.bundlePrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-emerald-400 font-bold font-tech">
                      Ahorras {formatPrice(ultra4kBundle.totalSavings)}
                    </span>
                    <button
                      onClick={() => handleAddBundle(ultra4kBundle)}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-tech text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      AÑADIR COMBO (2)
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Gamified Mystery Loot Box (Drop Diario de Descuento) */}
          <div className="lg:col-span-4 bg-gradient-to-b from-[#14182a] to-[#0c0f1c] rounded-2xl border border-amber-500/50 p-6 flex flex-col justify-between shadow-2xl relative">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-xs text-amber-400 font-tech font-bold uppercase">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>DROP DIARIO PARA GAMERS</span>
              </div>
              <h3 className="font-heading font-extrabold text-white text-xl">
                COFRE DE DESCUENTO SORPRESA
              </h3>
              <p className="text-xs text-slate-300">
                Abre el cofre digital para desbloquear un cupón secreto de hasta 15% o $50 USD aplicable a cualquier pedido hoy.
              </p>
            </div>

            {/* Loot box display */}
            <div className="py-6 text-center">
              {lootState === 'unopened' && (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-bounce">
                    <Gift className="w-10 h-10 text-amber-400" />
                  </div>
                  <button
                    onClick={handleOpenLootDrop}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-heading font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-amber-950/50 cursor-pointer"
                  >
                    ABRIR DROP DIARIO
                  </button>
                </div>
              )}

              {lootState === 'opening' && (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto animate-spin">
                    <Sparkles className="w-10 h-10 text-cyan-400" />
                  </div>
                  <p className="text-xs text-cyan-400 font-tech font-bold uppercase">
                    Desencriptando cupón de recompensa...
                  </p>
                </div>
              )}

              {lootState === 'opened' && unlockedCoupon && (
                <div className="space-y-3 p-4 rounded-xl bg-slate-900 border border-emerald-500/50">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase font-tech">
                    ¡CUPÓN DESBLOQUEADO CON ÉXITO!
                  </span>
                  <div className="text-2xl font-mono font-extrabold text-white tracking-widest bg-black/60 p-2 rounded-lg border border-slate-700">
                    {unlockedCoupon}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {unlockedCoupon === 'CYBER2026' ? '15% de descuento en órdenes > $500' :
                     unlockedCoupon === 'PROGAMER50' ? '$50 USD de descuento en compras > $300' :
                     '10% de descuento directo en todo'}
                  </p>
                  <button
                    onClick={() => handleCopyCoupon(unlockedCoupon)}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-tech font-extrabold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    {copiedCoupon ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCoupon ? '¡APLICADO AL CARRITO!' : 'COPIAR Y APLICAR'}</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center font-tech">
              * Válido 1 uso por cliente. Aplica directamente en checkout.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
