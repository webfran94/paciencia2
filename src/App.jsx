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
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  deleteDoc
} from 'firebase/firestore';

// --- DATA ESTÁTICA (SCRIPTS, STORIES, ETC.) ---
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

// --- PANTALLA DE LOGIN ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); // 'email' o 'password'
  const [isNewUser, setIsNewUser] = useState(false);

  const cleanEmail = email.trim().toLowerCase();

  // PASO 1: VERIFICAR COMPRA EN FIRESTORE
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
        setError('No encontramos ninguna compra con este correo. Verifica tus datos.');
      }
    } catch (err) {
      setError('Error al consultar la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  // PASO 2: ACTIVAR O INGRESAR
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNewUser) {
        if (password.length < 6) throw new Error('short-password');
        
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;

        const docRef = doc(db, "users", cleanEmail);
        const docSnap = await getDoc(docRef);
        const dataFromMake = docSnap.data();

        await setDoc(doc(db, "users", user.uid), {
          ...dataFromMake,
          uid: user.uid,
          authLinked: true
        });
        await deleteDoc(docRef);
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) {
      if (err.message === 'short-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta.');
      } else {
        setError('Error de acceso. Intenta de nuevo.');
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
            {error && <div className={`p-3 rounded-lg text-sm text-center border ${isNewUser ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{error}</div>}
            <div className="text-xs text-gray-500 text-center mb-2">Acceso para: {cleanEmail}</div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{isNewUser ? 'Crea tu contraseña' : 'Contraseña'}</label>
              <input type="password" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} />
              {isNewUser && <p className="text-[10px] text-gray-400 mt-1">Usa al menos 6 caracteres.</p>}
            </div>
            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white transition ${isNewUser ? 'bg-blue-600' : 'bg-green-600'}`}>
              {loading ? 'Procesando...' : (isNewUser ? 'Activar Acceso' : 'Entrar')}
            </button>
            <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-gray-400 mt-2">Usar otro correo</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => {
  // SIMPLIFICACIÓN: Si existe el documento en Firestore, tiene acceso básico
  const tieneAccesoBasico = !!userData; 
  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.first_name || 'Papá/Mamá'}</h1>
      <p className="text-gray-500 mb-8">Tus herramientas para hoy.</p>

      {tieneAccesoBasico ? (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 text-left transition group">
            <Activity className="text-green-600 mb-3 group-hover:scale-110 transition"/><h3 className="font-bold">Detector de Detonantes</h3>
          </button>
          <button onClick={() => changeView('stress')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-300 text-left transition group">
            <Wind className="text-purple-600 mb-3 group-hover:scale-110 transition"/><h3 className="font-bold">Botón de Pausa</h3>
          </button>
          <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 text-left transition group">
            <MessageCircle className="text-blue-600 mb-3 group-hover:scale-110 transition"/><h3 className="font-bold">Scripts</h3>
          </button>
          <button onClick={() => changeView('stories')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-yellow-300 text-left transition group">
            <BookOpen className="text-yellow-600 mb-3 group-hover:scale-110 transition"/><h3 className="font-bold">Casos Reales</h3>
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-10 rounded-xl border border-dashed text-center">
          <Lock className="mx-auto text-gray-400 mb-2" /><p>Acceso Protegido</p>
        </div>
      )}

      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {esPremium ? (
          <>
            <button onClick={() => changeView('antirelapse')} className="bg-white p-4 rounded-xl border border-blue-100 text-center"><Shield className="mx-auto text-blue-600 mb-2"/><span className="font-bold text-sm">Anti-Recaída</span></button>
            <button onClick={() => changeView('dialogue')} className="bg-white p-4 rounded-xl border border-purple-100 text-center"><MessageCircle className="mx-auto text-purple-600 mb-2"/><span className="font-bold text-sm">Diálogo</span></button>
            <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center"><Heart className="mx-auto text-red-500 mb-2"/><span className="font-bold text-sm">Empatía</span></button>
          </>
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
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Búsqueda por email si la cuenta acaba de ser creada
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

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="h-screen flex items-center justify-center text-green-600 font-bold">Cargando...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1.5 rounded"><Home size={18} /></div>
          <span className="font-bold">Manual Paciencia</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2"><LogOut size={20}/></button>
      </nav>
      <main className="p-4 md:p-8">
        {view !== 'dashboard' && <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-sm text-gray-500 hover:text-green-600 font-medium"><ChevronDown className="rotate-90 mr-1" size={16} /> Volver</button>}
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
      </main>
    </div>
  );
};

export default App;
