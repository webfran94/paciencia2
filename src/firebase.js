import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TUS CREDENCIALES REALES
const firebaseConfig = {
  apiKey: "AIzaSyDUiJh9VsQS_td82-YSyusGr-DqcJtYt7g",
  authDomain: "manual-paciencia.firebaseapp.com",
  projectId: "manual-paciencia",
  storageBucket: "manual-paciencia.firebasestorage.app",
  messagingSenderId: "759536065466",
  appId: "1:759536065466:web:f5210ec8614f0b5b421b83"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);



