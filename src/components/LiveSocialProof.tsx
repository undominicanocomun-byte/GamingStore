import React, { useState, useEffect } from 'react';
import { ShoppingBag, Users, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface RecentActivity {
  id: string;
  name: string;
  city: string;
  productName: string;
  timeAgo: string;
  image: string;
}

const ACTIVITIES: RecentActivity[] = [
  {
    id: 'act-1',
    name: 'Sebastián V.',
    city: 'CDMX',
    productName: 'ASUS ROG Swift PG27AQDM OLED 240Hz',
    timeAgo: 'hace 2 min',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'act-2',
    name: 'Mateo R.',
    city: 'Monterrey',
    productName: 'GeForce RTX 5090 TUF Gaming 32GB',
    timeAgo: 'hace 4 min',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'act-3',
    name: 'Andrés G.',
    city: 'Guadalajara',
    productName: 'AMD Ryzen 7 9800X3D Gaming Processor',
    timeAgo: 'hace 6 min',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'act-4',
    name: 'Camila P.',
    city: 'Santiago',
    productName: 'Razer Viper V3 Pro Ultra-Lightweight',
    timeAgo: 'hace 9 min',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=200&q=80'
  }
];

export const LiveSocialProof: React.FC = () => {
  const { currentView } = useStore();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(148);

  useEffect(() => {
    // Slight fluctuation in live gamer count to look authentic
    const countInterval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 12000);

    // Rotate notification every 8 seconds
    const rotateInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 500);
    }, 9000);

    return () => {
      clearInterval(countInterval);
      clearInterval(rotateInterval);
    };
  }, []);

  // Only show on catalog view to not distract during checkout or builder
  if (isDismissed || currentView !== 'catalog') return null;

  const currentActivity = ACTIVITIES[currentIndex];

  return (
    <div 
      className={`fixed bottom-6 left-6 z-40 max-w-xs sm:max-w-sm transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-[#0e1220]/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/60 relative group">
        
        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title="Ocultar notificaciones"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center space-x-3 pr-4">
          <div className="relative shrink-0">
            <img 
              src={currentActivity.image} 
              alt={currentActivity.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-700 bg-slate-900" 
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black p-0.5 rounded-full shadow">
              <CheckCircle className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="text-xs space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white">{currentActivity.name}</span>
              <span className="text-[10px] text-slate-400">({currentActivity.city})</span>
              <span className="text-[10px] text-cyan-400 font-tech">{currentActivity.timeAgo}</span>
            </div>
            
            <p className="text-slate-300 font-medium text-[11px] line-clamp-1">
              Compró: <span className="text-cyan-300 font-semibold">{currentActivity.productName}</span>
            </p>

            <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-tech">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Compra Verificada</span>
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-400 flex items-center space-x-1">
                <Users className="w-3 h-3 text-cyan-400" />
                <span>{onlineCount} en línea</span>
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
