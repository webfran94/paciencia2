import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Users, Plus, Save, Trash2, 
  ChevronDown, Play, Pause, X, CheckCircle, AlertCircle, Wind, 
  Shield, Heart, Smile, Zap, Lock, Star, LogOut 
} from 'lucide-react';

// --- CONEXIÓN REAL A FIREBASE ---
import { auth, db } from './firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
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

// --- PANTALLA DE LOGIN CON ACTIVACIÓN AUTOMÁTICA ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsActivation, setNeedsActivation] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (needsActivation) {
        // 1. Crear el acceso en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Buscar el documento que creó Make.com por correo
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Si Make ya creó el usuario, actualizamos ese documento con el nuevo UID de Auth
          const existingDoc = querySnapshot.docs[0];
          const existingData = existingDoc.data();
          
          // Creamos el nuevo documento con el UID oficial para que la App lo encuentre siempre
          await setDoc(doc(db, "users", user.uid), {
            ...existingData,
            authLinked: true
          });
        }
      } else {
        // Intento de Login normal
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Error code:", err.code);
      
      // SI EL USUARIO NO EXISTE EN AUTH, REVISAMOS SI EXISTE EN LA BASE DE DATOS (HOTMART/MAKE)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // El usuario COMPRÓ (está en Firestore) pero no tiene contraseña (no está en Auth)
          setNeedsActivation(true);
          setError('¡Compra detectada! Crea una contraseña para activar tu acceso.');
        } else {
          setError('No encontramos ninguna compra con este correo.');
        }
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else {
        setError('Error al ingresar. Revisa tus datos.');
      }
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
          <p className="text-gray-500 text-sm">
            {needsActivation ? 'Configura tu acceso' : 'Ingresa a tu área de miembros'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className={`p-3 rounded-lg text-sm text-center border ${needsActivation ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de compra</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setNeedsActivation(false); // Resetear si cambia el correo
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {needsActivation ? 'Crea tu contraseña' : 'Contraseña'}
            </label>
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
            className={`w-full py-3 rounded-lg font-bold transition text-white ${needsActivation ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? 'Cargando...' : (needsActivation ? 'Activar mi acceso' : 'Ingresar')}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- RESTO DE COMPONENTES (IGUAL QUE TU ORIGINAL) ---
const ReflectionTool = ({ userId, userData, updateUserData }) => {
  const [entries, setEntries] = useState(userData?.reflections || []);
  const [newEntry, setNewEntry] = useState({ trigger: '', intensity: 5, notes: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newEntry.trigger) return;
    const entry = { ...newEntry, id: Date.now(), date: new Date().toLocaleDateString() };
    const updatedEntries = [entry, ...entries];
    try {
      await updateDoc(doc(db, "users", userId), { reflections: updatedEntries });
      setEntries(updatedEntries);
      updateUserData({ ...userData, reflections: updatedEntries });
      setNewEntry({ trigger: '', intensity: 5, notes: '' });
      setIsAdding(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Activity className="text-green-600"/> Detector</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border mb-8">
          <label className="block text-sm font-medium mb-1">Detonante</label>
          <select className="w-full p-3 border rounded-lg mb-4" value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
            <option value="">Selecciona...</option>
            <option value="Ruido">Ruido / Caos</option>
            <option value="Desobediencia">Me ignoraron</option>
          </select>
          <button onClick={handleAdd} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">Guardar</button>
        </div>
      )}
      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between">
            <div><span className="font-bold">{entry.trigger}</span> - <span className="text-xs">{entry.date}</span></div>
            <Trash2 size={18} className="text-gray-300 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Componentes simples (Stress, Communication, Stories, etc.)
const StressTool = () => (
  <div className="text-center py-10">
    <h2 className="text-2xl font-bold mb-2 flex justify-center gap-2"><Wind className="text-purple-500"/> Pausa Biológica</h2>
    <p className="text-gray-600 mb-8">Inhala 4s, Retén 4s, Exhala 4s.</p>
  </div>
);

const CommunicationTool = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MessageCircle className="text-blue-500"/> Scripts</h2>
    {SCRIPTS_DATA.map(s => (
      <div key={s.id} className="bg-white p-4 rounded-lg border mb-3">
        <p className="font-bold">{s.title}</p>
        <p className="text-sm text-green-600 mt-2">Dí: {s.doSay}</p>
      </div>
    ))}
  </div>
);

const StoriesTool = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="text-yellow-600"/> Casos</h2>
    {STORIES_DATA.map(s => <div key={s.id} className="bg-white p-4 border rounded-lg mb-4"><strong>{s.title}</strong><p className="text-sm">{s.content}</p></div>)}
  </div>
);

const AntiRelapseTool = () => <div className="text-center p-10 bg-blue-50 rounded-xl"><h3>Plan Anti-Recaída</h3></div>;
const DialogueTool = () => <div className="text-center p-10 bg-purple-50 rounded-xl"><h3>Diálogo Abierto</h3></div>;
const EmpathyTool = () => <div className="text-center p-10 bg-red-50 rounded-xl"><h3>Checklist de Empatía</h3></div>;
const SelfCareTool = () => <div className="text-center p-10 bg-yellow-50 rounded-xl"><h3>Autocuidado</h3></div>;
const ConfidenceTool = () => <div className="text-center p-10 bg-orange-50 rounded-xl"><h3>Diario de Logros</h3></div>;

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.name || 'Papá/Mamá'}</h1>
    <div className="grid md:grid-cols-2 gap-4 mt-8">
      <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl border hover:border-green-300 text-left">
        <Activity className="text-green-600 mb-2"/><strong>Detector</strong>
      </button>
      <button onClick={() => changeView('stress')} className="bg-white p-6 rounded-xl border hover:border-purple-300 text-left">
        <Wind className="text-purple-600 mb-2"/><strong>Pausa</strong>
      </button>
    </div>
    
    <h3 className="text-xs font-bold text-gray-400 uppercase mt-8 mb-4">Pack Premium</h3>
    <div className="grid md:grid-cols-3 gap-4">
      {userData?.isPremium ? (
        <>
          <button onClick={() => changeView('antirelapse')} className="bg-white p-4 rounded-xl border"><Shield className="mx-auto text-blue-600"/>Anti-Recaída</button>
          <button onClick={() => changeView('dialogue')} className="bg-white p-4 rounded-xl border"><MessageCircle className="mx-auto text-purple-600"/>Diálogo</button>
          <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border"><Heart className="mx-auto text-red-500"/>Empatía</button>
        </>
      ) : (
        <div className="col-span-3 bg-gray-50 p-6 rounded-xl border border-dashed text-center">
          <Lock className="mx-auto text-gray-400 mb-2"/><p>Herramientas Premium Bloqueadas</p>
        </div>
      )}
    </div>
  </div>
);

// --- APP PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Si no existe por UID, lo buscamos por correo (por si Make lo creó con ID de correo)
          const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setUserData(querySnapshot.docs[0].data());
          }
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1 rounded"><Home size={18} /></div>
          <span className="font-bold">Manual Paciencia</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500"><LogOut size={20}/></button>
      </nav>

      <main className="p-4 md:p-8">
        {view !== 'dashboard' && <button onClick={() => setView('dashboard')} className="mb-4 text-sm text-gray-500">← Volver</button>}
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
        {view === 'stress' && <StressTool />}
        {view === 'communication' && <CommunicationTool />}
        {view === 'stories' && <StoriesTool />}
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



