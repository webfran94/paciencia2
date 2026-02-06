import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Sun, Flame, CheckCircle } from 'lucide-react';

const Diario = ({ userData, setUserData, setView }) => {
  const [ans, setAns] = useState({ v: '', p: '' });
  const [status, setStatus] = useState(null);

  const save = async () => {
    const today = new Date().toISOString().split('T')[0];
    const dataRef = doc(db, "users", userData.email);

    try {
      await updateDoc(dataRef, {
        lastYelledDate: status === 'grité' ? today : (userData.lastYelledDate || today),
        diaryHistory: arrayUnion({ fecha: today, victoria: ans.v, perdon: ans.p, estado: status })
      });
      setUserData({ ...userData, lastYelledDate: status === 'grité' ? today : userData.lastYelledDate });
      alert("Ciclo cerrado. Mañana es una nueva oportunidad.");
      setView('home');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl">
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">4. Diario de Redención</h2>
        <p className="text-slate-400 text-xs italic">"Al final de la batalla, hay que limpiar las heridas. Procesa, suelta y resetea tu mente."</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8">
        <p className="text-center font-bold text-slate-700 text-sm">¿Hoy lograste ser el ancla o hubo tormenta?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setStatus('bien')} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${status === 'bien' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 text-slate-400'}`}>
            <Sun className="mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Victoria</span>
          </button>
          <button onClick={() => setStatus('grité')} className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center ${status === 'grité' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-50 text-slate-400'}`}>
            <Flame className="mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Recaída</span>
          </button>
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 tracking-widest">¿Cuál fue tu pequeña victoria de hoy?</p>
            <textarea onChange={e => setAns({...ans, v: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] text-sm italic outline-none h-28" placeholder="Algo que hiciste bien, por pequeño que sea..." />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 tracking-widest">Escribe una frase de perdón para ti mismo</p>
            <textarea onChange={e => setAns({...ans, p: e.target.value})} className="w-full p-6 bg-slate-50 rounded-[2rem] text-sm italic outline-none h-28" placeholder="Si fallaste, perdónate..." />
          </div>
        </div>
        <button onClick={save} disabled={!status} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all">Cerrar el ciclo</button>
      </div>
      <p className="text-center text-slate-400 text-xs italic">"Duerme tranquilo, que el sol de mañana no sabe nada de los errores de hoy."</p>
    </div>
  );
};

export default Diario;
