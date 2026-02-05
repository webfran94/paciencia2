import React from 'react';
import { Eye, CheckCircle } from 'lucide-react';

const Silencio = () => {
  const items = [
    "Apagar televisión / música de fondo.",
    "Guardar 5 objetos fuera de lugar (orden visual).",
    "Poner el celular en 'No molestar' 15 minutos.",
    "Abrir una ventana y respirar aire fresco.",
    "Lavarse la cara con agua muy fría."
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">5. Silencio Sensorial</h2>
        <p className="text-slate-400 text-xs italic">"A veces gritamos porque nuestra cabeza está llena de ruido. Baja los plomos de tu cerebro."</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <CheckCircle className="text-orange-500 shrink-0" size={24} />
            <span className="text-sm font-bold text-slate-700">{item}</span>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 p-8 rounded-[2.5rem] text-center border border-orange-100">
        <p className="text-xs text-orange-800 font-bold italic">"Hijo, no puedes ser un ancla en medio de un mercado ruidoso. Primero limpia el lugar, luego limpia tu mente."</p>
      </div>
    </div>
  );
};

export default Silencio;
