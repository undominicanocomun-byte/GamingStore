import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Package, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  Truck, 
  Tag, 
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Coupon, AdminMetrics, ProductCategory } from '../types/index';

export const AdminPanel: React.FC = () => {
  const { user, formatPrice, setCurrentView, showToast, refreshProducts } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'coupons' | 'inventory'>('products');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form state
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('gpus');
  const [formBrand, setFormBrand] = useState('NVIDIA');
  const [formStock, setFormStock] = useState('10');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formWatts, setFormWatts] = useState('');
  const [formSocket, setFormSocket] = useState('');
  const [formMemoryType, setFormMemoryType] = useState('DDR5');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Coupons state
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('10');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('100');

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('nexus_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [metricsRes, prodsRes, ordersRes, couponsRes] = await Promise.all([
        fetch('/api/admin/metrics', { headers }),
        fetch('/api/products'),
        fetch('/api/orders', { headers }),
        fetch('/api/coupons', { headers })
      ]);

      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (couponsRes.ok) setCoupons(await couponsRes.json());
    } catch (e) {
      console.error('Error fetching admin data:', e);
      showToast('Error al cargar panel administrativo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openCreateProductModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormCategory('gpus');
    setFormBrand('NVIDIA');
    setFormStock('10');
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80');
    setFormWatts('300');
    setFormSocket('');
    setFormMemoryType('DDR5');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setFormCategory(product.category);
    setFormBrand(product.brand);
    setFormStock(product.stock.toString());
    setFormDescription(product.description);
    setFormImageUrl(product.images[0] || '');
    setFormWatts(product.watts ? product.watts.toString() : '');
    setFormSocket(product.socket || '');
    setFormMemoryType(product.memoryType || 'DDR5');
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('nexus_token');
    const payload = {
      name: formName,
      price: parseFloat(formPrice),
      originalPrice: formOriginalPrice ? parseFloat(formOriginalPrice) : undefined,
      category: formCategory,
      brand: formBrand,
      stock: parseInt(formStock, 10),
      description: formDescription,
      images: [formImageUrl],
      watts: formWatts ? parseInt(formWatts, 10) : undefined,
      socket: formSocket || undefined,
      memoryType: formMemoryType,
      specs: editingProduct?.specs || { 'Categoría': formCategory, 'Marca': formBrand }
    };

    try {
      if (editingProduct) {
        // Update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`Producto "${formName}" actualizado`, 'success');
          setIsProductModalOpen(false);
          fetchAdminData();
          refreshProducts();
        }
      } else {
        // Create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          showToast(`¡Nuevo producto "${formName}" publicado en la tienda!`, 'success');
          setIsProductModalOpen(false);
          fetchAdminData();
          refreshProducts();
        }
      }
    } catch {
      showToast('Error al guardar producto', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${name}" del catálogo?`)) return;
    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Producto eliminado exitosamente', 'info');
        fetchAdminData();
        refreshProducts();
      }
    } catch {
      showToast('Error al eliminar producto', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => {
    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber || (status === 'shipped' ? `NX-EXP-${Math.floor(10000000 + Math.random() * 90000000)}-MX` : undefined),
          carrier: 'Nexus Priority DHL & FedEx Express'
        })
      });

      if (res.ok) {
        showToast('Estado del pedido actualizado en tiempo real', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Error al actualizar pedido', 'error');
    }
  };

  const handleQuickRestock = async (product: Product, quantityToAdd: number) => {
    try {
      const token = localStorage.getItem('nexus_token');
      const newStock = product.stock + quantityToAdd;
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        showToast(`Stock de "${product.name}" incrementado a ${newStock} unidades`, 'success');
        fetchAdminData();
        refreshProducts();
      }
    } catch {
      showToast('Error al reabastecer stock', 'error');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          code: newCouponCode,
          discountPercentage: parseFloat(newCouponDiscount),
          minOrderAmount: parseFloat(newCouponMinOrder)
        })
      });

      if (res.ok) {
        showToast(`Cupón ${newCouponCode.toUpperCase()} creado y activo`, 'success');
        setNewCouponCode('');
        fetchAdminData();
      }
    } catch {
      showToast('Error al crear cupón', 'error');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    try {
      const token = localStorage.getItem('nexus_token');
      const res = await fetch(`/api/coupons/${code}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast(`Cupón ${code} eliminado`, 'info');
        fetchAdminData();
      }
    } catch {
      showToast('Error al eliminar cupón', 'error');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-purple-900/60">
        <div>
          <button
            onClick={() => setCurrentView('catalog')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-cyan-400 font-tech mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la tienda pública</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-950 text-purple-400 rounded-lg border border-purple-500/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                PANEL DE ADMINISTRACIÓN NEXUS
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Control total de catálogo, inventario, pedidos en tiempo real y cupones de promoción.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openCreateProductModal}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold font-heading text-xs rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-cyan-900/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO PRODUCTO</span>
        </button>
      </div>

      {/* 4 Real-time KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#101424] rounded-2xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-tech uppercase">Ingresos Totales</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-tech">
            {formatPrice(metrics?.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-slate-400 font-tech">Ventas en firme cobradas</p>
        </div>

        <div className="bg-[#101424] rounded-2xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-tech uppercase">Pedidos Totales</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-tech">
            {metrics?.totalOrders || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-tech">Procesados en plataforma</p>
        </div>

        <div className="bg-[#101424] rounded-2xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-tech uppercase">Clientes Activos</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-tech">
            {metrics?.totalCustomers || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-tech">Compradores verificados</p>
        </div>

        <div className="bg-[#101424] rounded-2xl border border-slate-800 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-tech uppercase">Stock Bajo (&le; 5)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-tech">
            {metrics?.lowStockCount || 0}
          </div>
          <p className="text-[11px] text-slate-400 font-tech">Productos que requieren resurtido</p>
        </div>

      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-800 space-x-2 text-xs font-tech">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 border-b-2 font-bold transition-colors ${
            activeTab === 'products'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          CATÁLOGO DE PRODUCTOS ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 border-b-2 font-bold transition-colors ${
            activeTab === 'orders'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          GESTIÓN DE PEDIDOS ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-3 border-b-2 font-bold transition-colors ${
            activeTab === 'coupons'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          CUPONES PROMOCIONALES ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-3 border-b-2 font-bold transition-colors ${
            activeTab === 'inventory'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          ALERTAS DE INVENTARIO ({products.filter(p => p.stock <= 5).length})
        </button>
      </div>

      {/* TAB 1: Products Table */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Buscar por nombre, marca o categoría..."
                className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 pl-9 pr-3 py-2 rounded-lg focus:border-cyan-400 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <span className="text-xs text-slate-400 font-tech">
              Mostrando {filteredProducts.length} productos
            </span>
          </div>

          <div className="bg-[#101422] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] text-slate-400 uppercase font-tech border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Producto</th>
                    <th className="p-3.5">Categoría</th>
                    <th className="p-3.5">Marca</th>
                    <th className="p-3.5">Precio</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-white block truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-tech">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-tech capitalize">{p.category.replace('-', ' ')}</td>
                      <td className="p-3.5 font-tech font-bold text-cyan-400">{p.brand}</td>
                      <td className="p-3.5 font-tech font-extrabold text-white">{formatPrice(p.price)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-tech font-bold ${
                          p.stock <= 5 
                            ? 'bg-red-950 text-red-400 border border-red-500/40' 
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {p.stock} u.
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => openEditProductModal(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                          title="Editar producto"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-400 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-[#101422] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-[11px] text-slate-400 uppercase font-tech border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">N° Pedido / Factura</th>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Total Cobrado</th>
                    <th className="p-3.5">Estado Actual</th>
                    <th className="p-3.5">Guía / Tracking</th>
                    <th className="p-3.5 text-right">Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white font-heading">{o.orderNumber}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">{o.invoiceNumber}</div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{o.customerName}</div>
                        <div className="text-[10px] text-slate-400">{o.customerEmail}</div>
                        <div className="text-[10px] text-slate-400">{o.shippingAddress.city}, {o.shippingAddress.state}</div>
                      </td>
                      <td className="p-3.5 font-tech font-extrabold text-cyan-400 text-sm">
                        {formatPrice(o.total)}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-tech font-bold uppercase ${
                          o.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                          o.orderStatus === 'shipped' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' :
                          'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-300">
                        {o.trackingNumber || 'Pendiente de despacho'}
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as Order['orderStatus'])}
                          className="bg-slate-900 border border-slate-700 text-xs text-white p-1.5 rounded-lg focus:border-cyan-400 font-tech"
                        >
                          <option value="processing">Procesando</option>
                          <option value="confirmed">Confirmado</option>
                          <option value="shipped">Enviado (Generar Guía)</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Coupons */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-[#101422] rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Crear Nuevo Cupón</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Código del Cupón</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value)}
                  placeholder="Ej: NEXUS20"
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg uppercase font-tech"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">% de Descuento</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={newCouponDiscount}
                    onChange={e => setNewCouponDiscount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg font-tech"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Compra Mínima ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponMinOrder}
                    onChange={e => setNewCouponMinOrder(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg font-tech"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-heading text-xs rounded-lg transition-colors cursor-pointer"
              >
                PUBLICAR CUPÓN
              </button>
            </form>
          </div>

          <div className="md:col-span-7 bg-[#101422] rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="font-heading font-bold text-white text-base">Cupones Activos</h3>
            <div className="space-y-2">
              {coupons.map((c) => (
                <div key={c.code} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-tech font-extrabold text-white text-sm">{c.code}</span>
                      <p className="text-[11px] text-slate-400">
                        {c.discountPercentage ? `${c.discountPercentage}% de descuento` : `$${c.discountAmount} USD off`}
                        {c.minOrderAmount ? ` (Mínimo $${c.minOrderAmount})` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400 font-tech">Usos: {c.usedCount}</span>
                    <button
                      onClick={() => handleDeleteCoupon(c.code)}
                      className="p-1.5 text-red-400 hover:bg-red-950/40 rounded transition-colors"
                      title="Eliminar cupón"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Inventory Restock */}
      {activeTab === 'inventory' && (
        <div className="bg-[#101422] rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-base">
              Productos con Stock Crítico (&le; 5 unidades)
            </h3>
            <span className="text-xs text-amber-400 font-tech">
              Reabastece con 1 clic para no perder ventas
            </span>
          </div>

          <div className="space-y-3">
            {products.filter(p => p.stock <= 5).map(prod => (
              <div key={prod.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center space-x-3">
                  <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-950 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-xs truncate max-w-md">{prod.name}</h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-tech mt-0.5">
                      <span className="text-red-400 font-bold">Stock actual: {prod.stock}</span>
                      <span>&bull;</span>
                      <span>Precio: {formatPrice(prod.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuickRestock(prod, 10)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-tech text-xs rounded-lg transition-colors border border-cyan-900/60"
                  >
                    +10 unidades
                  </button>
                  <button
                    onClick={() => handleQuickRestock(prod, 25)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black font-tech font-bold text-xs rounded-lg transition-colors"
                  >
                    +25 unidades
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101422] rounded-2xl border border-cyan-800/80 w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-heading">
                {editingProduct ? 'Editar Producto del Catálogo' : 'Crear Nuevo Producto Gaming'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nombre Completo del Producto</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Precio Actual (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg font-tech"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Precio Original (Tachado, opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formOriginalPrice}
                    onChange={e => setFormOriginalPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg font-tech"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg capitalize"
                  >
                    <option value="gpus">Tarjetas Gráficas (GPUs)</option>
                    <option value="cpus">Procesadores (CPUs)</option>
                    <option value="motherboards">Placas Base</option>
                    <option value="ram">RAM</option>
                    <option value="storage">Almacenamiento M.2</option>
                    <option value="cooling">Refrigeración</option>
                    <option value="power-supplies">Fuentes de Poder</option>
                    <option value="cases">Gabinetes</option>
                    <option value="peripherals">Periféricos</option>
                    <option value="monitors">Monitores</option>
                    <option value="prebuilt-pcs">PCs Armadas</option>
                    <option value="laptops">Laptops Gaming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Marca</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg font-tech"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg font-tech"
                    required
                  />
                </div>
              </div>

              {/* PC Builder specific params */}
              <div className="grid grid-cols-3 gap-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Consumo TDP (Watts)</label>
                  <input
                    type="number"
                    value={formWatts}
                    onChange={e => setFormWatts(e.target.value)}
                    placeholder="Ej: 320"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2 rounded font-tech"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Socket (CPU / Placa)</label>
                  <input
                    type="text"
                    value={formSocket}
                    onChange={e => setFormSocket(e.target.value)}
                    placeholder="Ej: AM5, LGA1700"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2 font-tech"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tipo de Memoria</label>
                  <input
                    type="text"
                    value={formMemoryType}
                    onChange={e => setFormMemoryType(e.target.value)}
                    placeholder="DDR5"
                    className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2 font-tech"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={e => setFormImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Descripción Detallada</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-white p-2.5 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-extrabold text-xs rounded-lg cursor-pointer"
                >
                  {editingProduct ? 'GUARDAR CAMBIOS' : 'PUBLICAR PRODUCTO'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
