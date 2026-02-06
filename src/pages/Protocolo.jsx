import React from 'react';
import { Gavel, CheckCircle } from 'lucide-react';

const Consecuencias = () => {
  const pasos = [
    { t: "Límite Predictible", d: "Dí la regla una vez: 'Si la comida vuela, el plato se retira'." },
    { t: "La Acción Muda", d: "Si el niño lanza la comida, retira el plato de inmediato. Sin gritos, sin sermones, sin 'te lo advertí'." },
    { t: "Re-conexión Amorosa", d: "Dile: 'Te quiero, pero el plato se queda aquí hasta la cena porque tiraste la comida'. Deja que llore, mantente cerca pero firme." }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-600 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 italic tracking-tight uppercase">Protocolo de Consecuencias</h2>
        <p className="text-white/80 text-xs italic">"Hijo, la firmeza no necesita decibelios. La regla es la que manda, tú solo eres el guía sereno."</p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-black uppercase text-slate-400 ml-4 tracking-widest">3 Pasos para límites lógicos</p>
        {pasos.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border flex gap-6 items-center shadow-sm">
            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-black text-lg shrink-0">{i+1}</div>
            <div>
              <h4 className="font-black text-slate-900 text-sm uppercase mb-1">{p.t}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-center text-white relative overflow-hidden">
        <p className="text-sm italic relative z-10 leading-relaxed">
          "Hijo, tu hijo no te odiará por poner límites. Te odiará si los pones con gritos. La consecuencia lógica le enseña responsabilidad; el grito solo le enseña miedo."
        </p>
      </div>
    </div>
  );
};

export default Consecuencias;
