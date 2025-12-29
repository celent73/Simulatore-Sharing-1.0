
import React from 'react';
import { CondoSimulationResult } from '../types';
import AssetEquivalentCard from './AssetEquivalentCard';
import { useLanguage } from '../contexts/LanguageContext';

interface CondoResultsDisplayProps {
    results: CondoSimulationResult;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

const Card = ({ title, value, subValue, colorClass }: any) => (
    <div className={`p-5 rounded-[2rem] border backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${colorClass}`}>
        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl sm:text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-300 drop-shadow-sm">{value}</p>
        {subValue && <div className="text-xs opacity-80 font-medium mt-2">{subValue}</div>}
    </div>
);

const CondoResultsDisplay: React.FC<CondoResultsDisplayProps> = ({ results }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">

            {/* SUMMARY HEADER */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl dark:shadow-slate-900/50 relative overflow-hidden border border-slate-600 dark:border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="relative z-10 text-center">
                    <p className="text-slate-300 font-bold text-xs uppercase tracking-[0.2em] mb-3">{t('condo_results.total_business_plan')}</p>
                    <h2 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-union-orange-400 via-yellow-200 to-union-orange-400 mb-6 drop-shadow-[0_2px_10px_rgba(251,146,60,0.3)] animate-pulse-slow">
                        {formatCurrency(results.total3Years)}
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm font-medium leading-relaxed">
                        {t('condo_results.total_desc')}
                    </p>
                </div>
            </div>

            {/* YEARLY BREAKDOWN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* CARD 1: DETAILED BREAKDOWN */}
                <Card
                    title={t('condo_results.y1_total')}
                    value={formatCurrency(results.year1.totalAnnual)}
                    subValue={
                        <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-400/20 dark:border-white/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-70">{t('condo_results.ot_breakdown')}:</span>
                                <span className="font-bold">{formatCurrency(results.year1.oneTimeBonus)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-70">{t('condo_results.rec_annual_breakdown')}:</span>
                                <span className="font-bold">{formatCurrency(results.year1.recurringMonthly * 12)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] mt-1 text-union-orange-600 dark:text-union-orange-400 font-bold">
                                <span>{t('condo_results.rec_end_year')}:</span>
                                <span>{formatCurrency(results.year1.recurringMonthly)}/mese</span>
                            </div>
                            {results.networkStats && results.networkStats.usersCount > 0 && (
                                <div className="flex justify-between items-center text-[10px] mt-1 pt-1 border-t border-dashed border-purple-300/50 text-purple-600 dark:text-purple-400 font-bold">
                                    <span>Network (Liv. 0):</span>
                                    <span>+{formatCurrency(results.networkStats.totalAnnualYear1)}</span>
                                </div>
                            )}
                        </div>
                    }
                    colorClass="bg-white dark:bg-black/40 border-gray-100 dark:border-white/10 text-slate-800 dark:text-white dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
                <Card
                    title={t('condo_results.y2_total')}
                    value={formatCurrency(results.year2.totalAnnual)}
                    subValue={`${t('condo_results.rec_end_year')}: ${formatCurrency(results.year2.recurringMonthly)}`}
                    colorClass="bg-white dark:bg-black/40 border-gray-100 dark:border-white/10 text-slate-800 dark:text-white dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                />
                <div className={`p-5 rounded-[2rem] border border-white/20 backdrop-blur-md shadow-xl bg-gradient-to-br from-union-blue-600 to-union-blue-800 text-white shadow-union-blue-500/30 transition-all duration-300 hover:-translate-y-1`}>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1 text-blue-100">{t('condo_results.y3_total')}</p>
                    <p className="text-3xl sm:text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm">{formatCurrency(results.year3.totalAnnual)}</p>
                    <p className="text-xs opacity-80 font-medium text-blue-100 mt-2">{`${t('condo_results.rec_end_year')}: ${formatCurrency(results.year3.recurringMonthly)}`}</p>
                </div>
            </div>

            {/* DETAILED TABLE */}
            <div className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 overflow-hidden p-1">
                <div className="p-6 border-b border-gray-100 dark:border-white/5">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 text-gray-600 dark:text-gray-300 shadow-sm">📊</span>
                        {t('condo_results.detail_title')}
                    </h3>
                </div>
                <div className="overflow-x-auto bg-gray-50/50 dark:bg-black/20 rounded-3xl m-2 border border-gray-200 dark:border-white/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold backdrop-blur-sm">
                                <th className="p-4 border-b border-gray-200 dark:border-white/10">{t('condo_results.col_period')}</th>
                                <th className="p-4 border-b border-gray-200 dark:border-white/10">{t('condo_results.col_active_units')}</th>
                                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Guadagno Una Tantum</th>
                                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">{t('condo_results.rec_end_year')}</th>
                                <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right bg-gray-50/80 dark:bg-white/5">{t('condo_results.col_annual_total')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-white/5">
                            <tr className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y1')}</td>
                                <td className="p-4">{results.year1.activeUnits}</td>
                                <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(results.year1.oneTimeBonus)}</td>
                                <td className="p-4 text-right text-union-orange-500 dark:text-union-orange-400 font-bold">{formatCurrency(results.year1.recurringMonthly)}</td>
                                <td className="p-4 text-right font-black text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5">{formatCurrency(results.year1.totalAnnual)}</td>
                            </tr>
                            <tr className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y2')}</td>
                                <td className="p-4">{results.year2.activeUnits} <span className="text-xs text-green-500 ml-1 font-bold">(+{results.year2.activeUnits - results.year1.activeUnits})</span></td>
                                <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(results.year2.oneTimeBonus)}</td>
                                <td className="p-4 text-right text-union-orange-500 dark:text-union-orange-400 font-bold">{formatCurrency(results.year2.recurringMonthly)}</td>
                                <td className="p-4 text-right font-black text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5">{formatCurrency(results.year2.totalAnnual)}</td>
                            </tr>
                            <tr className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y3')}</td>
                                <td className="p-4">{results.year3.activeUnits} <span className="text-xs text-green-500 ml-1 font-bold">(+{results.year3.activeUnits - results.year2.activeUnits})</span></td>
                                <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(results.year3.oneTimeBonus)}</td>
                                <td className="p-4 text-right text-union-orange-500 dark:text-union-orange-400 font-bold">{formatCurrency(results.year3.recurringMonthly)}</td>
                                <td className="p-4 text-right font-black text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5">{formatCurrency(results.year3.totalAnnual)}</td>
                            </tr>
                            {/* NETWORK ROW (Simplified) */}
                            {results.networkStats && results.networkStats.usersCount > 0 && (
                                <tr className="bg-purple-50/50 dark:bg-purple-900/10 border-t-2 border-purple-100 dark:border-purple-500/30">
                                    <td className="p-4 font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                        <span className="text-lg">🟣</span> Network (Lv. 0)
                                    </td>
                                    <td className="p-4 text-purple-600 dark:text-purple-300 font-bold">
                                        {results.networkStats.usersCount} Utenti
                                    </td>
                                    <td className="p-4 text-right text-purple-600 dark:text-purple-300 font-bold">
                                        +{formatCurrency(results.networkStats.oneTimeBonus)}
                                    </td>
                                    <td className="p-4 text-right text-purple-600 dark:text-purple-300 font-bold">
                                        +{formatCurrency(results.networkStats.recurringYear3)}
                                    </td>
                                    <td className="p-4 text-right font-black text-purple-900 dark:text-purple-100 bg-purple-100/50 dark:bg-purple-900/30">
                                        +{formatCurrency(results.networkStats.totalAnnualYear1 + results.networkStats.totalAnnualYear2 + results.networkStats.totalAnnualYear3)} <span className="text-[10px] font-normal opacity-70 block sm:inline">(3 Anni)</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AssetEquivalentCard recurringAnnual={results.year3.recurringMonthly * 12} />

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-sm text-blue-800 dark:text-blue-200 flex gap-3">
                <span className="text-xl">ℹ️</span>
                <p>
                    <strong>{t('condo_results.calc_note')}:</strong> {t('condo_results.calc_note_text')}
                </p>
            </div>

        </div >
    );
};

export default CondoResultsDisplay;
