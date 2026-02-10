import React, { useState, useEffect, useRef } from 'react';
import { X, Calculator, RefreshCw, ShoppingBag, Car, ShoppingCart, Gift, Plane, Home, BookOpen, Coffee, Check, Trash2, PlusCircle, RotateCcw, RotateCw, MoreVertical, Camera, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CashbackCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';
import { BRANDS_DATA, getIcon } from './CashbackData';
import { CashbackFocusMode } from './CashbackFocusMode';

interface CashbackDetailedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (totalSpending: number, totalCashback: number, details: CashbackCategory[]) => void;
    initialDetails?: CashbackCategory[];
}


const uiTexts = {
    it: {
        title: "Calcolatore Cashback PRO",
        subtitle: "Personalizza le tue spese mensili per categoria",
        totalSpend: "Spesa Totale",
        monthlyReturn: "Ritorno Mensile",
        selectBrand: "SELEZIONA BRAND",
        other: "ALTRO...",
        return: "ritorno",
        reset: "RESET",
        confirm: "CONFERMA",
        addCategory: "Aggiungi Altra Categoria",
        categories: "categorie",
        cat: {
            alim: "Alimentari",
            igiene: "Igiene personale",
            carb: "Carburante",
            tech: "Hi-Tech",
            treni: "Trasporti",
            school: "Materiale scolastico",
            abb: "Abbigliamento",
            casa: "Casa",
            regali: "Regali e Svago",
            md: "Discount",
            aff_int: "Esempio affiliazioni internet",
        },
        estimatedBill: "BOLLETTA STIMATA",
        payOnly: "Paghi solo",
        profit: "GUADAGNI",
        save: "Risparmi",
        billZero: "RECHNUNG AUF NULL!",
        coveredPart: "Hai coperto il",
        extra: "extra!"
    },
    de: {
        title: "Cashback Rechner PRO",
        subtitle: "Personalisiere deine monatlichen Ausgaben nach Kategorie",
        totalSpend: "Gesamtausgaben",
        monthlyReturn: "Monatliche Rückvergütung",
        selectBrand: "MARKE WÄHLEN",
        other: "ANDERE...",
        return: "Rückvergütung",
        reset: "RESET",
        confirm: "CONFERMA",
        addCategory: "Kategorie hinzufügen",
        categories: "Kategorien",
        cat: {
            alim: "Lebensmittel",
            igiene: "Persönliche Pflege",
            carb: "Treibstoff",
            tech: "Elektronik & Tech",
            treni: "Transport",
            school: "Schulmaterial",
            abb: "Kleidung",
            casa: "Zuhause",
            regali: "Geschenke & Freizeit",
            md: "Discounter",
            aff_int: "Internet-Affiliates Beispiel",
        },
        estimatedBill: "GESCHÄTZTE RECHNUNG",
        payOnly: "Nur noch",
        profit: "GEWINN",
        save: "Ersparnis",
        billZero: "RECHNUNG AUF NULL!",
        coveredPart: "Sie haben",
        extra: "extra!"
    }
};

