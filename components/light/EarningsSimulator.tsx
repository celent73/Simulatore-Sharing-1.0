import React from 'react';
import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
import { Calculator, Info, RotateCcw, Plus, Minus, Layers, Zap, User } from 'lucide-react';
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
            <div className="glass-card-light p-6 border-l-4 border-union-green-500">
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-union-black">
                        <Calculator className="text-union-green-500 w-5 h-5" />
                        Simulatore Rendita
                    </h2>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all font-bold text-[10px] uppercase tracking-wider border border-red-100"
                    >
                        <RotateCcw size={12} />
                        Azzera
                    </button>
                </div>
                <p className="text-xs opacity-60 mb-6 text-union-black">Simula il tuo rendimento mensile basato sui 6 livelli della community.</p>

                {/* Personal Units Slider (Independent) */}
                <div className="mb-8 p-6 bg-union-green-500/10 rounded-[2.5rem] border-2 border-union-green-500/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <User size={60} className="text-union-green-600" />
                    </div>
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <div>
                            <h4 className="text-sm font-black text-union-black uppercase tracking-tight">Le Tue Utenze Personali</h4>
                            <p className="text-[10px] text-union-green-600 font-bold">Servono per sbloccare i livelli community</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setPersonalUnits(Math.max(0, personalUnits - 1))}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                            >
                                <Minus size={14} />
                            </button>
                            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-union-green-100 min-w-[50px] text-center">
                                <span className="text-xl font-black text-union-green-500">{personalUnits}</span>
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
                <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
                    <button
                        onClick={() => setExpansionMode('auto')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black rounded-xl transition-all ${expansionMode === 'auto' ? 'bg-white shadow-md text-union-green-600' : 'text-gray-400'}`}
                    >
                        <Zap size={14} />
                        SISTEMA AUTOMATICO
                    </button>
                    <button
                        onClick={() => setExpansionMode('manual')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-black rounded-xl transition-all ${expansionMode === 'manual' ? 'bg-white shadow-md text-union-green-600' : 'text-gray-400'}`}
                    >
                        <Layers size={14} />
                        SISTEMA MANUALE
                    </button>
                </div>

                {/* Multiplier Slider (Only in Auto Mode) */}
                {expansionMode === 'auto' && (
                    <div className="mb-8 p-4 bg-union-green-500/5 rounded-2xl border border-union-green-500/10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] uppercase font-black text-union-green-600">Fattore di Duplicazione</span>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onFactorChange(Math.max(1, duplicationFactor - 1))}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-xl font-black text-union-green-600 w-8 text-center">x{duplicationFactor}</span>
                                <button
                                    onClick={() => onFactorChange(Math.min(10, duplicationFactor + 1))}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-union-green-500 hover:border-union-green-200 transition-all shadow-sm active:scale-90"
                                >
                                    <Plus size={14} />
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
                        <p className="text-[9px] mt-2 text-union-green-600/60 font-medium italic text-center">Ogni persona in rete porta {duplicationFactor} utenti.</p>
                    </div>
                )}

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setUtilityType('DOMESTIC')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${utilityType === 'DOMESTIC' ? 'border-union-green-500 bg-union-green-500/5 text-union-green-500' : 'border-gray-100 opacity-40'}`}
                    >
                        Domestico
                    </button>
                    <button
                        onClick={() => setUtilityType('BUSINESS')}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${utilityType === 'BUSINESS' ? 'border-union-green-500 bg-union-green-500/5 text-union-green-500' : 'border-gray-100 opacity-40'}`}
                    >
                        Business
                    </button>
                </div>

                <div className="text-center py-8 mb-6 bg-union-light/50 rounded-2xl border border-union-green-500/10">
                    <p className="text-[10px] uppercase font-bold opacity-40 mb-1 text-union-black">Mensile Stimato</p>
                    <h3 className="text-4xl font-black text-union-black">{calculateEarnings()}</h3>
                </div>

                <div className="flex bg-union-light p-1 rounded-xl mb-8">
                    {['1', '13', '25'].map((m) => (
                        <button
                            key={m}
                            onClick={() => setMonthRange(m)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${monthRange === m ? 'bg-white shadow-sm text-union-green-500' : 'opacity-40 text-union-black'}`}
                        >
                            {m === '1' ? 'Mesi 1-12' : m === '13' ? 'Mesi 13-24' : 'Mesi 25+'}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">
                    {networkSize.map((count, i) => (
                        <div key={i} className={`space-y-3 transition-opacity duration-300 ${expansionMode === 'auto' && i > 0 ? 'opacity-60' : 'opacity-100'}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-union-black whitespace-nowrap">Livello {i}</span>

                                <div className="flex items-center gap-3">
                                    {(expansionMode === 'manual' || i === 0) && (
                                        <button
                                            onClick={() => onLevelChange(i, Math.max(0, count - 1))}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-90"
                                        >
                                            <Minus size={14} />
                                        </button>
                                    )}
                                    <div className="min-w-[80px] text-center">
                                        <span className="text-sm font-black text-union-green-500">{count}</span>
                                        <span className="text-[10px] opacity-40 font-bold ml-1 uppercase">utenze</span>
                                    </div>
                                    {(expansionMode === 'manual' || i === 0) && (
                                        <button
                                            onClick={() => onLevelChange(i, count + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-union-green-500 hover:border-union-green-200 transition-all shadow-sm active:scale-90"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {(expansionMode === 'manual' || i === 0) && (
                                <input
                                    type="range"
                                    min="0"
                                    max={i === 0 ? 50 : 1000}
                                    value={count}
                                    onChange={(e) => onLevelChange(i, parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-union-green-500"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-card-light p-4 bg-yellow-50/50 border-yellow-200">
                <div className="flex gap-3">
                    <Info className="text-yellow-600 w-5 h-5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-yellow-800">Lo sapevi?</p>
                        <p className="text-[10px] text-yellow-700 opacity-80 leading-relaxed font-medium">
                            Dal 13° mese la tua rendita aumenta del 50%! E dal 25° mese raddoppia (es. da 1€ a 2€ per utenza domestica).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsSimulator;
