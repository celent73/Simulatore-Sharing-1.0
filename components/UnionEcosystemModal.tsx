import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, Users, Share2, TrendingUp, Building, Tv, Wallet, ShieldCheck, ChevronRight, ChevronLeft, Apple, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
            id: 'ecosystem_flow',
            title: language === 'it' ? 'Il Tuo Vantaggio' : 'Dein Vorteil',
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
                        <div className="flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col items-center w-full scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                            <div className="w-full flex-grow flex flex-col justify-center py-4">
                                <AnimatePresence mode="wait">
                                    {step === 0 && <Step0Welcome key="step0" language={language} onNext={nextStep} />}
                                    {step === 1 && <Step1TraditionVsInnovation key="step1" language={language} />}
                                    {step === 2 && <Step2EcosystemFlow key="step2" language={language} />}
                                    {step === 3 && <Step3TotalVision key="step3" language={language} onClose={onClose} />}
                                    {step === 4 && <Step4SummaryCircleFinal key="step4" language={language} onClose={onClose} />}
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
                        <img src="/logo_sharing.png" alt="Logo" className="w-24 md:w-36 object-contain drop-shadow-lg" />
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
            className="w-full flex flex-col md:flex-row gap-8 items-center justify-center p-4 max-w-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
        >
            {/* TRADITION CARD */}
            <div className="flex-1 flex flex-col items-center justify-center relative group w-full">
                <motion.div
                    className="absolute inset-0 bg-red-500/5 blur-[80px] rounded-full"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative z-10 bg-gray-900/40 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md grayscale hover:grayscale-0 transition-all duration-700 w-full max-w-sm mx-auto">
                    <div className="text-center mb-4 md:mb-6">
                        <h3 className="text-gray-400 font-bold tracking-widest text-[10px] md:text-sm mb-1 md:mb-2">OLD ECONOMY</h3>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Tradizionale</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="p-3 bg-gray-800 rounded-xl"><Building size={24} /></div>
                            <div>
                                <p className="font-bold text-white">Uffici Costosi</p>
                                <p className="text-xs">Strutture pesanti e lente</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                            <div className="p-3 bg-gray-800 rounded-xl"><Tv size={24} /></div>
                            <div>
                                <p className="font-bold text-white">Pubblicità Massiva</p>
                                <p className="text-xs">Budget sprecato in media</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-red-400 font-mono text-sm">PROFITTI &rarr; AZIENDA</p>
                    </div>
                </div>
            </div>

            {/* VS Badge */}
            <div className="relative z-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white text-black font-black flex items-center justify-center text-xl shadow-[0_0_20px_rgba(255,255,255,0.5)]">VS</div>
            </div>

            {/* INNOVATION CARD */}
            <div className="flex-1 flex flex-col items-center justify-center relative w-full">
                <motion.div
                    className="absolute inset-0 bg-union-blue-500/20 blur-[80px] rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="relative z-10 bg-gradient-to-br from-gray-900 to-union-blue-900 border border-union-blue-400/30 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-[0_0_50px_-10px_rgba(0,119,200,0.3)] w-full max-w-sm mx-auto"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="text-center mb-4 md:mb-6">
                        <h3 className="text-union-blue-300 font-bold tracking-widest text-[10px] md:text-sm mb-1 md:mb-2">NEW ECONOMY</h3>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Union Energy</h2>
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="p-3 bg-union-blue-500/20 text-union-blue-300 rounded-xl"><Users size={24} /></div>
                            <div>
                                <p className="font-bold text-white">Community First</p>
                                <p className="text-xs text-gray-300">Investiamo sulle persone</p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="p-3 bg-union-blue-500/20 text-union-blue-300 rounded-xl"><Share2 size={24} /></div>
                            <div>
                                <p className="font-bold text-white">Sharing Economy</p>
                                <p className="text-xs text-gray-300">Redistribuzione ricchezza</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-union-blue-500/30 text-center">
                        <motion.p
                            className="text-union-green-400 font-mono text-sm font-bold"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            PROFITTI &rarr; A TE
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Step2EcosystemFlow = ({ language }: { language: 'it' | 'de' }) => {
    return (
        <motion.div
            className="w-full flex flex-col items-center justify-center relative" // Removed p-4 and h-full constraint
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
        >
            <div className="text-center mb-6 md:mb-8 relative z-20 px-4">
                <h2 className="text-2xl md:text-5xl font-extrabold text-white mb-2">
                    Il Potere dello <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Sharing</span>
                </h2>
                <p className="text-gray-300 text-sm md:text-lg">Abbassa le bollette. Abbatti i costi. Crea rendita.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center w-full max-w-5xl">
                {/* Phase 1: Cashback */}
                <motion.div
                    className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 p-5 md:p-6 rounded-3xl border border-union-green-500/30 relative overflow-hidden group w-full"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet className="w-20 h-20 md:w-32 md:h-32" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-union-green-500/20 flex items-center justify-center text-union-green-400 mb-3 md:mb-4">
                            <span className="font-bold text-lg md:text-xl">1</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Cashback</h3>
                        <p className="text-gray-400 mb-6 flex-grow">
                            Ogni spesa quotidiana genera credito. Il sistema ti premia per le tue abitudini.
                        </p>

                        <div className="bg-black/30 p-4 rounded-xl border border-union-green-500/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Bolletta</span>
                                <span className="text-sm text-red-400 font-mono">€100</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-union-green-400 font-bold">Con Cashback</span>
                                <span className="text-lg text-white font-mono font-bold">€70</span>
                            </div>
                            <div className="w-full bg-gray-700 h-1.5 mt-3 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-union-green-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "30%" }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                />
                            </div>
                            <p className="text-xs text-union-green-400 mt-2 text-center font-bold">ABBASSA I COSTI</p>
                        </div>
                    </div>
                </motion.div>

                {/* Phase 2: Sharing */}
                <motion.div
                    className="flex-1 bg-gradient-to-b from-union-blue-900 to-gray-900 p-6 rounded-3xl border border-union-blue-400/50 relative overflow-hidden group"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        className="absolute -right-10 -bottom-10 w-60 h-60 bg-union-blue-500/20 blur-[60px] rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-full bg-union-blue-500/20 flex items-center justify-center text-union-blue-400 mb-4">
                            <span className="font-bold text-xl">2</span>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Sharing</h3>
                        <p className="text-gray-300 mb-6 flex-grow">
                            Condividi l'ecosistema. Più la community cresce, più la tua bolletta scende fino a zero.
                        </p>

                        <div className="bg-black/30 p-4 rounded-xl border border-union-blue-400/30 backdrop-blur-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Rendita</span>
                                <span className="text-sm text-union-blue-400 font-mono">In crescita</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-white font-bold">Risultato</span>
                                <span className="text-lg text-union-blue-300 font-mono font-bold">€0 Bolletta</span>
                            </div>
                            <div className="w-full bg-gray-700 h-1.5 mt-3 rounded-full overflow-hidden flex">
                                <motion.div
                                    className="h-full bg-union-green-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "30%" }}
                                    transition={{ delay: 0.8, duration: 0.1 }}
                                />
                                <motion.div
                                    className="h-full bg-union-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "70%" }}
                                    transition={{ delay: 0.9, duration: 1.5 }}
                                />
                            </div>
                            <p className="text-xs text-union-blue-300 mt-2 text-center font-bold flex items-center justify-center gap-1">
                                <Zap size={12} className="fill-current" />
                                ABBATTE I COSTI & CREA RENDITA
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const Step3TotalVision = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
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

const Step4SummaryCircle = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
                {/* Orbital Rings */}
                <motion.div
                    className="absolute inset-0 border-2 border-dashed border-union-blue-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-4 md:inset-8 border border-union-orange-500/20 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Central Core */}
                <motion.div
                    className="absolute z-20 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-white to-gray-200 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="text-center">
                        <img src="/logo_sharing.png" alt="Union" className="w-20 md:w-32 object-contain mx-auto" />
                    </div>
                </motion.div>

                {/* Satellite Nodes */}
                <SatelliteNode angle={0} label="Luce & Gas" icon={<Zap className="text-yellow-500" />} color="bg-yellow-500/10 border-yellow-500/50" />
                <SatelliteNode angle={90} label="Sharing" icon={<Share2 className="text-union-blue-500" />} color="bg-union-blue-500/10 border-union-blue-500/50" />
                <SatelliteNode angle={180} label="Rendita" icon={<TrendingUp className="text-union-green-500" />} color="bg-union-green-500/10 border-union-green-500/50" />
                <SatelliteNode angle={270} label="Community" icon={<Users className="text-purple-500" />} color="bg-purple-500/10 border-purple-500/50" />
            </div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 md:mt-12 text-center"
            >
                <button
                    onClick={onClose}
                    className="group relative flex items-center gap-3 bg-gradient-to-r from-union-orange-500 to-red-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-full font-black text-lg md:text-xl shadow-[0_0_20px_rgba(255,100,0,0.5)] hover:shadow-[0_0_40px_rgba(255,100,0,0.8)] hover:scale-110 transition-all overflow-hidden"
                >
                    <span className="relative z-10 uppercase tracking-widest">{language === 'it' ? 'Inizia Ora' : 'Starten'}</span>
                    <Zap className="relative z-10 fill-white w-6 h-6 md:w-8 md:h-8 animate-pulse" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 clip-path-slant" />
                </button>
                <p className="text-gray-400 mt-4 text-xs md:text-sm">
                    {language === 'it' ? 'Unisciti alla rivoluzione energetica' : 'Schließen Sie sich der Energierevolution an'}
                </p>
            </motion.div>
        </motion.div>
    );
};

