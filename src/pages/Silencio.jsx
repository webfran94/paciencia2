import React from 'react';
import { Eye, CheckCircle, Wind } from 'lucide-react';

const Silencio = () => {
  const items = [
    "Apagar televisión / música de fondo.",
    "Guardar 5 objetos fuera de lugar (orden visual).",
    "Poner el celular en 'No molestar' 15 minutos.",
    "Abrir una ventana y respirar aire fresco.",
    "Lavarse la cara con agua muy fría."
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">Silencio Sensorial</h2>
        <p className="text-slate-400 text-xs italic">"Hijo, a veces gritamos porque nuestra cabeza está llena de ruido. Baja los plomos de tu cerebro."</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border space-y-4 shadow-sm">
        <p className="text-xs font-black uppercase text-slate-400 text-center mb-4 tracking-widest italic">Checklist de Calma Inmediata</p>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group cursor-pointer hover:bg-white hover:border-orange-200 transition-all">
            <CheckCircle className="text-orange-500 shrink-0" size={24} />
            <span className="text-sm font-bold text-slate-700">{item}</span>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 p-10 rounded-[3rem] text-center border border-orange-100 relative overflow-hidden">
        <div className="absolute -bottom-4 -right-4 opacity-5 text-orange-600"><Wind size={100}/></div>
        <p className="text-xs text-orange-800 font-bold italic leading-relaxed relative z-10">
          "No puedes ser un ancla en medio de un mercado ruidoso. Primero limpia el lugar, luego limpia tu mente."
        </p>
      </div>
    </div>
  );
};

export default Silencio;
