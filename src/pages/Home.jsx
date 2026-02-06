import React from 'react';
import { Zap, Map, MessageCircle, CheckCircle2, Heart, Activity, ChevronRight, Gavel, Calendar, ShieldCheck, Tablet, Headphones, Sparkles, Eye, Clock } from 'lucide-react';

const Home = ({ userData, setView }) => {
  const esPremium = userData?.hasUpsell === 1 || userData?.status === 'comprador_premium';
  const esAlerta = userData?.patience_level > 7;

  const calculateStreak = () => {
    if (!userData?.lastYelledDate) return 1;
    const last = new Date(userData.lastYelledDate);
    const now = new Date();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <div className={`space-y-8 animate-in fade-in duration-700 pb-20`}>
      <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Hola, {userData?.first_name || 'Hijo'}.</h1>

      <div className={`rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all ${esAlerta ? 'bg-red-600 animate-pulse' : 'bg-slate-900'}`}>
        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        <div className="text-center relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">Racha de Autoridad Serena</p>
          <div className="text-7xl font-black leading-none">{calculateStreak()}</div>
          <p className="text-xs mt-2 font-bold uppercase tracking-widest">{calculateStreak() === 1 ? 'Día sin gritar' : 'Días sin gritar'}</p>
        </div>
      </div>

      <button onClick={() => setView('sos')} className="w-full h-36 bg-red-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl animate-pulse active:scale-95 transition-all">
        <Zap size={36} className="mb-1 fill-white" />
        <span className="text-2xl font-black uppercase tracking-tighter">¡SOS INTERCEPTOR!</span>
        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Pánico Inmediato</span>
      </button>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Herramientas Principales</h3>
        <ToolCard title="1. Mapa de Zonas Rojas" desc="Prevención" icon={<Map/>} onClick={() => setView('mapa')} color="bg-orange-50 text-orange-600" />
        <ToolCard title="3. Scripts de Mando" desc="Qué decir hoy" icon={<MessageCircle/>} onClick={() => setView('scripts')} color="bg-blue-50 text-blue-600" />
        <ToolCard title="4. Diario de Redención" desc="Cierre del día" icon={<CheckCircle2/>} onClick={() => setView('diario')} color="bg-emerald-50 text-emerald-600" />
        <ToolCard title="5. Guía Primeros Auxilios" desc="Reparar vínculo" icon={<Heart/>} onClick={() => setView('auxilios')} color="bg-rose-50 text-rose-600" />
      </div>

      {!esPremium ? (
        <div className="mt-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-10 text-center space-y-6">
          <Sparkles className="mx-auto text-orange-500" size={40} />
          <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">¿Ya dejaste de gritar, pero ahora quieres que tus hijos te obedezcan sin repetir 20 veces lo mismo?</h3>
          <p className="text-sm text-slate-500 italic">"Hijo, el grito silenciado es el inicio. El Sistema de Influencia es el que construye el respeto real."</p>
          <button className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl">Obtener Acceso Premium</button>
        </div>
      ) : (
        <div className="mt-12 space-y-6 pt-10 border-t-8 border-blue-50">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-500 ml-4">Sistema de Influencia Premium</h3>
          <div className="grid grid-cols-1 gap-4 bg-blue-50/40 p-6 rounded-[3rem]">
            <ToolCard title="Protocolo Consecuencias" icon={<Gavel/>} onClick={() => setView('consecuencias')} color="bg-white text-green-600 shadow-sm" />
            <ToolCard title="Arquitecto de Rutinas" icon={<Calendar/>} onClick={() => setView('rutinas')} color="bg-white text-blue-600 shadow-sm" />
            <ToolCard title="Escudo Anti-Juicios" icon={<ShieldCheck/>} onClick={() => setView('escudo')} color="bg-white text-orange-600 shadow-sm" />
            <ToolCard title="Paz Digital" icon={<Tablet/>} onClick={() => setView('paz-digital')} color="bg-white text-blue-400 shadow-sm" />
            <ToolCard title="Reparación Profunda" icon={<Heart/>} onClick={() => setView('reparacion-p')} color="bg-white text-red-400 shadow-sm" />
            <ToolCard title="Audios Reprogramación" icon={<Headphones/>} onClick={() => setView('audios')} color="bg-white text-indigo-600 shadow-sm" />
            <ToolCard title="Silencio Sensorial" icon={<Eye/>} onClick={() => setView('silencio')} color="bg-white text-orange-400 shadow-sm" />
            <ToolCard title="Protocolo 18:00" icon={<Clock/>} onClick={() => setView('protocolo')} color="bg-white text-blue-500 shadow-sm" />
          </div>
        </div>
      )}
    </div>
  );
};

const ToolCard = ({ title, desc, icon, onClick, color }) => (
  <div onClick={onClick} className="p-6 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        {desc && <p className="text-[10px] text-slate-400 uppercase font-black">{desc}</p>}
      </div>
    </div>
    <ChevronRight className="text-slate-200 group-hover:text-orange-500" size={20} />
  </div>
);

export default Home;
