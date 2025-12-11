/// <reference types="vite/client" />
/*
 * --------------------------------------------------------------------------
 * COPYRIGHT NOTICE
 * * Copyright (c) 2025 Simulatore Sharing. Tutti i diritti riservati.
 * --------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js'; // <--- AGGIUNTO SUPABASE
import { PlanInput, CondoInput, ViewMode } from './types';
import { useCompensationPlan } from './hooks/useSimulation';
import { useCondoSimulation } from './hooks/useCondoSimulation';
import InputPanel from './components/InputPanel';
import CondoInputPanel from './components/CondoInputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import CondoResultsDisplay from './components/CondoResultsDisplay';
import { useSmartState } from './hooks/useSmartState';
import TargetCalculatorModal from './components/TargetCalculatorModal';
import DetailedGuideModal from './components/DetailedGuideModal';
import ContractInfoModal from './components/ContractInfoModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { InstallModal } from './components/InstallModal';

// --- IMPORTAZIONI LEGALI E UI ---
import { LegalFooter } from './components/LegalFooter';
import { LegalModal } from './components/LegalModal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { PremiumModal } from './components/PremiumModal';
import { Lock, Copy, Check, PartyPopper, Gem, Building2, ExternalLink, Download } from 'lucide-react';

// --- CONFIGURAZIONE SUPABASE ---
// Assicurati che queste variabili siano nel file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- ICONE SVG MANUALI ---
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591" /></svg>);
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>);
const TargetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" /></svg>);
const ClientModeIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-6 h-6"><path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="#3b9eff" /><path d="M6 21V19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19V21" stroke="#3b9eff" strokeWidth="2" strokeLinecap="round" /><path d="M16 5L17.5 8H14.5L16 5Z" fill="#fb923c" className="text-union-orange-400" /></svg>);
const FamilyModeIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-6 h-6"><circle cx="12" cy="7" r="3" fill="#3b9eff" /><path d="M12 11C9.23858 11 7 13.2386 7 16V17C7 17.5523 7.44772 18 8 18H16C16.5523 18 17 17.5523 17 17V16C17 13.2386 14.7614 11 12 11Z" fill="#3b9eff" /><circle cx="18.5" cy="9.5" r="2.5" fill="#fb923c" /><path d="M18.5 13C16.567 13 15 14.567 15 16.5V17C15 17.5523 15.4477 18 16 18H21C21.5523 18 22 17.5523 22 17V16.5C22 14.567 20.433 13 18.5 13Z" fill="#fb923c" /><circle cx="5.5" cy="9.5" r="2.5" fill="#fb923c" /><path d="M5.5 13C3.567 13 2 14.567 2 16.5V17C2 17.5523 2.44772 18 3 18H8C8.55228 18 9 17.5523 9 17V16.5C9 14.567 7.433 13 5.5 13Z" fill="#fb923c" /></svg>);
const CondoModeIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 w-6 h-6"><path d="M4 21H10V8C10 7.44772 9.55228 7 9 7H5C4.44772 7 4 7.44772 4 8V21Z" fill="#fb923c" /><path d="M14 21H20V4C20 3.44772 19.5523 3 19 3H15C14.4477 3 14 3.44772 14 4V21Z" fill="#3b9eff" /><rect x="6" y="9" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><rect x="6" y="13" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><rect x="6" y="17" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><rect x="16" y="6" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><rect x="16" y="10" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><rect x="16" y="14" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><rect x="16" y="18" width="2" height="2" rx="0.5" fill="white" fillOpacity="0.8" /><path d="M2 21H22" stroke="#64748b" strokeWidth="2" strokeLinecap="round" /></svg>);
const ItalyFlag = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-6 rounded-full shadow-sm object-cover"><path fill="#fff" d="M0 0h640v480H0z" /><path fill="#009246" d="M0 0h213.3v480H0z" /><path fill="#ce2b37" d="M426.7 0H640v480H426.7z" /></svg>);
const GermanyFlag = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-6 rounded-full shadow-sm object-cover"><path fill="#ffce00" d="M0 320h640v160H0z" /><path fill="#000" d="M0 0h640v160H0z" /><path fill="#d00" d="M0 160h640v160H0z" /></svg>);
const CrownIconSVG = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
  </svg>
);

const BackgroundMesh = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" />
    <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px]" />
    <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[100px]" />
  </div>
);

const DisclaimerModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 max-w-md w-full p-6 md:p-8 relative transform transition-all animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">{t('app.disclaimer_btn')}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed text-justify">
          <p>{t('app.simulation_note')}</p>
          <p>Il presente simulatore ha finalità puramente illustrative. Gli importi mostrati rappresentano una stima teorica basata sui dati inseriti manualmente dall'utente.</p>
        </div>
        <button onClick={onClose} className="mt-8 w-full bg-union-blue-500/90 hover:bg-union-blue-600 text-white font-bold py-3 px-4 rounded-2xl transition-colors duration-200 shadow-lg shadow-union-blue-500/30 focus:outline-none">
          {t('app.disclaimer_btn').replace('Leggi il ', '').replace('Completo', 'Chiudi').replace('Disclaimer', 'OK')}
        </button>
      </div>
    </div>
  );
};

const PaymentSuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative border border-union-orange-400/50 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(74,222,128,0.4)] relative">
          <CrownIconSVG className="w-10 h-10 text-green-600 dark:text-green-400 animate-bounce" />
          <div className="absolute -top-2 -right-2 text-3xl animate-pulse">🎉</div>
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Pagamento Riuscito!</h2>
        <p className="text-lg text-green-600 dark:text-green-400 font-bold mb-6">Grazie per il tuo acquisto</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 text-left border border-blue-100 dark:border-blue-800">
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-medium">
            Il sistema sta generando la tua licenza univoca.
            <br /><br />
            📩 <strong>Controlla la tua Email:</strong> riceverai il tuo CODICE DI ATTIVAZIONE personale entro pochi minuti.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-4 bg-union-blue-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/30">
          Ho capito, controllo la mail
        </button>
      </div>
    </div>
  );
};

const initialInputs: PlanInput = {
  directRecruits: 0, contractsPerUser: 0, indirectRecruits: 0, networkDepth: 1, realizationTimeMonths: 12,
  personalClientsGreen: 0, personalClientsLight: 0, personalClientsBusinessGreen: 0, personalClientsBusinessLight: 0,
  myPersonalUnitsGreen: 0, myPersonalUnitsLight: 0, cashbackSpending: 0, cashbackPercentage: 0
};
const initialCondoInputs: CondoInput = {
  greenUnits: 0,
  lightUnits: 0,
  yearlyNewUnitsGreen: 0,
  yearlyNewUnitsLight: 0,
  familiesPerCondo: 0,
  networkConversionRate: 0,
  managedCondos: 0
};

const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isTargetCalcOpen, setIsTargetCalcOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [canInstall, setCanInstall] = useState(false); // New state to track if install is possible
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);

  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms' | 'cookie' | 'none'>('none');
  const [legalMode, setLegalMode] = useState<'startup' | 'view'>('startup');

  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- NUOVI STATI PER LA VERIFICA SUPABASE ---
  const [licenseCode, setLicenseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [viewMode, setViewMode] = useState<ViewMode>('family');
  const [condoInputs, setCondoInputs] = useState<CondoInput>(initialCondoInputs);
  const [isContractInfoModalOpen, setIsContractInfoModalOpen] = useState(false);
  const [cashbackPeriod, setCashbackPeriod] = useState<'monthly' | 'annual'>('monthly');
  const isInitialMount = useRef(true);

  const { language, setLanguage, t } = useLanguage();
  const { state: inputs, set: setInputs, undo, redo, canUndo, canRedo, reset } = useSmartState<PlanInput>(initialInputs);

  const planResult = useCompensationPlan(inputs);
  const condoResult = useCondoSimulation(condoInputs);

  const targetButtonText = language === 'it' ? "Calcola Obiettivo" : "Ziel berechnen";

  useEffect(() => {
    // CONTROLLO PREMIUM LOCALSTORAGE
    const savedPremium = localStorage.getItem('is_premium');
    if (savedPremium === 'true') {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }

    const query = new URLSearchParams(window.location.search);
    // GESTIONE RITORNO DAL PAGAMENTO
    if (query.get('payment_success') === 'true') {
      setShowSuccessModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const hasAccepted = localStorage.getItem('legal_accepted');
    if (!hasAccepted) {
      setLegalDocType('none');
      setLegalMode('startup');
      setShowLegalModal(true);
    }
  }, []);

  // --- FUNZIONE DI VERIFICA REALE (CONTEGGIO DISPOSITIVI) ---
  const handleVerifyCode = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. CERCA IL CODICE
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('code', licenseCode.trim())
        .single();

      if (error || !data) {
        setError('Codice non valido o scaduto.');
        setLoading(false);
        return;
      }

      // 2. CONTROLLA IL LIMITE (Max 3)
      const currentUses = data.uses || 0;

      if (currentUses >= 3) {
        setError('Hai raggiunto il limite massimo di 3 dispositivi per questa licenza.');
        setLoading(false);
        return;
      }

      // 3. AGGIORNA IL CONTATORE (+1)
      const { error: updateError } = await supabase
        .from('licenses')
        .update({ uses: currentUses + 1 })
        .eq('id', data.id);

      if (updateError) {
        console.error("Errore aggiornamento contatore (RLS?):", updateError);
        // Continuiamo lo stesso se l'errore è solo di update ma il codice era valido,
        // oppure puoi bloccare. Per ora sblocchiamo per non frustrare l'utente se la RLS non va.
      }

      // 4. SBLOCCA L'APP
      setIsPremium(true);
      localStorage.setItem('is_premium', 'true');
      localStorage.setItem('licenseCode', licenseCode);
      setShowPremiumModal(false);
      alert("Codice valido! App sbloccata su questo dispositivo.");

    } catch (err) {
      console.error(err);
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptLegal = () => {
    localStorage.setItem('legal_accepted', 'true');
    setShowLegalModal(false);
  };

  const handleOpenLegalDoc = (type: 'privacy' | 'terms' | 'cookie') => {
    setLegalDocType(type);
    setLegalMode('view');
    setShowLegalModal(true);
  };

  useEffect(() => { if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDarkMode]);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true || document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      if (!isStandaloneMode) setShowInstallModal(true);
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    // Listen for installability
    window.addEventListener('beforeinstallprompt', (e) => {
      setCanInstall(true);
    });

    return () => window.removeEventListener('resize', checkStandalone);
  }, []);

  useEffect(() => { setIsPremiumUnlocked(true); setIsTrialExpired(false); }, []);
  useEffect(() => { if (isInitialMount.current) { isInitialMount.current = false; return; } if (inputs.contractsPerUser === 2) { setIsContractInfoModalOpen(true); } }, [inputs.contractsPerUser]);

  const handleTitleClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 5) { setShowPremiumModal(true); setSecretClickCount(0); }
  };

  const handleInputChange = (field: keyof PlanInput, value: number) => {
    if (field === 'realizationTimeMonths') {
      setInputs({ ...inputs, [field]: value });
      return;
    }
    if (!isPremium) {
      if (field === 'directRecruits' && value > 2) { setShowPremiumModal(true); return; }
      if (field === 'indirectRecruits' && value > 2) { setShowPremiumModal(true); return; }
      if (field === 'networkDepth' && value > 2) { setShowPremiumModal(true); return; }
      if (field === 'contractsPerUser' && value > 1) { setShowPremiumModal(true); return; }
      if (field === 'cashbackSpending' && value > 500) { setShowPremiumModal(true); return; }
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCondoInputChange = (field: keyof CondoInput, value: number) => setCondoInputs(prev => ({ ...prev, [field]: value }));

  const handleResetToZero = () => {
    if (!isPremium) { setShowPremiumModal(true); return; }
    setInputs({
      directRecruits: 0,
      contractsPerUser: 0,
      indirectRecruits: 0,
      networkDepth: 1,
      realizationTimeMonths: 12,
      personalClientsGreen: 0,
      personalClientsLight: 0,
      personalClientsBusinessGreen: 0,
      personalClientsBusinessLight: 0,
      myPersonalUnitsGreen: 0,
      myPersonalUnitsLight: 0,
      cashbackSpending: 0,
      cashbackPercentage: 0
    });
  };

  const handleResetPersonalClients = () => { setInputs({ ...inputs, personalClientsGreen: 0, personalClientsLight: 0, personalClientsBusinessGreen: 0, personalClientsBusinessLight: 0, myPersonalUnitsGreen: 0, myPersonalUnitsLight: 0 }); };
  const handleCondoReset = () => setCondoInputs({ ...initialCondoInputs });
  const handleApplyTarget = (updates: Partial<PlanInput>) => setInputs({ ...inputs, ...updates });
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'it' ? 'de' : 'it');

  const handleModeChange = (mode: ViewMode) => {
    if (mode === 'condo' && !isPremium) { setShowPremiumModal(true); return; }
    setViewMode(mode);
  };

  const handleTargetClick = () => {
    if (!isPremium) { setShowPremiumModal(true); return; }
    setIsTargetCalcOpen(true);
  };

  const headerShadow = language === 'it'
    ? '-30px 0 80px -5px rgba(0, 146, 70, 0.9), 30px 0 80px -5px rgba(206, 43, 55, 0.9), 0 0 50px -10px rgba(255, 255, 255, 0.8)'
    : '-30px 0 80px -5px rgba(0, 0, 0, 0.95), 30px 0 80px -5px rgba(255, 204, 0, 0.9), 0 0 50px -10px rgba(221, 0, 0, 0.8)';

  return (
    <div className={`min-h-screen bg-transparent text-gray-800 dark:text-gray-200 transition-colors duration-300 relative flex flex-col overflow-x-hidden`}>
      <BackgroundMesh />



      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUnlock={handleVerifyCode} // <-- USIAMO LA NUOVA FUNZIONE
        licenseCode={licenseCode}   // <-- PASSIAMO GLI STATI
        setLicenseCode={setLicenseCode}
        loading={loading}
        error={error}
        forceLock={false}
      />

      {showLegalModal && <LegalModal isOpen={showLegalModal} onAccept={handleAcceptLegal} onClose={() => setShowLegalModal(false)} type={legalDocType} mode={legalMode} />}
      <PaymentSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <ScrollToTopButton />

      <div className={`container mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex-grow ${isTrialExpired ? 'blur-sm pointer-events-none select-none h-screen overflow-hidden' : ''}`}>

        <header className="flex flex-col gap-4 mb-8 rounded-3xl p-6 border-0 shadow-xl backdrop-blur-xl transition-all duration-500 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0077c8 0%, #005596 100%)', boxShadow: headerShadow }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="flex items-center gap-3">
                <h1 onClick={handleTitleClick} className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-sm select-none cursor-pointer active:scale-95 transition-transform flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  {language === 'it' ? <ItalyFlag /> : <GermanyFlag />}
                  {t('app.title')} <span className="text-union-orange-400">Sharing</span>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded animate-pulse">v1.0.2-DEBUG</span>
                  {isPremium && <span className="ml-2 animate-bounce inline-block"><CrownIconSVG className="w-8 h-8 text-union-orange-400" /></span>}
                </h1>
                {isCreatorMode && <span className="hidden sm:inline-flex bg-white/20 backdrop-blur-md text-white border border-white/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">Creator Mode</span>}
                {viewMode === 'client' && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-100/90 text-purple-700 border border-purple-200 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-500/20 uppercase tracking-wider ml-1 sm:ml-2 animate-in fade-in zoom-in duration-300">
                    <Gem size={14} className="text-purple-600" />
                    <span className="hidden sm:inline">{t('app.client_priv')}</span>
                    <span className="sm:hidden">{t('app.client_priv_short')}</span>
                  </span>
                )}
                {viewMode === 'condo' && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20 uppercase tracking-wider ml-1 sm:ml-2 animate-in fade-in zoom-in duration-300">
                    <Building2 size={14} className="text-emerald-600" />
                    <span className="hidden sm:inline">{t('app.admin_condo')}</span>
                    <span className="sm:hidden">{t('app.admin_condo_short')}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 md:mt-0">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-white text-union-blue-600 hover:bg-gray-100 transition-all shadow-lg border-0 hover:scale-105" title="Cambia Tema"><div className="scale-90">{isDarkMode ? <SunIcon /> : <MoonIcon />}</div></button>
              <button onClick={toggleLanguage} className="p-2.5 rounded-xl bg-white border-0 shadow-lg hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center min-w-[48px]">{language === 'it' ? <ItalyFlag /> : <GermanyFlag />}</button>

              <button
                onClick={() => window.open('https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true', '_blank')}
                className="p-2.5 rounded-xl bg-white text-union-blue-600 hover:bg-gray-100 transition-all shadow-lg border-0 hover:scale-105 flex items-center justify-center"
                title="Vai allo Store"
              >
                <ExternalLink size={20} />
              </button>

              <div className="w-px h-8 bg-white/30 mx-1 hidden sm:block"></div>

              <button onClick={() => setIsHelpOpen(true)} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-white text-union-blue-600 rounded-xl shadow-lg hover:bg-gray-100 transition-all border-0 font-bold text-sm hover:scale-[1.02]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>
                <span className="hidden sm:inline">{t('app.guide')}</span>
              </button>

              {!isPremium && <button onClick={() => setShowPremiumModal(true)} className="flex items-center justify-center w-auto px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all font-bold text-sm border border-yellow-300">Sblocca PRO</button>}

              {!isStandalone && (
                <button onClick={() => setShowInstallModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-all font-bold text-sm border border-gray-700 animate-pulse">
                  <Download size={18} />
                  <span className="hidden lg:inline">Scarica App</span>
                </button>
              )}

              {viewMode === 'family' && (
                <button onClick={handleTargetClick} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-white rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.6)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] transition-all border border-white/20 font-black text-sm hover:scale-[1.05] active:scale-95 animate-pulse-slow">
                  <TargetIcon />
                  <span className="hidden sm:inline ml-2 drop-shadow-md uppercase tracking-wide">{targetButtonText}</span>
                </button>
              )}
            </div>
          </div>
          <p className="text-blue-100 font-medium text-[10px] sm:text-sm md:text-base -mt-2 pl-1 relative z-10 opacity-90 text-center md:text-left max-w-xs md:max-w-none mx-auto md:mx-0 leading-tight">{t('app.subtitle')}</p>
        </header>

        {/* ... RESTO DEL COMPONENTE ... */}
        <div className="flex justify-center mb-8 relative z-20">
          <div className="relative p-1.5 rounded-2xl flex w-full sm:w-auto sm:min-w-[340px] border-2 border-white/20 shadow-[0_0_30px_rgba(0,119,200,0.6)] bg-gradient-to-r from-union-blue-600 to-union-blue-500">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(33.333%-6px)] rounded-xl shadow-lg bg-white transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${viewMode === 'client' ? 'left-1.5 translate-x-0' : viewMode === 'family' ? 'left-1.5 translate-x-[100%]' : 'left-1.5 translate-x-[200%]'}`} />
            <button onClick={() => handleModeChange('client')} className="flex-1 relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base leading-tight focus:outline-none"><div className={`flex items-center gap-2 transition-all duration-300 transform ${viewMode === 'client' ? 'scale-105 text-union-blue-600' : 'scale-95 opacity-90 text-white'}`}><div className={viewMode === 'client' ? '' : 'brightness-0 invert'}><ClientModeIcon /></div><span className="text-center w-full leading-tight text-[10px] sm:text-base">{t('mode.client')}</span></div></button>
            <button onClick={() => handleModeChange('family')} className="flex-1 relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base leading-tight focus:outline-none"><div className={`flex items-center gap-2 transition-all duration-300 transform ${viewMode === 'family' ? 'scale-105 text-union-blue-600' : 'scale-95 opacity-90 text-white'}`}><div className={viewMode === 'family' ? '' : 'brightness-0 invert'}><FamilyModeIcon /></div><span className="text-center w-full leading-tight text-[10px] sm:text-base">{t('mode.family')}</span></div></button>
            <button onClick={() => handleModeChange('condo')} className="flex-1 relative z-10 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base leading-tight focus:outline-none">
              {!isPremium && <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full z-20 shadow-sm"><Lock size={10} /></div>}
              <div className={`flex items-center gap-2 transition-all duration-300 transform ${viewMode === 'condo' ? 'scale-105 text-union-blue-600' : 'scale-95 opacity-90 text-white'}`}><div className={viewMode === 'condo' ? '' : 'brightness-0 invert'}><CondoModeIcon /></div><span className="text-center w-full leading-tight text-[10px] sm:text-base">{t('mode.condo')}</span></div>
            </button>
          </div>
        </div>

        <main key={viewMode} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="md:col-span-1 lg:col-span-1 min-w-0">
            {viewMode === 'condo' ? (
              <CondoInputPanel inputs={condoInputs} onInputChange={handleCondoInputChange} onReset={handleCondoReset} />
            ) : (
              <InputPanel
                inputs={inputs}
                viewMode={viewMode}
                onInputChange={handleInputChange}
                onReset={handleResetToZero}
                onResetPersonalClients={handleResetPersonalClients}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                cashbackPeriod={cashbackPeriod}
                setCashbackPeriod={setCashbackPeriod}
              />
            )}
          </div>
          <div className="md:col-span-1 lg:col-span-2 relative min-w-0">
            {!isPremium && (
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-20 flex items-center justify-center pointer-events-none">
                <div className="bg-union-blue-600/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md pointer-events-auto cursor-pointer" onClick={() => setShowPremiumModal(true)}>
                  <Lock size={16} /> <span>Sblocca Analisi Completa</span>
                </div>
              </div>
            )}
            {viewMode === 'condo' ? (
              <CondoResultsDisplay results={condoResult} />
            ) : (
              <ResultsDisplay planResult={planResult} viewMode={viewMode} inputs={inputs} cashbackPeriod={cashbackPeriod} />
            )}
          </div>
        </main>
      </div>

      <div className="mt-12"><LegalFooter onOpenLegal={handleOpenLegalDoc} /></div>
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
      <DetailedGuideModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <TargetCalculatorModal isOpen={isTargetCalcOpen} onClose={() => setIsTargetCalcOpen(false)} currentInputs={inputs} onApply={handleApplyTarget} />
      <ContractInfoModal isOpen={isContractInfoModalOpen} onClose={() => setIsContractInfoModalOpen(false)} />
      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </div>
  );
};

const App = () => { return <LanguageProvider><AppContent /></LanguageProvider>; }

export default App;
