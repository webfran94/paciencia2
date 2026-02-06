import React from 'react';
import { Tablet, Timer, Power } from 'lucide-react';

const PazDigital = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-blue-400 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Paz Digital</h2>
        <p className="text-white/80 text-xs italic">"Hijo, la tecnología es un fuego: calienta el hogar o lo quema todo. Aprende a apagarla con amor."</p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border space-y-8 shadow-sm">
        <div className="flex justify-center text-blue-400"><Tablet size={64}/></div>
        
        <div className="space-y-4">
           <div className="p-6 bg-slate-50 rounded-3xl border-l-[8px] border-blue-400">
             <h4 className="text-xs font-black text-slate-900 uppercase mb-1">El Aviso de los 5 Minutos</h4>
             <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"En 5 minutos la tablet necesita ir a su cama a cargar energía. ¿Quieres poner tú la alarma o te aviso yo?"</p>
           </div>
           
           <div className="p-6 bg-slate-50 rounded-3xl border-l-[8px] border-blue-400">
             <h4 className="text-xs font-black text-slate-900 uppercase mb-1">La Consecuencia Digital</h4>
             <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"Si elegimos no apagarla ahora, mañana el tiempo de juego será más corto porque la batería no descansó."</p>
           </div>
        </div>
      </div>

      <div className="bg-orange-50 p-8 rounded-[3rem] border border-orange-100 text-center">
        <p className="text-[11px] text-orange-800 font-bold italic">"No luches contra la pantalla, lucha por la conexión que viene después."</p>
      </div>
    </div>
  );
};

export default PazDigital;
