import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, CartItem, Order, Coupon, PCBuildSelection, FilterState } from '../types/index';
import { calculateOrderTotals, validatePCCompatibility, calculateDiscount } from '../utils/pricing';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS } from '../data/initialProducts';

export type Currency = 'USD' | 'EUR' | 'MXN';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Navigation & Views
  currentView: 'catalog' | 'pc-builder' | 'orders' | 'admin' | 'product-detail';
  setCurrentView: (view: 'catalog' | 'pc-builder' | 'orders' | 'admin' | 'product-detail') => void;
  selectedProductId: string | null;
  openProductDetail: (productId: string) => void;
  closeProductDetail: () => void;

  // Products & Filtering
  products: Product[];
  allProducts: Product[];
  isLoadingProducts: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  refreshProducts: () => Promise<void>;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  cartTotals: ReturnType<typeof calculateOrderTotals>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Comparison Tool
  compareList: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Checkout
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;

  // Auth & Roles
  user: User | null;
  token: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  switchDemoRole: (role: 'admin' | 'customer') => Promise<void>;

  // PC Builder
  pcBuild: PCBuildSelection;
  setPCBuildComponent: (category: keyof PCBuildSelection, product?: Product) => void;
  clearPCBuild: () => void;
  addPCBuildToCart: () => void;
  pcBuildValidation: ReturnType<typeof validatePCCompatibility>;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number) => string;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  MXN: { symbol: '$MXN ', rate: 19.5 }
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'catalog' | 'pc-builder' | 'orders' | 'admin' | 'product-detail'>('catalog');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    brands: [],
    minPrice: 0,
    maxPrice: 5000,
    onlyInStock: false,
    sortBy: 'featured'
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nexus_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison Tool
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [user, setUser] = useState<User | null>({
    id: 'user-customer',
    name: 'Carlos "Shadow" Rivera',
    email: 'gamer@nexusgaming.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    phone: '+1 555 382 9182',
    address: {
      street: 'Calle de los Gamers 777, Depto 402',
      city: 'Guadalajara',
      state: 'Jalisco',
      zipCode: '44100',
      country: 'México'
    },
    createdAt: '2026-02-15T14:30:00.000Z'
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nexus_token') || 'gamer-token-nexus-2026');
  const [pcBuild, setPcBuild] = useState<PCBuildSelection>({});
  const [currency, setCurrency] = useState<Currency>('USD');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Resilient product fetcher: Queries server first, gracefully uses client filter on static Vercel hosts
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const query = new URLSearchParams();
      if (filters.category && filters.category !== 'all') query.append('category', filters.category);
      if (filters.search) query.append('search', filters.search);
      if (filters.onlyInStock) query.append('inStock', 'true');
      if (filters.sortBy) query.append('sort', filters.sortBy);
      if (filters.minPrice > 0) query.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice < 5000) query.append('maxPrice', filters.maxPrice.toString());
      filters.brands.forEach(b => query.append('brand', b));

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        return;
      }
      throw new Error('API unreachable or static host');
    } catch {
      // Client-side fallback engine
      let clientProds = [...INITIAL_PRODUCTS];

      if (filters.category && filters.category !== 'all') {
        clientProds = clientProds.filter(p => p.category === filters.category);
      }

      if (filters.brands.length > 0) {
        clientProds = clientProds.filter(p => filters.brands.includes(p.brand));
      }

      if (filters.search) {
        const term = filters.search.toLowerCase().trim();
        clientProds = clientProds.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term)
        );
      }

      if (filters.minPrice > 0) {
        clientProds = clientProds.filter(p => p.price >= filters.minPrice);
      }

      if (filters.maxPrice < 5000) {
        clientProds = clientProds.filter(p => p.price <= filters.maxPrice);
      }

      if (filters.onlyInStock) {
        clientProds = clientProds.filter(p => p.stock > 0);
      }

      if (filters.sortBy === 'price-asc') {
        clientProds.sort((a, b) => a.price - b.price);
      } else if (filters.sortBy === 'price-desc') {
        clientProds.sort((a, b) => b.price - a.price);
      } else if (filters.sortBy === 'rating') {
        clientProds.sort((a, b) => b.rating - a.rating);
      }

      setProducts(clientProds);
      setAllProducts(INITIAL_PRODUCTS);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Restore current user session
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('nexus_token');
      if (storedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setToken(storedToken);
            return;
          }
        } catch {
          // Fall through
        }
      }
    };

    checkAuth();
  }, []);

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Refresh products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} está agotado actualmente`, 'error');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });

    showToast(`¡${product.name} añadido al carrito!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Producto eliminado del carrito', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Eliminado de tu lista de deseos', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Guardado en tu lista de deseos', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare Tool
  const addToCompare = (productId: string) => {
    if (compareList.length >= 3) {
      showToast('Puedes comparar un máximo de 3 productos a la vez', 'error');
      return;
    }
    if (!compareList.includes(productId)) {
      setCompareList(prev => [...prev, productId]);
      showToast('Producto añadido al comparador', 'success');
      setIsCompareOpen(true);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareOpen(false);
  };

  const applyCoupon = async (code: string) => {
    try {
      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          setAppliedCoupon(data.coupon);
          showToast(data.message, 'success');
          return { success: true, message: data.message };
        }
      }
    } catch {
      // Fallback client validation
    }

    // Client-side fallback coupon checking
    const matched = INITIAL_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (matched) {
      setAppliedCoupon(matched);
      showToast(`¡Cupón ${matched.code} aplicado con éxito!`, 'success');
      return { success: true, message: 'Cupón aplicado' };
    }

    showToast('Cupón inválido o expirado', 'error');
    return { success: false, message: 'Cupón inválido' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  const cartTotals = calculateOrderTotals(
    cart.map(i => ({ price: i.product.price, quantity: i.quantity })),
    appliedCoupon
  );

  // Auth functions
  const login = async (email: string, password = 'password') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('nexus_token', data.token);
        showToast(`Bienvenido de nuevo, ${data.user.name}`, 'success');
        return true;
      }
    } catch {
      // Fallback
    }

    // Client demo auth
    const role = email.includes('admin') ? 'admin' : 'customer';
    const fallbackUser: User = {
      id: role === 'admin' ? 'user-admin' : 'user-customer',
      name: role === 'admin' ? 'Alex Mercer (Admin)' : 'Carlos "Shadow" Rivera',
      email,
      role,
      avatar: role === 'admin' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      createdAt: '2026-01-01T00:00:00.000Z'
    };
    setUser(fallbackUser);
    setToken('demo-token-nexus');
    localStorage.setItem('nexus_token', 'demo-token-nexus');
    showToast(`Bienvenido, ${fallbackUser.name}`, 'success');
    return true;
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'customer',
      phone,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    setToken(`token-${newUser.id}`);
    localStorage.setItem('nexus_token', `token-${newUser.id}`);
    showToast(`¡Bienvenido a NEXUS GAMING, ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexus_token');
    showToast('Sesión cerrada correctamente', 'info');
    setCurrentView('catalog');
  };

  const switchDemoRole = async (role: 'admin' | 'customer') => {
    const creds = role === 'admin' 
      ? { email: 'admin@nexusgaming.com', password: 'admin123' }
      : { email: 'gamer@nexusgaming.com', password: 'gamer123' };
    
    await login(creds.email, creds.password);
  };

  // PC Builder functions
  const setPCBuildComponent = (category: keyof PCBuildSelection, product?: Product) => {
    setPcBuild(prev => ({
      ...prev,
      [category]: product
    }));
  };

  const clearPCBuild = () => {
    setPcBuild({});
    showToast('Configurador de PC reiniciado', 'info');
  };

  const pcBuildValidation = validatePCCompatibility({
    cpu: pcBuild.cpu ? { ...pcBuild.cpu, category: 'cpu' } : undefined,
    motherboard: pcBuild.motherboard ? { ...pcBuild.motherboard, category: 'motherboard' } : undefined,
    gpu: pcBuild.gpu ? { ...pcBuild.gpu, category: 'gpu' } : undefined,
    psu: pcBuild.psu ? { ...pcBuild.psu, category: 'psu' } : undefined,
    cooler: pcBuild.cooler ? { ...pcBuild.cooler, category: 'cooler' } : undefined
  });

  const addPCBuildToCart = () => {
    const components = Object.values(pcBuild).filter((c): c is Product => Boolean(c));
    if (components.length === 0) {
      showToast('Selecciona al menos un componente para tu ensamble', 'error');
      return;
    }

    components.forEach(prod => addToCart(prod, 1));
    showToast(`¡${components.length} componentes de tu PC Gamer añadidos al carrito!`, 'success');
    setIsCartOpen(true);
  };

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
    setCurrentView('catalog');
  };

  const formatPrice = (amountInUSD: number): string => {
    const info = CURRENCY_RATES[currency];
    const converted = amountInUSD * info.rate;
    return `${info.symbol}${converted.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        openProductDetail,
        closeProductDetail,
        products,
        allProducts,
        isLoadingProducts,
        filters,
        setFilters,
        refreshProducts: fetchProducts,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartTotals,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastPlacedOrder,
        setLastPlacedOrder,
        user,
        token,
        login,
        register,
        logout,
        switchDemoRole,
        pcBuild,
        setPCBuildComponent,
        clearPCBuild,
        addPCBuildToCart,
        pcBuildValidation,
        currency,
        setCurrency,
        formatPrice,
        toasts,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
