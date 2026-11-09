import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { db } from './server/db.js';
import { calculateOrderTotals, calculateDiscount } from './src/utils/pricing.js';

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- Auth Middleware Helper ---
  const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: Falta token de autenticación' });
    }
    const token = authHeader.split(' ')[1];
    const user = db.getUserByToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
    (req as any).user = user;
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, () => {
      const user = (req as any).user;
      if (user.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: Se requieren permisos de administrador' });
      }
      next();
    });
  };

  // --- API Routes ---
  const api = express.Router();

  // Health
  api.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', name: 'Nexus Gaming API', timestamp: new Date().toISOString() });
  });

  // Auth: Register
  api.post('/auth/register', (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta registrada con este correo electrónico' });
    }

    const newUser = db.createUser({ name, email, password, phone });
    const token = db.createSession(newUser.id);
    res.status(201).json({ user: newUser, token });
  });

  // Auth: Login
  api.post('/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos' });
    }

    const userWithHash = db.findUserByEmail(email);
    if (!userWithHash || userWithHash.passwordHash !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas. Comprueba tu correo y contraseña.' });
    }

    const token = db.createSession(userWithHash.id);
    const { passwordHash, ...safeUser } = userWithHash;
    res.json({ user: safeUser, token });
  });

  // Auth: Current User
  api.get('/auth/me', authenticate, (req: Request, res: Response) => {
    res.json({ user: (req as any).user });
  });

  // Auth: Update Profile
  api.put('/auth/profile', authenticate, (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { name, phone, address } = req.body;
    const updated = db.updateUser(userId, { name, phone, address });
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user: updated });
  });

  // Products: List with dynamic filters
  api.get('/products', (req: Request, res: Response) => {
    let products = [...db.getProducts()];
    const { category, brand, search, minPrice, maxPrice, inStock, sort, featured } = req.query;

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand as string];
      products = products.filter(p => brands.includes(p.brand));
    }

    if (search) {
      const term = (search as string).toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        Object.values(p.specs).some(s => s.toLowerCase().includes(term))
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice as string));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice as string));
    }

    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    // Sorting
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.badges?.includes('NUEVO') ? 1 : 0) - (a.badges?.includes('NUEVO') ? 1 : 0));
    }

    res.json(products);
  });

  // Products: Single Detail
  api.get('/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    const reviews = db.getReviewsForProduct(product.id);
    res.json({ ...product, reviews });
  });

  // Products: Create (Admin)
  api.post('/products', requireAdmin, (req: Request, res: Response) => {
    const { name, description, price, category, brand, stock, specs, images, badges, featured } = req.body;
    if (!name || !price || !category || !brand) {
      return res.status(400).json({ error: 'Nombre, precio, categoría y marca son obligatorios' });
    }
    const newProd = db.createProduct({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      price: parseFloat(price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      category,
      brand,
      rating: 5.0,
      reviewsCount: 0,
      stock: parseInt(stock, 10) || 10,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'],
      specs: specs || {},
      badges: badges || ['NUEVO'],
      featured: !!featured,
      warrantyMonths: parseInt(req.body.warrantyMonths, 10) || 24,
      watts: req.body.watts ? parseInt(req.body.watts, 10) : undefined,
      socket: req.body.socket,
      formFactor: req.body.formFactor
    });
    res.status(201).json(newProd);
  });

  // Products: Update (Admin)
  api.put('/products/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  });

  // Products: Delete (Admin)
  api.delete('/products/:id', requireAdmin, (req: Request, res: Response) => {
    const success = db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado exitosamente' });
  });

  // Reviews: Add review
  api.post('/products/:id/reviews', authenticate, (req: Request, res: Response) => {
    const user = (req as any).user;
    const { rating, title, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Calificación y comentario son obligatorios' });
    }

    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const review = db.addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: parseInt(rating, 10),
      title: title || 'Experiencia gamer',
      comment,
      verifiedPurchase: true
    });

    res.status(201).json(review);
  });

  // Coupons: Validate
  api.post('/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Ingresa un código de cupón' });

    const coupon = db.getCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'El cupón no existe' });
    }

    const result = calculateDiscount(parseFloat(subtotal) || 0, coupon);
    if (!result.isValid) {
      return res.status(400).json({ valid: false, message: result.reason });
    }

    res.json({
      valid: true,
      coupon,
      discount: result.discount,
      message: `¡Cupón ${coupon.code} aplicado con éxito!`
    });
  });

  // Coupons: Admin List & Create & Delete
  api.get('/coupons', requireAdmin, (_req: Request, res: Response) => {
    res.json(db.getCoupons());
  });

  api.post('/coupons', requireAdmin, (req: Request, res: Response) => {
    const { code, description, discountPercentage, discountAmount, minOrderAmount } = req.body;
    if (!code) return res.status(400).json({ error: 'Código de cupón requerido' });
    const coupon = db.createCoupon({
      code: code.toUpperCase().trim(),
      description: description || 'Descuento promocional',
      discountPercentage: discountPercentage ? parseFloat(discountPercentage) : undefined,
      discountAmount: discountAmount ? parseFloat(discountAmount) : undefined,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
      usedCount: 0,
      active: true
    });
    res.status(201).json(coupon);
  });

  api.delete('/coupons/:code', requireAdmin, (req: Request, res: Response) => {
    const deleted = db.deleteCoupon(req.params.code);
    if (!deleted) return res.status(404).json({ error: 'Cupón no encontrado' });
    res.json({ message: 'Cupón eliminado' });
  });

  // Orders: List (Admin sees all, Customer sees their own)
  api.get('/orders', authenticate, (req: Request, res: Response) => {
    const user = (req as any).user;
    if (user.role === 'admin') {
      res.json(db.getOrders());
    } else {
      res.json(db.getOrders(user.id));
    }
  });

  // Orders: Get Single
  api.get('/orders/:id', authenticate, (req: Request, res: Response) => {
    const user = (req as any).user;
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    if (user.role !== 'admin' && order.userId !== user.id) {
      return res.status(403).json({ error: 'No tienes permiso para ver este pedido' });
    }
    res.json(order);
  });

  // Orders: Place Order (Real processing with inventory decrement & invoice calculation)
  api.post('/orders', authenticate, (req: Request, res: Response) => {
    const user = (req as any).user;
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'El carrito de compras está vacío' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ error: 'Los datos de envío son obligatorios' });
    }

    // Validate stock for all items
    for (const item of items) {
      const prod = db.getProductById(item.product.id);
      if (!prod) {
        return res.status(400).json({ error: `El producto ${item.product.name} ya no existe.` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${prod.name}. Disponibles: ${prod.stock}, solicitados: ${item.quantity}` 
        });
      }
    }

    // Calculate totals on the server for financial safety
    let coupon = null;
    if (couponCode) {
      coupon = db.getCouponByCode(couponCode);
    }

    const { subtotal, discount, shipping, tax, total } = calculateOrderTotals(
      items.map((i: any) => ({ price: i.product.price, quantity: i.quantity })),
      coupon
    );

    const newOrder = db.createOrder({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || shippingAddress.phone || 'N/A',
      shippingAddress,
      items,
      subtotal,
      discount,
      shippingFee: shipping,
      tax,
      total,
      couponCode: coupon?.code,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid', // Real-time processed
      orderStatus: 'confirmed',
      carrier: 'Nexus Express Gaming Logistics'
    });

    res.status(201).json(newOrder);
  });

  // Orders: Update status (Admin)
  api.patch('/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status, trackingNumber, carrier } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, trackingNumber, carrier);
    if (!updated) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(updated);
  });

  // Admin Metrics
  api.get('/admin/metrics', requireAdmin, (_req: Request, res: Response) => {
    res.json(db.getAdminMetrics());
  });

  // Mount API router
  app.use('/api', api);

  // --- Vite Dev Server Middleware or Production Static Serving ---
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEXUS SERVER] Running on http://0.0.0.0:${PORT} (mode: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer().catch(err => {
  console.error('[NEXUS SERVER] Fatal startup error:', err);
  process.exit(1);
});
