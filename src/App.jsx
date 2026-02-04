import React, { useState, useEffect } from 'react';
import { 
  Home, Wind, MessageCircle, Map, CheckCircle2, 
  Lock, LogOut, Zap, Activity, Heart, Eye, Clock, 
  ChevronRight, AlertTriangle, Shield, Flame, X, Plus
} from 'lucide-react';
import { auth, db } from './firebase'; 
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// --- COMPONENTES DE INTERFAZ (ESTILO CIERRA CICLOS) ---
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl border border-slate-100 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-orange-200' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "flex items-center justify-center rounded-xl font-bold transition-all px-6 py-3 w-full text-sm";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    orange: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-400 hover:text-red-500"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// --- VISTA: HERRAMIENTA SOS (INTERCEPTOR) ---
const SOSTool = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { t: "¡ALTO! No digas ni una palabra más.", i: <Wind className="w-12 h-12 text-blue-500" /> },
    { t: "Respira: Inhala en 4 segundos... exhala en 6.", i: <Activity className="w-12 h-12 text-orange-500" /> },
    { t: "Tu hijo es pequeño, tú eres el adulto. Él te necesita.", i: <Heart className="w-12 h-12 text-red-500" /> },
    { t: "Baja tu volumen. Susurra si es necesario.", i: <Shield className="w-12 h-12 text-green-500" /> }
  ];
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12 animate-in fade-in zoom-in duration-300">
      <div className="w-64 h-64 rounded-full bg-slate-900 border-[10px] border-orange-500 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
        {steps[step].i}
        <p className="text-white text-sm font-bold mt-4 leading-tight">{steps[step].t}</p>
      </div>
      <Button onClick={() => setStep(step < 3 ? step + 1 : 0)} variant="orange" className="max-w-xs">
        {step < 3 ? "Siguiente Paso" : "Reiniciar Interceptor"}
      </Button>
    </div>
  );
};

