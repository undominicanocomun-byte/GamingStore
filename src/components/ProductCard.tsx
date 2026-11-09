import React from 'react';
import { Star, ShoppingCart, Heart, Eye, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types/index';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openProductDetail 
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const topSpecs = Object.entries(product.specs).slice(0, 2);

  return (
    <div className="group relative bg-[#101422] rounded-xl border border-slate-800/90 hover:border-cyan-500/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]">
      
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden cursor-pointer" onClick={() => openProductDetail(product.id)}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101422] via-transparent to-transparent opacity-60"></div>

        {/* Badges container */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badges?.map(badge => (
            <span
              key={badge}
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow tracking-wider font-tech ${
                badge === 'HOT'
                  ? 'bg-red-600 text-white shadow-red-900/50'
                  : badge === 'TOP TIER'
                  ? 'bg-purple-600 text-white shadow-purple-900/50'
                  : badge === 'OFERTA'
                  ? 'bg-emerald-600 text-white shadow-emerald-900/50'
                  : 'bg-cyan-600 text-black shadow-cyan-900/50'
              }`}
            >
              {badge}
            </span>
          ))}
          {discountPercent > 0 && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-black shadow font-tech">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick action buttons (Wishlist & Quick View) */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isFavorited
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:text-pink-400 hover:bg-slate-800'
            }`}
            title={isFavorited ? 'Quitar de lista de deseos' : 'Guardar en lista de deseos'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(product.id);
            }}
            className="p-2 rounded-lg bg-slate-900/80 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 backdrop-blur-md transition-colors"
            title="Vista rápida del producto"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Stock status indicator pill */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          {product.stock > 0 ? (
            product.stock <= 5 ? (
              <span className="inline-flex items-center text-[10px] bg-red-950/80 text-red-300 border border-red-500/50 px-2 py-0.5 rounded font-medium backdrop-blur-sm">
                <AlertCircle className="w-3 h-3 mr-1 text-red-400" />
                ¡Últimas {product.stock} unidades!
              </span>
            ) : (
              <span className="inline-flex items-center text-[10px] bg-slate-900/80 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-medium backdrop-blur-sm">
                <Check className="w-3 h-3 mr-1" />
                En Stock ({product.stock})
              </span>
            )
          ) : (
            <span className="inline-flex items-center text-[10px] bg-neutral-900 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-medium">
              Agotado temporalmente
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="text-cyan-400 font-bold uppercase tracking-wider font-tech">
              {product.brand}
            </span>
            <span className="text-[11px] text-slate-400 capitalize">
              {product.category.replace('-', ' ')}
            </span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => openProductDetail(product.id)}
            className="font-bold text-sm text-slate-100 hover:text-cyan-300 line-clamp-2 transition-colors cursor-pointer mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Key Specs chips */}
          {topSpecs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {topSpecs.map(([key, val]) => (
                <span
                  key={key}
                  className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-tech"
                >
                  <strong className="text-slate-400">{key}:</strong> {val}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-white">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount} reseñas)</span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center space-x-1.5 -mb-0.5">
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/70 border border-amber-500/40 px-1.5 rounded font-tech">
                  Ahorras {formatPrice(product.originalPrice - product.price)}
                </span>
              </div>
            )}
            <span className={`text-lg font-extrabold font-tech ${
              discountPercent > 0 ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product, 1)}
            className={`px-3.5 py-2 rounded-lg font-tech font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
              product.stock > 0
                ? discountPercent > 0 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-900/30 cursor-pointer active:scale-95'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-900/30 cursor-pointer active:scale-95'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-current" />
            <span>{product.stock > 0 ? (discountPercent > 0 ? 'APROVECHAR' : 'COMPRAR') : 'AGOTADO'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
