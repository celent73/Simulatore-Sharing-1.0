import React, { Suspense, lazy } from 'react';
import { useModal, ModalKey } from '../contexts/ModalContext';

// Import critical modals directly
import { LegalModal } from './LegalModal';
import { PremiumModal } from './PremiumModal';
import { BroadcastModal } from './BroadcastModal';
import { InstallModal } from './InstallModal'; // Is this PromptModal? Yes
import PaymentSuccessModal from './PaymentSuccessModal';

// Lazy load heavy or less frequent modals
const NetworkVisualizerModal = lazy(() => import('./NetworkVisualizerModal').then(module => ({ default: module.NetworkVisualizerModal })));
const DetailedGuideModal = lazy(() => import('./DetailedGuideModal'));
const ContractInfoModal = lazy(() => import('./ContractInfoModal'));
const FutureTicketModal = lazy(() => import('./FutureTicketModal'));
const BusinessPresentationModal = lazy(() => import('./BusinessPresentationModal').then(module => ({ default: module.BusinessPresentationModal })));
const CashbackDetailedModal = lazy(() => import('./CashbackDetailedModal').then(module => ({ default: module.CashbackDetailedModal })));
const FocusModeModal = lazy(() => import('./FocusModeModal').then(module => ({ default: module.FocusModeModal })));
const FuelPitchModal = lazy(() => import('./FuelPitchModal'));
const UnionEcosystemModal = lazy(() => import('./UnionEcosystemModal').then(module => ({ default: module.UnionEcosystemModal })));
const LightSimulatorModal = lazy(() => import('./LightSimulatorModal'));
const DisclaimerModal = lazy(() => import('./DisclaimerModal'));
const TargetCalculatorModal = lazy(() => import('./TargetCalculatorModal'));
const AnalisiUtenzeModal = lazy(() => import('./AnalisiUtenzeModal').then(module => ({ default: module.AnalisiUtenzeModal })));
const GridMenu = lazy(() => import('./GridMenu')); // If we decide to use it as modal for menu

// Loading component
const LoadingSpinner = () => (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
);

const ModalManager: React.FC = () => {
    const { activeModal, modalProps, closeModal } = useModal();

    if (!activeModal) return null;

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {activeModal === 'LEGAL' && <LegalModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'PREMIUM_UNLOCK' && <PremiumModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'BROADCAST' && <BroadcastModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'INSTALL_PROMPT' && <InstallModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'PAYMENT_SUCCESS' && <PaymentSuccessModal isOpen={true} onClose={closeModal} {...modalProps} />}

            {activeModal === 'NETWORK_VISUALIZER' && <NetworkVisualizerModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'GUIDE' && <DetailedGuideModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'CONTRACT_INFO' && <ContractInfoModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FUTURE_TICKET' && <FutureTicketModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'BUSINESS_PRESENTATION' && <BusinessPresentationModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'CASHBACK_DETAILED' && <CashbackDetailedModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FOCUS_MODE' && <FocusModeModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'FUEL_PITCH' && <FuelPitchModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'UNION_ECOSYSTEM' && <UnionEcosystemModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'LIGHT_SIMULATOR' && <LightSimulatorModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'DISCLAIMER' && <DisclaimerModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'TARGET_CALCULATOR' && <TargetCalculatorModal isOpen={true} onClose={closeModal} {...modalProps} />}
            {activeModal === 'GRID_MENU' && <GridMenu isOpen={true} onClose={closeModal} {...modalProps} />}
            {/* Add other modals here */}
        </Suspense>
    );
};

export default ModalManager;
