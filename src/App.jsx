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
  }
];

// ... (Resto de STORIES_DATA y EMPATHY_CHECKLIST igual)

// --- PANTALLA DE LOGIN (ESTRATEGIA ID PERMANENTE) ---
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
      // Buscamos el documento por ID (que siempre es el email)
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
      setError('Error de conexión.');
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

        // ACTUALIZACIÓN SEGURA: No borramos el documento, solo le añadimos el UID
        const docRef = doc(db, "users", cleanEmail);
        await updateDoc(docRef, {
          uid: user.uid,
          authLinked: true
        });
      } else {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) {
      if (err.message === 'short') setError('Mínimo 6 caracteres.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setError('Contraseña incorrecta.');
      else setError('Error de acceso. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setMessage('Enlace enviado a tu email.');
    } catch (err) {
      setError('No se pudo enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Manual de la Paciencia</h1>

        {step === 'email' ? (
          <form onSubmit={verifyEmail} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
            <input type="email" placeholder="Email de compra" required className="w-full p-3 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold">Continuar</button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
            {message && <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center">{message}</div>}
            <div className="text-center text-xs text-gray-400">{cleanEmail}</div>
            <input type="password" placeholder={isNewUser ? 'Crea una contraseña' : 'Contraseña'} required className="w-full p-3 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={loading} className={`w-full py-3 text-white rounded-lg font-bold ${isNewUser ? 'bg-blue-600' : 'bg-green-600'}`}>
              {isNewUser ? 'Activar Acceso' : 'Entrar'}
            </button>
            {!isNewUser && <button type="button" onClick={handleReset} className="w-full text-xs text-blue-600 mt-2">¿Olvidaste tu contraseña?</button>}
            <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-gray-300 mt-4">Cambiar correo</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => {
  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Hola, {userData?.first_name || 'Papá/Mamá'}</h1>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border text-left hover:border-green-300 transition">
          <Activity className="text-green-600 mb-3"/><h3 className="font-bold">Detector de Detonantes</h3>
        </button>
        <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border text-left hover:border-blue-300 transition">
          <MessageCircle className="text-blue-600 mb-3"/><h3 className="font-bold">Scripts</h3>
        </button>
      </div>

      <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {esPremium ? (
          <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center hover:shadow-md transition">
            <Heart className="mx-auto text-red-500 mb-2"/><span className="font-bold text-sm">Empatía</span>
          </button>
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-xl border border-dashed text-center text-gray-400"><Lock className="mx-auto mb-2"/> Pack Premium Bloqueado</div>
        )}
      </div>
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // BUSCAMOS SIEMPRE POR EMAIL (ID PERMANENTE)
        const docRef = doc(db, "users", firebaseUser.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Cargando...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b h-16 flex justify-between items-center px-4 shadow-sm">
        <span className="font-bold cursor-pointer" onClick={() => setView('dashboard')}>Manual Paciencia</span>
        <button onClick={() => signOut(auth)} className="text-gray-400 hover:text-red-500"><LogOut size={20}/></button>
      </nav>
      <main className="p-4 md:p-8">
        {view === 'dashboard' ? <Dashboard changeView={setView} userData={userData} /> : (
          <>
            <button onClick={() => setView('dashboard')} className="mb-6 text-sm text-gray-400 hover:text-green-600 transition">← Volver</button>
            {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={setUserData} />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;


