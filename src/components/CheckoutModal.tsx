import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  Lock,
  Wallet,
  Building,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types/index';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    clearCart, 
    cartTotals, 
    formatPrice, 
    user, 
    appliedCoupon,
    showToast,
    setCurrentView,
    lastPlacedOrder,
    setLastPlacedOrder
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 1: Shipping form
  const [shippingData, setShippingData] = useState({
    street: user?.address?.street || 'Av. Insurgentes Sur 1602, Piso 4',
    city: user?.address?.city || 'Ciudad de México',
    state: user?.address?.state || 'CDMX',
    zipCode: user?.address?.zipCode || '03900',
    country: user?.address?.country || 'México',
    phone: user?.phone || '+52 55 9812 4301',
    notes: 'Timbre 4B. Entregar en horario de oficina.'
  });

  // Step 2: Payment method & card details
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8892',
    name: user?.name || 'Carlos Rivera',
    expiry: '12/28',
    cvv: '821'
  });

  if (!isCheckoutOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexus_token')}`
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress: shippingData,
          paymentMethod,
          couponCode: appliedCoupon?.code
        })
      });

      const data = await res.json();
      if (res.ok) {
        setLastPlacedOrder(data);
        clearCart();
        setStep(3);
        triggerConfetti();
        showToast('¡Pago procesado y pedido confirmado exitosamente!', 'success');
      } else {
        showToast(data.error || 'Error al procesar el pedido', 'error');
      }
    } catch (e) {
      console.error('Order error:', e);
      showToast('Error de red al procesar el pago', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-[#0f1322] border border-cyan-800/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-tech">
              CHECKOUT SEGURO &bull; PASO {step} DE 3
            </span>
            <h2 className="text-xl font-heading font-extrabold text-white">
              {step === 1 && '1. Datos de Entrega y Envío'}
              {step === 2 && '2. Método de Pago Seguro'}
              {step === 3 && '3. ¡Compra Exitosa y Factura Generada!'}
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: Shipping Address Form */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Dirección (Calle y Número exterior/interior)
                  </label>
                  <input
                    type="text"
                    value={shippingData.street}
                    onChange={e => setShippingData({ ...shippingData, street: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ciudad / Municipio
                  </label>
                  <input
                    type="text"
                    value={shippingData.city}
                    onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Estado / Provincia
                  </label>
                  <input
                    type="text"
                    value={shippingData.state}
                    onChange={e => setShippingData({ ...shippingData, state: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    value={shippingData.zipCode}
                    onChange={e => setShippingData({ ...shippingData, zipCode: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={shippingData.phone}
                    onChange={e => setShippingData({ ...shippingData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Instrucciones Especiales para el Repartidor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={shippingData.notes}
                    onChange={e => setShippingData({ ...shippingData, notes: e.target.value })}
                    placeholder="Ej: Dejar en recepción o llamar al llegar"
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Carrier badge */}
              <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl flex items-center space-x-3 text-xs text-slate-300 mt-2">
                <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Servicio Express DHL & FedEx Gaming Priority</span>
                  <span className="text-[11px] text-slate-400">Entrega garantizada de 24 a 48 horas hábiles en embalaje acolchado antiestático.</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-heading text-xs rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-900/30"
                >
                  <span>CONTINUAR AL PAGO</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-tech font-bold">Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-tech font-bold">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'crypto'
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    ₮
                  </div>
                  <span className="text-xs font-tech font-bold">Cripto/USDT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'transfer'
                      ? 'bg-cyan-950/50 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-tech font-bold">Transferencia</span>
                </button>
              </div>

              {/* Method Details */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-tech uppercase">Tarjeta de Crédito / Débito</span>
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>256-Bit SSL Encriptado</span>
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none font-tech tracking-wider"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Fecha Vencimiento</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none font-tech"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Código de Seguridad (CVV)</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs p-2.5 rounded-lg focus:border-cyan-400 focus:outline-none font-tech"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-white">PayPal One-Touch Checkout</p>
                  <p className="text-slate-400">
                    Al confirmar, serás redirigido a la pasarela autorizada de PayPal para procesar tu orden con protección al comprador de $2,000 USD.
                  </p>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-white">Pago con USDT (Tether TRC20 / ERC20) o Bitcoin</p>
                  <p className="text-slate-400">
                    Calculado al tipo de cambio en tiempo real sin comisiones ocultas. Aprobación tras 1 confirmación de bloque.
                  </p>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="font-bold text-white">Transferencia Bancaria Directa (SPEI / IBAN)</p>
                  <p className="text-slate-400">
                    Recibirás los datos bancarios y referencia única al finalizar para confirmación automática en menos de 10 minutos.
                  </p>
                </div>
              )}

              {/* Order financial review */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Items:</span>
                  <span className="font-bold text-white">{cart.reduce((s, i) => s + i.quantity, 0)} productos</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Total a debitar:</span>
                  <span className="text-cyan-400 font-tech text-lg">{formatPrice(cartTotals.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-slate-400 hover:text-white text-xs font-tech flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Modificar Envío</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold font-heading text-xs rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-emerald-900/30"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isProcessing ? 'PROCESANDO PAGO...' : `PAGAR ${formatPrice(cartTotals.total)}`}</span>
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Order Confirmation & Formal Printable Receipt */}
          {step === 3 && lastPlacedOrder && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/40">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-white font-heading">
                  ¡ORDEN CONFIRMADA CON ÉXITO!
                </h3>
                <p className="text-xs text-slate-300">
                  Hemos enviado la confirmación y recibo oficial a{' '}
                  <strong className="text-cyan-400">{lastPlacedOrder.customerEmail}</strong>
                </p>
              </div>

              {/* Printable Invoice Card */}
              <div id="printable-invoice" className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs space-y-4 font-mono">
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="font-heading font-extrabold text-white text-base tracking-wider">
                      NEXUS GAMING STORE
                    </div>
                    <div className="text-[10px] text-slate-400">R.F.C.: NXG-260101-GAM &bull; IVA 16%</div>
                    <div className="text-[10px] text-slate-400">Av. Paseo Tecnológico 1000, Edificio Nexus</div>
                  </div>
                  <div className="text-right">
                    <div className="text-cyan-400 font-bold">{lastPlacedOrder.invoiceNumber}</div>
                    <div className="text-white font-bold">Orden: {lastPlacedOrder.orderNumber}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(lastPlacedOrder.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Customer & Shipping info */}
                <div className="grid grid-cols-2 gap-4 text-[11px] pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-slate-400 block font-bold">CLIENTE:</span>
                    <span className="text-white">{lastPlacedOrder.customerName}</span>
                    <span className="text-slate-300 block">{lastPlacedOrder.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold">DESTINO DE ENTREGA:</span>
                    <span className="text-white">{lastPlacedOrder.shippingAddress.street}</span>
                    <span className="text-slate-300 block">
                      {lastPlacedOrder.shippingAddress.city}, {lastPlacedOrder.shippingAddress.state} CP {lastPlacedOrder.shippingAddress.zipCode}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1.5 pb-3 border-b border-slate-800">
                  <div className="text-slate-400 font-bold grid grid-cols-12 text-[10px]">
                    <span className="col-span-7">PRODUCTO</span>
                    <span className="col-span-2 text-center">CANT</span>
                    <span className="col-span-3 text-right">TOTAL</span>
                  </div>
                  {lastPlacedOrder.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 text-slate-300 text-[11px]">
                      <span className="col-span-7 truncate font-sans text-white">{item.product.name}</span>
                      <span className="col-span-2 text-center">{item.quantity}</span>
                      <span className="col-span-3 text-right text-cyan-400">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="space-y-1 text-right text-xs">
                  <div>
                    <span className="text-slate-400">Subtotal: </span>
                    <span className="text-white">{formatPrice(lastPlacedOrder.subtotal)}</span>
                  </div>
                  {lastPlacedOrder.discount > 0 && (
                    <div className="text-emerald-400">
                      <span>Descuento Cupón ({lastPlacedOrder.couponCode}): </span>
                      <span>-{formatPrice(lastPlacedOrder.discount)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Envío Express: </span>
                    <span className="text-white">
                      {lastPlacedOrder.shippingFee === 0 ? 'GRATIS' : formatPrice(lastPlacedOrder.shippingFee)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">IVA (16%): </span>
                    <span className="text-white">{formatPrice(lastPlacedOrder.tax)}</span>
                  </div>
                  <div className="text-sm font-bold text-cyan-400 pt-1 border-t border-slate-800">
                    <span className="text-white">TOTAL PAGADO: </span>
                    <span>{formatPrice(lastPlacedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-tech rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span>Imprimir Comprobante Fiscal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCurrentView('orders');
                  }}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-heading text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <span>IR A MIS PEDIDOS</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
