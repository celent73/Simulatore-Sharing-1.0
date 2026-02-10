import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BroadcastModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('hasSeenBroadcastModal', 'true');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center px-4">
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* MODAL CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/20"
                    >
                        {/* HEADER DECORATION */}
                        <div className="h-32 bg-gradient-to-br from-union-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30 relative z-10">
                                <MessageCircle size={40} className="text-white fill-white/20" />
                            </div>
                            {/* DECORATIVE CIRCLES */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
                        </div>

                        {/* CONTENT */}
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
                                Benvenuto & <br /> <span className="text-union-blue-500">Aggiornamenti</span>
                            </h2>

                            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">
                                💡 Per ricevere i report su tutti gli aggiornamenti del Simulatore, salva il mio numero in rubrica come <strong>"Assistente Sharing Simulator"</strong> o semplicemente <strong>"Luca Celentano"</strong>.
                            </p>

                            {/* NUMBER BOX */}
                            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-xl mb-8 border border-slate-200 dark:border-slate-600">
                                <p className="text-3xl font-black text-slate-800 dark:text-white tracking-wider font-mono">
                                    348 273 8897
                                </p>
                            </div>

                            {/* ACTION BUTTON */}
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-gradient-to-r from-union-blue-600 to-union-blue-500 hover:from-union-blue-500 hover:to-union-blue-400 text-white font-bold rounded-xl shadow-lg shadow-union-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Check size={20} strokeWidth={3} />
                                Ho salvato il numero
                            </button>

                            <button
                                onClick={onClose}
                                className="mt-4 text-xs text-slate-400 font-medium hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                Ricordamelo più tardi
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
