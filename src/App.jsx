import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Users, Plus, Save, Trash2, 
  ChevronDown, Play, Pause, X, CheckCircle, AlertCircle, Wind, 
  Shield, Heart, Smile, Zap, Lock, Star, LogOut 
} from 'lucide-react';

// IMPORTACIONES REALES DE FIREBASE
import { auth, db } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

// --- DATA ESTÁTICA ---
const SCRIPTS_DATA = [
  {
    id: 1,
    category: "Desobediencia",
    title: "Cuando te ignora por completo",
    trigger: "Le has pedido 3 veces que se ponga los zapatos y sigue jugando.",
    dontSay: "¡¿Estás sordo?! ¡Siempre tengo que gritar para que me hagas caso!",
    doSay: "(Baja a su nivel visual, toca su hombro): 'Veo que estás muy divertido jugando. Es hora de ponerse los zapatos. ¿Quieres ponerte el izquierdo o el derecho primero?'",
    why: "Gritar activa su defensa. Dar opciones limitadas devuelve el control y fomenta la cooperación."
  },
  {
    id: 2,
    category: "Berrinche",
    title: "Gritos en lugar público",
    trigger: "Quiere un dulce en el supermercado y se tira al piso a llorar.",
    dontSay: "¡Levántate ahora mismo! ¡Qué vergüenza, todo el mundo te mira!",
    doSay: "(Mantén la calma, voz baja): 'Entiendo que estás enojado porque querías el dulce. Pero no podemos comprarlo hoy. Estoy aquí contigo hasta que se te pase.'",
    why: "Validar la emoción no significa ceder. Tu calma es su ancla en la tormenta emocional."
  }
];

const STORIES_DATA = [
  {
    id: 1,
    title: "De Gritos Diarios a Conexión Real",
    author: "Carlos M., Padre de 2",
    snippet: "Pensé que era mi carácter...",
    content: "Pensé que era mi carácter. 'Soy explosivo', me decía. Hasta que entendí que mi ira era solo miedo a perder el control. El Manual me enseñó a identificar esa 'presión en el pecho' antes de que subiera a mi garganta."
  }
];

const EMPATHY_CHECKLIST = [
  { id: 1, text: "Me bajé a su altura visual antes de hablar." },
  { id: 2, text: "Validé su emoción ('Veo que estás enojado') antes de corregir." },
  { id: 3, text: "Escuché su versión sin interrumpir." },
  { id: 4, text: "No usé etiquetas ('eres malo', 'eres flojo')." },
  { id: 5, text: "Ofrecí un abrazo al final para reconectar." }
];

// --- COMPONENTES AUXILIARES ---

