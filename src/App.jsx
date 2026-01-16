import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Plus, Trash2, 
  ChevronDown, Play, Pause, X, CheckCircle, Wind, 
  Shield, Heart, Smile, Zap, Lock, Star, LogOut 
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
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc,
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
  }
];

const STORIES_DATA = [
  {
    id: 1,
    title: "De Gritos Diarios a Conexión Real",
    author: "Carlos M., Padre de 2",
    content: "Pensé que era mi carácter. 'Soy explosivo', me decía. Hasta que entendí que mi ira era solo miedo a perder el control. El Manual me enseñó a identificar esa 'presión en el pecho' antes de que subiera a mi garganta."
  }
];

const EMPATHY_CHECKLIST = [
  { id: 1, text: "Me bajé a su altura visual antes de hablar." },
  { id: 2, text: "Validé su emoción antes de corregir." },
  { id: 3, text: "Escuché su versión sin interrumpir." },
  { id: 4, text: "No usé etiquetas." },
  { id: 5, text: "Ofrecí un abrazo." }
];

// --- PANTALLA DE LOGIN ---
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
    setMessage('');

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
    } catch (err) {
      setError('Error de conexión con la base de datos.');
    } finally {
      setLoading(false);
    }
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
        const docSnap = await getDoc(docRef);
        
        await setDoc(doc(db, "users", user.uid), {
          ...docSnap.data(),
          uid: user.uid,
          authLinked: true
        });
        await deleteDoc(docRef);
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) {
      if (err.message === 'short') setError('La contraseña debe tener 6 caracteres o más.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta.');
      } else {
        setError('No se pudo iniciar sesión. Revisa tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setMessage('Enlace enviado. Revisa tu bandeja de entrada.');
      setError('');
    } catch (err) {
      setError('No pudimos enviar el correo de recuperación.');
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
        </div>

        {step === 'email' ? (
          <form onSubmit={verifyEmail} className="space-y-4">
            {error && <div className="p-3 rounded-lg text-sm text-center bg-red-50 text-red-600 border border-red-100">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de compra</label>
              <input type="email" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 rounded-lg font-bold text-white hover:bg-green-700 transition">
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {error && <div className="p-3 rounded-lg text-sm text-center bg-red-50 text-red-600 border border-red-100">{error}</div>}
            {message && <div className="p-3 rounded-lg text-sm text-center bg-green-50 text-green-700 border border-green-100">{message}</div>}
            <div className="text-xs text-gray-500 text-center mb-2 font-medium">Acceso para: {cleanEmail}</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isNewUser ? 'Crea una contraseña' : 'Contraseña'}</label>
              <input type="password" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white transition ${isNewUser ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
              {loading ? 'Procesando...' : (isNewUser ? 'Activar Acceso' : 'Entrar')}
            </button>
            {!isNewUser && (
              <button type="button" onClick={handleResetPassword} className="w-full text-xs text-blue-600 hover:underline mt-2">¿Olvidaste tu contraseña?</button>
            )}
            <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-gray-400 mt-4">Usar otro correo</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTES DE HERRAMIENTAS ---
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
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Activity className="text-green-600"/> Detector</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">{isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancelar' : 'Nuevo'}</button>
      </div>
      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Detonante</label>
          <select className="w-full p-3 border rounded-lg mb-4 bg-gray-50" value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
            <option value="">Selecciona...</option>
            <option value="Ruido">Ruido / Caos</option>
            <option value="Desobediencia">Me ignoraron</option>
            <option value="Cansancio">Mi cansancio</option>
          </select>
          <button onClick={handleAdd} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold">Guardar</button>
        </div>
      )}
      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div><span className="font-bold text-gray-800">{entry.trigger}</span><p className="text-xs text-gray-500">{entry.date}</p></div>
            <Trash2 size={18} className="text-gray-300 hover:text-red-500 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => {
  const tieneAccesoBasico = !!userData; // Si existe en DB, tiene acceso básico
  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.first_name || 'Papá/Mamá'}</h1>
      <p className="text-gray-500 mb-8">Tus herramientas para hoy.</p>
      
      {tieneAccesoBasico ? (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-green-300 transition">
            <Activity className="text-green-600 mb-3"/><h3 className="font-bold">Detector de Detonantes</h3>
          </button>
          <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-blue-300 transition">
            <MessageCircle className="text-blue-600 mb-3"/><h3 className="font-bold">Scripts</h3>
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-10 rounded-xl border border-dashed text-center mb-8"><Lock className="mx-auto mb-2"/><p>Acceso Protegido</p></div>
      )}

      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {esPremium ? (
          <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center"><Heart className="mx-auto text-red-500 mb-2"/><span className="font-bold text-sm">Empatía</span></button>
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-xl border border-dashed text-center"><Lock className="mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-500">Herramientas Premium Bloqueadas</p></div>
        )}
      </div>
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
        else {
          const q = query(collection(db, "users"), where("email", "==", firebaseUser.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) setUserData(querySnapshot.docs[0].data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-green-600 font-bold">Cargando...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1.5 rounded"><Home size={18} /></div>
          <span className="font-bold">Manual Paciencia</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-red-500 p-2"><LogOut size={20}/></button>
      </nav>
      <main className="p-4 md:p-8">
        {view !== 'dashboard' && <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-sm text-gray-500 hover:text-green-600 font-medium"><ChevronDown className="rotate-90 mr-1" size={16} /> Volver</button>}
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
      </main>
    </div>
  );
};

export default App;
