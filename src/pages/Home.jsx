import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Zap, Map, MessageCircle, CheckCircle2, Eye, Clock, Heart, LogOut, Activity, ChevronRight } from 'lucide-react';

const Home = ({ userData, setView }) => {
  // Modo Alerta: si la energía es mayor a 7
  const esAlerta = userData?.patience_level > 7;

  const calculateStreak = () => {
    if (!userData?.lastYelledDate) return 1;
    const last = new Date(userData.lastYelledDate);
    const now = new Date();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-700 pb-20 ${esAlerta ? 'bg-red-600/10 p-4 rounded-[3rem]' : ''}`}>
      <header className="flex justify-between items-start pt-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hola, {userData?.first_name || 'Hijo'}.</h1>
          <p className="text-slate-500 italic text-sm">"Si la vida te da limones, haz limonada."</p>
        </div>
        <button onClick={() => signOut(auth)} className="p-3 text-slate-300 hover:text-red-500"><LogOut/></button>
      </header>

      {/* Contador de Racha */}
      <div className={`rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all ${esAlerta ? 'bg-red-600 animate-pulse' : 'bg-slate-900'}`}>
        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        <div className="relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">Tu camino a la paz</p>
          <div className="text-7xl font-black tracking-tighter leading-none">{calculateStreak()}</div>
          <p className="text-xs mt-2 font-bold uppercase tracking-widest">{calculateStreak() === 1 ? 'Día sin gritar' : 'Días sin gritar'}</p>
        </div>
      </div>

      <div className="text-center bg-white border border-slate-100 p-6 rounded-[2.5rem] italic text-slate-600 text-sm shadow-sm">
        "Los resultados dependen de nuestras reacciones ante las acciones de los demás. Aprovecha la situación y no te doblegues ante ella."
      </div>

      {/* BOTÓN SOS - INTERCEPTOR (EL MÁS VISIBLE) */}
      <button 
        onClick={() => setView('sos')} 
        className="w-full h-32 bg-red-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl shadow-red-200 animate-pulse active:scale-95 transition-all"
      >
        <Zap size={32} className="mb-1 fill-white" />
        <span className="text-xl font-black uppercase tracking-tighter">¡SOS INTERCEPTOR!</span>
        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Emergencia Inmediata</span>
      </button>

      {/* Grid de herramientas principales */}
      <div className="grid grid-cols-1 gap-4">
        <ToolCard title="1. Mapa de Zonas Rojas" desc="Prevención: ¿Qué te sobrecarga hoy?" icon={<Map/>} onClick={() => setView('mapa')} color="bg-orange-50 text-orange-600" />
        <ToolCard title="3. Scripts de Mando" desc="Acción: Qué decir y cómo jugar" icon={<MessageCircle/>} onClick={() => setView('scripts')} color="bg-blue-50 text-blue-600" />
        <ToolCard title="4. Diario de Redención" desc="Cierre: Victoria, Perdón y Racha" icon={<CheckCircle2/>} onClick={() => setView('diario')} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* Herramientas Complementarias (También para Normal) */}
      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-100">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Más Herramientas de Apoyo</h3>
        <ToolCard title="5. Silencio Sensorial" icon={<Eye/>} onClick={() => setView('silencio')} color="bg-slate-50 text-slate-400" />
        <ToolCard title="6. Protocolo 18:00" icon={<Clock/>} onClick={() => setView('protocolo')} color="bg-slate-50 text-slate-400" />
        <ToolCard title="7. Primeros Auxilios" icon={<Heart/>} onClick={() => setView('auxilios')} color="bg-slate-50 text-slate-400" />
      </div>

      {/* Botón visual Premium */}
      <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold text-xs uppercase hover:bg-slate-50 transition-all">
        Próximamente: Acceder al Pack Premium
      </button>
    </div>
  );
};

const ToolCard = ({ title, desc, icon, onClick, color }) => (
  <div onClick={onClick} className="p-6 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        {desc && <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{desc}</p>}
      </div>
    </div>
    <ChevronRight className="text-slate-200 group-hover:text-orange-500 transition-all" />
  </div>
);

export default Home;
