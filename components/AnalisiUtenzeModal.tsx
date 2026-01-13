import React, { useState, useRef } from 'react';
import { X, Calculator, Wallet, ArrowRight, Settings, ChevronDown, ChevronUp, Plus, Minus, Edit2, RotateCcw, Download, Camera, Loader2, RefreshCcw } from 'lucide-react';
import { PlanInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeBillImage, ExtractedBillData } from '../utils/aiService';
import AIScannerModal from './AIScannerModal';

interface AnalisiUtenzeModalProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: PlanInput;
    period: 'monthly' | 'annual';
    onInputChange: (field: keyof PlanInput, value: number) => void;
}

export const AnalisiUtenzeModal: React.FC<AnalisiUtenzeModalProps> = ({ isOpen, onClose, inputs, period, onInputChange }) => {
    const { language } = useLanguage();
    const modalRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    // --- TRADUZIONI ---
    const texts = {
        it: {
            premiumAnalysis: "Analisi Premium",
            title: "Analisi Utenze",
            subtitle: "Scopri quanto puoi risparmiare realmente.",
            reset: "Azzera tutto",
            electricity: "Energia Elettrica",
            enterData: "Inserisci i dati della tua bolletta",
            priceKw: "Spread luce (margine azienda)",
            pun: "PUN (Prezzo Unico Naz.)",
            monthlyConsumption: "Consumo Mensile",
            fixedCosts: "Spese Fisse / Oneri (Mensile)",
            totalElectricity: "Totale Luce",
            annual: "Annuo",
            monthly: "Mensile",
            gas: "Gas Metano",
            priceSmc: "Spread Gas (margine azienda)",
            psv: "PSV (Punto Scambio Virtuale)",
            totalGas: "Totale Gas",
            summary: "Riepilogo",
            total: "Totale",
            totalBillsCost: "Costo totale bollette (Energia + Fissi)",
            yourCashback: "Il tuo Cashback",
            edit: "Modifica",
            cashbackSettings: "Impostazioni Cashback",
            spending: "Spesa Mensile (€)",
            newTotal: "Nuovo Totale",
            daPagare: "DA PAGARE",
            profitto: "PROFITTO!",
            disclaimer: "* I valori sono stime basate sui dati inseriti. Il calcolo include solo la quota energia e cashback indicativo.",
            understood: "Ho capito!",
            downloadPdf: "Scarica PDF",
            includeSpread: "Includi Spread",
            spreadImpact: "Valore Spread"
        },
        de: {
            premiumAnalysis: "Premium Analyse",
            title: "Versorgungsanalyse",
            subtitle: "Entdecke, wie viel du wirklich sparen kannst.",
            reset: "Alles zurücksetzen",
            electricity: "Strom",
            enterData: "Gib deine Rechnungsdaten ein",
            priceKw: "Marge Strom",
            pun: "PUN",
            monthlyConsumption: "Monatlicher Verbrauch",
            fixedCosts: "Fixkosten / Gebühren (Monatlich)",
            totalElectricity: "Gesamt Strom",
            annual: "Jährlich",
            monthly: "Monatlich",
            gas: "Erdgas",
            priceSmc: "Marge Gas",
            psv: "PSV",
            totalGas: "Gesamt Gas",
            summary: "Zusammenfassung",
            total: "Gesamt",
            totalBillsCost: "Gesamtkosten Rechnungen (Energie + Fix)",
            yourCashback: "Dein Cashback",
            edit: "Bearbeiten",
            cashbackSettings: "Cashback-Einstellungen",
            spending: "Monatliche Ausgaben (€)",
            newTotal: "Neue Gesamtsumme",
            daPagare: "ZU ZAHLEN",
            profitto: "GEWINN!",
            disclaimer: "* Die Werte sind Schätzungen basierend auf den eingegebenen Daten. Die Berechnung umfasst nur den Energieanteil und das indikative Cashback.",
            understood: "Verstanden!",
            downloadPdf: "PDF herunterladen",
            includeSpread: "Marge einbeziehen",
            spreadImpact: "Margenwert"
        }
    };

    const txt = texts[language as keyof typeof texts] || texts.it;

    const [electricityPrice, setElectricityPrice] = useState<string>('');
    const [punValue, setPunValue] = useState<string>('');
    const [electricityConsumption, setElectricityConsumption] = useState<string>(''); // Monthly
    const [electricityFixed, setElectricityFixed] = useState<string>('');
    const [gasPrice, setGasPrice] = useState<string>('');
    const [psvValue, setPsvValue] = useState<string>('');
    const [gasConsumption, setGasConsumption] = useState<string>(''); // Monthly
    const [gasFixed, setGasFixed] = useState<string>('');
    const [isEditingCashback, setIsEditingCashback] = useState(false); // Toggle for cashback edit section
    const [includeSpread, setIncludeSpread] = useState(true); // New Toggle for Spread
    const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
    const [scanType, setScanType] = useState<'electricity' | 'gas' | 'any'>('any');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openScanner = (type: 'electricity' | 'gas' | 'any' = 'any') => {
        setScanType(type);
        setIsScannerModalOpen(true);
    };

    const applyExtractedData = (data: ExtractedBillData) => {
        console.log("Applying data:", data);
        let foundAny = false;
        let updatedFields: string[] = [];

        // Helper to update only if value is valid
        const updateIfValid = (value: number | undefined | null, setter: (v: string) => void, fieldName: string) => {
            if (value !== undefined && value !== null && value > 0) {
                setter(value.toString());
                return true;
            }
            return false;
        };

        if (data.electricity) {
            let hasElec = false;
            if (updateIfValid(data.electricity.consumption, setElectricityConsumption, 'consumption')) hasElec = true;
            if (updateIfValid(data.electricity.fixedCosts, setElectricityFixed, 'fixedCosts')) hasElec = true;
            if (updateIfValid(data.electricity.pun, setPunValue, 'pun')) hasElec = true;
            if (updateIfValid(data.electricity.spread, setElectricityPrice, 'spread')) hasElec = true;

            if (hasElec) {
                foundAny = true;
                updatedFields.push("Energia Elettrica");
            }
        }

        if (data.gas) {
            let hasGas = false;
            if (updateIfValid(data.gas.consumption, setGasConsumption, 'consumption')) hasGas = true;
            if (updateIfValid(data.gas.fixedCosts, setGasFixed, 'fixedCosts')) hasGas = true;
            if (updateIfValid(data.gas.psv, setPsvValue, 'psv')) hasGas = true;
            if (updateIfValid(data.gas.spread, setGasPrice, 'spread')) hasGas = true;

            if (hasGas) {
                foundAny = true;
                updatedFields.push("Gas");
            }
        }

        if (!foundAny) {
            alert("L'AI ha analizzato il documento ma non ha trovato dati tecnici validi (> 0). Prova con una pagina più chiara.");
        } else {
            // Show a simple success feedback
            // Optional: You could improve this UI later
            console.log(`Updated sections: ${updatedFields.join(", ")}`);
        }
    };

    const handleReset = () => {
        setElectricityPrice('');
        setPunValue('');
        setElectricityConsumption('');
        setElectricityFixed('');
        setGasPrice('');
        setPsvValue('');
        setGasConsumption('');
        setGasFixed('');
        onInputChange('cashbackSpending', 0);
        onInputChange('cashbackPercentage', 0);
        setIncludeSpread(true);
    };

    const handleExportPDF = async () => {
        if (!modalRef.current) return;
        setIsExporting(true);

        // Wait a slight tick to ensure states are clean
        await new Promise(resolve => setTimeout(resolve, 100));

        let clone: HTMLElement | null = null;

        try {
            // 1. Clone the node
            clone = modalRef.current.cloneNode(true) as HTMLElement;

            // 2. Sync Input Values
            const originalInputs = modalRef.current.querySelectorAll('input');
            const clonedInputs = clone.querySelectorAll('input');
            originalInputs.forEach((input, index) => {
                if (clonedInputs[index]) {
                    // Checkbox handling
                    if (input.type === 'checkbox') {
                        (clonedInputs[index] as HTMLInputElement).checked = (input as HTMLInputElement).checked;
                    } else {
                        clonedInputs[index].value = input.value;
                        clonedInputs[index].setAttribute('value', input.value);
                    }
                }
            });

            // 3. Remove Backdrop Blur (causes issues in capture)
            const elementsWithBlur = clone.querySelectorAll('[class*="backdrop-blur"]');
            elementsWithBlur.forEach(el => {
                el.classList.remove('backdrop-blur-md', 'backdrop-blur-sm', 'backdrop-blur-xl', 'backdrop-blur-2xl', 'backdrop-blur-3xl');
            });

            // 4. Setup Clone Styles
            clone.style.position = 'fixed';
            clone.style.top = '0px';
            clone.style.left = '0px';
            clone.style.zIndex = '-9999'; // Behind everything

            // Force Full Expansion
            clone.style.height = 'auto';
            clone.style.maxHeight = 'none';
            clone.style.overflow = 'visible';
            clone.style.width = '800px'; // Consistent width for PDF
            clone.style.transform = 'none';
            clone.style.borderRadius = '0';

            // Force specific background based on mode
            const isDark = document.documentElement.classList.contains('dark');
            clone.style.backgroundColor = isDark ? '#111827' : '#ffffff';

            // 5. Expand Internal Scrollable Content
            const scrollableDiv = clone.querySelector('.custom-scrollbar') as HTMLElement || clone.querySelector('.overflow-y-auto') as HTMLElement;
            if (scrollableDiv) {
                scrollableDiv.style.overflow = 'visible';
                scrollableDiv.style.height = 'auto';
                scrollableDiv.style.maxHeight = 'none';
                scrollableDiv.style.flex = 'none';
            }

            document.body.appendChild(clone);

            // Small delay to allow CSS to compute
            await new Promise(resolve => setTimeout(resolve, 250));

            // 6. Capture
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(clone, {
                cacheBust: true,
                pixelRatio: 2,
                quality: 0.95,
                backgroundColor: isDark ? '#111827' : '#ffffff',
                skipAutoScale: true
            });

            // 7. Generate PDF
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            const pageHeight = pdf.internal.pageSize.getHeight();

            if (pdfHeight > pageHeight) {
                pdf.deletePage(1);
                // Create a custom page size that fits the content exactly (long PDF)
                const customHeight = Math.max(pageHeight, (pdfHeight * 210) / pdfWidth) + 20;
                pdf.addPage([210, customHeight]);
                pdf.addImage(dataUrl, 'PNG', 0, 0, 210, (imgProps.height * 210) / imgProps.width);
            } else {
                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }

            pdf.save(`Analisi_Utenze_${new Date().toISOString().slice(0, 10)}.pdf`);

        } catch (err) {
            console.error('Errore export PDF:', err);
            alert("Errore durante la generazione del PDF. Riprova.");
        } finally {
            if (clone && document.body.contains(clone)) {
                document.body.removeChild(clone);
            }
            setIsExporting(false);
        }
    };

    // Calculate annuals
    const elecSpread = parseFloat(electricityPrice.replace(',', '.')) || 0;
    const pun = parseFloat(punValue.replace(',', '.')) || 0;
    const elecCons = parseFloat(electricityConsumption.replace(',', '.')) || 0;
    const elecFix = parseFloat(electricityFixed.replace(',', '.')) || 0;

    const gasSpread = parseFloat(gasPrice.replace(',', '.')) || 0;
    const psv = parseFloat(psvValue.replace(',', '.')) || 0;
    const gasCons = parseFloat(gasConsumption.replace(',', '.')) || 0;
    const gasFix = parseFloat(gasFixed.replace(',', '.')) || 0;

    // Effective Spread based on Checkbox
    const activeElecSpread = includeSpread ? elecSpread : 0;
    const activeGasSpread = includeSpread ? gasSpread : 0;

    const monthlyElectricityCost = ((activeElecSpread + pun) * elecCons) + elecFix;
    const annualElectricityCost = monthlyElectricityCost * 12;

    const monthlyGasCost = ((activeGasSpread + psv) * gasCons) + gasFix;
    const annualGasCost = monthlyGasCost * 12;

    const totalAnnualCost = annualElectricityCost + annualGasCost;

    const totalMonthlyCost = monthlyElectricityCost + monthlyGasCost;
    const monthlyCashback = (inputs.cashbackSpending * inputs.cashbackPercentage) / 100;
    const annualCashback = monthlyCashback * 12;

    const rawNetMonthly = totalMonthlyCost - monthlyCashback;
    const rawNetAnnual = totalAnnualCost - annualCashback;

    // Spread Impact Calculation (Difference)
    const monthlySpreadImpact = (elecSpread * elecCons) + (gasSpread * gasCons);
    const annualSpreadImpact = monthlySpreadImpact * 12;
    const currentSpreadImpact = period === 'annual' ? annualSpreadImpact : monthlySpreadImpact;

    // Determine Status
    // > 0 means Cost is higher than Cashback (Debt)
    // <= 0 means Cashback covers Cost (Surplus or Break-even)
    const isDebt = (period === 'annual' ? rawNetAnnual : rawNetMonthly) > 0.01; // small epsilon
    const isSurplus = (period === 'annual' ? rawNetAnnual : rawNetMonthly) < -0.01;

    // Dynamic Gradient - FORCED GREEN as requested
    let gradientClass = "from-emerald-400 via-green-400 to-teal-400";

    const savingsPercentage = totalMonthlyCost > 0 ? (monthlyCashback / totalMonthlyCost) * 100 : 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div ref={modalRef} className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border border-white/20 dark:border-gray-700 flex flex-col max-h-[90vh]">

                {/* Header WOW */}
                <div className="relative overflow-hidden p-3 pb-3 md:p-8 md:pb-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/30 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg">
                                <span>✨</span> {txt.premiumAnalysis}
                            </div>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2 drop-shadow-md">{txt.title}</h2>
                            <p className="text-indigo-100 font-medium text-base md:text-lg opacity-90">{txt.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => openScanner('any')}
                                className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg group relative"
                                title="Scansiona Bolletta (Qualsiasi)"
                            >
                                <Camera size={24} className="group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg group"
                                title={txt.downloadPdf}
                                disabled={isExporting}
                            >
                                <Download size={24} className={`transition-transform duration-300 ${isExporting ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                            </button>
                            <button
                                onClick={handleReset}
                                className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg group"
                                title={txt.reset}
                            >
                                <RotateCcw size={24} className="group-hover:-rotate-180 transition-transform duration-500" />
                            </button>
                            <button onClick={onClose} className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg hover:rotate-90 duration-300">
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-8 pb-4 md:p-6 space-y-6 md:space-y-8 bg-gray-50/50 dark:bg-gray-900/50">

                    {/* Electricity Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-bl-full transition-all group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-sm">
                                    <Calculator size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{txt.electricity}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{txt.enterData}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => openScanner('electricity')}
                                className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-xl transition-colors border border-yellow-500/20"
                                title="Scansiona Luce"
                            >
                                <Camera size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.priceKw}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        value={electricityPrice}
                                        onChange={(e) => setElectricityPrice(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                        placeholder="0.05"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/kW</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.pun}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        value={punValue}
                                        onChange={(e) => setPunValue(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                        placeholder="0.10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/kW</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.monthlyConsumption}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        value={electricityConsumption}
                                        onChange={(e) => setElectricityConsumption(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                        placeholder="250"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kWh</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.fixedCosts}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="any"
                                    value={electricityFixed}
                                    onChange={(e) => setElectricityFixed(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                    placeholder="10.00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                            </div>
                        </div>

                        {/* Result Mini-Card */}
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20 flex justify-between items-center">
                            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500 uppercase">{txt.totalElectricity} {period === 'annual' ? txt.annual : txt.monthly}</span>
                            <span className="text-xl font-black text-yellow-600 dark:text-yellow-400">€{(period === 'annual' ? annualElectricityCost : monthlyElectricityCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* Gas Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-bl-full transition-all group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                                    <Calculator size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{txt.gas}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{txt.enterData}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => openScanner('gas')}
                                className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-xl transition-colors border border-orange-500/20"
                                title="Scansiona Gas"
                            >
                                <Camera size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.priceSmc}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        value={gasPrice}
                                        onChange={(e) => setGasPrice(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                        placeholder="0.10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/Smc</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.psv}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        value={psvValue}
                                        onChange={(e) => setPsvValue(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                        placeholder="0.40"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/Smc</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.monthlyConsumption}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="any"
                                        value={gasConsumption}
                                        onChange={(e) => setGasConsumption(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                        placeholder="100"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Smc</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.fixedCosts}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="any"
                                    value={gasFixed}
                                    onChange={(e) => setGasFixed(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                    placeholder="5.00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                            </div>
                        </div>

                        {/* Result Mini-Card */}
                        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20 flex justify-between items-center">
                            <span className="text-sm font-bold text-orange-700 dark:text-orange-500 uppercase">{txt.totalGas} {period === 'annual' ? txt.annual : txt.monthly}</span>
                            <span className="text-xl font-black text-orange-600 dark:text-orange-400">€{(period === 'annual' ? annualGasCost : monthlyGasCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* TOTALS and CASHBACK COMPARISON */}
                    <div className={`p-1 rounded-[2.5rem] bg-gradient-to-br ${gradientClass} shadow-2xl relative overflow-hidden transition-all duration-500`}>
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm"></div>
                        {/* Remove sparkle animation for simplicity, matches the clean green look */}

                        <div className="bg-white/95 dark:bg-gray-900/95 rounded-[2.3rem] p-6 relative z-10">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{txt.summary} {period === 'annual' ? txt.annual : txt.monthly} {txt.total}</h3>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="flex flex-col items-center">
                                        {/* CHANGED TO RED */}
                                        <span className="text-5xl font-black text-red-600 dark:text-red-400">
                                            €{(period === 'annual' ? totalAnnualCost : totalMonthlyCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className="text-sm font-bold text-gray-400 mt-1">
                                            (€{(period === 'annual' ? totalMonthlyCost : totalAnnualCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })} / {period === 'annual' ? 'mese' : 'anno'})
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 font-medium mt-3">{txt.totalBillsCost}</p>

                                {/* Checkbox for Spread Inclusion - NEW */}
                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <label className="flex items-center cursor-pointer gap-2 select-none group">
                                        <input
                                            type="checkbox"
                                            checked={includeSpread}
                                            onChange={(e) => setIncludeSpread(e.target.checked)}
                                            className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {txt.includeSpread}
                                        </span>
                                    </label>
                                    <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {txt.spreadImpact}: {includeSpread ? '' : 'Escluso'} <span className="font-bold text-indigo-600 dark:text-indigo-400">€{currentSpreadImpact.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Comparison Row */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center">

                                    {/* Cashback Card */}
                                    <div className="flex-1 w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-800 flex items-center gap-3">
                                        <div className="p-3 bg-white dark:bg-purple-800 rounded-xl shadow-sm text-purple-600">
                                            <Wallet size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">{txt.yourCashback}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xl font-black text-purple-600 dark:text-purple-300">-€{(period === 'annual' ? annualCashback : monthlyCashback).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                                                {!isEditingCashback && (
                                                    <button
                                                        onClick={() => setIsEditingCashback(true)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all text-xs font-bold shadow-sm"
                                                    >
                                                        <Edit2 size={12} />
                                                        {txt.edit}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cashback Edit Section */}
                                {isEditingCashback && (
                                    <div className="mt-4 mb-4 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-800 animate-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-purple-800 dark:text-purple-300 font-bold text-xs uppercase tracking-wide">{txt.cashbackSettings}</h4>
                                            <button onClick={() => setIsEditingCashback(false)} className="text-purple-400 hover:text-purple-600"><X size={14} /></button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-purple-400 mb-1 block">{txt.spending}</label>
                                                <input
                                                    type="number"
                                                    value={inputs.cashbackSpending === 0 ? '' : inputs.cashbackSpending}
                                                    onChange={(e) => onInputChange('cashbackSpending', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-purple-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-purple-400 transition-colors"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-purple-400 mb-1 block">Cashback (%)</label>
                                                <div className="flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-purple-800 rounded-xl p-1">
                                                    <button
                                                        onClick={() => onInputChange('cashbackPercentage', Math.max(0, inputs.cashbackPercentage - 0.5))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                                                    >
                                                        <Minus size={14} strokeWidth={3} />
                                                    </button>

                                                    <span className="text-lg font-black text-purple-600 dark:text-purple-300 w-16 text-center">
                                                        {inputs.cashbackPercentage}%
                                                    </span>

                                                    <button
                                                        onClick={() => onInputChange('cashbackPercentage', Math.min(100, inputs.cashbackPercentage + 0.5))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                                                    >
                                                        <Plus size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="hidden sm:block text-gray-300 dark:text-gray-600">
                                    <ArrowRight size={24} strokeWidth={3} />
                                </div>

                                {/* Net Result Card - FORCED GREEN */}
                                <div className={`flex-1 w-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-lg transform scale-105 border-2`}>
                                    <div>
                                        <p className={`text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider`}>{txt.newTotal} {period === 'annual' ? txt.annual : txt.monthly}</p>

                                        {/* Main Value */}
                                        <p className={`text-3xl font-black text-emerald-600 dark:text-emerald-400`}>
                                            {isSurplus ? '+' : ''}€{Math.abs(period === 'annual' ? rawNetAnnual : rawNetMonthly).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                        </p>

                                        {/* Secondary Value / Label */}
                                        <p className={`text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70`}>
                                            {isSurplus ? txt.profitto : txt.daPagare}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl shadow-sm`}>
                                            <span className="text-sm font-black">
                                                {isSurplus ? `+${Math.min(100, savingsPercentage).toFixed(0)}%` : `-${Math.min(100, savingsPercentage).toFixed(0)}%`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center p-4">
                    <p className="text-sm text-gray-400 italic">
                        {txt.disclaimer}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-2 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
                    <button onClick={onClose} className="w-full py-2 md:py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg md:text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                        {txt.understood}
                    </button>
                </div>
            </div>

            <AIScannerModal
                isOpen={isScannerModalOpen}
                onClose={() => setIsScannerModalOpen(false)}
                onConfirm={applyExtractedData}
                scanType={scanType}
            />
        </div>
    );
};
