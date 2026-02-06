import React, { useState } from 'react';

const SOS = ({ setView }) => {
  const [step, setStep] = useState(0);
  const [vent, setVent] = useState('');

  const messages = [
    "¡ESPERA! Respira y sostén la respiración un momento...",
    "¿Se va a dañar el día por reaccionar a algo tan ambiguo?",
    "Si gritas, tu hijo sufrirá las consecuencias a largo plazo, pero tú lo sufrirás esta noche. ¿Quieres eso?",
    "Tu hijo no lo hace por maldad, es un niño y ha estado criándose así.",
    "Para ayudarlo, debes estar en todos tus sentidos.",
    "Si explotas solo será sucumbir a instintos básicos, pero las consecuencias serán difíciles de reparar.",
    "¿Recuerdas cuando ese angelito estaba entre tus brazos?",
    "No querrás llegar a mi edad y sentir que tus hijos no te tienen confianza.",
    "Solo ve y toma un vaso de agua o simplemente mira al horizonte."
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-10 py-10 animate-in fade-in zoom-in duration-300">
      <div className="w-72 h-72 rounded-full bg-slate-900 border-[12px] border-orange-500 flex flex-col items-center justify-center text-center p-8 shadow-2xl relative border-solid">
        <div className="absolute -top-4 bg-orange-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Intercepción Activa</div>
        <p className="text-white text-lg font-bold leading-tight italic">{messages[step % messages.length]}</p>
      </div>

      {step < messages.length ? (
        <button 
          onClick={() => setStep(step + 1)} 
          className="w-full max-w-xs h-16 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-orange-200 active:scale-95"
        >
          {step === 0 ? "Presionar para Frenar" : "Siguiente Pensamiento"}
        </button>
      ) : (
        <div className="w-full max-w-md space-y-6 animate-in fade-in">
           <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 text-center">
             <p className="text-slate-700 text-sm font-bold italic leading-relaxed">"¿Ya estás mejor, hijo? ¿Tu nivel de ira bajó? Si no es así, escribe abajo y cuéntame lo que sientes. Yo no te voy a juzgar."</p>
           </div>
           <textarea 
             value={vent} 
             onChange={e => setVent(e.target.value)} 
             placeholder="Saca tu rabia aquí... (esta conversación es privada y se borrará al salir)" 
             className="w-full h-44 p-8 rounded-[2.5rem] bg-slate-100 border-none outline-none text-slate-700 text-sm italic shadow-inner" 
           />
           <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest italic">Confidencial: Nada de esto se guarda.</p>
           <button onClick={() => setView('home')} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl">Ya estoy en calma, volver</button>
        </div>
      )}
    </div>
  );
};

export default SOS;
