/// <reference types="vite/client" />
/*
 * --------------------------------------------------------------------------
 * COPYRIGHT NOTICE
 * * Copyright (c) 2025 Simulatore Sharing. Tutti i diritti riservati.
 * --------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef } from 'react';
import { supabase, supabaseUrl } from './utils/supabaseClient';
import { PlanInput, CondoInput, ViewMode } from './types';
import { useCompensationPlan } from './hooks/useSimulation';
import { useCondoSimulation } from './hooks/useCondoSimulation';
import InputPanel from './components/InputPanel';
import CondoInputPanel from './components/CondoInputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import CondoResultsDisplay from './components/CondoResultsDisplay';
import { useSmartState } from './hooks/useSmartState';




import { LanguageProvider, useLanguage } from './contexts/LanguageContext';








import { Presentation, Fuel, Share2, Compass, Sparkles } from 'lucide-react'; // NEW ICON Import

// --- IMPORTAZIONI LEGALI E UI ---
import { LegalFooter } from './components/LegalFooter';

import { ScrollToTopButton } from './components/ScrollToTopButton';

import { InAppBrowserOverlay } from './components/InAppBrowserOverlay';
import { Lock, Copy, Check, PartyPopper, Gem, Building2, ExternalLink, Download, Users, Hand } from 'lucide-react';

import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import TargetIcon from './components/icons/TargetIcon';
import { ClientModeIcon, FamilyModeIcon, CondoModeIcon } from './components/icons/ModeIcons';
import { ItalyFlag, GermanyFlag, UKFlag } from './components/icons/Flags';
import CrownIconSVG from './components/icons/CrownIcon';

import BackgroundMesh from './components/BackgroundMesh';


import HeaderMenu from './components/HeaderMenu';
import { DesktopHeaderNav } from './components/DesktopHeaderNav'; // Import Navigation
import BottomDock from './components/BottomDock'; // NEW IMPORT // NEW IMPORT

import { ModalProvider, useModalDispatch } from './contexts/ModalContext';
import ModalManager from './components/ModalManager';

// --- SHARY ASSISTANT IMPORTS ---
import { SharyProvider, useShary } from './contexts/SharyContext';
import SharyAssistant from './components/SharyAssistant';
import SharyTrigger from './components/SharyTrigger';

const initialInputs: PlanInput = {
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
  cashbackPercentage: 0,
  unionParkPanels: 0,
  electricityPrice: 0,
  electricityConsumption: 0,
  electricityFixed: 0,
  gasPrice: 0,
  gasConsumption: 0,
  gasFixed: 0,
  bonus3x3Active: false
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
  const { openModal, closeModal } = useModalDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const [canInstall, setCanInstall] = useState(false); // New state to track if install is possible
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);


  const [mobileTab, setMobileTab] = useState<'input' | 'results'>('input'); // NEW STATE FOR MOBILE SWIPE

  // --- DASHBOARD TUTORIAL STATE ---
  const [showDashboardTutorial, setShowDashboardTutorial] = useState(false);

  // --- BROADCAST MODAL STATE ---


  useEffect(() => {
    // Check dashboard tutorial
    const hasSeenTutorial = localStorage.getItem('hasSeenDashboardSwipeTutorial');
    if (!hasSeenTutorial && window.innerWidth < 768) {
      setTimeout(() => {
        setShowDashboardTutorial(true);
        setTimeout(() => {
          setShowDashboardTutorial(false);
          localStorage.setItem('hasSeenDashboardSwipeTutorial', 'true');
        }, 4000);
      }, 1000);
    }

    // Check broadcast modal (give it a bit of delay so it doesn't clash with other startups)
    const hasSeenBroadcast = localStorage.getItem('hasSeenBroadcastModal');
    if (!hasSeenBroadcast) {
      setTimeout(() => {
        openModal('BROADCAST');
      }, 2000); // 2 seconds delay
    }
  }, []);

  // --- NUOVI STATI PER LA VERIFICA SUPABASE ---
  const [licenseCode, setLicenseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { state: viewMode, set: setViewMode } = useSmartState<ViewMode>('family', 'sim_view_mode_v1');
  const { state: condoInputs, set: setCondoInputs } = useSmartState<CondoInput>(initialCondoInputs, 'condo_sim_state_v1');
  const [isContractInfoModalOpen, setIsContractInfoModalOpen] = useState(false);
  const [cashbackPeriod, setCashbackPeriod] = useState<'monthly' | 'annual'>('monthly');
  const isInitialMount = useRef(true);
  const installTimerRef = useRef<any>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null); // State for the prompt event

  const { language, setLanguage, t } = useLanguage();
  const { state: inputs, set: setInputs, undo, redo, canUndo, canRedo, reset } = useSmartState<PlanInput>(initialInputs, 'sim_state_v1');

  const planResult = useCompensationPlan(inputs, viewMode);
  const condoResult = useCondoSimulation(condoInputs, planResult);

  // --- SHARY HOOK ---
  const { isActive, toggleShary } = useShary();

  const targetButtonText = language === 'it' ? "Calcola Obiettivo" : (language === 'de' ? "Ziel berechnen" : "Calculate Goal");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    // GESTIONE RITORNO DAL PAGAMENTO
    if (query.get('payment_success') === 'true') {
      openModal('PAYMENT_SUCCESS');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const hasAccepted = localStorage.getItem('legal_accepted');
    if (!hasAccepted) {
      openModal('LEGAL', { type: 'none', mode: 'startup', onAccept: handleAcceptLegal });
    }
  }, []);

  // --- FUNZIONE DI VERIFICA REALE (CONTEGGIO DISPOSITIVI) ---
  const verifyLicenseStatus = async (inputCode: string, shouldIncrement: boolean = false) => {
    // Check for missing configuration (placeholder URL)
    if (supabaseUrl.includes('placeholder.supabase.co')) {
      return {
        valid: false,
        error: "Configurazione mancante: Le variabili d'ambiente non sono state caricate. Verifica Netlify.",
        isNetworkError: false
      };
    }

    // Rimuove spazi e caratteri invisibili
    let cleanCode = inputCode.replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').toUpperCase();

    try {
      // 1. TENTA RICERCA NORMALE
      let { data: licenses, error: dbError } = await supabase
        .from('licenses')
        .select('*')
        .ilike('code', cleanCode);

      // 2. SE FALLISCE, PROVA A RIMUOVERE I TRATTINI (es. AAAA-BBBB -> AAAABBBB)
      if ((!licenses || licenses.length === 0) && cleanCode.includes('-')) {
        const noDashes = cleanCode.replace(/-/g, '');
        const { data: retryData, error: retryError } = await supabase
          .from('licenses')
          .select('*')
          .ilike('code', noDashes);

        if (retryData && retryData.length > 0) {
          licenses = retryData;
          cleanCode = noDashes;
          dbError = null; // Reset error since retry succeeded
        } else if (retryError) {
          dbError = retryError;
        }
      }

      // 3. SE FALLISCE E MANCANO I TRATTINI (LUNGHEZZA 12), PROVA A FORMATTARE (es. AAAABBBBCCCC -> AAAA-BBBB-CCCC)
      if ((!licenses || licenses.length === 0) && !cleanCode.includes('-') && cleanCode.length === 12) {
        const formatted = `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}-${cleanCode.slice(8, 12)}`;
        const { data: retryData2, error: retryError2 } = await supabase
          .from('licenses')
          .select('*')
          .ilike('code', formatted);

        if (retryData2 && retryData2.length > 0) {
          licenses = retryData2;
          cleanCode = formatted;
          dbError = null; // Reset error since retry succeeded
        } else if (retryError2) {
          dbError = retryError2;
        }
      }

      if (dbError) {
        // Se è un errore di rete/connessione (non trovato o timeout)
        const isConnectionError = dbError.message?.toLowerCase().includes('fetch') ||
          dbError.message?.toLowerCase().includes('network') ||
          dbError.code === 'PGRST301'; // Ad esempio

        const friendlyError = isConnectionError
          ? "Impossibile contattare il server. Controlla la tua connessione internet."
          : `Errore Database: ${dbError.message}`;

        return { valid: false, error: friendlyError, isNetworkError: isConnectionError };
      }

      if (!licenses || licenses.length === 0) {
        return { valid: false, error: `Il codice "${cleanCode}" non esiste a sistema.`, isNetworkError: false };
      }

      const data = licenses[0];
      const currentUses = data.uses || 0;
      const maxUses = data.max_uses || 3;

      if (shouldIncrement && currentUses >= maxUses) {
        return { valid: false, error: `Hai raggiunto il limite massimo di ${maxUses} dispositivi per questa licenza.`, isNetworkError: false };
      }

      if (!shouldIncrement && currentUses > maxUses) {
        return { valid: false, error: 'Limite dispositivi superato.', isNetworkError: false };
      }

      if (shouldIncrement) {
        const { error: updateError } = await supabase
          .from('licenses')
          .update({ uses: currentUses + 1 })
          .eq('id', data.id);

        if (updateError) console.error("Errore aggiornamento contatore:", updateError);
      }

      return { valid: true, data, finalCode: cleanCode };
    } catch (err: any) {
      console.error("Errore critico verifica:", err);
      return { valid: false, error: 'Errore di connessione. Riprova.', isNetworkError: true };
    }
  };

  const handleVerifyCode = async () => {
    if (!licenseCode.trim()) return;
    setLoading(true);
    setError('');

    const result = await verifyLicenseStatus(licenseCode, true);

    if (result.valid) {
      setIsPremium(true);
      localStorage.setItem('is_premium', 'true');
      localStorage.setItem('licenseCode', result.finalCode || licenseCode.trim().toUpperCase());
      openModal('PREMIUM_UNLOCK', {
        isOpen: true,
        onClose: closeModal,
        onUnlock: handleVerifyCode,
        licenseCode: licenseCode,
        setLicenseCode: setLicenseCode,
        loading: loading,
        error: error,
        forceLock: false
      });
      alert("Codice valido! App sbloccata su questo dispositivo.");
    } else {
      setError(result.error || 'Errore durante la verifica.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const initLicense = async () => {
      const savedCode = localStorage.getItem('licenseCode');
      const savedPremiumStatus = localStorage.getItem('is_premium');

      // Imposta immediatamente lo stato se salvato localmente per evitare flash della UI
      if (savedPremiumStatus === 'true') {
        setIsPremium(true);
      }

      if (savedCode) {
        setLicenseCode(savedCode);

        // Verifica silenziosa per confermare che la licenza sia ancora valida nel DB
        const result = await verifyLicenseStatus(savedCode, false);
        if (result.valid) {
          setIsPremium(true);
          localStorage.setItem('is_premium', 'true');
        } else if (savedPremiumStatus === 'true' && !result.isNetworkError) {
          // Se la verifica fallisce ESPLICITAMENTE (es. codice revocato), rimuoviamo i privilegi.
          // In caso di errore di rete, manteniamo lo stato premium locale per permettere l'uso offline.
          setIsPremium(false);
          localStorage.removeItem('is_premium');
        }
      }
    };
    initLicense();
  }, []);

  const handleAcceptLegal = () => {
    localStorage.setItem('legal_accepted', 'true');
    closeModal();
  };

  const handleOpenLegalDoc = (type: 'privacy' | 'terms' | 'cookie') => {
    openModal('LEGAL', { type, mode: 'view' });
  };

  useEffect(() => { if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDarkMode]);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true || document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      // Removed automatic setShowInstallModal from here to avoid showing it prematurely/incorrectly
    };
    checkStandalone();
    window.addEventListener('resize', checkStandalone);

    // Logic to show install modal
    const handleInstallCheck = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      if (isStandaloneMode) return;

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIos = /iphone|ipad|ipod/.test(userAgent);

      // If iOS, show it (manual instructions)
      if (isIos) {
        // Small delay to let user see app first
        installTimerRef.current = setTimeout(() => {
          openModal('INSTALL_PROMPT', { installPrompt: null });
        }, 5000);
      } else {
        // For Android/Desktop: Check if we have the prompt
        // @ts-ignore
        if (window.deferredPrompt) {
          setCanInstall(true);
          // @ts-ignore
          setInstallPrompt(window.deferredPrompt); // Sync state
          installTimerRef.current = setTimeout(() => {
            // @ts-ignore
            openModal('INSTALL_PROMPT', { installPrompt: window.deferredPrompt });
          }, 5000);
        }
      }
    };

    // Check on mount (for iOS mainly) or if prompt was already captured
    handleInstallCheck();

    // Listen for dynamic event (Android/Desktop)
    const installHandler = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
      setInstallPrompt(e); // Sync state
      // @ts-ignore
      window.deferredPrompt = e;

      // Clear previous timer if exists to restart or just ensure single trigger
      if (installTimerRef.current) clearTimeout(installTimerRef.current);

      installTimerRef.current = setTimeout(() => {
        openModal('INSTALL_PROMPT', { installPrompt: e });
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', installHandler);

    return () => {
      window.removeEventListener('resize', checkStandalone);
      window.removeEventListener('beforeinstallprompt', installHandler);
      if (installTimerRef.current) clearTimeout(installTimerRef.current);
    };
  }, []);

  useEffect(() => { setIsTrialExpired(false); }, []);
  useEffect(() => { if (isInitialMount.current) { isInitialMount.current = false; return; } if (inputs.contractsPerUser === 2) { openModal('CONTRACT_INFO'); } }, [inputs.contractsPerUser]);

  const handleTitleClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 5) {
      openModal('PREMIUM_UNLOCK', {
        isOpen: true,
        onClose: closeModal,
        onUnlock: handleVerifyCode,
        licenseCode: licenseCode,
        setLicenseCode: setLicenseCode,
        loading: loading,
        error: error,
        forceLock: false
      });
      setSecretClickCount(0);
    }
  };

  const handleInputChange = (field: keyof PlanInput, value: number | any) => {
    if (field === 'realizationTimeMonths') {
      setInputs({ ...inputs, [field]: value });
      return;
    }
    if (field === 'cashbackDetails') {
      setInputs(prev => ({ ...prev, cashbackDetails: value }));
      return;
    }
    if (!isPremium) {
      if (field === 'directRecruits' && value > 2) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
      if (field === 'indirectRecruits' && value > 2) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
      if (field === 'networkDepth' && value > 2) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
      if (field === 'contractsPerUser' && value > 1) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
      if (field === 'cashbackSpending' && value > 500) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
    }
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCondoInputChange = (field: keyof CondoInput, value: number) => setCondoInputs(prev => ({ ...prev, [field]: value }));

  const handleResetToZero = () => {
    if (!isPremium) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
    setInputs(initialInputs);
  };

  const handleResetPersonalClients = () => { setInputs({ ...inputs, personalClientsGreen: 0, personalClientsLight: 0, personalClientsBusinessGreen: 0, personalClientsBusinessLight: 0, myPersonalUnitsGreen: 0, myPersonalUnitsLight: 0, unionParkPanels: 0 }); };
  const handleCondoReset = () => setCondoInputs({ ...initialCondoInputs });
  const handleApplyTarget = (updates: Partial<PlanInput>) => setInputs({ ...inputs, ...updates });
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => {
    if (language === 'it') setLanguage('de');
    else if (language === 'de') setLanguage('en');
    else setLanguage('it');
  };

  const handleModeChange = (mode: ViewMode) => {
    if (mode === 'condo' && !isPremium) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
    setViewMode(mode);
  };

  const handleCashbackDetailedConfirm = (spend: number, cashback: number, details: any[]) => {
    // Calculate the effective percentage to ensure derived calculations are correct
    // If spend is 0 but we have fixed cashback, we set spend = cashback and percentage = 100
    let finalSpend = spend;
    let finalPercentage = spend > 0 ? (cashback / spend) * 100 : 0;

    if (spend === 0 && cashback > 0) {
      finalSpend = cashback;
      finalPercentage = 100;
    }

    handleInputChange('cashbackSpending', finalSpend);
    handleInputChange('cashbackPercentage', finalPercentage);
    // Use type assertion if needed as cashbackDetails might not be in PlanInput definition yet strictly
    // but based on usage it seems it is.
    handleInputChange('cashbackDetails' as any, details);
    closeModal();
  };

  const handleTargetClick = () => {
    if (!isPremium) { openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error }); return; }
    openModal('TARGET_CALCULATOR', { currentInputs: inputs, onApply: handleApplyTarget });
  };

  const [isResultsFullScreen, setIsResultsFullScreen] = useState(false);
  const [returnToPresentationPage, setReturnToPresentationPage] = useState<number | null>(null); // CHANGED STATE

  // --- FUNZIONE PER GESTIRE IL FULL SCREEN DEI RISULTATI ---
  const handleToggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsResultsFullScreen(true);
      } catch (e) {
        console.error("Fullscreen error:", e);
        setIsResultsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsResultsFullScreen(false);

      // SE ERAVAMO ARRIVATI DALLA PRESENTAZIONE, LA RIAPRIAMO
      if (returnToPresentationPage !== null) {
        openModal('BUSINESS_PRESENTATION', {
          onOpenCashback: () => openModal('CASHBACK_DETAILED', { initialDetails: (inputs as any).cashbackDetails, onConfirm: handleCashbackDetailedConfirm }),
          onOpenFocus: handleOpenFocusFromPresentation,
          initialPage: returnToPresentationPage || 1
        });
        // NON resettiamo subito a null qui perché serve passarlo come prop
        // Lo faremo quando la modale si chiude o quando si riapre (managed by props update)
        // Ma per il flusso attuale, resettiamo SOLO se la modale è gestita per "dimenticare" dopo l'apertura
        // In questo caso, `initialPage` userà il valore corrente.
        // Possiamo resettare dopo un tick o lasciarlo persistente finché non si chiude la modale?
        // Meglio resettare quando la modale viene chiusa esplicitamente dall'utente, ma App non lo sa facilmente.
        // Resettiamo a null qui? NO, altrimenti initialPage torna default.
        // Possiamo resettarlo quando si apre focus di nuovo?
        // Facciamo così: lo lasciamo settato, tanto viene usato solo se isPresentationOpen diventa true.
      }
    }
  };

  const handleOpenFocusFromPresentation = (page: number) => {
    setReturnToPresentationPage(page); // SALVIAMO LA PAGINA
    closeModal();
    handleToggleFullScreen(); // APRIAMO IL NETWORK FOCUS (FULL SCREEN)
  };

  const headerShadow = language === 'it'
    ? '-30px 0 80px -5px rgba(0, 146, 70, 0.9), 30px 0 80px -5px rgba(206, 43, 55, 0.9), 0 0 50px -10px rgba(255, 255, 255, 0.8)'
    : (language === 'de'
      ? '-30px 0 80px -5px rgba(0, 0, 0, 0.95), 30px 0 80px -5px rgba(255, 204, 0, 0.9), 0 0 50px -10px rgba(221, 0, 0, 0.8)'
      : '-30px 0 80px -5px rgba(1, 33, 105, 0.9), 30px 0 80px -5px rgba(200, 16, 46, 0.9), 0 0 50px -10px rgba(255, 255, 255, 0.8)');

  return (
    <div className={`min-h-screen bg-transparent text-gray-800 dark:text-gray-200 transition-colors duration-300 relative flex flex-col overflow-x-hidden`}>
      <BackgroundMesh />

      {/* SHARY UI */}
      <SharyAssistant />



      {/* Indicatore Versione per Diagnostica Cache */}
      <div className="fixed top-2 right-2 z-[9999] pointer-events-none opacity-50 text-[10px] font-mono bg-black/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
        v1.1.97
      </div>





      <InAppBrowserOverlay />


      <ScrollToTopButton />

      <div className={`container mx-auto p-4 sm:p-6 lg:p-8 pb-32 relative z-10 flex-grow ${isTrialExpired ? 'blur-sm pointer-events-none select-none h-screen overflow-hidden' : ''}`}>

        {/* Custom Styles Injection */}


        <header className="flex flex-col gap-4 mb-4 sm:mb-8 rounded-3xl p-6 border-0 shadow-xl backdrop-blur-xl transition-all duration-500 relative z-50" style={{ background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)', boxShadow: headerShadow }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="w-full md:w-auto flex justify-center md:justify-start">
              <div className="flex items-center gap-3">
                <h1 onClick={handleTitleClick} className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-sm select-none cursor-pointer active:scale-95 transition-transform flex items-center gap-3 flex-wrap justify-center md:justify-start">
                  {language === 'it' ? <ItalyFlag /> : (language === 'de' ? <GermanyFlag /> : <UKFlag />)}
                  <span className="text-white">Sharing</span>
                  <span className="text-[10px] font-bold opacity-30 tracking-[0.2em] ml-2">v1.1.97</span>
                  <span className="text-union-orange-400">Simulator</span>
                  {isPremium && <span className="ml-2 animate-bounce inline-block"><CrownIconSVG className="w-8 h-8 text-union-orange-400" /></span>}
                </h1>
                {isCreatorMode && <span className="hidden sm:inline-flex bg-white/20 backdrop-blur-md text-white border border-white/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">Creator Mode</span>}
                {/* Logo removed as per user request */}
              </div>
            </div>


            {/* DESKTOP NAVIGATION */}
            <DesktopHeaderNav
              viewMode={viewMode}
              handleModeChange={handleModeChange}
              onOpenLightSimulator={() => openModal('LIGHT_SIMULATOR')}
              isPremium={isPremium}
            />

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2 md:mt-0">
              {/* BUTTONS ROW - REORGANIZED */}

              {/* 1. THEME TOGGLE */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white text-union-blue-600 hover:bg-gray-100 transition-all shadow-lg border-0 hover:scale-105"
                title="Cambia Tema"
              >
                <div className="scale-90">{isDarkMode ? <SunIcon /> : <MoonIcon />}</div>
              </button>

              {/* 2. LANGUAGE TOGGLE */}
              <button
                onClick={toggleLanguage}
                className="p-2.5 rounded-xl bg-white border-0 shadow-lg hover:bg-gray-100 transition-all hover:scale-105 flex items-center justify-center min-w-[48px]"
                title="Cambia Lingua"
              >
                {language === 'it' ? <ItalyFlag /> : (language === 'de' ? <GermanyFlag /> : <UKFlag />)}
              </button>

              {/* 3. CASHBACK BUTTON (PRIORITY) */}
              <button
                onClick={() => openModal('CASHBACK_DETAILED', { initialDetails: (inputs as any).cashbackDetails, onConfirm: handleCashbackDetailedConfirm })}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all border-0 font-bold text-sm hover:scale-[1.05] animate-pulse-slow"
                title="Configura Cashback"
              >
                <div className="p-0.5 bg-white/20 rounded-md">
                  <Users size={16} className="text-white" />
                </div>
                <span className="hidden sm:inline">Cashback</span>
              </button>

              <div className="w-px h-8 bg-white/30 mx-1 hidden sm:block"></div>

              {/* 4. MENU (SECONDARY ITEMS) */}
              <HeaderMenu
                onOpenPresentation={() => openModal('BUSINESS_PRESENTATION', {
                  onOpenCashback: () => openModal('CASHBACK_DETAILED', { initialDetails: (inputs as any).cashbackDetails, onConfirm: handleCashbackDetailedConfirm }),
                  onOpenFocus: handleOpenFocusFromPresentation,
                  initialPage: returnToPresentationPage || 1
                })}
                onOpenUnionEcosystem={() => openModal('UNION_ECOSYSTEM')}
                onOpenFuelPitch={() => openModal('FUEL_PITCH')}
                onOpenFocusMode={() => openModal('FOCUS_MODE')}
                toggleShary={toggleShary}
                isSharyActive={isActive}
                onOpenTarget={handleTargetClick}
                onOpenFutureTicket={() => openModal('FUTURE_TICKET', {
                  monthlyRecurring: planResult?.monthlyData?.length > 0 ? planResult.monthlyData[planResult.monthlyData.length - 1].monthlyRecurring : 0,
                  estimatedMonths: inputs.realizationTimeMonths,
                  userName: isPremium ? "Partner Pro" : "Guest"
                })}
                onOpenGuide={() => openModal('GUIDE')}
                onOpenInstall={() => openModal('INSTALL_PROMPT', { installPrompt })}
                isPremium={isPremium}
                viewMode={viewMode}
                showInstall={!isStandalone && (canInstall || /iphone|ipad|ipod|android/i.test(window.navigator.userAgent.toLowerCase()))}
              />
            </div>
          </div>
          <p className="text-blue-100 font-medium text-[10px] sm:text-sm md:text-base -mt-2 pl-1 relative z-10 opacity-90 text-center md:text-left max-w-xs md:max-w-none mx-auto md:mx-0 leading-tight">{t('app.subtitle')}</p>
        </header>

        {/* MOBILE SWIPE NAVIGATION TABS */}
        <div
          className="md:hidden flex justify-center mb-6 p-1.5 rounded-2xl mx-auto max-w-[92%] border-2 border-white/60 shadow-2xl relative z-30 bg-white/60 backdrop-blur-3xl"
        >
          <button
            onClick={() => setMobileTab('input')}
            className={`flex-1 py-3.5 text-base font-black rounded-xl transition-all duration-300 ${mobileTab === 'input'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-200/50 scale-[1.02] border border-white/30'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            {t('nav_mobile.input')}
          </button>
          <button
            onClick={() => setMobileTab('results')}
            className={`flex-1 py-3.5 text-base font-black rounded-xl transition-all duration-300 ${mobileTab === 'results'
              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-200/50 scale-[1.02] border border-white/30'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            {t('nav_mobile.results')}
          </button>
        </div>

        <main key={viewMode} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* MOBILE VIEW IS HANDLED VIA SWIPE/TABS */}
          {/* DESKTOP VIEW IS STANDARD GRID */}

          {/* INPUT PANEL - Visible on Desktop OR if mobileTab is 'input' */}
          <div className={`${mobileTab === 'results' ? 'hidden md:block' : 'block'} md:col-span-1 lg:col-span-1 min-w-0`}>
            {/* SWIPE HANDLER FOR MOBILE INPUT */}
            <div
              className="md:hidden h-full touch-pan-y"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                // @ts-ignore
                window.touchStartX = touch.clientX;
                // @ts-ignore
                window.touchStartY = touch.clientY;
                // @ts-ignore
                window.touchStartTime = Date.now();
              }}
              onTouchEnd={(e) => {
                // @ts-ignore
                const touchEndX = e.changedTouches[0].clientX;
                // @ts-ignore
                const touchEndY = e.changedTouches[0].clientY;
                // @ts-ignore
                const diffX = window.touchStartX - touchEndX;
                // @ts-ignore
                const diffY = window.touchStartY - touchEndY;
                // @ts-ignore
                const duration = Date.now() - window.touchStartTime;

                // Solo swipe orizzontali veloci (flick) - ignoriamo scroll lenti o verticali
                if (Math.abs(diffX) > Math.abs(diffY) && duration < 250 && diffX > 100) {
                  setMobileTab('results');
                }
              }}
            >
              {viewMode === 'condo' ? (
                <CondoInputPanel inputs={condoInputs} onInputChange={handleCondoInputChange} onReset={handleCondoReset} results={condoResult} />
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
                  planResult={planResult}
                  onOpenCashbackDetailed={() => openModal('CASHBACK_DETAILED', { initialDetails: (inputs as any).cashbackDetails, onConfirm: handleCashbackDetailedConfirm })}
                />
              )}
            </div>

            {/* DESKTOP RENDER (No swipe handlers needed) */}
            <div className="hidden md:block h-full">
              {viewMode === 'condo' ? (
                <CondoInputPanel inputs={condoInputs} onInputChange={handleCondoInputChange} onReset={handleCondoReset} results={condoResult} />
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
                  planResult={planResult}
                  onOpenCashbackDetailed={() => openModal('CASHBACK_DETAILED', { initialDetails: (inputs as any).cashbackDetails, onConfirm: handleCashbackDetailedConfirm })} // FIXED
                />
              )}
            </div>
          </div>

          {/* RESULTS DISPLAY - Visible on Desktop OR if mobileTab is 'results' */}
          <div className={`${mobileTab === 'input' ? 'hidden md:block' : 'block'} md:col-span-1 lg:col-span-2 relative min-w-0`}>
            {/* SWIPE HANDLER FOR MOBILE RESULTS */}
            <div
              className="md:hidden h-full touch-pan-y"
              onTouchStart={(e) => {
                const touch = e.touches[0];
                // @ts-ignore
                window.touchStartX = touch.clientX;
                // @ts-ignore
                window.touchStartY = touch.clientY;
                // @ts-ignore
                window.touchStartTime = Date.now();
              }}
              onTouchEnd={(e) => {
                // @ts-ignore
                const touchEndX = e.changedTouches[0].clientX;
                // @ts-ignore
                const touchEndY = e.changedTouches[0].clientY;
                // @ts-ignore
                const diffX = window.touchStartX - touchEndX;
                // @ts-ignore
                const diffY = window.touchStartY - touchEndY;
                // @ts-ignore
                const duration = Date.now() - window.touchStartTime;

                // Solo swipe orizzontali veloci (flick) - ignoriamo scroll lenti o verticali
                if (Math.abs(diffX) > Math.abs(diffY) && duration < 250 && diffX < -100) {
                  setMobileTab('input');
                }
              }}
            >
              {!isPremium && (
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-20 flex items-center justify-center pointer-events-none">
                  <div className="bg-union-blue-600/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md pointer-events-auto cursor-pointer" onClick={() => openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error })}>
                    <Lock size={16} /> <span>Sblocca Analisi Completa</span>
                  </div>
                </div>
              )}
              {viewMode === 'condo' ? (
                <CondoResultsDisplay results={condoResult} />
              ) : (
                <ResultsDisplay
                  planResult={planResult}
                  viewMode={viewMode}
                  inputs={inputs}
                  cashbackPeriod={cashbackPeriod}
                  onInputChange={handleInputChange}
                  isFullScreen={isResultsFullScreen}
                  onToggleFullScreen={handleToggleFullScreen}
                />
              )}
            </div>

            {/* DESKTOP RENDER */}
            <div className="hidden md:block h-full relative">
              {!isPremium && (
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-20 flex items-center justify-center pointer-events-none">
                  <div className="bg-union-blue-600/90 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-md pointer-events-auto cursor-pointer" onClick={() => openModal('PREMIUM_UNLOCK', { isOpen: true, onClose: closeModal, onUnlock: handleVerifyCode, licenseCode, setLicenseCode, loading, error })}>
                    <Lock size={16} /> <span>Sblocca Analisi Completa</span>
                  </div>
                </div>
              )}
              {viewMode === 'condo' ? (
                <CondoResultsDisplay results={condoResult} />
              ) : (
                <ResultsDisplay
                  planResult={planResult}
                  viewMode={viewMode}
                  inputs={inputs}
                  cashbackPeriod={cashbackPeriod}
                  onInputChange={handleInputChange}
                  isFullScreen={isResultsFullScreen}
                  onToggleFullScreen={handleToggleFullScreen}
                />
              )}
            </div>
          </div>
        </main>
      </div >

      <div className="mt-12"><LegalFooter onOpenLegal={handleOpenLegalDoc} /></div>














      <BottomDock
        viewMode={viewMode}
        handleModeChange={handleModeChange}
        onOpenLightSimulator={() => openModal('LIGHT_SIMULATOR')}
        isPremium={isPremium}
      />
    </div >
  );
};


const App = () => {
  return (
    <LanguageProvider>
      <SharyProvider>
        <ModalProvider>
          <AppContent />
          <ModalManager />
        </ModalProvider>
      </SharyProvider>
    </LanguageProvider>
  );
}

export default App;
