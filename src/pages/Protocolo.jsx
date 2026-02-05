import React from 'react';
import { Clock, Shield, Heart } from 'lucide-react';

const Protocolo = () => {
  const pasos = [
    { t: "El Minuto de Oro", d: "Antes de entrar a casa, detente 60 segundos. Respira. Repite: 'Mi familia no es mi carga, es mi refugio'." },
    { t: "La Dieta de Expectativas", d: "Acepta que habrá desorden. Los niños están cansados igual que tú. No busques perfección." },
    { t: "Ritual de Conexión", d: "Los primeros 10 minutos son solo para besos y risas. Nada de preguntas sobre tareas o comida." }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">6. Protocolo 18:00</h2>
        <p className="text-slate-400 text-xs italic">"La transición del trabajo a casa es un campo de minas. Llega con el tanque lleno."</p>
      </div>

      <div className="space-y-4">
        {pasos.map((p, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border flex gap-4 items-start shadow-sm">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Shield size={20}/></div>
            <div>
              <h4 className="font-black text-slate-900 text-sm uppercase mb-1">{p.t}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{p.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-8 rounded-[2.5rem] text-center italic">
        <p className="text-xs text-slate-400">"El guerrero descansa antes de la última batalla del día. No entres con la espada desenvainada."</p>
      </div>
    </div>
  );
};

export default Protocolo;
