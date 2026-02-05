import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Sun, Flame, CheckCircle } from 'lucide-react';

const Diario = ({ userData, setUserData, setView }) => {
  const [ans, setAns] = useState({ v: '', d: '', p: '' });
  const [status, setStatus] = useState(null);

  const save = async () => {
    const today = new Date().toISOString().split('T')[0];
    const dataRef = doc(db, "users", userData.email);

    try {
      await updateDoc(dataRef, {
        lastYelledDate: status === 'gritó' ? today : (userData.lastYelledDate || today),
        diaryHistory: arrayUnion({ fecha: today, victoria: ans.v, perdon: ans.p, estado: status })
      });
      setUserData({
        ...userData, 
        lastYelledDate: status === 'gritó' ? today : userData.lastYelledDate
      });
      alert("Ciclo cerrado. Duerme con el corazón liviano.");
      setView('home');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">4. Diario de Redención</h2>
        <p className="text-slate-400 text-xs italic">"Al final de la batalla, hay que limpiar las heridas. Procesa, suelta y resetea."</p>
      </div>

      <div className="bg-white p-8 rounded-[3rem] border shadow-sm space-y-8">
        <p className="text-center font-bold text-slate-700">¿Lograste ser el ancla o hubo tormenta?</p>
        
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setStatus('bien')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center ${status === 'bien' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-50 text-slate-400'}`}>
            <Sun className="mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Victoria</span>
          </button>
          <button onClick={() => setStatus('gritó')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center ${status === 'gritó' ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-50 text-slate-400'}`}>
            <Flame className="mb-2" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exploté</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase text-slate-400 ml-2">¿Cuál fue tu victoria hoy?</p>
            <textarea onChange={e => setAns({...ans, v: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[2rem] text-sm italic outline-none h-24" placeholder="Algo que hiciste bien..." />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black uppercase text-slate-400 ml-2">Escribe una frase de perdón para ti</p>
            <textarea onChange={e => setAns({...ans, p: e.target.value})} className="w-full p-5 bg-slate-50 rounded-[2rem] text-sm italic outline-none h-24" placeholder="Si fallaste, perdónate..." />
          </div>
        </div>

        <button 
          onClick={save} 
          disabled={!status}
          className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg disabled:opacity-50"
        >
          Cerrar el ciclo
        </button>
      </div>
      <p className="text-center text-slate-400 text-xs italic">"Duerme tranquilo, que el sol de mañana no sabe nada de los errores de hoy. Te espero al amanecer."</p>
    </div>
  );
};

export default Diario;
