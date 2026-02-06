import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Sun, Flame, CheckCircle } from 'lucide-react';

const Diario = ({ userData, setUserData, setView }) => {
  const [ans, setAns] = useState({ v: '', p: '' });
  const [yelled, setYelled] = useState(null);

  const save = async () => {
    const today = new Date().toISOString().split('T')[0];
    const dataRef = doc(db, "users", userData.email.toLowerCase());
    try {
      await updateDoc(dataRef, {
        lastYelledDate: yelled === true ? today : (userData.lastYelledDate || today),
        diaryHistory: arrayUnion({ fecha: today, victoria: ans.v, perdon: ans.p, yelled })
      });
      setUserData({ ...userData, lastYelledDate: yelled === true ? today : userData.lastYelledDate });
      alert("Ciclo cerrado. Mañana es una nueva oportunidad.");
      setView('home');
    } catch (e) { alert("Error de conexión."); }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">4. Diario de Redención</h2>
        <p className="text-slate-400 text-xs italic">"Al final de la batalla, hay que limpiar las heridas. Procesa y suelta."</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8">
        <p className="text-center font-bold text-slate-700 text-sm tracking-tight">¿Hoy lograste ser el ancla o hubo tormenta?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setYelled(false)} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${yelled === false ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 text-slate-400'}`}>
            <Sun className="mb-2" />
            <span className="text-[10px] font-black uppercase">Victoria</span>
          </button>
          <button onClick={() => setYelled(true)} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${yelled === true ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-50 text-slate-400'}`}>
            <Flame className="mb-2" />
            <span className="text-[10px] font-black uppercase">Recaída</span>
          </button>
        </div>
        <div className="space-y-6">
          <textarea onChange={e => setAns({...ans, v: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] text-sm italic outline-none h-28" placeholder="¿Cuál fue tu victoria de hoy? (Aunque sea pequeña)" />
          <textarea onChange={e => setAns({...ans, p: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] text-sm italic outline-none h-28" placeholder="Escribe una frase de perdón para ti si fallaste..." />
        </div>
        <button onClick={save} disabled={yelled === null} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase shadow-xl disabled:opacity-50">Cerrar el ciclo</button>
      </div>
      <p className="text-center text-slate-400 text-xs italic">"Duerme tranquilo, que el sol de mañana no sabe nada de los errores de hoy."</p>
    </div>
  );
};

export default Diario;
