import React from 'react';
import { X, Check, ArrowRight, ShoppingCart, Scale, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

export const ProductComparisonModal: React.FC = () => {
  const { 
    compareList, 
    removeFromCompare, 
    clearCompare, 
    isCompareOpen, 
    setIsCompareOpen, 
    allProducts, 
    formatPrice, 
    addToCart,
    setCurrentView
  } = useStore();

  if (!isCompareOpen) return null;

  const productSource = allProducts && allProducts.length > 0 ? allProducts : INITIAL_PRODUCTS;

  const compareProducts = compareList
    .map(id => productSource.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Extract all unique specs keys across compared products
  const allSpecKeys = Array.from(
    new Set(compareProducts.flatMap(p => Object.keys(p.specs || {})))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f1322] border border-cyan-800/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-2.5">
            <Scale className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-heading font-extrabold text-white">
              COMPARADOR DE HARDWARE GAMING ({compareProducts.length}/3)
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {compareProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {compareProducts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Scale className="w-16 h-16 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-white font-heading">
              No tienes productos en el comparador
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Haz clic en el icono de la balanza en cualquier tarjeta de producto para comparar especificaciones técnicas, benchmarks y precios lado a lado.
            </p>
            <button
              onClick={() => {
                setIsCompareOpen(false);
                setCurrentView('catalog');
              }}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs font-tech rounded-lg transition-colors cursor-pointer"
            >
              Explorar Catálogo
            </button>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compareProducts.map(prod => (
              <div 
                key={prod.id} 
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 relative"
              >
                <button
                  onClick={() => removeFromCompare(prod.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-red-400 p-1"
                  title="Quitar de la comparación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-3">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-36 object-cover rounded-lg bg-slate-900 border border-slate-800"
                  />
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase font-tech">
                      {prod.brand} &bull; {prod.category}
                    </span>
                    <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="text-xl font-extrabold text-cyan-400 font-tech">
                    {formatPrice(prod.price)}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(prod, 1)}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-tech font-extrabold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>AÑADIR AL CARRITO</span>
                </button>
              </div>
            ))}
          </div>

          {/* Specs comparison matrix */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h4 className="font-heading font-bold text-sm text-slate-200">
              Comparativa de Especificaciones Técnicas
            </h4>
            
            <div className="space-y-1.5">
              {allSpecKeys.map(specKey => (
                <div key={specKey} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase font-tech mb-1">
                    {specKey}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-200">
                    {compareProducts.map(prod => (
                      <div key={prod.id} className="truncate">
                        <span className="text-slate-400 text-[10px] md:hidden">{prod.brand}: </span>
                        <span>{prod.specs[specKey] || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
        )}

      </div>
    </div>
  );
};
