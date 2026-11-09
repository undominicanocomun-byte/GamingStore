import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  ShoppingCart, 
  Heart, 
  Cpu, 
  ShieldAlert, 
  User as UserIcon, 
  Package, 
  LogOut, 
  Menu, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useStore, Currency } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    cart, 
    setIsCartOpen, 
    wishlist, 
    user, 
    logout, 
    switchDemoRole, 
    filters, 
    setFilters,
    currency,
    setCurrency,
    cartTotals,
    formatPrice
  } = useStore();

  const [searchVal, setSearchVal] = useState(filters.search);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchVal }));
    if (currentView !== 'catalog') setCurrentView('catalog');
  };

  const handleCategoryClick = (category: typeof filters.category) => {
    setFilters(prev => ({ ...prev, category, search: '' }));
    setSearchVal('');
    setCurrentView('catalog');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0d14]/95 backdrop-blur-md border-b border-cyan-950/60 shadow-2xl">
      {/* Top micro bar for gaming alerts and role switcher */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-cyan-950/40 border-b border-cyan-900/30 px-3 sm:px-4 py-1 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            <span className="inline-flex items-center text-cyan-400 font-semibold tracking-wider font-tech text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-1.5"></span>
              NEXUS RIGS 2026
            </span>
            <span className="hidden md:inline text-slate-400 text-[11px]">
              &bull; Garantía 3 Años &bull; Envíos 24h &bull; Cuotas 0%
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-2 sm:space-x-3">
            {/* Currency selector */}
            <div className="flex items-center space-x-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700/60 shrink-0">
              <span className="text-[10px] text-slate-400 hidden xs:inline">Moneda:</span>
              {(['USD', 'EUR', 'MXN'] as Currency[]).map(curr => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    currency === curr 
                      ? 'bg-cyan-500 text-black shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="flex items-center space-x-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-500/30 shrink-0">
              <span className="text-[10px] text-slate-400 hidden md:inline">Modo:</span>
              <button
                onClick={() => switchDemoRole('customer')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  user?.role === 'customer'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Cambiar a cuenta Gamer Cliente"
              >
                Gamer
              </button>
              <button
                onClick={() => switchDemoRole('admin')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  user?.role === 'admin'
                    ? 'bg-purple-600 text-white shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Cambiar a Administrador de la Tienda"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all', search: '' }));
              setSearchVal('');
              setCurrentView('catalog');
            }} 
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all">
              <div className="w-full h-full bg-[#090a10] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading text-2xl font-bold tracking-wider text-white">
                  NEXUS<span className="text-cyan-400">GAMING</span>
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-tech block -mt-1">
                Elite Hardware & Custom Rigs
              </span>
            </div>
          </button>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Buscar RTX 5090, Ryzen 7800X3D, OLED 240Hz, teclados..."
                className="w-full bg-slate-900/90 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-24 py-2.5 rounded-lg border border-slate-700/70 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchVal && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchVal('');
                    setFilters(prev => ({ ...prev, search: '' }));
                  }}
                  className="absolute right-16 top-2.5 text-xs text-slate-400 hover:text-white px-1"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs rounded transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* PC Builder Button */}
            <button
              onClick={() => setCurrentView('pc-builder')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-tech text-sm font-semibold transition-all border ${
                currentView === 'pc-builder'
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-900/80 text-cyan-300 border-cyan-800/60 hover:border-cyan-400 hover:bg-cyan-950/30'
              }`}
            >
              <Cpu className="w-4 h-4 text-current animate-pulse" />
              <span className="hidden lg:inline">PC Builder</span>
              <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.2 rounded font-sans uppercase">
                TDP Live
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all' }));
                setCurrentView('catalog');
              }}
              className="relative p-2.5 text-slate-300 hover:text-pink-400 rounded-lg hover:bg-slate-800/60 transition-colors"
              title="Lista de Deseos"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#090a0f]">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)]"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-xs font-tech font-bold">
                {formatPrice(cartTotals.total)}
              </span>
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-[#090a0f]">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg border border-slate-700/60 hover:border-cyan-400/60 bg-slate-900/80 transition-colors"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-md object-cover border border-cyan-400/40" />
                ) : (
                  <div className="w-8 h-8 rounded-md bg-purple-900/50 flex items-center justify-center text-purple-300 font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'G'}
                  </div>
                )}
                <div className="hidden xl:block text-left text-xs">
                  <div className="font-semibold text-white truncate max-w-[100px]">{user?.name}</div>
                  <div className="text-[10px] text-cyan-400 uppercase font-tech">{user?.role}</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#101422] rounded-xl border border-cyan-900/60 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Sesión activa como:</p>
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      user?.role === 'admin' ? 'bg-purple-900/70 text-purple-300 border border-purple-500/40' : 'bg-cyan-900/70 text-cyan-300'
                    }`}>
                      Rol: {user?.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentView('orders');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800/70 transition-colors"
                    >
                      <Package className="w-4 h-4 text-cyan-400" />
                      <span>Mis Pedidos & Facturas</span>
                    </button>

                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentView('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-purple-300 hover:bg-purple-950/40 transition-colors font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-400" />
                        <span>Panel de Administración</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Quick Category Sub-Navigation Bar */}
        <div className="hidden md:flex items-center space-x-1 py-2 border-t border-slate-800/80 overflow-x-auto text-xs font-tech">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, category: 'all', search: '' }));
              setCurrentView('catalog');
              setTimeout(() => {
                const el = document.getElementById('ofertas-flash');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3 py-1 rounded bg-gradient-to-r from-red-600 to-amber-500 text-black font-extrabold uppercase flex items-center space-x-1 shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-transform hover:scale-105 mr-1"
          >
            <span>🔥 OFERTAS FLASH (-30%)</span>
          </button>
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'all' && currentView === 'catalog'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TODOS LOS PRODUCTOS
          </button>
          <button
            onClick={() => handleCategoryClick('gpus')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'gpus' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            TARJETAS GRÁFICAS (RTX / RX)
          </button>
          <button
            onClick={() => handleCategoryClick('cpus')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'cpus' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            PROCESADORES (RYZEN / INTEL)
          </button>
          <button
            onClick={() => handleCategoryClick('monitors')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'monitors' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            MONITORES OLED & 240HZ+
          </button>
          <button
            onClick={() => handleCategoryClick('peripherals')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'peripherals' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            PERIFÉRICOS ESPORTS
          </button>
          <button
            onClick={() => handleCategoryClick('prebuilt-pcs')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'prebuilt-pcs' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            PCS PRE-ARMADAS
          </button>
          <button
            onClick={() => handleCategoryClick('laptops')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              filters.category === 'laptops' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            LAPTOPS GAMING
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f18] border-b border-cyan-900/60 px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Buscar en el catálogo..."
              className="w-full bg-slate-900 text-sm text-slate-100 pl-10 pr-4 py-2.5 rounded-lg border border-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-tech">
            <button onClick={() => handleCategoryClick('all')} className="p-2 bg-slate-900 rounded text-left text-slate-200">
              Todos los productos
            </button>
            <button onClick={() => handleCategoryClick('gpus')} className="p-2 bg-slate-900 rounded text-left text-slate-200">
              Tarjetas Gráficas
            </button>
            <button onClick={() => handleCategoryClick('cpus')} className="p-2 bg-slate-900 rounded text-left text-slate-200">
              Procesadores
            </button>
            <button onClick={() => handleCategoryClick('monitors')} className="p-2 bg-slate-900 rounded text-left text-slate-200">
              Monitores Gaming
            </button>
            <button onClick={() => handleCategoryClick('peripherals')} className="p-2 bg-slate-900 rounded text-left text-slate-200">
              Periféricos
            </button>
            <button onClick={() => handleCategoryClick('prebuilt-pcs')} className="p-2 bg-slate-900 rounded text-left text-slate-200">
              PCs Armadas
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
