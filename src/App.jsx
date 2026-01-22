



import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Plus, Trash2, 
  ChevronDown, X, Wind, Shield, Heart, Smile, Zap, Lock, LogOut,
  Flame, LayoutGrid, CheckCircle2, AlertTriangle
} from 'lucide-react';

// --- CONEXIÓN REAL A FIREBASE (TU LÓGICA INTACTA) ---
import { auth, db } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, updateDoc,
  collection, query, where, getDocs, deleteDoc
} from 'firebase/firestore';

// --- COMPONENTES UI ESTILO "CIERRA CICLOS" (VISUAL ONLY) ---
// Estos componentes simulan la estética de Shadcn/UI de tu plantilla sin necesitar librerías extra.

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`rounded-xl border bg-white text-slate-950 shadow-sm transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''} ${className}`}>
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
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full";
  const variants = {
    primary: "bg-slate-900 text-slate-50 hover:bg-slate-900/90",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
    link: "text-slate-900 underline-offset-4 hover:underline"
  };
  return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Input = (props) => (
  <input {...props} className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50",
    outline: "text-slate-950 border border-slate-200",
    premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
  };
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variants[variant]}`}>{children}</div>
};

// --- DATA ESTÁTICA (CONSERVADA) ---
const SCRIPTS_DATA = [
  {
    id: 1,
    category: "Desobediencia",
    title: "Cuando te ignora por completo",
    trigger: "Le has pedido 3 veces que se ponga los zapatos y sigue jugando.",
    dontSay: "¡¿Estás sordo?! ¡Siempre tengo que gritar para que me hagas caso!",
    doSay: "(Baja a su nivel visual, toca su hombro): 'Veo que estás muy divertido jugando. Es hora de ponerse los zapatos. ¿Quieres ponerte el izquierdo o el derecho primero?'",
    why: "Gritar activa su defensa. Dar opciones limitadas devuelve el control y fomenta la cooperación."
  }
];

const EMPATHY_CHECKLIST = [
  { id: 1, text: "Me bajé a su altura visual antes de hablar." },
  { id: 2, text: "Validé su emoción antes de corregir." },
  { id: 3, text: "Escuché su versión sin interrumpir." },
  { id: 4, text: "No usé etiquetas." },
  { id: 5, text: "Ofrecí un abrazo." }
];

// --- PANTALLA DE LOGIN (DISEÑO CIERRA CICLOS) ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
        if (password.length < 6) throw new Error('short');
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;
        const docRef = doc(db, "users", cleanEmail);
        await updateDoc(docRef, { uid: user.uid, authLinked: true });
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) {
      if (err.message === 'short') setError('Mínimo 6 caracteres.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setError('Contraseña incorrecta.');
      else setError('Error de acceso.');
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setMessage('Enlace enviado a tu email.');
    } catch (err) { setError('No se pudo enviar el correo.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md bg-white shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
             {/* Icono estilo Cierra Ciclos */}
            <Shield className="w-8 h-8 text-slate-900" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Manual de la Paciencia</CardTitle>
          <p className="text-sm text-slate-500">Tu centro de control emocional</p>
        </CardHeader>
        <CardContent>
          {step === 'email' ? (
            <form onSubmit={verifyEmail} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200 flex items-center gap-2"><AlertTriangle size={14}/>{error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email de compra</label>
                <Input type="email" placeholder="ejemplo@correo.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">{error}</div>}
              {message && <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">{message}</div>}
              
              <div className="flex items-center justify-center p-2 bg-slate-50 rounded-md mb-4 border border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Accediendo como: <span className="text-slate-900">{cleanEmail}</span></span>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  {isNewUser ? 'Crea una contraseña segura' : 'Ingresa tu contraseña'}
                </label>
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <Button type="submit" disabled={loading} variant={isNewUser ? "primary" : "primary"}>
                {loading ? 'Procesando...' : (isNewUser ? 'Activar Acceso' : 'Ingresar al Manual')}
              </Button>

              {!isNewUser && (
                <Button type="button" variant="link" onClick={handleReset} className="px-0 font-normal h-auto text-slate-500">
                  ¿Olvidaste tu contraseña?
                </Button>
              )}
              
              <Button type="button" variant="ghost" onClick={() => setStep('email')} className="mt-2 h-auto py-2 text-slate-400">
                ← Volver al email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- COMPONENTES INTERNOS (REFLECTION TOOL) ---
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
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Detector de Detonantes</h2>
          <p className="text-slate-500">Identifica y desactiva tus "Red Flags" antes de explotar.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} variant="outline" className="w-auto">
          {isAdding ? <X size={16} className="mr-2"/> : <Plus size={16} className="mr-2"/>}
          {isAdding ? 'Cancelar' : 'Nuevo Registro'}
        </Button>
      </div>

      {isAdding && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">¿Qué acaba de pasar?</label>
              <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" 
                value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
                <option value="">Selecciona un detonante...</option>
                <option value="Ruido">Ruido excesivo / Caos</option>
                <option value="Desobediencia">Me ignoraron repetidamente</option>
                <option value="Cansancio">Agotamiento propio</option>
                <option value="Falta de Respeto">Malas contestaciones</option>
              </select>
            </div>
            <Button onClick={handleAdd} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              Guardar en mi Bitácora
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {entries.map(entry => (
          <Card key={entry.id} className="overflow-hidden">
             <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                     {entry.intensity}
                   </div>
                   <div>
                     <p className="font-semibold text-slate-900">{entry.trigger}</p>
                     <p className="text-xs text-slate-500">{entry.date}</p>
                   </div>
                </div>
                <Button variant="ghost" className="w-auto px-2 text-slate-300 hover:text-red-500">
                  <Trash2 size={16} />
                </Button>
             </div>
          </Card>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
            No hay registros. ¡Empieza hoy a rastrear tu calma!
          </div>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD PRINCIPAL (DISEÑO CIERRA CICLOS) ---
const Dashboard = ({ changeView, userData }) => {
  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HERO SECTION (Saludo Personalizado) */}
      <section className="space-y-2 pt-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
          Hola, {userData?.first_name || 'Papá/Mamá'}.
        </h1>
        <p className="text-lg text-slate-500">
          Bienvenido a tu espacio seguro. Hoy vamos a elegir la calma.
        </p>
      </section>

      {/* 2. ESTADO ACTUAL (Estilo Cierra Ciclos Status Card) */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-slate-900 text-white border-slate-800">
          <CardContent className="pt-6 flex items-center justify-between">
             <div className="space-y-1">
               <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Estado de tu Cuenta</p>
               <div className="flex items-center gap-2">
                 <h2 className="text-2xl font-bold">{esPremium ? 'Acceso Total' : 'Plan Básico'}</h2>
                 {esPremium && <Badge variant="premium">PREMIUM</Badge>}
               </div>
               <p className="text-sm text-slate-400">
                 {esPremium ? 'Tienes todas las herramientas desbloqueadas.' : 'Mejora tu plan para herramientas avanzadas.'}
               </p>
             </div>
             <Shield className="h-16 w-16 text-slate-700 opacity-50" />
          </CardContent>
        </Card>

        {/* Pequeño Widget Motivacional */}
        <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <CardContent className="pt-6 flex flex-col justify-center h-full space-y-2">
             <div className="flex items-center gap-2 text-indigo-600 font-semibold">
               <Activity size={18} />
               <span>Tu Racha</span>
             </div>
             <p className="text-3xl font-bold text-slate-900">1 Día</p>
             <p className="text-xs text-slate-500">Sin gritos. ¡Sigue así!</p>
          </CardContent>
        </Card>
      </div>

      <div className="border-t border-slate-200 my-8"></div>

      {/* 3. GRID DE HERRAMIENTAS BÁSICAS (Estilo Cierra Ciclos Tools) */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <LayoutGrid size={18} /> Herramientas Esenciales
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* DETECTOR (Reflection) */}
          <Card 
            className="cursor-pointer group hover:border-orange-300 transition-all hover:shadow-md"
            onClick={() => changeView('reflection')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-slate-600 group-hover:text-orange-600 transition-colors">
                Detector de Detonantes
              </CardTitle>
              <Flame className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Mis Red Flags</div>
              <p className="text-xs text-slate-500 mt-1">
                Rastrea qué dispara tu ira antes de que ocurra.
              </p>
            </CardContent>
          </Card>

          {/* PAUSA (Stress) */}
          <Card 
            className="cursor-pointer group hover:border-purple-300 transition-all hover:shadow-md"
            onClick={() => changeView('stress')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-slate-600 group-hover:text-purple-600 transition-colors">
                Botón de Pausa
              </CardTitle>
              <Wind className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">SOS Calma</div>
              <p className="text-xs text-slate-500 mt-1">
                Técnica guiada de 60 segundos para bajar la presión.
              </p>
            </CardContent>
          </Card>

          {/* SCRIPTS (Communication) */}
          <Card 
            className="cursor-pointer group hover:border-blue-300 transition-all hover:shadow-md"
            onClick={() => changeView('communication')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                Scripts de Crianza
              </CardTitle>
              <MessageCircle className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¿Qué digo ahora?</div>
              <p className="text-xs text-slate-500 mt-1">
                Frases exactas para lograr cooperación sin gritar.
              </p>
            </CardContent>
          </Card>

           {/* HISTORIAS (Stories) */}
           <Card 
            className="cursor-pointer group hover:border-emerald-300 transition-all hover:shadow-md"
            onClick={() => changeView('stories')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium text-slate-600 group-hover:text-emerald-600 transition-colors">
                Casos Reales
              </CardTitle>
              <BookOpen className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">No estás solo</div>
              <p className="text-xs text-slate-500 mt-1">
                Historias de otros padres que lo lograron.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. SECCIÓN PREMIUM (Bloqueado/Desbloqueado) */}
      <section className="space-y-4 pb-12">
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <Zap size={18} className="text-amber-500" /> Herramientas Avanzadas
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {esPremium ? (
            <>
              <Card className="cursor-pointer hover:border-red-300 transition-colors" onClick={() => changeView('empathy')}>
                 <CardContent className="pt-6 text-center space-y-2">
                    <Heart className="w-8 h-8 text-red-500 mx-auto" />
                    <h4 className="font-bold">Empatía Profunda</h4>
                 </CardContent>
              </Card>
               {/* Aquí puedes agregar más botones premium desbloqueados */}
               <Card className="cursor-pointer hover:border-blue-300 transition-colors" onClick={() => changeView('dialogue')}>
                 <CardContent className="pt-6 text-center space-y-2">
                    <MessageCircle className="w-8 h-8 text-blue-500 mx-auto" />
                    <h4 className="font-bold">Diálogo Abierto</h4>
                 </CardContent>
              </Card>
            </>
          ) : (
            <div className="md:col-span-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
               <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                 <Lock className="h-6 w-6 text-slate-400" />
               </div>
               <div>
                 <h4 className="font-semibold text-slate-900">Contenido Premium Bloqueado</h4>
                 <p className="text-sm text-slate-500 max-w-sm mx-auto">
                   Estas herramientas están reservadas para usuarios del Pack Premium. Adquiérelo para desbloquear el Plan Anti-Recaída y más.
                 </p>
               </div>
               <Button variant="outline" className="w-auto">Saber más</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// --- APP PRINCIPAL (LÓGICA INTACTA, SOLO LAYOUT) ---
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

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-900 font-medium">Cargando tu manual...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-950">
      {/* NAVBAR ESTILO APP MODERNA */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
         <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setView('dashboard')}>
              <div className="bg-slate-900 text-white p-1.5 rounded-md">
                <Home size={18} />
              </div>
              <span className="font-bold tracking-tight">Manual Paciencia</span>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-xs font-medium text-slate-500 hidden md:block">
                 {user.email}
               </span>
               <Button variant="ghost" className="w-auto px-2 text-slate-400 hover:text-red-500" onClick={handleLogout}>
                 <LogOut size={20} />
               </Button>
            </div>
         </div>
      </nav>

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        {view !== 'dashboard' && (
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setView('dashboard')} className="w-auto pl-0 text-slate-500 hover:text-slate-900">
              <ChevronDown className="rotate-90 mr-1" size={16} /> Volver al Dashboard
            </Button>
          </div>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
        {/* Aquí irían los otros componentes (Stress, Communication, etc.) tal cual están pero envueltos en el nuevo diseño */}
      </main>
    </div>
  );
};

export default App;
