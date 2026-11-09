import React from 'react';
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types/index';

const CATEGORIES: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todos los Productos' },
  { id: 'gpus', label: 'Tarjetas Gráficas (GPUs)' },
  { id: 'cpus', label: 'Procesadores (CPUs)' },
  { id: 'motherboards', label: 'Placas Base' },
  { id: 'ram', label: 'Memorias RAM' },
  { id: 'storage', label: 'Almacenamiento SSD M.2' },
  { id: 'cooling', label: 'Refrigeración Líquida' },
  { id: 'power-supplies', label: 'Fuentes de Poder' },
  { id: 'cases', label: 'Gabinetes Gaming' },
  { id: 'peripherals', label: 'Teclados, Ratones & Audio' },
  { id: 'monitors', label: 'Monitores Gaming' },
  { id: 'prebuilt-pcs', label: 'PCs Armadas Nexus' },
  { id: 'laptops', label: 'Laptops Gaming' }
];

const AVAILABLE_BRANDS = [
  'NVIDIA',
  'AMD',
  'ASUS ROG',
  'Corsair',
  'Razer',
  'Logitech G',
  'Samsung',
  'NZXT',
  'Lian Li',
  'MSI',
  'Intel',
  'SteelSeries',
  'NEXUS Builds'
];

export const ProductFilter: React.FC = () => {
  const { filters, setFilters, formatPrice, products } = useStore();
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => {
      const exists = prev.brands.includes(brand);
      const newBrands = exists
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: newBrands };
    });
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'all',
      brands: [],
      minPrice: 0,
      maxPrice: 5000,
      onlyInStock: false,
      sortBy: 'featured'
    });
  };

  const activeFiltersCount = 
    (filters.category !== 'all' ? 1 : 0) + 
    filters.brands.length + 
    (filters.onlyInStock ? 1 : 0) + 
    (filters.maxPrice < 5000 || filters.minPrice > 0 ? 1 : 0) +
    (filters.search ? 1 : 0);

  return (
    <aside className="bg-[#101422] rounded-xl border border-slate-800/90 p-4 sm:p-5 space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="flex items-center space-x-2 text-left w-full sm:w-auto justify-between sm:justify-start"
        >
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-white text-base tracking-wide">Filtros Pro</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-cyan-500 text-black text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center font-tech">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <span className="sm:hidden text-xs text-cyan-400 font-tech font-bold">
            {isOpenMobile ? 'Ocultar ▲' : 'Desplegar ▼'}
          </span>
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="hidden sm:flex text-xs text-slate-400 hover:text-cyan-400 items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* Filter Body (Always visible on desktop, collapsible on mobile) */}
      <div className={`space-y-6 ${isOpenMobile ? 'block' : 'hidden lg:block'}`}>

      {/* Categories */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-tech">
          Categoría
        </h4>
        <div className="space-y-1">
          {CATEGORIES.map(cat => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="truncate">{cat.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 uppercase tracking-wider font-tech">
            Precio Máximo
          </span>
          <span className="text-cyan-400 font-bold font-tech text-sm">
            {formatPrice(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="5000"
          step="50"
          value={filters.maxPrice}
          onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-cyan-400 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-tech">
          <span>{formatPrice(100)}</span>
          <span>{formatPrice(5000)}</span>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-tech">
          Marcas Oficiales
        </h4>
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
          {AVAILABLE_BRANDS.map(brand => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center space-x-2.5 text-xs text-slate-300 hover:text-white cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                />
                <span className={checked ? 'text-cyan-300 font-medium' : ''}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability / Stock Toggle */}
      <div className="pt-2 border-t border-slate-800/80">
        <label className="flex items-center justify-between cursor-pointer py-1 text-xs">
          <span className="text-slate-300 font-medium">Solo productos en stock</span>
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={e => setFilters(prev => ({ ...prev, onlyInStock: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
          />
        </label>
      </div>

      </div>

    </aside>
  );
};
