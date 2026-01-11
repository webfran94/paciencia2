import React, { useState, useEffect } from 'react';
import { 
  Home, BookOpen, Activity, MessageCircle, Users, Plus, Save, Trash2, 
  ChevronDown, Play, Pause, X, CheckCircle, AlertCircle, Wind, 
  Shield, Heart, Smile, Zap, Lock, Star, LogOut 
} from 'lucide-react';

// --- MOCK DE FIREBASE (Simulación para que funcione la Preview) ---
const mockAuth = {
  currentUser: null,
  login: (email) => {
    const user = { uid: "user_123", email };
    localStorage.setItem("mock_user", JSON.stringify(user));
    return user;
  },
  logout: () => {
    localStorage.removeItem("mock_user");
  },
  getCurrentUser: () => {
    const stored = localStorage.getItem("mock_user");
    return stored ? JSON.parse(stored) : null;
  }
};

const mockDb = {
  get: (userId) => {
    const data = localStorage.getItem(`db_${userId}`);
    return data ? JSON.parse(data) : null;
  },
  set: (userId, data) => {
    localStorage.setItem(`db_${userId}`, JSON.stringify(data));
  },
  update: (userId, newData) => {
    const current = mockDb.get(userId) || {};
    const updated = { ...current, ...newData };
    localStorage.setItem(`db_${userId}`, JSON.stringify(updated));
  }
};
// ---------------------------------------------------------------

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
  },
  {
    id: 2,
    category: "Berrinche",
    title: "Gritos en lugar público",
    trigger: "Quiere un dulce en el supermercado y se tira al piso a llorar.",
    dontSay: "¡Levántate ahora mismo! ¡Qué vergüenza, todo el mundo te mira!",
    doSay: "(Mantén la calma, voz baja): 'Entiendo que estás enojado porque querías el dulce. Pero no podemos comprarlo hoy. Estoy aquí contigo hasta que se te pase.'",
    why: "Validar la emoción no significa ceder. Tu calma es su ancla en la tormenta emocional."
  }
];

const STORIES_DATA = [
  {
    id: 1,
    title: "De Gritos Diarios a Conexión Real",
    author: "Carlos M., Padre de 2",
    snippet: "Pensé que era mi carácter. 'Soy explosivo', me decía. Hasta que entendí que mi ira era solo miedo a perder el control...",
    content: "Pensé que era mi carácter. 'Soy explosivo', me decía. Hasta que entendí que mi ira era solo miedo a perder el control. El Manual me enseñó a identificar esa 'presión en el pecho' antes de que subiera a mi garganta."
  }
];

const EMPATHY_CHECKLIST = [
  { id: 1, text: "Me bajé a su altura visual antes de hablar." },
  { id: 2, text: "Validé su emoción ('Veo que estás enojado') antes de corregir." },
  { id: 3, text: "Escuché su versión sin interrumpir." },
  { id: 4, text: "No usé etiquetas ('eres malo', 'eres flojo')." },
  { id: 5, text: "Ofrecí un abrazo al final para reconectar." }
];

// --- COMPONENTES AUXILIARES ---

// PANTALLA DE LOGIN
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de login exitoso
    setTimeout(() => {
      const user = mockAuth.login(email);
      onLogin(user);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Home size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manual de la Paciencia</h1>
          <p className="text-gray-500 text-sm">Ingresa a tu área de miembros</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required 
              placeholder="demo@ejemplo.com"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              required 
              placeholder="cualquiera"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            {loading ? 'Entrando...' : 'Ingresar (Modo Demo)'}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">
          Nota: En esta demo, puedes usar cualquier email.
        </p>
      </div>
    </div>
  );
};

// --- HERRAMIENTAS ---

