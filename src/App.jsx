import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { 
  Home, BookOpen, Activity, MessageCircle, Users, Plus, Save, Trash2, 
  ChevronDown, Play, Pause, X, CheckCircle, AlertCircle, Wind, 
  Shield, Heart, Smile, Zap, Lock, Star, LogOut, Loader2
} from 'lucide-react';

// --- PANTALLA DE LOGIN (SEGURIDAD ESTRICTA) ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const emailKey = email.toLowerCase().trim();

    try {
      // 1. FILTRO DE SEGURIDAD: VERIFICAR COMPRA
      const userRef = doc(db, "users", emailKey);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("ACCESO DENEGADO: No encontramos una compra activa con este email. Verifica que sea el mismo que usaste en Hotmart.");
      }

      // 2. SI EXISTE LA COMPRA, PROCEDEMOS
      try {
        await signInWithEmailAndPassword(auth, emailKey, password);
      } catch (authError) {
        if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
             await createUserWithEmailAndPassword(auth, emailKey, password);
        } else if (authError.code === 'auth/wrong-password') {
             throw new Error("La contraseña es incorrecta.");
        } else {
             throw authError;
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error de acceso.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-600">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Home size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manual de la Paciencia</h1>
          <p className="text-gray-500 text-sm">Acceso Exclusivo para Clientes</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Compra</label>
            <input type="email" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" required placeholder="Ingresa tu contraseña" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 flex items-start gap-2"><AlertCircle size={16} className="mt-0.5 shrink-0"/> {error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex justify-center shadow-lg">
            {loading ? <Loader2 className="animate-spin" /> : 'Ingresar'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
          * Si es tu primera vez, ingresa el email de tu compra y crea una contraseña nueva.
        </p>
      </div>
    </div>
  );
};

// --- PANTALLA PRINCIPAL (DASHBOARD) ---
const Dashboard = ({ changeView, userData }) => {
  const isPremium = userData?.isPremium === true; 

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Hola, {userData?.name || 'Papá/Mamá'}</h1>
        <p className="text-gray-500">Vamos a transformar ese estrés en calma.</p>
        {!isPremium && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 flex items-center gap-2">
                <Lock size={16}/> Estás en el plan Básico. <span className="font-bold">Adquiere el Pack Premium</span> para desbloquear todo.
            </div>
        )}
      </header>

      {/* Herramientas Básicas */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 text-left transition hover:shadow-md group">
          <Activity className="text-green-600 mb-3 group-hover:scale-110 transition h-8 w-8"/>
          <h3 className="font-bold text-gray-900">Detector de Detonantes</h3>
          <p className="text-sm text-gray-500">Rastrea tu ira</p>
        </button>
        <button onClick={() => changeView('stress')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-300 text-left transition hover:shadow-md group">
          <Wind className="text-purple-600 mb-3 group-hover:scale-110 transition h-8 w-8"/>
          <h3 className="font-bold text-gray-900">Botón de Pausa</h3>
          <p className="text-sm text-gray-500">Calma en 60s</p>
        </button>
        <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 text-left transition hover:shadow-md group">
          <MessageCircle className="text-blue-600 mb-3 group-hover:scale-110 transition h-8 w-8"/>
          <h3 className="font-bold text-gray-900">Scripts</h3>
          <p className="text-sm text-gray-500">Qué decir exactamente</p>
        </button>
        <button onClick={() => changeView('stories')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-yellow-300 text-left transition hover:shadow-md group">
          <BookOpen className="text-yellow-600 mb-3 group-hover:scale-110 transition h-8 w-8"/>
          <h3 className="font-bold text-gray-900">Casos Reales</h3>
          <p className="text-sm text-gray-500">Inspiración</p>
        </button>
      </div>

      {/* Herramientas Premium */}
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {isPremium ? (
          <>
            <button onClick={() => changeView('antirelapse')} className="bg-white p-4 rounded-xl border border-blue-100 text-center hover:shadow-md transition"><Shield className="mx-auto text-blue-600 mb-2 h-6 w-6"/><span className="font-bold text-sm text-gray-800 block">Anti-Recaída</span></button>
            <button onClick={() => changeView('dialogue')} className="bg-white p-4 rounded-xl border border-purple-100 text-center hover:shadow-md transition"><MessageCircle className="mx-auto text-purple-600 mb-2 h-6 w-6"/><span className="font-bold text-sm text-gray-800 block">Diálogo</span></button>
            <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center hover:shadow-md transition"><Heart className="mx-auto text-red-500 mb-2 h-6 w-6"/><span className="font-bold text-sm text-gray-800 block">Empatía</span></button>
            <button onClick={() => changeView('selfcare')} className="bg-white p-4 rounded-xl border border-yellow-100 text-center hover:shadow-md transition"><Smile className="mx-auto text-yellow-500 mb-2 h-6 w-6"/><span className="font-bold text-sm text-gray-800 block">Autocuidado</span></button>
            <button onClick={() => changeView('confidence')} className="bg-white p-4 rounded-xl border border-orange-100 text-center hover:shadow-md transition"><Star className="mx-auto text-orange-500 mb-2 h-6 w-6"/><span className="font-bold text-sm text-gray-800 block">Confianza</span></button>
          </>
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300 text-center">
            <Lock className="mx-auto text-gray-400 mb-2 h-8 w-8" />
            <p className="text-gray-500 font-medium mb-4">Contenido Exclusivo Premium</p>
            <a href="https://pay.hotmart.com/TU_LINK_DEL_UPSELL" target="_blank" rel="noreferrer" className="inline-block bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition shadow-sm cursor-pointer">
              Desbloquear Pack por $19
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// --- HERRAMIENTAS ---

const ReflectionTool = ({ userEmail, userData }) => {
  const [entries, setEntries] = useState(userData?.reflections || []);
  const [newEntry, setNewEntry] = useState({ trigger: '', intensity: 5, notes: '' });

  const handleAdd = async () => {
    if (!newEntry.trigger) return;
    const entry = { ...newEntry, id: Date.now(), date: new Date().toLocaleDateString() };
    
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);

    try {
      const userRef = doc(db, "users", userEmail); 
      await updateDoc(userRef, { 
        reflections: arrayUnion(entry) 
      });
    } catch (e) { 
        console.error("Error guardando:", e);
        alert("Error al guardar. Verifica tu conexión.");
    }
    setNewEntry({ trigger: '', intensity: 5, notes: '' });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Activity className="text-green-600"/> Detector de Detonantes</h2>
      <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 mb-8">
        <select className="w-full p-3 border rounded-lg mb-4" value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
          <option value="">Selecciona detonante...</option>
          <option value="Ruido">Ruido / Caos</option>
          <option value="Desobediencia">Desobediencia</option>
          <option value="Cansancio">Cansancio</option>
          <option value="Falta de Respeto">Falta de Respeto</option>
        </select>
        <div className="mb-4">
            <label className="text-xs font-bold text-gray-500 uppercase">Intensidad: {newEntry.intensity}</label>
            <input type="range" min="1" max="10" className="w-full h-2 bg-gray-200 rounded-lg accent-green-600" value={newEntry.intensity} onChange={e => setNewEntry({...newEntry, intensity: parseInt(e.target.value)})} />
        </div>
        <textarea className="w-full p-3 border rounded-lg mb-4 bg-gray-50 h-24" placeholder="¿Qué sentiste en el cuerpo?" value={newEntry.notes} onChange={e => setNewEntry({...newEntry, notes: e.target.value})} />
        <button onClick={handleAdd} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">Guardar Registro</button>
      </div>
      <div className="space-y-3">
        {entries.map((e, i) => (
          <div key={i} className="bg-white p-4 rounded shadow-sm border border-gray-100 flex justify-between items-center">
             <div>
                <span className="font-bold text-gray-800">{e.trigger}</span> 
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 ml-2">Nivel {e.intensity}</span>
                <p className="text-sm text-gray-500 mt-1 italic">"{e.notes}"</p>
             </div>
             <span className="text-xs text-gray-400">{e.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ... (Resto de herramientas placeholders)

const StressTool = () => {
    const [active, setActive] = useState(false);
    const [text, setText] = useState("Listo");
    useEffect(() => { if(active) { setText("Inhala..."); setTimeout(() => setText("Retén..."), 4000); setTimeout(() => setText("Exhala..."), 8000); setTimeout(() => setActive(false), 12000); } else { setText("Listo"); } }, [active]);
    return (<div className="text-center py-10 max-w-md mx-auto"><h2 className="text-2xl font-bold mb-8 flex justify-center gap-2 items-center text-gray-800"><Wind className="text-purple-500"/> Pausa Biológica</h2><div className="w-64 h-64 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-8 relative"><div className={`absolute inset-0 bg-purple-200 rounded-full transition-transform duration-[4000ms] ${active ? 'scale-100' : 'scale-50'}`}></div><span className="relative z-10 text-3xl font-bold text-purple-800">{text}</span></div><button onClick={() => setActive(true)} className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg flex items-center gap-2 mx-auto">{active ? <Pause size={18}/> : <Play size={18}/>} {active ? 'Respirando...' : 'Iniciar Pausa'}</button></div>);
};

const CommunicationTool = () => {
    const [expandedId, setExpandedId] = useState(null);
    const scripts = [{id:1, t:"Cuando te ignora", d:"¡¿Estás sordo?!", s:"(Contacto visual) Veo que estás jugando..."}, {id:2, t:"Berrinche público", d:"¡Qué vergüenza!", s:"Entiendo que estés enojado..."}];
    return (<div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MessageCircle className="text-blue-500"/> Scripts</h2><div className="space-y-4">{scripts.map(s => (<div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"><button onClick={() => setExpandedId(expandedId === s.id ? null : s.id)} className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50"><span className="font-bold text-gray-800">{s.t}</span><ChevronDown/></button>{expandedId === s.id && (<div className="p-5 pt-0 border-t border-gray-100 bg-gray-50"><div className="grid md:grid-cols-2 gap-4 mt-4"><div className="bg-red-50 p-4 rounded-lg border border-red-100"><p className="text-xs font-bold text-red-700">EVITA DECIR:</p><p className="text-sm italic">"{s.d}"</p></div><div className="bg-green-50 p-4 rounded-lg border border-green-100"><p className="text-xs font-bold text-green-700">MEJOR DI:</p><p className="text-sm font-medium">"{s.s}"</p></div></div></div>)}</div>))}</div></div>);
};

const StoriesTool = () => (<div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><BookOpen className="text-yellow-600"/> Casos Reales</h2><div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"><h3 className="font-bold text-lg text-gray-900">De Gritos a Paz</h3><p className="text-xs font-bold text-yellow-600 uppercase mb-2">Carlos M.</p><p className="text-sm text-gray-600">El manual me enseñó a identificar la presión en el pecho...</p></div></div>);

// --- PREMIUM PLACEHOLDERS (Funcionales) ---
const AntiRelapseTool = () => (<div className="max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-gray-800 mb-6"><Shield className="inline mr-2 text-blue-600"/> Plan Anti-Recaída</h2><div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center mb-6"><p className="text-blue-800 font-bold mb-2">Si pasa esto: Tráfico</p><p className="text-green-700 font-bold">Haré: Respirar</p></div></div>);
const DialogueTool = () => (<div className="max-w-2xl mx-auto text-center py-10"><MessageCircle className="mx-auto h-12 w-12 text-purple-600 mb-4"/><h2 className="text-2xl font-bold">Diálogo Abierto</h2></div>);
const EmpathyTool = () => (<div className="max-w-2xl mx-auto text-center py-10"><Heart className="mx-auto h-12 w-12 text-red-500 mb-4"/><h2 className="text-2xl font-bold">Empatía</h2></div>);
const SelfCareTool = () => (<div className="max-w-2xl mx-auto text-center py-10"><Smile className="mx-auto h-12 w-12 text-yellow-500 mb-4"/><h2 className="text-2xl font-bold">Autocuidado</h2></div>);
const ConfidenceTool = () => (<div className="max-w-2xl mx-auto text-center py-10"><Star className="mx-auto h-12 w-12 text-orange-500 mb-4"/><h2 className="text-2xl font-bold">Confianza</h2></div>);

// --- APP PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Escuchamos en tiempo real los cambios del documento del usuario (por email)
        const emailKey = currentUser.email.toLowerCase();
        const userRef = doc(db, "users", emailKey);

        const unsubDoc = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                // SEGURIDAD ADICIONAL: Si no hay documento, cerrar sesión forzada
                setUserData(null);
                signOut(auth);
            }
            setLoading(false);
        });

        return () => unsubDoc(); 
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setUserData(null);
    setView('dashboard');
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-green-600 font-bold"><Loader2 className="animate-spin mr-2"/> Cargando...</div>;
  
  if (!user) return <LoginScreen />;

  // Doble seguridad visual
  if (user && !userData) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4 text-center">
          <AlertCircle size={48} className="text-red-500 mb-4"/>
          <h2 className="text-xl font-bold text-gray-800">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">No encontramos una compra activa.</p>
          <button onClick={handleLogout} className="text-blue-600 hover:underline">Cerrar Sesión</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1.5 rounded"><Home size={18} /></div>
          <span className="font-bold tracking-tight">Manual Paciencia</span>
        </div>
        <div className="flex items-center gap-3">
             <span className="text-xs text-gray-400 hidden md:block">{user.email}</span>
             <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100" title="Cerrar Sesión">
               <LogOut size={20}/>
             </button>
        </div>
      </nav>

      <main className="p-4 md:p-8 animate-fade-in">
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-sm text-gray-500 hover:text-green-600 transition font-medium">
            <ChevronDown className="rotate-90 mr-1" size={16} /> Volver
          </button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        
        {/* Pasamos el email normalizado como ID para guardar los datos */}
        {view === 'reflection' && <ReflectionTool userEmail={user.email.toLowerCase()} userData={userData} />}
        
        {view === 'stress' && <StressTool />}
        {view === 'communication' && <CommunicationTool />}
        {view === 'stories' && <StoriesTool />}
        
        {/* Herramientas Premium */}
        {view === 'antirelapse' && <AntiRelapseTool />}
        {view === 'dialogue' && <DialogueTool />}
        {view === 'empathy' && <EmpathyTool />}
        {view === 'selfcare' && <SelfCareTool />}
        {view === 'confidence' && <ConfidenceTool />}
      </main>
    </div>
  );
};

export default App;
