import React, { useState } from 'react';

const SOS = ({ setView }) => {
  const [step, setStep] = useState(0);
  const [vent, setVent] = useState('');

  const messages = [
    "¡ESPERA! Respira hondo y sostén el aire un momento...",
    "¿Se va a dañar el día por reaccionar a algo tan ambiguo?",
    "Si gritas, tu hijo sufrirá a largo plazo, pero tú lo sufrirás esta noche. ¿Quieres eso?",
    "Tu hijo no lo hace por maldad, es un niño y ha estado criándose así.",
    "Para ayudarlo, debes estar en todos tus sentidos.",
    "Si explotas solo sucumbes a instintos básicos. Las consecuencias son difíciles de reparar.",
    "¿Recuerdas cuando ese angelito estaba entre tus brazos?",
    "No querrás llegar a mi edad y sentir que tus hijos no te tienen confianza.",
    "Solo ve y toma un vaso de agua o simplemente mira al horizonte."
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10">
      <div className="w-72 h-72 rounded-full bg-slate-900 border-[12px] border-orange-500 flex flex-col items-center justify-center text-center p-8 shadow-2xl relative">
        <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Intervención SOS</div>
        <p className="text-white text-lg font-bold leading-tight">{messages[step % messages.length]}</p>
      </div>

      {step < messages.length ? (
        <button 
          onClick={() => setStep(step + 1)} 
          className="w-full max-w-xs h-16 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl"
        >
          {step === 0 ? "Presionar para Frenar" : "Siguiente Pensamiento"}
        </button>
      ) : (
        <div className="w-full max-w-md space-y-6 animate-in fade-in">
           <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
             <p className="text-center text-slate-700 text-sm font-medium italic">"¿Ya estás mejor, hijo? ¿Tu nivel de ira bajó? Si no, desahógate conmigo aquí abajo. No te voy a juzgar."</p>
           </div>
           <textarea 
              value={vent} 
              onChange={e => setVent(e.target.value)} 
              placeholder="Escribe aquí tu rabia... (esto se borrará al salir)" 
              className="w-full h-44 p-6 rounded-[2.5rem] bg-slate-100 border-none outline-none text-slate-700 text-sm italic" 
           />
           <p className="text-[10px] text-center text-slate-400 font-black uppercase italic">Privado: Nada de esto se guarda.</p>
           <button onClick={() => setView('home')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest">Ya estoy mejor, volver</button>
        </div>
      )}
    </div>
  );
};

export default SOS;
