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
  sendPasswordResetEmail // Importado para recuperación
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, deleteDoc, updateDoc,
  collection, query, where, getDocs 
} from 'firebase/firestore';

// --- PANTALLA DE LOGIN RECONSTRUIDA ---
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState('email'); // 'email' o 'password'
  const [userStatus, setUserStatus] = useState(null); // 'to_activate' o 'registered'

  const cleanEmail = email.trim().toLowerCase();

  // 1. VERIFICAR ESTADO DEL USUARIO
  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Buscamos en toda la colección si existe ese email
      const q = query(collection(db, "users"), where("email", "==", cleanEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.authLinked) {
          setUserStatus('registered');
        } else {
          setUserStatus('to_activate');
        }
        setStep('password');
      } else {
        setError('No encontramos ninguna compra con este correo.');
      }
    } catch (err) {
      setError('Error al consultar la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGUEAR O ACTIVAR CUENTA
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (userStatus === 'to_activate') {
        if (password.length < 6) throw new Error('short-password');
        
        // Creamos el usuario en Auth
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;

        // Buscamos el documento original (el que tiene ID = email)
        const docRef = doc(db, "users", cleanEmail);
        const docSnap = await getDoc(docRef);
        const dataFromMake = docSnap.data();

        // Creamos el definitivo con UID
        await setDoc(doc(db, "users", user.uid), {
          ...dataFromMake,
          uid: user.uid,
          authLinked: true
        });

        // Borramos el temporal de email para evitar el duplicado que mencionaste
        await deleteDoc(docRef);
      } else {
        // LOGIN NORMAL
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) {
      if (err.message === 'short-password') setError('Usa al menos 6 caracteres.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setError('Contraseña incorrecta.');
      else setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // 3. RECUPERAR CONTRASEÑA
  const handleReset = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      setMessage('Enlace de recuperación enviado a tu email.');
    } catch (err) {
      setError('No se pudo enviar el correo de recuperación.');
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de tu compra</label>
              <input type="email" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 rounded-lg font-bold text-white hover:bg-green-700">
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {error && <div className="p-3 rounded-lg text-sm text-center bg-red-50 text-red-600 border border-red-100">{error}</div>}
            {message && <div className="p-3 rounded-lg text-sm text-center bg-green-50 text-green-700 border border-green-100">{message}</div>}
            <div className="text-xs text-center text-gray-500 mb-2">Acceso para: <strong>{cleanEmail}</strong></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {userStatus === 'to_activate' ? 'Crea tu contraseña (mín. 6 caracteres)' : 'Ingresa tu contraseña'}
              </label>
              <input type="password" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white ${userStatus === 'to_activate' ? 'bg-blue-600' : 'bg-green-600'}`}>
              {loading ? 'Procesando...' : (userStatus === 'to_activate' ? 'Activar Acceso' : 'Ingresar')}
            </button>
            {userStatus === 'registered' && (
              <button type="button" onClick={handleReset} className="w-full text-xs text-blue-600 mt-2 hover:underline">¿Olvidaste tu contraseña?</button>
            )}
            <button type="button" onClick={() => setStep('email')} className="w-full text-xs text-gray-400 mt-4">Usar otro correo</button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD (SIMPLIFICADO) ---
const Dashboard = ({ changeView, userData }) => {
  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.first_name || 'Papá/Mamá'}</h1>
      <p className="text-gray-500 mb-8">Tus herramientas para hoy.</p>
      
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-green-300 transition group">
          <Activity className="text-green-600 mb-3 group-hover:scale-110 transition"/>
          <h3 className="font-bold">Detector de Detonantes</h3>
        </button>
        <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-blue-300 transition group">
          <MessageCircle className="text-blue-600 mb-3 group-hover:scale-110 transition"/>
          <h3 className="font-bold">Scripts</h3>
        </button>
      </div>

      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {esPremium ? (
           <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center"><Heart className="mx-auto text-red-500 mb-2"/><span className="font-bold text-sm">Empatía</span></button>
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-xl border border-dashed text-center">
            <Lock className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Herramientas Premium Bloqueadas</p>
          </div>
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
        
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          // Si el documento por UID no existe, lo buscamos por email (caso activación en curso)
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

  if (loading) return <div className="h-screen flex items-center justify-center text-green-600 font-bold">Cargando aplicación...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1.5 rounded"><Home size={18} /></div>
          <span className="font-bold">Manual Paciencia</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"><LogOut size={20}/></button>
      </nav>

      <main className="p-4 md:p-8">
        {view !== 'dashboard' && <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-sm text-gray-500 hover:text-green-600 transition font-medium"><ChevronDown className="rotate-90 mr-1" size={16} /> Volver</button>}
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
      </main>
    </div>
  );
};

export default App;

