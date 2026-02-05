import React, { useState, useEffect } from 'react';
import { 
  Home, Wind, MessageCircle, Map, CheckCircle2, 
  Lock, LogOut, Zap, Activity, Heart, Eye, Clock, 
  ChevronRight, AlertTriangle, Shield, Flame, X, Plus, 
  ArrowRight, Coffee, Moon, Sun, Laptop
} from 'lucide-react';
import { auth, db } from './firebase'; 
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

// --- ESTILOS DINÁMICOS SEGÚN NIVEL DE PACIENCIA ---
const getPatienceColor = (level) => {
  if (level <= 3) return 'from-emerald-50 to-teal-50 border-emerald-100 text-emerald-700';
  if (level <= 7) return 'from-orange-50 to-amber-50 border-orange-100 text-orange-700';
  return 'from-red-50 to-rose-50 border-red-100 text-red-700 animate-pulse';
};

// --- COMPONENTES UI BASE ---
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-3xl border shadow-sm transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "flex items-center justify-center rounded-2xl font-bold transition-all px-6 py-4 w-full text-sm uppercase tracking-widest";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800",
    orange: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg shadow-orange-200",
    red: "bg-gradient-to-r from-red-600 to-rose-600 text-white animate-bounce",
    outline: "border-2 border-slate-100 text-slate-600 hover:bg-slate-50",
    ghost: "text-slate-400 hover:text-red-500"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

