import React, { useState, useEffect } from 'react';
import { X, Target, Users, Clock, TrendingUp, Zap, FileText, Activity } from 'lucide-react';
import { PlanInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TargetCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInputs: PlanInput;
    onApply: (updates: Partial<PlanInput>) => void;
}

// --- TRADUZIONI ---
const texts = {
    it: {
        title: "Target Simulator",
        subtitle: "Pianifica il tuo successo",
        inputLabel: "INSERISCI LA RENDITA MENSILE CHE DESIDERI",
        peopleLabel: "Contratti di Rete",
        timeLabel: "Mesi Stimati",
        rankLabel: "Qualifica Raggiunta",
        rankSub: "Livello raggiunto",
        projY2Label: "Proiezione 2° Anno",
        projY2Sub: "Crescita stimata 1.5x",
        projY3Label: "Proiezione 3° Anno",
        projY3Sub: "Crescita stimata 2.0x",
        backBtn: "Torna al Simulatore",
        disclaimer: "*Calcolo basato su: scenario 1 contratto Azzeriamola Green per utente (1,00€ il 1° anno).",
        speedLabel: "Velocità di Crescita",
        speedSlow: "Conservativa",
        speedMedium: "Equilibrata",
        speedFast: "Aggressiva",
        resetBtn: "Azzera"
    },
    de: {
        title: "Ziel-Simulator",
        subtitle: "Planen Sie Ihren Erfolg",
        inputLabel: "GEWÜNSCHTES MONATLICHES EINKOMMEN EINGEBEN",
        peopleLabel: "Netzwerkverträge",
        timeLabel: "Geschätzte Monate",
        rankLabel: "Erreichte Qualifikation",
        rankSub: "Erreichtes Level",
        projY2Label: "Prognose 2. Jahr",
        projY2Sub: "Geschätztes Wachstum 1.5x",
        projY3Label: "Prognose 3. Jahr",
        projY3Sub: "Geschätztes Wachstum 2.0x",
        backBtn: "Zurück zum Simulator",
        disclaimer: "*Berechnung basierend auf: Szenario 1 Azzeriamola Green Vertrag pro Benutzer (1,00€ im 1. Jahr).",
        speedLabel: "Wachstumsgeschwindigkeit",
        speedSlow: "Konservativ",
        speedMedium: "Ausgewogen",
        speedFast: "Aggressiv",
        resetBtn: "Zurücksetzen"
    }
};

// --- GAUGE PULITO ---
const SmartGauge = ({ percentage, value, label, icon: Icon, colorTheme }: any) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const themes: any = {
        blue: { stroke: "stroke-blue-500", text: "text-blue-100", glow: "drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" },
        purple: { stroke: "stroke-purple-500", text: "text-purple-100", glow: "drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" },
    };
    const t = themes[colorTheme] || themes.blue;

    return (
        <div className="flex flex-col items-center relative group">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="8" className="stroke-gray-800" />
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={`${t.stroke} transition-all duration-1000 ease-out ${t.glow}`}
                        style={{ strokeDasharray: circumference, strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset }}
                    />
                </svg>
                {/* NUMERO PULITO AL CENTRO */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-5xl font-black ${t.text} tracking-tighter leading-none font-mono drop-shadow-md`}>
                        {value}
                    </span>
                </div>
            </div>

            {/* ETICHETTA ESTERNA (SOTTO) */}
            <div className="flex items-center gap-2 mt-[-10px] bg-gray-900/90 px-4 py-1.5 rounded-full border border-gray-700 backdrop-blur-md z-10 shadow-lg">
                <Icon size={14} className={t.stroke.replace('stroke-', 'text-')} />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, subtext, icon: Icon, colorClass }: any) => (
    <div className="bg-[#13132b] border border-gray-800 p-4 rounded-2xl relative overflow-hidden group hover:border-gray-600 transition-colors">
        <div className={`absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity ${colorClass}`}>
            <Icon size={40} />
        </div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-2xl font-black ${colorClass} tracking-tight`}>{value}</p>
        <p className="text-[10px] text-gray-500 mt-1">{subtext}</p>
    </div>
);

