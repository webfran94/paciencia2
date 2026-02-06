import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

const ReparacionP = () => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      <div className="bg-red-400 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic text-center">Reparación Profunda</h2>
        <p className="text-white/90 text-xs italic text-center">Plan Táctico de 21 Días</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border space-y-6 shadow-sm">
        <p className="text-sm text-slate-600 leading-relaxed font-medium italic text-center">
          "Hijo, si has gritado por años, el corazón de tu hijo tiene costras. Este plan es para ablandarlas y que vuelva a confiar en ti."
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 items-center p-4 bg-red-50 rounded-2xl">
            <div className="h-10 w-10 bg-white text-red-400 rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">1</div>
            <p className="text-xs font-bold text-slate-700">Semana 1: Cero Crítica. Solo observa y sonríe.</p>
          </div>
          <div className="flex gap-4 items-center p-4 bg-red-50 rounded-2xl">
            <div className="h-10 w-10 bg-white text-red-400 rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">2</div>
            <p className="text-xs font-bold text-slate-700">Semana 2: Juego enfocado. 15 min al día sin celular.</p>
          </div>
          <div className="flex gap-4 items-center p-4 bg-red-50 rounded-2xl">
            <div className="h-10 w-10 bg-white text-red-400 rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">3</div>
            <p className="text-xs font-bold text-slate-700">Semana 3: Palabras de Afirmación. Caza a tu hijo haciendo algo bien.</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-center text-white relative">
        <Sparkles className="absolute top-2 right-4 text-orange-400 opacity-30" />
        <p className="text-xs italic leading-relaxed">
          "No se trata de ser perfecto, se trata de estar presente. El amor es el mejor pegamento para un corazón roto."
        </p>
      </div>
    </div>
  );
};

export default ReparacionP;
