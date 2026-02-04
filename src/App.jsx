import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Plus, Trash2, 
  ChevronDown, X, Wind, Shield, Heart, Smile, Zap, Lock, LogOut,
  Flame, LayoutGrid, CheckCircle2, AlertTriangle, Map, Clock, Eye
} from 'lucide-react';

// --- CONEXIÓN REAL A FIREBASE ---
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

// --- COMPONENTES UI ESTILO "CIERRA CICLOS" ---
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`rounded-xl border bg-white text-slate-950 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full";
  const variants = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    orange: "bg-orange-600 text-white hover:bg-orange-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-100",
    ghost: "hover:bg-slate-100 text-slate-600",
    link: "text-slate-900 underline-offset-4 hover:underline"
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = (props) => (
  <input {...props} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950" />
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50",
    premium: "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0"
  };
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold transition-colors ${variants[variant]}`}>{children}</div>
};

// --- 1. HERRAMIENTA: SOS INTERCEPTOR ---
const SOSTool = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { t: "¡ALTO! Suelta lo que tengas en la mano.", i: <Wind className="text-blue-500" /> },
    { t: "Respira profundo... Cuenta 4 segundos al inhalar.", i: <Activity className="text-orange-500" /> },
    { t: "Exhala lento... Tu hijo no es el enemigo, es tu maestro.", i: <Heart className="text-red-500" /> },
    { t: "Ahora, habla desde la calma, no desde el miedo.", i: <Smile className="text-green-500" /> }
  ];

  return (
    <div className="max-w-md mx-auto text-center space-y-8 py-10">
      <div className="bg-slate-900 text-white p-12 rounded-full w-64 h-64 mx-auto flex flex-col items-center justify-center border-8 border-orange-500 shadow-2xl animate-pulse">
        {steps[step].i}
        <p className="mt-4 text-sm font-medium leading-tight">{steps[step].t}</p>
      </div>
      <div className="flex gap-2">
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} variant="orange" className="h-16 text-lg">Siguiente Paso</Button>
        ) : (
          <Button onClick={() => setStep(0)} variant="outline">Reiniciar Interceptor</Button>
        )}
      </div>
    </div>
  );
};

// --- 2. HERRAMIENTA: SCRIPTS DE MANDO ---
const ScriptsTool = () => {
  const scripts = [
    { c: "Desobediencia", s: "En lugar de '¡Hazlo ya!', di: 'Veo que te cuesta empezar, ¿quieres que lo hagamos juntos o tú solo?'" },
    { c: "Berrinches", s: "En lugar de '¡Cállate!', di: 'Estás muy enojado y está bien. Estoy aquí cuando estés listo para un abrazo.'" },
    { c: "Caos/Ruido", s: "En lugar de gritar más fuerte, baja el tono y di: 'Mis oídos necesitan silencio ahora. ¿Podemos jugar a los espías?'" }
  ];
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Scripts de Mando Sereno</h2>
      {scripts.map((item, i) => (
        <Card key={i} className="bg-slate-50">
          <CardHeader><Badge>{item.c}</Badge></CardHeader>
          <CardContent><p className="text-slate-700 italic">"{item.s}"</p></CardContent>
        </Card>
      ))}
    </div>
  );
};

