export type ProductCategory = 
  | 'gpus' 
  | 'cpus' 
  | 'motherboards' 
  | 'ram' 
  | 'storage' 
  | 'cooling' 
  | 'power-supplies' 
  | 'cases' 
  | 'peripherals' 
  | 'monitors' 
  | 'laptops' 
  | 'prebuilt-pcs';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  brand: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  badges?: Array<'HOT' | 'OFERTA' | 'NUEVO' | 'TOP TIER' | 'LIMITADO'>;
  featured?: boolean;
  warrantyMonths: number;
  // Specific attributes for PC Builder compatibility
  watts?: number;
  socket?: string; // e.g., 'AM5', 'LGA1700'
  formFactor?: string; // 'ATX', 'Micro-ATX', 'Mini-ITX'
  memoryType?: string; // 'DDR5', 'DDR4'
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'paypal' | 'crypto' | 'transfer';
export type PaymentStatus = 'paid' | 'pending' | 'failed';

export interface Order {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    notes?: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  deliveredAt?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  expiresAt?: string;
}

export interface FilterState {
  search: string;
  category: ProductCategory | 'all';
  brands: string[];
  minPrice: number;
  maxPrice: number;
  onlyInStock: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface PCBuildSelection {
  cpu?: Product;
  motherboard?: Product;
  ram?: Product;
  gpu?: Product;
  storage?: Product;
  psu?: Product;
  case?: Product;
  cooler?: Product;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  recentOrders: Order[];
  topSellingProducts: { product: Product; unitsSold: number; revenue: number }[];
}
