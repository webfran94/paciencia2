import React, { useState } from 'react';
import { Moon, Zap, Coffee, ToyBrick, Monitor, MessageCircle } from 'lucide-react';

const Scripts = () => {
  const [cat, setCat] = useState('dormir');

  const scripts = {
    dormir: {
      icon: <Moon size={18}/>,
      items: [
        { f: "[Acción Autónoma] O [Acción con Ayuda] + [Reloj]", s: "[Nombre], ¿te vas a poner el pijama tú solo como un rayo o quieres que te ayude yo? Si te ayudo yo, tardamos más y solo nos dará tiempo a leer medio cuento." },
        { f: "[Elección de Movimiento]", s: "¿Quieres entrar al baño saltando como rana o caminando como elefante? El agua se enfría en 2 minutos, ¡tú eliges cómo llegar!" }
      ]
    },
    prisas: {
      icon: <Zap size={18}/>,
      items: [
        { f: "[Carrera de Velocidad]", s: "Hagamos una carrera: ¿quién se pone los zapatos antes de que yo cuente hasta 20? El que gane elige la canción del coche." },
        { f: "[Consecuencia del Retraso]", s: "El autobús no espera. ¿Quieres desayunar sentado conmigo o prefieres que guarde el pan en una bolsa para comer en el camino?" }
      ]
    },
    comida: {
      icon: <Coffee size={18}/>,
      items: [
        { f: "[Metáfora de los Bichitos]", s: "Esos dulces son bichitos que se ponen pesados en la panza. En Navidad hace frío y se duermen, pero hoy están muy despiertos y no te dejarán correr rápido." },
        { f: "[Escudos de Salud]", s: "Esta sopa tiene escudos invisibles. Cada cucharada es un escudo contra los resfriados. ¿Cuántos quieres hoy: cinco o diez?" }
      ]
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in slide-in-from-bottom">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">3. Scripts de Mando</h2>
        <p className="text-slate-400 text-xs italic">"No expliques como adulto. Usa el juego y ofrece siempre dos opciones."</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {Object.keys(scripts).map(k => (
          <button key={k} onClick={() => setCat(k)} className={`px-6 py-4 rounded-3xl text-xs font-black uppercase tracking-widest shrink-0 transition-all ${cat === k ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
            {k}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {scripts[cat].items.map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-[3rem] border-l-[12px] border-orange-500 shadow-sm border transition-all hover:shadow-md">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Fórmula: {item.f}</h4>
            <p className="text-slate-900 font-bold italic leading-relaxed text-sm">"{item.s}"</p>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 p-8 rounded-[3rem] border border-orange-100 text-center">
        <p className="text-[11px] text-orange-800 font-bold italic">"Hijo, cumple lo que dices. Si el juguete se va a la caja, se va aunque llore. Tu autoridad serena es para siempre."</p>
      </div>
    </div>
  );
};

export default Scripts;