// --- VISTA: DIARIO DE REDENCIÓN (REINICIA RACHA) ---
const DiaryTool = ({ userId, userData, updateUserData }) => {
  const [exploded, setExploded] = useState(null);
  
  const handleSave = async () => {
    const today = new Date().toISOString();
    const newData = { ...userData };
    
    if (exploded === 'si') {
      newData.lastGritoDate = today; // Si gritó, la fecha de racha es HOY (reinicio)
    }
    
    try {
      await updateDoc(doc(db, "users", userData.email), { 
        lastGritoDate: newData.lastGritoDate || today 
      });
      updateUserData(newData);
      alert("Registro guardado. Tu racha se ha actualizado.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto py-6">
      <h2 className="text-2xl font-black text-slate-900">Diario de Redención</h2>
      <Card className="p-6 space-y-4">
        <p className="text-slate-600 font-medium text-center">¿Hoy lograste mantener el mando o hubo una explosión?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setExploded('no')} className={`p-4 rounded-xl border-2 transition-all ${exploded === 'no' ? 'border-green-500 bg-green-50' : 'border-slate-100'}`}>
            <Smile className="mx-auto mb-2 text-green-500" />
            <span className="font-bold text-xs uppercase">Mantuve la Calma</span>
          </button>
          <button onClick={() => setExploded('si')} className={`p-4 rounded-xl border-2 transition-all ${exploded === 'si' ? 'border-red-500 bg-red-50' : 'border-slate-100'}`}>
            <Flame className="mx-auto mb-2 text-red-500" />
            <span className="font-bold text-xs uppercase">Exploté/Grité</span>
          </button>
        </div>
        {exploded && <Button onClick={handleSave} variant="orange">Guardar en Bitácora</Button>}
      </Card>
    </div>
  );
};

// --- DASHBOARD PRINCIPAL ---
const InternalDashboard = ({ userData, setUserData }) => {
  const [view, setView] = useState('home');
  const esPremium = userData?.hasUpsell === 1 || userData?.status === 'comprador_premium';

  // Lógica de Racha
  const calculateStreak = () => {
    if (!userData?.lastGritoDate) return 1;
    const last = new Date(userData.lastGritoDate);
    const now = new Date();
    const diffTime = Math.abs(now - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const streak = calculateStreak();

  const handleLogout = () => signOut(auth);

  if (view === 'sos') return <SOSTool />;
  if (view === 'diary') return <DiaryTool userId={userData.uid} userData={userData} updateUserData={setUserData} />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* BANNER BIENVENIDA */}
      <section className="pt-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Hola, {userData?.first_name || 'Papá/Mamá'}.
        </h1>
        <p className="text-slate-500 italic">Hoy es un buen día para ser el ancla de tu hogar.</p>
      </section>

      {/* INDICADOR DE RACHA */}
      <Card className="bg-slate-900 text-white border-0 p-6 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-orange-400 mb-1">Tu Racha Actual</p>
            <h2 className="text-5xl font-black leading-none">{streak} <span className="text-xl">Días</span></h2>
            <p className="text-slate-400 text-xs mt-2 italic">Sin gritos. ¡Eres un héroe!</p>
          </div>
          <Activity className="w-16 h-16 text-white/10 absolute -right-2 -bottom-2" />
        </div>
      </Card>

      {/* GRID DE HERRAMIENTAS */}
      <div className="grid grid-cols-2 gap-4">
        <ToolCard title="Botón SOS" icon={<Wind />} color="text-orange-500" desc="Interceptor 30s" onClick={() => setView('sos')} />
        <ToolCard title="Scripts" icon={<MessageCircle />} color="text-blue-500" desc="¿Qué decir hoy?" />
        <ToolCard title="Zonas Rojas" icon={<Map />} color="text-red-500" desc="Mapa prevención" />
        <ToolCard title="Bitácora" icon={<CheckCircle2 />} color="text-green-500" desc="Cierra el ciclo" onClick={() => setView('diary')} />
      </div>

      {/* ADICIONALES PREMIUM GATED */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Herramientas Avanzadas</h3>
        <div className="space-y-3">
          <PremiumTool title="Protocolo 18:00 (Hora Crítica)" icon={<Clock />} isPremium={esPremium} />
          <PremiumTool title="Silencio Sensorial" icon={<Eye />} isPremium={esPremium} />
          <PremiumTool title="Primeros Auxilios Post-Grito" icon={<Heart />} isPremium={esPremium} />
        </div>
      </section>

      {/* TARJETA PACK PREMIUM (Solo si no es premium) */}
      {!esPremium && (
        <Card className="bg-orange-600 text-white p-8 text-center shadow-2xl border-0 transform rotate-1">
          <Zap className="mx-auto mb-4 w-10 h-10 fill-white" />
          <h4 className="text-xl font-black mb-2 uppercase">Pack Premium Bloqueado</h4>
          <p className="text-sm opacity-90 mb-6">Necesitas el Pack Premium para desbloquear el Plan Anti-Recaída y las herramientas avanzadas.</p>
          <Button variant="outline" className="bg-white text-orange-600 border-0">MEJORAR MI ACCESO POR $7</Button>
        </Card>
      )}

      <Button onClick={handleLogout} variant="ghost" className="mt-12">
        <LogOut className="mr-2 w-4 h-4" /> Cerrar Sesión
      </Button>
    </div>
  );
};

// --- SUB-COMPONENTES AUXILIARES ---
const ToolCard = ({ title, icon, color, desc, onClick }) => (
  <Card onClick={onClick} className="p-5 flex flex-col justify-between h-32">
    <div className={`${color} bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center`}>
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="font-bold text-slate-900 text-sm leading-tight">{title}</h4>
      <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{desc}</p>
    </div>
  </Card>
);

const PremiumTool = ({ title, icon, isPremium }) => (
  <Card className={`p-4 flex items-center justify-between ${!isPremium ? 'opacity-60 bg-slate-50 grayscale' : ''}`}>
    <div className="flex items-center gap-3">
      <div className="text-slate-400">{icon}</div>
      <span className="font-bold text-slate-700 text-sm">{title}</span>
    </div>
    {!isPremium ? <Lock size={16} className="text-slate-300" /> : <ChevronRight size={16} className="text-orange-500" />}
  </Card>
);

export default InternalDashboard;
