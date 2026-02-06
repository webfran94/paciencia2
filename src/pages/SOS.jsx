import React, { useState } from 'react';

const SOS = ({ setView }) => {
  const [step, setStep] = useState(0);
  const [vent, setVent] = useState('');

  const messages = [
    "¡ESPERA! Respira hondo un momento...",
    "¿Se va a dañar el día por reaccionar a algo tan ambiguo?",
    "Si gritas, tu hijo sufrirá las consecuencias, pero tú lo sufrirás esta noche con culpa. ¿Quieres eso?",
    "Tu hijo no lo hace por maldad, es solo un niño aprendiendo.",
    "Para ayudarlo, debes estar en todos tus sentidos.",
    "Sucumbir al grito solo enseña miedo, no respeto.",
    "¿Recuerdas cuando ese angelito estaba entre tus brazos?",
    "No querrás que tus hijos te pierdan la confianza al llegar a viejos.",
    "Solo ve y toma un vaso de agua o mira al horizonte 10 segundos."
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in zoom-in duration-300">
      <div className="w-72 h-72 rounded-full bg-slate-900 border-[12px] border-orange-500 flex flex-col items-center justify-center text-center p-8 shadow-2xl relative">
        <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Interceptor Activo</div>
        <p className="text-white text-lg font-bold leading-tight">{messages[step % messages.length]}</p>
      </div>

      {step < messages.length ? (
        <button onClick={() => setStep(step + 1)} className="w-full max-w-xs h-16 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl">
          {step === 0 ? "Presionar para Frenar" : "Siguiente"}
        </button>
      ) : (
        <div className="w-full max-w-md space-y-6 animate-in fade-in">
           <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 text-center">
             <p className="text-slate-700 text-sm font-bold italic">"¿Ya estás mejor, hijo? Si no es así, escribe abajo lo que sientes. Yo no te juzgo."</p>
           </div>
           <textarea value={vent} onChange={e => setVent(e.target.value)} placeholder="Saca tu rabia aquí... (se borrará al salir)" className="w-full h-44 p-6 rounded-[2.5rem] bg-slate-100 border-none outline-none text-slate-700 text-sm italic" />
           <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">Confidencial: Nada se guarda.</p>
           <button onClick={() => setView('home')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase shadow-xl">Ya estoy en calma, volver</button>
        </div>
      )}
    </div>
  );
};

export default SOS;
