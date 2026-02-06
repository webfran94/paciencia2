import React from 'react';
import { Headphones, Play, FastForward } from 'lucide-react';

const Audios = () => {
  const audios = [
    { t: "Reset Mañanero", d: "3 minutos para blindar tu paciencia antes de despertar a los niños." },
    { t: "Freno de Emergencia (Audio)", d: "Guía de voz del abuelo para cuando el SOS visual no es suficiente." },
    { t: "Cierre Nocturno", d: "Suelta la culpa del día y prepárate para un mañana mejor." }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl text-center">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Audios de Re-Programación</h2>
        <p className="text-white/80 text-xs">"Hijo, a veces la mente necesita escuchar una voz amiga para volver al centro."</p>
      </div>

      <div className="space-y-4">
        {audios.map((a, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border flex items-center gap-6 shadow-sm group cursor-pointer hover:border-indigo-200">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Play fill="currentColor" size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-900 text-sm uppercase mb-1">{a.t}</h4>
              <p className="text-[11px] text-slate-400 font-medium italic">{a.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-8 rounded-[3rem] text-center border border-dashed border-slate-200">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Recomendación del Abuelo</p>
        <p className="text-xs text-slate-500 italic leading-relaxed">
          "Escucha estos audios con auriculares. Deja que mis palabras calmen tu sistema nervioso antes de que el caos empiece."
        </p>
      </div>
    </div>
  );
};

export default Audios;