// PANTALLA DE LOGIN (CORREGIDA)
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Error de login:", err.code);
      setError("Usuario o contraseña incorrectos. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Home size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manual de la Paciencia</h1>
          <p className="text-gray-500 text-sm">Ingresa a tu área de miembros</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// HERRAMIENTA DE REFLEXIÓN (CORREGIDA PARA FIRESTORE)
const ReflectionTool = ({ userId, userData, updateUserData }) => {
  const [entries, setEntries] = useState(userData?.reflections || []);
  const [newEntry, setNewEntry] = useState({ trigger: '', intensity: 5, notes: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newEntry.trigger) return;
    const entry = { ...newEntry, id: Date.now(), date: new Date().toLocaleDateString() };
    const updatedEntries = [entry, ...entries];
    
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { reflections: updatedEntries });
      setEntries(updatedEntries);
      updateUserData({ ...userData, reflections: updatedEntries });
      setNewEntry({ trigger: '', intensity: 5, notes: '' });
      setIsAdding(false);
    } catch (err) {
      console.error("Error al guardar reflexión:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1"><Activity className="text-green-600"/> Detector</h2>
          <p className="text-sm text-gray-600">Identifica qué dispara tu ira antes de explotar.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-green-700 transition">
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Detonante</label>
          <select className="w-full p-3 border rounded-lg mb-4 bg-gray-50" value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
            <option value="">Selecciona...</option>
            <option value="Ruido">Ruido / Caos</option>
            <option value="Desobediencia">Me ignoraron</option>
            <option value="Cansancio">Mi propio cansancio</option>
            <option value="Falta de Respeto">Grosería</option>
          </select>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Intensidad (1-10)</label>
          <input type="range" min="1" max="10" className="w-full h-2 bg-gray-200 rounded-lg mb-2 accent-green-600" value={newEntry.intensity} onChange={e => setNewEntry({...newEntry, intensity: parseInt(e.target.value)})} />
          <div className="text-right text-green-600 font-bold mb-4">{newEntry.intensity}</div>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea className="w-full p-3 border rounded-lg mb-4 bg-gray-50 h-20" placeholder="¿Qué sentiste en el cuerpo?" value={newEntry.notes} onChange={e => setNewEntry({...newEntry, notes: e.target.value})} />
          
          <button onClick={handleAdd} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">Guardar en Base de Datos</button>
        </div>
      )}

      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">{entry.trigger}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${entry.intensity > 7 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>Nivel {entry.intensity}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
              {entry.notes && <p className="text-sm text-gray-600 mt-2 italic">"{entry.notes}"</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- OTROS COMPONENTES (STRESS, COMMUNICATION, ETC.) SE MANTIENEN IGUAL ---
const StressTool = () => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("Listo");
  useEffect(() => {
    if(active) {
      setText("Inhala...");
      const t1 = setTimeout(() => setText("Retén..."), 4000);
      const t2 = setTimeout(() => setText("Exhala..."), 8000);
      const t3 = setTimeout(() => setActive(false), 12000); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else { setText("Listo"); }
  }, [active]);
  return (
    <div className="text-center max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-2 flex justify-center items-center gap-2"><Wind className="text-purple-500"/> Pausa Biológica</h2>
      <div className="w-64 h-64 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-8 relative">
        <div className={`absolute inset-0 bg-purple-200 rounded-full transition-transform duration-[4000ms] ${active ? 'scale-100' : 'scale-50'}`}></div>
        <span className="relative z-10 text-3xl font-bold text-purple-800">{text}</span>
      </div>
      <button onClick={() => setActive(true)} className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition">Iniciar Pausa</button>
    </div>
  );
};

const CommunicationTool = () => {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MessageCircle className="text-blue-500"/> Scripts</h2>
      <div className="space-y-4">
        {SCRIPTS_DATA.map(script => (
          <div key={script.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === script.id ? null : script.id)} className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50">
              <span className="font-bold text-gray-800">{script.title}</span>
              <ChevronDown className={`text-gray-400 transition-transform ${expandedId === script.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedId === script.id && (
              <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-xs font-bold text-red-700 mb-1">EVITA DECIR:</p>
                    <p className="text-sm text-gray-700 italic">"{script.dontSay}"</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs font-bold text-green-700 mb-1">MEJOR DI:</p>
                    <p className="text-sm text-gray-800 font-medium">"{script.doSay}"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// DASHBOARD
const Dashboard = ({ changeView, userData }) => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.name || 'Usuario'}</h1>
    <p className="text-gray-500 mb-8">Tus herramientas para hoy.</p>

    <div className="grid md:grid-cols-2 gap-4 mb-8">
      <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 text-left transition">
        <Activity className="text-green-600 mb-3"/>
        <h3 className="font-bold text-gray-900">Detector de Detonantes</h3>
        <p className="text-sm text-gray-500">Rastrea y anticipa tu ira</p>
      </button>
      <button onClick={() => changeView('stress')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-300 text-left transition">
        <Wind className="text-purple-600 mb-3"/>
        <h3 className="font-bold text-gray-900">Botón de Pausa</h3>
        <p className="text-sm text-gray-500">Calma en 60 segundos</p>
      </button>
      <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 text-left transition">
        <MessageCircle className="text-blue-600 mb-3"/>
        <h3 className="font-bold text-gray-900">Scripts</h3>
        <p className="text-sm text-gray-500">Qué decir exactamente</p>
      </button>
    </div>
  </div>
);

// --- APP PRINCIPAL (CORREGIDA) ---
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escucha el estado de autenticación real de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Cargar o crear documento en Firestore para el usuario
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Si el usuario es nuevo en la base de datos, crear su perfil inicial
          const initialData = { 
            name: firebaseUser.email.split('@')[0], 
            isPremium: true, 
            reflections: [] 
          };
          await setDoc(docRef, initialData);
          setUserData(initialData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('dashboard');
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  };

  const updateUserData = (newData) => {
    setUserData(newData);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-green-600 font-bold">Conectando con Firebase...</p>
      </div>
    </div>
  );

  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1.5 rounded"><Home size={18} /></div>
          <span className="font-bold tracking-tight">Manual Paciencia</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition p-2" title="Cerrar Sesión">
          <LogOut size={20}/>
        </button>
      </nav>

      <main className="p-4 md:p-8">
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-sm text-gray-500 hover:text-green-600 transition">
            <ChevronDown className="rotate-90 mr-1" size={16} /> Volver al Dashboard
          </button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={updateUserData} />}
        {view === 'stress' && <StressTool />}
        {view === 'communication' && <CommunicationTool />}
      </main>
    </div>
  );
};

export default App;

