import React, { useState, useEffect } from 'react';
import { 
  Home, Wind, MessageCircle, Map, CheckCircle2, 
  Lock, LogOut, Zap, Activity, Heart, Eye, Clock, 
  ChevronDown, X, Plus, Shield, Flame, LayoutGrid, 
  CheckCircle, AlertTriangle, Sun, Smile, ArrowRight
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
  doc, getDoc, updateDoc, setDoc
} from 'firebase/firestore';

// --- COMPONENTES UI ---
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`rounded-[2.5rem] border bg-white text-slate-950 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md active:scale-95' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl text-sm font-bold tracking-tight transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-14 px-8 w-full uppercase tracking-widest";
  const variants = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-800",
    orange: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200",
    sos: "bg-red-600 text-white hover:bg-red-700 shadow-2xl shadow-red-300 animate-pulse",
    outline: "border-2 border-slate-100 bg-white hover:bg-slate-50 text-slate-600",
    ghost: "hover:bg-slate-50 text-slate-400"
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = (props) => (
  <input {...props} className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
);

// --- 1. HERRAMIENTA: MAPA DE ZONAS ROJAS ---
const MapaTool = ({ userData, updateUserData }) => {
  const [level, setLevel] = useState(userData?.patience_level || 5);
  const [triggers, setTriggers] = useState(userData?.selectedTriggers || []);
  const [customTrigger, setCustomTrigger] = useState('');

  const commonTriggers = ["Ruido excesivo / Caos", "Me ignoran repetidamente", "Cansancio propio", "Malas contestaciones", "Prisa por salir"];

  const toggleTrigger = (t) => {
    const next = triggers.includes(t) ? triggers.filter(x => x !== t) : [...triggers, t];
    setTriggers(next);
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "users", userData.email), { patience_level: level, selectedTriggers: triggers });
      updateUserData({ ...userData, patience_level: level, selectedTriggers: triggers });
      alert("Mapa actualizado. Si tu energía es baja, mantente cerca del botón SOS.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">1. Mapa de Zonas Rojas</h2>
        <p className="text-slate-400 text-xs italic">"Identificar tus detonantes te permite anticiparte al caos incluso minutos antes de que ocurra."</p>
      </div>

      <Card className="p-8 space-y-4">
        <p className="font-bold text-xs uppercase text-slate-400 tracking-widest">¿Qué te sobrecarga hoy? (Selecciona 3)</p>
        <div className="flex flex-wrap gap-2">
          {commonTriggers.map(t => (
            <button key={t} onClick={() => toggleTrigger(t)} className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${triggers.includes(t) ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={customTrigger} onChange={e => setCustomTrigger(e.target.value)} placeholder="Agrega otro detonante..." />
          <Button onClick={() => { if(customTrigger){setTriggers([...triggers, customTrigger]); setCustomTrigger('');} }} variant="outline" className="w-auto px-4"><Plus/></Button>
        </div>
      </Card>

      <Card className={`p-8 space-y-6 ${level > 7 ? 'bg-red-50 border-red-200' : ''}`}>
        <p className="font-bold text-xs uppercase text-slate-400 tracking-widest text-center">Nivel del Tanque de Paciencia</p>
        <input type="range" min="1" max="10" value={level} onChange={e => setLevel(parseInt(e.target.value))} className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-600" />
        <div className="text-6xl font-black text-center text-slate-900">{level}/10</div>
        <p className="text-xs text-slate-500 text-center italic">
          Al estar atento a tu energía, sabrás cuándo tu sistema nervioso necesita descargar sin explotar.
        </p>
      </Card>
      <Button onClick={handleSave} variant="orange">Guardar y Vigilancia</Button>
    </div>
  );
};

// --- 2. HERRAMIENTA: BOTÓN SOS (EL INTERCEPTOR) ---
const SOSTool = () => {
  const [step, setStep] = useState(0);
  const [vent, setVent] = useState('');

  const messages = [
    "¡ESPERA! Respira y sostén la respiración un momento...",
    "¿Se va a dañar el día por reaccionar a algo tan ambiguo?",
    "Si gritas, tu hijo sufrirá las consecuencias a largo plazo, pero tú lo sufrirás esta noche. ¿Quieres eso?",
    "Tu hijo no lo hace por maldad, es un niño y ha estado criándose así.",
    "Para ayudarlo, debes estar en todos tus sentidos.",
    "Si explotas solo será sucumbir a instintos básicos, pero las consecuencias serán difíciles de reparar.",
    "¿Recuerdas cuando ese angelito estaba entre tus brazos?",
    "No querrás llegar a mi edad y sentir que tus hijos no te tienen confianza.",
    "Solo ve y toma un vaso de agua o simplemente mira al horizonte."
  ];

  return (
    <div className="space-y-8 py-4 flex flex-col items-center">
      <div className="w-72 h-72 rounded-full bg-slate-900 border-[12px] border-orange-500 flex flex-col items-center justify-center text-center p-8 shadow-2xl relative">
        <div className="absolute -top-4 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Intercepción Activa</div>
        <p className="text-white text-lg font-bold leading-tight">{messages[step % messages.length]}</p>
      </div>

      {step < messages.length ? (
        <Button onClick={() => setStep(step + 1)} variant="orange" className="max-w-xs h-16 text-lg">
          {step === 0 ? "Presionar para Frenar" : "Siguiente"}
        </Button>
      ) : (
        <div className="w-full max-w-md space-y-6 animate-in fade-in">
           <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100">
             <p className="text-center text-slate-700 text-sm font-medium italic italic">"¿Ya estás mejor, hijo? ¿Tu nivel de ira bajó? Si no es así, escribe abajo y cuéntame lo que sientes. Yo no te voy a juzgar."</p>
           </div>
           <textarea value={vent} onChange={e => setVent(e.target.value)} placeholder="Desahógate aquí... (esta conversación es privada y se borrará al salir)" className="w-full h-44 p-6 rounded-[2.5rem] bg-slate-100 border-none outline-none text-slate-700 text-sm italic" />
           <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest italic">Nada de lo que escribas se guarda. Es solo para tu desahogo.</p>
           <Button onClick={() => window.location.reload()} variant="primary">Ya estoy en calma, volver</Button>
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
      { t: "Fórmula: [Acción Autónoma] o [Acción con Ayuda] + [Reloj]", d: "[Nombre], ¿te vas a poner el pijama tú solo como un rayo o quieres que te ayude yo? Si te ayudo yo, tardamos más y solo nos dará tiempo a leer medio cuento." },
      { t: "La Elección", d: "¿Quieres entrar al baño saltando como rana o caminando como elefante? El agua se enfría en 2 minutos, ¡tú eliges cómo llegar!" }
    ],
    comida: [
      { t: "Metáfora del Abuelo", d: "Esos dulces son bichitos que se ponen pesados en la panza y no te dejan correr rápido. En Navidad hace frío y se duermen, pero hoy están muy despiertos." },
      { t: "Los Escudos", d: "Esta sopa tiene escudos invisibles. Cada cucharada es un escudo que protege tu cuerpo. ¿Cuántos escudos quieres hoy: cinco o diez?" }
    ],
    orden: [
      { t: "Competencia", d: "Vamos a ver quién junta más piezas en 60 segundos. ¡El que gane elige el color del vaso de la cena!" },
      { t: "La Caja de Descanso", d: "Los juguetes que se queden en el suelo se irán a mi 'Caja de Descanso' hasta mañana porque están muy cansados." }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">3. Scripts de Mando</h2>
        <p className="text-slate-400 text-xs italic">"No es necesario explicarle a un niño como si fuera adulto. Usa el juego y la firmeza serena."</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {Object.keys(data).map(k => (
          <button key={k} onClick={() => setCat(k)} className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${cat === k ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            {k}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {data[cat].map((item, i) => (
          <Card key={i} className="p-8 border-l-[12px] border-orange-500">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{item.t}</h4>
            <p className="text-slate-900 font-bold italic leading-relaxed text-sm">"{item.d}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- 4. HERRAMIENTA: DIARIO DE REDENCIÓN ---
const DiarioTool = ({ userData, updateUserData }) => {
  const [ans, setAns] = useState({ v: '', d: '', p: '' });
  const [yelled, setYelled] = useState(null);

  const save = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newData = { ...userData };
    if (yelled === true) newData.lastYelledDate = today; 
    
    try {
      await updateDoc(doc(db, "users", userData.email), { 
        lastYelledDate: newData.lastYelledDate || today,
        diaryHistory: [...(userData.diaryHistory || []), { date: today, ...ans, yelled }]
      });
      updateUserData(newData);
      alert("Ciclo cerrado. Duerme con el corazón liviano.");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
        <h2 className="text-2xl font-black mb-2">4. Diario de Redención</h2>
        <p className="text-slate-400 text-xs italic">"Al final de la batalla, hay que limpiar las heridas. Suelta la culpa."</p>
      </div>
      <Card className="p-8 space-y-6">
        <p className="text-center font-bold text-sm">¿Lograste ser el ancla o hubo tormenta?</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setYelled(false)} className={`p-6 rounded-3xl border-2 transition-all ${yelled === false ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50'}`}>
            <Sun className="mx-auto mb-2 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Victoria</span>
          </button>
          <button onClick={() => setYelled(true)} className={`p-6 rounded-3xl border-2 transition-all ${yelled === true ? 'border-red-500 bg-red-50' : 'border-slate-50'}`}>
            <Flame className="mx-auto mb-2 text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Grité</span>
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-black uppercase text-slate-400">¿Cuál fue tu victoria de hoy?</p>
          <textarea onChange={e => setAns({...ans, v: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm italic outline-none h-24" />
          <p className="text-xs font-black uppercase text-slate-400">Escribe una frase de perdón para ti</p>
          <textarea onChange={e => setAns({...ans, p: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm italic outline-none h-24" />
        </div>
        <Button onClick={save} variant="orange" disabled={yelled === null}>Cerrar el Ciclo</Button>
      </Card>
      <p className="text-center text-slate-400 text-sm italic">"Duerme tranquilo, que el sol de mañana no sabe nada de los errores de hoy."</p>
    </div>
  );
};

// --- DASHBOARD PRINCIPAL ---
const Dashboard = ({ changeView, userData }) => {
  const esAlerta = userData?.patience_level > 7;
  
  const calculateStreak = () => {
    if (!userData?.lastYelledDate) return 1;
    const last = new Date(userData.lastYelledDate);
    const now = new Date();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  return (
    <div className={`max-w-xl mx-auto space-y-8 pb-20 transition-all duration-700 ${esAlerta ? 'bg-red-50/50 p-4 rounded-[3rem]' : ''}`}>
      <header className="flex justify-between items-start pt-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Hola, {userData?.first_name || 'Papá/Mamá'}.</h1>
          <p className="text-slate-500 italic text-sm">"Si la vida te da limones, haz limonada."</p>
        </div>
        <button onClick={() => signOut(auth)} className="p-3 text-slate-300 hover:text-red-500"><LogOut/></button>
      </header>

      {/* RACHA */}
      <div className={`rounded-[3rem] p-8 text-white relative overflow-hidden transition-all shadow-2xl ${esAlerta ? 'bg-red-600 animate-pulse' : 'bg-slate-900'}`}>
        <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        <div className="relative z-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-2">Tu camino a la paz</p>
          <div className="text-7xl font-black tracking-tighter leading-none">{calculateStreak()}</div>
          <p className="text-xs mt-2 font-bold uppercase tracking-widest">{calculateStreak() === 1 ? 'Día sin gritar' : 'Días sin gritar'}</p>
        </div>
      </div>

      {/* MENSAJE EMOTIVO */}
      <div className="text-center bg-white border border-slate-100 p-6 rounded-[2.5rem] italic text-slate-600 text-sm">
        "Los resultados dependen de nuestras reacciones ante las acciones de los demás. Aprovecha la situación y no te doblegues ante ella."
      </div>

      {/* BOTÓN SOS (JERARQUÍA MÁXIMA) */}
      <Button onClick={() => changeView('sos')} variant="sos" className="h-32 text-xl">
        <Zap className="mr-3 fill-white" /> ¡SOS INTERCEPTOR!
      </Button>

      {/* GRID HERRAMIENTAS */}
      <div className="grid grid-cols-1 gap-4">
        <ToolCard title="1. Mapa de Zonas Rojas" desc="Prevención: Tanque de Energía" icon={<Map/>} onClick={() => changeView('mapa')} color="bg-orange-50 text-orange-600" />
        <ToolCard title="3. Scripts de Mando" desc="Acción: Qué decir y cómo" icon={<MessageCircle/>} onClick={() => changeView('scripts')} color="bg-blue-50 text-blue-600" />
        <ToolCard title="4. Diario de Redención" desc="Cierre: Victoria y Perdón" icon={<CheckCircle2/>} onClick={() => changeView('diario')} color="bg-emerald-50 text-emerald-600" />
      </div>

      {/* OTRAS HERRAMIENTAS NORMALES (5, 6, 7) */}
      <div className="grid grid-cols-1 gap-4 pt-4">
        <ToolCard title="5. Silencio Sensorial" icon={<Eye/>} onClick={() => changeView('silencio')} color="bg-slate-50 text-slate-400" />
        <ToolCard title="6. Protocolo 18:00" icon={<Clock/>} onClick={() => changeView('protocolo')} color="bg-slate-50 text-slate-400" />
        <ToolCard title="7. Primeros Auxilios" icon={<Heart/>} onClick={() => changeView('auxilios')} color="bg-slate-50 text-slate-400" />
      </div>

      <Button variant="outline" className="mt-8">Quiero hacerme Premium</Button>
    </div>
  );
};

const ToolCard = ({ title, desc, icon, onClick, color }) => (
  <Card onClick={onClick} className="p-6 flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={`p-4 rounded-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
        {desc && <p className="text-[10px] text-slate-400 uppercase font-black">{desc}</p>}
      </div>
    </div>
    <ArrowRight className="text-slate-200 group-hover:text-orange-500 transition-all" size={20} />
  </Card>
);

// --- PANTALLA DE LOGIN (TU COLUMNA VERTEBRAL CORREGIDA) ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); 
  const [isNewUser, setIsNewUser] = useState(false);

  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, "users", email.trim().toLowerCase()));
      if (docSnap.exists()) {
        setIsNewUser(!docSnap.data().authLinked);
        setStep('password');
      } else {
        setError('No encontramos ninguna compra con este correo.');
      }
    } catch (err) { setError('Error de conexión.'); }
    finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNewUser) {
        if (password.length < 6) throw new Error('Crea una contraseña de al menos 6 caracteres.');
        const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        await updateDoc(doc(db, "users", email.trim().toLowerCase()), { uid: cred.user.uid, authLinked: true });
      } else {
        await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      }
    } catch (err) { setError(err.message || 'Error de acceso.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md p-10 border-slate-200">
        <div className="flex justify-center mb-6"><Shield size={48} className="text-slate-900" /></div>
        <h1 className="text-2xl font-black text-center mb-2">Manual de la Paciencia</h1>
        <p className="text-center text-slate-500 text-sm mb-8">Centro de Control Emocional</p>
        
        {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold mb-6 rounded-xl border border-red-100">{error}</div>}
        
        {step === 'email' ? (
          <form onSubmit={verifyEmail} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email de Compra</label>
              <Input type="email" required onChange={e => setEmail(e.target.value)} />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Verificando...' : 'Continuar'}</Button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                {isNewUser ? 'Crea tu Contraseña (mín. 6 caracteres)' : 'Ingresa tu Contraseña'}
              </label>
              <Input type="password" required onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="orange" disabled={loading}>{isNewUser ? 'Activar Acceso' : 'Ingresar al Manual'}</Button>
            <button onClick={() => setStep('email')} className="w-full text-center text-xs font-bold text-slate-400 mt-4">← Volver</button>
          </form>
        )}
      </Card>
    </div>
  );
};

// --- APP ---
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        const docSnap = await getDoc(doc(db, "users", fbUser.email));
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen flex flex-col items-center justify-center font-black italic gap-4"><Activity className="animate-spin text-orange-500" /> Abriendo el Manual...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className={`min-h-screen transition-all duration-700 ${userData?.patience_level > 7 ? 'bg-red-600/10' : 'bg-white'}`}>
      <nav className="h-20 border-b flex items-center justify-between px-6 max-w-xl mx-auto">
        <div onClick={() => setView('dashboard')} className="flex items-center gap-3 cursor-pointer">
          <div className="bg-slate-900 text-white p-2 rounded-xl"><Home size={20}/></div>
          <span className="font-black text-sm uppercase tracking-tighter">Manual Paciencia</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-slate-300 hover:text-red-500 transition-colors"><LogOut size={24}/></button>
      </nav>

      <main className="p-6 max-w-xl mx-auto">
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="mb-8 flex items-center text-slate-400 font-black text-xs uppercase hover:text-slate-900"><X size={16} className="mr-2"/> Cerrar Herramienta</button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} setUserData={setUserData} />}
        {view === 'mapa' && <MapaTool userData={userData} updateUserData={setUserData} />}
        {view === 'sos' && <SOSTool />}
        {view === 'scripts' && <ScriptsTool />}
        {view === 'diario' && <DiarioTool userData={userData} updateUserData={setUserData} />}
        {view === 'silencio' && <div className="p-8"><h2 className="text-2xl font-black mb-4">Checklist de Silencio</h2><p>Contenido en construcción...</p></div>}
        {view === 'protocolo' && <div className="p-8"><h2 className="text-2xl font-black mb-4">Protocolo 18:00</h2><p>Contenido en construcción...</p></div>}
        {view === 'auxilios' && <div className="p-8"><h2 className="text-2xl font-black mb-4">Primeros Auxilios</h2><p>Contenido en construcción...</p></div>}
      </main>
    </div>
  );
};

export default App;
