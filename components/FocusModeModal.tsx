import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, PhoneMissed, Play, Pause, Zap, LogOut, RotateCcw, CheckCircle2, Target, BarChart3, Clock, Trophy, Sparkles, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FocusModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SessionState = 'config' | 'active' | 'paused' | 'finished';
type FocusMode = 'instant' | 'pro';

const PRESET_DURATIONS = [15, 30, 45, 60, 90];

// Preset obiettivi comuni
const GOAL_PRESETS = [
    { id: 'contracts', icon: '📋', label: 'Chiudere 3 contratti' },
    { id: 'revenue', icon: '💰', label: '€5000 questo mese' },
    { id: 'leads', icon: '🎯', label: '10 nuovi lead' }
];

export const FocusModeModal: React.FC<FocusModeModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    const CHECKLIST_ITEMS = [
        { id: 'silence', label: t('focus_mode.check_silence'), emoji: '📵' },
        { id: 'water', label: t('focus_mode.check_water'), emoji: '💧' },
        { id: 'focus', label: t('focus_mode.check_focus'), emoji: '🎯' }
    ];
    const [sessionState, setSessionState] = useState<SessionState>('config');
    const [mode, setMode] = useState<FocusMode>('pro'); // Default to PRO (consigliato)
    const [duration, setDuration] = useState(45); // Minutes
    const [timeLeft, setTimeLeft] = useState(45 * 60); // Seconds
    const [initialDuration, setInitialDuration] = useState(45 * 60); // To track total time for stats

    const [contactsOk, setContactsOk] = useState(0);
    const [attempts, setAttempts] = useState(0);

    // New Enhancement States
    const [goalText, setGoalText] = useState('');
    const [targetContacts, setTargetContacts] = useState(5); // Default target
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSessionState('config');
            setMode('instant'); // Default to Instant
            setDuration(45);
            setContactsOk(0);
            setAttempts(0);
            setGoalText('');
            setTargetContacts(5);
            setChecklist({});
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        if (sessionState === 'active' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (mode === 'pro') {
                            setSessionState('finished');
                        } else {
                            // Instant mode just stops or goes to finished? 
                            // User said "Instant Mode... quando fermi torni alla configurazione". 
                            // But if timer finishes naturally, maybe show a simple "Done" or just stop?
                            // Let's treat natural finish as a stop for Instant, or maybe a simple alert.
                            // For consistency with "Stop" button logic below, let's go to config for Instant
                            // But usually a finished timer needs acknowledgement. 
                            // Let's allow 'finished' state for Instant too but simpler UI? 
                            // Or just strictly follow "Stop returns to config".
                            // If timer runs out in instant mode, logical behavior is to beep and stop.
                            // For now let's set to finished, but modify the UI to be simple if Instant.
                            setSessionState('finished');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sessionState, timeLeft, mode]);

    const handleStartSession = () => {
        const seconds = duration * 60;
        setTimeLeft(seconds);
        setInitialDuration(seconds);
        setSessionState('active');
    };

    const togglePause = () => {
        setSessionState((prev) => (prev === 'active' ? 'paused' : 'active'));
    };

    const handleStopSession = () => {
        if (mode === 'pro') {
            // Pro Mode: Go to Recap (Finished)
            setSessionState('finished');
        } else {
            // Instant Mode: Reset triggers to Config
            handleReset();
        }
    };

    const handleReset = () => {
        setSessionState('config');
        setContactsOk(0);
        setAttempts(0);
        setChecklist({});
        // Keep goal/target/mode as user might want to retry
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleCheckitem = (id: string) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const allChecked = mode === 'instant' || CHECKLIST_ITEMS.every(item => checklist[item.id]);
    const progressPercentage = Math.min(100, Math.round((contactsOk / (targetContacts || 1)) * 100));

    // Stats Calculation
    const timeSpentSeconds = initialDuration - timeLeft;
    const timeSpentMinutes = Math.max(1, Math.round(timeSpentSeconds / 60));
    const contactsPerHour = timeSpentMinutes > 0 ? Math.round((contactsOk / timeSpentMinutes) * 60) : 0;
    const isGoalReached = contactsOk >= targetContacts;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-[#050B14] text-white flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Bar - MIGLIORATO */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-3 text-yellow-400">
                    <Zap className="fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" size={40} />
                    <div className="hidden sm:block">
                        <div className="text-xs font-bold opacity-60 uppercase tracking-wider">Focus Mode</div>
                        <div className="text-sm font-black">Session Timer</div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-sm font-bold uppercase tracking-wider hover:scale-105"
                >
                    {t('focus_mode.exit')}
                </button>
            </div>

            <div className="w-full max-w-md px-6 relative z-10 flex flex-col items-center h-full max-h-screen overflow-y-auto no-scrollbar py-20">

                {sessionState === 'config' && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-500 space-y-6">
                        <h2 className="text-gray-400 font-bold tracking-[0.2em] text-sm sm:text-base text-center uppercase">{t('focus_mode.config_title')}</h2>

                        {/* Mode Toggle - MIGLIORATO */}
                        <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/10 w-full max-w-md gap-1.5">
                            <button
                                onClick={() => setMode('instant')}
                                className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${mode === 'instant' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <Zap size={14} className={mode === 'instant' ? 'fill-black' : ''} />
                                    <span className="text-xs opacity-70">Veloce</span>
                                </div>
                                <div className="text-sm font-black">{t('focus_mode.mode_instant')}</div>
                                <div className="text-[10px] opacity-60 font-normal">Setup base</div>
                            </button>
                            <button
                                onClick={() => setMode('pro')}
                                className={`flex-1 py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 relative ${mode === 'pro' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-orange-500/30' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            >
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">CONSIGLIATO</div>
                                <div className="flex items-center gap-1.5">
                                    <Trophy size={14} className={mode === 'pro' ? 'fill-black' : ''} />
                                    <span className="text-xs opacity-70">Premium</span>
                                </div>
                                <div className="text-sm font-black">{t('focus_mode.mode_pro')}</div>
                                <div className="text-[10px] opacity-60 font-normal">Tutte le funzioni</div>
                            </button>
                        </div>

                        {/* PRO MODE: Goal Input - MIGLIORATO CON PRESET */}
                        {mode === 'pro' && (
                            <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('focus_mode.goal_label')}</label>

                                    {/* Preset Obiettivi */}
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        {GOAL_PRESETS.map(preset => (
                                            <button
                                                key={preset.id}
                                                onClick={() => setGoalText(preset.label)}
                                                className={`p-3 rounded-lg text-left transition-all border ${goalText === preset.label
                                                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="text-lg mb-1">{preset.icon}</div>
                                                <div className="text-xs font-bold leading-tight">{preset.label}</div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Oppure scrivi il tuo obiettivo..."
                                            value={goalText}
                                            onChange={(e) => setGoalText(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">{t('focus_mode.target_label')}</label>

                                    {/* Slider + Pulsanti */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => setTargetContacts(p => Math.max(1, p - 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold transition-all hover:scale-110">-</button>
                                            <div className="flex-1 text-center font-black text-4xl tabular-nums text-cyan-400">{targetContacts}</div>
                                            <button onClick={() => setTargetContacts(p => p + 1)} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold transition-all hover:scale-110">+</button>
                                        </div>

                                        {/* Progress Bar Difficoltà */}
                                        <div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="20"
                                                value={targetContacts}
                                                onChange={(e) => setTargetContacts(Number(e.target.value))}
                                                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                                                style={{
                                                    background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(234 179 8) 50%, rgb(239 68 68) 100%)`
                                                }}
                                            />
                                            <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                                                <span>Facile</span>
                                                <span className={targetContacts >= 4 && targetContacts <= 7 ? 'text-green-400 font-bold' : ''}>Ottimale ✓</span>
                                                <span>Ambizioso</span>
                                            </div>
                                        </div>

                                        {/* Tempo Stimato */}
                                        <div className="text-center text-xs text-gray-400">
                                            ⏱️ Tempo stimato: ~{targetContacts <= 3 ? '1' : targetContacts <= 7 ? '2' : targetContacts <= 12 ? '3' : '4+'} ore
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Duration Selector - MIGLIORATO CON COUNTDOWN PREVIEW */}
                        <div className="flex flex-col items-center gap-3">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('focus_mode.duration_label')}</label>
                            <div className="flex items-center justify-center gap-6">
                                <button
                                    onClick={() => setDuration(prev => Math.max(5, prev - 5))}
                                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-xl font-light text-gray-400 hover:text-white"
                                >
                                    -
                                </button>
                                <div className="text-center w-32">
                                    <div className="text-7xl font-black tracking-tighter tabular-nums leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{duration}</div>
                                    <div className="text-gray-500 font-medium text-xs uppercase tracking-widest mt-1">{t('focus_mode.minutes')}</div>
                                    {/* Countdown Preview */}
                                    <div className="text-cyan-400 text-xs mt-2 flex items-center justify-center gap-1">
                                        <Clock size={12} className="animate-pulse" />
                                        Termina alle {new Date(Date.now() + duration * 60000).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDuration(prev => Math.min(180, prev + 5))}
                                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-xl font-light text-gray-400 hover:text-white"
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-center mt-2">
                                {PRESET_DURATIONS.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setDuration(p)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${duration === p
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-110'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:scale-105'
                                            }`}
                                    >
                                        {p}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PRO MODE: Pre-flight Checklist - MIGLIORATO CON EMOJI E PROGRESS */}
                        {mode === 'pro' && (
                            <div className="w-full bg-white/5 rounded-2xl p-5 border border-white/10 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <CheckCircle2 size={14} /> {t('focus_mode.checklist_title')}
                                    </h3>
                                    <div className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold border border-cyan-500/30">
                                        {Object.values(checklist).filter(Boolean).length}/{CHECKLIST_ITEMS.length} ✓
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {CHECKLIST_ITEMS.map(item => (
                                        <div key={item.id}
                                            onClick={() => toggleCheckitem(item.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${checklist[item.id]
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/30 scale-[1.02]'
                                                    : 'bg-black/20 text-gray-400 border border-transparent hover:bg-black/30 hover:border-white/10'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checklist[item.id]
                                                    ? 'bg-green-500 border-green-500 text-black scale-110'
                                                    : 'border-gray-600'
                                                }`}>
                                                {checklist[item.id] && <CheckCircle2 size={14} strokeWidth={4} />}
                                            </div>
                                            <span className="text-2xl">{item.emoji}</span>
                                            <span className="text-sm font-medium flex-1">{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Start Button - MIGLIORATO CON ICONA RAZZO */}
                        <div className="w-full space-y-2">
                            <button
                                onClick={handleStartSession}
                                disabled={!allChecked}
                                className={`w-full py-5 rounded-2xl font-black text-xl transition-all uppercase tracking-wide flex items-center justify-center gap-3 ${allChecked
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:shadow-[0_0_60px_rgba(34,197,94,0.7)] hover:scale-[1.03] text-white cursor-pointer'
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                                    }`}
                            >
                                {mode === 'pro' && !allChecked && <span className="text-xs mr-1 opacity-70">{t('focus_mode.complete_checklist')}</span>}
                                <Rocket size={24} className={allChecked ? 'animate-bounce' : ''} />
                                <span>🚀 INIZIA SESSIONE FOCUS</span>
                            </button>
                            <div className="text-center text-xs text-gray-500 opacity-60">
                                Premi ESC in qualsiasi momento per uscire
                            </div>
                        </div>
                    </div>
                )}

                {(sessionState === 'active' || sessionState === 'paused') && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-500">

                        {/* PRO MODE: Session Goal Header */}
                        {mode === 'pro' && (
                            <div className="w-full text-center mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                                <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">{t('focus_mode.session_goal')}</div>
                                <div className="text-xl sm:text-2xl font-bold text-white leading-tight">"{goalText || t('focus_mode.generic')}"</div>
                                <div className="mt-2 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider flex justify-between">
                                    <span>0</span>
                                    <span className={isGoalReached ? "text-green-400 font-bold" : ""}>{t('focus_mode.target')} {targetContacts}</span>
                                </div>
                            </div>
                        )}

                        {/* Timer Display */}
                        <div
                            className="cursor-pointer group relative mb-2"
                            onClick={togglePause}
                        >
                            <div className={`text-[7rem] sm:text-[9rem] font-black tracking-tighter tabular-nums leading-none select-none transition-all ${sessionState === 'paused' ? 'opacity-50 blur-sm' : 'opacity-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}>
                                {formatTime(timeLeft)}
                            </div>
                            {sessionState === 'paused' && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="w-24 h-24 fill-white text-white drop-shadow-2xl" />
                                </div>
                            )}
                        </div>

                        <div
                            onClick={togglePause}
                            className={`text-sm font-bold tracking-widest uppercase mb-8 cursor-pointer transition-colors ${sessionState === 'paused' ? 'text-yellow-500 animate-pulse' : 'text-cyan-500 hover:text-cyan-400'
                                }`}
                        >
                            {sessionState === 'paused' ? t('focus_mode.paused') : t('focus_mode.active')}
                        </div>

                        {/* Counters */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-6">
                            <div className={`bg-white/5 border rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-all ${mode === 'pro' && isGoalReached ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-white/10 hover:border-cyan-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 ${mode === 'pro' && isGoalReached ? 'from-green-500 to-emerald-500' : 'from-cyan-500 to-blue-500'}`}></div>
                                <div className={`text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300 ${mode === 'pro' && isGoalReached ? 'text-green-400' : 'text-cyan-400'}`}>{contactsOk}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('focus_mode.contacts_ok')}</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"></div>
                                <div className="text-5xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">{attempts}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('focus_mode.attempts')}</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                            <button
                                onClick={() => setAttempts(prev => prev + 1)}
                                className="py-4 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/10 rounded-xl font-bold text-gray-300 uppercase tracking-wide transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <PhoneMissed size={20} className="opacity-70" />
                                <span className="text-sm">{t('focus_mode.not_answered')}</span>
                            </button>
                            <button
                                onClick={() => setContactsOk(prev => prev + 1)}
                                className="py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-black text-white uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Phone size={20} className="fill-white" />
                                <span className="text-sm">{t('focus_mode.answered')}</span>
                            </button>
                        </div>

                        {/* Stop Button */}
                        <button
                            onClick={handleStopSession}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 mb-4 group"
                        >
                            <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" /> {t('focus_mode.stop_btn')}
                        </button>
                    </div>
                )}

                {sessionState === 'finished' && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-500">
                        {/* If Instant Mode, just simple finished or redirect logic. 
                            However, in handleStopSession for Instant we go to config. 
                            So if we are here in 'finished', it means timer ran out naturally or we are in Pro mode.
                        */}
                        {mode === 'pro' ? (
                            <>
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 rounded-full"></div>
                                    <Trophy size={80} className="text-yellow-400 relative z-10 drop-shadow-lg" />
                                </div>

                                <h2 className="text-3xl font-black text-white text-center mb-2">{t('focus_mode.completed_title')}</h2>
                                <p className="text-gray-400 font-medium mb-8 text-center max-w-xs">{isGoalReached ? t('focus_mode.goal_reached_msg') : t('focus_mode.goal_missed_msg')}</p>

                                <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 relative overflow-hidden">
                                    {isGoalReached && <div className="absolute -right-4 -top-4 bg-green-500 text-black text-[10px] font-black px-4 py-2 rotate-12 shadow-lg">{t('focus_mode.goal_reached_badge')}</div>}

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Target size={12} /> {t('focus_mode.goal')}</div>
                                            <div className="text-lg font-bold text-white leading-tight">{goalText || t('focus_mode.generic')}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12} /> {t('focus_mode.duration_label')}</div>
                                            <div className="text-lg font-bold text-white">{timeSpentMinutes} min</div>
                                        </div>
                                        <div className="col-span-2 h-px bg-white/10"></div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{t('focus_mode.contacts_ok')}</div>
                                            <div className="text-3xl font-black text-cyan-400">{contactsOk} <span className="text-sm font-normal text-gray-500">/ {targetContacts}</span></div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><BarChart3 size={12} /> {t('focus_mode.rhythm')}</div>
                                            <div className="text-xl font-bold text-purple-400">{contactsPerHour} <span className="text-xs font-normal text-gray-500">/ ora</span></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Instant Mode Finished - Simple View */}
                                <div className="relative mb-8">
                                    <Sparkles size={80} className="text-cyan-400 relative z-10 drop-shadow-lg" />
                                </div>
                                <h2 className="text-3xl font-black text-white text-center mb-2">{t('focus_mode.time_up_title')}</h2>
                                <p className="text-gray-400 font-medium mb-8 text-center">{t('focus_mode.instant_finished_msg')}</p>
                                <div className="text-2xl font-bold mb-8">
                                    {t('focus_mode.registered')} <span className="text-cyan-400">{contactsOk}</span> {t('focus_mode.contacts_useful')}
                                </div>
                            </>
                        )}


                        <button
                            onClick={handleReset}
                            className="w-full py-4 bg-white text-black rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wide"
                        >
                            {t('focus_mode.new_session')}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
