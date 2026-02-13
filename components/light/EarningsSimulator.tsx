import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
import { Calculator, Info, RotateCcw, Plus, Minus, Layers, Zap, User, Lock, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useShary } from '../../contexts/SharyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface EarningsSimulatorProps {
    networkSize: number[];
    onLevelChange: (index: number, value: number) => void;
    personalUnits: number;
    setPersonalUnits: (value: number) => void;
    expansionMode: 'manual' | 'auto';
    setExpansionMode: (mode: 'manual' | 'auto') => void;
    duplicationFactor: number;
    onFactorChange: (factor: number) => void;
    monthRange: string;
    setMonthRange: (range: string) => void;
    utilityType: 'DOMESTIC' | 'BUSINESS';
    setUtilityType: (type: 'DOMESTIC' | 'BUSINESS') => void;
    onReset: () => void;
}

const EarningsSimulator: React.FC<EarningsSimulatorProps> = ({
    networkSize,
    onLevelChange,
    personalUnits,
    setPersonalUnits,
    expansionMode,
    setExpansionMode,
    duplicationFactor,
    onFactorChange,
    monthRange,
    setMonthRange,
    utilityType,
    setUtilityType,
    onReset
}) => {
    const { t } = useLanguage();
    const { isActive: isSharyActive } = useShary();
    const [isSharyTipOpen, setIsSharyTipOpen] = useState(false);

    const calculateEarnings = () => {
        let total = 0;
        const commissions = utilityType === 'DOMESTIC' ? (
            monthRange === '1' ?
                LEVEL_COMMISSIONS.DOMESTIC.RECURRING :
                monthRange === '13' ?
                    LEVEL_COMMISSIONS.DOMESTIC.RECURRING_13_24 :
                    LEVEL_COMMISSIONS.DOMESTIC.RECURRING_25_PLUS
        ) : (
            monthRange === '1' ?
                LEVEL_COMMISSIONS.BUSINESS.RECURRING :
                monthRange === '13' ?
                    LEVEL_COMMISSIONS.BUSINESS.RECURRING_13_24 :
                    LEVEL_COMMISSIONS.BUSINESS.RECURRING_25_PLUS
        );

        const level0Count = networkSize[0] || 0;
        const totalUtenzeLivello0 = level0Count + personalUnits;

        networkSize.forEach((count, level) => {
            let isUnlocked = true;
            if (level === 1) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_1;
            else if (level === 2) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_2;
            else if (level === 3) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_3;
            else if (level === 4) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_4;
            else if (level === 5) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_5;

            if (isUnlocked && commissions[level]) {
                const effectiveCount = level === 0 ? totalUtenzeLivello0 : count;
                total += effectiveCount * commissions[level];
            }
        });
        return total.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
    };

    return (
        <div className="space-y-8 pb-24 sm:pb-0">
            {/* Header Simulator Premium */}
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <Calculator size={120} className="text-union-green-600" />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-3 text-slate-800 dark:text-white tracking-tighter">
                            <div className="w-10 h-10 rounded-xl bg-union-green-500 text-white flex items-center justify-center shadow-lg shadow-union-green-500/30">
                                <Calculator size={20} />
                            </div>
                            {t('light_simulator.earn_title')}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-2 max-w-md leading-relaxed">
                            {t('light_simulator.earn_desc')}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-start">
                        {isSharyActive && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSharyTipOpen(true)}
                                className="flex items-center gap-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-4 py-2 rounded-2xl border border-cyan-500/20 shadow-sm transition-all"
                            >
                                <span className="text-sm">🤖</span>
                                <span className="text-[10px] font-black uppercase tracking-wider">Help</span>
                            </motion.button>
                        )}
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-red-500/20 hover:bg-red-500/5"
                        >
                            <RotateCcw size={14} />
                            {t('light_simulator.reset')}
                        </button>
                    </div>
                </div>

                {/* Personal Units Slider Premium */}
                <div className="mb-10 p-6 bg-gradient-to-br from-union-green-50/50 to-white/50 dark:from-union-green-500/5 dark:to-slate-900/50 rounded-[2.5rem] border-2 border-white dark:border-white/10 shadow-inner relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('light_simulator.personal_units')}</h4>
                            <p className="text-xs text-union-green-600 dark:text-union-green-400 font-bold opacity-80">{t('light_simulator.personal_units_sub')}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPersonalUnits(Math.max(0, personalUnits - 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 transition-all shadow-sm active:scale-90"
                            >
                                <Minus size={18} />
                            </button>
                            <div className="bg-white dark:bg-slate-950 px-5 py-3 rounded-2xl shadow-lg border border-union-green-500/20 min-w-[70px] text-center">
                                <span className="text-3xl font-black text-union-green-600 dark:text-union-green-400 leading-none">{personalUnits}</span>
                            </div>
                            <button
                                onClick={() => setPersonalUnits(Math.min(20, personalUnits + 1))}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-union-green-500 transition-all shadow-sm active:scale-90"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="relative pt-2">
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={personalUnits}
                            onChange={(e) => setPersonalUnits(parseInt(e.target.value))}
                            className="w-full h-2.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-union-green-500 ring-4 ring-union-green-500/5"
                        />
                        <div className="flex justify-between mt-3 px-1">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">0</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">20+</span>
                        </div>
                    </div>
                </div>

                {/* System Toggle Premium pill switcher */}
                <div className="grid grid-cols-2 bg-gray-200/50 dark:bg-black/30 p-1.5 rounded-[2rem] gap-1 mb-8 shadow-inner border border-white/10 relative overflow-hidden">
                    <button
                        onClick={() => setExpansionMode('auto')}
                        className={`relative z-10 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${expansionMode === 'auto' ? 'text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
                    >
                        <Zap size={16} fill={expansionMode === 'auto' ? "currentColor" : "none"} />
                        {t('light_simulator.system_auto')}
                        {expansionMode === 'auto' && (
                            <motion.div layoutId="modePill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-md -z-10" />
                        )}
                    </button>
                    <button
                        onClick={() => setExpansionMode('manual')}
                        className={`relative z-10 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${expansionMode === 'manual' ? 'text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
                    >
                        <Layers size={16} />
                        {t('light_simulator.system_manual')}
                        {expansionMode === 'manual' && (
                            <motion.div layoutId="modePill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-md -z-10" />
                        )}
                    </button>
                </div>

                {/* Multiplier Slider Premium (Only in Auto Mode) */}
                <AnimatePresence>
                    {expansionMode === 'auto' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-10 p-6 bg-blue-500/5 dark:bg-blue-500/10 rounded-[2rem] border border-blue-500/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <span className="text-xs uppercase font-black text-blue-600 dark:text-blue-400 tracking-widest block mb-1">{t('light_simulator.dupl_factor')}</span>
                                    <p className="text-[10px] text-blue-600/60 dark:text-blue-400/60 font-bold italic">{t('light_simulator.dupl_note').replace('{{n}}', duplicationFactor.toString())}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onFactorChange(Math.max(1, duplicationFactor - 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-red-500 transition-all shadow-sm active:scale-90"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <div className="bg-white dark:bg-slate-950 px-4 py-3 rounded-2xl shadow-lg border border-blue-500/20 min-w-[60px] text-center">
                                        <span className="text-2xl font-black text-blue-600 leading-none">x{duplicationFactor}</span>
                                    </div>
                                    <button
                                        onClick={() => onFactorChange(Math.min(10, duplicationFactor + 1))}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-blue-500 transition-all shadow-sm active:scale-90"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={duplicationFactor}
                                onChange={(e) => onFactorChange(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500 ring-4 ring-blue-500/5"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Utility Type Toggle Premium */}
                <div className="grid grid-cols-2 bg-gray-200/50 dark:bg-black/30 p-1.5 rounded-[2rem] gap-1 mb-8 shadow-inner border border-white/10 relative overflow-hidden">
                    <button
                        onClick={() => setUtilityType('DOMESTIC')}
                        className={`relative z-10 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${utilityType === 'DOMESTIC' ? 'text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
                    >
                        {t('light_simulator.domestic')}
                        {utilityType === 'DOMESTIC' && (
                            <motion.div layoutId="utilityPill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-md -z-10" />
                        )}
                    </button>
                    <button
                        onClick={() => setUtilityType('BUSINESS')}
                        className={`relative z-10 flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-300 ${utilityType === 'BUSINESS' ? 'text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
                    >
                        {t('light_simulator.business')}
                        {utilityType === 'BUSINESS' && (
                            <motion.div layoutId="utilityPill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-md -z-10" />
                        )}
                    </button>
                </div>

                <div className="relative py-10 mb-10 bg-gradient-to-br from-union-green-600 to-cyan-600 rounded-[2.5rem] shadow-2xl shadow-union-green-500/20 overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] uppercase font-black text-white/60 tracking-[0.3em] mb-2">{t('light_simulator.monthly_est')}</p>
                        <h3 className="text-5xl sm:text-6xl font-black text-white drop-shadow-md tracking-tighter tabular-nums">
                            {calculateEarnings()}
                        </h3>
                    </div>
                </div>

                {/* Month Range Selector Premium pill switcher */}
                <div className="grid grid-cols-3 bg-gray-200/50 dark:bg-black/30 p-1.5 rounded-[2rem] gap-1 mb-10 shadow-inner border border-white/10 relative overflow-hidden">
                    {['1', '13', '25'].map((m) => {
                        const label = m === '1' ? t('light_simulator.months_1_12') : m === '13' ? t('light_simulator.months_13_14') : t('light_simulator.months_25_plus');
                        const isActive = monthRange === m;
                        return (
                            <button
                                key={m}
                                onClick={() => setMonthRange(m)}
                                className={`relative z-10 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-[1.5rem] transition-all duration-300 ${isActive ? 'text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
                            >
                                {label}
                                {isActive && (
                                    <motion.div layoutId="monthPill" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-md -z-10" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    {networkSize.map((count, i) => {
                        const isUnlocked = i === 0 || (
                            i === 1 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_1 :
                                i === 2 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_2 :
                                    i === 3 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_3 :
                                        i === 4 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_4 :
                                            i === 5 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_5 : true
                        );

                        return (
                            <motion.div
                                key={i}
                                layout
                                className={`p-6 rounded-[2.5rem] transition-all duration-500 border-2 relative overflow-hidden ${isUnlocked
                                    ? 'bg-white dark:bg-slate-900/60 border-union-green-500/20 shadow-xl shadow-union-green-500/5'
                                    : 'bg-gray-50/30 dark:bg-slate-950/30 border-gray-100 dark:border-white/5 opacity-60'
                                    }`}
                            >
                                {!isUnlocked && (
                                    <div className="absolute inset-0 bg-gray-100/10 dark:bg-black/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                        <div className="bg-white/90 dark:bg-slate-800/90 px-4 py-2 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 flex items-center gap-2 transform -rotate-1">
                                            <Lock size={14} className="text-gray-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                Sblocca con {i === 1 ? UNLOCK_CONDITIONS.LEVEL_1 : i === 2 ? UNLOCK_CONDITIONS.LEVEL_2 : i === 3 ? UNLOCK_CONDITIONS.LEVEL_3 : i === 4 ? UNLOCK_CONDITIONS.LEVEL_4 : UNLOCK_CONDITIONS.LEVEL_5} utenze
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-0">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isUnlocked ? 'bg-union-green-500 text-white shadow-lg shadow-union-green-500/30' : 'bg-gray-200 dark:bg-white/5 text-gray-400'}`}>
                                            {isUnlocked ? <CheckCircle2 size={24} /> : <Lock size={20} />}
                                        </div>
                                        <div>
                                            <span className={`text-sm font-black uppercase tracking-tighter block ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-gray-400'}`}>
                                                {t('light_simulator.level')} <span className={isUnlocked ? 'text-union-green-600' : ''}>{i}</span>
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                                {i === 0 ? 'Dirette' : `Profondità ${i}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        {(expansionMode === 'manual' || i === 0) && (
                                            <button
                                                onClick={() => onLevelChange(i, Math.max(0, count - 1))}
                                                className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent transition-all active:scale-90 ${isUnlocked ? 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10' : 'cursor-not-allowed opacity-30'}`}
                                            >
                                                <Minus size={20} />
                                            </button>
                                        )}
                                        <div className="flex flex-col items-center min-w-[100px]">
                                            <span className={`text-3xl font-black tabular-nums transition-colors ${isUnlocked ? 'text-union-green-600 dark:text-union-green-400' : 'text-gray-300'}`}>{count}</span>
                                            <span className="text-[9px] opacity-40 font-black uppercase tracking-widest">{t('light_simulator.units')}</span>
                                        </div>
                                        {(expansionMode === 'manual' || i === 0) && (
                                            <button
                                                onClick={() => onLevelChange(i, count + 1)}
                                                className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent transition-all active:scale-90 ${isUnlocked ? 'text-gray-500 hover:text-union-green-600 hover:bg-union-green-50 dark:hover:bg-union-green-500/10' : 'cursor-not-allowed opacity-30'}`}
                                            >
                                                <Plus size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {(expansionMode === 'manual' || i === 0) && (
                                    <div className="mt-8 relative h-10 flex items-center">
                                        <input
                                            type="range"
                                            min="0"
                                            max={i === 0 ? 50 : 1000}
                                            value={count}
                                            onChange={(e) => onLevelChange(i, parseInt(e.target.value))}
                                            className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all ${isUnlocked ? 'accent-union-green-500 bg-union-green-500/10 dark:bg-white/10' : 'accent-gray-300 bg-gray-200 dark:bg-white/5 cursor-not-allowed'}`}
                                            disabled={!isUnlocked}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Info Card */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-8 rounded-[3rem] border border-amber-200/50 dark:border-amber-500/10 shadow-lg relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-amber-200/20 dark:bg-amber-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex gap-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-2">{t('light_simulator.did_you_know')}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed font-bold opacity-80">
                            {t('light_simulator.did_you_know_text')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsSimulator;
