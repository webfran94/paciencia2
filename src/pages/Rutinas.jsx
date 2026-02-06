import React from 'react';
import { Calendar, CheckCircle, Map } from 'lucide-react';

const Rutinas = () => {
  const rutina = [
    { h: "Mañana", t: "Despertar & Aseo", d: "Usa el script de la carrera de zapatos." },
    { h: "Mediodía", t: "Comida sin Pantallas", d: "Conexión real antes de los alimentos." },
    { h: "Tarde", t: "Recogida de Juguetes", d: "La caja de descanso entra en acción." },
    { h: "Noche", t: "Ritual de Cuento", d: "Baja las luces y el tono de voz." }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in slide-in-from-bottom duration-500">
      <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Arquitecto de Rutinas</h2>
        <p className="text-white/80 text-xs italic">"Hijo, un hogar sin rutina es un hogar en guerra. La estructura le da seguridad al niño y paz a tu cabeza."</p>
      </div>

      <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 space-y-4">
        <h3 className="font-black text-blue-900 text-xs uppercase tracking-widest text-center">El Mapa del Día</h3>
        <p className="text-xs text-blue-700 leading-relaxed text-center italic">
          "No seas un sargento que da órdenes, sé el arquitecto que diseña el camino. Deja que el reloj sea el que diga qué hacer."
        </p>
      </div>

      <div className="space-y-4">
        {rutina.map((r, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border flex gap-4 shadow-sm">
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[80px]">
              <span className="text-[10px] font-black uppercase text-slate-400">{r.h}</span>
              <CheckCircle className="text-blue-500 mt-1" size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{r.t}</h4>
              <p className="text-xs text-slate-500 italic mt-1">{r.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-8 rounded-[3rem] text-center italic">
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          "Hijo, cumple la rutina incluso cuando estés cansado. La constancia es el cemento de tu autoridad."
        </p>
      </div>
    </div>
  );
};

export default Rutinas;
