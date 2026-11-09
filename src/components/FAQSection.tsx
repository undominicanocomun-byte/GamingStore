import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  Truck, 
  Flame, 
  CreditCard, 
  RotateCcw, 
  Wrench,
  CheckCircle2
} from 'lucide-react';

interface FAQItem {
  id: string;
  icon: React.ReactNode;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-warranty',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    question: '¿Qué cubre la Garantía VIP de 3 años y la sustitución inmediata?',
    category: 'Garantía y Confianza',
    answer: 'Todos nuestros componentes y computadoras completas incluyen 3 años de garantía con cobertura total ante defectos de fábrica, fallos de silicio o problemas de alimentación. Si una pieza presenta desperfectos durante los primeros 6 meses, no esperamos a la resolución del fabricante: realizamos el cambio directo por una unidad nueva en menos de 48 horas laborales.'
  },
  {
    id: 'faq-burnin',
    icon: <Flame className="w-5 h-5 text-amber-400" />,
    question: '¿Cómo funciona el Test de Estrés Térmico (Burn-in 24h) en ensambles?',
    category: 'Calidad Técnica',
    answer: 'Cada PC ensamblada pasa por un protocolo de estrés riguroso de 24 horas continuas con Cinebench R23, FurMark 4K y MemTest86. Monitoreamos en tiempo real temperaturas de VRM, VRAM y CPU, certificando que los thermals permanezcan por debajo de 72°C con curvas de ventilación acústicamente optimizadas. Se incluye un reporte digital con las curvas de rendimiento y el benchmark final.'
  },
  {
    id: 'faq-shipping',
    icon: <Truck className="w-5 h-5 text-cyan-400" />,
    question: '¿Cómo protegen el hardware delicado como GPUs pesadas durante el transporte?',
    category: 'Logística y Envíos',
    answer: 'Utilizamos espuma expansiva Instapak dentro del chasis para inmovilizar tarjetas gráficas como la RTX 5090 o disipadores de doble torre, evitando tensión mecánica sobre los slots PCIe. La caja exterior cuenta con triple protección de burbuja de alta densidad y seguro de tránsito al 100% del valor comercial con DHL Express / FedEx Priority.'
  },
  {
    id: 'faq-payments',
    icon: <CreditCard className="w-5 h-5 text-purple-400" />,
    question: '¿Qué formas de pago aceptan y son 100% seguras?',
    category: 'Pagos y Facturación',
    answer: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express) con encriptación SSL de 256 bits y 3D Secure 2.0, PayPal con protección al comprador, Criptomonedas (USDT, USDC, BTC a través de pasarela descentralizada con 5% de descuento adicional) y transferencia SPEI / Wire con confirmación automatizada.'
  },
  {
    id: 'faq-upgrades',
    icon: <Wrench className="w-5 h-5 text-blue-400" />,
    question: '¿Puedo abrir mi gabinete para limpiar o actualizar piezas sin anular la garantía?',
    category: 'Soporte y Mantenimiento',
    answer: '¡Por supuesto! En NEXUS GAMING creemos en el derecho a reparar y actualizar. No colocamos sellos destructivos sobre los paneles laterales. Eres libre de añadir más discos SSD M.2, cambiar la memoria RAM o realizar limpiezas periódicas sin invalidar tu garantía de ensamble ni de las piezas individuales.'
  },
  {
    id: 'faq-returns',
    icon: <RotateCcw className="w-5 h-5 text-pink-400" />,
    question: '¿Cuál es la política de devoluciones y garantía de satisfacción?',
    category: 'Satisfacción Garantizada',
    answer: 'Cuentas con 30 días naturales a partir de la entrega para probar tu equipo en tus juegos y flujo de trabajo. Si por cualquier motivo el rendimiento no cumple tus expectativas, gestionamos la recolección sin costo y emitimos un reembolso íntegro o nota de crédito inmediata sin preguntas complicadas.'
  }
];

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs font-tech text-cyan-400 uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>PREGUNTAS FRECUENTES &bull; SOPORTE TOTAL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
          TODO LO QUE NECESITAS SABER ANTES DE EQUIPARTE
        </h2>
        <p className="text-sm text-slate-300">
          Transparencia absoluta. Respuestas claras sobre garantías, envíos asegurados y control de calidad.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map(faq => {
          const isOpen = openFaqId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'bg-[#101422] border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.12)]' 
                  : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {faq.icon}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-tech text-cyan-400 font-bold block mb-0.5">
                      {faq.category}
                    </span>
                    <h3 className="font-heading font-bold text-white text-sm sm:text-base">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div className={`p-1.5 rounded-lg bg-slate-900 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-400 bg-cyan-950/60 border border-cyan-500/40' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 border-t border-slate-800/80 leading-relaxed space-y-3">
                  <p>{faq.answer}</p>
                  <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-tech">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Compromiso de calidad respaldado por el laboratorio NEXUS GAMING</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
