import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Check, Sparkles, Search, ArrowRight } from 'lucide-react';
import { BRANDS_DATA, getIcon } from './CashbackData';

interface CashbackFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (categoryBaseId: string, brandName: string, amount?: number) => void;
    t: (key: string) => string;
    language: string;
}

// Extract unique categories from BRANDS_DATA
const AVAILABLE_CATEGORIES = Array.from(new Set(BRANDS_DATA.flatMap(b => b.categories)));

export const CashbackFocusMode: React.FC<CashbackFocusModeProps> = ({ isOpen, onClose, onSelect, t, language }) => {
    const [spendingAmount, setSpendingAmount] = useState<string>('');
    const [step, setStep] = useState<'category' | 'brand' | 'reveal'>('category');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<typeof BRANDS_DATA[0] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Local translations to fix missing keys/underscores
    const LABELS: Record<string, Record<string, string>> = {
        'cashback_detailed.select_category': {
            it: 'SCEGLI UNA CATEGORIA',
            de: 'KATEGORIE WÄHLEN',
            en: 'CHOOSE A CATEGORY'
        },
        'cashback_detailed.select_brand': {
            it: 'SELEZIONA BRAND',
            de: 'MARKE WÄHLEN',
            en: 'SELECT BRAND'
        },
        'cashback_detailed.return': {
            it: 'RITORNO CASHBACK',
            de: 'CASHBACK RÜCKVERGÜTUNG',
            en: 'CASHBACK RETURN'
        },
        'common.back': {
            it: 'INDIETRO',
            de: 'ZURÜCK',
            en: 'BACK'
        },
        'common.select': {
            it: 'SELEZIONA',
            de: 'AUSWÄHLEN',
            en: 'SELECT'
        },
        'cashback_detailed.insert_spending': {
            it: 'INSERISCI SPESA',
            de: 'AUSGABEN EINGEBEN',
            en: 'ENTER SPENDING'
        },
        'cashback_detailed.cat.alim': {
            it: 'Alimentari',
            de: 'Lebensmittel',
            en: 'Groceries'
        },
        'cashback_detailed.cat.igiene': {
            it: 'Igiene personale',
            de: 'Körperpflege',
            en: 'Personal Care'
        },
        'cashback_detailed.cat.carb': {
            it: 'Carburante',
            de: 'Kraftstoff',
            en: 'Fuel'
        },
        'cashback_detailed.cat.tech': {
            it: 'Hi-Tech',
            de: 'Elektronik & Tech',
            en: 'Hi-Tech'
        },
        'cashback_detailed.cat.treni': {
            it: 'Trasporti',
            de: 'Transport',
            en: 'Transport'
        },
        'cashback_detailed.cat.school': {
            it: 'Materiale scolastico',
            de: 'Schulmaterial',
            en: 'School Supplies'
        },
        'cashback_detailed.cat.abb': {
            it: 'Abbigliamento',
            de: 'Kleidung',
            en: 'Clothing'
        },
        'cashback_detailed.cat.casa': {
            it: 'Casa',
            de: 'Zuhause',
            en: 'Home'
        },
        'cashback_detailed.cat.regali': {
            it: 'Regali e Svago',
            de: 'Geschenke & Freizeit',
            en: 'Gifts & Leisure'
        },
        'cashback_detailed.cat.md': {
            it: 'Discount',
            de: 'Discounter',
            en: 'Discount'
        },
        'cashback_detailed.cat.aff_int': {
            it: 'Esempio affiliazioni internet',
            de: 'Beispiel Internet-Affiliates',
            en: 'Example Internet Affiliates'
        },
    };

    const getLabel = (key: string) => {
        // Try global translation first
        const translated = t(key);
        // If it's a missing key (usually returns the key itself) or contains underscores, use local fallback
        if (translated === key || translated.includes('_')) {
            const langKey = (language === 'de' || language === 'en') ? language : 'it';
            return LABELS[key]?.[langKey] || LABELS[key]?.['it'] || key;
        }
        return translated;
    };

    useEffect(() => {
        if (!isOpen) {
            // Reset state after exit animation might be nice, but for now just reset on open/close triggers if needed
            setTimeout(() => {
                setStep('category');
                setSelectedCategory(null);
                setSelectedBrand(null);
                setSearchTerm('');
                setSpendingAmount('');
            }, 500);
        }
    }, [isOpen]);

    const handleCategorySelect = (cat: string) => {
        setSelectedCategory(cat);
        setStep('brand');
        setSearchTerm(''); // Clear search when entering brand step
    };

    const handleBrandSelect = (brand: typeof BRANDS_DATA[0]) => {
        setSelectedBrand(brand);
        setStep('reveal');
    };

    const handleConfirm = () => {
        if (selectedCategory && selectedBrand) {
            const amount = parseFloat(spendingAmount) || 0;
            onSelect(selectedCategory, selectedBrand.name, amount);
            onClose();
        }
    };

    const handleBack = () => {
        if (step === 'brand') {
            setStep('category');
            setSelectedCategory(null);
        } else if (step === 'reveal') {
            setStep('brand');
            setSelectedBrand(null);
        }
    };

    if (!isOpen) return null;

    // Filter brands based on category and search
    const filteredBrands = selectedCategory
        ? BRANDS_DATA.filter(b =>
            b.categories.includes(selectedCategory) &&
            b.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    // Helper to get category icon name (mapping back from getIcon logic if possible, or manual)
    const getCategoryIconName = (catId: string) => {
        switch (catId) {
            case 'alim': return 'ShoppingBag';
            case 'carb': return 'Car';
            case 'igiene': return 'ShoppingCart';
            case 'tech': return 'Calculator'; // fallback
            case 'treni': return 'Plane';
            case 'school': return 'BookOpen';
            case 'abb': return 'Gift';
            case 'casa': return 'Home';
            case 'regali': return 'Gift';
            case 'md': return 'ShoppingBag'; // Fallback
            case 'aff_int': return 'Coffee';
            default: return 'Coffee';
        }
    };

    // Calculate cashback return based on input
    const parsedAmount = parseFloat(spendingAmount) || 0;
    const cashbackReturn = selectedBrand ? (parsedAmount * selectedBrand.percentage / 100) : 0;

    return (
        <div className="fixed inset-0 z-[100001] bg-black text-white flex flex-col overflow-hidden font-sans">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px] animate-[pulse_8s_infinite]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] animate-[pulse_10s_infinite_reverse]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* HEADER */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <button
                    onClick={step === 'category' ? onClose : handleBack}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    {step === 'category' ? <X size={24} /> : <ChevronLeft size={24} />}
                </button>

                <div className="text-sm font-bold tracking-[0.2em] text-white/50 uppercase">
                    Focus Mode
                </div>

                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* CONTENT AREA */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full max-w-7xl mx-auto h-full overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 'category' && (
                        <motion.div
                            key="step-category"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full flex flex-col items-center"
                        >
                            <h2 className="text-3xl sm:text-5xl font-black mb-8 sm:mb-12 text-center text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                                {getLabel('cashback_detailed.select_category') || "Scegli una Categoria"}
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 w-full overflow-y-auto pb-10 custom-scrollbar pr-2">
                                {AVAILABLE_CATEGORIES.map((cat, idx) => (
                                    <motion.button
                                        key={cat}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => handleCategorySelect(cat)}
                                        className="group relative aspect-square bg-white/5 hover:bg-white/15 border border-white/10 hover:border-purple-500/50 rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:-translate-y-1"
                                    >
                                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-500/20 group-hover:text-purple-300">
                                            {React.cloneElement(getIcon(getCategoryIconName(cat)), { size: 32 })}
                                        </div>
                                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/70 group-hover:text-white transition-colors">
                                            {getLabel(`cashback_detailed.cat.${cat}`) || cat}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BRAND SELECTION */}
                    {step === 'brand' && selectedCategory && (
                        <motion.div
                            key="step-brand"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-4xl flex flex-col h-full"
                        >
                            <div className="flex-shrink-0 mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-4xl font-black mb-4 flex items-center flex-wrap gap-2 sm:gap-4">
                                    <span className="text-purple-400">{getLabel(`cashback_detailed.cat.${selectedCategory}`) || selectedCategory}</span>
                                    <span className="text-white/30 hidden sm:inline">/</span>
                                    <span className="text-white">{getLabel('cashback_detailed.select_brand') || "Seleziona Brand"}</span>
                                </h2>

                                {/* Search Bar */}
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cerca brand..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xl text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pb-10 custom-scrollbar pr-2 flex-grow content-start">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand, idx) => (
                                        <motion.button
                                            key={brand.name}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.03 }}
                                            onClick={() => handleBrandSelect(brand)}
                                            className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/20 rounded-2xl group transition-all"
                                        >
                                            <span className="font-bold text-lg text-white/90 group-hover:text-white text-left">{brand.name}</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                                <ArrowRight size={16} />
                                            </div>
                                        </motion.button>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-white/40 py-10 italic">
                                        Nessun brand trovato
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REVEAL */}
                    {step === 'reveal' && selectedBrand && (
                        <motion.div
                            key="step-reveal"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="flex flex-col items-center justify-center text-center relative w-full h-full"
                        >
                            {/* Background Explosion Effect */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
                                <div className="absolute w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[80px]" />
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-4 text-purple-300 text-xl sm:text-2xl font-bold uppercase tracking-widest relative z-10"
                            >
                                {selectedBrand.name}
                            </motion.div>

                            {/* SPENDING INPUT */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative z-20 mb-32 sm:mb-16 w-full max-w-[200px]"
                            >
                                <label className="block text-xs font-bold text-purple-200 uppercase tracking-widest mb-2 opacity-70">
                                    {getLabel('cashback_detailed.insert_spending') || "Inserisci Spesa"}
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-white/50 group-focus-within:text-purple-400 transition-colors">€</span>
                                    <input
                                        type="number"
                                        value={spendingAmount}
                                        onChange={(e) => setSpendingAmount(e.target.value)}
                                        placeholder="0"
                                        className="w-full bg-white/10 border-2 border-white/10 rounded-2xl py-3 pl-10 pr-4 text-3xl font-black text-center text-white placeholder-white/20 focus:outline-none focus:bg-white/20 focus:border-purple-500 transition-all"
                                        autoFocus
                                    />
                                </div>
                            </motion.div>

                            <div className="relative z-10">
                                {parsedAmount > 0 ? (
                                    <motion.div
                                        className="text-[15vw] sm:text-[120px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-100 to-yellow-600 drop-shadow-[0_0_60px_rgba(234,179,8,0.5)]"
                                        initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        key="cashback-amount"
                                    >
                                        € {cashbackReturn.toLocaleString(language === 'de' ? 'de-DE' : 'it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        className="text-[20vw] sm:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-[0_0_60px_rgba(255,255,255,0.3)]"
                                        initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                    >
                                        {selectedBrand?.percentage}%
                                    </motion.div>
                                )}

                                {/* Sparkles Overlay */}
                                <motion.div
                                    className="absolute -top-6 -right-4 sm:-top-10 sm:-right-10 text-yellow-400"
                                    initial={{ scale: 0, rotate: 0 }}
                                    animate={{ scale: 1.5, rotate: 180 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <Sparkles size={60} className="sm:w-20 sm:h-20" />
                                </motion.div>
                            </div>

                            <motion.div
                                className="mt-4 text-gray-400 text-lg sm:text-xl font-medium"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {parsedAmount > 0 ?
                                    (getLabel('cashback_detailed.return') + ` (${selectedBrand.percentage}%)`) :
                                    (getLabel('cashback_detailed.return') || "Ritorno Cashback")
                                }
                            </motion.div>

                            {/* ACTION BUTTONS */}
                            <motion.div
                                className="mt-16 flex flex-col sm:flex-row gap-4 relative z-20 w-full sm:w-auto px-6"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <button
                                    onClick={handleBack}
                                    className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold backdrop-blur-md transition-all text-center"
                                >
                                    {getLabel('common.back') || "Indietro"}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="px-10 py-4 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2 group text-center"
                                >
                                    <Check size={24} className="group-hover:scale-110 transition-transform" />
                                    {getLabel('common.select') || "SELEZIONA"}
                                </button>
                            </motion.div>

                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