const SatelliteNode = ({ angle, label, icon, color }: { angle: number, label: string, icon: any, color: string }) => {
    // Calculate position based on angle
    // Using CSS custom properties for rotation to avoid complex JS math here if possible, or just absolute positioning
    // Simpler: Use rotation transforms on container
    return (
        <motion.div
            className="absolute left-1/2 top-1/2 w-0 h-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
            <div
                className="absolute"
                style={{
                    transform: `rotate(${angle}deg) translate(clamp(110px, 40vw, 220px)) rotate(-${angle}deg)`
                }}
            >
                <motion.div
                    className={`flex flex-col items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-2xl backdrop-blur-md border ${color} shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    style={{ transform: `rotate(-360deg)` }} // Counter-rotate to keep icon upright during orbit animation if parent rotates
                // Actually, if we rotate the container 'SatelliteNode' is wrapped in, we need to counter-rotate. 
                // But here I set a separate rotation on the parent div.
                // Let's simplify: static positioning relative to circle, but the whole ring rotates? 
                // User asked for a summary circle. Let's make it static but pulsing.
                >
                    {icon}
                    <span className="text-[10px] md:text-xs font-bold text-white mt-1">{label}</span>
                </motion.div>
            </div>
        </motion.div>
    );
};
// Re-implementing SatelliteNode to be simpler and static for better layout control
const SatelliteNodeFixed = ({ angle, label, icon, color }: { angle: number, label: string, icon: any, color: string }) => {
    // Radius varies by screen size, controlled by translate
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

// Replacing with "Fusion Reactor" enhanced version
const Step4SummaryCircleFinal = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
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
                            <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                                <polygon points="0 0, 4 2, 0 4" fill="#00c2ff" />
                            </marker>
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
                    <img src="/logo_sharing.png" alt="Union" className="w-20 md:w-28 object-contain relative z-10" />
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
                        window.open('https://my.unionenergia.it', '_blank');
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
        {/* Arrow Head moving along path - simplified by just animating the line for now as markers on motion paths are tricky in simple SVG without motionPath plugin */}
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
