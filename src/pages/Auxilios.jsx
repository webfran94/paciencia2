import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

const Auxilios = () => {
  return (
    <div className="space-y-6 pb-12 animate-in slide-in-from-right duration-500">
      <div className="bg-red-600 p-8 rounded-[3rem] text-white shadow-xl shadow-red-100">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">5. Primeros Auxilios Post-Grito</h2>
        <p className="text-red-100 text-xs font-bold uppercase tracking-widest tracking-widest">Protocolo de reparación inmediata</p>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border shadow-sm space-y-8">
        <div className="flex justify-center text-red-500"><Heart size={64} fill="currentColor"/></div>
        <p className="text-sm text-slate-600 leading-relaxed text-center font-medium italic">
          "Hijo, si fallaste hoy, no te conviertas en tu propio verdugo. Un error no borra tu progreso; simplemente reinicia tu contador y sigue adelante."
        </p>
        <div className="space-y-4">
          <Step num="1" title="Baja a su altura" desc="Míralo a los ojos, que no te vea como un gigante enojado." />
          <Step num="2" title="Pide perdón sin excusas" desc='Dile: "Me equivoqué al gritarte. Estaba cansado pero eso no justifica mi grito. Te quiero mucho".' />
          <Step num="3" title="Conexión física" desc="Un abrazo largo de 10 segundos resetea el sistema nervioso de ambos." />
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 p-2 opacity-10"><ShieldCheck size={80}/></div>
        <p className="text-xs italic relative z-10">
          "Reparar el vínculo te permite pedir perdón con dignidad sin perder tu lugar como líder del hogar."
        </p>
      </div>
    </div>
  );
};

const Step = ({ num, title, desc }) => (
  <div className="p-6 bg-slate-50 rounded-3xl border-l-[8px] border-red-500 shadow-sm">
    <h4 className="text-xs font-black text-slate-900 uppercase mb-1 tracking-tight">{num}. {title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Auxilios;
