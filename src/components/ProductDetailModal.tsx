import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  Send,
  User as UserIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Review } from '../types/index';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductId, 
    closeProductDetail, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    user,
    showToast
  } = useStore();

  const [product, setProduct] = useState<(Product & { reviews?: Review[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Write Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!selectedProductId) return;

    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${selectedProductId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSelectedImage(data.images[0] || '');
        }
      } catch (e) {
        console.error('Error loading product details:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [selectedProductId]);

  if (!selectedProductId) return null;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Inicia sesión para dejar una reseña', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Por favor escribe tu comentario', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await fetch(`/api/products/${product?.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('nexus_token')}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment
        })
      });

      if (res.ok) {
        const newReview = await res.json();
        setProduct(prev => prev ? {
          ...prev,
          reviews: [newReview, ...(prev.reviews || [])],
          reviewsCount: (prev.reviewsCount || 0) + 1
        } : null);
        setReviewComment('');
        setReviewTitle('');
        showToast('¡Gracias por tu reseña gamer!', 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Error al enviar reseña', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-tech">Cargando especificaciones de hardware...</p>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <div>
        <button
          onClick={closeProductDetail}
          className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-cyan-400 font-tech transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al catálogo</span>
        </button>
      </div>

      {/* Main product detail grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-2xl bg-[#0b0e18] border border-cyan-900/60 overflow-hidden relative shadow-2xl">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-black font-extrabold text-xs px-3 py-1 rounded-full font-tech shadow-lg">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold uppercase font-tech mb-1">
              <span>{product.brand}</span>
              <span>&bull;</span>
              <span>Garantía {product.warrantyMonths} meses oficial</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-3 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">
                ({product.reviews?.length || product.reviewsCount} reseñas verificadas)
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-baseline space-x-4">
            <span className="text-3xl font-extrabold text-cyan-400 font-tech">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-xs text-emerald-400 font-tech font-bold ml-auto">
              IVA Incluido (16%)
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Stock state */}
          <div className="flex items-center space-x-2 text-xs">
            {product.stock > 0 ? (
              <div className="flex items-center text-emerald-400 font-semibold space-x-1.5">
                <Check className="w-4 h-4" />
                <span>Disponible en almacén central ({product.stock} unidades para envío inmediato)</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400 font-semibold space-x-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Producto agotado momentáneamente</span>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center border border-slate-700 bg-slate-900 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-white font-tech">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3.5 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                +
              </button>
            </div>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() => addToCart(product, quantity)}
              className={`flex-1 py-3 px-6 rounded-xl font-heading font-extrabold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                product.stock > 0
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-900/40 cursor-pointer active:scale-98'
                  : 'bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>AÑADIR AL CARRITO</span>
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 rounded-xl border transition-colors ${
                isFavorited
                  ? 'bg-pink-600/20 border-pink-500 text-pink-400'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-pink-400'
              }`}
              title="Guardar en favoritos"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Envío Gratis pedidos &gt; $150</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{product.warrantyMonths} meses garantía de fábrica</span>
            </div>
          </div>

        </div>

      </div>

      {/* Technical Specifications Section */}
      <div className="bg-[#101422] rounded-2xl border border-slate-800/90 p-6 sm:p-8 space-y-6">
        <h3 className="text-xl font-bold text-white font-heading tracking-wide border-b border-slate-800 pb-3">
          Ficha Técnica & Especificaciones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="flex justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800/60">
              <span className="text-slate-400 font-medium">{key}</span>
              <span className="text-white font-semibold text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-[#101422] rounded-2xl border border-slate-800/90 p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-heading">
              Reseñas y Experiencias de Gamers
            </h3>
            <p className="text-xs text-slate-400">
              Valoraciones verificadas de compradores reales
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-3xl font-extrabold text-cyan-400 font-tech">
              {product.rating.toFixed(1)} / 5.0
            </div>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
          </div>
        </div>

        {/* Write a review form */}
        <form onSubmit={handleReviewSubmit} className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-tech uppercase tracking-wider">
            Dejar una Reseña sobre este Producto
          </h4>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-300">Calificación:</span>
            <div className="flex space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1 focus:outline-none"
                >
                  <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <input
              type="text"
              value={reviewTitle}
              onChange={e => setReviewTitle(e.target.value)}
              placeholder="Título de tu reseña (ej: Rendimiento increíble en 4K)"
              className="w-full bg-slate-950 text-xs text-slate-100 p-2.5 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="Describe tu experiencia con este componente (temperaturas, FPS, calidad de construcción)..."
              className="w-full bg-slate-950 text-xs text-slate-100 p-2.5 rounded-lg border border-slate-700 focus:border-cyan-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-tech text-xs rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingReview ? 'Publicando...' : 'Publicar Reseña'}</span>
            </button>
          </div>
        </form>

        {/* Reviews list */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-bold text-xs">
                      {rev.userName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="ml-2 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.2 rounded font-tech">
                          Compra Verificada
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>

                <h5 className="text-xs font-bold text-slate-200">{rev.title}</h5>
                <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                <div className="text-[10px] text-slate-400 font-tech">
                  {new Date(rev.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">
              Sé el primero en dejar una reseña sobre este hardware.
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
