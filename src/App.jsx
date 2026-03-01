import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  History, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  User,
  Plus,
  Phone,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Cloud,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  Play,
  Heart,
  Moon,
  Sun
} from 'lucide-react';

// --- SOUND ENGINE ---
const playSound = (type = 'click', enabled = true) => {
  if (!enabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'click') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'success') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'alert') {
      for (let i = 0; i < 5; i++) {
        const osc = audioCtx.createOscillator();
        const gn = audioCtx.createGain();
        osc.connect(gn);
        gn.connect(audioCtx.destination);
        osc.frequency.value = 800;
        gn.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.3);
        gn.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.3 + 0.2);
        osc.start(audioCtx.currentTime + i * 0.3);
        osc.stop(audioCtx.currentTime + i * 0.3 + 0.2);
      }
    }
  } catch (e) {
    console.error("Audio failed", e);
  }
};

// --- BRAND LOGO ---
const HikOnLogo = ({ theme, className = "h-12" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 drop-shadow-md">
        <circle cx="50" cy="50" r="48" stroke={theme === 'light' ? "#1e3a8a" : "#60a5fa"} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.2"/>
        <path d="M5 50C5 25.1472 25.1472 5 50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M15 75L40 35L60 60L75 45L90 75H15Z" fill={theme === 'light' ? "#1e3a8a" : "#3b82f6"} />
        <path d="M40 35L55 60L70 40L85 75H50L40 35Z" fill="#84cc16" opacity="0.8" />
        <path d="M10 70H35L42 55L50 85L58 70H90" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M60 25C60 25 65 15 75 15C75 15 78 25 72 32C68 38 60 25 60 25Z" fill="#84cc16" />
        <path d="M72 28C72 28 80 20 88 25C88 25 85 35 78 38C72 41 72 28 72 28Z" fill="#0ea5e9" />
      </svg>
    </div>
    <div className="flex flex-col">
      <div className="flex items-center">
        <span className={`text-2xl font-black tracking-tight ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-white'}`}>Hik</span>
        <div className="bg-[#84cc16] p-1 rounded-full mx-0.5 shadow-sm">
          <Cloud size={12} className="text-white fill-white" />
        </div>
        <span className={`text-2xl font-black tracking-tight ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-white'}`}>n</span>
      </div>
      <span className={`text-[7px] font-black uppercase tracking-[0.2em] -mt-1 ${theme === 'light' ? 'text-[#1e3a8a]/60' : 'text-slate-400'}`}>Asthma Monitor Pro</span>
    </div>
  </div>
);

const vitalsTrend = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  spo2: 95 + Math.random() * 4,
  bpm: 70 + Math.random() * 10
}));

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  
  const [sensors, setSensors] = useState({
    spo2: 98,
    heartRate: 72,
    breathingRate: 16,
    respiratorySounds: 'Normal',
    temperature: 24.5,
    humidity: 48,
    pm25: 12,
    physioRisk: 'safe',
    envRisk: 'safe',
    physioTriggers: [],
    envTriggers: []
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString());
      setSensors(prev => ({
        ...prev,
        spo2: Math.min(100, parseFloat(prev.spo2) + (Math.random() > 0.5 ? 0.1 : -0.1)).toFixed(1),
        heartRate: Math.round(72 + Math.random() * 5),
        pm25: (10 + Math.random() * 5).toFixed(1)
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleInteraction = useCallback((type = 'click') => {
    playSound(type, soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) playSound('success', true);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    handleInteraction();
  };

  const triggerTestAlert = () => {
    handleInteraction('alert');
    setAlertMsg('System Alert: High-risk scenario simulation active.');
    setIsAlertVisible(true);
    setTimeout(() => setIsAlertVisible(false), 5000);
  };

  const themeClasses = {
    bg: theme === 'light' ? 'bg-[#f1f5f9]' : 'bg-[#0f172a]',
    sidebar: theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#151c2e] border-slate-800',
    card: theme === 'light' ? 'bg-white border-slate-200' : 'bg-[#1e293b] border-slate-700',
    header: theme === 'light' ? 'bg-white/80 border-slate-200' : 'bg-[#151c2e]/80 border-slate-800',
    text: theme === 'light' ? 'text-slate-900' : 'text-white',
    subtext: theme === 'light' ? 'text-slate-500' : 'text-slate-400',
    border: theme === 'light' ? 'border-slate-200' : 'border-slate-800',
    footer: theme === 'light' ? 'bg-white/80 border-slate-100' : 'bg-[#151c2e]/80 border-slate-800'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${themeClasses.bg} ${themeClasses.text} font-sans selection:bg-lime-200 antialiased overflow-x-hidden relative`}>
      {/* Visual background decorative glows */}
      <div className={`fixed -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] pointer-events-none transition-opacity duration-700 ${theme === 'light' ? 'bg-blue-600/5 opacity-100' : 'bg-blue-400/10 opacity-60'}`} />
      
      {/* Alert Banner */}
      {isAlertVisible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-lg px-4">
          <div className="bg-rose-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 border-rose-400 animate-bounce">
            <AlertTriangle className="flex-shrink-0" />
            <p className="font-bold text-sm leading-tight">{alertMsg}</p>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed left-0 top-0 h-full w-20 lg:w-72 border-r flex flex-col z-50 transition-all duration-300 shadow-sm ${themeClasses.sidebar}`}>
        <div className={`p-8 border-b flex items-center justify-center lg:justify-start ${themeClasses.border}`}>
          <div className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-95" onClick={() => handleInteraction('success')}>
            <HikOnLogo theme={theme} />
          </div>
        </div>

        <nav className="flex-1 px-6 py-10 space-y-3">
          <NavItem 
            icon={<LayoutDashboard size={22}/>} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            theme={theme}
            onClick={() => { setActiveTab('dashboard'); handleInteraction(); }} 
          />
          <NavItem 
            icon={<History size={22}/>} 
            label="Health Trends" 
            active={activeTab === 'history'} 
            theme={theme}
            onClick={() => { setActiveTab('history'); handleInteraction(); }} 
          />
          <NavItem 
            icon={<Bell size={22}/>} 
            label="Notifications" 
            active={activeTab === 'alerts'} 
            theme={theme}
            onClick={() => { setActiveTab('alerts'); handleInteraction(); }} 
          />
          <div className={`pt-6 mt-6 border-t ${themeClasses.border}`}>
             <div className="hidden lg:block px-4 mb-4">
                <p className={`text-[10px] font-black uppercase tracking-widest ${themeClasses.subtext}`}>System</p>
             </div>
             <NavItem 
              icon={<Settings size={22}/>} 
              label="Settings" 
              active={activeTab === 'settings'} 
              theme={theme}
              onClick={() => { setActiveTab('settings'); handleInteraction(); }} 
            />
             <button 
                onClick={triggerTestAlert}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl mt-4 transition-all active:scale-95 group ${theme === 'light' ? 'text-blue-600 hover:bg-blue-50' : 'text-blue-400 hover:bg-blue-900/20'}`}
             >
                <Play size={20} className="group-hover:fill-current" />
                <span className="hidden lg:block text-xs font-black uppercase tracking-widest text-left">Run Alert Test</span>
             </button>
          </div>
        </nav>

        <div className="p-8">
          <div className={`rounded-3xl p-5 border shadow-sm ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900/10 border-blue-900/30'}`}>
            <div className="flex items-center justify-between mb-4">
               <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'light' ? 'text-blue-900/40' : 'text-blue-400/40'}`}>Hub Status</span>
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span className={themeClasses.subtext}>Battery</span>
                <span className={theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}>88%</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-slate-100' : 'bg-slate-700'}`}>
                <div className="bg-emerald-500 h-full w-[88%]" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-20 lg:pl-72 min-h-screen transition-all duration-300">
        <header className={`h-24 backdrop-blur-md border-b sticky top-0 z-40 px-10 flex items-center justify-between ${themeClasses.header}`}>
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className={`text-2xl font-black tracking-tight ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-white'}`}>
              {activeTab === 'dashboard' ? 'Safety Dashboard' : activeTab === 'history' ? 'Analytical Logs' : 'System Settings'}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme === 'light' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-emerald-900/20 text-emerald-400 border-emerald-900/40'}`}>
                <CheckCircle2 size={10} /> Live Monitoring
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-widest ${themeClasses.subtext}`}>Sync: {lastSync}</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* THEME TOGGLE SWITCH */}
            <button 
              onClick={toggleTheme}
              className={`relative flex items-center h-10 w-20 rounded-full p-1 transition-colors duration-300 shadow-inner ${theme === 'light' ? 'bg-slate-200' : 'bg-slate-700'}`}
              title="Toggle Theme"
            >
              <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-md transform transition-transform duration-300 ${theme === 'light' ? 'translate-x-0' : 'translate-x-10'}`}>
                {theme === 'light' ? <Sun size={16} className="text-orange-500" /> : <Moon size={16} className="text-blue-500" />}
              </div>
              <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                <Sun size={12} className={`transition-opacity ${theme === 'dark' ? 'opacity-40' : 'opacity-0'}`} />
                <Moon size={12} className={`transition-opacity ${theme === 'light' ? 'opacity-40' : 'opacity-0'}`} />
              </div>
            </button>

            {/* SOUND TOGGLE */}
            <button 
              onClick={toggleSound}
              className={`flex items-center gap-2 p-3 rounded-2xl border transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm ${
                soundEnabled 
                  ? (theme === 'light' ? 'bg-blue-50 border-blue-100 text-[#1e3a8a]' : 'bg-blue-900/30 border-blue-800 text-blue-400')
                  : (themeClasses.card + ' ' + themeClasses.subtext)
              }`}
            >
              {soundEnabled ? <Volume2 size={20}/> : <VolumeX size={20}/>}
            </button>

            <button 
              onClick={() => handleInteraction('success')}
              className={`hidden sm:flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${theme === 'light' ? 'bg-[#1e3a8a] hover:bg-[#162a63] text-white shadow-blue-900/10' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'}`}
            >
              <Plus size={18} /> Log Symptom
            </button>
            <div 
              onClick={() => handleInteraction()}
              className={`h-12 w-12 rounded-2xl border p-0.5 cursor-pointer hover:shadow-md transition-all active:scale-90 ${themeClasses.card}`}
            >
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User" className="w-full h-full rounded-[14px]" />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="p-10 max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Health Panel */}
              <div className={`border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group ${themeClasses.card}`}>
                 <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <h3 className={`text-xl font-black tracking-tight ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-white'}`}>Physiological Health</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${themeClasses.subtext}`}>Real-time clinical data</p>
                    </div>
                    <RiskBadge level={sensors.physioRisk} theme={theme} />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
                    <Reading label="Pulse Oximetry" value={sensors.spo2} unit="%" icon={<Activity className="text-blue-600"/>} theme={theme} />
                    <Reading label="Cardiac BPM" value={sensors.heartRate} unit="bpm" icon={<Heart className="text-rose-500 fill-rose-500/10"/>} theme={theme} />
                    <Reading label="Respiration" value={sensors.breathingRate} unit="br/m" icon={<Wind className="text-sky-500"/>} theme={theme} />
                    <Reading label="Breath Quality" value={sensors.respiratorySounds} unit="" icon={<Volume2 className="text-indigo-500"/>} smallValue theme={theme} />
                 </div>

                 <div className={`pt-8 border-t relative z-10 ${themeClasses.border}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${themeClasses.subtext}`}>Potential Warnings</p>
                    <div className="flex flex-wrap gap-2">
                        {sensors.physioTriggers.length > 0 ? sensors.physioTriggers.map((t, idx) => (
                            <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black border border-rose-100">{t}</span>
                        )) : <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14}/> All vitals are optimal</span>}
                    </div>
                 </div>
              </div>

              {/* Environmental Panel */}
              <div className={`border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group ${themeClasses.card}`}>
                 <div className="flex justify-between items-start mb-10 relative z-10">
                    <div>
                        <h3 className={`text-xl font-black tracking-tight ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-white'}`}>Surroundings</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${themeClasses.subtext}`}>Environmental risk monitoring</p>
                    </div>
                    <RiskBadge level={sensors.envRisk} theme={theme} />
                 </div>

                 <div className="grid grid-cols-2 gap-8 mb-10 relative z-10">
                    <Reading label="Temp Index" value={sensors.temperature} unit="°C" icon={<Thermometer className="text-orange-500"/>} theme={theme} />
                    <Reading label="Humidity" value={sensors.humidity} unit="%" icon={<Droplets className="text-cyan-500"/>} theme={theme} />
                    <Reading label="Particulate PM2.5" value={sensors.pm25} unit="µg/m³" icon={<Wind className="text-lime-600"/>} theme={theme} />
                    <Reading label="Air Stability" value="Stable" unit="" icon={<ShieldCheck className="text-emerald-500"/>} smallValue theme={theme} />
                 </div>

                 <div className={`pt-8 border-t relative z-10 ${themeClasses.border}`}>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${themeClasses.subtext}`}>Active Trigger Warnings</p>
                    <div className="flex flex-wrap gap-2">
                        {sensors.envTriggers.length > 0 ? sensors.envTriggers.map((t, idx) => (
                            <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100">{t}</span>
                        )) : <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={14}/> Atmosphere is clear</span>}
                    </div>
                 </div>
              </div>
            </div>

            <div className={`border rounded-[2.5rem] p-10 shadow-sm relative group overflow-hidden ${themeClasses.card}`}>
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                    <Activity size={200} className={theme === 'light' ? 'text-[#1e3a8a]' : 'text-blue-400'} />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div>
                        <h3 className={`text-xl font-black tracking-tight ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-white'}`}>Continuity Log (24h)</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${themeClasses.subtext}`}>SpO2 & Environmental data points</p>
                    </div>
                </div>

                <div className="h-[300px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vitalsTrend}>
                        <defs>
                          <linearGradient id="colorSp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme === 'light' ? "#1e3a8a" : "#60a5fa"} stopOpacity={0.15}/>
                            <stop offset="95%" stopColor={theme === 'light' ? "#1e3a8a" : "#60a5fa"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? "#f1f5f9" : "#334155"} vertical={false} />
                        <XAxis dataKey="time" stroke="#cbd5e1" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis domain={[90, 100]} stroke="#cbd5e1" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: theme === 'light' ? 'white' : '#1e293b', borderRadius: '20px', border: theme === 'light' ? '1px solid #f1f5f9' : '1px solid #334155', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '16px' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: theme === 'light' ? '#1e3a8a' : '#60a5fa' }}
                        />
                        <Area type="monotone" dataKey="spo2" stroke={theme === 'light' ? "#1e3a8a" : "#60a5fa"} strokeWidth={4} fillOpacity={1} fill="url(#colorSp)" />
                      </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
               <ActionCard 
                  onClick={() => { setActiveTab('history'); handleInteraction('success'); }} 
                  icon={<History size={24}/>} 
                  title="Historical Archives" 
                  desc="Review longitudinal data patterns for medical assessment." 
                  color="bg-indigo-600"
                  theme={theme}
               />
               <ActionCard 
                  onClick={() => { setActiveTab('settings'); handleInteraction(); }} 
                  icon={<Settings size={24}/>} 
                  title="System Configuration" 
                  desc="Manage device sync and clinical alert thresholds." 
                  color="bg-blue-500"
                  theme={theme}
               />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`border rounded-[2.5rem] p-10 shadow-sm ${themeClasses.card}`}>
              <h3 className={`text-xl font-black mb-8 flex items-center gap-3 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <Settings size={24} className="text-blue-500" /> System Settings
              </h3>

              <div className="space-y-10">
                {/* Visual Theme Toggles Info */}
                <div className="space-y-4">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${themeClasses.subtext}`}>Quick Access Theme Switch</p>
                  <div className={`p-6 rounded-3xl border flex items-center justify-between ${theme === 'light' ? 'bg-blue-50 border-blue-100' : 'bg-blue-900/10 border-blue-900/30'}`}>
                    <div>
                      <p className="font-bold text-sm">Theme Toggle available in Header</p>
                      <p className={`text-xs ${themeClasses.subtext}`}>Switch between Light and Midnight modes instantly from any page.</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        <Zap size={16} />
                    </div>
                  </div>
                </div>

                {/* Audio Engine */}
                <div className="space-y-4 pt-6 border-t border-slate-700/10">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${themeClasses.subtext}`}>Audio Feedback</p>
                  <div className={`flex items-center justify-between p-6 rounded-3xl border ${theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/50 border-slate-700'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${soundEnabled ? (theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400') : 'bg-slate-500/10 text-slate-500'}`}>
                        {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Clinical Audio Engine</p>
                        <p className={`text-xs ${themeClasses.subtext}`}>Toggle synthesized medical interaction tones</p>
                      </div>
                    </div>
                    <button 
                      onClick={toggleSound}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${soundEnabled ? 'bg-blue-600' : 'bg-slate-400'}`}
                    >
                      <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-10 flex flex-col items-center justify-center min-h-[70vh] text-center animate-in zoom-in-95 duration-700">
             <div 
               onClick={() => handleInteraction('success')}
               className={`w-28 h-28 border rounded-[2.5rem] flex items-center justify-center mb-8 text-blue-600 cursor-pointer shadow-xl hover:scale-105 active:scale-95 transition-all ${themeClasses.card}`}
             >
                <History size={48} />
             </div>
             <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Archives Under Development</h2>
             <p className={`${themeClasses.subtext} max-w-lg mx-auto leading-relaxed text-lg mb-10`}>
                Longitudinal data will be stored here to help parents visualize chronic asthma stability over long periods.
             </p>
             <button 
                onClick={() => { setActiveTab('dashboard'); handleInteraction('success'); }} 
                className={`px-10 py-5 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all ${theme === 'light' ? 'bg-[#1e3a8a] shadow-blue-900/10' : 'bg-blue-600 shadow-blue-900/30'} hover:opacity-90`}
             >
                Return to Live View
             </button>
          </div>
        )}
      </main>

      <footer className={`fixed bottom-0 left-0 lg:left-72 right-0 h-12 border-t px-10 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] z-40 transition-colors duration-300 ${themeClasses.footer}`}>
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> ENCRYPTED: ON</span>
           <span className={themeClasses.subtext}>|</span>
           <span className={themeClasses.subtext}>FIRMWARE: V3.2.0</span>
        </div>
        <div>HIKON MONITORING SOLUTIONS &copy; 2026</div>
      </footer>
    </div>
  );
};

