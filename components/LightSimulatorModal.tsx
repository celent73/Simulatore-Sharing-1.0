import React, { useState } from 'react';
import { X, Calculator, Lightbulb, Users as UsersIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EarningsSimulator from './light/EarningsSimulator';
import RoadToZero from './light/RoadToZero';
import Community from './light/Community';

interface LightSimulatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LightSimulatorModal: React.FC<LightSimulatorModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('simulator');

    // Shared State for all tabs
    const [personalUnits, setPersonalUnits] = useState(5);
    const [expansionMode, setExpansionMode] = useState<'manual' | 'auto'>('auto');
    const [duplicationFactor, setDuplicationFactor] = useState(3);
    const [networkSize, setNetworkSize] = useState([5, 15, 45, 100, 250, 500]);
    const [monthRange, setMonthRange] = useState('1');
    const [utilityType, setUtilityType] = useState<'DOMESTIC' | 'BUSINESS'>('DOMESTIC');

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
        setDuplicationFactor(3);
        setMonthRange('1');
        setUtilityType('DOMESTIC');
    };

    const tabs = [
        { id: 'simulator', label: 'Simulatore', icon: Calculator },
        { id: 'community', label: 'Community', icon: UsersIcon },
        { id: 'road', label: 'Road to Zero', icon: Lightbulb },
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
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-white dark:bg-slate-900 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                            <div>
                                <h2 className="text-2xl font-black text-union-green-600 dark:text-union-green-400 leading-tight">
                                    Sharing Simulator <span className="text-union-black dark:text-white opacity-40">light</span>
                                </h2>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Versione accelerata per la tua community</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30 dark:bg-slate-950/20 custom-scrollbar">
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

                        {/* Tabs Navigation */}
                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/10">
                            <div className="flex items-center justify-around gap-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all min-w-[70px] ${isActive
                                                ? 'text-union-green-600 bg-union-green-50'
                                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon size={20} className={isActive ? 'animate-bounce-subtle' : ''} />
                                            <span className="text-[10px] font-bold uppercase tracking-tighter">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LightSimulatorModal;
