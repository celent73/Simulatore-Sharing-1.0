import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-0 sm:p-6 overflow-hidden"
                >
                    {/* Background Ambient Orbs */}
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" />

                    {/* Close Button - iOS Style */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-[120] p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all hover:scale-105 border border-white/5 shadow-lg"
                    >
                        <X size={20} />
                    </button>

                    {/* Progress Indicators - iOS Page Control Style */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-[120] bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === step ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-1.5 bg-white/20'}`}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="w-full h-full max-w-[1200px] mx-auto flex flex-col relative bg-gray-900/40 backdrop-blur-lg border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
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
                                    className="group flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-105 transition-all active:scale-95"
                                >
                                    <span className="uppercase tracking-wide text-sm">{language === 'it' ? 'Scopri' : 'Entdecken'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="text-center mb-10 relative z-20 max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
                    className="mb-10 flex justify-center"
                >
                    <div className="relative w-32 h-32 md:w-44 md:h-44 bg-white/5 rounded-[36px] flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-[0_0_80px_rgba(56,189,248,0.2)] ring-1 ring-white/10 group">
                        <img src="/logo_new.png" alt="Logo" className="w-20 md:w-28 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out" />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 rounded-[36px] overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
                        </div>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, ease: "easeOut", duration: 0.8 }}
                >
                    {language === 'it' ? 'BENVENUTO' : 'WILLKOMMEN'}
                </motion.h1>
                <motion.h2
                    className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 mb-8 tracking-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    The Future of Energy
                </motion.h2>
                <motion.p
                    className="text-blue-100/80 text-lg md:text-xl leading-relaxed font-medium max-w-lg mx-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {language === 'it'
                        ? 'Scopri come trasformare le tue utenze da una spesa obbligatoria ad una fonte di guadagno.'
                        : 'Entdecken Sie, wie Sie Ihre Versorgungsleistungen von einer obligatorischen Ausgabe in eine Einnahmequelle verwandeln.'}
                </motion.p>
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, type: "spring", damping: 20 }}
            >
                <button
                    onClick={onNext}
                    className="group flex items-center gap-3 bg-white text-black pl-10 pr-8 py-5 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                >
                    <span>{language === 'it' ? 'Inizia il Viaggio' : 'Reise beginnen'}</span>
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </button>
            </motion.div>
        </motion.div>
    );

};

