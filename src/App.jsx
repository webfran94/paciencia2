import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Home as HomeIcon, LogOut, X, Shield, Activity } from 'lucide-react';

// Importación de Herramientas
import Home from './pages/Home';
import Mapa from './pages/Mapa';
import SOS from './pages/SOS';
import Scripts from './pages/Scripts';
import Diario from './pages/Diario';
import Auxilios from './pages/Auxilios';
// Premium (Axel)
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
          const docSnap = await getDoc(doc(db, "users", fbUser.email.toLowerCase()));
          if (docSnap.exists()) setUserData(docSnap.data());
        } catch (e) { console.error("Error al cargar datos:", e); }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">ABRIENDO EL MANUAL...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div className={`min-h-screen ${userData?.patience_level > 7 ? 'bg-red-50' : 'bg-white'}`}>
      <nav className="h-20 border-b flex items-center justify-between px-6 max-w-xl mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div onClick={() => setView('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="bg-slate-900 text-white p-2 rounded-xl"><HomeIcon size={20}/></div>
          <span className="font-black text-sm uppercase tracking-tighter">Manual Paciencia</span>
        </div>
        <button onClick={() => signOut(auth)} className="text-slate-300 hover:text-red-500"><LogOut size={24}/></button>
      </nav>

      <main className="p-6 max-w-xl mx-auto">
        {view !== 'home' && (
          <button onClick={() => setView('home')} className="mb-8 flex items-center text-slate-400 font-black text-xs uppercase">
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
  const [isNewUser, setIsNewUser] = useState(false);

  const verifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const emailClean = email.trim().toLowerCase();
      const docSnap = await getDoc(doc(db, "users", emailClean));
      if (docSnap.exists()) {
        setIsNewUser(!docSnap.data().authLinked);
        setStep('password');
      } else { setError('Este correo no tiene una compra registrada.'); }
    } catch (err) { setError('Error de conexión con la base de datos.'); }
    finally { setLoading(false); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const emailClean = email.trim().toLowerCase();
      if (isNewUser) {
        if (password.length < 6) throw new Error('Mínimo 6 caracteres.');
        const cred = await createUserWithEmailAndPassword(auth, emailClean, password);
        await updateDoc(doc(db, "users", emailClean), { uid: cred.user.uid, authLinked: true });
      } else {
        await signInWithEmailAndPassword(auth, emailClean, password);
      }
    } catch (err) { setError(err.message.includes('auth/') ? 'Contraseña incorrecta.' : err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[3rem] border shadow-sm">
        <div className="flex justify-center mb-6 text-slate-900"><Shield size={48} /></div>
        <h1 className="text-2xl font-black text-center mb-8 uppercase">Entrar al Manual</h1>
        {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold mb-6 rounded-xl border border-red-100">{error}</div>}
        {step === 'email' ? (
          <form onSubmit={verifyEmail} className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email de Compra</label>
            <input type="email" placeholder="ejemplo@correo.com" className="w-full p-4 rounded-xl border" required onChange={e => setEmail(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase" disabled={loading}>{loading ? 'Verificando...' : 'Continuar'}</button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-6">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
              {isNewUser ? 'Crea tu Contraseña (mín. 6 caracteres)' : 'Ingresa tu Contraseña'}
            </label>
            <input type="password" required className="w-full p-4 rounded-xl border" onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold uppercase" disabled={loading}>
              {isNewUser ? 'Activar Acceso' : 'Ingresar'}
            </button>
            <button onClick={() => setStep('email')} className="w-full text-center text-xs font-bold text-slate-400 uppercase">← Volver</button>
          </form>
        )}
      </div>
    </div>
  );
};
