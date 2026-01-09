import React, { useState, useEffect, useRef } from 'react';
import { X, Calculator, RefreshCw, ShoppingBag, Car, ShoppingCart, Gift, Plane, Home, BookOpen, Coffee, Check, Trash2, PlusCircle, RotateCcw } from 'lucide-react';

import { CashbackCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CashbackDetailedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (totalSpending: number, totalCashback: number, details: CashbackCategory[]) => void;
    initialDetails?: CashbackCategory[];
}

const getIcon = (name: string) => {
    switch (name) {
        case 'ShoppingBag': return <ShoppingBag size={20} />;
        case 'Car': return <Car size={20} />;
        case 'ShoppingCart': return <ShoppingCart size={20} />;
        case 'Gift': return <Gift size={20} />;
        case 'Plane': return <Plane size={20} />;
        case 'Home': return <Home size={20} />;
        case 'BookOpen': return <BookOpen size={20} />;
        default: return <Coffee size={20} />;
    }
};

// List of available brands with cashback percentages
// List of available brands with cashback percentages and categories
const BRANDS_DATA = [
    // ALIMENTARI
    { name: 'Conad', percentage: 1.69, categories: ['alim'] },
    { name: 'Carrefour', percentage: 2.25, categories: ['alim'] },
    { name: 'Penny.', percentage: 3.38, categories: ['alim', 'md'] },
    { name: 'Bennet', percentage: 3.38, categories: ['alim'] },
    { name: 'ALI\'', percentage: 2.63, categories: ['alim'] },
    { name: 'Iper La grande i', percentage: 3.00, categories: ['alim'] },
    { name: 'Unes', percentage: 2.63, categories: ['alim'] },
    { name: 'Pam Panorama', percentage: 2.25, categories: ['alim'] },
    { name: 'Despar Nordest', percentage: 2.25, categories: ['alim'] },
    { name: 'Iperal', percentage: 2.25, categories: ['alim'] },
    { name: 'Mercatò', percentage: 2.25, categories: ['alim'] },
    { name: 'Unicomm', percentage: 2.25, categories: ['alim'] },
    { name: 'MAXI DI', percentage: 2.25, categories: ['alim'] },
    { name: 'Il Gigante', percentage: 2.25, categories: ['alim'] },
    { name: 'BASKO', percentage: 2.78, categories: ['alim'] },
    { name: 'Deco', percentage: 3.75, categories: ['alim'] },
    { name: 'SuperConveniente', percentage: 3.75, categories: ['alim'] },
    { name: 'Megamark', percentage: 3.00, categories: ['alim'] },
    { name: 'Martinelli Supermercati', percentage: 2.25, categories: ['alim'] },
    { name: 'Eataly', percentage: 3.38, categories: ['alim', 'regali'] },
    { name: 'Italmark', percentage: 2.25, categories: ['alim'] },
    { name: 'Migross', percentage: 2.25, categories: ['alim'] },
    { name: 'Iper Tosano', percentage: 2.25, categories: ['alim'] },
    { name: 'Rossetto', percentage: 2.25, categories: ['alim'] },
    { name: 'EKOM', percentage: 2.78, categories: ['alim', 'md'] },
    { name: 'MD', percentage: 1.95, categories: ['alim', 'md'] },

    // CARBURANTE
    { name: 'Tamoil', percentage: 1.88, categories: ['carb'] },
    { name: 'Q8', percentage: 1.88, categories: ['carb'] },
    { name: 'IP', percentage: 1.88, categories: ['carb'] },
    { name: 'Buono Enilive Digitale', percentage: 1.88, categories: ['carb'] },
    { name: 'Buono Enilive Servito Digitale', percentage: 2.25, categories: ['carb'] },

    // IGIENE PERSONAL
    { name: 'Tigotà', percentage: 4.13, categories: ['igiene', 'casa'] },
    { name: 'Acqua & Sapone', percentage: 3.38, categories: ['igiene', 'casa'] },
    { name: 'Douglas', percentage: 4.13, categories: ['igiene', 'regali'] },
    { name: 'Sephora', percentage: 4.13, categories: ['igiene', 'regali'] },
    { name: 'Marionnaud Paris', percentage: 4.87, categories: ['igiene', 'regali'] },
    { name: 'Bottega Verde', percentage: 3.38, categories: ['igiene', 'regali'] },
    { name: 'L\'ERBOLARIO', percentage: 3.00, categories: ['igiene', 'regali'] },
    { name: 'Rituals', percentage: 6.38, categories: ['igiene', 'regali'] },
    { name: 'EsserBella Profumerie', percentage: 3.75, categories: ['igiene', 'regali'] },

    // JOLLY (Valid for almost everything)
    { name: 'Amazon.it', percentage: 1.88, categories: ['alim', 'igiene', 'abb', 'regali', 'casa', 'school', 'md'] },
    { name: 'ideaShopping', percentage: 1.88, categories: ['alim', 'igiene', 'abb', 'regali', 'casa', 'school', 'md', 'treni'] },

    // TRASPORTI
    { name: 'Trenitalia', percentage: 3.38, categories: ['treni', 'regali'] },
    { name: 'Italo', percentage: 2.78, categories: ['treni', 'regali'] },
    { name: 'FlixBus', percentage: 3.75, categories: ['treni', 'regali'] },
    { name: 'ITA AIRWAYS', percentage: 3.38, categories: ['treni', 'regali'] },
    { name: 'UBER', percentage: 2.40, categories: ['treni'] },
    { name: 'Volagratis', percentage: 6.00, categories: ['treni', 'regali'] },
    { name: 'IBERIA LÍNEAS AÉREAS', percentage: 3.75, categories: ['treni'] },
    { name: 'Airbnb', percentage: 3.00, categories: ['treni', 'regali'] },
    { name: 'Booking.com', percentage: 3.00, categories: ['treni', 'regali'] },

    // ABBIGLIAMENTO
    { name: 'OVS', percentage: 5.63, categories: ['abb', 'regali'] },
    { name: 'Zalando', percentage: 5.63, categories: ['abb', 'regali'] },
    { name: 'H&M', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Primark', percentage: 3.75, categories: ['abb', 'regali'] },
    { name: 'Tezenis', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Terranova', percentage: 4.50, categories: ['abb', 'regali'] },
    { name: 'PittaRosso', percentage: 4.50, categories: ['abb', 'regali'] },
    { name: 'Intimissimi', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Scarpe&Scarpe', percentage: 2.63, categories: ['abb', 'regali'] },
    { name: 'Calzedonia', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Nike', percentage: 3.00, categories: ['abb', 'regali'] },
    { name: 'Guess', percentage: 4.13, categories: ['abb', 'regali'] },
    { name: 'Foot Locker', percentage: 6.00, categories: ['abb', 'regali'] },
    { name: 'Calliope', percentage: 3.38, categories: ['abb', 'regali'] },
    { name: 'Doppelganger', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Rinascimento', percentage: 3.75, categories: ['abb', 'regali'] },
    { name: 'Asos', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Falconeri', percentage: 4.88, categories: ['abb', 'regali'] },
    { name: 'Chicco', percentage: 4.88, categories: ['abb', 'regali', 'school'] },
    { name: 'Du Pareil Au Meme', percentage: 4.50, categories: ['abb', 'regali'] },
    { name: 'Coccinelle', percentage: 3.00, categories: ['abb', 'regali'] },
    { name: 'Ray-Ban', percentage: 4.13, categories: ['abb', 'regali'] },
    { name: 'Coin', percentage: 4.50, categories: ['abb', 'regali', 'casa'] },

    // ELETTRONICA & CASA & SCHOOL & REGALI (Misti)
    { name: 'MediaWorld', percentage: 1.88, categories: ['regali', 'casa', 'tech'] },
    { name: 'Unieuro', percentage: 2.25, categories: ['regali', 'casa', 'tech'] },
    { name: 'Trony', percentage: 1.65, categories: ['regali', 'casa', 'tech'] },
    { name: 'Expert', percentage: 1.88, categories: ['regali', 'casa', 'tech'] },
    { name: 'TOYS CENTER', percentage: 4.50, categories: ['regali', 'school'] },
    { name: 'Kasanova', percentage: 3.00, categories: ['casa', 'regali'] },
    { name: 'IKEA', percentage: 4.88, categories: ['casa', 'regali'] },
    { name: 'Brico Io', percentage: 4.50, categories: ['casa', 'regali'] },
    { name: 'Bricocenter', percentage: 2.62, categories: ['casa', 'regali'] },
    { name: 'Maisons du Monde', percentage: 5.63, categories: ['casa', 'regali'] },
    { name: 'Feltrinelli', percentage: 5.25, categories: ['school', 'regali', 'tech'] },
    { name: 'Mondadori Store', percentage: 4.13, categories: ['school', 'regali', 'tech'] },
    { name: 'Libraccio.it', percentage: 4.50, categories: ['school', 'regali'] },
    { name: 'Giunti al Punto', percentage: 4.13, categories: ['school', 'regali'] },
    { name: 'Hoepli.it', percentage: 4.88, categories: ['school', 'regali'] },
    { name: 'IBS.it', percentage: 4.50, categories: ['school', 'regali'] },
    { name: 'Decathlon', percentage: 4.13, categories: ['regali', 'abb'] },
    { name: 'Gamelife', percentage: 3.00, categories: ['regali', 'tech'] },
    { name: 'Google Play IT', percentage: 2.25, categories: ['regali', 'tech'] },
    { name: 'Grand Vision Italy', percentage: 4.50, categories: ['regali'] },
    { name: 'Signorvino', percentage: 4.13, categories: ['regali', 'alim'] },
    { name: 'QC SPA', percentage: 5.62, categories: ['regali'] },
    { name: 'Swarovski', percentage: 7.13, categories: ['regali'] },
    { name: 'Smartbox', percentage: 6.37, categories: ['regali'] },
    { name: 'Xbox', percentage: 5.63, categories: ['regali', 'tech'] },
    { name: 'Tannico.it', percentage: 4.88, categories: ['regali', 'alim'] },
    { name: 'GetYourGuide', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'VISTASì', percentage: 4.13, categories: ['regali'] },
    { name: 'Global Hotel Card', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'LEGO', percentage: 4.13, categories: ['regali'] },
    { name: 'Boscolo', percentage: 12.38, categories: ['regali', 'treni'] },
    { name: 'Interflora', percentage: 7.88, categories: ['regali'] },
    { name: 'XBOX Live', percentage: 5.63, categories: ['regali', 'tech'] },
    { name: 'DAZN FULL', percentage: 3.38, categories: ['regali'] },
    { name: 'Lastminute', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'Piquadro.com', percentage: 8.63, categories: ['regali', 'abb'] },
    { name: 'AS Roma', percentage: 3.75, categories: ['regali', 'abb'] },
    { name: 'Best Western Hotels & Resorts', percentage: 4.13, categories: ['regali', 'treni'] },
    { name: 'DisneyPlus Premium', percentage: 2.63, categories: ['regali'] },
    { name: 'Global Experiences Card', percentage: 5.25, categories: ['regali'] },
    { name: 'Abbonamenti.it', percentage: 5.63, categories: ['regali'] },
    { name: 'Venchi', percentage: 4.13, categories: ['regali', 'alim'] },
    { name: 'WeRoad', percentage: 5.63, categories: ['regali', 'treni'] },
    { name: 'Hotelgift', percentage: 3.75, categories: ['regali', 'treni'] },
    { name: 'Twitch', percentage: 2.25, categories: ['regali', 'tech'] },
    { name: 'Winelivery', percentage: 3.00, categories: ['regali', 'alim'] },
    { name: 'Ecobnb', percentage: 4.13, categories: ['regali', 'treni', 'casa'] },
    { name: 'Flightgift', percentage: 2.63, categories: ['regali', 'treni'] },
    { name: 'Salute Semplice', percentage: 7.88, categories: ['regali', 'igiene'] },
    { name: 'Activitygift', percentage: 4.87, categories: ['regali'] },
    { name: 'FAO Schwarz', percentage: 4.88, categories: ['regali'] },
    { name: 'HotelsGift', percentage: 3.75, categories: ['regali', 'treni'] },
    { name: 'I primi 3 mesi di Sky TV + Sky Calcio + Sky Sport', percentage: 3.38, categories: ['regali'] },
    { name: 'I primi 3 mesi di Sky TV e Netflix (Intrattenimento plus) + Sky Cinema', percentage: 3.38, categories: ['regali'] },
    { name: 'UTravel', percentage: 5.25, categories: ['regali', 'treni'] },
    { name: 'Zoologos', percentage: 3.75, categories: ['regali', 'casa'] },

    // ESEMPIO AFFILIAZIONI INTERNET
    { name: 'AliExpress', percentage: 6.92, categories: ['aff_int'] },
    { name: 'Nespresso', percentage: 7.00, categories: ['aff_int'] },
    { name: 'Folletto', percentage: 6.00, categories: ['aff_int'] },
    { name: 'Avon', percentage: 7.00, categories: ['aff_int'] },
    { name: 'Nord Vpn', percentage: 40.00, categories: ['aff_int'] },
    { name: 'Panda security', percentage: 35.00, categories: ['aff_int'] },
    { name: 'Thun', percentage: 8.00, categories: ['aff_int'] },
    { name: 'Kaspersky', percentage: 20.00, categories: ['aff_int'] },
    { name: 'Wondershare', percentage: 30.00, categories: ['aff_int'] },
    { name: 'Axa', percentage: 12.00, categories: ['aff_int'] },
    { name: 'Veratour', percentage: 0, fixedAmount: 21, categories: ['aff_int'] },
    { name: 'Babbel', percentage: 0, fixedAmount: 60, categories: ['aff_int'] },
    { name: 'Verymobile', percentage: 0, fixedAmount: 15, categories: ['aff_int'] },
    { name: 'Bidoo', percentage: 0, fixedAmount: 5, categories: ['aff_int'] },
    { name: 'Uni salute', percentage: 0, fixedAmount: 26.93, categories: ['aff_int'] },
    { name: 'La Stampa', percentage: 0, fixedAmount: 12, categories: ['aff_int'] },
    { name: 'La Repubblica', percentage: 0, fixedAmount: 12, categories: ['aff_int'] },
    { name: 'Allianz Assicurazioni', percentage: 0, fixedAmount: 13, categories: ['aff_int'] },
    { name: 'Telepass', percentage: 0, fixedAmount: 25, categories: ['aff_int'] },
    { name: 'Ho Mobile', percentage: 0, fixedAmount: 11, categories: ['aff_int'] },
    { name: 'Lycamobile', percentage: 0, fixedAmount: 10, categories: ['aff_int'] }
].sort((a, b) => a.name.localeCompare(b.name));



const uiTexts = {
    it: {
        title: "Calcolatore Cashback PRO",
        subtitle: "Personalizza le tue spese mensili per categoria",
        totalSpend: "Spesa Totale",
        monthlyReturn: "Ritorno Mensile",
        selectBrand: "SELEZIONA BRAND",
        other: "ALTRO...",
        return: "ritorno",
        reset: "AZZERA",
        confirm: "Conferma e Applica Budget",
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
        save: "Risparmi",
        billZero: "BOLLETTA AZZERATA! Stai guadagnando",
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
        reset: "ZURÜCKSETZEN",
        confirm: "Budget bestätigen",
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
        save: "Ersparnis",
        billZero: "RECHNUNG AUF NULL! Sie verdienen",
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
    const { language } = useLanguage();
    // Default to 'it' if language is undefined or not supported
    const lang = (language === 'de') ? 'de' : 'it';
    const txt = uiTexts[lang];
    const modalRef = useRef<HTMLDivElement>(null);


    const defaultCategories: CashbackCategory[] = [
        { id: 'alim', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'igiene', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'carb', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'tech', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },
        { id: 'treni', name: txt.cat.treni, amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'school', name: txt.cat.school, amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'abb', name: txt.cat.abb, amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'casa', name: txt.cat.casa, amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'regali', name: txt.cat.regali, amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'aff_int', name: txt.cat.aff_int, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
    ];

    const [categories, setCategories] = useState<CashbackCategory[]>(defaultCategories);
    const [targetBill, setTargetBill] = useState<number>(80);

    // Update categories when language changes
    useEffect(() => {
        setCategories(prev => prev.map(cat => {
            const defKey = Object.keys(txt.cat).find(k => k === cat.id) as keyof typeof txt.cat | undefined;
            if (defKey) {
                return { ...cat, name: txt.cat[defKey] };
            }
            return cat;
        }));
    }, [lang]);

    useEffect(() => {
        if (initialDetails && initialDetails.length > 0) {
            // Map existing saved details
            const initialMap = new Map(initialDetails.map(d => [d.id, d]));

            // Iterate over ALL default fixed categories
            // If we have saved data for that category, use it (amount, brand, percentage)
            // If not (e.g. new 'tech' category), use default
            const merged = defaultCategories.map(defCat => {
                const saved = initialMap.get(defCat.id);
                if (saved) {
                    return {
                        ...defCat,
                        amount: saved.amount,
                        brand: saved.brand,
                        percentage: saved.percentage,
                    };
                }
                return defCat;
            });
            setCategories(merged);
        } else {
            setCategories(defaultCategories);
        }
    }, [initialDetails, isOpen, lang]);

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
        <div ref={modalRef} className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="share-modal-content bg-white dark:bg-gray-900 w-full h-full sm:h-auto sm:max-w-4xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[100vh] sm:max-h-[90vh] overflow-hidden border border-purple-500/20">

                {/* Header */}
                <div className="p-3 sm:p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white shrink-0">
                    <div className="flex justify-between items-center mb-2 sm:mb-4">
                        <div>
                            <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                                <ShoppingBag className="text-purple-200" size={20} />
                                {txt.title}
                            </h2>
                            <p className="text-purple-100 opacity-90 mt-0.5 text-[10px] sm:text-base hidden sm:block">{txt.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">

                            <button onClick={onClose} className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="share-header-cards grid grid-cols-2 gap-2 sm:flex sm:gap-4 mt-2 sm:mt-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-4 flex-1 border border-white/20">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-200 mb-0.5">{txt.totalSpend}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl sm:text-3xl font-black">€ {totalSpend.toLocaleString(lang === 'it' ? 'it-IT' : 'de-DE')}</p>
                                <Calculator className="text-purple-200 opacity-50 mb-1 hidden sm:block" size={16} />
                            </div>
                        </div>
                        <div className="bg-white text-purple-900 rounded-xl sm:rounded-2xl p-2 sm:p-4 flex-1 shadow-lg">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-purple-600 mb-0.5">{txt.monthlyReturn}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl sm:text-3xl font-black">€ {totalCashback.toLocaleString(lang === 'it' ? 'it-IT' : 'de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                <RefreshCw className="text-purple-600 opacity-20 mb-1 hidden sm:block" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* BILL ERASER SECTION */}
                    <div className="bg-white/95 text-gray-900 mt-4 sm:mt-6 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-lg border-2 border-purple-500/20">
                        <div className="flex justify-between items-end mb-2 px-1">
                            <div>
                                <p className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-gray-500 mb-0.5">{txt.estimatedBill}</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400 font-bold text-sm sm:text-base">€</span>
                                    <input
                                        type="number"
                                        value={targetBill || ''}
                                        onChange={(e) => setTargetBill(Math.max(0, parseFloat(e.target.value) || 0))}
                                        onFocus={(e) => e.target.select()}
                                        placeholder="0"
                                        className="w-20 sm:w-24 font-black text-xl sm:text-2xl text-gray-900 bg-transparent outline-none p-0"
                                    />
                                </div>
                            </div>
                            <div className="text-right">
                                {isBillCovered ? (
                                    <div className="animate-in slide-in-from-bottom duration-300">
                                        <p className="text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-wider">{txt.billZero}</p>
                                        <p className="font-black text-xs sm:text-sm text-green-600">+€ {extraProfit.toFixed(2)} {txt.extra}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-[10px] sm:text-xs font-bold text-purple-600 uppercase tracking-wider">{txt.payOnly}</p>
                                        <div className="flex items-center justify-end gap-2">
                                            <p className="font-black text-xl sm:text-2xl text-purple-700">€ {remainingToPay.toFixed(0)}</p>
                                            <div className="text-[9px] sm:text-[10px] text-gray-400 leading-tight text-right">
                                                {txt.save}<br />€{totalCashback.toFixed(0)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden relative shadow-inner">
                            {/* Fill Bar */}
                            <div
                                className={`h-full transition-all duration-700 ease-out flex items-center justify-end pr-1 shadow-lg relative ${isBillCovered
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-400'
                                    : 'bg-gradient-to-r from-orange-500 to-indigo-500'
                                    }`}
                                style={{ width: `${Math.min(100, percentageCovered)}%` }}
                            >
                                <span className="text-[7px] sm:text-[8px] font-black text-white drop-shadow-md whitespace-nowrap z-10 leading-none">
                                    {percentageCovered >= 100 ? '100%' : `${percentageCovered.toFixed(0)}%`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable List */}
                <div className="share-scroll-container flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3 bg-gray-50 dark:bg-gray-900/50">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all group">
                            {/* MOBILE LAYOUT (Flex Col) / DESKTOP LAYOUT (Flex Row) */}
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">

                                {/* TOP ROW Mobile: Icon + Name + Result */}
                                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-1/3 justify-between sm:justify-start">
                                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                                        <div className={`p-2 sm:p-3 rounded-xl ${cat.isExtra ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                                            {React.cloneElement(getIcon(cat.icon), { size: 16 })}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white truncate">{cat.name}</h3>
                                        </div>
                                    </div>

                                    {/* Mobile Result */}
                                    <div className="text-right sm:hidden">
                                        <p className="font-black text-sm text-gray-900 dark:text-white">
                                            € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(2) : '0.00') : (cat.amount * cat.percentage / 100).toFixed(0)}
                                        </p>
                                    </div>
                                </div>

                                {/* BOTTOM ROW Mobile: Inputs Grid */}
                                <div className="grid grid-cols-12 gap-2 sm:gap-3 w-full sm:w-2/3 items-center">

                                    {/* Amount Input */}
                                    <div className="col-span-4 sm:col-span-3 relative">
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs sm:text-base">€</div>
                                        <input
                                            type="number"
                                            value={cat.amount || ''}
                                            onChange={(e) => handleUpdate(cat.id, 'amount', parseFloat(e.target.value) || 0)}
                                            onFocus={(e) => e.target.select()}
                                            placeholder="0"
                                            className="w-full pl-5 sm:pl-7 pr-1 sm:pr-2 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-900 rounded-lg text-right font-black text-sm sm:text-base text-gray-900 dark:text-white border border-transparent hover:border-gray-200 focus:border-purple-500 outline-none transition-all h-8 sm:h-auto"
                                        />
                                    </div>

                                    {/* Brand Dropdown */}
                                    <div className="col-span-4 sm:col-span-4">
                                        <select
                                            value={cat.brand}
                                            onChange={(e) => handleUpdate(cat.id, 'brand', e.target.value)}
                                            className="w-full py-1.5 sm:py-2 pl-1 sm:pl-2 pr-4 sm:pr-6 appearance-none bg-gray-50 dark:bg-gray-900 rounded-lg text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 tracking-wide uppercase border border-transparent hover:border-gray-200 focus:border-purple-500 outline-none transition-all cursor-pointer text-center truncate h-8 sm:h-auto"
                                            style={{ backgroundImage: 'none' }}
                                        >
                                            <option value="">{txt.selectBrand}</option>
                                            {BRANDS_DATA
                                                .filter(brand => brand.categories && brand.categories.includes(cat.id))
                                                .map(brand => (
                                                    <option key={brand.name} value={brand.name}>{brand.name}</option>
                                                ))
                                            }

                                        </select>
                                    </div>

                                    {/* Percentage Input */}
                                    <div className="col-span-4 sm:col-span-2 relative group/percent">
                                        {cat.fixedAmount !== undefined ? (
                                            <div className="w-full py-1.5 sm:py-2 text-right font-black text-sm sm:text-base text-purple-600 dark:text-purple-400 h-8 sm:h-auto border-b-2 border-transparent">
                                                €{cat.fixedAmount.toFixed(2)}
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    type="number"
                                                    value={cat.percentage || ''}
                                                    onChange={(e) => handleUpdate(cat.id, 'percentage', parseFloat(e.target.value) || 0)}
                                                    onFocus={(e) => e.target.select()}
                                                    placeholder="0"
                                                    className="w-full pr-4 sm:pr-6 py-1.5 sm:py-2 bg-transparent text-right font-black text-sm sm:text-base text-purple-600 dark:text-purple-400 border-b-2 border-purple-100 dark:border-purple-900 focus:border-purple-500 outline-none transition-all h-8 sm:h-auto"
                                                    step="0.1"
                                                />
                                                <span className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs text-purple-400 font-bold pointer-events-none">%</span>
                                            </>
                                        )}
                                    </div>

                                    {/* Desktop Result */}
                                    <div className="hidden sm:block sm:col-span-3 text-right">
                                        <p className="font-black text-base text-gray-900 dark:text-white">
                                            € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(2) : '0.00') : (cat.amount * cat.percentage / 100).toFixed(2)}
                                        </p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{txt.return}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-purple-100 dark:border-purple-900/30 bg-white dark:bg-gray-900 z-10 safe-area-bottom pb-8 sm:pb-4 flex flex-row items-center gap-3">
                    <button
                        onClick={handleReset}
                        className="px-4 py-3 sm:py-4 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-red-200 font-bold border border-red-100 hover:border-red-500 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <RotateCcw size={20} />
                        <span className="sm:hidden">Reset</span>
                    </button>

                    <button
                        onClick={() => onConfirm(totalSpend, totalCashback, categories)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-purple-500/30 active:scale-95 transition-all text-base sm:text-lg"
                    >
                        {txt.confirm}
                    </button>
                </div>

            </div >
        </div >
    );
};