// 1. REFLECTION TOOL
const ReflectionTool = ({ userId, userData, updateUserData }) => {
  const [entries, setEntries] = useState(userData?.reflections || []);
  const [newEntry, setNewEntry] = useState({ trigger: '', intensity: 5, notes: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newEntry.trigger) return;
    const entry = { ...newEntry, id: Date.now(), date: new Date().toLocaleDateString() };
    
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    
    // Guardar en Mock DB
    const currentData = mockDb.get(userId) || {};
    const newData = { ...currentData, reflections: updatedEntries };
    mockDb.set(userId, newData);
    updateUserData(newData); // Actualizar estado global

    setNewEntry({ trigger: '', intensity: 5, notes: '' });
    setIsAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1"><Activity className="text-green-600"/> Detector</h2>
          <p className="text-sm text-gray-600">Identifica qué dispara tu ira antes de explotar.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-green-700 transition">
          {isAdding ? <X size={18} /> : <Plus size={18} />} {isAdding ? 'Cancelar' : 'Nuevo'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 mb-8 animate-fade-in-down">
          <label className="block text-sm font-medium text-gray-700 mb-1">Detonante</label>
          <select className="w-full p-3 border rounded-lg mb-4 bg-gray-50" value={newEntry.trigger} onChange={e => setNewEntry({...newEntry, trigger: e.target.value})}>
            <option value="">Selecciona...</option>
            <option value="Ruido">Ruido / Caos</option>
            <option value="Desobediencia">Me ignoraron</option>
            <option value="Cansancio">Mi propio cansancio</option>
            <option value="Falta de Respeto">Grosería</option>
          </select>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Intensidad (1-10)</label>
          <input type="range" min="1" max="10" className="w-full h-2 bg-gray-200 rounded-lg mb-2 accent-green-600" value={newEntry.intensity} onChange={e => setNewEntry({...newEntry, intensity: parseInt(e.target.value)})} />
          <div className="text-right text-green-600 font-bold mb-4">{newEntry.intensity}</div>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
          <textarea className="w-full p-3 border rounded-lg mb-4 bg-gray-50 h-20" placeholder="¿Qué sentiste en el cuerpo?" value={newEntry.notes} onChange={e => setNewEntry({...newEntry, notes: e.target.value})} />
          
          <button onClick={handleAdd} className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800">Guardar Registro</button>
        </div>
      )}

      <div className="space-y-4">
        {entries.length === 0 && <p className="text-center text-gray-400 py-8">No hay registros aún. Empieza hoy.</p>}
        {entries.map(entry => (
          <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-800">{entry.trigger}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${entry.intensity > 7 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>Nivel {entry.intensity}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{entry.date}</p>
              {entry.notes && <p className="text-sm text-gray-600 mt-2 italic">"{entry.notes}"</p>}
            </div>
            <Trash2 size={18} className="text-gray-300 hover:text-red-500 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. STRESS TOOL
const StressTool = () => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState("Listo");

  useEffect(() => {
    if(active) {
      setText("Inhala...");
      const t1 = setTimeout(() => setText("Retén..."), 4000);
      const t2 = setTimeout(() => setText("Exhala..."), 8000);
      const t3 = setTimeout(() => setActive(false), 12000); 
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      setText("Listo");
    }
  }, [active]);

  return (
    <div className="text-center max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-2 flex justify-center items-center gap-2"><Wind className="text-purple-500"/> Pausa Biológica</h2>
      <p className="text-gray-600 mb-8">Desactiva la alerta de ira en 60 segundos.</p>
      
      <div className="w-64 h-64 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-8 relative shadow-inner">
        <div className={`absolute inset-0 bg-purple-200 rounded-full transition-transform duration-[4000ms] ${active ? 'scale-100' : 'scale-50'}`}></div>
        <span className="relative z-10 text-3xl font-bold text-purple-800">{text}</span>
      </div>
      
      <button onClick={() => setActive(true)} className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition shadow-lg flex items-center gap-2 mx-auto">
        {active ? <Pause size={18}/> : <Play size={18}/>} {active ? 'Respirando...' : 'Iniciar Pausa'}
      </button>
    </div>
  );
};

// 3. COMMUNICATION TOOL
const CommunicationTool = () => {
  const [expandedId, setExpandedId] = useState(null);
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2"><MessageCircle className="text-blue-500"/> Scripts</h2>
        <p className="text-sm text-gray-600">Qué decir exactamente para lograr cooperación sin gritar.</p>
      </div>
      
      <div className="space-y-4">
        {SCRIPTS_DATA.map(script => (
          <div key={script.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button onClick={() => setExpandedId(expandedId === script.id ? null : script.id)} className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-50">
              <span className="font-bold text-gray-800">{script.title}</span>
              <ChevronDown className={`text-gray-400 transition-transform ${expandedId === script.id ? 'rotate-180' : ''}`} />
            </button>
            {expandedId === script.id && (
              <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1"><X size={12}/> EVITA DECIR:</p>
                    <p className="text-sm text-gray-700 italic">"{script.dontSay}"</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1"><CheckCircle size={12}/> MEJOR DI:</p>
                    <p className="text-sm text-gray-800 font-medium">"{script.doSay}"</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. STORIES TOOL
const StoriesTool = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><BookOpen className="text-yellow-600"/> Casos Reales</h2>
    <div className="space-y-4">
      {STORIES_DATA.map((story, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900">{story.title}</h3>
          <p className="text-xs font-bold text-yellow-600 uppercase mb-2">{story.author}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{story.content}</p>
        </div>
      ))}
    </div>
  </div>
);

// 5. PREMIUM TOOLS
const AntiRelapseTool = () => (
  <div className="max-w-2xl mx-auto">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-1"><Shield className="text-blue-600"/> Plan Anti-Recaída</h2>
      <p className="text-sm text-gray-600">Crea tu estrategia de seguridad para momentos de alto estrés.</p>
    </div>
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center mb-6">
      <p className="text-blue-800 font-bold text-lg mb-2">Si pasa esto: <span className="font-normal text-gray-700">"Llego tarde y hay tráfico"</span></p>
      <p className="text-green-700 font-bold text-lg">Entonces haré: <span className="font-normal text-gray-700">"Pondré música y respiraré 3 veces antes de entrar a casa"</span></p>
    </div>
    <button className="w-full py-3 bg-white border border-gray-300 text-gray-500 rounded-lg hover:bg-gray-50">+ Añadir Nuevo Escenario</button>
  </div>
);

const DialogueTool = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MessageCircle className="text-purple-600"/> Diálogo Abierto</h2>
    <div className="grid gap-4">
      {["La Reparación de 3 Pasos", "Preguntas de Conexión", "El Buzón de Sentimientos"].map((t, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer hover:border-purple-300">
          <span className="font-bold text-gray-700">{t}</span>
          <ChevronDown className="text-gray-400"/>
        </div>
      ))}
    </div>
  </div>
);

const EmpathyTool = () => {
  const [checked, setChecked] = useState([]);
  const toggle = (id) => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Heart className="text-red-500"/> Checklist de Empatía</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {EMPATHY_CHECKLIST.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} className={`p-4 border-b border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 ${checked.includes(item.id) ? 'bg-green-50' : ''}`}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${checked.includes(item.id) ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300'}`}>
              {checked.includes(item.id) && <CheckCircle size={14}/>}
            </div>
            <p className={`text-sm ${checked.includes(item.id) ? 'text-green-800 font-medium' : 'text-gray-600'}`}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SelfCareTool = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Smile className="text-yellow-500"/> Batería Emocional</h2>
    <div className="grid grid-cols-2 gap-4">
      {[{l:"Dormir 7h", i:"😴"}, {l:"Leer 10min", i:"📖"}, {l:"Caminar", i:"🚶"}, {l:"Agua", i:"💧"}].map((h, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 text-center hover:shadow-md cursor-pointer transition">
          <div className="text-4xl mb-2">{h.i}</div>
          <p className="font-bold text-gray-700">{h.l}</p>
        </div>
      ))}
    </div>
  </div>
);

const ConfidenceTool = () => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Star className="text-orange-500"/> Diario de Logros</h2>
    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 text-center">
      <p className="font-bold text-orange-800 mb-2">Hoy logré...</p>
      <textarea className="w-full p-4 rounded-lg border-orange-200 focus:ring-orange-500 h-32 mb-4 bg-white" placeholder="Ej: Me detuve antes de gritar..."></textarea>
      <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600">Celebrar Victoria</button>
    </div>
  </div>
);

// --- DASHBOARD ---
const Dashboard = ({ changeView, userData }) => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Hola, {userData?.name || 'Papá/Mamá'}</h1>
    <p className="text-gray-500 mb-8">Tus herramientas para hoy.</p>

    <div className="grid md:grid-cols-2 gap-4 mb-8">
      <button onClick={() => changeView('reflection')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-green-300 text-left transition hover:shadow-md group">
        <Activity className="text-green-600 mb-3 group-hover:scale-110 transition"/>
        <h3 className="font-bold text-gray-900">Detector de Detonantes</h3>
        <p className="text-sm text-gray-500">Rastrea y anticipa tu ira</p>
      </button>
      <button onClick={() => changeView('stress')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-purple-300 text-left transition hover:shadow-md group">
        <Wind className="text-purple-600 mb-3 group-hover:scale-110 transition"/>
        <h3 className="font-bold text-gray-900">Botón de Pausa</h3>
        <p className="text-sm text-gray-500">Calma en 60 segundos</p>
      </button>
      <button onClick={() => changeView('communication')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 text-left transition hover:shadow-md group">
        <MessageCircle className="text-blue-600 mb-3 group-hover:scale-110 transition"/>
        <h3 className="font-bold text-gray-900">Scripts</h3>
        <p className="text-sm text-gray-500">Qué decir exactamente</p>
      </button>
      <button onClick={() => changeView('stories')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-yellow-300 text-left transition hover:shadow-md group">
        <BookOpen className="text-yellow-600 mb-3 group-hover:scale-110 transition"/>
        <h3 className="font-bold text-gray-900">Casos Reales</h3>
        <p className="text-sm text-gray-500">Inspiración de otros padres</p>
      </button>
    </div>

    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Pack Premium</h3>
    <div className="grid md:grid-cols-3 gap-4 mb-12">
      {userData?.isPremium ? (
        <>
          <button onClick={() => changeView('antirelapse')} className="bg-white p-4 rounded-xl border border-blue-100 text-center hover:shadow-md transition"><Shield className="mx-auto text-blue-600 mb-2"/><span className="font-bold text-sm text-gray-800">Anti-Recaída</span></button>
          <button onClick={() => changeView('dialogue')} className="bg-white p-4 rounded-xl border border-purple-100 text-center hover:shadow-md transition"><MessageCircle className="mx-auto text-purple-600 mb-2"/><span className="font-bold text-sm text-gray-800">Diálogo</span></button>
          <button onClick={() => changeView('empathy')} className="bg-white p-4 rounded-xl border border-red-100 text-center hover:shadow-md transition"><Heart className="mx-auto text-red-500 mb-2"/><span className="font-bold text-sm text-gray-800">Empatía</span></button>
          <button onClick={() => changeView('selfcare')} className="bg-white p-4 rounded-xl border border-yellow-100 text-center hover:shadow-md transition"><Smile className="mx-auto text-yellow-500 mb-2"/><span className="font-bold text-sm text-gray-800">Autocuidado</span></button>
          <button onClick={() => changeView('confidence')} className="bg-white p-4 rounded-xl border border-orange-100 text-center hover:shadow-md transition"><Star className="mx-auto text-orange-500 mb-2"/><span className="font-bold text-sm text-gray-800">Confianza</span></button>
        </>
      ) : (
        <div className="col-span-3 bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300 text-center">
          <Lock className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4 font-medium">Herramientas Premium Bloqueadas</p>
          <button className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-300 transition shadow-sm">
            Desbloquear por $19
          </button>
        </div>
      )}
    </div>
  </div>
);

// --- APP PRINCIPAL ---
const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprobar sesión al inicio (Simulado)
    const storedUser = mockAuth.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      // Cargar datos simulados o crear iniciales
      const existingData = mockDb.get(storedUser.uid);
      if (existingData) {
        setUserData(existingData);
      } else {
        const initialData = { name: storedUser.email.split('@')[0], isPremium: true, reflections: [] }; // Premium activado para demo
        mockDb.set(storedUser.uid, initialData);
        setUserData(initialData);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    const initialData = { name: user.email.split('@')[0], isPremium: true, reflections: [] }; // Premium true para que veas todo
    mockDb.set(user.uid, initialData);
    setUserData(initialData);
  };

  const handleLogout = () => {
    mockAuth.logout();
    setUser(null);
    setUserData(null);
    setView('dashboard');
  };

  const updateUserData = (newData) => {
    setUserData(newData);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-green-600 font-bold">Cargando aplicación...</div>;
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
      <nav className="bg-white border-b sticky top-0 z-50 px-4 h-16 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => setView('dashboard')}>
          <div className="bg-green-600 text-white p-1.5 rounded"><Home size={18} /></div>
          <span className="font-bold tracking-tight">Manual Paciencia</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100" title="Cerrar Sesión">
          <LogOut size={20}/>
        </button>
      </nav>

      <main className="p-4 md:p-8 animate-fade-in">
        {view !== 'dashboard' && (
          <button onClick={() => setView('dashboard')} className="mb-6 flex items-center text-sm text-gray-500 hover:text-green-600 transition font-medium">
            <ChevronDown className="rotate-90 mr-1" size={16} /> Volver al Dashboard
          </button>
        )}
        
        {view === 'dashboard' && <Dashboard changeView={setView} userData={userData} />}
        {view === 'reflection' && <ReflectionTool userId={user.uid} userData={userData} updateUserData={updateUserData} />}
        {view === 'stress' && <StressTool />}
        {view === 'communication' && <CommunicationTool />}
        {view === 'stories' && <StoriesTool />}
        {view === 'antirelapse' && <AntiRelapseTool />}
        {view === 'dialogue' && <DialogueTool />}
        {view === 'empathy' && <EmpathyTool />}
        {view === 'selfcare' && <SelfCareTool />}
        {view === 'confidence' && <ConfidenceTool />}
      </main>
    </div>
  );
};

export default App;