// --- REFINED SUB-COMPONENTS ---

const NavItem = ({ icon, label, active, onClick, theme }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 active:scale-95 relative group ${
      active 
        ? (theme === 'light' ? 'bg-[#1e3a8a] text-white shadow-xl shadow-blue-900/10' : 'bg-blue-600 text-white shadow-xl shadow-blue-900/30') 
        : (theme === 'light' ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-700' : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-100')
    }`}
  >
    <span>{icon}</span>
    <span className={`hidden lg:block text-xs font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>
    {active && <div className="absolute right-3 w-1.5 h-1.5 bg-lime-400 rounded-full shadow-[0_0_8px_#a3e635]" />}
  </button>
);

const RiskBadge = ({ level, theme }) => {
  const styles = {
    safe: theme === 'light' ? "text-emerald-500 border-emerald-500/30 bg-emerald-50" : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    medium: theme === 'light' ? "text-amber-500 border-amber-500/30 bg-amber-50" : "text-amber-400 border-amber-500/20 bg-amber-500/10",
    high: theme === 'light' ? "text-rose-500 border-rose-500/30 bg-rose-50 animate-pulse" : "text-rose-400 border-rose-500/20 bg-rose-500/10 animate-pulse"
  };
  return (
    <div className={`px-4 py-1.5 rounded-xl border font-black uppercase text-[10px] tracking-widest ${styles[level] || styles.safe}`}>
      {(level || 'safe').toUpperCase()} RISK
    </div>
  );
};

