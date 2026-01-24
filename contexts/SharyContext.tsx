import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SharyContextType {
    isActive: boolean;
    toggleShary: () => void;
    currentMessage: string | null;
    speak: (message: string) => void;
    silence: () => void;
}

const SharyContext = createContext<SharyContextType | undefined>(undefined);

export const SharyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);

    const toggleShary = () => {
        setIsActive(prev => {
            const newState = !prev;
            if (newState) {
                speak("Ciao! Sono Shary, il tuo assistente personale per il Simulatore Sharing. Clicca sulle mie piccole icone per ricevere aiuto passo-passo!");
            } else {
                silence();
            }
            return newState;
        });
    };

    const speak = (message: string) => {
        if (!isActive) return; // Don't speak if disabled, unless we force enable? For now strict.
        setCurrentMessage(message);
    };

    const silence = () => {
        setCurrentMessage(null);
    };

    return (
        <SharyContext.Provider value={{ isActive, toggleShary, currentMessage, speak, silence }}>
            {children}
        </SharyContext.Provider>
    );
};

export const useShary = () => {
    const context = useContext(SharyContext);
    if (context === undefined) {
        throw new Error('useShary must be used within a SharyProvider');
    }
    return context;
};