export const CashbackDetailedModal: React.FC<CashbackDetailedModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialDetails
}) => {
    const { language, t } = useLanguage();
    // Default to 'it' if language is undefined or not supported
    const lang = (language === 'de') ? 'de' : 'it';
    const txt = uiTexts[lang];
    const modalRef = useRef<HTMLDivElement>(null);



    const defaultCategories: CashbackCategory[] = [
        { id: 'alim_1', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'alim_2', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'igiene_1', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'igiene_2', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'carb_1', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'carb_2', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'tech_1', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },
        { id: 'tech_2', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },

        { id: 'treni_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'treni_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'school_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'school_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'abb_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'abb_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'casa_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'casa_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'regali_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'regali_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'aff_int_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'aff_int_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
    ];

    const [categories, setCategories] = useState<CashbackCategory[]>(defaultCategories);
    const [targetBill, setTargetBill] = useState<number>(0);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    // Update categories when language changes
    useEffect(() => {
        setCategories(prev => prev.map(cat => {
            const baseId = cat.id.replace(/_\d+$/, '');
            // Get translation using baseId as key
            const translatedName = t(`cashback_detailed.cat.${baseId}`);
            return {
                ...cat,
                name: translatedName !== `cashback_detailed.cat.${baseId}` ? translatedName : (baseId === 'md' ? 'Discount' : cat.name)
            };
        }));
    }, [language, t]);

    useEffect(() => {
        if (isOpen) {
            handleReset();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialDetails && initialDetails.length > 0 && !isOpen) {
            const initialMap = new Map(initialDetails.map(d => [d.id, d]));

            const merged = defaultCategories.map(defCat => {
                const saved = initialMap.get(defCat.id);
                const baseId = defCat.id.replace(/_\d+$/, '');
                const translatedName = t(`cashback_detailed.cat.${baseId}`);

                if (saved) {
                    return {
                        ...defCat,
                        name: translatedName,
                        amount: saved.amount,
                        brand: saved.brand,
                        percentage: saved.percentage,
                    };
                }
                return { ...defCat, name: translatedName };
            });
            setCategories(merged);
        } else {
            // Re-initialize names potentially
            setCategories(prev => prev.map(cat => {
                const baseId = cat.id.replace(/_\d+$/, '');
                const translatedName = t(`cashback_detailed.cat.${baseId}`);
                return { ...cat, name: translatedName };
            }));
        }
    }, [initialDetails, isOpen, language, t]); // Add t and language dep

    const handleUpdate = (id: string, field: keyof CashbackCategory, value: string | number) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === id) {
                if (field === 'brand') {
                    const brandData = BRANDS_DATA.find(b => b.name === value);
                    return {
                        ...cat,
                        brand: value as string,
                        percentage: brandData ? brandData.percentage : cat.percentage,
                        fixedAmount: brandData ? brandData.fixedAmount : undefined
                    };
                }
                return { ...cat, [field]: value };
            }
            return cat;
        }));
    };

    const handleReset = () => {
        setCategories(categories.map(cat => ({ ...cat, amount: 0, brand: '', percentage: 0, fixedAmount: undefined })));
        setTargetBill(0);
    };

    const handleFocusModeSelect = (categoryBaseId: string, brandName: string) => {
        const brandData = BRANDS_DATA.find(b => b.name === brandName);
        if (!brandData) return;

        setCategories(prev => {
            const newCategories = [...prev];
            // Find all slots for this category
            const slots = newCategories.map((c, i) => ({ ...c, index: i }))
                .filter(c => c.id.startsWith(categoryBaseId));

            if (slots.length === 0) return prev;

            // Try to find the first empty slot (no brand selected)
            let targetSlotIndex = slots.find(s => !s.brand)?.index;

            // If no empty slot, use the first slot
            if (targetSlotIndex === undefined) {
                targetSlotIndex = slots[0].index;
            }

            // Update the slot
            newCategories[targetSlotIndex] = {
                ...newCategories[targetSlotIndex],
                brand: brandName,
                percentage: brandData.percentage,
                fixedAmount: brandData.fixedAmount
            };

            return newCategories;
        });
    };

    // Calculate totals
    const totalSpend = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const totalCashback = categories.reduce((sum, cat) => {
        if (cat.fixedAmount !== undefined) {
            return sum + (cat.brand ? cat.fixedAmount : 0);
        }
        return sum + (cat.amount * cat.percentage / 100);
    }, 0);

    // Calculate averages and bill coverage
    const averagePercentage = totalSpend > 0 ? (totalCashback / totalSpend) * 100 : 0;

    // Bill Eraser Logic
    const percentageCovered = targetBill > 0 ? (totalCashback / targetBill) * 100 : 0;
    const isBillCovered = targetBill > 0 && totalCashback >= targetBill;
    const remainingToPay = Math.max(0, targetBill - totalCashback);
    const extraProfit = Math.max(0, totalCashback - targetBill);
    const discountPercent = Math.min(100, percentageCovered);

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[100000] flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="share-modal-content bg-white dark:bg-gray-900 w-full h-full sm:h-auto sm:max-w-[90vw] xl:max-w-7xl sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[100vh] sm:max-h-[90vh] overflow-hidden border border-purple-500/20">

                {/* Header */}
                {/* Header - MIDNIGHT GLASS STYLE */}
                <div className="p-1 sm:px-6 sm:py-4 lg:py-1 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 text-white shrink-0 relative overflow-hidden flex flex-col gap-4 lg:gap-1">
                    {/* Background patterns - Subtle & Deep */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-1 sm:mb-1 lg:mb-0 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-1 sm:p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                <ShoppingBag size={18} className="text-purple-100 sm:w-6 sm:h-6" />
                            </div>
                            <h2 className="text-lg sm:text-lg font-black tracking-tight uppercase">
                                {t('cashback_detailed.title')}
                            </h2>
                            <SharyTrigger
                                message="Inserisci per ogni categoria l'importo di spesa e poi seleziona il brand che vuoi. Nota immediatamente la percentuale di cashback! E se vuoi, imposta in alto un importo di bolletta e osserva come diminuisce con il cashback, buon divertimento!"
                                messageDe="Gib für jede Kategorie den Ausgabenbetrag ein und wähle dann die gewünschte Marke. Beachte sofort den Cashback-Prozentsatz! Und wenn du willst, gib oben einen Rechnungsbetrag ein und beobachte, wie er durch das Cashback sinkt. Viel Spaß!"
                                messageEn="Enter the spending amount for each category and then select the brand you want. Notice the cashback percentage immediately! And if you want, set a bill amount at the top and watch how it decreases with cashback, have fun!"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsFocusModeOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 transition-all border border-white/20"
                            >
                                <Eye size={14} />
                                <span className="hidden lg:inline">Focus Mode</span>
                                <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                            </button>

                            <button onClick={onClose} className="p-1 sm:p-1.5 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* DESKTOP LAYOUT: Side-by-Side Header */}
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-2 relative z-10 px-1 sm:px-0">

                        {/* LEFT COLUMN: Total Spend & Monthly Return */}
                        <div className="grid grid-cols-2 gap-3 flex-1">
                            {/* Total Spend - Dark Glass */}
                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-3 lg:p-1 flex flex-col justify-center border border-white/10 shadow-lg">
                                <p className="text-[10px] sm:text-xs lg:text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 lg:mb-0">{t('cashback_detailed.total_spend')}</p>
                                <p className="text-2xl sm:text-3xl lg:text-xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    € {totalSpend.toLocaleString(language === 'it' ? 'it-IT' : (language === 'de' ? 'de-DE' : 'en-US'), { maximumFractionDigits: 0 })}
                                </p>
                            </div>

                            {/* Monthly Return - NEON MIDNIGHT WOW EFFECT */}
                            <div className="relative group overflow-hidden bg-white/5 backdrop-blur-xl rounded-2xl p-2 sm:p-3 lg:p-1 shadow-[0_0_50px_rgba(168,85,247,0.15)] border border-purple-500/20 transform hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center">
                                {/* Beams of light effect - Subtle Cold Scan */}
                                <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite]" />

                                <div className="flex items-center justify-between mb-0 relative z-10">
                                    <p className="text-[10px] sm:text-xs lg:text-[10px] font-black uppercase tracking-widest text-purple-400 flex items-center gap-2 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                                        {t('cashback_detailed.monthly_return')}
                                    </p>
                                    <span className="bg-fuchsia-600 text-white text-[9px] sm:text-[10px] lg:text-[9px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-[0_0_15px_rgba(232,121,249,0.5)] border border-fuchsia-400/50">
                                        {t('cashback_detailed.dont_lose')}
                                    </span>
                                </div>

                                <div className="relative z-10 flex flex-col">
                                    <p className="text-4xl sm:text-6xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 tracking-tighter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-[pulse_3s_ease-in-out_infinite]">
                                        € {totalCashback.toLocaleString(language === 'it' ? 'it-IT' : (language === 'de' ? 'de-DE' : 'en-US'), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BILL ERASER SECTION - Dark Glass */}
                    {/* RIGHT COLUMN: Bill Eraser (Compact vertical on desktop) */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-3 sm:p-4 lg:p-2 border border-white/10 shadow-xl flex-1 flex flex-col justify-center">
                        <div className="flex flex-col gap-4 lg:gap-1">
                            {/* Label header */}
                            <div className="flex justify-between items-center">
                                <div className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-widest flex items-center gap-2">
                                    <div className="p-1.5 bg-white/20 rounded-lg">
                                        <Calculator size={14} className="text-white" />
                                    </div>
                                    {t('cashback_detailed.estimated_bill')}
                                </div>

                                {/* Edit Hint */}
                                <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                    {t('cashback_detailed.edit_amount')}
                                </span>
                            </div>

                            {/* Main Interaction Row */}
                            <div className="flex items-stretch gap-4">
                                {/* Input Field - VERY VISIBLE NOW */}
                                <div className="flex-1 relative group bg-white/5 hover:bg-white/10 focus-within:bg-white rounded-2xl border-2 border-white/30 focus-within:border-white focus-within:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300">
                                    <div className="absolute top-2 left-3 text-[10px] font-bold text-purple-200 group-focus-within:text-purple-600 uppercase tracking-wider transition-colors">
                                        {t('cashback_detailed.insert_here')}
                                    </div>
                                    <div className="flex items-center h-full px-3 pt-4 pb-1">
                                        <span className="text-xl sm:text-2xl font-black text-white group-focus-within:text-purple-700 mr-2 transition-colors">€</span>
                                        <input
                                            type="number"
                                            value={targetBill || ''}
                                            onChange={(e) => setTargetBill(Math.max(0, parseFloat(e.target.value) || 0))}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="0"
                                            className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white group-focus-within:text-purple-900 outline-none placeholder:text-white/20 group-focus-within:placeholder:text-gray-300 transition-colors"
                                        />
                                    </div>
                                    <div
                                        onClick={() => setTargetBill(0)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 group-focus-within:bg-purple-100 rounded-xl text-white group-focus-within:text-purple-600 transition-colors cursor-pointer hover:bg-white/20 active:scale-95 translation-all"
                                    >
                                        <RotateCw size={16} />
                                    </div>
                                </div>

                                {/* Result Box */}
                                <div className="flex-1 bg-gradient-to-br from-gray-900 to-black rounded-2xl p-3 border border-white/10 flex flex-col justify-center items-end shadow-inner relative overflow-hidden group/result">
                                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover/result:opacity-100 transition-opacity" />
                                    <p className={`text-[10px] font-bold uppercase tracking-widest relative z-10 ${extraProfit > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                        {extraProfit > 0 ? t('cashback_detailed.profit') : t('cashback_detailed.pay_only')}
                                    </p>
                                    <div className="flex items-baseline gap-1 relative z-10">
                                        <p className={`text-2xl sm:text-4xl font-black tracking-tight ${extraProfit > 0 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : (remainingToPay === 0 ? 'text-green-400' : 'text-white')}`}>
                                            {extraProfit > 0 ? '+' : ''}€{extraProfit > 0 ? extraProfit.toFixed(0) : remainingToPay.toFixed(0)}
                                        </p>
                                        {/* Savings badge */}
                                        {totalCashback > 0 && remainingToPay > 0 && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-md font-bold mb-1">
                                                -{Math.min(100, percentageCovered).toFixed(0)}%
                                            </span>
                                        )}
                                        {extraProfit > 0 && (
                                            <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-md font-bold mb-1 animate-pulse">
                                                EXTRA!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)] ${percentageCovered >= 100 ? 'bg-green-400' : 'bg-white'}`}
                                    style={{ width: `${Math.min(100, percentageCovered)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                {/* Content - Scrollable List (GRID ON DESKTOP) */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50/50 dark:bg-gray-950 custom-scrollbar">
                    <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-white dark:bg-gray-900 p-2 rounded-2xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-all group hover:border-purple-200 h-full flex flex-col justify-center">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">

                                    {/* LEFT SECTION: Icon + Name (Desktop) / TOP ROW (Mobile) */}
                                    <div className="flex items-center justify-between sm:justify-start sm:w-[35%] shrink-0">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-12 h-12 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm ${cat.isExtra ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40' : 'bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 dark:from-purple-900/40 dark:to-indigo-900/40'}`}>
                                                {React.cloneElement(getIcon(cat.icon), { size: 24, className: "sm:w-6 sm:h-6" })}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-base sm:text-base text-gray-900 dark:text-white truncate uppercase sm:normal-case tracking-tight">{cat.name}</h3>
                                                <p className="block sm:block text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{cat.isExtra ? 'Promozione' : 'Budget Famiglia'}</p>
                                            </div>
                                        </div>

                                        {/* Mobile Result (Hidden sm) */}
                                        <div className="text-right sm:hidden relative flex flex-col items-end">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Cashback</span>
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={cat.percentage + (cat.brand || '')} // Trigger on update
                                                    className={`font-black text-xl ${cat.amount > 0 && cat.percentage > 0 ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-yellow-600 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]' : 'text-gray-900 dark:text-white'}`}
                                                    initial={{ scale: 1 }}
                                                    animate={cat.amount > 0 && cat.percentage > 0 ? {
                                                        scale: [1, 1.5, 1],
                                                        textShadow: ["0 0 0px rgba(234,179,8,0)", "0 0 20px rgba(234,179,8,1)", "0 0 10px rgba(234,179,8,0.5)"]
                                                    } : {}}
                                                    transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                                                >
                                                    € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(0) : '0') : (cat.amount * cat.percentage / 100).toLocaleString(language === 'it' ? 'it-IT' : (language === 'de' ? 'de-DE' : 'en-US'), { maximumFractionDigits: 0 })}
                                                </motion.p>
                                            </AnimatePresence>
                                            {/* Mobile Sparkles */}
                                            {(cat.amount * cat.percentage / 100) > 0 && (
                                                <motion.div
                                                    className="absolute -top-1 -right-2 text-yellow-500 text-xs"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: [0, 90, 180] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                                                >
                                                    ✨
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION: Inputs Grid (Desktop) / BOTTOM ROW (Mobile) */}
                                    <div className="grid grid-cols-12 sm:flex-1 items-center gap-2">

                                        {/* Amount Input */}
                                        <div className="col-span-4 sm:flex-1 relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs sm:text-xs">€</div>
                                            <input
                                                type="number"
                                                value={cat.amount || ''}
                                                onChange={(e) => handleUpdate(cat.id, 'amount', parseFloat(e.target.value) || 0)}
                                                onFocus={(e) => e.target.select()}
                                                placeholder="0"
                                                className="w-full pl-7 pr-2 py-3 sm:py-1.5 bg-gray-50 dark:bg-gray-800/80 rounded-xl sm:rounded-lg text-right font-black text-base sm:text-sm text-gray-900 dark:text-white border border-gray-100 dark:border-white/10 outline-none transition-all shadow-inner focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                            />
                                        </div>

                                        {/* Brand Dropdown */}
                                        <div className="col-span-4 sm:flex-[1.8] relative group/select">
                                            <select
                                                value={cat.brand}
                                                onChange={(e) => handleUpdate(cat.id, 'brand', e.target.value)}
                                                className={`w-full py-3 sm:py-1.5 px-2 sm:px-2 appearance-none rounded-xl sm:rounded-lg text-[10px] sm:text-xs font-black tracking-wide uppercase border outline-none cursor-pointer text-center truncate transition-all duration-300
                                                ${cat.brand
                                                        ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                                        : 'bg-gray-50 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 border-gray-100 dark:border-white/10 shadow-inner'
                                                    }
                                                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20`}
                                            >
                                                <option value="">{t('cashback_detailed.select_brand')}</option>
                                                {BRANDS_DATA
                                                    .filter(brand => {
                                                        const baseId = cat.id.replace(/_\d+$/, '');
                                                        return brand.categories && brand.categories.includes(baseId);
                                                    })
                                                    .map(brand => (
                                                        <option key={brand.name} value={brand.name}>{brand.name}</option>
                                                    ))
                                                }
                                            </select>

                                            {/* Animated Halo Ring (Extra visual) */}
                                            {cat.brand && (
                                                <div className="absolute inset-0 rounded-xl sm:rounded-lg border-2 border-purple-400/30 animate-pulse pointer-events-none" />
                                            )}
                                        </div>

                                        {/* Percentage Input */}
                                        <div className="col-span-4 sm:flex-[1] relative">
                                            {cat.fixedAmount !== undefined ? (
                                                <div className="w-full py-3 sm:py-1.5 text-right font-black text-sm sm:text-sm text-purple-600 dark:text-purple-400 flex items-center justify-end">
                                                    €{cat.fixedAmount.toFixed(0)}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={cat.percentage || ''}
                                                        onChange={(e) => handleUpdate(cat.id, 'percentage', parseFloat(e.target.value) || 0)}
                                                        onFocus={(e) => e.target.select()}
                                                        placeholder="0"
                                                        className="w-full pr-5 sm:pr-6 py-2 sm:py-1.5 bg-transparent text-right font-black text-sm sm:text-sm text-purple-600 dark:text-purple-400 border-b border-purple-100 dark:border-purple-900/50 outline-none focus:border-purple-500 transition-colors"
                                                        step="0.1"
                                                    />
                                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs sm:text-xs text-purple-400 font-bold pointer-events-none">%</span>

                                                    {/* POP EFFECT FOR PERCENTAGE */}
                                                    {cat.percentage > 0 && (
                                                        <motion.div
                                                            key={`pop-${cat.percentage}`}
                                                            className="absolute inset-0 pointer-events-none border border-yellow-400/50 rounded-lg"
                                                            initial={{ opacity: 0, scale: 1.5 }}
                                                            animate={{ opacity: [0, 1, 0], scale: [1.5, 1, 1.2] }}
                                                            transition={{ duration: 0.5 }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Desktop Result (Visible sm only) - GAME STYLE */}
                                        <div className="hidden sm:block sm:w-32 text-right shrink-0 relative">
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`res-${cat.id}-${cat.percentage}`}
                                                    className="relative inline-block"
                                                    initial={{ scale: 1 }}
                                                    animate={cat.amount > 0 && cat.percentage > 0 ? { scale: [1, 1.2, 1] } : {}}
                                                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                                >
                                                    <motion.p
                                                        className={`font-black text-lg sm:text-3xl truncate transition-colors duration-300 ${cat.amount > 0 && cat.percentage > 0 ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]' : 'text-gray-900 dark:text-white'}`}
                                                    >
                                                        € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(0) : '0') : (cat.amount * cat.percentage / 100).toLocaleString(language === 'it' ? 'it-IT' : (language === 'de' ? 'de-DE' : 'en-US'), { maximumFractionDigits: 0 })}
                                                    </motion.p>

                                                    {/* Gold Sparkles if > 0 */}
                                                    {(cat.amount * cat.percentage / 100) > 0 && (
                                                        <motion.div
                                                            className="absolute -top-2 -right-4 text-yellow-500"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: [0, 1, 0], y: -20 }}
                                                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                                                        >
                                                            ✨
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer - COMPACT */}
                <div className="p-3 sm:p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 z-10 safe-area-bottom pb-4 sm:pb-8 flex flex-row items-center gap-3 sm:gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm font-bold border border-red-100 active:scale-95 group"
                    >
                        <RotateCcw size={18} />
                        <span className="text-[10px] sm:text-xs uppercase font-black">{t('cashback_detailed.reset')}</span>
                    </button>

                    <button
                        onClick={() => onConfirm(totalSpend, totalCashback, categories)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-purple-500/40 active:scale-[0.98] transition-all text-base sm:text-2xl uppercase tracking-widest flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                        {t('cashback_detailed.confirm')}
                        <Check size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>
            </div >

            <CashbackFocusMode
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
                onSelect={handleFocusModeSelect}
                t={t}
                language={language}
            />
        </div >
    );
};
