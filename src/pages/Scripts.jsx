import React, { useState } from 'react';
import { MessageCircle, Moon, Zap, Coffee, ToyBrick, Monitor } from 'lucide-react';

const Scripts = () => {
  const [cat, setCat] = useState('dormir');

  const scripts = {
    dormir: {
      icon: <Moon />,
      items: [
        { f: "[Acción Autónoma] O [Acción con Ayuda]", s: "[Nombre], ¿te vas a poner el pijama tú solo como un rayo o quieres que te ayude yo? Si te ayudo yo, tardamos más y solo nos dará tiempo a leer medio cuento." },
        { f: "[La Elección de Movimiento]", s: "¿Quieres entrar al baño saltando como rana o caminando como elefante? El agua se enfría en 2 minutos, ¡tú eliges cómo llegar!" }
      ]
    },
    prisas: {
      icon: <Zap />,
      items: [
        { f: "[Desafío de Velocidad]", s: "Hagamos una carrera: ¿quién se pone los zapatos antes de que yo cuente hasta 20? El que gane elige la canción del coche." },
        { f: "[Consecuencia del Retraso]", s: "El autobús no espera. ¿Quieres desayunar sentado conmigo o prefieres que guarde el pan en una bolsa para comer en el camino porque se nos hizo tarde?" }
      ]
    },
    comida: {
      icon: <Coffee />,
      items: [
        { f: "[Metáfora de los Bichitos]", s: "Esos dulces son bichitos que se ponen pesados en la panza. En Navidad hace frío y se duermen, pero hoy están muy despiertos y no te dejarán correr." },
        { f: "[Escudos de Salud]", s: "Esta sopa tiene escudos invisibles. Cada cucharada es un escudo contra los resfriados. ¿Cuántos quieres hoy: cinco o diez?" }
      ]
    },
    orden: {
      icon: <ToyBrick />,
      items: [
        { f: "[Competencia de Tiempo]", s: "Vamos a ver quién junta más piezas en 60 segundos. ¡El que gane elige el color del vaso de la cena!" },
        { f: "[Caja de Descanso]", s: "Los juguetes que se queden en el suelo se irán a mi 'Caja de Descanso' y no saldrán hasta mañana porque están muy cansados." }
      ]
    },
    pantallas: {
      icon: <Monitor />,
      items: [
        { f: "[Aviso y Carga]", s: "En 5 minutos la tablet necesita ir a cargarse. ¿Quieres apagarla tú ahora o esperar a que se apague solita y te quedes a medias?" },
        { f: "[Transición Suave]", s: "Cuando termine este capítulo, la tele se va a dormir. ¿Quieres que después juguemos a las escondidas o leemos un cuento?" }
      ]
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2 italic">3. Scripts de Mando</h2>
        <p className="text-slate-400 text-xs font-medium">"No es necesario explicarle a un niño como si fuera adulto. Usa el juego y la firmeza serena."</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {Object.keys(scripts).map(k => (
          <button 
            key={k} 
            onClick={() => setCat(k)} 
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${cat === k ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
          >
            {scripts[k].icon} {k}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {scripts[cat].items.map((item, i) => (
          <div key={i} className="p-8 bg-white rounded-[2.5rem] border-l-[12px] border-orange-500 shadow-sm border-y border-r border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{item.f}</h4>
            <p className="text-slate-900 font-bold italic leading-relaxed text-sm">"{item.s}"</p>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 text-center">
        <p className="text-xs text-orange-700 font-bold italic">"Hijo, la clave no es el guion, es cumplir lo que dices. Si el juguete se va a la caja, se va. Tu autoridad serena es para siempre."</p>
      </div>
    </div>
  );
};

export default Scripts;
