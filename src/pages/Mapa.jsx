import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Plus, ShieldAlert } from 'lucide-react';

const Mapa = ({ userData, setUserData, setView }) => {
  const [level, setLevel] = useState(userData?.patience_level || 5);
  const [triggers, setTriggers] = useState(userData?.selectedTriggers || []);
  const [custom, setCustom] = useState('');

  const common = ["Ruido excesivo / Caos", "Me ignoran repetidamente", "Cansancio acumulado", "Malas contestaciones", "Prisa por salir"];

  const toggle = (t) => {
    const next = triggers.includes(t) ? triggers.filter(x => x !== t) : (triggers.length < 3 ? [...triggers, t] : triggers);
    setTriggers(next);
  };

  const save = async () => {
    try {
      await updateDoc(doc(db, "users", userData.email.toLowerCase()), { patience_level: level, selectedTriggers: triggers });
      setUserData({ ...userData, patience_level: level, selectedTriggers: triggers });
      alert("Hijo, mapa guardado. Mantente alerta.");
      setView('home');
    } catch (e) { alert("Error al guardar. Revisa tu conexión."); }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2 italic">1. Mapa de Zonas Rojas</h2>
        <p className="text-slate-400 text-xs italic">"Identificar tus detonantes te permite anticiparte al caos incluso antes de que ocurra."</p>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border space-y-6 shadow-sm">
        <p className="font-black text-xs uppercase text-slate-400 tracking-widest">¿Qué te sobrecarga hoy? (Elige 3)</p>
        <div className="flex flex-wrap gap-2">
          {common.map(t => (
            <button key={t} onClick={() => toggle(t)} className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${triggers.includes(t) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="Agrega otro..." className="flex-1 p-4 bg-slate-50 rounded-xl text-sm outline-none" />
          <button onClick={() => { if(custom){setTriggers([...triggers, custom]); setCustom('');} }} className="p-4 bg-slate-900 text-white rounded-xl active:scale-95"><Plus size={20}/></button>
        </div>
      </div>

      <div className={`p-10 rounded-[3rem] border-2 shadow-sm ${level > 7 ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
        <p className="font-black text-xs uppercase text-slate-400 text-center mb-6 tracking-widest">Nivel de Paciencia</p>
        <input type="range" min="1" max="10" value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
        <div className="text-7xl font-black text-center text-slate-900 my-6 tracking-tighter">{level}/10</div>
        {level > 7 && (
          <div className="bg-red-600 text-white p-4 rounded-2xl flex items-center justify-center gap-2 animate-pulse mb-4">
            <ShieldAlert size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest">Peligro: Ve al botón SOS de inmediato</p>
          </div>
        )}
      </div>

      <button onClick={save} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl">Guardar Mapa</button>
    </div>
  );
};

export default Mapa;
