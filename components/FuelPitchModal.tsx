
import React, { useState } from 'react';
import { X, Fuel, ArrowRight, TrendingDown, PiggyBank, Calendar, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CustomSlider } from './CustomSlider';

interface FuelPitchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FuelPitchModal: React.FC<FuelPitchModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [pricePerLiter, setPricePerLiter] = useState(1.80);
    const [tankCapacity, setTankCapacity] = useState(50);
    const [otherSpending, setOtherSpending] = useState(500); // Default 500€
    const [otherCashbackPercent, setOtherCashbackPercent] = useState(10); // Default 10%

    if (!isOpen) return null;

    // 1. Costo del Pieno Standard
    const costPerTankStandard = pricePerLiter * tankCapacity;

    // 2. Risparmio Diretto Carburante (1.88% fisso)
    const fuelCashbackRate = 1.88;
    const directFuelSavings = costPerTankStandard * (fuelCashbackRate / 100);

    // 3. Risparmio da Altre Spese (Cross-Subsidization)
    const otherSavings = otherSpending * (otherCashbackPercent / 100);

    // 4. Totale Risparmio Applicato al Pieno
    const totalSavings = directFuelSavings + otherSavings;

    // 5. Nuovo Costo del Pieno e Prezzo al Litro
    const costPerTankDiscounted = Math.max(0, costPerTankStandard - totalSavings); // Non può essere negativo
    const newPricePerLiter = costPerTankDiscounted / tankCapacity;
    const savingsPerLiter = pricePerLiter - newPricePerLiter;

    const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER - Fuel Station Style */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <Fuel className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-wider">Fuel Saver</h2>
                            <p className="text-red-200 text-xs font-bold uppercase tracking-widest">Simulatore Risparmio</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors relative z-10">
                        <X size={24} />
                    </button>
                </div>

                {/* DISPLAY SECTION (Digital Pump Style) */}
                <div className="p-8 bg-black relative border-b border-gray-800">
                    <div className="grid grid-cols-2 gap-8">
                        {/* OLD PRICE */}
                        <div className="flex flex-col items-center opacity-50 grayscale transition-all duration-500">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Prezzo alla Pompa</span>
                            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 w-full text-center relative overflow-hidden">
                                <span className="font-mono text-3xl font-bold text-red-500 line-through decoration-red-500/50 decoration-2">{pricePerLiter.toFixed(2)} €</span>
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                            </div>
                        </div>

                        {/* ARROW */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600">
                            <ArrowRight size={32} />
                        </div>

                        {/* NEW PRICE */}
                        <div className="flex flex-col items-center scale-110 origin-center transform transition-all duration-500">
                            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1 animate-pulse">Prezzo Sharing</span>
                            <div className="bg-gray-900 p-4 rounded-xl border border-emerald-500/50 shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] w-full text-center relative overflow-hidden group">
                                <span className="font-mono text-4xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{newPricePerLiter.toFixed(2)} €</span>
                                <div className="absolute top-0 right-0 p-1">
                                    <TrendingDown size={12} className="text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="p-8 flex-grow overflow-y-auto bg-slate-900 space-y-8">

                    {/* INPUTS ROW - FUEL DATA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/80 p-5 rounded-2xl border border-white/5">
                        {/* PRICE INPUT */}
                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <span className="text-gray-500 text-xs font-bold uppercase">Prezzo Benzina</span>
                                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-600 focus-within:border-union-blue-500 focus-within:ring-1 focus-within:ring-union-blue-500 transition-all">
                                    <input
                                        type="number"
                                        min="1.00"
                                        max="3.00"
                                        step="0.001"
                                        value={pricePerLiter}
                                        onChange={(e) => setPricePerLiter(Number(e.target.value))}
                                        className="w-20 bg-transparent text-white font-mono text-sm text-right px-2 py-1 outline-none"
                                    />
                                    <span className="text-gray-400 text-xs font-bold pr-2">€/L</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="1.40"
                                max="2.20"
                                step="0.01"
                                value={pricePerLiter}
                                onChange={(e) => setPricePerLiter(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-union-blue-500"
                            />
                        </div>

                        {/* TANK CAPACITY INPUT */}
                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1">
                                <span className="text-gray-500 text-xs font-bold uppercase">Capacità Serbatoio</span>
                                <div className="flex items-center bg-slate-800 rounded-lg border border-slate-600 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                                    <input
                                        type="number"
                                        min="5"
                                        max="150"
                                        step="1"
                                        value={tankCapacity}
                                        onChange={(e) => setTankCapacity(Number(e.target.value))}
                                        className="w-16 bg-transparent text-white font-mono text-sm text-right px-2 py-1 outline-none"
                                    />
                                    <span className="text-gray-400 text-xs font-bold pr-2">Litri</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="80"
                                step="5"
                                value={tankCapacity}
                                onChange={(e) => setTankCapacity(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    {/* OTHER SPENDING SECTION */}
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
                            <PiggyBank size={14} className="text-union-orange-400" /> Genera Crediti da Altre Spese
                        </h4>

                        {/* SPESA MENSILE SLIDER */}
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2 ml-1">
                                <span>Spesa Mensile (Smart Shopping)</span>
                                <span className="text-white">{formatCurrency(otherSpending)}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="50"
                                value={otherSpending}
                                onChange={(e) => setOtherSpending(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-union-orange-500"
                            />
                        </div>

                        {/* CASHBACK % SLIDER */}
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2 ml-1">
                                <span>Cashback Ottenuto</span>
                                <span className="text-white">{otherCashbackPercent}%</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    step="1"
                                    value={otherCashbackPercent}
                                    onChange={(e) => setOtherCashbackPercent(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between mt-1 px-1">
                                    <span className="text-[10px] text-gray-600">0%</span>
                                    <span className="text-[10px] text-gray-600">10%</span>
                                    <span className="text-[10px] text-gray-600">20%</span>
                                    <span className="text-[10px] text-gray-600">30%</span>
                                </div>
                            </div>
                        </div>

                        {/* GENERATED CREDIT DISPLAY */}
                        <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                            <span className="text-gray-400 text-xs font-bold uppercase">Credito Generato</span>
                            <span className="text-union-orange-400 font-mono font-bold">+ {formatCurrency(otherSavings)}</span>
                        </div>
                    </div>


                    {/* CALCULATION BREAKDOWN */}
                    <div className="bg-slate-800/80 p-5 rounded-2xl border border-white/5 space-y-3">
                        <h4 className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <TrendingDown size={14} /> Abbattimento Costo Pieno
                        </h4>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-300">Costo Pieno ({tankCapacity}L)</span>
                            <span className="text-white font-mono">{formatCurrency(costPerTankStandard)}</span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs opacity-70">
                                <span className="text-gray-400 flex items-center gap-1"><Fuel size={10} /> Cashback Benzina (1.88%)</span>
                                <span className="text-emerald-400 font-mono">- {formatCurrency(directFuelSavings)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs opacity-70">
                                <span className="text-gray-400 flex items-center gap-1"><PiggyBank size={10} /> Crediti Altre Spese</span>
                                <span className="text-union-orange-400 font-mono">- {formatCurrency(otherSavings)}</span>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-1"></div>

                        <div className="flex justify-between items-center text-base font-bold">
                            <span className="text-white">Nuovo Costo Pieno</span>
                            <span className="text-emerald-400 font-mono text-xl">{formatCurrency(costPerTankDiscounted)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-bold mt-2 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                            <span className="text-emerald-300 uppercase text-[10px]">Risparmio al Litro</span>
                            <span className="text-white font-mono">- {formatCurrency(savingsPerLiter)} / L</span>
                        </div>
                    </div>

                    {/* RESULTS CARDS */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2">
                                <PiggyBank className="text-emerald-400" size={16} />
                            </div>
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Totale Risparmio</span>
                            <span className="text-2xl font-black text-white mt-1">{formatCurrency(totalSavings)}</span>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 p-4 rounded-2xl border border-indigo-500/30 flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/20 blur-xl rounded-full -mr-8 -mt-8"></div>
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mb-2 relative z-10">
                                <Calendar className="text-indigo-400" size={16} />
                            </div>
                            <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest relative z-10">Valore su 12 Mesi</span>
                            <span className="text-2xl font-black text-white mt-1 relative z-10">{formatCurrency(totalSavings * 12)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FuelPitchModal;
