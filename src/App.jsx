import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Plus, Trash2, 
  ChevronDown, X, Wind, Shield, Heart, Smile, Zap, Lock, LogOut,
  Flame, LayoutGrid, CheckCircle2, AlertTriangle, Map, Clock, 
  VolumeX, Headphones, Save
} from 'lucide-react';

// --- CONEXIÓN A FIREBASE ---
import { auth, db } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, getDoc, updateDoc
} from 'firebase/firestore';

// --- COMPONENTES UI BASE ---
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
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full";
  const variants = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    orange: "bg-orange-600 text-white hover:bg-orange-700",
    outline: "border border-slate-200 bg-white hover:bg-slate-100",
    ghost: "hover:bg-slate-100 text-slate-600",
    link: "text-slate-900 underline-offset-4 hover:underline"
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50",
    premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
  };
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${variants[variant]}`}>{children}</div>
};

// --- COMPONENTE DE BLOQUEO PREMIUM ---
const PremiumGate = ({ esPremium, children }) => {
  if (esPremium) return children;
  return (
    <div className="relative group">
      <div className="filter blur-[2px] pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center rounded-xl border-2 border-dashed border-slate-200">
        <Lock className="w-8 h-8 text-slate-400 mb-2" />
        <h4 className="font-bold text-slate-900">Herramienta Premium</h4>
        <p className="text-xs text-slate-500 mb-4 max-w-[200px]">Desbloquea el kit completo para acceder a esta función.</p>
        <Button variant="orange" className="h-8 text-xs w-auto px-4">Quiero ser Premium</Button>
      </div>
    </div>
  );
};

// --- 1. MAPA DE ZONAS ROJAS ---
const RedZonesTool = ({ userData, onSave }) => {
  const [level, setLevel] = useState(userData?.paz_mental_data?.red_zone || 50);
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <header className="text-center">
        <h2 className="text-2xl font-bold">Mapa de Zonas Rojas</h2>
        <p className="text-slate-500">Mide tu "tanque de paciencia" actual</p>
      </header>
      <Card className="p-8">
        <div className="space-y-8">
          <div className={`h-4 w-full rounded-full transition-colors duration-500 ${level > 70 ? 'bg-red-500' : level > 40 ? 'bg-orange-400' : 'bg-green-500'}`} />
          <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600" 
            value={level} onChange={(e) => setLevel(e.target.value)} />
          <div className="text-center">
            <span className="text-4xl font-black">{level}%</span>
            <p className="font-bold mt-2 uppercase tracking-widest text-sm">
              {level > 70 ? '⚠️ ZONA CRÍTICA: Aléjate ahora' : level > 40 ? '⚡ PRECAUCIÓN: Carga mental alta' : '✅ ESTADO SEGURO: Estás en calma'}
            </p>
          </div>
          <Button onClick={() => onSave({ red_zone: level })} variant="orange">Guardar Estado</Button>
        </div>
      </Card>
    </div>
  );
};

// --- 2. BOTÓN SOS (EL INTERCEPTOR) ---
const SOSTool = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { t: "¡ALTO! Detente justo donde estás.", i: <Wind className="w-12 h-12 text-orange-500" /> },
    { t: "Inhala profundamente por la nariz...", i: <Activity className="w-12 h-12 text-blue-500" /> },
    { t: "Exhala lentamente por la boca.", i: <Wind className="w-12 h-12 text-blue-400" /> },
    { t: "Repite: 'Esto no es una emergencia, es un niño aprendiendo'.", i: <Heart className="w-12 h-12 text-red-500" /> }
  ];

  return (
    <Card className="max-w-md mx-auto p-12 text-center border-orange-500 border-2 shadow-xl shadow-orange-100">
      <div className="flex flex-col items-center space-y-6">
        <div className="animate-pulse">{steps[step].i}</div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">{steps[step].t}</h2>
        <div className="flex gap-2 w-full">
           {step < steps.length - 1 ? (
             <Button onClick={() => setStep(step + 1)} variant="orange">Siguiente Paso</Button>
           ) : (
             <Button onClick={() => setStep(0)} variant="outline">Reiniciar Interceptor</Button>
           )}
        </div>
      </div>
    </Card>
  );
};

// --- 3. SCRIPTS DE MANDO SERENO ---
const ScriptsTool = () => (
  <div className="space-y-4 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">Scripts de Mando Sereno</h2>
    {[
      { title: "Cuando no recogen los juguetes", do: "Veo que hay bloques en el suelo. ¿Prefieres guardarlos ahora o después de cenar?", dont: "¡Siempre dejas todo tirado, parece un basurero!" },
      { title: "Cuando hay un berrinche", do: "Estás muy enojado porque querías ese dulce. Estoy aquí contigo hasta que te sientas mejor.", dont: "¡Cállate ya! ¡Me das vergüenza en la calle!" }
    ].map((s, i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-3"><CardTitle className="text-sm">{s.title}</CardTitle></CardHeader>
        <CardContent className="pt-4 space-y-3">
          <p className="text-xs text-red-500 font-bold">❌ NO DIGAS: <span className="font-normal italic text-slate-600">"{s.dont}"</span></p>
          <p className="text-xs text-green-600 font-bold">✅ DI: <span className="font-normal text-slate-800">"{s.do}"</span></p>
        </CardContent>
      </Card>
    ))}
  </div>
);

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => {
  const esPremium = userData?.status === 'comprador_premium';

  const tools = [
    { id: 'redzones', title: 'Mapa de Zonas Rojas', desc: 'Identifica tu nivel de paciencia.', icon: <Map className="text-orange-500" />, premium: false },
    { id: 'sos', title: 'Botón SOS Interceptor', desc: 'Freno de emergencia de 30 seg.', icon: <Zap className="text-amber-500" />, premium: false },
    { id: 'scripts', title: 'Scripts de Mando', desc: 'Palabras exactas para conectar.', icon: <MessageCircle className="text-blue-500" />, premium: false },
    { id: 'redemption', title: 'Diario de Redención', desc: 'Elimina la culpa nocturna.', icon: <BookOpen className="text-purple-500" />, premium: false },
    { id: 'postgrito', title: 'Auxilio Post-Grito', desc: 'Cómo reparar el vínculo.', icon: <Heart className="text-red-500" />, premium: true },
    { id: 'sensorial', title: 'Silencio Sensorial', desc: 'Baja el ruido mental.', icon: <VolumeX className="text-slate-500" />, premium: true },
    { id: 'p18', title: 'Protocolo 18:00', desc: 'Sobrevive a la hora crítica.', icon: <Clock className="text-emerald-500" />, premium: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="text-center md:text-left space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Hola, {userData?.first_name || 'Papá/Mamá'}.</h1>
        <p className="text-slate-500 italic">"Detén el grito antes de que salga de tu boca."</p>
      </section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div key={tool.id}>
            {tool.premium ? (
              <PremiumGate esPremium={esPremium}>
                <Card onClick={() => changeView(tool.id)}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold">{tool.title}</CardTitle>
                    {tool.icon}
                  </CardHeader>
                  <CardContent><p className="text-xs text-slate-500">{tool.desc}</p></CardContent>
                </Card>
              </PremiumGate>
            ) : (
              <Card onClick={() => changeView(tool.id)} className="hover:border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold">{tool.title}</CardTitle>
                  {tool.icon}
                </CardHeader>
                <CardContent><p className="text-xs text-slate-500">{tool.desc}</p></CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>

      {!esPremium && (
        <Card className="bg-orange-50 border-orange-200 p-6 text-center">
          <h3 className="font-bold text-orange-900 mb-2">¿Quieres desbloquear las herramientas Premium?</h3>
          <p className="text-sm text-orange-700 mb-4">Accede al Plan Anti-Recaída, Protocolo 18:00 y más por solo $7 USD.</p>
          <Button variant="orange" className="w-auto px-8">ACTUALIZAR MI CUENTA</Button>
        </Card>
      )}
    </div>
  );
};

// --- APP PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const snap = await getDoc(doc(db, "users", u.email));
        if (snap.exists()) setUserData(snap.data());
      } else { setUser(null); setUserData(null); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveProgress = async (newData) => {
    try {
      const docRef = doc(db, "users", user.email);
      const updated = { ...userData?.paz_mental_data, ...newData };
      await updateDoc(docRef, { paz_mental_data: updated });
      setUserData({ ...userData, paz_mental_data: updated });
      alert("¡Progreso guardado!");
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Cargando Manual...</div>;
  if (!user) return <LoginScreen />; // Importada o definida arriba (mantén tu LoginScreen)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <nav className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-50 justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <Shield className="text-orange-600" size={20} />
          <span className="font-black tracking-tighter uppercase text-sm text-slate-900">Recupera el Mando</span>
        </div>
        <Button variant="ghost" className="w-auto" onClick={() => signOut(auth)}><LogOut size={18}/></Button>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {view !== 'dashboard' && (
          <Button variant="ghost" onClick={() => setView('dashboard')} className="w-auto mb-6 pl-0"><ChevronDown className="rotate-90 mr-1" size={16} /> Volver</Button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'redzones' && <RedZonesTool userData={userData} onSave={saveProgress} />}
        {view === 'sos' && <SOSTool />}
        {view === 'scripts' && <ScriptsTool />}
        {/* Aquí puedes mapear las demás vistas igual que estas */}
      </main>
    </div>
  );
};

// Nota: He omitido LoginScreen por espacio, pero mantén la que ya tenías en tu código original.
export default App;
