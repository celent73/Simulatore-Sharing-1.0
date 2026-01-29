
import React from 'react';
import { CompensationPlanResult, PlanInput } from '../types';
import { TrendingUp, Users, Wallet, CheckCircle2, Building2, User } from 'lucide-react';

interface NetworkPDFTemplateProps {
    planResult: CompensationPlanResult;
    inputs: PlanInput;
    totalUsers: number;
    totalOneTimeBonus: number;
    totalRecurringYear3: number;
    consultantName?: string;
    consultantSurname?: string;
    consultantPhone?: string;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

export const NetworkPDFTemplate: React.FC<NetworkPDFTemplateProps> = ({
    planResult,
    inputs,
    totalUsers,
    totalOneTimeBonus,
    totalRecurringYear3,
    consultantName,
    consultantSurname,
    consultantPhone
}) => {


    return (
        <div
            id="network-pdf-template"
            style={{
                width: '1200px',
                minHeight: '1697px', // Ratio for A4
                background: '#ffffff',
                color: '#0f172a', // Slate 900
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                overflow: 'hidden'
            }}
            className="flex flex-col"
        >
            {/* Background Decor - lighter and subtle on white */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />

            {/* HEADER */}
            <div className="p-16 flex justify-between items-start border-b border-gray-200 bg-white/95 backdrop-blur-md">
                <div className="flex flex-col gap-6">
                    {/* CONSULTANT DETAILS (TOP LEFT) */}
                    {(consultantName || consultantSurname || consultantPhone) && (
                        <div className="mb-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Prospetto preparato da</p>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {consultantName} {consultantSurname}
                            </h3>
                            {consultantPhone && (
                                <p className="text-sm font-medium text-slate-500 mt-0.5">{consultantPhone}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">BUSINESS PLAN</h1>
                        <p className="text-xl text-blue-600 font-medium tracking-widest uppercase">Partner Sharing Network</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold opacity-60 text-slate-500">GENERATO IL</p>
                        <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString('it-IT')}</p>
                    </div>
                    {/* Simple Logo Placeholder if image fails */}
                    <div className="w-20 h-20 bg-gradient-to-br from-union-blue-600 to-union-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <User size={40} className="text-white" />
                    </div>
                </div>
            </div>

            {/* BODY */}
            <div className="p-10 flex-grow flex flex-col gap-10 relative z-10">

                {/* HERO SECTION - RECAP */}
                <div className="grid grid-cols-3 gap-8">
                    {/* Users */}
                    <div className="bg-white border border-gray-200 rounded-[2rem] p-8 flex flex-col shadow-sm items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                            <Users size={32} />
                        </div>
                        <p className="text-5xl font-black text-slate-900 mb-2">{totalUsers.toLocaleString('it-IT')}</p>
                        <p className="text-sm font-bold opacity-60 uppercase tracking-wider">Totale Utenti</p>
                    </div>

                    {/* One Time */}
                    <div className="bg-white border border-gray-200 rounded-[2rem] p-8 flex flex-col shadow-sm items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
                            <Wallet size={32} />
                        </div>
                        <p className="text-5xl font-black text-emerald-600 mb-2">{formatCurrency(totalOneTimeBonus)}</p>
                        <p className="text-sm font-bold opacity-60 uppercase tracking-wider">Bonus Una Tantum</p>
                    </div>

                    {/* Recurring */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 flex flex-col shadow-xl items-center text-center text-white">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4 text-orange-400">
                            <TrendingUp size={32} />
                        </div>
                        <p className="text-5xl font-black text-orange-400 mb-2">{formatCurrency(totalRecurringYear3)}</p>
                        <p className="text-sm font-bold opacity-60 uppercase tracking-wider text-white">Rendita Mensile</p>
                        <p className="text-xs text-white/50 mt-1">(Al 3° Anno)</p>
                    </div>
                </div>

                {/* INPUT RECAP */}
                <div className="bg-slate-50/50 rounded-3xl p-8 border border-gray-200">
                    <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 mb-4">Parametri Simulazione</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold uppercase">Diretti</p>
                            <p className="text-2xl font-black text-slate-800">{inputs.directRecruits}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold uppercase">Duplicazione</p>
                            <p className="text-2xl font-black text-slate-800">{inputs.indirectRecruits}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold uppercase">Profondità</p>
                            <p className="text-2xl font-black text-slate-800">{inputs.networkDepth}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-slate-400 font-bold uppercase">Contratti/User</p>
                            <p className="text-2xl font-black text-slate-800">{inputs.contractsPerUser}</p>
                        </div>
                    </div>
                </div>

                {/* DETAILED TABLE */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-200 shadow-sm flex-grow">
                    <div className="flex items-center gap-4 mb-8">
                        <TrendingUp className="text-blue-600" size={32} />
                        <h3 className="text-3xl font-bold text-slate-900">Riepilogo Guadagni per Livello</h3>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 border-b border-gray-200 text-sm uppercase tracking-wider">
                                <th className="py-4 font-bold text-center w-20">Livello</th>
                                <th className="py-4 font-bold text-center">Utenti</th>
                                <th className="py-4 font-bold text-right">Una Tantum</th>
                                <th className="py-4 font-bold text-right">Mese Anno 1</th>
                                <th className="py-4 font-bold text-right">Mese Anno 2</th>
                                <th className="py-4 font-bold text-right">Mese Anno 3</th>
                            </tr>
                        </thead>
                        <tbody className="text-lg font-medium divide-y divide-gray-100 text-slate-600">
                            {planResult.levelData.slice(0, 6).map((row) => (
                                <tr key={row.level}>
                                    <td className="py-4 font-bold text-slate-900 text-center bg-gray-50 rounded-l-xl">
                                        {row.level === 0 ? 'Tu' : row.level}
                                    </td>
                                    <td className="py-4 text-center">{row.users.toLocaleString('it-IT')}</td>
                                    <td className="py-4 text-right text-emerald-600 font-bold">{formatCurrency(row.oneTimeBonus)}</td>
                                    <td className="py-4 text-right text-orange-500">{formatCurrency(row.recurringYear1)}</td>
                                    <td className="py-4 text-right text-orange-500">{formatCurrency(row.recurringYear2)}</td>
                                    <td className="py-4 text-right text-orange-600 font-bold">{formatCurrency(row.recurringYear3)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-900">
                            <tr>
                                <td className="py-6 font-black text-xl text-slate-900 uppercase">Totali</td>
                                <td className="py-6 text-center font-bold text-xl text-slate-900">{totalUsers.toLocaleString('it-IT')}</td>
                                <td className="py-6 text-right font-black text-xl text-emerald-600">{formatCurrency(totalOneTimeBonus)}</td>
                                <td className="py-6 text-right font-black text-xl text-orange-500">{formatCurrency(planResult.levelData.reduce((acc, row) => acc + row.recurringYear1, 0))}</td>
                                <td className="py-6 text-right font-black text-xl text-orange-500">{formatCurrency(planResult.levelData.reduce((acc, row) => acc + row.recurringYear2, 0))}</td>
                                <td className="py-6 text-right font-black text-2xl text-orange-600">{formatCurrency(planResult.levelData.reduce((acc, row) => acc + row.recurringYear3, 0))}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* DISCLAIMER FOOTER */}
                <div className="mt-auto pt-6 text-center border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        Documento confidenziale - Generato il {new Date().toLocaleDateString('it-IT')}
                    </p>
                </div>
            </div>
        </div>
    );
};
