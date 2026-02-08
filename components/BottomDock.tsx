import React from 'react';
import { User, Users, Building2, Compass, Sparkles, Lock } from 'lucide-react';
import { ClientModeIcon, FamilyModeIcon, CondoModeIcon } from './icons/ModeIcons';

interface BottomDockProps {
    viewMode: string;
    handleModeChange: (mode: string) => void;
    onOpenLightSimulator: () => void;
    isPremium: boolean;
}

const BottomDock: React.FC<BottomDockProps> = ({
    viewMode,
    handleModeChange,
    onOpenLightSimulator,
    isPremium
}) => {

    // Helper for button classes
    const getButtonClass = (isActive: boolean) => `
        relative flex flex-col items-center justify-center w-full h-full 
        transition-all duration-300 ease-out active:scale-95 group
        ${isActive ? 'text-union-blue-600' : 'text-gray-400 hover:text-gray-600'}
    `;

    const getIconContainerClass = (isActive: boolean) => `
        p-2 rounded-2xl mb-1 transition-all duration-300
        ${isActive ? 'bg-blue-50 shadow-sm transform -translate-y-1' : 'bg-transparent'}
    `;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center">
            <div className="flex items-center justify-between w-full max-w-md md:max-w-2xl px-2 py-3 md:px-8 md:py-4 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] ring-1 ring-black/5 transition-all duration-300">

                {/* 1. AMMINISTRATORI (CONDO) - Leftmost */}
                <button
                    onClick={() => handleModeChange('condo')}
                    className={getButtonClass(viewMode === 'condo')}
                >
                    {!isPremium && <div className="absolute top-1 right-4 md:right-8 bg-red-500 text-white p-0.5 rounded-full z-20 shadow-sm"><Lock size={8} className="md:w-3 md:h-3" /></div>}
                    <div className={getIconContainerClass(viewMode === 'condo')}>
                        <CondoModeIcon className={`w-6 h-6 md:w-9 md:h-9 transition-all ${viewMode !== 'condo' ? 'grayscale opacity-70' : ''}`} />
                    </div>
                    <span className="text-[9px] md:text-xs font-bold leading-none text-center max-w-[60px] md:max-w-none">Admin</span>
                </button>

                {/* 2. SHARING SIMULATOR LIGHT */}
                <button
                    onClick={onOpenLightSimulator}
                    className={getButtonClass(false)} // Always inactive style unless we want to track light modal state
                >
                    <div className="p-2 rounded-2xl mb-1 bg-union-green-50 text-union-green-600 shadow-sm border border-union-green-100 group-hover:scale-110 transition-transform">
                        <Compass className="w-6 h-6 md:w-9 md:h-9" />
                    </div>
                    <span className="text-[9px] md:text-xs font-bold leading-none text-union-green-600 flex items-center gap-0.5">
                        Light <Sparkles size={6} className="animate-pulse md:w-3 md:h-3" />
                    </span>
                </button>

                {/* 3. PARTNER SHARING (FAMILY) */}
                <button
                    onClick={() => handleModeChange('family')}
                    className={getButtonClass(viewMode === 'family')}
                >
                    <div className={getIconContainerClass(viewMode === 'family')}>
                        <FamilyModeIcon className={`w-6 h-6 md:w-9 md:h-9 transition-all ${viewMode !== 'family' ? 'grayscale opacity-70' : ''}`} />
                    </div>
                    <span className="text-[9px] md:text-xs font-bold leading-none text-center max-w-[60px] md:max-w-none">Partner</span>
                </button>

                {/* 4. CLIENTE SEMPLICE (CLIENT) - Rightmost */}
                <button
                    onClick={() => handleModeChange('client')}
                    className={getButtonClass(viewMode === 'client')}
                >
                    <div className={getIconContainerClass(viewMode === 'client')}>
                        <ClientModeIcon className={`w-6 h-6 md:w-9 md:h-9 transition-all ${viewMode !== 'client' ? 'grayscale opacity-70' : ''}`} />
                    </div>
                    <span className="text-[9px] md:text-xs font-bold leading-none text-center max-w-[60px] md:max-w-none">Cliente</span>
                </button>

            </div>
        </div>
    );
};

export default BottomDock;
