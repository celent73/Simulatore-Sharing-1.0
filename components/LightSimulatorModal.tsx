import React, { useState, useEffect, useRef } from 'react';
import { X, Calculator, Lightbulb, Users as UsersIcon, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EarningsSimulator from './light/EarningsSimulator';
import RoadToZero from './light/RoadToZero';
import Community from './light/Community';
import { useLanguage } from '../contexts/LanguageContext';
import { useModalDispatch } from '../contexts/ModalContext';

interface LightSimulatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LightSimulatorModal: React.FC<LightSimulatorModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { openModal } = useModalDispatch();
    const [activeTab, setActiveTab] = useState('simulator');

    // Shared State for all tabs
    const [personalUnits, setPersonalUnits] = useState(5);
    const [expansionMode, setExpansionMode] = useState<'manual' | 'auto'>('auto');
    const [duplicationFactor, setDuplicationFactor] = useState(3);
    const [networkSize, setNetworkSize] = useState([5, 15, 45, 100, 250, 500]);
    const [monthRange, setMonthRange] = useState('1');
    const [utilityType, setUtilityType] = useState<'DOMESTIC' | 'BUSINESS'>('DOMESTIC');

    const scrollRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            handleReset();
        } else {
            // Ensure dock is visible when modal closes
            const event = new CustomEvent('control-bottom-dock', { detail: { visible: true } });
            window.dispatchEvent(event);
        }
    }, [isOpen]);

    // Handle scroll to control bottom dock
    useEffect(() => {
        const handleScroll = () => {
            if (!scrollRef.current) return;

            const currentScrollY = scrollRef.current.scrollTop;
            // We need a ref to store last scroll position to avoid re-renders or dependency loops
            // But inside a simple handler variable it resets. We need a ref for lastScrollY.
            // Let's use a closure variable or a ref.
        };
        // Changing strategy: implementation inside the ref callback or a specialized hook is cleaner,
        // but for now let's use a ref for lastScrollY
    }, []);

    const lastScrollYRef = useRef(0);

    const onScrollContent = () => {
        if (!scrollRef.current) return;
        const currentScrollY = scrollRef.current.scrollTop;
        const lastScrollY = lastScrollYRef.current;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling Down
            window.dispatchEvent(new CustomEvent('control-bottom-dock', { detail: { visible: false } }));
        } else if (currentScrollY < lastScrollY) {
            // Scrolling Up
            window.dispatchEvent(new CustomEvent('control-bottom-dock', { detail: { visible: true } }));
        }

        lastScrollYRef.current = currentScrollY;
    };

    if (!isOpen) return null;

    const handleLevelChange = (index: number, value: number) => {
        const newSize = [...networkSize];
        newSize[index] = value;

        if (expansionMode === 'auto' && index === 0) {
            // Recalculate deep levels based on multiplication
            for (let i = 1; i < newSize.length; i++) {
                newSize[i] = newSize[i - 1] * duplicationFactor;
            }
        }
        setNetworkSize(newSize);
    };

    const handleFactorChange = (factor: number) => {
        setDuplicationFactor(factor);
        if (expansionMode === 'auto') {
            const newSize = [networkSize[0]];
            for (let i = 1; i < networkSize.length; i++) {
                newSize[i] = newSize[i - 1] * factor;
            }
            setNetworkSize(newSize);
        }
    };

    const handleModeToggle = (mode: 'manual' | 'auto') => {
        setExpansionMode(mode);
        if (mode === 'auto') {
            handleFactorChange(duplicationFactor); // Trigger recalculation
        }
    };

    const handleReset = () => {
        setNetworkSize([0, 0, 0, 0, 0, 0]);
        setPersonalUnits(0);
        setDuplicationFactor(1);
        setMonthRange('1');
        setUtilityType('DOMESTIC');
    };

    const tabs = [
        { id: 'simulator', label: t('light_simulator.tab_simulator'), icon: Calculator },
        { id: 'community', label: t('light_simulator.tab_community'), icon: UsersIcon },
        { id: 'road', label: t('light_simulator.tab_road'), icon: Lightbulb },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center sm:p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full h-full sm:h-auto sm:max-w-4xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] border border-white/50 dark:border-white/10"
                    >
                        {/* Header Premium */}
                        <div className="p-6 sm:p-8 border-b border-gray-100/50 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-union-green-600 to-cyan-600 dark:from-union-green-400 dark:to-cyan-400 bg-clip-text text-transparent leading-tight tracking-tighter">
                                    {t('light_simulator.title')}
                                </h2>
                                <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 opacity-70">
                                    {t('light_simulator.subtitle')} v1.2.27
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    onClick={() => openModal('SIMULATOR_FOCUS')}
                                    className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 text-purple-600 dark:text-purple-400 rounded-full transition-all text-xs font-black uppercase tracking-wider border border-purple-500/20 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20"
                                >
                                    <Sparkles size={16} className="animate-pulse" />
                                    <span>Visionary Mode</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 flex items-center justify-center bg-gray-100/50 dark:bg-white/5 hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-2xl transition-all text-gray-500 dark:text-gray-400 group active:scale-90"
                                >
                                    <X size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div
                            ref={scrollRef}
                            onScroll={onScrollContent}
                            className="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-slate-950/20 custom-scrollbar"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="h-full"
                                >
                                    {activeTab === 'simulator' && (
                                        <EarningsSimulator
                                            networkSize={networkSize}
                                            onLevelChange={handleLevelChange}
                                            personalUnits={personalUnits}
                                            setPersonalUnits={setPersonalUnits}
                                            expansionMode={expansionMode}
                                            setExpansionMode={handleModeToggle}
                                            duplicationFactor={duplicationFactor}
                                            onFactorChange={handleFactorChange}
                                            monthRange={monthRange}
                                            setMonthRange={setMonthRange}
                                            utilityType={utilityType}
                                            setUtilityType={setUtilityType}
                                            onReset={handleReset}
                                        />
                                    )}
                                    {activeTab === 'road' && (
                                        <RoadToZero
                                            networkSize={networkSize}
                                            utilityType={utilityType}
                                            monthRange={monthRange}
                                            personalUnits={personalUnits}
                                        />
                                    )}
                                    {activeTab === 'community' && (
                                        <Community
                                            personalUnits={personalUnits}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Tabs Navigation Premium */}
                        <div className="p-4 sm:p-6 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-t border-gray-100/50 dark:border-white/5">
                            <div className="flex items-center justify-around gap-2 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-[2rem] max-w-md mx-auto relative shadow-inner">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative flex items-center justify-center gap-2 py-3 px-6 rounded-2xl transition-all duration-300 flex-1 ${isActive
                                                ? 'text-union-green-600 dark:text-union-green-400 bg-white dark:bg-slate-800 shadow-lg shadow-union-green-500/10'
                                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                                }`}
                                        >
                                            <Icon size={18} className={isActive ? 'scale-110' : 'scale-90 opacity-60'} />
                                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">{tab.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeTabGlow"
                                                    className="absolute inset-0 rounded-2xl border-2 border-union-green-500/20 pointer-events-none"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div >
            )}
        </AnimatePresence >
    );
};

export default LightSimulatorModal;
