import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModalDispatch } from '../contexts/ModalContext';

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

const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
    const { t } = useLanguage();
    const { openModal } = useModalDispatch();

    const handleOpenMenu = () => {
        openModal('GRID_MENU', { ...props });
    };

    return (
        <div className="relative">
            <button
                onClick={handleOpenMenu}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-lg border-0 hover:scale-105 active:scale-95 flex items-center justify-center"
            >
                <LayoutGrid size={20} />
                <span className="hidden sm:inline ml-2 font-bold text-sm">Menu</span>
            </button>
        </div>
    );
};

export default HeaderMenu;