const TargetCalculatorModal: React.FC<TargetCalculatorModalProps> = ({ isOpen, onClose, onApply }) => {
    const { language } = useLanguage();
    const txt = language === 'it' ? texts.it : texts.de;

    const [inputValue, setInputValue] = useState<string>("1500");
    const [speedMode, setSpeedMode] = useState<'slow' | 'medium' | 'fast'>('medium');
    const [results, setResults] = useState({ people: 0, time: 0, structure: 'N/A', contracts: 0, actions: 0, projY2: 0, projY3: 0 });
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        setAnimating(true);
        const desiredIncome = Number(inputValue) || 0;

        const calculate = () => {
            const AVG_REVENUE_PER_USER = 1.00; // Updated to 1.00 as per request (Azzeriamola Green Year 1)
            const CONTRACTS_PER_USER = 1; // implictly 1 contract (Green) as we calculate based on unit revenue

            let totalPeopleNeeded = Math.ceil(desiredIncome / AVG_REVENUE_PER_USER);
            if (totalPeopleNeeded < 1 && desiredIncome > 0) totalPeopleNeeded = 1;

            let estimatedMonths = 0;
            if (totalPeopleNeeded > 0) {
                let growthFactor = 2.0;
                let timePerStep = 1.5;

                switch (speedMode) {
                    case 'slow':
                        growthFactor = 1.5;
                        timePerStep = 2.0;
                        break;
                    case 'medium':
                        growthFactor = 2.0;
                        timePerStep = 1.5;
                        break;
                    case 'fast':
                        growthFactor = 3.0;
                        timePerStep = 1.5;
                        break;
                }

                const logBase = Math.log(totalPeopleNeeded) / Math.log(growthFactor);
                estimatedMonths = Math.ceil(logBase * timePerStep);
                if (desiredIncome > 0 && estimatedMonths < 1) estimatedMonths = 1;
            }

            // If user implies "contracts of network" and revenue is 1 per contract, then people = contracts basically
            // But let's keep the distinction if needed. 
            // The prompt says "contracts of network" replaces "people needed".
            const totalContracts = totalPeopleNeeded; // 1:1 ratio for simplicity based on 1.00 revenue

            let structureSuggestion = "Starter";
            if (totalContracts >= 3000) structureSuggestion = "NATIONAL MANAGER";
            else if (totalContracts >= 1500) structureSuggestion = "REGIONAL MANAGER";
            else if (totalContracts >= 600) structureSuggestion = "PRO MANAGER";
            else if (totalContracts > 200) structureSuggestion = "Builder Pro";
            else if (totalContracts > 50) structureSuggestion = "Team Developer";

            let weeklyActions = 0;
            if (totalPeopleNeeded > 0) {
                weeklyActions = Math.ceil((totalPeopleNeeded / estimatedMonths) / 5);
                if (weeklyActions < 2) weeklyActions = 2;
            }

            // Calcolo Bonus Qualifica
            let bonus = 0;
            if (totalContracts >= 5000) {
                bonus = 3000;
            } else if (totalContracts >= 1500) {
                bonus = 1000;
            } else if (totalContracts > 600) {
                bonus = 300;
            }

            // Calcolo Proiezioni con Bonus
            // Year 2: 1.50 euro per contract
            // Year 3: 2.00 euro per contract
            const projY2 = (totalContracts * 1.50) + bonus;
            const projY3 = (totalContracts * 2.00) + bonus;

            setResults({
                people: totalPeopleNeeded,
                time: estimatedMonths,
                structure: structureSuggestion,
                contracts: totalContracts,
                actions: weeklyActions,
                projY2,
                projY3
            });
            setTimeout(() => setAnimating(false), 600);
        };

        if (isOpen) calculate();
    }, [inputValue, isOpen, speedMode]);

    if (!isOpen) return null;

    const contractsPercentage = Math.min((results.contracts / 5000) * 100, 100) || 5;
    const timePercentage = Math.min((results.time / 24) * 100, 100) || 5;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/^0+/, '');
        setInputValue(val);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="bg-[#0a0a12] border border-gray-800 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-3xl relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">

                <div className="p-6 pb-4 relative z-10 flex justify-between items-center border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-900 rounded-xl border border-gray-700">
                            <Target size={24} className="text-emerald-400 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Target <span className="text-emerald-500">Simulator</span>
                            </h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{txt.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-900 text-gray-400 rounded-full hover:bg-gray-800 hover:text-white transition-all border border-gray-800">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 relative z-10">

                    {/* SPEED SELECTOR */}
                    <div className="flex flex-col items-center justify-center gap-3 mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{txt.speedLabel}</span>
                        <div className="flex p-1 bg-gray-900 rounded-xl border border-gray-700">
                            <button
                                onClick={() => setSpeedMode('slow')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${speedMode === 'slow' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {txt.speedSlow}
                            </button>
                            <button
                                onClick={() => setSpeedMode('medium')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${speedMode === 'medium' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {txt.speedMedium}
                            </button>
                            <button
                                onClick={() => setSpeedMode('fast')}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${speedMode === 'fast' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {txt.speedFast}
                            </button>
                        </div>
                    </div>

                    <div className="relative group text-center">
                        <label className="text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                            {txt.inputLabel}
                        </label>
                        <div className="relative inline-block w-full max-w-xs">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleInputChange}
                                min={0}
                                className="w-full bg-transparent text-white font-mono text-6xl font-black text-center py-2 focus:outline-none border-b-2 border-gray-700 focus:border-emerald-500 transition-colors placeholder-gray-700"
                                placeholder="0"
                            />
                            <span className="absolute top-1/2 -translate-y-1/2 -right-4 text-gray-600 text-3xl font-light">€</span>

                            {/* RESET BUTTON */}
                            {inputValue !== "0" && inputValue !== "" && (
                                <button
                                    onClick={() => setInputValue("0")}
                                    className="absolute top-1/2 -translate-y-1/2 -right-16 p-2 text-gray-600 hover:text-red-500 transition-colors bg-gray-900/50 rounded-full border border-gray-800 hover:border-red-500/30"
                                    title={txt.resetBtn}
                                >
                                    <Clock size={16} className="rotate-180" />
                                    {/* Using Clock rotated as a kind of 'rewind' or 'reset' since RefreshCcw might not be imported. 
                                        Actually, let's use 'RotateCcw' if available, or just X. Let's stick to X for standard 'clear'. 
                                        But user asked for "azzera", existing X is for closing modal.
                                        Let's import RefreshCcw or RotateCcw at the top first if I can, but to be safe without breaking imports, 
                                        I will use the existing 'X' icon but styled differently, or just check imports. 
                                        WAIT: I can see imports: X, Target, Users, Clock, TrendingUp, Zap, FileText, Activity.
                                        I don't have RefreshCcw. I'll add it to imports in a separate step or just use 'X' again which is standard for clearing inputs.
                                        Let's use 'X' for now as a clear button.
                                    */}
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* DASHBOARD GAUGES MIGLIORATE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center items-center px-4">
                        <SmartGauge percentage={animating ? 0 : contractsPercentage} value={results.contracts} label={txt.peopleLabel} icon={FileText} colorTheme="emerald" />
                        <SmartGauge percentage={animating ? 0 : timePercentage} value={results.time} label={txt.timeLabel} icon={Clock} colorTheme="purple" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard label={txt.rankLabel} value={results.structure} subtext={txt.rankSub} icon={Zap} colorClass="text-yellow-400" />
                        <StatCard label={txt.projY2Label} value={formatCurrency(results.projY2)} subtext={txt.projY2Sub} icon={TrendingUp} colorClass="text-emerald-400" />
                        <StatCard label={txt.projY3Label} value={formatCurrency(results.projY3)} subtext={txt.projY3Sub} icon={Activity} colorClass="text-purple-400" />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 text-[10px] italic">{txt.disclaimer}</p>
                    </div>
                </div>

                <div className="p-6 bg-gray-900/50 border-t border-gray-800">
                    <button onClick={onClose} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-lg hover:shadow-emerald-900/50 hover:-translate-y-1 active:translate-y-0">
                        {txt.backBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TargetCalculatorModal;