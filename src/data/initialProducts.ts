import { Product, User, Coupon, Order, Review } from '../types/index';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-rtx-5090',
    name: 'NVIDIA GeForce RTX 5090 32GB GDDR7 Black Edition',
    slug: 'nvidia-geforce-rtx-5090-32gb',
    description: 'La tarjeta gráfica definitiva con arquitectura Blackwell. Cuenta con 32GB de memoria GDDR7 de última generación, DLSS 4, Full Ray Tracing con trazado de caminos en tiempo real y soporte para resoluciones 8K ultra.',
    price: 1999.99,
    originalPrice: 2199.99,
    category: 'gpus',
    brand: 'NVIDIA',
    rating: 4.9,
    reviewsCount: 38,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Memoria': '32 GB GDDR7',
      'Interfaz de Memoria': '512-bit',
      'Núcleos CUDA': '21,760',
      'Consumo TDP': '575 Watts',
      'Conectores': '1x 16-pin 12V-2x6',
      'Salidas': '3x DisplayPort 2.1b, 1x HDMI 2.1a'
    },
    badges: ['TOP TIER', 'HOT', 'NUEVO'],
    featured: true,
    warrantyMonths: 36,
    watts: 575
  },
  {
    id: 'prod-rtx-4080-super',
    name: 'ASUS ROG Strix GeForce RTX 4080 Super 16GB OC Edition',
    slug: 'asus-rog-strix-rtx-4080-super',
    description: 'Diseño térmico masivo con ventiladores Axial-tech, marco fundido a presión y cámara de vapor patentada para máxima disipación silenciosa a más de 2600 MHz.',
    price: 1149.99,
    originalPrice: 1249.99,
    category: 'gpus',
    brand: 'ASUS ROG',
    rating: 4.8,
    reviewsCount: 64,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Memoria': '16 GB GDDR6X',
      'Velocidad Boost': '2670 MHz (Modo OC)',
      'Consumo TDP': '320 Watts',
      'Ranuras': '3.5 slots',
      'Iluminación': 'AURA Sync ARGB'
    },
    badges: ['OFERTA', 'HOT'],
    featured: true,
    warrantyMonths: 36,
    watts: 320
  },
  {
    id: 'prod-ryzen-7800x3d',
    name: 'AMD Ryzen 7 7800X3D 8-Core 4.2GHz (5.0GHz Max Boost) AM5',
    slug: 'amd-ryzen-7-7800x3d',
    description: 'El procesador indiscutible rey del gaming con tecnología AMD 3D V-Cache de 96MB L3. Eficiencia energética récord y tasas de cuadros por segundo ultra estables en eSports y juegos AAA.',
    price: 449.99,
    originalPrice: 499.99,
    category: 'cpus',
    brand: 'AMD',
    rating: 5.0,
    reviewsCount: 112,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Núcleos / Hilos': '8C / 16T',
      'Socket': 'AM5',
      'Frecuencia Base / Boost': '4.2 GHz / 5.0 GHz',
      'Caché L3': '96 MB (3D V-Cache)',
      'TDP': '120 Watts',
      'Soporte Memoria': 'DDR5 hasta 6000MHz+'
    },
    badges: ['TOP TIER', 'HOT'],
    featured: true,
    warrantyMonths: 36,
    watts: 120,
    socket: 'AM5'
  },
  {
    id: 'prod-i9-14900ks',
    name: 'Intel Core i9-14900KS 24-Core Special Edition (6.2 GHz)',
    slug: 'intel-core-i9-14900ks',
    description: 'Procesador tope de gama con hasta 6.2 GHz de velocidad máxima con Intel Thermal Velocity Boost. 24 núcleos híbridos para streaming extremo y renderizado sin pausas.',
    price: 689.99,
    originalPrice: 729.99,
    category: 'cpus',
    brand: 'Intel',
    rating: 4.7,
    reviewsCount: 45,
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Núcleos': '24 (8P + 16E)',
      'Hilos': '32',
      'Frecuencia Máxima': '6.2 GHz',
      'Socket': 'LGA1700',
      'Consumo TDP': '253 Watts (PL2)',
      'Caché Intel Smart': '36 MB'
    },
    badges: ['TOP TIER'],
    featured: false,
    warrantyMonths: 36,
    watts: 253,
    socket: 'LGA1700'
  },
  {
    id: 'prod-mobo-x670e',
    name: 'ASUS ROG Crosshair X670E Hero Gaming WiFi 6E',
    slug: 'asus-rog-crosshair-x670e-hero',
    description: 'Placa base de nivel entusiasta para socket AM5 con 18+2 etapas de potencia de 110A, puertos duales USB4 Tipo-C y 5 ranuras M.2 PCIe 5.0 con disipadores térmicos integrados.',
    price: 629.99,
    category: 'motherboards',
    brand: 'ASUS ROG',
    rating: 4.9,
    reviewsCount: 29,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Socket': 'AM5 (AMD Ryzen Serie 7000/8000/9000)',
      'Factor de Forma': 'ATX',
      'VRM': '18+2 Etapas (110A)',
      'Ranuras RAM': '4x DDR5 hasta 8000+ (OC)',
      'PCIe': '2x PCIe 5.0 x16',
      'Red': 'Intel 2.5Gb Ethernet + WiFi 6E'
    },
    badges: ['TOP TIER'],
    warrantyMonths: 36,
    socket: 'AM5',
    formFactor: 'ATX',
    memoryType: 'DDR5'
  },
  {
    id: 'prod-mobo-z790',
    name: 'MSI MEG Z790 ACE MAX E-ATX Gaming Motherboard',
    slug: 'msi-meg-z790-ace-max',
    description: 'Placa base premium LGA1700 con soporte para procesadores Intel de 14va generación, 24+1+2 fases de poder, Wi-Fi 7 y audio ESS SABRE Hi-Fi.',
    price: 599.99,
    category: 'motherboards',
    brand: 'MSI',
    rating: 4.8,
    reviewsCount: 18,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Socket': 'LGA1700',
      'Factor de Forma': 'E-ATX',
      'VRM': '24+1+2 Fases Directas',
      'Red': 'Dual 2.5G LAN + Wi-Fi 7',
      'Puertos M.2': '5x M.2 (1x PCIe 5.0)'
    },
    badges: ['NUEVO'],
    warrantyMonths: 36,
    socket: 'LGA1700',
    formFactor: 'ATX',
    memoryType: 'DDR5'
  },
  {
    id: 'prod-ram-dominator',
    name: 'Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6400MHz',
    slug: 'corsair-dominator-titanium-rgb-64gb-ddr5',
    description: 'Módulos de aluminio forjado de precisión con 11 LEDs RGB CAPELLIX direccionables individualmente y tecnología de refrigeración patentada Corsair DHX.',
    price: 319.99,
    originalPrice: 349.99,
    category: 'ram',
    brand: 'Corsair',
    rating: 4.9,
    reviewsCount: 52,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Capacidad': '64 GB (2 x 32 GB)',
      'Tipo': 'DDR5',
      'Velocidad': '6400 MT/s',
      'Latencia CAS': 'CL32',
      'Perfiles': 'Intel XMP 3.0 & AMD EXPO'
    },
    badges: ['TOP TIER'],
    featured: true,
    warrantyMonths: 60,
    memoryType: 'DDR5'
  },
  {
    id: 'prod-ssd-990pro',
    name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 con Disipador Térmico',
    slug: 'samsung-990-pro-2tb-heatsink',
    description: 'Velocidades vertiginosas de lectura/escritura de hasta 7450 / 6900 MB/s. Equipado con disipador térmico delgado compatible con PlayStation 5 y PC de alto rendimiento.',
    price: 189.99,
    originalPrice: 219.99,
    category: 'storage',
    brand: 'Samsung',
    rating: 5.0,
    reviewsCount: 88,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Capacidad': '2 TB',
      'Velocidad de Lectura': 'Hasta 7450 MB/s',
      'Velocidad de Escritura': 'Hasta 6900 MB/s',
      'Interfaz': 'PCIe Gen 4.0 x4, NVMe 2.0',
      'Garantía Escrita': '1200 TBW'
    },
    badges: ['OFERTA', 'HOT'],
    featured: true,
    warrantyMonths: 60
  },
  {
    id: 'prod-psu-rm1000x',
    name: 'Corsair RM1000x Shift 1000W 80 Plus Gold Modular ATX 3.0',
    slug: 'corsair-rm1000x-shift-1000w',
    description: 'Revolucionario panel de conectores laterales modulares para fácil acceso y gestión limpia de cables. Certificación 80 PLUS Gold, PCIe 5.0 y condensadores japoneses 105°C.',
    price: 219.99,
    category: 'power-supplies',
    brand: 'Corsair',
    rating: 4.9,
    reviewsCount: 41,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Potencia': '1000 Watts',
      'Certificación': '80 PLUS Gold',
      'Estándar': 'ATX 3.0 & PCIe 5.0 12VHPWR',
      'Ventilador': '140mm FDB con modo Zero RPM',
      'Garantía': '10 años fabricante'
    },
    badges: ['TOP TIER'],
    warrantyMonths: 120,
    watts: 1000
  },
  {
    id: 'prod-cooler-kraken',
    name: 'NZXT Kraken Elite 360 RGB Sistema de Refrigeración Líquida LCD',
    slug: 'nzxt-kraken-elite-360-rgb',
    description: 'Bomba Asetek de 7ma generación y pantalla LCD gran angular de 2.36" con resolución nítida de 640x640 para monitorear temperaturas de CPU en tiempo real o reproducir GIFs personalizados.',
    price: 279.99,
    originalPrice: 299.99,
    category: 'cooling',
    brand: 'NZXT',
    rating: 4.8,
    reviewsCount: 36,
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Radiador': '360 mm Aluminio',
      'Ventiladores': '3x 120mm F120 RGB Core',
      'Pantalla': '2.36" TFT LCD 640x640 60Hz',
      'Compatibilidad': 'Intel LGA1700/1200/115X, AMD AM5/AM4',
      'Nivel de Ruido': 'Hasta 30.6 dBA'
    },
    badges: ['HOT'],
    featured: true,
    warrantyMonths: 72,
    watts: 25
  },
  {
    id: 'prod-case-o11d',
    name: 'Lian Li O11 Dynamic EVO RGB Gabinete Gamer Doble Cámara',
    slug: 'lian-li-o11-dynamic-evo-rgb-black',
    description: 'Chasis icónico de vidrio templado dual sin pilares frontales, tiras RGB difusas en la parte superior e inferior, y soporte para radiadores de hasta 420mm.',
    price: 169.99,
    category: 'cases',
    brand: 'Lian Li',
    rating: 5.0,
    reviewsCount: 77,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Factor de Forma': 'Mid-Tower (Soporta E-ATX, ATX, M-ATX)',
      'Materiales': 'Aluminio cepillado, Vidrio templado 4mm',
      'Bahías de Almacenamiento': 'Hasta 8x SSD / HDD',
      'Soporte Radiadores': 'Arriba: 360/420mm, Lateral: 360mm, Abajo: 360mm'
    },
    badges: ['TOP TIER'],
    warrantyMonths: 24,
    formFactor: 'ATX'
  },
  {
    id: 'prod-monitor-pg32ucdm',
    name: 'ASUS ROG Swift OLED PG32UCDM 32" 4K UHD 240Hz 0.03ms QD-OLED',
    slug: 'asus-rog-swift-oled-pg32ucdm',
    description: 'El monitor definitivo para esports y simulación: panel QD-OLED de tercera generación con 240Hz nativos, tiempo de respuesta de 0.03ms, disipador personalizado de grafeno y KVM integrado.',
    price: 1299.99,
    originalPrice: 1399.99,
    category: 'monitors',
    brand: 'ASUS ROG',
    rating: 4.9,
    reviewsCount: 54,
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Pantalla': '31.5 Pulgadas QD-OLED',
      'Resolución': '3840 x 2160 (4K UHD)',
      'Tasa de Refresco': '240 Hz',
      'Tiempo de Respuesta': '0.03 ms (GTG)',
      'HDR': 'DisplayHDR True Black 400, Dolby Vision',
      'Puertos': '2x HDMI 2.1, 1x DP 1.4 (DSC), 1x USB-C 90W'
    },
    badges: ['TOP TIER', 'HOT', 'LIMITADO'],
    featured: true,
    warrantyMonths: 36
  },
  {
    id: 'prod-keyboard-huntsman',
    name: 'Razer Huntsman V3 Pro Teclado Analógico Óptico Gen-2',
    slug: 'razer-huntsman-v3-pro-analog',
    description: 'Switches analógicos ópticos Razer de 2da generación con Rapid Trigger regulable de 0.1 a 4.0 mm para frenadas instantáneas en shooters tácticos como Valorant y CS2.',
    price: 249.99,
    category: 'peripherals',
    brand: 'Razer',
    rating: 4.8,
    reviewsCount: 42,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Interruptores': 'Razer Analog Optical Gen-2',
      'Actuación Ajustable': '0.1 mm a 4.0 mm',
      'Polling Rate': '1000 Hz nativo',
      'Keycaps': 'PBT Doble Inyección texturizado',
      'Reposamuñecas': 'Magnético de piel sintética'
    },
    badges: ['HOT'],
    featured: true,
    warrantyMonths: 24
  },
  {
    id: 'prod-mouse-superlight2',
    name: 'Logitech G PRO X SUPERLIGHT 2 Ratón Inalámbrico 60g Lightspeed',
    slug: 'logitech-g-pro-x-superlight-2',
    description: 'Peso pluma de solo 60 gramos con interruptores híbridos LIGHTFORCE óptico-mecánicos y sensor HERO 2 de 32,000 DPI con tasa de sondeo de hasta 4000 Hz.',
    price: 159.99,
    originalPrice: 179.99,
    category: 'peripherals',
    brand: 'Logitech G',
    rating: 4.9,
    reviewsCount: 130,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Peso': '60 gramos',
      'Sensor': 'HERO 2 (32,000 DPI, 500+ IPS)',
      'Tasa de Informe': 'Hasta 4000 Hz / 0.25 ms',
      'Batería': 'Hasta 95 horas continuas',
      'Conexión': 'LIGHTSPEED 2.4GHz + USB-C'
    },
    badges: ['OFERTA', 'HOT'],
    featured: true,
    warrantyMonths: 24
  },
  {
    id: 'prod-headset-arctis',
    name: 'SteelSeries Arctis Nova Pro Wireless Auriculares Gaming Hi-Res',
    slug: 'steelseries-arctis-nova-pro-wireless',
    description: 'Cancelación Activa de Ruido (ANC) de 4 micrófonos con sistema de swap de batería en caliente infinito y estación base con DAC OLED multiconexión PC/Consola.',
    price: 349.99,
    category: 'peripherals',
    brand: 'SteelSeries',
    rating: 4.8,
    reviewsCount: 61,
    stock: 13,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Audio': 'Drivers de Neodimio Hi-Res (10-40,000 Hz)',
      'Cancelación de Ruido': 'ANC de 4 micrófonos con modo transparencia',
      'Sistema de Batería': 'Batería dual intercambiable en caliente',
      'Micrófono': 'ClearCast Gen 2 retráctil con IA bidirectional'
    },
    badges: ['TOP TIER'],
    warrantyMonths: 24
  },
  {
    id: 'prod-prebuilt-titan',
    name: 'NEXUS VALKYRIE TITAN RTX 5090 Prebuilt Gaming Desktop PC',
    slug: 'nexus-valkyrie-titan-rtx-5090-prebuilt',
    description: 'Ensamble artesanal probado en banco de estrés con garantía total de 3 años: AMD Ryzen 7 7800X3D + NVIDIA RTX 5090 32GB + 64GB DDR5 6400MHz + 4TB NVMe Gen4 + Líquida 360mm.',
    price: 4399.99,
    originalPrice: 4799.99,
    category: 'prebuilt-pcs',
    brand: 'NEXUS Builds',
    rating: 5.0,
    reviewsCount: 19,
    stock: 4,
    images: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'GPU': 'NVIDIA GeForce RTX 5090 32GB GDDR7',
      'Procesador': 'AMD Ryzen 7 7800X3D 8C/16T',
      'Memoria RAM': '64GB Corsair Dominator Titanium DDR5',
      'Almacenamiento': '4TB Samsung 990 PRO NVMe (2x2TB)',
      'Fuente': 'Corsair RM1200x Shift 80+ Gold',
      'Gabinete': 'Lian Li O11D EVO RGB con 9 ventiladores ARGB'
    },
    badges: ['TOP TIER', 'HOT', 'LIMITADO'],
    featured: true,
    warrantyMonths: 36
  },
  {
    id: 'prod-laptop-scar18',
    name: 'ASUS ROG Strix SCAR 18 (2025) Mini-LED 240Hz Core i9 + RTX 4090',
    slug: 'asus-rog-strix-scar-18-laptop',
    description: 'Monstruo portátil de 18 pulgadas Nebula HDR Mini-LED 2.5K 240Hz, Intel Core i9-14900HX, RTX 4090 16GB 175W TGP con metal líquido Conductonaut Extreme.',
    price: 3699.99,
    originalPrice: 3999.99,
    category: 'laptops',
    brand: 'ASUS ROG',
    rating: 4.8,
    reviewsCount: 22,
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80'
    ],
    specs: {
      'Pantalla': '18" ROG Nebula HDR Mini-LED QHD+ 240Hz',
      'CPU': 'Intel Core i9-14900HX 24C/32T',
      'GPU': 'NVIDIA RTX 4090 Laptop 16GB GDDR6 (175W)',
      'RAM': '32GB DDR5 5600MHz',
      'SSD': '2TB PCIe 4.0 NVMe RAID 0'
    },
    badges: ['TOP TIER', 'OFERTA'],
    featured: true,
    warrantyMonths: 24
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'NEXUS10',
    description: '10% de descuento en toda la tienda para comunidad Nexus',
    discountPercentage: 10,
    usedCount: 142,
    active: true
  },
  {
    code: 'PROGAMER50',
    description: '$50 de descuento directo en compras mayores a $300',
    discountAmount: 50,
    minOrderAmount: 300,
    usedCount: 78,
    active: true
  },
  {
    code: 'CYBER2026',
    description: '15% de descuento especial temporada de campeonatos',
    discountPercentage: 15,
    minOrderAmount: 500,
    usedCount: 23,
    active: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'NX-98241',
    invoiceNumber: 'FAC-2026-00982',
    userId: 'user-customer',
    customerName: 'Carlos Rivera',
    customerEmail: 'gamer@nexusgaming.com',
    customerPhone: '+1 555 382 9182',
    shippingAddress: {
      street: 'Calle de los Gamers 777, Depto 402',
      city: 'Guadalajara',
      state: 'Jalisco',
      zipCode: '44100',
      country: 'México',
      notes: 'Entregar en caseta de seguridad si no estoy'
    },
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1 },
      { product: INITIAL_PRODUCTS[7], quantity: 1 }
    ],
    subtotal: 639.98,
    discount: 50.00,
    shippingFee: 0,
    tax: 94.40,
    total: 684.38,
    couponCode: 'PROGAMER50',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'NX-EXP-88931289-MX',
    carrier: 'DHL Express Gaming Logistics',
    createdAt: '2026-10-20T16:00:00.000Z',
    deliveredAt: '2026-10-22T14:15:00.000Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'NX-98242',
    invoiceNumber: 'FAC-2026-00983',
    userId: 'user-customer',
    customerName: 'Carlos Rivera',
    customerEmail: 'gamer@nexusgaming.com',
    customerPhone: '+1 555 382 9182',
    shippingAddress: {
      street: 'Calle de los Gamers 777, Depto 402',
      city: 'Guadalajara',
      state: 'Jalisco',
      zipCode: '44100',
      country: 'México'
    },
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }
    ],
    subtotal: 1999.99,
    discount: 200.00,
    shippingFee: 0,
    tax: 287.99,
    total: 2087.98,
    couponCode: 'NEXUS10',
    paymentMethod: 'crypto',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'NX-FEDEX-99120412-MX',
    carrier: 'FedEx Priority',
    createdAt: '2026-11-05T12:00:00.000Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-rtx-5090',
    userId: 'user-customer',
    userName: 'Carlos Rivera',
    rating: 5,
    title: 'Rendimiento bestial en 4K y 8K, vale cada centavo',
    comment: 'Instalada con una fuente de 1000W. Cyberpunk 2077 con Path Tracing corre a más de 120 FPS sin inmutarse. Temperaturas por debajo de los 65 grados.',
    verifiedPurchase: true,
    createdAt: '2026-10-25T19:40:00.000Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-ryzen-7800x3d',
    userId: 'user-customer',
    userName: 'Carlos Rivera',
    rating: 5,
    title: 'El mejor procesador que he tenido para eSports',
    comment: 'Los 1% low frames en Warzone y Apex Legends son una maravilla. Cero tirones.',
    verifiedPurchase: true,
    createdAt: '2026-10-18T11:20:00.000Z'
  }
];