const Step1TraditionVsInnovation = ({ language }: { language: 'it' | 'de' }) => {
    // TILT & GLOW LOGIC FOR CARDS
    const x1 = useMotionValue(0);
    const y1 = useMotionValue(0);
    const rotateX1 = useTransform(y1, [-100, 100], [5, -5]);
    const rotateY1 = useTransform(x1, [-100, 100], [-5, 5]);

    const x2 = useMotionValue(0);
    const y2 = useMotionValue(0);
    const rotateX2 = useTransform(y2, [-100, 100], [5, -5]);
    const rotateY2 = useTransform(x2, [-100, 100], [-5, 5]);

    function handleMouseMove1(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        x1.set(x);
        y1.set(y);
    }

    function handleMouseLeave1() {
        x1.set(0);
        y1.set(0);
    }

    function handleMouseMove2(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        x2.set(x);
        y2.set(y);
    }

    function handleMouseLeave2() {
        x2.set(0);
        y2.set(0);
    }

    return (
        <motion.div
            className="w-full h-full flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center p-4 relative perspective-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
        >
            {/* TRADITION CARD - OLD ECONOMY */}
            <motion.div
                className="flex-1 w-full max-w-sm relative group perspective-origin-center hover:z-10"
                style={{ rotateX: rotateX1, rotateY: rotateY1 }}
                onMouseMove={handleMouseMove1}
                onMouseLeave={handleMouseLeave1}
            >
                <div className="relative overflow-hidden rounded-[32px] p-[1px] bg-gradient-to-b from-white/10 to-transparent">
                    <div className="bg-gray-900/60 backdrop-blur-xl p-6 md:p-8 rounded-[32px] w-full h-full min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-500 group-hover:bg-gray-900/80">

                        {/* Static Noise Overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                        {/* Red Glitch Hue */}
                        <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10 text-center mb-6">
                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block w-fit mx-auto">
                                OLD ECONOMY
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-white/90 tracking-tight group-hover:text-red-400 transition-colors duration-300">
                                Tradizionale
                            </h2>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-red-500/20 transition-colors">
                                <div className="p-2 bg-red-500/10 rounded-xl text-red-400">
                                    <Building size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-200 text-sm">Strutture Pesanti</p>
                                    <p className="text-[11px] text-gray-400 leading-tight">Uffici lussuosi pagati dalla tua bolletta.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-red-500/20 transition-colors">
                                <div className="p-2 bg-red-500/10 rounded-xl text-red-400">
                                    <Tv size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-200 text-sm">Marketing Costoso</p>
                                    <p className="text-[11px] text-gray-400 leading-tight">Soldi spesi in pubblicità, non per te.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 text-center">
                            <p className="text-gray-500 font-mono text-[10px] tracking-widest uppercase mb-1">IL TUO GUADAGNO</p>
                            <p className="text-red-500/60 font-black text-xl line-through decoration-red-500/40">ZERO</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* VS Badge */}
            <div className="relative z-20 flex items-center justify-center -my-4 md:-mx-6 md:my-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black font-black flex items-center justify-center text-lg md:text-xl shadow-[0_0_30px_rgba(255,255,255,0.4)] border-4 border-gray-900 z-10">
                    VS
                </div>
            </div>

            {/* INNOVATION CARD - NEW ECONOMY */}
            <motion.div
                className="flex-1 w-full max-w-sm relative group perspective-origin-center hover:z-10"
                style={{ rotateX: rotateX2, rotateY: rotateY2 }}
                onMouseMove={handleMouseMove2}
                onMouseLeave={handleMouseLeave2}
            >
                <div className="relative overflow-hidden rounded-[32px] p-[1px] bg-gradient-to-br from-union-blue-400 to-union-orange-400 shadow-[0_0_40px_rgba(0,119,200,0.2)]">
                    <div className="bg-gray-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[32px] w-full h-full min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-500">

                        {/* Glass Shine */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10 text-center mb-6">
                            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-union-blue-600 to-union-blue-500 text-white font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block w-fit mx-auto shadow-lg shadow-union-blue-500/20">
                                NEW ECONOMY
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-200 tracking-tight">
                                Union Energy
                            </h2>
                        </div>

                        <div className="space-y-4 flex-1 relative z-10">
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-4 p-3 rounded-2xl bg-union-blue-500/10 border border-union-blue-500/20 hover:bg-union-blue-500/20 transition-colors">
                                <div className="p-2 bg-union-blue-500/20 rounded-xl text-union-blue-400">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">Power to People</p>
                                    <p className="text-[11px] text-gray-300 leading-tight">Digitali e veloci. Tagliamo i costi per premiare te.</p>
                                </div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-4 p-3 rounded-2xl bg-union-orange-500/10 border border-union-orange-500/20 hover:bg-union-orange-500/20 transition-colors">
                                <div className="p-2 bg-union-orange-500/20 rounded-xl text-union-orange-400">
                                    <Share2 size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-sm">Sharing Economy</p>
                                    <p className="text-[11px] text-gray-300 leading-tight">Il marketing sei tu. E vieni pagato per questo.</p>
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-center relative z-10">
                            <p className="text-union-blue-300 font-bold text-[10px] tracking-widest uppercase mb-1">IL TUO RISULTATO</p>
                            <div className="inline-block px-4 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                                <p className="text-green-400 font-black text-lg">BOLLETTA ZERO</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
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
            }, 25);
            return () => clearInterval(interval);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4 max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
        >
            <div className="text-center mb-8 relative z-20">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block w-fit mx-auto backdrop-blur-md">
                    MOney Back
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-union-green-400 to-emerald-300">Cashback</span> Immediato
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-medium tracking-wide">Ogni tua spesa genera valore. <span className="text-white font-bold">Subito.</span></p>
            </div>

            <motion.div
                className="w-full bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[40px] border border-white/10 relative group shadow-2xl shadow-black/50"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", damping: 20 }}
            >
                {/* Background Sparkles */}
                <div className="absolute inset-0 overflow-hidden rounded-[40px] pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
                </div>

                <div className="relative z-10 h-full flex flex-col items-center text-center">
                    <motion.div
                        className="w-24 h-24 rounded-3xl bg-union-green-500/10 flex items-center justify-center text-union-green-400 mb-6 border border-union-green-500/20 relative shadow-[0_0_30px_rgba(34,197,94,0.1)]"
                        animate={isComplete ? {
                            boxShadow: ["0 0 20px rgba(34,197,94,0.1)", "0 0 40px rgba(34,197,94,0.3)", "0 0 20px rgba(34,197,94,0.1)"],
                            borderColor: ["rgba(34,197,94,0.2)", "rgba(34,197,94,0.5)", "rgba(34,197,94,0.2)"]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Wallet size={48} className={isComplete ? "text-union-green-300 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "text-union-green-400/80"} />
                        <AnimatePresence>
                            {isComplete && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1.5 shadow-lg border-2 border-gray-900"
                                >
                                    <CheckCircle2 size={16} fill="black" className="text-white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Recupera Spese</h3>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed max-w-xs mx-auto">
                        Il sistema ti premia per le tue abitudini quotidiane. Trasforma le bollette in <span className="text-union-green-400 font-bold">credito reale</span>.
                    </p>

                    <div className="w-full relative">
                        <AnimatePresence>
                            {showBadge && (
                                <motion.div
                                    initial={{ scale: 0.5, rotate: -10, opacity: 0, y: 10 }}
                                    animate={{ scale: 1, rotate: -5, opacity: 1, y: 0 }}
                                    className="absolute -top-5 -right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_5px_20px_rgba(239,68,68,0.4)] z-30 uppercase tracking-widest border border-white/20"
                                >
                                    -30% Sconto
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="bg-black/20 p-6 rounded-3xl border border-white/5 w-full backdrop-blur-sm relative overflow-hidden">
                            {/* Inner Highlight */}
                            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bolletta Standard</span>
                                <span className="text-sm text-red-400/60 font-mono font-bold line-through">€100</span>
                            </div>
                            <div className="flex justify-between items-end mb-5">
                                <span className="text-sm text-white font-bold mb-1">Tuo Costo Reale</span>
                                <div className="flex items-baseline gap-1.5">
                                    <motion.span
                                        key={price}
                                        className={`text-4xl font-black tracking-tighter tabular-nums ${isComplete ? 'text-union-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'text-white'}`}
                                    >
                                        €{price}
                                    </motion.span>
                                </div>
                            </div>

                            {/* Animated Progress Bar */}
                            <div className="relative w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-union-green-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "30%" }}
                                    transition={{
                                        delay: 0.8,
                                        duration: 1.2,
                                        ease: "circOut"
                                    }}
                                />
                            </div>

                            <p className={`text-[10px] mt-4 font-bold flex items-center justify-center gap-1.5 transition-colors duration-500 tracking-wide uppercase ${isComplete ? 'text-union-green-400' : 'text-gray-600'}`}>
                                <Zap size={10} fill="currentColor" className={isComplete ? "animate-pulse" : ""} />
                                {isComplete ? 'Risparmio Attivato' : 'Calcolo in corso...'}
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
            exit={{ opacity: 0, filter: "blur(10px)" }}
        >
            {/* Top Technology Overlay */}
            <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="bg-black/30 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-3 shadow-lg">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-union-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-union-blue-500"></span>
                    </div>
                    <span className="text-white/70 font-bold text-[9px] uppercase tracking-[0.2em]">Network Live</span>
                </div>
            </motion.div>

            {/* Side Panels */}
            <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                {/* Left Info Panel */}
                <motion.div
                    className="max-w-[220px] space-y-3 hidden lg:block"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                >
                    <div className="bg-gray-900/40 border border-white/10 backdrop-blur-xl p-5 rounded-[32px] hover:bg-gray-900/60 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-union-blue-500/20 flex items-center justify-center text-union-blue-400 mb-3">
                            <Users size={16} />
                        </div>
                        <h4 className="text-white font-black text-xs mb-1 uppercase tracking-wider">Community</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Ogni invito è un mattone della tua libertà.</p>
                    </div>
                    <div className="bg-gray-900/40 border border-white/10 backdrop-blur-xl p-5 rounded-[32px] hover:bg-gray-900/60 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-union-orange-500/20 flex items-center justify-center text-union-orange-400 mb-3">
                            <Zap size={16} />
                        </div>
                        <h4 className="text-white font-black text-xs mb-1 uppercase tracking-wider">Efficienza</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">L'energia condivisa crea valore per tutti.</p>
                    </div>
                </motion.div>

                {/* Right Info Panel */}
                <motion.div
                    className="max-w-[220px] space-y-3 hidden lg:block text-right"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                >
                    <div className="bg-gray-900/40 border border-white/10 backdrop-blur-xl p-5 rounded-[32px] hover:bg-gray-900/60 transition-colors flex flex-col items-end">
                        <div className="w-8 h-8 rounded-full bg-union-green-500/20 flex items-center justify-center text-union-green-400 mb-3">
                            <TrendingUp size={16} />
                        </div>
                        <h4 className="text-white font-black text-xs mb-1 uppercase tracking-wider">Rendita</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Il sistema lavora h24 per il tuo cashback.</p>
                    </div>
                    <div className="bg-gray-900/40 border border-white/10 backdrop-blur-xl p-5 rounded-[32px] hover:bg-gray-900/60 transition-colors flex flex-col items-end">
                        <div className="w-8 h-8 rounded-full bg-union-blue-500/20 flex items-center justify-center text-union-blue-400 mb-3">
                            <Share2 size={16} />
                        </div>
                        <h4 className="text-white font-black text-xs mb-1 uppercase tracking-wider">Social Power</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Il passaparola cancella le tue spese.</p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Content Area */}
            <motion.div
                className="absolute bottom-12 left-0 right-0 text-center pointer-events-auto z-20"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <div className="inline-block relative">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-2xl">
                        Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-union-blue-400 to-union-orange-400">Imperiale</span>
                    </h2>
                    <div className="absolute -inset-4 bg-black/40 blur-xl -z-10 rounded-full"></div>
                </div>

                <p className="text-gray-300 text-xs md:text-sm font-bold opacity-80 mb-4 max-w-lg mx-auto leading-relaxed">
                    Smetti di pagare. Inizia a guadagnare dalle connessioni.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Condividi &amp; Azzera</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step4TotalVision = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
        >
            {/* Background Pulse */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-union-blue-900/30 to-transparent rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10 text-center mb-10 px-4">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block w-fit mx-auto backdrop-blur-md">
                    Total Vision
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-cyan-400 mb-4 drop-shadow-2xl tracking-tighter">
                    ECOSISTEMA UNION
                </h2>
                <p className="text-sm md:text-lg text-gray-300 max-w-xl mx-auto leading-relaxed font-medium">
                    L'unica piattaforma che trasforma le tue spese obbligatorie in <span className="text-white font-bold">libertà finanziaria</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl px-4 relative z-10">
                <FeatureCard
                    icon={<Zap className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />}
                    title="Luce & Gas"
                    desc="Energia Green con i prezzi più competitivi del mercato."
                    delay={0.2}
                    color="from-yellow-500/20 to-orange-500/20"
                />
                <FeatureCard
                    icon={<Share2 className="w-6 h-6 md:w-8 md:h-8 text-union-blue-400" />}
                    title="Sharing"
                    desc="La condivisione che genera valore reale per tutti."
                    delay={0.4}
                    isCenter={true}
                    color="from-union-blue-500/20 to-cyan-500/20"
                />
                <FeatureCard
                    icon={<TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-union-green-400" />}
                    title="Rendita"
                    desc="Costruisci un futuro senza pensieri ricorrenti."
                    delay={0.6}
                    color="from-union-green-500/20 to-emerald-500/20"
                />
            </div>

            <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-union-orange-400 to-red-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs animate-pulse">
                    CONDIVIDI. COLLEGA. AZZERA.
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step5SummaryCircleFinal = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
        >
            <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] flex items-center justify-center my-4 md:my-8 scale-90 md:scale-100">

                {/* Background Reactor Glows */}
                <motion.div
                    className="absolute inset-0 bg-union-blue-500/10 rounded-full blur-3xl z-0"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Orbital Rings */}
                <motion.div
                    className="absolute inset-0 border border-dashed border-union-blue-500/20 rounded-full z-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-12 md:inset-20 border border-dotted border-union-orange-500/20 rounded-full z-0"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                />

                {/* Energy Beams */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                    <svg className="w-full h-full visible overflow-visible" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="transparent" />
                                <stop offset="50%" stopColor="#00c2ff" />
                                <stop offset="100%" stopColor="#ffffff" />
                            </linearGradient>
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <BeamPath d="M50,10 L50,35" delay={0} />
                        <BeamPath d="M90,50 L65,50" delay={0.5} />
                        <BeamPath d="M50,90 L50,65" delay={1} />
                        <BeamPath d="M10,50 L35,50" delay={1.5} />
                    </svg>
                </div>

                {/* Central Core */}
                <motion.div
                    className="absolute z-20 w-32 h-32 md:w-44 md:h-44 bg-white rounded-full flex items-center justify-center shadow-[0_0_80px_rgba(0,194,255,0.5)] border-4 border-white/50 relative overflow-hidden ring-4 ring-white/10"
                    animate={{
                        boxShadow: [
                            "0 0 40px rgba(0,194,255,0.3)",
                            "0 0 80px rgba(0,194,255,0.7)",
                            "0 0 40px rgba(0,194,255,0.3)"
                        ],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-300 opacity-50" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                    <img src="/logo_new.png" alt="Union" className="w-24 md:w-32 object-contain relative z-10 drop-shadow-lg" />

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent z-20 skew-x-12 opacity-50" />
                </motion.div>

                {/* Satellite Nodes */}
                <SatelliteNodeFixed angle={-90} label="Luce & Gas" icon={<Zap className="w-5 h-5 md:w-7 md:h-7 text-yellow-400" />} color="border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-yellow-500/10" />
                <SatelliteNodeFixed angle={0} label="Sharing" icon={<Share2 className="w-5 h-5 md:w-7 md:h-7 text-union-blue-400" />} color="border-union-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-union-blue-500/10" />
                <SatelliteNodeFixed angle={90} label="Rendita" icon={<TrendingUp className="w-5 h-5 md:w-7 md:h-7 text-union-green-400" />} color="border-union-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] bg-union-green-500/10" />
                <SatelliteNodeFixed angle={180} label="Community" icon={<Users className="w-5 h-5 md:w-7 md:h-7 text-purple-400" />} color="border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-purple-500/10" />

            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 md:mt-8 text-center z-30 w-full max-w-md mx-auto"
            >
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="group relative flex items-center justify-center gap-4 bg-white text-black w-full py-5 rounded-full font-black text-xl shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden border-4 border-white/50"
                >
                    <span className="relative z-10 uppercase tracking-widest">{language === 'it' ? 'Inizia Ora' : 'Starten'}</span>
                    <div className="bg-black text-white p-2 rounded-full">
                        <ArrowRight className="w-5 h-5" />
                    </div>

                    {/* Button internal shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                </button>

                <p className="text-gray-400 mt-6 text-xs md:text-sm font-bold tracking-wide mb-6 uppercase">
                    {language === 'it' ? 'Unisciti alla rivoluzione energetica' : 'Schließen Sie sich der Energierevolution an'}
                </p>

                <div className="flex justify-center gap-4 z-30">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.unionapplication&pcampaignid=web_share"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 px-4 py-2 rounded-xl transition-all hover:scale-105 backdrop-blur-md"
                    >
                        <Play className="fill-white text-white w-5 h-5" />
                        <div className="text-left">
                            <div className="text-[9px] uppercase text-gray-400 font-bold leading-none mb-0.5">Google Play</div>
                        </div>
                    </a>
                    <a
                        href="https://apps.apple.com/it/app/myunion/id6738283735"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/30 px-4 py-2 rounded-xl transition-all hover:scale-105 backdrop-blur-md"
                    >
                        <Apple className="fill-white text-white w-6 h-6" />
                        <div className="text-left">
                            <div className="text-[9px] uppercase text-gray-400 font-bold leading-none mb-0.5">App Store</div>
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
        <path d={d} stroke="url(#beamGrad)" strokeWidth="1" fill="none" opacity="0.2" filter="url(#glow)" />
        <motion.path
            d={d}
            stroke="#00c2ff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8, strokeDashoffset: 0 }}
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

const FeatureCard = ({ icon, title, desc, delay, isCenter = false, color }: { icon: any, title: string, desc: string, delay: number, isCenter?: boolean, color: string }) => (
    <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, type: "spring", damping: 20 }}
        className={`bg-gradient-to-br ${color} backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/10 transition-colors ${isCenter ? 'md:scale-105 border-union-blue-500/30' : ''}`}
    >
        <div className="mb-4 p-4 bg-black/40 rounded-2xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">{title}</h3>
        <p className="text-gray-300 text-xs font-medium leading-relaxed">{desc}</p>
    </motion.div>
);

const SatelliteNodeFixed = ({ angle, label, icon, color }: { angle: number, label: string, icon: any, color: string }) => {
    return (
        <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none"
            style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translate(clamp(110px, 35vw, 190px)) rotate(-${angle}deg)`
            }}
        >
            <motion.div
                className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl backdrop-blur-xl border bg-black/60 ${color} min-w-[80px] md:min-w-[100px] pointer-events-auto`}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
            >
                <div className="mb-1">{icon}</div>
                <span className="text-[10px] md:text-xs font-bold text-white whitespace-nowrap uppercase tracking-wider">{label}</span>
            </motion.div>
        </div>
    );
};
