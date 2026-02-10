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
import GridMenu from './GridMenu';

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

            <GridMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onOpenPresentation={onOpenPresentation}
                onOpenUnionEcosystem={onOpenUnionEcosystem}
                onOpenFuelPitch={onOpenFuelPitch}
                onOpenFocusMode={onOpenFocusMode}
                toggleShary={toggleShary}
                isSharyActive={isSharyActive}
                onOpenTarget={onOpenTarget}
                onOpenFutureTicket={onOpenFutureTicket}
                onOpenGuide={onOpenGuide}
                onOpenInstall={onOpenInstall}
                isPremium={isPremium}
                viewMode={viewMode}
                showInstall={showInstall}
            />
        </div>
    );
};

export default HeaderMenu;
