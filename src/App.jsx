import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail 
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Home as HomeIcon, LogOut, X, Shield, Activity } from 'lucide-react';

// Importación de Páginas (Asegúrate de que existan en src/pages/)
import Home from './pages/Home';
import Mapa from './pages/Mapa';
import SOS from './pages/SOS';
import Scripts from './pages/Scripts';
import Diario from './pages/Diario';
import Auxilios from './pages/Auxilios';
import Consecuencias from './pages/Consecuencias';
import Rutinas from './pages/Rutinas';
import Escudo from './pages/Escudo';
import PazDigital from './pages/PazDigital';
import ReparacionP from './pages/ReparacionP';
import Audios from './pages/Audios';
import Silencio from './pages/Silencio';
import Protocolo from './pages/Protocolo';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        try {
          // CONSULTA CORREGIDA: Siempre con user.email después del login
          const userDocRef = doc(db, "users", fbUser.email.toLowerCase());
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (e) {
          console.error("Error al cargar datos de Firestore:", e);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black italic text-slate-400 animate-pulse uppercase tracking-widest">
      Abriendo el Manual...
    </div>
  );

  if (!user) return <LoginScreen />;

  const esAlerta = userData?.patience_level > 7;

  return (
    <div className={`min-h-screen transition-all duration-700 ${esAlerta ? 'bg-red-600/10' : 'bg-white'}`}>
      <nav className="h-20 border-b flex items-center justify-between px-6 max-w-xl mx-auto bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="bg-slate-900 text-white p-2 rounded-xl shadow-lg"><HomeIcon size={20}/></div>
          <span className="font-black text-sm uppercase tracking-tighter">Manual Paciencia</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-slate-300 hover:text-red-500 transition-colors"><LogOut size={24}/></button>
      </nav>

      <main className="p-6 max-w-xl mx-auto">
        {view !== 'home' && (
          <button onClick={() => setView('home')} className="mb-8 flex items-center text-slate-400 font-black text-xs uppercase hover:text-slate-900">
            <X size={16} className="mr-2"/> Cerrar Herramienta
          </button>
        )}
        
        {view === 'home' && <Home userData={userData} setView={setView} />}
        {view === 'mapa' && <Mapa userData={userData} setUserData={setUserData} setView={setView} />}
        {view === 'sos' && <SOS setView={setView} />}
        {view === 'scripts' && <Scripts setView={setView} />}
        {view === 'diario' && <Diario userData={userData} setUserData={setUserData} setView={setView} />}
        {view === 'auxilios' && <Auxilios setView={setView} />}
        
        {/* Vistas Premium (Axel) */}
        {view === 'consecuencias' && <Consecuencias setView={setView} />}
        {view === 'rutinas' && <Rutinas setView={setView} />}
        {view === 'escudo' && <Escudo setView={setView} />}
        {view === 'paz-digital' && <PazDigital setView={setView} />}
        {view === 'reparacion-p' && <ReparacionP setView={setView} />}
        {view === 'audios' && <Audios setView={setView} />}
        {view === 'silencio' && <Silencio setView={setView} />}
        {view === 'protocolo' && <Protocolo setView={setView} />}
      </main>
    </div>
  );
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); 
  const [isNewUser, setIsNewUser] = useState(false);

  // 1. Lógica corregida según el Dev: fetchSignInMethodsForEmail
  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const emailClean = email.trim().toLowerCase();
    
    try {
      // Verificamos métodos de acceso, no Firestore directamente
      const methods = await fetchSignInMethodsForEmail(auth, emailClean);
      
      if (methods.length === 0) {
        // Email NUEVO o no registrado en Auth
        setIsNewUser(true);
      } else {
        // Email ya existe en Firebase Auth
        setIsNewUser(false);
      }
      setStep('password');
    } catch (err) {
      console.error(err);
      setError('Error al verificar el correo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Lógica de autenticación respetando el estado de isNewUser
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const emailClean = email.trim().toLowerCase();

    try {
      if (isNewUser) {
        // CREAR CUENTA
        if (password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
        const cred = await createUserWithEmailAndPassword(auth, emailClean, password);
        
        // Vincular en Firestore tras el registro exitoso
        await updateDoc(doc(db, "users", emailClean), { 
          uid: cred.user.uid, 
          authLinked: true 
        });
      } else {
        // LOGIN NORMAL
        await signInWithEmailAndPassword(auth, emailClean, password);
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Intenta iniciar sesión.');
      } else {
        setError(err.message || 'Ocurrió un error al ingresar.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] border shadow-sm">
        <div className="flex justify-center mb-6 text-slate-900"><Shield size={48} /></div>
        <h1 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">Entrar al Manual</h1>
        
        {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold mb-6 rounded-xl border border-red-100">{error}</div>}
        
        {step === 'email' ? (
          <form onSubmit={verifyEmail} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Email de Compra</label>
              <input 
                type="email" 
                placeholder="ejemplo@correo.com" 
                className="w-full p-4 rounded-xl border text-sm outline-none focus:border-orange-500 transition-all" 
                required 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest" disabled={loading}>
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">
                 {isNewUser ? 'Crea tu Contraseña (mín. 6 caracteres)' : 'Ingresa tu Contraseña'}
               </label>
               <input 
                type="password" 
                required 
                className="w-full p-4 rounded-xl border text-sm outline-none focus:border-orange-500 transition-all" 
                onChange={e => setPassword(e.target.value)} 
               />
            </div>
            <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest disabled:opacity-50" disabled={loading}>
              {isNewUser ? 'Activar Acceso' : 'Ingresar'}
            </button>
            <button onClick={() => setStep('email')} className="w-full text-center text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">
              ← Cambiar Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
