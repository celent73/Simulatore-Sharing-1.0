import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, PhoneMissed, Play, Pause, Zap, LogOut, RotateCcw } from 'lucide-react';

interface FocusModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SessionState = 'config' | 'active' | 'paused' | 'finished';

const PRESET_DURATIONS = [15, 30, 45, 60, 90];

export const FocusModeModal: React.FC<FocusModeModalProps> = ({ isOpen, onClose }) => {
    const [sessionState, setSessionState] = useState<SessionState>('config');
    const [duration, setDuration] = useState(45); // Minutes
    const [timeLeft, setTimeLeft] = useState(45 * 60); // Seconds

    const [contactsOk, setContactsOk] = useState(0);
    const [attempts, setAttempts] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSessionState('config');
            setDuration(45);
            setContactsOk(0);
            setAttempts(0);
        } else {
            // Stop timer if closed
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        if (sessionState === 'active' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setSessionState('finished');
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
    }, [sessionState, timeLeft]);

    const handleStartSession = () => {
        setTimeLeft(duration * 60);
        setSessionState('active');
    };

    const togglePause = () => {
        setSessionState((prev) => (prev === 'active' ? 'paused' : 'active'));
    };

    const handleStopSession = () => {
        setSessionState('config');
        setContactsOk(0);
        setAttempts(0);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-[#050B14] text-white flex flex-col items-center justify-center animate-in fade-in duration-300">
            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <div className="flex items-center gap-2 text-yellow-400">
                    <Zap className="fill-yellow-400" size={28} />
                    {/* <span className="font-bold tracking-wider text-sm opacity-80">FOCUS MODE</span> */}
                </div>
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-sm font-bold uppercase tracking-wider"
                >
                    Esci
                </button>
            </div>

            <div className="w-full max-w-md px-6 relative z-10 flex flex-col items-center">

                {sessionState === 'config' && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-500">
                        <h2 className="text-gray-400 font-bold tracking-[0.2em] text-xs sm:text-sm mb-10 text-center uppercase">CONFIGURAZIONE SESSIONE</h2>

                        {/* Duration Selector */}
                        <div className="flex items-center justify-center gap-8 mb-4">
                            <button
                                onClick={() => setDuration(prev => Math.max(5, prev - 5))}
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-2xl font-light text-gray-400 hover:text-white"
                            >
                                -
                            </button>
                            <div className="text-center">
                                <div className="text-8xl font-black tracking-tighter tabular-nums leading-none mb-2">{duration}</div>
                                <div className="text-gray-500 font-medium text-lg">min</div>
                            </div>
                            <button
                                onClick={() => setDuration(prev => Math.min(180, prev + 5))}
                                className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-2xl font-light text-gray-400 hover:text-white"
                            >
                                +
                            </button>
                        </div>

                        {/* Presets */}
                        <div className="flex gap-2 mb-12 flex-wrap justify-center">
                            {PRESET_DURATIONS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setDuration(p)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${duration === p
                                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {p}m
                                </button>
                            ))}
                        </div>

                        {/* Start Button */}
                        <button
                            onClick={handleStartSession}
                            className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-95 transition-all text-black uppercase tracking-wide"
                        >
                            Avvia Sessione
                        </button>

                        <p className="mt-6 text-xs text-white/20 font-mono">MODALITÀ ALTA PERFORMANCE</p>
                    </div>
                )}

                {(sessionState === 'active' || sessionState === 'paused' || sessionState === 'finished') && (
                    <div className="flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-500">

                        {/* Timer Display */}
                        <div
                            className="cursor-pointer group relative mb-2"
                            onClick={togglePause}
                        >
                            <div className={`text-[8rem] sm:text-[10rem] font-black tracking-tighter tabular-nums leading-none select-none transition-all ${sessionState === 'paused' ? 'opacity-50 blur-sm' : 'opacity-100 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}>
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
                            className={`text-sm font-bold tracking-widest uppercase mb-12 cursor-pointer transition-colors ${sessionState === 'paused' ? 'text-yellow-500 animate-pulse' : 'text-cyan-500 hover:text-cyan-400'
                                }`}
                        >
                            {sessionState === 'paused' ? 'SESSIONE IN PAUSA (CLICCA PER RIPRENDERE)' : 'FOCUS ATTIVO (CLICCA PER PAUSA)'}
                        </div>

                        {/* Counters */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50"></div>
                                <div className="text-5xl font-black text-cyan-400 mb-2 group-hover:scale-110 transition-transform duration-300">{contactsOk}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contatti OK</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-purple-500/30 transition-all">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-50"></div>
                                <div className="text-5xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">{attempts}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tentativi</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-4 w-full mb-8">
                            <button
                                onClick={() => setAttempts(prev => prev + 1)}
                                className="py-4 bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/10 rounded-xl font-bold text-gray-300 uppercase tracking-wide transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <PhoneMissed size={20} className="opacity-70" />
                                <span className="text-sm">Non Risposto</span>
                            </button>
                            <button
                                onClick={() => setContactsOk(prev => prev + 1)}
                                className="py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-black text-white uppercase tracking-wide transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Phone size={20} className="fill-white" />
                                <span className="text-sm">Risposto</span>
                            </button>
                        </div>

                        {/* Stop Button */}
                        <button
                            onClick={handleStopSession}
                            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 mb-4 group"
                        >
                            <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" /> Termina Sessione
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};
