import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, Users, Share2, TrendingUp, Building, Tv, Wallet, ShieldCheck, ChevronRight, ChevronLeft, Apple, Play, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SharingNetworkAnimation } from './SharingNetworkAnimation';

interface UnionEcosystemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UnionEcosystemModal: React.FC<UnionEcosystemModalProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [step, setStep] = useState(0);

    // Reset step when opening
    useEffect(() => {
        if (isOpen) setStep(0);
    }, [isOpen]);

    if (!isOpen) return null;

    const steps = [
        {
            id: 'welcome',
            title: language === 'it' ? 'Benvenuto' : 'Willkommen',
        },
        {
            id: 'tradition_vs_innovation',
            title: language === 'it' ? 'La Rivoluzione' : 'Die Revolution',
        },
        {
            id: 'cashback',
            title: language === 'it' ? 'Cashback' : 'Cashback',
        },
        {
            id: 'sharing',
            title: language === 'it' ? 'Sharing' : 'Sharing',
        },
        {
            id: 'total_vision',
            title: language === 'it' ? 'Ecosistema Union' : 'Union Ökosystem',
        },
        {
            id: 'summary_circle',
            title: language === 'it' ? 'Inizia Ora' : 'Starten',
        }
    ];

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 sm:p-4 overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    {/* Progress Indicators */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-[110]">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === step ? 'w-8 bg-union-orange-500' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="w-full h-full max-w-6xl mx-auto flex flex-col relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Main Content Area */}

                        {/* Special case for Sharing Animation to be full screen background */}
                        <AnimatePresence>
                            {step === 3 && (
                                <motion.div
                                    className="absolute inset-0 z-0"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <SharingNetworkAnimation />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent z-10 pointer-events-none">
                            {/* Allow pointer events only on interactive elements inside steps */}
                            <div className="w-full flex-grow flex flex-col justify-center py-4 pointer-events-auto">
                                <AnimatePresence mode="wait">
                                    {step === 0 && <Step0Welcome key="step0" language={language} onNext={nextStep} />}
                                    {step === 1 && <Step1TraditionVsInnovation key="step1" language={language} />}
                                    {step === 2 && <Step2Cashback key="step2" language={language} />}
                                    {step === 3 && <Step3Sharing key="step3" language={language} />}
                                    {step === 4 && <Step4TotalVision key="step4" language={language} onClose={onClose} />}
                                    {step === 5 && <Step5SummaryCircleFinal key="step5" language={language} onClose={onClose} />}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="h-20 flex justify-between items-center px-6 w-full max-w-4xl mx-auto z-[110]">
                            <button
                                onClick={prevStep}
                                disabled={step === 0}
                                className={`flex items-center gap-2 text-white/60 hover:text-white transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            >
                                <ChevronLeft size={24} />
                                <span className="text-sm uppercase tracking-wider font-bold">Back</span>
                            </button>

                            {step < steps.length - 1 && (
                                <button
                                    onClick={nextStep}
                                    className="group flex items-center gap-3 bg-gradient-to-r from-union-blue-600 to-cyan-500 text-white px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(0,119,200,0.5)] hover:shadow-[0_0_30px_rgba(0,119,200,0.8)] hover:scale-105 transition-all"
                                >
                                    <span className="uppercase tracking-wider text-sm">{language === 'it' ? 'Scopri' : 'Entdecken'}</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- STEP COMPONENTS ---

const Step0Welcome = ({ language, onNext }: { language: 'it' | 'de', onNext: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-center mb-8 relative z-20 max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_0_60px_rgba(0,119,200,0.4)]">
                        <img src="/logo_new.png" alt="Logo" className="w-24 md:w-36 object-contain drop-shadow-lg" />
                    </div>
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {language === 'it' ? 'BENVENUTO' : 'WILLKOMMEN'}
                </motion.h1>
                <motion.h2
                    className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-union-blue-400 to-cyan-400 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    The Future of Energy
                </motion.h2>
                <motion.p
                    className="text-gray-300 text-lg md:text-xl leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {language === 'it'
                        ? 'Scopri come trasformare le tue utenze da una spesa obbligatoria ad una fonte di guadagno.'
                        : 'Entdecken Sie, wie Sie Ihre Versorgungsleistungen von einer obligatorischen Ausgabe in eine Einnahmequelle verwandeln.'}
                </motion.p>
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <button
                    onClick={onNext}
                    className="group flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
                >
                    <span>{language === 'it' ? 'Inizia il Viaggio' : 'Reise beginnen'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
        </motion.div>
    );
};

const Step1TraditionVsInnovation = ({ language }: { language: 'it' | 'de' }) => {
    return (
        <motion.div
            className="w-full flex flex-col md:flex-row gap-6 md:gap-12 items-center justify-center p-4 max-w-6xl mx-auto relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
        >
            {/* BACKGROUND DECORATION */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-union-blue-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* TRADITION CARD - OLD ECONOMY */}
            <div className="flex-1 flex flex-col items-center justify-center relative group w-full">
                <div className="relative z-10 bg-[#0a0a0a]/80 border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-3xl grayscale opacity-100 transition-all duration-700 w-full max-w-sm border-l-red-500/30 shadow-2xl overflow-hidden">

                    {/* Floating "Waste" Particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-red-500/30 rounded-full"
                                initial={{ x: Math.random() * 100 + "%", y: "110%", opacity: 0 }}
                                animate={{ y: "-10%", opacity: [0, 0.5, 0] }}
                                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                            />
                        ))}
                    </div>

                    <div className="text-center mb-10">
                        <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block w-fit mx-auto border border-white/10">
                            OLD ECONOMY
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Tradizionale</h2>
                        <p className="text-[10px] text-red-500/70 font-bold tracking-tighter uppercase italic">Costi che paghi tu</p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-red-500/10 rounded-2xl border border-white/10 text-gray-300">
                                <Building size={22} />
                            </div>
                            <div>
                                <p className="font-bold text-white">Strutture Pesanti</p>
                                <p className="text-xs text-gray-200 leading-relaxed italic">"Affitti e uffici di lusso gonfiano il prezzo della tua bolletta."</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-red-500/10 rounded-2xl border border-white/10 text-gray-300">
                                <Tv size={22} />
                            </div>
                            <div>
                                <p className="font-bold text-white">Marketing Cieco</p>
                                <p className="text-xs text-gray-200 leading-relaxed italic">"Milioni regalati ai Giganti Web invece di premiare il cliente."</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-5">
                            <div className="p-3 bg-red-500/10 rounded-2xl border border-white/10 text-gray-300">
                                <Zap size={22} opacity={0.8} />
                            </div>
                            <div>
                                <p className="font-bold text-white">Call Center Invasivi</p>
                                <p className="text-xs text-gray-200 leading-relaxed italic">"Aggressività commerciale che paghi con costi di gestione elevati."</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 text-center">
                        <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase">BILANCIO ECONOMICO</p>
                        <p className="text-red-500 font-black text-xl md:text-2xl mt-1 opacity-60 line-through">UTILE AL CLIENTE</p>
                    </div>
                </div>
            </div>

            {/* VS Badge - Animated Pulse */}
            <div className="relative z-20 flex flex-col items-center justify-center py-4 md:py-0">
                <motion.div
                    className="w-16 h-16 rounded-full bg-white text-black font-black flex items-center justify-center text-xl shadow-[0_0_40px_rgba(255,255,255,0.4)] relative border-[6px] border-[#050510]"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    VS
                </motion.div>
            </div>

            {/* INNOVATION CARD - NEW ECONOMY */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                <motion.div
                    className="absolute inset-0 bg-union-blue-600/25 blur-[100px] rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                <motion.div
                    className="relative z-10 bg-gradient-to-br from-[#0c1e35]/90 to-[#050510]/98 border border-union-blue-400/50 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-[0_0_80px_-20px_rgba(0,119,200,0.6)] w-full max-w-sm overflow-hidden group"
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                    {/* Floating "Value" Particles (Coins) */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1.5 h-1.5 bg-union-green-400 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                                initial={{ x: Math.random() * 100 + "%", y: "110%", opacity: 0 }}
                                animate={{ y: "-10%", opacity: [0, 1, 0], rotate: 360 }}
                                transition={{ duration: Math.random() * 2 + 1.5, repeat: Infinity, delay: Math.random() * 3 }}
                            />
                        ))}
                    </div>

                    {/* Animated Shine Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out skew-x-12" />

                    <div className="text-center mb-10">
                        <span className="px-4 py-1.5 rounded-full bg-union-blue-500 text-white font-black tracking-[0.2em] text-[10px] uppercase mb-4 block w-fit mx-auto shadow-[0_0_20px_rgba(0,119,200,0.5)] border border-white/20">
                            NEW ECONOMY
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Union Energy</h2>
                        <div className="h-1.5 w-20 bg-gradient-to-r from-union-blue-500 to-union-orange-500 mx-auto rounded-full mt-3" />
                    </div>

                    <div className="space-y-8">
                        <motion.div className="flex items-start gap-5">
                            <div className="p-3 bg-union-blue-500/30 text-union-blue-400 rounded-2xl border border-union-blue-400/30 shadow-lg glow">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="font-black text-white text-lg">Power to People</p>
                                <p className="text-xs text-blue-100 leading-relaxed font-medium">Digitali, smart e veloci: tagliamo i costi inutili per premiare te.</p>
                            </div>
                        </motion.div>

                        <motion.div className="flex items-start gap-5">
                            <div className="p-3 bg-union-orange-500/30 text-union-orange-400 rounded-2xl border border-union-orange-400/30 shadow-lg glow">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <p className="font-black text-white text-lg">Sharing Engine</p>
                                <p className="text-xs text-blue-100 leading-relaxed font-medium">Il marketing sei tu. Ogni condivisione abbatte la tua spesa reale.</p>
                            </div>
                        </motion.div>

                        <motion.div className="flex items-start gap-5">
                            <div className="p-3 bg-union-green-500/30 text-union-green-400 rounded-2xl border border-union-green-400/30 shadow-lg glow">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="font-black text-union-green-400 text-lg uppercase">Cashback Reale</p>
                                <p className="text-xs text-blue-100 leading-relaxed font-medium">Zero intermediari: il risparmio di filiera è il tuo guadagno mensile.</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-union-blue-500/30 text-center">
                        <p className="text-union-blue-300 font-bold text-xs tracking-widest uppercase mb-1">IL TUO RISULTATO</p>
                        <motion.div
                            className="text-[#00FF00] font-black text-2xl md:text-3xl drop-shadow-[0_0_15px_rgba(0,255,0,0.6)]"
                            animate={{ scale: [1, 1.1, 1], rotate: [-1, 1, -1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            BOLLETTA &rarr; ZERO
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Step2Cashback = ({ language }: { language: 'it' | 'de' }) => {
    const [price, setPrice] = useState(100);
    const [showBadge, setShowBadge] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setPrice(prev => {
                    if (prev <= 70) {
                        clearInterval(interval);
                        setShowBadge(true);
                        setIsComplete(true);
                        return 70;
                    }
                    return prev - 1;
                });
            }, 30);
            return () => clearInterval(interval);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="w-full flex flex-col items-center justify-center relative p-4 max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
        >
            <div className="text-center mb-6 relative z-20">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2">
                    <span className="text-union-green-400">Cashback</span> Immediato
                </h2>
                <p className="text-gray-300 text-sm md:text-base">Ogni tua spesa genera valore. Subito.</p>
            </div>

            <motion.div
                className="w-full bg-gradient-to-b from-gray-900/80 to-gray-800/80 p-6 md:p-8 rounded-3xl border border-union-green-500/30 relative group shadow-[0_0_50px_-10px_rgba(34,197,94,0.2)]"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Background Sparkles when complete */}
                {isComplete && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-union-green-400 rounded-full"
                                initial={{
                                    x: "50%",
                                    y: "50%",
                                    scale: 0,
                                    opacity: 1
                                }}
                                animate={{
                                    x: `${Math.random() * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    scale: [0, 1.5, 0],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: Math.random() * 2 + 1,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Wallet className="w-32 h-32" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center text-center">
                    <motion.div
                        className="w-20 h-20 rounded-full bg-union-green-500/20 flex items-center justify-center text-union-green-400 mb-6 border border-union-green-500/40 relative"
                        animate={isComplete ? {
                            boxShadow: ["0 0 20px rgba(34,197,94,0)", "0 0 50px rgba(34,197,94,0.7)", "0 0 20px rgba(34,197,94,0)"],
                            scale: [1, 1.15, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Wallet size={40} className={isComplete ? "text-white" : "text-union-green-400"} />
                        <AnimatePresence>
                            {isComplete && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute -top-1 -right-1 bg-union-green-500 text-black rounded-full p-1 border-4 border-gray-900"
                                >
                                    <CheckCircle2 size={20} fill="black" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <h3 className="text-3xl font-bold text-white mb-2">Recupera Spese</h3>
                    <p className="text-gray-400 mb-8 text-sm md:text-base leading-relaxed">
                        Il sistema ti premia per le tue abitudini quotidiane. Trasforma le bollette in credito.
                    </p>

                    <div className="w-full relative">
                        <AnimatePresence>
                            {showBadge && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -25, opacity: 0, x: 20 }}
                                    animate={{ scale: 1, rotate: -12, opacity: 1, x: 0 }}
                                    className="absolute -top-4 -right-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-[0_4px_15px_rgba(220,38,38,0.5)] z-30 uppercase tracking-tighter"
                                >
                                    -30% SCONTO
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="bg-black/40 p-5 rounded-2xl border border-union-green-500/20 w-full backdrop-blur-sm relative">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-400">Esempio Bolletta</span>
                                <span className="text-base text-red-500/80 font-mono line-through">€100</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-base text-gray-300 font-bold">Tuo Costo Reale</span>
                                <div className="flex items-baseline gap-1">
                                    <motion.span
                                        key={price}
                                        className={`text-3xl font-mono font-black ${isComplete ? 'text-[#00FF00]' : 'text-white'}`}
                                    >
                                        €{price}
                                    </motion.span>
                                    {isComplete && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00FF00] text-xs font-black uppercase">RISPARMIATO!</motion.span>}
                                </div>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-union-green-600 via-union-green-400 to-emerald-300"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "30%" }}
                                    transition={{
                                        delay: 1.2,
                                        duration: 1.2,
                                        ease: [0.34, 1.56, 0.64, 1]
                                    }}
                                />
                                {isComplete && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-20 h-full"
                                        animate={{ x: ["-100%", "500%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                    />
                                )}
                            </div>

                            <p className={`text-xs mt-3 font-bold flex items-center justify-center gap-1 transition-colors duration-500 ${isComplete ? 'text-union-green-400' : 'text-gray-500'}`}>
                                <Zap size={10} fill="currentColor" className={isComplete ? "animate-pulse" : ""} />
                                {isComplete ? '30% RISPARMIO APPLICATO' : 'CALCOLO RISPARMIO IN CORSO...'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step3Sharing = ({ language }: { language: 'it' | 'de' }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-between p-4 md:p-8 relative pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
        >
            {/* Top Technology Overlay - Higher and more subtle */}
            <motion.div
                className="absolute top-10 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div className="bg-union-blue-900/40 border border-union-blue-400/40 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(0,194,255,0.2)]">
                    <div className="w-2 h-2 bg-union-blue-400 rounded-full animate-ping" />
                    <span className="text-white font-bold text-[10px] uppercase tracking-[0.2em] drop-shadow-sm">Digital Network Monitoring &bull; Live</span>
                </div>
            </motion.div>

            {/* Side Panels - Moved outward to clear the center */}
            <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                {/* Left Info Panel */}
                <motion.div
                    className="max-w-[240px] space-y-4 hidden lg:block"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                >
                    <div className="bg-black/80 border border-white/20 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-l-union-blue-500/60 transition-all">
                        <div className="bg-union-blue-500/30 w-10 h-10 rounded-xl flex items-center justify-center text-union-blue-300 mb-4 border border-union-blue-500/30">
                            <Users size={20} />
                        </div>
                        <h4 className="text-white font-black text-sm mb-2 uppercase tracking-tight">Community Asset</h4>
                        <p className="text-[11px] text-gray-100 leading-relaxed font-bold">Ogni persona che inviti non è solo un cliente, ma un mattone della tua libertà finanziaria.</p>
                    </div>
                    <div className="bg-black/80 border border-white/20 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-l-union-orange-500/60 transition-all">
                        <div className="bg-union-orange-500/30 w-10 h-10 rounded-xl flex items-center justify-center text-union-orange-300 mb-4 border border-union-orange-500/30">
                            <Zap size={20} />
                        </div>
                        <h4 className="text-white font-black text-sm mb-2 uppercase tracking-tight">Efficienza Green</h4>
                        <p className="text-[11px] text-gray-100 leading-relaxed font-bold">L'energia che condividi è 100% sostenibile e trasforma il consumo in valore.</p>
                    </div>
                </motion.div>

                {/* Right Info Panel */}
                <motion.div
                    className="max-w-[240px] space-y-4 hidden lg:block text-right"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                >
                    <div className="bg-black/80 border border-white/20 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-r-union-green-500/60 transition-all">
                        <div className="bg-union-green-500/30 w-10 h-10 rounded-xl flex items-center justify-center text-union-green-400 mb-4 ml-auto border border-union-green-500/30">
                            <TrendingUp size={20} />
                        </div>
                        <h4 className="text-white font-black text-sm mb-2 uppercase tracking-tight">Rendita Passiva</h4>
                        <p className="text-[11px] text-gray-100 leading-relaxed font-bold">Il sistema lavora h24. Più la rete cresce, più il tuo cashback mensile diventa solido.</p>
                    </div>
                    <div className="bg-black/80 border border-white/20 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-r-union-blue-500/60 transition-all">
                        <div className="bg-union-blue-500/30 w-10 h-10 rounded-xl flex items-center justify-center text-union-blue-300 mb-4 ml-auto border border-union-blue-500/30">
                            <Share2 size={20} />
                        </div>
                        <h4 className="text-white font-black text-sm mb-2 uppercase tracking-tight">Potenza Sociale</h4>
                        <p className="text-[11px] text-gray-100 leading-relaxed font-bold">Usa il potere del passaparola per azzerare le tue spese per sempre.</p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Content Area - Pinned to the very bottom */}
            <motion.div
                className="absolute bottom-10 left-0 right-0 text-center bg-gradient-to-t from-black via-black/40 to-transparent p-6 pointer-events-auto z-20"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
            >
                <h2 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight tracking-tighter">
                    Il Tuo Network è un <span className="text-transparent bg-clip-text bg-gradient-to-r from-union-blue-400 via-white to-union-orange-400">Impero Digitale</span>
                </h2>

                <p className="text-gray-100 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-bold opacity-80 mb-3">
                    Trasforma ogni connessione in un flusso di cassa costante.
                </p>

                <div className="text-transparent bg-clip-text bg-gradient-to-r from-union-orange-400 to-red-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-sm animate-pulse">
                    CONDIVIDI. COLLEGA. AZZERA.
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step4TotalVision = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Background Pulse */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-union-blue-900/40 to-transparent rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10 text-center mb-6 md:mb-10 px-4">
                <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-cyan-400 mb-3 md:mb-4 drop-shadow-2xl">
                    ECOSISTEMA UNION
                </h2>
                <p className="text-sm md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    L'unica piattaforma che trasforma le tue spese obbligatorie in libertà finanziaria.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl px-4">
                <FeatureCard
                    icon={<Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />}
                    title="Luce & Gas"
                    desc="Energia Green con i prezzi più competitivi del mercato"
                    delay={0.2}
                />
                <FeatureCard
                    icon={<Share2 className="w-6 h-6 md:w-8 md:h-8 text-union-blue-400" />}
                    title="Sharing"
                    desc="Condivisione che genera valore"
                    delay={0.4}
                    isCenter={true}
                />
                <FeatureCard
                    icon={<TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-union-green-400" />}
                    title="Rendita"
                    desc="Un futuro senza pensieri"
                    delay={0.6}
                />
            </div>

        </motion.div>
    );
};

const Step5SummaryCircleFinal = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] flex items-center justify-center my-4 md:my-8">

                {/* Background Reactor Glows */}
                <motion.div
                    className="absolute inset-0 bg-union-blue-500/5 rounded-full blur-3xl z-0"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Orbital Rings - Dynamic Tech feel */}
                <motion.div
                    className="absolute inset-0 border border-dashed border-union-blue-500/30 rounded-full z-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-8 md:inset-12 border border-dotted border-union-orange-500/20 rounded-full z-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />

                {/* Energy Beams (Arrows) - Converging to center */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    {/* We use SVG to draw animated arrows pointing to center */}
                    <svg className="w-full h-full visible overflow-visible" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#00c2ff" />
                                <stop offset="100%" stopColor="#ffffff" />
                            </linearGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Top Beam */}
                        <BeamPath d="M50,10 L50,35" delay={0} />
                        {/* Right Beam */}
                        <BeamPath d="M90,50 L65,50" delay={0.5} />
                        {/* Bottom Beam */}
                        <BeamPath d="M50,90 L50,65" delay={1} />
                        {/* Left Beam */}
                        <BeamPath d="M10,50 L35,50" delay={1.5} />
                    </svg>
                </div>

                {/* Central Core - The Fusion Heart */}
                <motion.div
                    className="absolute z-20 w-28 h-28 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,194,255,0.4)] border-4 border-white/20 relative"
                    animate={{
                        boxShadow: [
                            "0 0 20px rgba(0,194,255,0.2)",
                            "0 0 60px rgba(0,194,255,0.6)",
                            "0 0 20px rgba(0,194,255,0.2)"
                        ],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="absolute inset-0 rounded-full border border-union-blue-400/30 animate-ping opacity-20"></div>
                    <img src="/logo_new.png" alt="Union" className="w-20 md:w-28 object-contain relative z-10" />
                </motion.div>

                {/* Satellite Nodes - Fixed positions but floating */}
                <SatelliteNodeFixed angle={-90} label="Luce & Gas" icon={<Zap className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />} color="border-yellow-500/50 shadow-yellow-500/20 bg-yellow-500/10" />
                <SatelliteNodeFixed angle={0} label="Sharing" icon={<Share2 className="w-5 h-5 md:w-7 md:h-7 text-union-blue-400" />} color="border-union-blue-500/50 shadow-union-blue-500/20 bg-union-blue-500/10" />
                <SatelliteNodeFixed angle={90} label="Rendita" icon={<TrendingUp className="w-5 h-5 md:w-7 md:h-7 text-union-green-400" />} color="border-union-green-500/50 shadow-union-green-500/20 bg-union-green-500/10" />
                <SatelliteNodeFixed angle={180} label="Community" icon={<Users className="w-5 h-5 md:w-7 md:h-7 text-purple-400" />} color="border-purple-500/50 shadow-purple-500/20 bg-purple-500/10" />

            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 md:mt-8 text-center z-30"
            >
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="group relative flex items-center gap-3 bg-gradient-to-r from-union-orange-500 to-red-600 text-white px-10 md:px-14 py-4 md:py-5 rounded-full font-black text-xl md:text-2xl shadow-[0_0_30px_rgba(255,100,0,0.6)] hover:shadow-[0_0_50px_rgba(255,100,0,0.9)] hover:scale-105 transition-all overflow-hidden"
                >
                    <span className="relative z-10 uppercase tracking-widest">{language === 'it' ? 'Inizia Ora' : 'Starten'}</span>
                    <Zap className="relative z-10 fill-white w-6 h-6 md:w-8 md:h-8 animate-pulse" />

                    {/* Button internal shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                </button>
                <p className="text-gray-400 mt-6 text-sm md:text-base font-medium tracking-wide mb-6">
                    {language === 'it' ? 'Unisciti alla rivoluzione energetica' : 'Schließen Sie sich der Energierevolution an'}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 z-30">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.unionapplication&pcampaignid=web_share"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-white/20 hover:border-white/50 px-5 py-2.5 rounded-xl transition-all hover:scale-105"
                    >
                        <Play className="fill-white text-white w-6 h-6" />
                        <div className="text-left">
                            <div className="text-[10px] uppercase text-gray-400 font-bold leading-none mb-0.5">DISPONIBILE SU</div>
                            <div className="text-lg font-bold text-white leading-none font-sans">Google Play</div>
                        </div>
                    </a>
                    <a
                        href="https://apps.apple.com/it/app/myunion/id6738283735"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-white/20 hover:border-white/50 px-5 py-2.5 rounded-xl transition-all hover:scale-105"
                    >
                        <Apple className="fill-white text-white w-7 h-7" />
                        <div className="text-left">
                            <div className="text-[10px] uppercase text-gray-400 font-bold leading-none mb-0.5">SCARICA SU</div>
                            <div className="text-lg font-bold text-white leading-none font-sans">App Store</div>
                        </div>
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Helper component for animated beams
const BeamPath = ({ d, delay }: { d: string, delay: number }) => (
    <>
        {/* Glow path */}
        <path d={d} stroke="url(#beamGrad)" strokeWidth="1" fill="none" opacity="0.3" filter="url(#glow)" />
        {/* Animated Dash */}
        <motion.path
            d={d}
            stroke="#00c2ff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1, strokeDashoffset: 0 }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 0.5,
                delay: delay
            }}
        />
    </>
);

const FeatureCard = ({ icon, title, desc, delay, isCenter = false }: { icon: any, title: string, desc: string, delay: number, isCenter?: boolean }) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, type: "spring" }}
        className={`bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors ${isCenter ? 'md:scale-110 border-union-blue-500/50 shadow-[0_0_30px_rgba(0,119,200,0.3)]' : ''}`}
    >
        <div className="mb-4 p-4 bg-black/40 rounded-full">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{desc}</p>
    </motion.div>
);

const SatelliteNodeFixed = ({ angle, label, icon, color }: { angle: number, label: string, icon: any, color: string }) => {
    return (
        <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
            style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(clamp(110px, 35vw, 200px)) rotate(-${angle}deg)`
            }}
        >
            <motion.div
                className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl backdrop-blur-md border bg-black/40 ${color} shadow-lg min-w-[80px] md:min-w-[100px]`}
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
            >
                <div className="mb-1">{icon}</div>
                <span className="text-[10px] md:text-sm font-bold text-white whitespace-nowrap">{label}</span>
            </motion.div>
        </div>
    );
};
