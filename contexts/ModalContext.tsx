import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the type for modal keys
export type ModalKey =
    | 'INTRO'
    | 'LEGAL'
    | 'NETWORK_VISUALIZER'
    | 'GUIDE'
    | 'BUSINESS_PRESENTATION'
    | 'UNION_ECOSYSTEM'
    | 'FUEL_PITCH'
    | 'FOCUS_MODE'
    | 'TARGET_CALCULATOR'
    | 'FUTURE_TICKET'
    | 'GRID_MENU'
    | 'BROADCAST'
    | 'INSTALL_PROMPT'
    | 'ECONOMY_EXPLAINED' // If needed
    | 'LIGHT_SIMULATOR'
    | 'RESET_CONFIRM'
    | 'SAVE_CONFIRM'
    | 'LOAD_CONFIRM'
    | 'PAYMENT_SUCCESS'
    | 'PREMIUM_UNLOCK'
    | 'CASHBACK_DETAILED'
    | 'CONTRACT_INFO'
    | 'DISCLAIMER'
    | 'ANALISI_UTENZE' // And any others
    | null;

interface ModalContextType {
    activeModal: ModalKey;
    modalProps: any;
    openModal: (key: ModalKey, props?: any) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<ModalKey>(null);
    const [modalProps, setModalProps] = useState<any>({});

    const openModal = useCallback((key: ModalKey, props: any = {}) => {
        setModalProps(props);
        setActiveModal(key);
    }, []);

    const closeModal = useCallback(() => {
        setActiveModal(null);
        setModalProps({});
    }, []);

    return (
        <ModalContext.Provider value={{ activeModal, modalProps, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
