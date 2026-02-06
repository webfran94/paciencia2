import React from 'react';
import { Gavel, CheckCircle, Info } from 'lucide-react';

const Consecuencias = () => {
  const pasos = [
    { t: "La Regla de Oro", d: "Dí la regla una sola vez de forma neutral: 'Si la comida vuela, el plato se retira'." },
    { t: "La Acción Muda", d: "Si el comportamiento se repite, actúa de inmediato. Retira el objeto sin sermones ni caras de enojo. El silencio proyecta autoridad." },
    { t: "La Re-conexión", d: "Cuando pase la tormenta, reafirma el vínculo: 'Te quiero mucho, pero el plato se queda ahí hasta la cena porque elegiste lanzarlo'." }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-green-600 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Protocolo de Consecuencias</h2>
        <p className="text-white/80 text-xs italic">"Hijo, la firmeza no necesita decibelios. Un límite puesto con calma es diez veces más poderoso que uno puesto a gritos."</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-orange-500">
          <Info size={20} />
          <p className="text-xs font-bold uppercase tracking-widest">¿Cómo usar esta herramienta?</p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          Usa este protocolo cuando necesites que tu hijo aprenda que sus actos tienen resultados lógicos. No es un castigo, es un entrenamiento para la vida.
        </p>
      </div>

      <div className="space-y-4">
        {pasos.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border flex gap-6 items-center shadow-sm hover:border-green-200 transition-all">
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
          "Hijo, tu hijo no te respetará por cuánto gritas, sino por cuánto cumples tu palabra. Sé el ancla, no la tormenta."
        </p>
      </div>
    </div>
  );
};

export default Consecuencias;
