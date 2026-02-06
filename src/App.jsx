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

// [TODAS tus imports de pages iguales...]
import Home from './pages/Home';
// ... resto

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
  
  // [TODO tu JSX del main igual...]
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('email');

  // VERIFICA COMPRADOR (público)
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

  // LOGIN O REGISTRO
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanEmail = email.trim().toLowerCase();

    try {
      // PRIMERO intenta login
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        // Comprador sin cuenta Auth → crear
        if (password.length < 6) {
          setError('Contraseña debe tener 6 caracteres.');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
        
        // Asegura documento (Make lo hizo)
        await setDoc(doc(db, "users", cleanEmail), {
          email: cleanEmail,
          status: 'comprador_normal',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // [TODO tu JSX de LoginScreen igual - forms, botones, etc.]
  return (
    // Tu JSX actual de LoginScreen sin cambios en estructura
  );
};
