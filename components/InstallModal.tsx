import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

interface InstallModalProps {
    isOpen: boolean;
    onClose: () => void;
    installPrompt?: any; // New prop
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, installPrompt }) => {
    const [isIOS, setIsIOS] = useState(false);
    // Use prop as initial value if available
    const [deferredPrompt, setDeferredPrompt] = useState<any>(installPrompt || null);

    useEffect(() => {
        // Sync with prop if it changes
        if (installPrompt) {
            setDeferredPrompt(installPrompt);
        }
    }, [installPrompt]);

    useEffect(() => {
        // Check if device is iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Fallback: Get the deferred prompt from window if not passed via props
        // @ts-ignore
        if (!installPrompt && window.deferredPrompt) {
            // @ts-ignore
            setDeferredPrompt(window.deferredPrompt);
        }

        // Listen for the event in case it happens after mount (self-contained backup)
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // @ts-ignore
            window.deferredPrompt = e;
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, [installPrompt]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            if (!isIOS) {
                // Fallback for desktop/debugging if no prompt captured yet
                alert("Impossibile avviare l'installazione automaticamente. Usa il menu del browser.");
            }
            return;
        }

        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            if (outcome === 'accepted') {
                onClose();
            }
            setDeferredPrompt(null);
            // @ts-ignore
            window.deferredPrompt = null;
        } catch (err) {
            console.error("Installation failed", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-6 relative border-t sm:border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-gray-100 dark:bg-gray-800 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-union-blue-500 to-union-blue-700 rounded-2xl shadow-xl flex items-center justify-center mb-5 rotate-3">
                        <Download className="text-white w-8 h-8" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Installa l'App
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                        Per i calcoli migliori, installa il Simulatore sul tuo dispositivo. Funziona offline e a schermo intero!
                    </p>

                    {!isIOS ? (
                        <button
                            onClick={handleInstallClick}
                            disabled={!deferredPrompt}
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2
                ${deferredPrompt
                                    ? 'bg-union-blue-600 hover:bg-union-blue-700 active:scale-95'
                                    : 'bg-gray-400 cursor-not-allowed opacity-70'}`}
                        >
                            <Download size={20} />
                            {deferredPrompt ? 'Installa Ora' : 'Installazione non disponibile'}
                        </button>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 w-full text-left space-y-3 border border-gray-100 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                <span>Tocca il tasto Condividi</span>
                                <Share size={16} className="text-blue-500" />
                            </p>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                <span>Scegli "Aggiungi alla Home"</span>
                                <PlusSquare size={16} className="text-gray-500" />
                            </p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline decoration-gray-300 underline-offset-4"
                    >
                        Continua nel browser
                    </button>
                </div>
            </div>
        </div>
    );
};
