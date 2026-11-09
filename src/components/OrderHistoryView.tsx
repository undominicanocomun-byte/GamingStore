import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowLeft, 
  ChevronRight,
  ExternalLink,
  Printer
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types/index';

export const OrderHistoryView: React.FC = () => {
  const { user, formatPrice, setCurrentView, setLastPlacedOrder, setIsCheckoutOpen } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('nexus_token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-tech font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ENTREGADO</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-tech font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
            <Truck className="w-3.5 h-3.5" />
            <span>EN CAMINO (ENVIADO)</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-tech font-bold bg-blue-950/80 text-blue-400 border border-blue-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>CONFIRMADO / PREPARANDO</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-tech font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>PROCESANDO</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 font-tech mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la tienda</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
            HISTORIAL DE PEDIDOS & FACTURAS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revisa el estado de entrega en tiempo real de tu hardware gaming y descarga comprobantes fiscales.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 px-4 py-2.5 rounded-xl text-xs">
          <span className="text-slate-400 block text-[10px]">Cuenta activa:</span>
          <span className="font-bold text-white">{user?.name} ({user?.email})</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400 font-tech">Cargando tus órdenes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-[#101422] rounded-2xl border border-slate-800 p-12 text-center space-y-4">
          <Package className="w-16 h-16 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">
            No tienes pedidos registrados todavía
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Explora las mejores tarjetas gráficas, procesadores o utiliza el configurador para armar tu primer PC gamer.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-tech rounded-xl transition-colors"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#101422] rounded-2xl border border-slate-800 hover:border-cyan-900/80 transition-all p-5 space-y-4 shadow-xl"
            >
              {/* Order summary bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-heading font-extrabold text-white text-base">
                    Pedido: {order.orderNumber}
                  </span>
                  <span className="text-xs text-cyan-400 font-tech font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Factura: {order.invoiceNumber}
                  </span>
                  {getStatusBadge(order.orderStatus)}
                </div>

                <div className="text-right flex items-center space-x-3">
                  <div className="text-xs text-slate-400 font-tech">
                    {new Date(order.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="text-lg font-extrabold text-cyan-400 font-tech">
                    {formatPrice(order.total)}
                  </div>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <div className="flex justify-between text-[11px] text-slate-400 font-tech mt-0.5">
                        <span>Cantidad: {item.quantity}</span>
                        <span className="text-cyan-400 font-semibold">{formatPrice(item.product.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Tracking Info Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    Transportista:{' '}
                    <strong className="text-white">{order.carrier || 'Nexus Logistics Express'}</strong>
                    {order.trackingNumber && (
                      <span className="ml-2 bg-slate-900 px-2 py-0.5 rounded text-cyan-400 font-mono text-[11px] border border-cyan-900/50">
                        Guía: {order.trackingNumber}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setLastPlacedOrder(order);
                      setIsCheckoutOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-tech text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ver Factura Fiscal</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
