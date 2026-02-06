import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
import { Calculator, Info, RotateCcw, Plus, Minus, Layers, Zap, User, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

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
        <div className="space-y-6 pb-20 sm:pb-0">
            <div className="glass-card-light p-6 pt-4 border-l-4 border-union-green-500">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black flex items-center gap-2 text-union-black">
                        <Calculator className="text-union-green-500 w-6 h-6" />
                        {t('light_simulator.earn_title')}
                    </h2>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all font-bold text-[10px] uppercase tracking-wider border border-red-100"
                    >
                        <RotateCcw size={12} />
                        {t('light_simulator.reset')}
                    </button>
                </div>
                <p className="text-sm opacity-60 mb-5 text-union-black">{t('light_simulator.earn_desc')}</p>

                {/* Personal Units Slider (Independent) */}
                <div className="mb-5 p-4 px-6 bg-union-green-500/10 rounded-[2.5rem] border-2 border-union-green-500/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <User size={60} className="text-union-green-600" />
                    </div>
                    <div className="flex justify-between items-center mb-3 relative z-10">
                        <div>
                            <h4 className="text-base font-black text-union-black uppercase tracking-tight">{t('light_simulator.personal_units')}</h4>
                            <p className="text-xs text-union-green-600 font-bold">{t('light_simulator.personal_units_sub')}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPersonalUnits(Math.max(0, personalUnits - 1))}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                            >
                                <Minus size={14} />
                            </button>
                            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-union-green-100 min-w-[60px] text-center">
                                <span className="text-2xl font-black text-union-green-500">{personalUnits}</span>
                            </div>
                            <button
                                onClick={() => setPersonalUnits(Math.min(20, personalUnits + 1))}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-union-green-500 hover:border-union-green-200 transition-all shadow-sm active:scale-90"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        value={personalUnits}
                        onChange={(e) => setPersonalUnits(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-union-green-500"
                    />
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[8px] font-bold text-gray-400">0</span>
                        <span className="text-[8px] font-bold text-gray-400">20+</span>
                    </div>
                </div>

                {/* System Toggle: Manual vs Auto */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-5">
                    <button
                        onClick={() => setExpansionMode('auto')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-xl transition-all ${expansionMode === 'auto' ? 'bg-white shadow-md text-union-green-600' : 'text-gray-400'}`}
                    >
                        <Zap size={16} />
                        {t('light_simulator.system_auto')}
                    </button>
                    <button
                        onClick={() => setExpansionMode('manual')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-xl transition-all ${expansionMode === 'manual' ? 'bg-white shadow-md text-union-green-600' : 'text-gray-400'}`}
                    >
                        <Layers size={16} />
                        {t('light_simulator.system_manual')}
                    </button>
                </div>

                {/* Multiplier Slider (Only in Auto Mode) */}
                {expansionMode === 'auto' && (
                    <div className="mb-8 p-4 bg-union-green-500/5 rounded-2xl border border-union-green-500/10">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs uppercase font-black text-union-green-600">{t('light_simulator.dupl_factor')}</span>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onFactorChange(Math.max(1, duplicationFactor - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="text-2xl font-black text-union-green-600 w-10 text-center">x{duplicationFactor}</span>
                                <button
                                    onClick={() => onFactorChange(Math.min(10, duplicationFactor + 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-union-green-500 hover:border-union-green-200 transition-all shadow-sm active:scale-90"
                                >
                                    <Plus size={16} />
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
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-union-green-500"
                        />
                        <p className="text-[9px] mt-2 text-union-green-600/60 font-medium italic text-center">{t('light_simulator.dupl_note').replace('{{n}}', duplicationFactor.toString())}</p>
                    </div>
                )}

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setUtilityType('DOMESTIC')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${utilityType === 'DOMESTIC' ? 'border-union-green-500 bg-union-green-500/5 text-union-green-500' : 'border-gray-100 opacity-40'}`}
                    >
                        {t('light_simulator.domestic')}
                    </button>
                    <button
                        onClick={() => setUtilityType('BUSINESS')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${utilityType === 'BUSINESS' ? 'border-union-green-500 bg-union-green-500/5 text-union-green-500' : 'border-gray-100 opacity-40'}`}
                    >
                        {t('light_simulator.business')}
                    </button>
                </div>

                <div className="text-center py-6 mb-5 bg-union-light/50 rounded-2xl border border-union-green-500/10">
                    <p className="text-xs uppercase font-bold opacity-40 mb-1 text-union-black">{t('light_simulator.monthly_est')}</p>
                    <h3 className="text-5xl font-black text-union-green-600">{calculateEarnings()}</h3>
                </div>

                <div className="flex bg-union-light p-1 rounded-xl mb-6">
                    {['1', '13', '25'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMonthRange(m)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${monthRange === m ? 'bg-white shadow-sm text-union-green-500' : 'opacity-40 text-union-black'}`}
                        >
                            {m === '1' ? t('light_simulator.months_1_12') : m === '13' ? t('light_simulator.months_13_14') : t('light_simulator.months_25_plus')}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {networkSize.map((count, i) => {
                        const isUnlocked = i === 0 || (
                            i === 1 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_1 :
                                i === 2 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_2 :
                                    i === 3 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_3 :
                                        i === 4 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_4 :
                                            i === 5 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_5 : true
                        );

                        return (
                            <div key={i} className={`p-4 rounded-3xl transition-all duration-500 border-2 ${isUnlocked
                                ? 'bg-union-green-500/5 border-union-green-500/20 shadow-sm'
                                : 'bg-gray-50/50 border-gray-100 opacity-40 grayscale-[0.5]'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${isUnlocked ? 'bg-union-green-500 text-white shadow-lg shadow-union-green-500/20' : 'bg-gray-200 text-gray-400'}`}>
                                            {isUnlocked ? <CheckCircle2 size={16} /> : <Lock size={16} />}
                                        </div>
                                        <span className={`text-sm font-black uppercase tracking-tight ${isUnlocked ? 'text-union-black' : 'text-gray-400'}`}>
                                            {t('light_simulator.level')} <span className={isUnlocked ? 'text-union-green-600' : ''}>{i}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {(expansionMode === 'manual' || i === 0) && (
                                            <button
                                                onClick={() => onLevelChange(i, Math.max(0, count - 1))}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 transition-all shadow-sm active:scale-90 ${isUnlocked ? 'text-gray-400 hover:text-red-500 hover:border-red-200' : 'cursor-not-allowed opacity-50'}`}
                                            >
                                                <Minus size={16} />
                                            </button>
                                        )}
                                        <div className="min-w-[100px] text-center">
                                            <span className={`text-xl font-black ${isUnlocked ? 'text-union-green-600' : 'text-gray-400'}`}>{count}</span>
                                            <span className="text-[10px] opacity-40 font-bold ml-1.5 uppercase">{t('light_simulator.units')}</span>
                                        </div>
                                        {(expansionMode === 'manual' || i === 0) && (
                                            <button
                                                onClick={() => onLevelChange(i, count + 1)}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 transition-all shadow-sm active:scale-90 ${isUnlocked ? 'text-gray-400 hover:text-union-green-500 hover:border-union-green-200' : 'cursor-not-allowed opacity-50'}`}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {(expansionMode === 'manual' || i === 0) && (
                                    <div className="mt-4 px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max={i === 0 ? 50 : 1000}
                                            value={count}
                                            onChange={(e) => onLevelChange(i, parseInt(e.target.value))}
                                            className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all ${isUnlocked ? 'accent-union-green-500 bg-union-green-500/10' : 'accent-gray-300 bg-gray-200 cursor-not-allowed'}`}
                                            disabled={!isUnlocked}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-card-light p-5 bg-yellow-50/50 border-yellow-200">
                <div className="flex gap-4">
                    <Info className="text-yellow-600 w-6 h-6 shrink-0" />
                    <div>
                        <p className="text-sm font-bold text-yellow-800">{t('light_simulator.did_you_know')}</p>
                        <p className="text-xs text-yellow-700 opacity-80 leading-relaxed font-medium">
                            {t('light_simulator.did_you_know_text')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsSimulator;
