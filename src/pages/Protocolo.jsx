import React from 'react';
import { Clock, Shield, Coffee, Zap } from 'lucide-react';

const Protocolo = () => {
  const pasos = [
    { t: "El Minuto de Oro", d: "Antes de entrar a casa (o salir de la oficina), detente 60 segundos. Respira. Repite: 'Mi familia no es mi carga, es mi refugio'.", icon: <Clock/> },
    { t: "La Dieta de Expectativas", d: "Acepta que habrá desorden. Los niños están cansados igual que tú. No busques perfección hoy.", icon: <Zap/> },
    { t: "Ritual de Conexión", d: "Los primeros 10 minutos al verlos son solo para besos y risas. Nada de preguntas sobre tareas o comida.", icon: <Coffee/> }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic leading-tight">Protocolo de las 18:00 (Hora Crítica)</h2>
        <p className="text-slate-400 text-xs italic">"La transición del trabajo a casa es el campo de minas más peligroso. Llega con el tanque lleno."</p>
      </div>

      <div className="space-y-4">
        {pasos.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border flex gap-6 items-start shadow-sm hover:shadow-md transition-all">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-600 shadow-inner shrink-0">{p.icon}</div>
            <div>
              <h4 className="font-black text-slate-900 text-sm uppercase mb-1 tracking-tight">{p.t}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium italic">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 p-10 rounded-[3rem] text-center text-white relative overflow-hidden">
        <p className="text-sm italic relative z-10 leading-relaxed">
          "El guerrero descansa antes de la última batalla del día. No entres a tu casa con la espada desenvainada, hijo."
        </p>
      </div>
    </div>
  );
};

export default Protocolo;