// --- 3. HERRAMIENTA: MAPA ZONAS ROJAS ---
const RedZonesTool = ({ userId, userData, updateUserData }) => {
  const [level, setLevel] = useState(userData?.patience_level || 5);
  const saveLevel = async (val) => {
    setLevel(val);
    try {
      await updateDoc(doc(db, "users", userId), { patience_level: val });
      updateUserData({ ...userData, patience_level: val });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-xl font-bold">Mapa de Zonas Rojas</h2>
      <p className="text-slate-500">¿Cómo está tu tanque de paciencia ahora?</p>
      <div className="flex justify-between px-4">
        <span className="text-green-500 font-bold">Calma</span>
        <span className="text-red-500 font-bold">Explosión</span>
      </div>
      <input type="range" min="1" max="10" value={level} onChange={(e) => saveLevel(parseInt(e.target.value))} className="w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" />
      <div className="text-4xl font-black text-slate-900">{level}/10</div>
      <p className="text-sm bg-orange-50 p-4 rounded-lg">
        {level > 7 ? "⚠️ ZONA ROJA: Activa el Botón SOS ahora mismo." : "✅ ZONA SEGURA: Sigue respirando."}
      </p>
    </div>
  );
};

// --- 4. HERRAMIENTA: DIARIO (TU REFLECTION TOOL MEJORADO) ---
const ReflectionTool = ({ userId, userData, updateUserData }) => {
  const [entries, setEntries] = useState(userData?.reflections || []);
  const [newEntry, setNewEntry] = useState({ trigger: '', intensity: 5 });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newEntry.trigger) return;
    const entry = { ...newEntry, id: Date.now(), date: new Date().toLocaleDateString() };
    const updatedEntries = [entry, ...entries];
    try {
      await updateDoc(doc(db, "users", userId), { reflections: updatedEntries });
      setEntries(updatedEntries);
      updateUserData({ ...userData, reflections: updatedEntries });
      setIsAdding(false);
      setNewEntry({ trigger: '', intensity: 5 });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Diario de Redención</h2>
        <Button onClick={() => setIsAdding(!isAdding)} variant="outline" className="w-auto">
          {isAdding ? <X size={16}/> : <Plus size={16}/>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-6 space-y-4">
            <label className="text-sm font-medium">¿Qué disparó tu ira hoy?</label>
            <select className="w-full p-2 border rounded-md" value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
              <option value="">Selecciona...</option>
              <option value="Desobediencia">Desobediencia</option>
              <option value="Ruido">Ruido/Caos</option>
              <option value="Cansancio">Mi propio cansancio</option>
            </select>
            <Button onClick={handleAdd} variant="orange">Cerrar el Ciclo</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {entries.map(entry => (
          <Card key={entry.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{entry.trigger}</p>
                <p className="text-xs text-slate-500">{entry.date}</p>
              </div>
              <CheckCircle2 className="text-green-500" size={20} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE GATED (PARA PREMIUM) ---
const GatedTool = ({ title, icon: Icon, description }) => (
  <div className="relative group">
    <Card className="opacity-50 grayscale pointer-events-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Icon size={20} />
      </CardHeader>
      <CardContent><p className="text-xs">{description}</p></CardContent>
    </Card>
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/60 backdrop-blur-[2px] rounded-xl border-2 border-dashed border-slate-300">
      <Lock className="text-slate-400 mb-2" size={24} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2">Herramienta Premium</p>
      <Button variant="orange" className="h-8 text-[10px] w-auto px-4 shadow-lg">DESBLOQUEAR AHORA</Button>
    </div>
  </div>
);

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => {
  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900">Hola, {userData?.first_name || 'Papá/Mamá'}</h1>
        <p className="text-slate-500 text-sm">Elige una herramienta para mantener la calma hoy.</p>
      </header>

      {/* TARJETA DE ESTADO */}
      <Card className="bg-slate-900 text-white border-0 overflow-hidden">
        <div className="p-6 flex items-center justify-between relative">
          <div className="z-10">
            <Badge variant={esPremium ? "premium" : "default"}>{esPremium ? 'PREMIUM' : 'CUENTA BÁSICA'}</Badge>
            <h2 className="text-xl font-bold mt-2">{esPremium ? 'Acceso Total Activo' : 'Manual de la Paciencia'}</h2>
          </div>
          <Shield className="h-20 w-20 text-white/10 absolute -right-4 -bottom-4" />
        </div>
      </Card>

      {/* HERRAMIENTAS ESENCIALES (PARA TODOS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card onClick={() => changeView('sos')} className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-orange-600 font-bold">Botón SOS</CardTitle>
            <Wind className="text-orange-500" />
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">Interceptor de ira en 30 segundos.</p></CardContent>
        </Card>

        <Card onClick={() => changeView('redzones')} className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-900">Zonas Rojas</CardTitle>
            <Map className="text-slate-400" />
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">Mide tu paciencia antes de explotar.</p></CardContent>
        </Card>

        <Card onClick={() => changeView('scripts')} className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-900">Scripts de Mando</CardTitle>
            <MessageCircle className="text-slate-400" />
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">Qué decir para que te escuchen.</p></CardContent>
        </Card>

        <Card onClick={() => changeView('reflection')} className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-slate-900">Diario de Redención</CardTitle>
            <CheckCircle2 className="text-slate-400" />
          </CardHeader>
          <CardContent><p className="text-xs text-slate-500">Cierra el ciclo y elimina la culpa.</p></CardContent>
        </Card>
      </div>

      {/* SECCIÓN PREMIUM (CON GATING) */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Zap size={14} className="text-amber-500"/> Herramientas Avanzadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {esPremium ? (
             <p className="text-sm text-center col-span-3 py-10 text-slate-400 italic">Cargando herramientas avanzadas...</p>
          ) : (
            <>
              <GatedTool title="Protocolo 18:00" icon={Clock} description="Sobrevive a la hora más crítica del día." />
              <GatedTool title="Silencio Sensorial" icon={Eye} description="Reduce el ruido que funde tus fusibles." />
              <GatedTool title="Primeros Auxilios" icon={Heart} description="Repara el vínculo tras un grito." />
            </>
          )}
        </div>
      </div>

      {!esPremium && (
        <Card className="bg-orange-600 text-white p-6 text-center shadow-orange-200 shadow-xl border-0">
          <p className="font-bold mb-2">¿Quieres las herramientas avanzadas?</p>
          <p className="text-xs text-orange-100 mb-4 italic">Únete al Plan Premium por solo $7 USD.</p>
          <Button variant="outline" className="text-orange-600 border-white hover:bg-white">Saber Más</Button>
        </Card>
      )}
    </div>
  );
};

// --- APP ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); 
  const [isNewUser, setIsNewUser] = useState(false);

  const cleanEmail = email.trim().toLowerCase();

  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const docRef = doc(db, "users", cleanEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsNewUser(!data.authLinked);
        setStep('password');
      } else {
        setError('No encontramos ninguna compra con este correo.');
      }
    } catch (err) { setError('Error de conexión.'); } 
    finally { setLoading(false); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isNewUser) {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateDoc(doc(db, "users", cleanEmail), { uid: userCredential.user.uid, authLinked: true });
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) { setError('Error de acceso.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md p-8 border-slate-200">
          <div className="text-center mb-8">
            <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4"><Shield className="text-slate-900" /></div>
            <h1 className="text-2xl font-black">Recupera el Mando</h1>
            <p className="text-sm text-slate-500 italic">Tu centro de control emocional</p>
          </div>
          {step === 'email' ? (
            <form onSubmit={verifyEmail} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">{error}</div>}
              <Input type="email" placeholder="Email de compra" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" disabled={loading}>{loading ? 'Verificando...' : 'Entrar'}</Button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="text-center text-xs text-slate-500 mb-4">{cleanEmail}</div>
              <Input type="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" variant="orange" disabled={loading}>{isNewUser ? 'Activar Acceso' : 'Ingresar'}</Button>
              <Button type="button" variant="ghost" onClick={() => setStep('email')}>Volver</Button>
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
        const docRef = doc(db, "users", firebaseUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-900 font-medium italic">Abriendo el Manual...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
         <div className="max-w-2xl mx-auto px-6 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="bg-slate-900 text-white p-1 rounded-md"><Home size={16} /></div>
              <span className="font-bold tracking-tight text-sm">Panel de Mando</span>
            </div>
            <Button variant="ghost" className="w-auto px-2" onClick={() => signOut(auth)}><LogOut size={18} /></Button>
         </div>
      </nav>

      <main className="p-6 max-w-2xl mx-auto">
        {view !== 'dashboard' && (
          <Button variant="ghost" onClick={() => setView('dashboard')} className="w-auto pl-0 mb-6 text-slate-400">
            <ChevronDown className="rotate-90 mr-1" size={16} /> Volver
          </Button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'sos' && <SOSTool />}
        {view === 'scripts' && <ScriptsTool />}
        {view === 'redzones' && <RedZonesTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
        {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
      </main>
    </div>
  );
};

export default App;

