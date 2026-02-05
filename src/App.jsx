import React, { useState, useEffect } from 'react';
import { 
  Home, Wind, MessageCircle, Map, CheckCircle2, 
  Lock, LogOut, Zap, Activity, Heart, Eye, Clock, 
  ChevronDown, X, Plus, Shield, Flame, LayoutGrid, 
  CheckCircle, AlertTriangle, Sun, Smile
} from 'lucide-react';

// --- CONEXIÓN A FIREBASE (LÓGICA INTACTA) ---
import { auth, db } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, getDoc, updateDoc,
} from 'firebase/firestore';

// --- COMPONENTES UI (ESTILO CIERRA CICLOS) ---
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`rounded-[2rem] border bg-white text-slate-950 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md active:scale-95' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl text-sm font-bold tracking-tight transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-12 px-6 w-full";
  const variants = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-800",
    orange: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200",
    sos: "bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-200 animate-pulse",
    outline: "border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-600",
    ghost: "hover:bg-slate-50 text-slate-400"
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600",
    premium: "bg-orange-100 text-orange-700 font-bold"
  };
  return <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${variants[variant]}`}>{children}</div>
};

// --- 1. HERRAMIENTA: MAPA DE ZONAS ROJAS ---
const MapaTool = ({ userId, userData, updateUserData }) => {
  const [level, setLevel] = useState(userData?.patience_level || 5);
  const [triggers, setTriggers] = useState(userData?.selectedTriggers || []);
  
  const commonTriggers = ["Ruido excesivo", "Me ignoran", "Cansancio", "Malas contestaciones", "Prisa/Estrés"];

  const toggleTrigger = (t) => {
    const next = triggers.includes(t) ? triggers.filter(x => x !== t) : [...triggers, t];
    setTriggers(next);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", userData.email), { patience_level: level, selectedTriggers: triggers });
      updateUserData({ ...userData, patience_level: level, selectedTriggers: triggers });
      alert("Mapa actualizado. Mantente alerta a estas señales.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">1. Mapa de Zonas Rojas</h2>
        <p className="text-sm text-slate-500 italic">Identifica tus detonantes y mide tu energía para anticiparte al grito.</p>
      </div>
      
      <Card className="p-6 space-y-4">
        <p className="font-bold text-sm uppercase text-slate-400 tracking-widest">Mis Desencadenantes comunes</p>
        <div className="flex flex-wrap gap-2">
          {commonTriggers.map(t => (
            <button key={t} onClick={() => toggleTrigger(t)} className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${triggers.includes(t) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
      </Card>

      <Card className={`p-6 space-y-4 transition-colors duration-500 ${level > 7 ? 'bg-red-50 border-red-100' : 'bg-white'}`}>
        <p className="font-bold text-sm uppercase text-slate-400 tracking-widest">Nivel de Paciencia actual</p>
        <input type="range" min="1" max="10" value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
        <div className="text-4xl font-black text-center text-slate-900">{level}/10</div>
        {level > 7 && <p className="text-[10px] text-red-600 font-bold text-center animate-bounce uppercase">⚠️ ATENCIÓN: Tu sistema está sobrecargado. Ve al botón SOS.</p>}
      </Card>

      <Button onClick={handleSave} variant="orange">Guardar Estado</Button>
    </div>
  );
};

// --- 2. HERRAMIENTA: BOTÓN SOS (EL INTERCEPTOR) ---
const SOSTool = () => {
  const [step, setStep] = useState(0);
  const [vent, setVent] = useState('');

  const messages = [
    "Hijo, antes de gritar... ¡ESPERA! ¿Se va a dañar el día por algo tan ambiguo?",
    "Si gritas, tu hijo sufrirá a largo plazo, pero tú lo sufrirás esta noche. ¿Quieres eso?",
    "Tu hijo no lo hace por maldad, es un niño y ha estado criándose así.",
    "Para ayudarlo, debes estar en todos tus sentidos. No sucumbas al instinto.",
    "¿Recuerdas cuando ese angelito estaba entre tus brazos?",
    "No querrás llegar a mi edad y sentir que tus hijos no te tienen confianza.",
    "Ve ahora mismo, toma un vaso de agua o simplemente mira al horizonte."
  ];

  return (
    <div className="space-y-8 py-4 flex flex-col items-center">
      <div className="w-64 h-64 rounded-full bg-slate-900 border-[10px] border-orange-500 flex flex-col items-center justify-center text-center p-6 shadow-2xl relative">
        <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Interceptando...</div>
        <p className="text-white text-lg font-bold leading-tight">{messages[step % messages.length]}</p>
      </div>

      {step < 7 ? (
        <Button onClick={() => setStep(step + 1)} variant="orange" className="max-w-xs h-16 text-lg">Siguiente Paso</Button>
      ) : (
        <div className="w-full max-w-md space-y-4 animate-in fade-in">
           <p className="text-center text-slate-500 text-sm italic">"Ya estás mejor, ¿tu nivel de ira bajó? Cuéntame lo que sientes, hijo. Yo te escucho y no te juzgo."</p>
           <textarea value={vent} onChange={e => setVent(e.target.value)} placeholder="Escribe aquí tu desahogo... (se borrará al salir)" className="w-full h-40 p-6 rounded-[2rem] bg-slate-100 border-none outline-none text-slate-700 text-sm italic" />
           <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Privacidad total: Esta conversación es efímera.</p>
           <Button onClick={() => window.location.reload()} variant="primary">Volver al Dashboard</Button>
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
      { t: "La Fórmula", d: "[Acción Autónoma] O [Acción con Ayuda que quita tiempo de diversión] + [Consecuencia Lógica]." },
      { t: "Pijamas", d: "¿Te vas a poner el pijama tú solo como un rayo o quieres que te ayude yo? Si te ayudo yo, tardamos más y solo nos dará tiempo a leer medio cuento." },
      { t: "Desafío", d: "¿Quieres entrar al baño saltando como rana o caminando como elefante?" }
    ],
    comida: [
      { t: "La Metáfora", d: "Esos dulces son bichitos que se ponen pesados en la panza. La sopa tiene escudos invisibles contra ellos. ¿Cuántos escudos quieres: 5 o 10?" },
      { t: "Regla", d: "Si comes la comida de mamá primero, tu estómago estará fuerte. Si no hay comida fuerte, el postre no puede entrar." }
    ],
    orden: [
      { t: "Competencia", d: "Vamos a ver quién junta más piezas en 60 segundos. ¡El que gane elige el color del vaso!" },
      { t: "Caja de Descanso", d: "Los juguetes que se queden en el suelo se irán a mi 'Caja de Descanso' y no podrán salir hasta mañana porque están muy cansados." }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.keys(data).map(k => (
          <button key={k} onClick={() => setCat(k)} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${cat === k ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {k}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {data[cat].map((item, i) => (
          <Card key={i} className="p-6 border-l-8 border-orange-500">
            <h4 className="text-xs font-black text-slate-400 uppercase mb-2">{item.t}</h4>
            <p className="text-slate-900 font-bold italic leading-relaxed">"{item.d}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- 4. HERRAMIENTA: DIARIO DE REDENCIÓN ---
const DiarioTool = ({ userData, updateUserData }) => {
  const [ans, setAns] = useState({ v: '', d: '', p: '' });
  const [status, setStatus] = useState(null);

  const save = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...userData };
    if (status === 'gritó') newData.lastYelledDate = today;
    
    try {
      await updateDoc(doc(db, "users", userData.email), { lastYelledDate: newData.lastYelledDate || today });
      updateUserData(newData);
      alert("Ciclo cerrado. Mañana es una nueva oportunidad.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 space-y-6">
        <p className="text-center font-bold">¿Hoy lograste ser el ancla o hubo tormenta?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setStatus('bien')} className={`p-4 rounded-2xl border-2 transition-all ${status === 'bien' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}>
            <Sun className="mx-auto mb-2 text-emerald-500" />
            <span className="text-[10px] font-black uppercase">Mantuve el Mando</span>
          </button>
          <button onClick={() => setStatus('gritó')} className={`p-4 rounded-2xl border-2 transition-all ${status === 'gritó' ? 'border-red-500 bg-red-50' : 'border-slate-50'}`}>
            <Flame className="mx-auto mb-2 text-red-500" />
            <span className="text-[10px] font-black uppercase">Exploté/Grité</span>
          </button>
        </div>
        <div className="space-y-4">
          <textarea onChange={e => setAns({...ans, v: e.target.value})} placeholder="¿Cuál fue tu victoria de hoy?" className="w-full p-4 bg-slate-50 rounded-2xl text-sm italic outline-none" />
          <textarea onChange={e => setAns({...ans, p: e.target.value})} placeholder="Escribe una frase de perdón para ti si fallaste..." className="w-full p-4 bg-slate-50 rounded-2xl text-sm italic outline-none" />
        </div>
        <Button onClick={save} variant="orange" disabled={!status}>Cerrar Ciclo del Día</Button>
      </Card>
      <p className="text-center text-slate-400 text-xs italic">"Duerme tranquilo, que el sol de mañana no sabe nada de los errores de hoy."</p>
    </div>
  );
};

// --- 5. CHECKLIST SILENCIO SENSORIAL ---
const SilencioTool = () => {
  const items = ["Apagar televisión/música", "Guardar 5 objetos desordenados", "Celular en 'No Molestar'", "Abrir una ventana", "Lavar cara con agua fría"];
  return (
    <div className="space-y-6">
      <Card className="p-8 space-y-4">
        <p className="text-sm text-slate-500 italic">Baja los plomos de tu cerebro cuando el entorno te asfixie.</p>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <CheckCircle className="text-slate-300" size={20} />
            <span className="text-sm font-bold text-slate-700">{item}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};

// --- 6. PROTOCOLO 18:00 (HORA CRÍTICA) ---
const ProtocoloTool = () => {
  const steps = [
    { t: "El Minuto de Oro", d: "Antes de entrar, detente 60 segundos. Repite: 'Mi familia es mi refugio'." },
    { t: "Dieta de Expectativas", d: "Acepta el desorden. No esperes perfección hoy." },
    { t: "Ritual de Conexión", d: "Los primeros 10 min son solo para besos y juegos. Nada de tareas." }
  ];
  return (
    <div className="space-y-4">
      {steps.map((s, i) => (
        <Card key={i} className="p-6">
          <h4 className="font-black text-orange-600 text-xs uppercase mb-1">{s.t}</h4>
          <p className="text-sm text-slate-600 leading-relaxed">{s.d}</p>
        </Card>
      ))}
    </div>
  );
};

// --- 7. PRIMEROS AUXILIOS POST-GRITO ---
const AuxiliosTool = () => (
  <Card className="p-8 space-y-4 bg-blue-50 border-blue-100">
    <h3 className="text-lg font-black text-blue-900">Guía de Reparación</h3>
    <p className="text-sm text-blue-800 leading-relaxed">
      Hijo, si fallaste, no te castigues. Baja a su altura, pídele perdón sin excusas: "Me equivoqué al gritarte, estaba cansado pero eso no justifica mi grito. Te quiero mucho". Recupera tu autoridad desde el amor.
    </p>
  </Card>
);

// --- DASHBOARD PRINCIPAL (TU COLUMNA VERTEBRAL MEJORADA) ---
const Dashboard = ({ changeView, userData, setUserData }) => {
  const esPremium = userData?.status === 'comprador_premium' || userData?.hasUpsell === 1;
  
  const calculateStreak = () => {
    if (!userData?.lastYelledDate) return 0;
    const last = new Date(userData.lastYelledDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-20">
      <section className="space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hola, {userData?.first_name || 'Hijo'}.</h1>
        <p className="text-slate-500 italic text-sm">"Los resultados dependen de nuestras reacciones."</p>
      </section>

      {/* RACHA */}
      <Card className="bg-slate-900 text-white p-8 relative overflow-hidden">
        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12" />
        <div className="relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">Días sin gritar</p>
          <div className="text-6xl font-black tracking-tighter">{calculateStreak()}</div>
          <p className="text-xs mt-2 opacity-60 italic">¡Sigue así, el ancla de tu hogar!</p>
        </div>
      </Card>

      {/* BOTÓN SOS (EL MÁS VISIBLE) */}
      <Button onClick={() => changeView('sos')} variant="sos" className="h-28 text-xl">
        <Zap className="mr-3 fill-white" /> ¡AUXILIO! VOY A GRITAR
      </Button>

      {/* HERRAMIENTAS PRINCIPALES (ORDEN LÓGICO) */}
      <div className="space-y-4">
        <ToolCard title="1. Mapa de Zonas Rojas" desc="Prevención y Energía" icon={<Map/>} onClick={() => changeView('mapa')} />
        <ToolCard title="3. Scripts de Mando" desc="Qué decir en cada caso" icon={<MessageCircle/>} onClick={() => changeView('scripts')} />
        <ToolCard title="4. Diario de Redención" desc="Cierre del día y Racha" icon={<CheckCircle2/>} onClick={() => changeView('diario')} />
      </div>

      {/* HERRAMIENTAS AVANZADAS (PREMIUM GATING) */}
      <section className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Herramientas Avanzadas</h3>
        <div className="grid grid-cols-1 gap-4">
          <ToolCard title="Checklist Silencio" icon={<Eye/>} onClick={() => esPremium ? changeView('silencio') : alert("Necesitas el Pack Premium")} premium={!esPremium} />
          <ToolCard title="Protocolo 18:00" icon={<Clock/>} onClick={() => esPremium ? changeView('protocolo') : alert("Necesitas el Pack Premium")} premium={!esPremium} />
          <ToolCard title="Primeros Auxilios" icon={<Heart/>} onClick={() => esPremium ? changeView('auxilios') : alert("Necesitas el Pack Premium")} premium={!esPremium} />
        </div>
      </section>
    </div>
  );
};

const ToolCard = ({ title, desc, icon, onClick, premium }) => (
  <Card onClick={onClick} className={`p-5 flex items-center justify-between group ${premium ? 'opacity-60 bg-slate-50' : ''}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${premium ? 'bg-slate-200 text-slate-400' : 'bg-orange-50 text-orange-600'}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        {desc && <p className="text-[10px] text-slate-400 uppercase font-black">{desc}</p>}
      </div>
    </div>
    {premium ? <Lock size={16} className="text-slate-300" /> : <ChevronDown className="-rotate-90 text-slate-300" size={16} />}
  </Card>
);

// --- APP COMPONENT ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); 

  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, "users", email.trim().toLowerCase()));
      if (docSnap.exists()) setStep('password');
      else setError('No encontramos tu compra.');
    } catch (err) { setError('Error de conexión.'); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch (err) { setError('Acceso denegado.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md p-8 border-slate-200">
        <h1 className="text-2xl font-black text-center mb-8">Manual de la Paciencia</h1>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm mb-4 rounded-xl">{error}</div>}
        {step === 'email' ? (
          <form onSubmit={verifyEmail} className="space-y-4">
            <input type="email" placeholder="Email de compra" className="w-full p-4 rounded-2xl border" required onChange={e => setEmail(e.target.value)} />
            <Button type="submit" disabled={loading}>{loading ? 'Cargando...' : 'Continuar'}</Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Contraseña" className="w-full p-4 rounded-2xl border" required onChange={e => setPassword(e.target.value)} />
            <Button type="submit" variant="orange" disabled={loading}>Entrar</Button>
          </form>
        )}
      </Card>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docSnap = await getDoc(doc(db, "users", firebaseUser.email));
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold italic">Abriendo el Manual...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <nav className="h-16 border-b flex items-center justify-between px-6 max-w-xl mx-auto">
        <div onClick={() => setView('dashboard')} className="flex items-center gap-2 cursor-pointer">
          <div className="bg-slate-900 text-white p-1.5 rounded-lg"><Home size={18}/></div>
          <span className="font-black text-sm uppercase tracking-tighter">Panel de Mando</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-slate-300 hover:text-red-500"><LogOut size={20}/></button>
      </nav>

      <main className="p-6 max-w-xl mx-auto">
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-slate-400 font-bold text-xs uppercase"><X size={14} className="mr-1"/> Cerrar herramienta</button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} setUserData={setUserData} />}
        {view === 'mapa' && <MapaTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
        {view === 'sos' && <SOSTool />}
        {view === 'scripts' && <ScriptsTool />}
        {view === 'diario' && <DiarioTool userData={userData} updateUserData={setUserData} />}
        {view === 'silencio' && <SilencioTool />}
        {view === 'protocolo' && <ProtocoloTool />}
        {view === 'auxilios' && <AuxiliosTool />}
      </main>
    </div>
  );
};

export default App;
