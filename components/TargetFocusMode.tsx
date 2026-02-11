import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronLeft,
    ArrowRight,
    Share2,
    Sparkles,
    Home,
    Car,
    Plane,
    Rocket,
    Clock,
    Target,
    Zap,
    Trophy
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TargetFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'dream' | 'income' | 'effort' | 'reveal';
type DreamType = 'home' | 'car' | 'travel' | 'freedom';
type EffortLevel = 'hobby' | 'part' | 'full';

export const TargetFocusMode: React.FC<TargetFocusModeProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [step, setStep] = useState<Step>('dream');
    const [dream, setDream] = useState<DreamType>('freedom');
    const [targetIncome, setTargetIncome] = useState(2500);
    const [effort, setEffort] = useState<EffortLevel>('part');
    const reportRef = useRef<HTMLDivElement>(null);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 'reveal') setStep('effort');
        else if (step === 'effort') setStep('income');
        else if (step === 'income') setStep('dream');
    };

    // Calculation Logic
    const contractsNeeded = Math.ceil(targetIncome / 2.5);

    const getEstimate = () => {
        let months = 0;
        let rank = 'Smart';

        switch (effort) {
            case 'hobby':
                months = Math.ceil(contractsNeeded / 2);
                rank = contractsNeeded > 50 ? 'Prime' : 'Smart';
                break;
            case 'part':
                months = Math.ceil(contractsNeeded / 5);
                rank = contractsNeeded > 150 ? 'Elite' : (contractsNeeded > 50 ? 'Top' : 'Prime');
                break;
            case 'full':
                months = Math.ceil(contractsNeeded / 12);
                rank = contractsNeeded > 300 ? 'Master' : (contractsNeeded > 150 ? 'Elite' : 'Top');
                break;
        }

        return { months, rank };
    };

    const { months, rank } = getEstimate();

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: t('target_focus.title'),
                    text: `${t('target_focus.result_title')}: ${targetIncome}€/month target. Needs ${contractsNeeded} contracts in approx ${months} months. Rank: ${rank}`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        }
    };

    const dreamsArray: { id: DreamType; icon: any; label: string }[] = [
        { id: 'home', icon: Home, label: t('target_focus.dream_home') },
        { id: 'car', icon: Car, label: t('target_focus.dream_car') },
        { id: 'travel', icon: Plane, label: t('target_focus.dream_travel') },
        { id: 'freedom', icon: Rocket, label: t('target_focus.dream_freedom') },
    ];

    const effortArray: { id: EffortLevel; icon: any; label: string; desc: string }[] = [
        { id: 'hobby', icon: Clock, label: 'Hobby', desc: '1-2 hours / week' },
        { id: 'part', icon: Zap, label: 'Part-Time', desc: '1-2 hours / day' },
        { id: 'full', icon: Rocket, label: 'Full-Time', desc: 'Professional' },
    ];

    return (
        <div className="fixed inset-0 z-[200000] bg-black text-white flex flex-col overflow-hidden font-sans text-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
            </div>

            {/* Header */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <button
                    onClick={step === 'dream' ? onClose : handleBack}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    {step === 'dream' ? <X size={24} /> : <ChevronLeft size={24} />}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">
                        {t('target_focus.title')}
                    </span>
                    <div className="flex gap-1.5">
                        {['dream', 'income', 'effort', 'reveal'].map((s, i) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-blue-500' :
                                        (i < ['dream', 'income', 'effort', 'reveal'].indexOf(step) ? 'w-4 bg-white/40' : 'w-2 bg-white/10')
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-12 h-12" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full max-w-7xl mx-auto h-full overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === 'dream' && (
                        <motion.div
                            key="dream"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, y: -20 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h2 className="text-4xl sm:text-6xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {t('target_focus.step1_title')}
                            </h2>
                            <p className="text-white/60 text-lg mb-12 text-center max-w-md">
                                {t('target_focus.step1_desc')}
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                                {dreamsArray.map((d) => {
                                    const Icon = d.icon;
                                    const isSelected = dream === d.id;
                                    return (
                                        <button
                                            key={d.id}
                                            onClick={() => {
                                                setDream(d.id);
                                                setTimeout(() => setStep('income'), 300);
                                            }}
                                            className={`relative group p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden ${isSelected
                                                    ? 'bg-blue-600 shadow-[0_0_50px_rgba(37,99,235,0.4)] scale-105 z-10'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <Icon size={40} className={`mb-4 transition-transform duration-500 ${isSelected ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110'}`} />
                                            <span className={`font-bold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                                {d.label}
                                            </span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="selection-glow"
                                                    className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {step === 'income' && (
                        <motion.div
                            key="income"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h2 className="text-4xl sm:text-6xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {t('target_focus.step2_title')}
                            </h2>
                            <p className="text-white/60 text-lg mb-12 text-center max-w-md">
                                {t('target_focus.step2_desc')}
                            </p>

                            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex flex-col items-center justify-center mb-16">
                                <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-[spin_10s_linear_infinite]" />
                                <div className="absolute inset-4 rounded-full border-2 border-white/10 animate-[spin_15s_linear_infinite_reverse]" />
                                <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[40px] animate-pulse" />

                                <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-blue-400 font-bold mb-2">TARGET</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-6xl sm:text-7xl font-black tabular-nums">{targetIncome}</span>
                                    <span className="text-2xl font-bold text-white/40">€</span>
                                </div>
                                <span className="text-white/40 font-medium mt-2">/ {t('common.months').toLowerCase()}</span>
                            </div>

                            <div className="w-full max-w-md px-4">
                                <div className="flex justify-between text-xs font-bold text-white/20 mb-4 px-2 tracking-widest uppercase">
                                    <span>Basic</span>
                                    <span>Freedom</span>
                                    <span>Elite</span>
                                </div>
                                <div className="relative h-12 flex items-center">
                                    <input
                                        type="range"
                                        min="500"
                                        max="10000"
                                        step="500"
                                        value={targetIncome}
                                        onChange={(e) => setTargetIncome(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none opacity-20">
                                        {[...Array(20)].map((_, i) => (
                                            <div key={i} className={`w-0.5 h-3 bg-white rounded-full ${i % 5 === 0 ? 'h-5 w-1 opacity-50' : ''}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('effort')}
                                className="mt-16 group flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                            >
                                {t('common.next').toUpperCase()} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 'effort' && (
                        <motion.div
                            key="effort"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h2 className="text-4xl sm:text-6xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {t('target_focus.step3_title')}
                            </h2>
                            <p className="text-white/60 text-lg mb-12 text-center max-w-md">
                                {t('target_focus.step3_desc')}
                            </p>

                            <div className="flex flex-col gap-4 w-full max-w-md">
                                {effortArray.map((e) => {
                                    const Icon = e.icon;
                                    const isSelected = effort === e.id;
                                    return (
                                        <button
                                            key={e.id}
                                            onClick={() => {
                                                setEffort(e.id);
                                            }}
                                            className={`group flex items-center p-6 rounded-3xl transition-all duration-500 ${isSelected
                                                    ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                                                    : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`p-4 rounded-2xl mr-5 transition-colors ${isSelected ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                                <Icon size={32} />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-black text-xl tracking-tight">{e.label}</span>
                                                <span className="text-white/40 text-sm font-medium">{e.desc}</span>
                                            </div>
                                            <div className="ml-auto">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-white bg-white' : 'border-white/20 group-hover:border-white/40'}`}>
                                                    {isSelected && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setStep('reveal')}
                                className="mt-16 group flex items-center gap-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                            >
                                {t('target_focus.cta_reveal').toUpperCase()} <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {step === 'reveal' && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div
                                ref={reportRef}
                                className="w-full max-w-2xl bg-gradient-to-b from-white/10 to-white/5 p-8 sm:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden mb-12"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Target size={120} />
                                </div>
                                <div className="absolute bottom-0 left-0 p-8 opacity-5">
                                    <Trophy size={160} />
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                                        <Sparkles size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black mb-2 text-center">{t('target_focus.result_title')}</h2>
                                    <p className="text-white/40 font-bold mb-12 uppercase tracking-[0.2em] text-sm text-center">
                                        {t('target_focus.result_desc')}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-12">
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">{t('target_focus.result_contracts')}</span>
                                            <span className="text-5xl font-black text-blue-400">{contractsNeeded}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center text-center">
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">{t('target_focus.result_months')}</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black text-purple-400">{months}</span>
                                                <span className="text-xl font-bold text-white/20">{t('common.months').toLowerCase()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl flex items-center justify-between shadow-lg">
                                        <div className="flex flex-col items-start">
                                            <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1 font-bold">{t('target_focus.result_rank')}</span>
                                            <span className="text-2xl font-black">QUALIFICA {rank.toUpperCase()}</span>
                                        </div>
                                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <Trophy size={24} />
                                        </div>
                                    </div>

                                    <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/5 w-full text-center">
                                        <p className="text-sm text-white/60 italic leading-relaxed">
                                            "Il vero segreto del risparmio e del guadagno in Union non è solo la tua azione singola, ma la forza della community che costruisci."
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl px-4">
                                <button
                                    onClick={handleShare}
                                    className="flex-1 flex items-center justify-center gap-4 bg-white/10 hover:bg-white/20 text-white px-8 py-5 rounded-[2rem] font-black text-lg transition-all border border-white/10"
                                >
                                    <Share2 size={24} /> {t('target_focus.cta_share')}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center bg-white text-black px-8 py-5 rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
                                >
                                    {t('common.finish').toUpperCase()}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="relative z-50 p-6 flex justify-center opacity-30 pointer-events-none">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">{t('target_focus.swipe_tip')}</span>
            </div>
        </div>
    );
};
