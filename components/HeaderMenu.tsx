import React, { useState, useRef, useEffect } from 'react';
import {
    LayoutGrid,
    Presentation,
    Share2,
    Fuel,
    Zap,
    Bot,
    Target,
    Ticket,
    BookOpen,
    ExternalLink,
    Download,
    X,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderMenuProps {
    onOpenPresentation: () => void;
    onOpenUnionEcosystem: () => void;
    onOpenFuelPitch: () => void;
    onOpenFocusMode: () => void;
    toggleShary: () => void;
    isSharyActive: boolean;
    onOpenTarget: () => void;
    onOpenFutureTicket: () => void;
    onOpenGuide: () => void;
    onOpenInstall: () => void;
    isPremium: boolean;
    viewMode: string;
    showInstall: boolean;
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
    onOpenPresentation,
    onOpenUnionEcosystem,
    onOpenFuelPitch,
    onOpenFocusMode,
    toggleShary,
    isSharyActive,
    onOpenTarget,
    onOpenFutureTicket,
    onOpenGuide,
    onOpenInstall,
    isPremium,
    viewMode,
    showInstall
}) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const menuWait = {
        hidden: { opacity: 0, y: -20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.2 }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: { duration: 0.15 }
        }
    };

    const MenuItem = ({ icon: Icon, label, onClick, colorClass, badge }: any) => (
        <button
            onClick={() => { onClick(); setIsOpen(false); }}
            className="flex items-center w-full p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all group active:scale-95"
        >
            <div className={`p-2 rounded-lg ${colorClass} mr-3 shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={18} />
            </div>
            <div className="flex-1 text-left">
                <span className="font-bold text-gray-700 dark:text-gray-200 text-sm block">{label}</span>
                {badge && <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{badge}</span>}
            </div>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
        </button>
    );

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg border-0 hover:scale-105 active:scale-95 flex items-center justify-center ${isOpen ? 'ring-2 ring-primary-500' : ''}`}
            >
                {isOpen ? <X size={20} /> : <LayoutGrid size={20} />}
                <span className="hidden sm:inline ml-2 font-bold text-sm">Menu</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuWait}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[9999] ring-1 ring-black/5"
                    >
                        <div className="p-2 space-y-1 max-h-[80vh] overflow-y-auto custom-scrollbar">

                            {/* SECTION 1: PRESENTATIONS */}
                            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('menu.presentations')}</div>

                            <MenuItem
                                icon={Presentation}
                                label={t('menu.business')}
                                colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
                                onClick={onOpenPresentation}
                            />
                            <MenuItem
                                icon={Share2}
                                label={t('menu.revolution')}
                                colorClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
                                onClick={onOpenUnionEcosystem}
                            />
                            <MenuItem
                                icon={Fuel}
                                label={t('menu.fuel_pitch')}
                                colorClass="bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                                onClick={onOpenFuelPitch}
                            />

                            <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2"></div>

                            {/* SECTION 2: TOOLS */}
                            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('menu.tools')}</div>

                            <MenuItem
                                icon={Zap}
                                label={t('menu.focus_mode')}
                                colorClass="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400"
                                onClick={onOpenFocusMode}
                            />
                            <MenuItem
                                icon={Bot}
                                label={isSharyActive ? t('menu.shary_active') : t('menu.activate_shary')}
                                colorClass={isSharyActive ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" : "bg-gray-100 text-gray-500"}
                                onClick={toggleShary}
                            />

                            {viewMode === 'family' && (
                                <>
                                    <MenuItem
                                        icon={Target}
                                        label={t('menu.calc_goal')}
                                        colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                                        onClick={onOpenTarget}
                                    />
                                    <MenuItem
                                        icon={Ticket}
                                        label={t('menu.your_ticket')}
                                        colorClass="bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400"
                                        onClick={onOpenFutureTicket}
                                    />
                                </>
                            )}

                            <div className="h-px bg-gray-100 dark:bg-white/5 my-1 mx-2"></div>

                            {/* SECTION 3: OTHER */}
                            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('menu.other')}</div>

                            <MenuItem
                                icon={BookOpen}
                                label={t('menu.guide')}
                                colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                                onClick={onOpenGuide}
                            />
                            <MenuItem
                                icon={ExternalLink}
                                label={t('menu.store')}
                                colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400"
                                onClick={() => window.open('https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true', '_blank')}
                            />

                            {showInstall && (
                                <MenuItem
                                    icon={Download}
                                    label={t('menu.install')}
                                    colorClass="bg-gray-800 text-white"
                                    onClick={onOpenInstall}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HeaderMenu;
