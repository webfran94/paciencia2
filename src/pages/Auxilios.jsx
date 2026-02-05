import React from 'react';
import { Heart } from 'lucide-react';

const Auxilios = () => (
  <div className="space-y-6">
    <div className="bg-red-600 p-8 rounded-[3rem] text-white shadow-xl shadow-red-100">
      <h2 className="text-2xl font-black mb-2 italic">7. Primeros Auxilios Post-Grito</h2>
      <p className="text-red-100 text-xs font-medium uppercase tracking-widest">Protocolo de reparación de vínculo</p>
    </div>

    <div className="bg-white p-8 rounded-[3rem] border space-y-6 shadow-sm">
      <div className="flex justify-center text-red-500"><Heart size={48} fill="currentColor"/></div>
      <p className="text-sm text-slate-600 leading-relaxed text-center font-medium">
        "Hijo, si fallaste hoy, no te conviertas en tu propio verdugo. Las recaídas son parte del proceso. Lo importante es cómo reparas el daño."
      </p>
      
      <div className="space-y-4">
        <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-red-500">
          <p className="text-xs font-bold text-slate-900 mb-1">Paso 1: Baja a su altura</p>
          <p className="text-[11px] text-slate-500">Míralo a los ojos, que no te vea como un gigante enojado.</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-red-500">
          <p className="text-xs font-bold text-slate-900 mb-1">Paso 2: Pide perdón sin excusas</p>
          <p className="text-[11px] text-slate-500">Dile: "Me equivoqué al gritarte. Estaba cansado, pero eso no justifica mi grito. Te quiero."</p>
        </div>
        <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-red-500">
          <p className="text-xs font-bold text-slate-900 mb-1">Paso 3: Conexión física</p>
          <p className="text-[11px] text-slate-500">Un abrazo largo de 10 segundos resetea el sistema nervioso de ambos.</p>
        </div>
      </div>
    </div>
  </div>
);

export default Auxilios;
