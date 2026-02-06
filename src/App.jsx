import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Home as HomeIcon, LogOut, X, Shield } from 'lucide-react';

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
          const userDocRef = doc(db, "users", fbUser.email.toLowerCase());
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (e) {
          console.error("Error al cargar datos:", e);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic text-slate-400">ABRIENDO EL MANUAL...</div>;
  if (!user) return <LoginScreen />;

  const esAlerta = userData?.patience_level > 7;

  return (
    <div className={`min-h-screen ${esAlerta ? 'bg-red-50' : 'bg-white'}`}>
      <nav className="h-20 border-b flex items-center justify-between px-6 max-w-xl mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="bg-slate-900 text-white p-2 rounded-xl"><HomeIcon size={20}/></div>
          <span className="font-black text-sm uppercase tracking-tighter">Manual Paciencia</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-slate-300 hover:text-red-500 transition-colors"><LogOut size={24}/></button>
      </nav>

      <main className="p-6 max-w-xl mx-auto">
        {view !== 'home' && (
          <button onClick={() => setView('home')} className="mb-8 flex items-center text-slate-400 font-black text-xs uppercase bg-transparent border-none cursor-pointer">
            <X size={16} className="mr-2"/> Cerrar Herramienta
          </button>
        )}
        
        {view === 'home' && <Home userData={userData} setView={setView} />}
        {view === 'mapa' && <Mapa userData={userData} setUserData={setUserData} setView={setView} />}
        {view === 'sos' && <SOS setView={setView} />}
        {view === 'scripts' && <Scripts setView={setView} />}
        {view === 'diario' && <Diario userData={userData} setUserData={setUserData} setView={setView} />}
        {view === 'auxilios' && <Auxilios setView={setView} />}
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      const userDocRef = doc(db, "users", cleanEmail);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        setError('No tienes acceso de comprador con este email.');
        setLoading(false);
        return;
      }
      
      setStep('password');
    } catch (err) {
      setError('Error al verificar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        if (password.length < 6) {
          setError('Contraseña debe tener mínimo 6 caracteres.');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await setDoc(doc(db, "users", cleanEmail), {
          email: cleanEmail,
          status: 'comprador_normal',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta.');
      } else {
        setError(err.message);
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
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email de Compra</label>
              <input type="email" placeholder="tu@email.com" className="w-full p-4 rounded-xl border text-sm outline-none focus:border-orange-500" required onChange={e => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest" disabled={loading}>
              {loading ? 'Buscando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                Crea tu contraseña de acceso (mín. 6 caracteres)
              </label>
              <input type="password" placeholder="••••••" required className="w-full p-4 rounded-xl border text-sm outline-none focus:border-orange-500" onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-xl" disabled={loading}>
              Activar Acceso
            </button>
            <button type="button" onClick={() => setStep('email')} className="w-full text-center text-xs font-bold text-slate-400 uppercase tracking-widest">← Cambiar Email</button>
          </form>
        )}
      </div>
    </div>
  );
};
