import React from 'react';
import { 
  StoreProvider, 
  useStore 
} from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductFilter } from './components/ProductFilter';
import { PCBuilder } from './components/PCBuilder';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderHistoryView } from './components/OrderHistoryView';
import { AdminPanel } from './components/AdminPanel';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { FlashDealsSection } from './components/FlashDealsSection';
import { BenchmarkLab } from './components/BenchmarkLab';
import { BattleStationGallery } from './components/BattleStationGallery';
import { FAQSection } from './components/FAQSection';
import { ProductComparisonModal } from './components/ProductComparisonModal';
import { LiveSocialProof } from './components/LiveSocialProof';
import { 
  ArrowUpDown, 
  LayoutGrid, 
  PackageOpen, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Info,
  X
} from 'lucide-react';

const MainStoreContent: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    products, 
    isLoadingProducts, 
    filters, 
    setFilters,
    toasts,
    user
  } = useStore();

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic SEO JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "NEXUS GAMING",
          "description": "Tienda digital de hardware, periféricos gaming de alto rendimiento, PCs personalizadas y componentes de última generación.",
          "url": "https://nexusgaming.com",
          "paymentAccepted": "Credit Card, PayPal, Cryptocurrency USDT, Bank Transfer",
          "currenciesAccepted": "USD, EUR, MXN",
          "openingHours": "Mo-Su 00:00-24:00"
        })
      }} />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        
        {/* VIEW 1: Catalog & Home */}
        {currentView === 'catalog' && (
          <div className="space-y-8">
            {/* Show Hero and Flash Deals only when not actively searching */}
            {!filters.search && filters.category === 'all' && (
              <>
                <Hero />
                <div id="ofertas-flash">
                  <FlashDealsSection />
                </div>
              </>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              
              {/* Category / Search Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading uppercase tracking-wide">
                      {filters.search 
                        ? `Búsqueda: "${filters.search}"`
                        : filters.category === 'all'
                        ? 'Catálogo Completo de Hardware'
                        : `Categoría: ${filters.category.replace('-', ' ')}`}
                    </h2>
                    <span className="text-xs bg-slate-900 text-cyan-400 border border-slate-700 px-2 py-0.5 rounded font-tech">
                      {products.length} productos
                    </span>
                  </div>
                  {filters.search && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                      className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1 mt-1 font-tech"
                    >
                      <X className="w-3 h-3" />
                      <span>Limpiar búsqueda</span>
                    </button>
                  )}
                </div>

                {/* Sort & Order Dropdown */}
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                    <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-400 font-tech">Ordenar:</span>
                    <select
                      value={filters.sortBy}
                      onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                      className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="featured" className="bg-slate-900">Destacados</option>
                      <option value="price-asc" className="bg-slate-900">Menor Precio</option>
                      <option value="price-desc" className="bg-slate-900">Mayor Precio</option>
                      <option value="rating" className="bg-slate-900">Mejor Valorados</option>
                      <option value="newest" className="bg-slate-900">Novedades</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout: Sidebar Filter + Product Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left: Filter Sidebar */}
                <div className="lg:col-span-3">
                  <ProductFilter />
                </div>

                {/* Right: Products Grid */}
                <div className="lg:col-span-9">
                  {isLoadingProducts ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm font-tech text-slate-400">Consultando stock en almacén...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="bg-[#101422] rounded-2xl border border-slate-800 p-12 text-center space-y-4">
                      <PackageOpen className="w-16 h-16 text-slate-400 mx-auto" />
                      <h3 className="text-lg font-bold text-white font-heading">
                        No se encontraron productos con estos filtros
                      </h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Intenta ajustar el rango de precios, limpiar la búsqueda o explorar otra categoría.
                      </p>
                      <button
                        onClick={() => setFilters({
                          search: '',
                          category: 'all',
                          brands: [],
                          minPrice: 0,
                          maxPrice: 5000,
                          onlyInStock: false,
                          sortBy: 'featured'
                        })}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs font-tech rounded-lg transition-colors cursor-pointer"
                      >
                        Restablecer todos los filtros
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Elite Gaming Sections: Benchmarks, Setups, and FAQ */}
            {!filters.search && filters.category === 'all' && (
              <>
                <div id="benchmarks-lab">
                  <BenchmarkLab />
                </div>
                <div id="setups-gallery">
                  <BattleStationGallery />
                </div>
                <div id="faq-section">
                  <FAQSection />
                </div>
              </>
            )}

          </div>
        )}

        {/* VIEW 2: Interactive PC Builder */}
        {currentView === 'pc-builder' && <PCBuilder />}

        {/* VIEW 3: Product Detail View */}
        {currentView === 'product-detail' && <ProductDetailModal />}

        {/* VIEW 4: Order History / Customer Portal */}
        {currentView === 'orders' && <OrderHistoryView />}

        {/* VIEW 5: Admin Panel */}
        {currentView === 'admin' && <AdminPanel />}

      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Hardware Comparison Drawer / Modal */}
      <ProductComparisonModal />

      {/* Checkout & Official Invoice Modal */}
      <CheckoutModal />

      {/* Real-time Non-intrusive Social Proof Ticker */}
      <LiveSocialProof />

      {/* Main Footer */}
      <Footer />

      {/* Floating Real-time Feedback Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border text-xs shadow-2xl flex items-center space-x-2.5 backdrop-blur-md animate-fade-in ${
              toast.type === 'success'
                ? 'bg-slate-950/90 text-emerald-400 border-emerald-500/50 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-slate-950/90 text-red-400 border-red-500/50 shadow-red-950/40'
                : 'bg-slate-950/90 text-cyan-300 border-cyan-500/50 shadow-cyan-950/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainStoreContent />
    </StoreProvider>
  );
}
