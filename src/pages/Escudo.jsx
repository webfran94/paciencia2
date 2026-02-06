import React from 'react';
import { ShieldCheck, MessageCircle } from 'lucide-react';

const Escudo = () => {
  const casos = [
    { t: "Familiar Crítico", s: "'Entiendo que antes se hacía así, pero ahora estamos practicando la firmeza sin gritos. Gracias por preocuparte'." },
    { t: "Extraño en la calle", s: "Simplemente sonríe, respira y mantente a la altura de tu hijo. Tu prioridad es él, no el juicio del desconocido." },
    { t: "Pareja en desacuerdo", s: "'Hagamos un pacto: no nos corrijamos frente al niño. Hablemos de esto cuando él esté dormido'." }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="bg-orange-500 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Escudo Anti-Juicios</h2>
        <p className="text-white/80 text-xs italic">"Hijo, el ruido de afuera no debe apagar tu brújula interna. Protégete de quienes no entienden tu camino."</p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest">Guiones de protección</p>
        {casos.map((c, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-orange-500"><ShieldCheck size={40}/></div>
            <h4 className="font-black text-slate-900 text-xs uppercase mb-3">{c.t}</h4>
            <p className="text-slate-700 font-bold italic leading-relaxed text-sm">"{c.s}"</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] text-center">
        <p className="text-xs text-slate-400 italic">
          "Tú eres el abogado defensor de tu hijo. Nadie tiene derecho a romper la paz que tanto te ha costado construir."
        </p>
      </div>
    </div>
  );
};

export default Escudo;
