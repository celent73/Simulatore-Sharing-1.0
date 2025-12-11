
import React from 'react';
import { CondoInput } from '../types';
import InputGroup from './InputGroup';
import { useLanguage } from '../contexts/LanguageContext';

interface CondoInputPanelProps {
    inputs: CondoInput;
    onInputChange: (field: keyof CondoInput, value: number) => void;
    onReset: () => void;
}

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-union-blue-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
);

const CondoInputPanel: React.FC<CondoInputPanelProps> = ({ inputs, onInputChange, onReset }) => {
    const { t } = useLanguage();

    const effectiveCondos = (inputs.greenUnits || 0) + (inputs.lightUnits || 0);

    return (
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-3xl shadow-md border border-blue-300 dark:border-gray-600 h-full transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-union-blue-50/50 dark:bg-union-blue-900/20 rounded-xl backdrop-blur-sm">
                        <BuildingIcon />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                        {t('input.admin_params')}
                    </h2>
                </div>
                <button onClick={onReset} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0 8.25 8.25 0 0 0 0-11.667l-3.182-3.182m0 0-3.182 3.183m3.182-3.182-4.992 4.992" />
                    </svg>
                </button>
            </div>

            <div className="space-y-6">
                {/* GREEN SECTION */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800">
                    <h3 className="text-green-700 dark:text-green-400 font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-lg">🌿</span> {t('input.green_section')}
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label={t('input.green_units_init')}
                            value={inputs.greenUnits}
                            onChange={(val) => onInputChange('greenUnits', val)}
                            max={1000}
                            step={10}
                        />
                        <InputGroup
                            label={t('input.green_units_new')}
                            value={inputs.yearlyNewUnitsGreen}
                            onChange={(val) => onInputChange('yearlyNewUnitsGreen', val)}
                            max={500}
                            step={5}
                        />
                    </div>
                </div>

                {/* LIGHT SECTION */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <h3 className="text-blue-700 dark:text-blue-400 font-bold text-sm mb-4 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-lg">💡</span> {t('input.light_section')}
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label={t('input.light_units_init')}
                            value={inputs.lightUnits}
                            onChange={(val) => onInputChange('lightUnits', val)}
                            max={1000}
                            step={10}
                        />
                        <InputGroup
                            label={t('input.light_units_new')}
                            value={inputs.yearlyNewUnitsLight}
                            onChange={(val) => onInputChange('yearlyNewUnitsLight', val)}
                            max={500}
                            step={5}
                        />
                    </div>
                </div>

                {/* NETWORK SECTION (Calculated) */}
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-200 dark:border-purple-800">

                    <div className="space-y-4">
                        <InputGroup
                            label={t('input.families_per_condo') || "Famiglie Condominio"}
                            value={inputs.familiesPerCondo || 20}
                            onChange={(val) => onInputChange('familiesPerCondo', val)}
                            max={100}
                            step={5}
                        />

                        {/* MATH FEEDBACK 1 */}
                        <div className="bg-white/50 dark:bg-black/20 p-2 rounded-lg text-xs text-center font-mono text-purple-800 dark:text-purple-300">
                            {effectiveCondos} (Condomini) x {inputs.familiesPerCondo || 0} (Fam) = <strong>{effectiveCondos * (inputs.familiesPerCondo || 0)}</strong> Famiglie Totali
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('input.network_conversion') || "% Adesione Network"}
                                </label>
                                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-lg">
                                    {inputs.networkConversionRate || 0}%
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={inputs.networkConversionRate || 0}
                                onChange={(e) => onInputChange('networkConversionRate', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600"
                            />

                            {/* MATH FEEDBACK 2 */}
                            <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 text-center font-medium">
                                <span className="text-purple-600 dark:text-purple-400">
                                    {Math.floor(((effectiveCondos) * (inputs.familiesPerCondo || 0)) * ((inputs.networkConversionRate || 0) / 100))}
                                </span> nuovi clienti stimati
                                <div className="text-[9px] opacity-70">
                                    ({(effectiveCondos) * (inputs.familiesPerCondo || 0)} x {inputs.networkConversionRate || 0}% = {Math.floor(((effectiveCondos) * (inputs.familiesPerCondo || 0)) * ((inputs.networkConversionRate || 0) / 100))})
                                </div>
                            </div>

                            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded text-[10px] text-yellow-700 dark:text-yellow-400 flex gap-2 items-start">
                                <span>⚠️</span>
                                <span>{t('input.network_assumption_note') || "Nota: Il calcolo considera l'attivazione di 2 contratti per cliente (1 Green + 1 Light)."}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 px-2 leading-relaxed">
                <p>{t('input.condo_note')}</p>
            </div>

        </div>
    );
};

export default CondoInputPanel;
