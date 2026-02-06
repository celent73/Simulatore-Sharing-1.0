import React, { useState } from 'react';
import { Users, Lock, Unlock, ChevronRight, Info, Share2, List, Network, Settings, Palette, Eye, EyeOff, Save, Instagram, Send, Phone, User, CheckCircle2 } from 'lucide-react';
import { UNLOCK_CONDITIONS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import CommunityTree from './CommunityTree';
import { exportAsImage } from './utils/exportUtils';
import { useProfileStore } from './store/useProfileStore';
import BrandingOverlay from './BrandingOverlay';
import { useLanguage } from '../../contexts/LanguageContext';

interface CommunityProps {
    personalUnits: number;
}

const Community: React.FC<CommunityProps> = ({ personalUnits }) => {
    const { t } = useLanguage();
    const [view, setView] = useState<'list' | 'tree'>('list');
    const [theme, setTheme] = useState<'glass' | 'dark' | 'minimal'>('glass');
    const [isProjection, setIsProjection] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const profile = useProfileStore();

    const levels = [
        { id: 0, name: 'Livello 0', sub: 'Commissioni Dirette (Collaboratori)', condition: 0 },
        { id: 1, name: 'Livello 1', sub: 'Rendita Indiretta 1° Livello', condition: UNLOCK_CONDITIONS.LEVEL_1 },
        { id: 2, name: 'Livello 2', sub: 'Rendita Indiretta 2° Livello', condition: UNLOCK_CONDITIONS.LEVEL_2 },
        { id: 3, name: 'Livello 3', sub: 'Rendita Indiretta 3° Livello', condition: UNLOCK_CONDITIONS.LEVEL_3 },
        { id: 4, name: 'Livello 4', sub: 'Rendita Indiretta 4° Livello', condition: UNLOCK_CONDITIONS.LEVEL_4 },
    ];

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        setTimeout(async () => {
            await exportAsImage('export-card-tree', `Union-Compass-Network-${theme}`);
            setIsExporting(false);
        }, 300);
    };

    return (
        <div className="space-y-6 text-union-black pb-20 sm:pb-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-light p-6 border-l-4 border-union-green-500"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-union-green-500/10 p-2 rounded-lg">
                            <Users className="text-union-green-600 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-heading text-union-black">Community Sync</h2>
                            <p className="text-xs opacity-60 text-union-black">Sblocca i livelli di profondità della tua rete in base alle tue utenze personali attive.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {view === 'tree' && (
                            <>
                                <div className="flex bg-union-green-50 p-1 rounded-xl border border-union-green-500/10 no-export">
                                    <button onClick={() => setTheme('glass')} className={`p-2 rounded-lg transition-all ${theme === 'glass' ? 'bg-white shadow-sm text-union-green-600' : 'text-gray-400'}`} title="Tema Glass">
                                        <Palette size={16} />
                                    </button>
                                    <button onClick={() => setTheme('dark')} className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-zinc-800 shadow-sm text-yellow-500' : 'text-gray-400'}`} title="Tema Dark Gold">
                                        <Palette size={16} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsProjection(!isProjection)}
                                    className={`p-2 rounded-xl transition-all shadow-sm flex items-center gap-2 no-export ${isProjection ? 'bg-union-green-600 text-white' : 'bg-union-green-500/10 text-union-green-600'}`}
                                    title="Mostra Proiezione Crescita"
                                >
                                    {isProjection ? <EyeOff size={16} /> : <Eye size={16} />}
                                    <span className="text-[10px] font-bold uppercase hidden lg:inline">Crescita</span>
                                </button>

                                <button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="p-2 bg-union-green-50 text-union-black/60 rounded-xl hover:bg-union-black hover:text-white transition-all shadow-sm no-export"
                                    title="Personalizza Brand"
                                >
                                    <Settings size={16} />
                                </button>

                                <button
                                    onClick={handleExport}
                                    disabled={isExporting}
                                    className={`p-2 rounded-xl transition-all shadow-sm flex items-center gap-2 ${isExporting ? 'bg-gray-100 text-gray-400' : 'bg-union-green-600 text-white hover:brightness-110'}`}
                                    title="Esporta Card Rete"
                                >
                                    <Share2 size={16} className={isExporting ? 'animate-pulse' : ''} />
                                    <span className="text-[10px] font-bold uppercase hidden sm:inline">
                                        {isExporting ? 'Esportazione...' : 'Esporta'}
                                    </span>
                                </button>
                            </>
                        )}

                        <div className="flex bg-union-green-50 p-1 rounded-xl border border-union-green-500/10 no-export">
                            <button
                                onClick={() => setView('list')}
                                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-union-green-600' : 'text-gray-400'}`}
                            >
                                <List size={18} />
                            </button>
                            <button
                                onClick={() => setView('tree')}
                                className={`p-2 rounded-lg transition-all ${view === 'tree' ? 'bg-white shadow-sm text-union-green-600' : 'text-gray-400'}`}
                            >
                                <Network size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {view === 'list' ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                        >
                            {levels.map((lvl, i) => {
                                const isUnlocked = personalUnits >= lvl.condition;
                                return (
                                    <motion.div
                                        key={lvl.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`glass-card-light p-4 flex items-center justify-between transition-all duration-300 border-2 ${!isUnlocked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-union-green-500/5 border-union-green-500/20 hover:border-union-green-500/50'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${isUnlocked ? 'bg-union-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black uppercase tracking-wider ${isUnlocked ? 'text-union-green-800' : 'text-gray-400'}`}>{lvl.name}</p>
                                                <p className="text-[10px] opacity-60 font-medium text-union-black">
                                                    {lvl.sub}
                                                </p>
                                            </div>
                                        </div>
                                        {isUnlocked ? (
                                            <div className="flex items-center gap-1 text-union-green-600 font-bold text-[10px] uppercase">
                                                <CheckCircle2 size={12} />
                                                SBLOCCATO
                                            </div>
                                        ) : (
                                            <div className="text-[10px] font-black text-gray-400 uppercase">
                                                RICHIEDE {lvl.condition} UTENZE
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="tree"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            id="export-card-tree"
                            className={`p-4 rounded-3xl ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-union-black'}`}
                        >
                            <div className="flex justify-between items-start mb-6 no-export">
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-widest text-union-green-600">Visualizer PRO</h3>
                                    <p className="text-[10px] opacity-60">Analisi e proiezione crescita community</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-union-green-600">{isProjection ? '20+' : '12'}</p>
                                    <p className="text-[10px] opacity-40 uppercase font-black">Membri Totali</p>
                                </div>
                            </div>

                            <CommunityTree theme={theme} isProjectionMode={isProjection} />

                            <BrandingOverlay />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {isSettingsOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-union-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-union-green-500 to-union-green-700" />
                            <h2 className="text-2xl font-black mb-1 text-union-black">Personalizza Brand</h2>
                            <p className="text-xs opacity-60 mb-8 font-medium italic text-union-black">Le tue info appariranno sulle immagini esportate.</p>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-1">
                                        <User size={12} /> Nome Intero
                                    </label>
                                    <input
                                        value={profile.name} onChange={(e) => profile.setProfile({ name: e.target.value })}
                                        className="w-full bg-union-green-50 border border-union-green-500/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-union-green-500 transition-all text-union-black"
                                        placeholder="Esempio: Marco Rossi"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-1">
                                            <Instagram size={12} /> Instagram
                                        </label>
                                        <input
                                            value={profile.instagram} onChange={(e) => profile.setProfile({ instagram: e.target.value })}
                                            className="w-full bg-union-green-50 border border-union-green-500/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-union-green-500 transition-all text-union-black"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-1">
                                            <Send size={12} /> Telegram
                                        </label>
                                        <input
                                            value={profile.telegram} onChange={(e) => profile.setProfile({ telegram: e.target.value })}
                                            className="w-full bg-union-green-50 border border-union-green-500/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-union-green-500 transition-all text-union-black"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-1">
                                        <Phone size={12} /> Telefono
                                    </label>
                                    <input
                                        value={profile.phone} onChange={(e) => profile.setProfile({ phone: e.target.value })}
                                        className="w-full bg-union-green-50 border border-union-green-500/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-union-green-500 transition-all text-union-black"
                                        placeholder="+39 333..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="w-full mt-8 bg-union-black text-white rounded-xl py-4 font-black flex items-center justify-center gap-2 hover:bg-union-green-600 transition-all shadow-lg"
                            >
                                <Save size={18} /> SALVA E CHIUDI
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="glass-card-light p-4 bg-union-green-500/5 border-union-green-500/20"
            >
                <div className="flex gap-3">
                    <Info className="text-union-green-600 w-5 h-5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-union-green-700 uppercase tracking-wider">Regola dello Sblocco</p>
                        <p className="text-[10px] text-union-black opacity-70 leading-relaxed font-medium">
                            Ogni utenza personale sblocca una percentuale di provvigione sui livelli inferiori. Raggiungi {UNLOCK_CONDITIONS.LEVEL_5} utenze dirette per sbloccare il massimo potenziale del Piano Compensi.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Community;
