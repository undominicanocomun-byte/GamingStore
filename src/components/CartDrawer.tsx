import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartTotals, 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    formatPrice,
    setIsCheckoutOpen 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Free shipping threshold ($150)
  const freeShippingThreshold = 150;
  const currentSubtotal = cartTotals.subtotal - cartTotals.discount;
  const freeShippingProgress = Math.min(100, (currentSubtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f1322] border-l border-cyan-900/60 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="font-heading font-bold text-lg text-white tracking-wide">
                Carrito Gamer ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-900/90 px-5 py-2.5 border-b border-slate-800 text-xs">
            <div className="flex items-center justify-between text-[11px] mb-1 font-tech">
              <span className="flex items-center space-x-1 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {amountNeededForFreeShipping <= 0
                    ? '¡Felicidades! Calificas para Envío Gratis'
                    : `Faltan ${formatPrice(amountNeededForFreeShipping)} para Envío Gratis`}
                </span>
              </span>
              <span className="font-bold text-cyan-400">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-white text-base font-heading">
                  Tu carrito está vacío
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Añade tarjetas gráficas, procesadores o periféricos de competición para comenzar.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-xs font-tech rounded-lg mt-2"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-cyan-400 font-bold uppercase font-tech truncate">
                        {item.product.brand}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[200px]" title={item.product.name}>
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-extrabold text-cyan-400 font-tech mt-0.5">
                        {formatPrice(item.product.price)}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                      <div className="flex items-center border border-slate-700 bg-slate-950 rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-300 hover:text-white text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-white font-tech">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-300 hover:text-white text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Financial Totals */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-[#0c0e18] space-y-4">
              
              {/* Promo code input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span className="font-tech font-bold uppercase">{appliedCoupon.code}</span>
                    <span className="text-[11px] text-slate-300">
                      (-{appliedCoupon.discountPercentage ? `${appliedCoupon.discountPercentage}%` : formatPrice(appliedCoupon.discountAmount || 0)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="Cupón: NEXUS10 o CYBER2026"
                      className="w-full bg-slate-900 text-xs text-slate-100 placeholder-slate-400 pl-8 pr-2 py-2 rounded-lg border border-slate-700 uppercase font-tech focus:border-cyan-400 focus:outline-none"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 text-xs font-tech font-bold rounded-lg border border-cyan-800 transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              )}

              {/* Financial breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-tech font-semibold text-white">{formatPrice(cartTotals.subtotal)}</span>
                </div>

                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Descuento Cupón:</span>
                    <span className="font-tech font-bold">-{formatPrice(cartTotals.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Envío Express:</span>
                  <span className="font-tech font-semibold text-white">
                    {cartTotals.shipping === 0 ? (
                      <span className="text-emerald-400 font-bold uppercase">GRATIS</span>
                    ) : (
                      formatPrice(cartTotals.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">IVA (16%):</span>
                  <span className="font-tech font-semibold text-white">{formatPrice(cartTotals.tax)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span className="font-heading">TOTAL A PAGAR:</span>
                  <span className="text-cyan-400 font-tech text-xl">
                    {formatPrice(cartTotals.total)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-extrabold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-98"
              >
                <span>PROCEDER AL CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pago encriptado SSL &bull; Facturación Fiscal Automática</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