// --- 1. HERRAMIENTA: MAPA DE ZONAS ROJAS ---
const MapaTool = ({ userData, updateUserData }) => {
  const [level, setLevel] = useState(userData?.patience_level || 5);
  const [triggers, setTriggers] = useState(userData?.selectedTriggers || []);
  const [customTrigger, setCustomTrigger] = useState('');

  const commonTriggers = ["Ruido excesivo", "Desobediencia repetida", "Cansancio acumulado", "Desorden en casa", "Prisa por salir"];

  const toggleTrigger = (t) => {
    const next = triggers.includes(t) ? triggers.filter((x) => x !== t) : [...triggers, t];
    setTriggers(next);
  };

  const save = async () => {
    try {
      const docRef = doc(db, "users", userData.email);
      await updateDoc(docRef, { patience_level: level, selectedTriggers: triggers });
      updateUserData({ ...userData, patience_level: level, selectedTriggers: triggers });
      alert("Mapa actualizado, hijo. Mantente atento a esas señales.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="bg-slate-900 p-8 rounded-[40px] text-white">
        <h2 className="text-2xl font-black mb-2">Paso 1: Prevención</h2>
        <p className="text-slate-400 text-sm italic">"Identificar el fuego antes de que se vuelva incendio es de sabios."</p>
      </section>

      <Card className="p-8 space-y-6">
        <h3 className="font-bold text-slate-900">¿Qué te está robando la paz hoy? (Elige 3)</h3>
        <div className="flex flex-wrap gap-2">
          {commonTriggers.map(t => (
            <button key={t} onClick={() => toggleTrigger(t)} className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${triggers.includes(t) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={customTrigger} onChange={e => setCustomTrigger(e.target.value)} placeholder="Otro detonante..." className="flex-1 bg-slate-50 p-3 rounded-xl text-sm outline-none" />
          <Button onClick={() => {if(customTrigger){setTriggers([...triggers, customTrigger]); setCustomTrigger('');}}} variant="outline" className="w-auto px-4"><Plus size={18}/></Button>
        </div>
      </Card>

      <Card className={`p-8 space-y-6 transition-colors duration-500 ${getPatienceColor(level)}`}>
        <h3 className="font-bold">Nivel de tu Tanque de Energía</h3>
        <input type="range" min="1" max="10" value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full h-3 bg-white/50 rounded-lg appearance-none cursor-pointer accent-current" />
        <div className="text-5xl font-black text-center">{level}/10</div>
        <p className="text-xs text-center font-medium opacity-80">
          {level > 7 ? "⚠️ TU SISTEMA ESTÁ SOBRECARGADO. Ve directo al Botón SOS." : "✅ Estás en control. Respira y sigue guiando."}
        </p>
      </Card>
      
      <Button onClick={save} variant="orange">Guardar y Estar Alerta</Button>
    </div>
  );
};

// --- 2. HERRAMIENTA: BOTÓN SOS (EL INTERCEPTOR) ---
const SOSTool = () => {
  const [step, setStep] = useState(0);
  const [vent, setVent] = useState('');

  const messages = [
    "Hijo, antes de gritar... ¡ESPERA! Tu hijo no es el enemigo.",
    "Si explotas ahora, tú lo sufrirás esta noche con culpa. ¿Quieres eso?",
    "¿Recuerdas cuando ese angelito cabía en tus brazos? Él sigue ahí, asustado.",
    "Toma un vaso de agua o mira al horizonte 10 segundos. No sucumbas al instinto.",
    "Eres su héroe, no su ogro. Respira y vuelve a empezar."
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-10 animate-in zoom-in duration-300">
      <div className="w-72 h-72 rounded-full bg-slate-900 border-[12px] border-orange-500 flex flex-col items-center justify-center text-center p-8 shadow-2xl relative border-solid">
        <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Freno de Emergencia</div>
        <p className="text-white text-lg font-bold leading-tight">{messages[step % messages.length]}</p>
      </div>

      {step < 5 ? (
        <Button onClick={() => setStep(step + 1)} variant="orange" className="max-w-xs shadow-2xl">Presionar para Calmarme</Button>
      ) : (
        <div className="w-full max-w-md space-y-4 animate-in fade-in">
           <p className="text-center text-slate-500 text-sm font-medium italic">"Yo te escucho, hijo. Cuéntame aquí lo que sientes, desahógate conmigo. Nadie más lo leerá."</p>
           <textarea value={vent} onChange={e => setVent(e.target.value)} placeholder="Escribe aquí tu rabia, tu cansancio... suéltalo todo." className="w-full h-40 p-6 rounded-[32px] bg-slate-100 border-none outline-none text-slate-700 text-sm italic shadow-inner" />
           <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Al salir de aquí, esto se borrará para siempre.</p>
           <Button onClick={() => window.location.reload()} variant="primary">Ya estoy mejor, volver</Button>
        </div>
      )}
    </div>
  );
};

// --- 3. HERRAMIENTA: SCRIPTS DE MANDO ---
const ScriptsTool = () => {
  const [cat, setCat] = useState('dormir');
  const data = {
    dormir: [
      { f: "[Acción Autónoma] o [Acción con Ayuda]", s: "¿Te pones el pijama tú solo como un rayo o te ayudo yo y leemos medio cuento menos?" },
      { f: "[Juego de Traslado]", s: "¿Quieres ir a la cama saltando como rana o caminando como elefante?" }
    ],
    comida: [
      { f: "[Metáfora de Bichitos]", s: "Esos dulces tienen bichitos que te ponen pesado. La sopa tiene escudos invisibles contra ellos. ¿Cuántos escudos quieres: 5 o 10?" },
      { f: "[Regla de Oro]", s: "Si comes la comida de mamá primero, tu estómago estará fuerte para el postre. Si no hay comida fuerte, el postre no puede entrar." }
    ],
    orden: [
      { f: "[Caja de Descanso]", s: "Los juguetes que se queden en el suelo se irán a mi 'Caja de Descanso' hasta mañana porque están muy cansados." },
      { f: "[Capitán de Limpieza]", s: "¿Quieres recoger primero los cubos rojos o los azules? Tú diriges hoy, capitán." }
    ]
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.keys(data).map(k => (
          <button key={k} onClick={() => setCat(k)} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${cat === k ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
            {k}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {data[cat].map((item, i) => (
          <Card key={i} className="p-6 border-l-[6px] border-orange-500 border-solid">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Fórmula: {item.f}</p>
            <p className="text-slate-800 font-bold italic">"{item.s}"</p>
          </Card>
        ))}
      </div>
      
      <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 border-solid">
        <p className="text-xs text-orange-700 font-medium italic">"Recuerda, hijo: el secreto no es el guion, es cumplir lo que dices con una sonrisa y firmeza."</p>
      </div>
    </div>
  );
};

// --- 4. HERRAMIENTA: DIARIO (CIERRE Y RACHA) ---
const DiarioTool = ({ userData, updateUserData }) => {
  const [ans, setAns] = useState({ v: '', d: '', p: '' });
  const [yelled, setYelled] = useState(null);

  const finish = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...userData };
    
    if (yelled === true) {
      newData.lastYelledDate = today; 
    } else if (!userData.lastYelledDate) {
      newData.lastYelledDate = today; 
    }

    try {
      await updateDoc(doc(db, "users", userData.email), { 
        lastYelledDate: newData.lastYelledDate,
        lastReflections: ans 
      });
      updateUserData(newData);
      alert("Ciclo cerrado. Duerme en paz.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8 py-6">
      <h2 className="text-2xl font-black text-slate-900">Diario de Redención</h2>
      <Card className="p-8 space-y-6">
        <p className="font-bold text-center">¿Hoy lograste ser el ancla o hubo tormenta?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setYelled(false)} className={`p-6 rounded-3xl border-2 border-solid transition-all ${yelled === false ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}>
            <Sun className="mx-auto mb-2 text-emerald-500" />
            <span className="text-[10px] font-black uppercase">Victoria</span>
          </button>
          <button onClick={() => setYelled(true)} className={`p-6 rounded-3xl border-2 border-solid transition-all ${yelled === true ? 'border-red-500 bg-red-50' : 'border-slate-50'}`}>
            <Flame className="mx-auto mb-2 text-red-500" />
            <span className="text-[10px] font-black uppercase">Recaída</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-700">¿Cuál fue tu pequeña victoria de hoy?</p>
          <textarea onChange={e => setAns({...ans, v: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm italic outline-none" placeholder="Aunque sea pequeña..." />
        </div>

        <Button onClick={finish} variant="orange" disabled={yelled === null}>Cerrar el día</Button>
      </Card>
      
      <p className="text-center text-slate-400 text-xs italic">"Duerme tranquilo, que el sol de mañana no sabe nada de los errores de hoy."</p>
    </div>
  );
};

// --- DASHBOARD PRINCIPAL ---
const Dashboard = ({ userData, setUserData, setView }) => {
  const esPremium = userData?.hasUpsell === 1 || userData?.status === 'comprador_premium';
  
  const calculateStreak = () => {
    if (!userData?.lastYelledDate) return 0;
    const last = new Date(userData.lastYelledDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex justify-between items-start pt-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hola, {userData?.first_name || 'Hijo'}.</h1>
          <p className="text-slate-500 text-sm italic font-medium">"Si la vida te da limones, haz limonada."</p>
        </div>
        <Button onClick={() => signOut(auth)} variant="ghost" className="w-auto px-2"><LogOut size={20}/></Button>
      </header>

      {/* RACHA */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">Días de Autoridad Serena</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black tracking-tighter">{calculateStreak()}</span>
            <span className="text-xl font-bold text-slate-400">Días</span>
          </div>
          <p className="mt-4 text-xs italic opacity-70">Los resultados dependen de tu reacción ante los demás.</p>
        </div>
      </div>

      {/* BOTÓN SOS (EL MÁS GRANDE) */}
      <section className="space-y-4">
         <Button onClick={() => setView('sos')} variant="red" className="h-28 text-xl shadow-2xl shadow-red-200">
           <Zap className="mr-3 fill-white" /> ¡AUXILIO! Voy a Gritar
         </Button>
         <p className="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest">Uso inmediato ante pérdida de control</p>
      </section>

      {/* GRID HERRAMIENTAS */}
      <div className="grid grid-cols-1 gap-4">
        <ToolCard title="1. Mapa de Zonas Rojas" desc="Identifica el fuego antes del incendio" icon={<Map/>} step="Prevención" onClick={() => setView('mapa')} />
        <ToolCard title="3. Scripts de Mando" desc="La fórmula técnica para que te escuchen" icon={<MessageCircle/>} step="Acción" onClick={() => setView('scripts')} />
        <ToolCard title="4. Diario de Redención" desc="Cierra el ciclo y suelta la culpa" icon={<CheckCircle2/>} step="Cierre" onClick={() => setView('diario')} />
      </div>

      {/* SECCIÓN PREMIUM */}
      <section className="pt-8 border-t border-slate-100 border-solid">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Herramientas Avanzadas</h3>
        <div className="space-y-3 opacity-60">
           <Card className="p-4 flex items-center justify-between grayscale">
              <div className="flex items-center gap-3">
                <Clock className="text-slate-400" size={18}/>
                <span className="text-sm font-bold">Protocolo 18:00 (Hora Crítica)</span>
              </div>
              <Lock size={14}/>
           </Card>
           {!esPremium && (
             <Button variant="orange" className="mt-4 shadow-orange-100 shadow-xl">Obtener Pack Premium - $7</Button>
           )}
        </div>
      </section>
    </div>
  );
};

const ToolCard = ({ title, desc, icon, step, onClick }) => (
  <Card onClick={onClick} className="p-6 flex items-center gap-6 group">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded text-slate-500">{step}</span>
      </div>
      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
      <p className="text-[10px] text-slate-400 italic font-medium">{desc}</p>
    </div>
    <ArrowRight size={16} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
  </Card>
);

// --- APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        const docSnap = await getDoc(doc(db, "users", fbUser.email));
        if (docSnap.exists()) setUserData(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white italic font-bold animate-pulse">Cargando el Manual de la Paciencia...</div>;
  if (!user) return <div className="h-screen flex items-center justify-center">Por favor, inicia sesión.</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-950 px-6 max-w-lg mx-auto overflow-x-hidden">
      {view !== 'home' && (
        <button onClick={() => setView('home')} className="pt-8 text-slate-400 hover:text-slate-900 flex items-center gap-1 font-bold text-xs uppercase tracking-widest transition-all bg-transparent border-none cursor-pointer">
          <X size={14}/> Cerrar Herramienta
        </button>
      )}
      
      <main className="pt-4">
        {view === 'home' && <Dashboard userData={userData} setUserData={setUserData} setView={setView} />}
        {view === 'mapa' && <MapaTool userData={userData} updateUserData={setUserData} />}
        {view === 'sos' && <SOSTool />}
        {view === 'scripts' && <ScriptsTool />}
        {view === 'diario' && <DiarioTool userData={userData} updateUserData={setUserData} />}
      </main>
    </div>
  );
}
