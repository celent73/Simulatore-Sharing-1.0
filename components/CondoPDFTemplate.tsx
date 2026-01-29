
import React from 'react';
import { CondoSimulationResult } from '../types';
import { TrendingUp, Users, Wallet, CheckCircle2, Building2 } from 'lucide-react';

interface CondoPDFTemplateProps {
    results: CondoSimulationResult;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

export const CondoPDFTemplate: React.FC<CondoPDFTemplateProps> = ({ results }) => {
    const isRecruiterView = !!results.familyUtilityEarnings;
    const displayTotal = isRecruiterView ? results.familyUtilityEarnings!.total3Years : results.total3Years;

    // A4 Size in PX (96 DPI) approx 794x1123
    // We'll use a larger fixed width for better quality downscaling, e.g., 1200px width.
    // The styled wrapper will ensure it looks right.

    return (
        <div
            id="condo-pdf-template"
            style={{
                width: '1200px',
                minHeight: '1697px', // Ratio for A4
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                overflow: 'hidden'
            }}
            className="flex flex-col"
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* HEADER */}
            <div className="p-16 flex justify-between items-center border-b border-white/10 bg-white/5 backdrop-blur-md">
                <div>
                    <h1 className="text-5xl font-black tracking-tight text-white mb-2">BUSINESS PLAN</h1>
                    <p className="text-xl text-blue-300 font-medium tracking-widest uppercase">Efficienza Energetica Condominiale</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold opacity-60">GENERATO IL</p>
                        <p className="text-lg font-bold">{new Date().toLocaleDateString('it-IT')}</p>
                    </div>
                    {/* Simple Logo Placeholder if image fails */}
                    <div className="w-20 h-20 bg-gradient-to-br from-union-blue-600 to-union-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 size={40} className="text-white" />
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="p-16 flex-grow flex flex-col gap-12 relative z-10">

                {/* HERO SECTION */}
                <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-[3rem] p-12 border border-blue-500/30 shadow-2xl text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-blue-200 mb-4">Valore Totale Business Plan (3 Anni)</h2>
                        <div className="text-[8rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200 drop-shadow-sm mb-6">
                            {formatCurrency(displayTotal)}
                        </div>
                        <p className="text-2xl text-blue-100 max-w-4xl mx-auto opacity-80 leading-relaxed font-light">
                            Il piano include i guadagni derivanti dalla gestione delle utenze condominiali, le installazioni di efficientamento e le rendite ricorrenti.
                        </p>
                    </div>
                </div>

                {/* YEARLY CARDS */}
                <div className="grid grid-cols-3 gap-8">
                    {[1, 2, 3].map((year) => {
                        const yKey = `year${year}` as keyof typeof results;
                        const yearData = results[yKey] as any; // Type assertion for simplicity here
                        const recruiterYearData = isRecruiterView ? results.familyUtilityEarnings![yKey] : null;

                        const total = isRecruiterView ? recruiterYearData!.total : yearData.totalAnnual;
                        const recurring = isRecruiterView
                            ? (recruiterYearData!.recurring - (recruiterYearData!.networkPart?.recurring || 0))
                            : yearData.recurringMonthly;
                        const oneTime = isRecruiterView
                            ? (recruiterYearData!.oneTime - (recruiterYearData!.networkPart?.oneTime || 0))
                            : yearData.oneTimeBonus;

                        return (
                            <div key={year} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center font-black text-xl border border-blue-500/30 text-blue-300">
                                        {year}°
                                    </div>
                                    <span className="text-lg font-bold text-gray-400 uppercase tracking-wider">ANNO</span>
                                </div>

                                <div className="mb-8">
                                    <p className="text-5xl font-black text-white mb-2">{formatCurrency(total)}</p>
                                    <p className="text-sm font-medium text-blue-300 uppercase tracking-widest">Totale Annuo</p>
                                </div>

                                <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-400 font-medium">Una Tantum</span>
                                        <span className="font-bold text-emerald-400">{formatCurrency(oneTime)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-400 font-medium">Rendita Finale</span>
                                        <span className="font-bold text-union-orange-400">{formatCurrency(recurring)}/m</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* DETAILED TABLE */}
                {!isRecruiterView && (
                    <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10">
                        <div className="flex items-center gap-4 mb-8">
                            <TrendingUp className="text-blue-400" size={32} />
                            <h3 className="text-3xl font-bold">Dettaglio Annuale</h3>
                        </div>

                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-blue-300 border-b border-white/10 text-lg uppercase tracking-wider">
                                    <th className="py-4 font-bold">Periodo</th>
                                    <th className="py-4 font-bold">Utenze Attive</th>
                                    <th className="py-4 font-bold text-right">Una Tantum</th>
                                    <th className="py-4 font-bold text-right">Rendita Mensile</th>
                                    <th className="py-4 font-bold text-right">Totale</th>
                                </tr>
                            </thead>
                            <tbody className="text-xl font-medium divide-y divide-white/5 text-gray-200">
                                <tr>
                                    <td className="py-6 font-bold text-white">Primo Anno</td>
                                    <td className="py-6">{results.year1.activeUnits}</td>
                                    <td className="py-6 text-right text-emerald-400">{formatCurrency(results.year1.oneTimeBonus)}</td>
                                    <td className="py-6 text-right text-union-orange-400">{formatCurrency(results.year1.recurringMonthly)}</td>
                                    <td className="py-6 text-right font-black text-white">{formatCurrency(results.year1.totalAnnual)}</td>
                                </tr>
                                <tr>
                                    <td className="py-6 font-bold text-white">Secondo Anno</td>
                                    <td className="py-6">{results.year2.activeUnits}</td>
                                    <td className="py-6 text-right text-emerald-400">{formatCurrency(results.year2.oneTimeBonus)}</td>
                                    <td className="py-6 text-right text-union-orange-400">{formatCurrency(results.year2.recurringMonthly)}</td>
                                    <td className="py-6 text-right font-black text-white">{formatCurrency(results.year2.totalAnnual)}</td>
                                </tr>
                                <tr>
                                    <td className="py-6 font-bold text-white">Terzo Anno</td>
                                    <td className="py-6">{results.year3.activeUnits}</td>
                                    <td className="py-6 text-right text-emerald-400">{formatCurrency(results.year3.oneTimeBonus)}</td>
                                    <td className="py-6 text-right text-union-orange-400">{formatCurrency(results.year3.recurringMonthly)}</td>
                                    <td className="py-6 text-right font-black text-white">{formatCurrency(results.year3.totalAnnual)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {isRecruiterView && (
                    <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10 flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Nota per il Recruiter</h3>
                            <p className="text-lg text-gray-400 max-w-2xl">
                                Questo prospetto include i guadagni derivanti dall'attività diretta di segnalazione condomini e dalle commissioni di rete maturate sulla struttura gestita dall'Amministratore.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-blue-600/20 px-6 py-3 rounded-xl border border-blue-500/30 flex items-center gap-3">
                                <CheckCircle2 className="text-blue-400" />
                                <span className="font-bold">Override Inclusa</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="p-12 text-center border-t border-white/10 bg-white/5 backdrop-blur-md">
                <p className="text-gray-500 text-lg">Simulazione generata con Shary Simulator - Documento ad uso interno</p>
                <p className="text-gray-600 text-sm mt-2">I valori sono stime basate sui dati inseriti e potrebbero variare.</p>
            </div>
        </div>
    );
};