const Reading = ({ label, value, unit, icon, smallValue, theme }) => (
  <div className="group cursor-default">
    <div className="flex items-center gap-2 mb-2 text-slate-400">
        <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${theme === 'light' ? 'bg-slate-50' : 'bg-slate-800'}`}>{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
        <span className={`${smallValue ? 'text-xl' : 'text-3xl'} font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'} transition-colors duration-300`}>{value}</span>
        <span className="text-xs font-bold text-slate-500">{unit}</span>
    </div>
  </div>
);

const ActionCard = ({ onClick, icon, title, desc, color, theme }) => (
  <button 
    onClick={onClick}
    className={`border rounded-[2rem] p-8 text-left transition-all hover:translate-y-[-4px] hover:shadow-xl active:scale-95 group ${theme === 'light' ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-[#1e293b] border-slate-700 shadow-black/20'}`}
  >
    <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
    </div>
    <h4 className={`text-lg font-black tracking-tight mb-2 uppercase text-sm tracking-widest ${theme === 'light' ? 'text-[#1e3a8a]' : 'text-blue-400'}`}>{title}</h4>
    <p className={`text-xs font-medium leading-relaxed ${theme === 'light' ? 'text-slate-400' : 'text-slate-400'}`}>{desc}</p>
  </button>
);

export default App;