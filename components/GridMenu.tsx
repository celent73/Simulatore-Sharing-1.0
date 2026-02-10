import React from 'react';
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
    ChevronRight,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface GridMenuProps {
    isOpen: boolean;
    onClose: () => void;
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

const GridMenu: React.FC<GridMenuProps> = ({
    isOpen,
    onClose,
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            transition: {
                staggerChildren: 0.02,
                staggerDirection: -1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20 }
    };

    // Compact MenuItem for better visibility on mobile
    const MenuItem = ({ icon: Icon, label, onClick, colorClass, gradient }: any) => (
        <motion.button
            variants={itemVariants}
            onClick={() => {
                onClick();
                onClose();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                relative flex flex-col items-center justify-center 
                aspect-square p-2 rounded-2xl 
                bg-white dark:bg-slate-800 
                shadow-xl border border-slate-100 dark:border-slate-700
                group overflow-hidden
            `}
        >
            <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300
                bg-gradient-to-br ${gradient}
            `} />

            <div className={`
                p-2.5 rounded-xl mb-2 
                ${colorClass} 
                shadow-sm
            `}>
                <Icon size={24} strokeWidth={1.5} />
            </div>

            <span className="text-[10px] font-bold text-center text-slate-700 dark:text-slate-200 leading-tight">
                {label}
            </span>
        </motion.button>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                >
                    {/* Dark overlay backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-100/80 dark:bg-black/80"
                        onClick={onClose}
                    />

                    {/* Close Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={onClose}
                        className="absolute top-6 right-6 p-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors z-20 shadow-lg"
                    >
                        <X size={24} />
                    </motion.button>

                    {/* Main Grid Container */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative z-10 w-full max-w-4xl"
                    >
                        <div className="text-center mb-8">
                            <motion.h2 variants={itemVariants} className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                                Menu
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-slate-500 dark:text-slate-400">
                                Tutte le app a portata di mano
                            </motion.p>
                        </div>

                        {/* GRID - 3 columns on mobile, 4 on larger screens */}
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-6">

                            {/* APPS SECTION */}
                            <MenuItem
                                icon={Presentation}
                                label={t('menu.business')}
                                colorClass="bg-purple-100 text-purple-600"
                                gradient="from-purple-500 to-indigo-500"
                                onClick={onOpenPresentation}
                            />

                            <MenuItem
                                icon={Share2}
                                label={t('menu.revolution')}
                                colorClass="bg-cyan-100 text-cyan-600"
                                gradient="from-cyan-500 to-blue-500"
                                onClick={onOpenUnionEcosystem}
                            />

                            <MenuItem
                                icon={Zap}
                                label={t('menu.focus_mode')}
                                colorClass="bg-yellow-100 text-yellow-600"
                                gradient="from-yellow-400 to-orange-500"
                                onClick={onOpenFocusMode}
                            />

                            <MenuItem
                                icon={Fuel}
                                label={t('menu.fuel_pitch')}
                                colorClass="bg-red-100 text-red-600"
                                gradient="from-red-500 to-rose-500"
                                onClick={onOpenFuelPitch}
                            />

                            {/* TOOLS SECTION */}
                            <MenuItem
                                icon={Bot}
                                label={isSharyActive ? t('menu.shary_active') : t('menu.activate_shary')}
                                colorClass={isSharyActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}
                                gradient="from-green-400 to-emerald-500"
                                onClick={toggleShary}
                            />

                            {viewMode === 'family' && (
                                <>
                                    <MenuItem
                                        icon={Target}
                                        label={t('menu.calc_goal')}
                                        colorClass="bg-emerald-100 text-emerald-600"
                                        gradient="from-emerald-400 to-teal-500"
                                        onClick={onOpenTarget}
                                    />
                                    <MenuItem
                                        icon={Ticket}
                                        label={t('menu.your_ticket')}
                                        colorClass="bg-fuchsia-100 text-fuchsia-600"
                                        gradient="from-fuchsia-400 to-pink-500"
                                        onClick={onOpenFutureTicket}
                                    />
                                </>
                            )}

                            {/* UTILS SECTION */}
                            <MenuItem
                                icon={BookOpen}
                                label={t('menu.guide')}
                                colorClass="bg-blue-100 text-blue-600"
                                gradient="from-blue-400 to-indigo-500"
                                onClick={onOpenGuide}
                            />

                            <MenuItem
                                icon={ExternalLink}
                                label={t('menu.store')}
                                colorClass="bg-indigo-100 text-indigo-600"
                                gradient="from-indigo-400 to-violet-500"
                                onClick={() => window.open('https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true', '_blank')}
                            />

                            {showInstall && (
                                <MenuItem
                                    icon={Download}
                                    label={t('menu.install')}
                                    colorClass="bg-slate-800 text-white"
                                    gradient="from-slate-700 to-slate-900"
                                    onClick={onOpenInstall}
                                />
                            )}

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GridMenu;
