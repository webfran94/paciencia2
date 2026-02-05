import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Plus, X } from 'lucide-react';

const Mapa = ({ userData, setUserData, setView }) => {
  const [level, setLevel] = useState(userData?.patience_level || 5);
  const [triggers, setTriggers] = useState(userData?.selectedTriggers || []);
  const [custom, setCustom] = useState('');

  const common = ["Ruido excesivo", "Me ignoran", "Cansancio", "Malas contestaciones", "Prisa por salir"];

  const toggle = (t) => {
    const next = triggers.includes(t) ? triggers.filter(x => x !== t) : [...triggers, t];
    setTriggers(next);
  };

  const save = async () => {
    try {
      await updateDoc(doc(db, "users", userData.email), { patience_level: level, selectedTriggers: triggers });
      setUserData({ ...userData, patience_level: level, selectedTriggers: triggers });
      alert("Mapa guardado, hijo.");
      setView('home');
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">1. Mapa de Zonas Rojas</h2>
        <p className="text-slate-400 text-xs italic">"Al identificar qué te sobrecarga y estar atento a tu energía, sabrás cuándo vas a gritar incluso minutos antes."</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border space-y-4">
        <p className="font-bold text-xs uppercase text-slate-400">¿Qué causa tu estrés? (Elige 3)</p>
        <div className="flex flex-wrap gap-2">
          {common.map(t => (
            <button key={t} onClick={() => toggle(t)} className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${triggers.includes(t) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Otro detonante..." className="flex-1 p-3 bg-slate-50 rounded-xl text-sm outline-none" />
          <button onClick={() => { if(custom){setTriggers([...triggers, custom]); setCustom('');} }} className="p-3 bg-slate-900 text-white rounded-xl"><Plus size={18}/></button>
        </div>
      </div>

      <div className={`p-8 rounded-[2.5rem] border transition-all ${level > 7 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
        <p className="font-bold text-xs uppercase text-slate-400 text-center mb-6">Nivel de tu Tanque de Paciencia</p>
        <input type="range" min="1" max="10" value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
        <div className="text-6xl font-black text-center text-slate-900 my-4">{level}/10</div>
        {level > 7 && <p className="text-[10px] text-red-600 font-black text-center animate-pulse">PELIGRO: Tu sistema está sobrecargado. Ve al SOS.</p>}
      </div>

      <button onClick={save} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-200">Guardar Estado</button>
    </div>
  );
};

export default Mapa;
