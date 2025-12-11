
import React from 'react';
import { CondoSimulationResult } from '../types';
import CondoGhostCard from './CondoGhostCard';
import { useLanguage } from '../contexts/LanguageContext';

interface CondoResultsDisplayProps {
  results: CondoSimulationResult;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

const Card = ({ title, value, subValue, colorClass }: any) => (
    <div className={`p-5 rounded-2xl border backdrop-blur-sm shadow-lg ${colorClass}`}>
        <p className="text-sm font-bold opacity-80 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl sm:text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-300 drop-shadow-sm">{value}</p>
        {subValue && <div className="text-xs opacity-80 font-medium mt-2">{subValue}</div>}
    </div>
);

const CondoResultsDisplay: React.FC<CondoResultsDisplayProps> = ({ results }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-8">
        
        {/* SUMMARY HEADER */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-slate-600">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="relative z-10 text-center">
                <p className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-2">{t('condo_results.total_business_plan')}</p>
                <h2 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-union-orange-400 via-yellow-200 to-union-orange-400 mb-4 drop-shadow-[0_2px_10px_rgba(251,146,60,0.3)] animate-pulse-slow">
                    {formatCurrency(results.total3Years)}
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                    {t('condo_results.total_desc')}
                </p>
            </div>
        </div>

        {/* YEARLY BREAKDOWN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CARD 1: DETAILED BREAKDOWN */}
            <Card 
                title={t('condo_results.y1_total')}
                value={formatCurrency(results.year1.totalAnnual)}
                subValue={
                    <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-slate-400/30 dark:border-gray-500/30">
                        <div className="flex justify-between items-center">
                            <span className="opacity-80">{t('condo_results.ot_breakdown')}:</span>
                            <span className="font-bold">{formatCurrency(results.year1.oneTimeBonus)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="opacity-80">{t('condo_results.rec_annual_breakdown')}:</span>
                            <span className="font-bold">{formatCurrency(results.year1.recurringMonthly * 12)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] mt-1 text-union-orange-600 dark:text-union-orange-400">
                            <span>{t('condo_results.rec_end_year')}:</span>
                            <span>{formatCurrency(results.year1.recurringMonthly)}/mese</span>
                        </div>
                    </div>
                }
                colorClass="bg-white/70 dark:bg-gray-800/60 border-blue-200 dark:border-gray-600 text-slate-800 dark:text-white"
            />
             <Card 
                title={t('condo_results.y2_total')}
                value={formatCurrency(results.year2.totalAnnual)}
                subValue={`${t('condo_results.rec_end_year')}: ${formatCurrency(results.year2.recurringMonthly)}`}
                colorClass="bg-white/70 dark:bg-gray-800/60 border-blue-200 dark:border-gray-600 text-slate-800 dark:text-white"
            />
             <div className={`p-5 rounded-2xl border backdrop-blur-sm shadow-lg bg-gradient-to-br from-union-blue-600 to-union-blue-700 border-transparent text-white shadow-union-blue-500/30`}>
                <p className="text-sm font-bold opacity-80 uppercase tracking-wider mb-1 text-blue-100">{t('condo_results.y3_total')}</p>
                <p className="text-3xl sm:text-4xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 drop-shadow-sm">{formatCurrency(results.year3.totalAnnual)}</p>
                <p className="text-xs opacity-80 font-medium text-blue-100">{`${t('condo_results.rec_end_year')}: ${formatCurrency(results.year3.recurringMonthly)}`}</p>
            </div>
        </div>

        {/* DETAILED TABLE */}
        <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    📊 {t('condo_results.detail_title')}
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-700/30 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                            <th className="p-4 border-b dark:border-gray-700">{t('condo_results.col_period')}</th>
                            <th className="p-4 border-b dark:border-gray-700">{t('condo_results.col_active_units')}</th>
                            <th className="p-4 border-b dark:border-gray-700 text-right">{t('condo_results.col_token')}</th>
                            <th className="p-4 border-b dark:border-gray-700 text-right">{t('condo_results.rec_end_year')}</th>
                            <th className="p-4 border-b dark:border-gray-700 text-right bg-gray-50 dark:bg-gray-700/50">{t('condo_results.col_annual_total')}</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y1')}</td>
                            <td className="p-4">{results.year1.activeUnits}</td>
                            <td className="p-4 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(results.year1.oneTimeBonus)}</td>
                            <td className="p-4 text-right text-union-orange-500">{formatCurrency(results.year1.recurringMonthly)}</td>
                            <td className="p-4 text-right font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">{formatCurrency(results.year1.totalAnnual)}</td>
                        </tr>
                        <tr className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y2')}</td>
                            <td className="p-4">{results.year2.activeUnits} <span className="text-xs text-green-500 ml-1">(+{results.year2.activeUnits - results.year1.activeUnits})</span></td>
                            <td className="p-4 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(results.year2.oneTimeBonus)}</td>
                            <td className="p-4 text-right text-union-orange-500">{formatCurrency(results.year2.recurringMonthly)}</td>
                            <td className="p-4 text-right font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">{formatCurrency(results.year2.totalAnnual)}</td>
                        </tr>
                         <tr className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y3')}</td>
                            <td className="p-4">{results.year3.activeUnits} <span className="text-xs text-green-500 ml-1">(+{results.year3.activeUnits - results.year2.activeUnits})</span></td>
                            <td className="p-4 text-right text-emerald-600 dark:text-emerald-400">{formatCurrency(results.year3.oneTimeBonus)}</td>
                            <td className="p-4 text-right text-union-orange-500">{formatCurrency(results.year3.recurringMonthly)}</td>
                            <td className="p-4 text-right font-bold text-gray-900 dark:text-white bg-gray-50/50 dark:bg-gray-700/30">{formatCurrency(results.year3.totalAnnual)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <CondoGhostCard recurringMonthlyYear3={results.year3.recurringMonthly} />
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-sm text-blue-800 dark:text-blue-200 flex gap-3">
            <span className="text-xl">ℹ️</span>
            <p>
                <strong>{t('condo_results.calc_note')}:</strong> {t('condo_results.calc_note_text')}
            </p>
        </div>

    </div>
  );
};

export default CondoResultsDisplay;
