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

// ... (Resto de STORIES_DATA y EMPATHY_CHECKLIST igual que antes)

// --- PANTALLA DE LOGIN REFORZADA ---
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

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (needsActivation) {
        // PROCESO DE ACTIVACIÓN
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const user = userCredential.user;

        // Buscamos el documento temporal de Make (ID = email)
        const docRef = doc(db, "users", cleanEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const dataFromMake = docSnap.data();
          // Migramos los datos al nuevo documento (ID = UID de Auth)
          await setDoc(doc(db, "users", user.uid), {
            ...dataFromMake,
            uid: user.uid,
            authLinked: true
          });
          await deleteDoc(docRef);
        }
      } else {
        // LOGIN NORMAL
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (err) {
      console.error("Código de error Firebase:", err.code);

      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        // Si no existe en Auth, verificamos si existe la COMPRA en Firestore
        const docRef = doc(db, "users", cleanEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setNeedsActivation(true);
          setError('¡Compra confirmada! Crea una contraseña para activar tu acceso.');
        } else {
          setError('No encontramos ninguna compra con este correo. Revisa que sea el mismo que usaste en Hotmart.');
        }
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado. Intenta ingresar con tu contraseña.');
        setNeedsActivation(false);
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(`Error: ${err.code}. Intenta de nuevo.`);
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
          <p className="text-gray-500 text-sm">{needsActivation ? 'Configura tu acceso' : 'Área de Miembros'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {error && <div className={`p-3 rounded-lg text-sm text-center border ${needsActivation ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={email} onChange={(e) => { setEmail(e.target.value); setNeedsActivation(false); }} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{needsActivation ? 'Crea una contraseña' : 'Contraseña'}</label>
            <input type="password" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold text-white transition ${needsActivation ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
            {loading ? 'Procesando...' : (needsActivation ? 'Activar Mi Cuenta' : 'Entrar')}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- DASHBOARD MULTI-ETIQUETA ---
const Dashboard = ({ changeView, userData }) => {
  // Aceptamos pago_realizado (Make nuevo) O status: comprador_main (Make anterior) O premium
  const tieneAccesoBasico = 
    userData?.pago_realizado === true || 
    userData?.pago_realizado === "true" || 
    userData?.status === 'comprador_main' || 
    userData?.status === 'comprador_premium';

  const esPremium = userData?.status === 'comprador_premium';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.first_name || 'Papá/Mamá'}</h1>
      <p className="text-gray-500 mb-8">Tus herramientas para hoy.</p>

      {tieneAccesoBasico ? (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-green-300 transition group">
            <Activity className="text-green-600 mb-3 group-hover:scale-110 transition"/>
            <h3 className="font-bold text-gray-900">Detector de Detonantes</h3>
            <p className="text-sm text-gray-500">Rastrea y anticipa tu ira</p>
          </button>
          <button onClick={() => changeView('stress')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-purple-300 transition group">
            <Wind className="text-purple-600 mb-3 group-hover:scale-110 transition"/>
            <h3 className="font-bold text-gray-900">Botón de Pausa</h3>
            <p className="text-sm text-gray-500">Calma en 60 segundos</p>
          </button>
          <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-blue-300 transition group">
            <MessageCircle className="text-blue-600 mb-3 group-hover:scale-110 transition"/>
            <h3 className="font-bold text-gray-900">Scripts</h3>
            <p className="text-sm text-gray-500">Qué decir exactamente</p>
          </button>
          <button onClick={() => changeView('stories')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-yellow-300 transition group">
            <BookOpen className="text-yellow-600 mb-3 group-hover:scale-110 transition"/>
            <h3 className="font-bold text-gray-900">Casos Reales</h3>
            <p className="text-sm text-gray-500">Inspiración de otros padres</p>
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 p-10 rounded-xl border border-dashed border-gray-300 text-center mb-8">
          <Lock className="mx-auto text-gray-400 mb-4" size={40} />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Contenido Protegido</h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Hemos encontrado tu registro, pero el acceso a las herramientas aún no está activo. 
            Por favor, completa tu compra.
          </p>
        </div>
      )}

      {/* SECCIÓN PREMIUM */}
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {esPremium ? (
          <>
            <button onClick={() => changeView('antirelapse')} className="bg-white p-4 rounded-xl border border-blue-100 text-center hover:shadow-md transition"><Shield className="mx-auto text-blue-600 mb-2"/><span className="font-bold text-sm text-gray-800">Anti-Recaída</span></button>
            <button onClick={() => changeView('dialogue')} className="bg-white p-4 rounded-xl border border-purple-100 text-center hover:shadow-md transition"><MessageCircle className="mx-auto text-purple-600 mb-2"/><span className="font-bold text-sm text-gray-800">Diálogo</span></button>
            <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center hover:shadow-md transition"><Heart className="mx-auto text-red-500 mb-2"/><span className="font-bold text-sm text-gray-800">Empatía</span></button>
          </>
        ) : (
          <div className="col-span-3 bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
            <Lock className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 font-medium">Herramientas Premium Bloqueadas</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ... (El componente App queda igual que en tu versión anterior)
