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
        ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
    `;

    const getIconContainerClass = (isActive: boolean) => `
        p-2 rounded-2xl mb-1 transition-all duration-300
        ${isActive ? 'bg-white/10 shadow-lg shadow-black/20 transform -translate-y-1 ring-1 ring-white/10' : 'bg-transparent'}
    `;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] flex justify-center md:hidden">
            <div
                className="flex items-center justify-between w-full max-w-md md:max-w-2xl px-2 py-3 md:px-8 md:py-4 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] ring-1 ring-black/20 transition-all duration-300 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
            >
                <div className="absolute inset-0 bg-white/5 pointer-events-none" />

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
                    <div className="p-2 rounded-2xl mb-1 bg-union-green-500/10 text-union-green-400 shadow-sm border border-union-green-500/20 group-hover:scale-110 transition-transform">
                        <Compass className="w-6 h-6 md:w-9 md:h-9" />
                    </div>
                    <span className="text-[9px] md:text-xs font-bold leading-none text-union-green-400 flex items-center gap-0.5">
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
