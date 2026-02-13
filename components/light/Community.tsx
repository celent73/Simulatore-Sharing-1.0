import React, { useState } from 'react';
import { Users, Lock, Unlock, ChevronRight, Info, Share2, List, Network, Settings, Palette, Eye, EyeOff, Save, Instagram, Send, Phone, User, CheckCircle2, X } from 'lucide-react';


import { UNLOCK_CONDITIONS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import CommunityTree from './CommunityTree';
import { exportAsImage } from './utils/exportUtils';
import { useProfileStore } from './store/useProfileStore';
import BrandingOverlay from './BrandingOverlay';
import { useLanguage } from '../../contexts/LanguageContext';

import { useShary } from '../../contexts/SharyContext';

interface CommunityProps {
    personalUnits: number;
}

const Community: React.FC<CommunityProps> = ({ personalUnits }) => {
    const { t } = useLanguage();
    const { isActive: isSharyActive } = useShary(); // USIAMO SHARY HOOK
    const [view, setView] = useState<'list' | 'tree'>('list');
    const [theme, setTheme] = useState<'glass' | 'dark' | 'minimal'>('glass');
    const [isProjection, setIsProjection] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSharyTipOpen, setIsSharyTipOpen] = useState(false); // NEW STATE
    const profile = useProfileStore();

    const levels = [
        { id: 0, name: t('comm_sync.level_name', { n: 0 }), sub: t('comm_sync.level_sub_0'), condition: 0 },
        { id: 1, name: t('comm_sync.level_name', { n: 1 }), sub: t('comm_sync.level_sub_n', { n: 1 }), condition: UNLOCK_CONDITIONS.LEVEL_1 },
        { id: 2, name: t('comm_sync.level_name', { n: 2 }), sub: t('comm_sync.level_sub_n', { n: 2 }), condition: UNLOCK_CONDITIONS.LEVEL_2 },
        { id: 3, name: t('comm_sync.level_name', { n: 3 }), sub: t('comm_sync.level_sub_n', { n: 3 }), condition: UNLOCK_CONDITIONS.LEVEL_3 },
        { id: 4, name: t('comm_sync.level_name', { n: 4 }), sub: t('comm_sync.level_sub_n', { n: 4 }), condition: UNLOCK_CONDITIONS.LEVEL_4 },
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
        <div className="space-y-8 text-slate-800 dark:text-white pb-24 sm:pb-0">
            {/* Header Community Premium */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-union-green-500 text-white flex items-center justify-center shadow-lg shadow-union-green-500/30">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">{t('comm_sync.title')}</h2>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 mt-1 uppercase tracking-widest opacity-70">{t('comm_sync.subtitle')}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {isSharyActive && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsSharyTipOpen(true)}
                                className="flex items-center gap-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-4 py-2 rounded-2xl border border-cyan-500/20 shadow-sm transition-all text-xs font-black uppercase tracking-wider"
                            >
                                <span className="text-sm">🤖</span>
                                <span>{t('comm_sync.tip_btn')}</span>
                            </motion.button>
                        )}

                        <div className="flex bg-gray-200/50 dark:bg-black/30 p-1 rounded-2xl border border-white/10 shadow-inner no-export">
                            <button
                                onClick={() => setView('list')}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${view === 'list' ? 'bg-white dark:bg-slate-800 shadow-md text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500'}`}
                            >
                                <List size={20} />
                            </button>
                            <button
                                onClick={() => setView('tree')}
                                className={`p-2.5 rounded-xl transition-all duration-300 ${view === 'tree' ? 'bg-white dark:bg-slate-800 shadow-md text-union-green-600 dark:text-union-green-400' : 'text-gray-400 hover:text-gray-500'}`}
                            >
                                <Network size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Controls (Barra strumenti per Albero) */}
                {view === 'tree' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap items-center gap-3 mb-8 p-3 bg-gray-100/30 dark:bg-white/5 rounded-[2rem] border border-white/20 dark:border-white/5"
                    >
                        <div className="flex bg-white dark:bg-slate-800/50 p-1 rounded-xl shadow-sm no-export">
                            <button onClick={() => setTheme('glass')} className={`p-2 rounded-lg transition-all ${theme === 'glass' ? 'bg-union-green-500 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`} title="Tema Glass">
                                <Palette size={16} />
                            </button>
                            <button onClick={() => setTheme('dark')} className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-zinc-800 text-yellow-500 shadow-md' : 'text-gray-400 hover:text-gray-600'}`} title="Tema Dark Gold">
                                <Palette size={16} />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsProjection(!isProjection)}
                            className={`px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-wider flex items-center gap-2 no-export ${isProjection ? 'bg-union-green-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 hover:bg-gray-50'}`}
                        >
                            {isProjection ? <EyeOff size={16} /> : <Eye size={16} />}
                            <span>Crescita</span>
                        </button>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-union-green-500 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-white/10 no-export"
                        >
                            <Settings size={18} />
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className={`ml-auto px-5 py-2.5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg ${isExporting ? 'bg-gray-100 text-gray-400' : 'bg-gradient-to-r from-union-green-600 to-cyan-600 text-white hover:scale-105 active:scale-95'}`}
                        >
                            <Share2 size={16} className={isExporting ? 'animate-pulse' : ''} />
                            <span>{isExporting ? '...' : 'Esporta'}</span>
                        </button>
                    </motion.div>
                )}

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
                                        className={`p-5 rounded-[2rem] flex items-center justify-between transition-all duration-300 border-2 relative overflow-hidden ${isUnlocked
                                            ? 'bg-white dark:bg-slate-900/60 border-union-green-500/20 shadow-xl shadow-union-green-500/5 hover:border-union-green-500/40'
                                            : 'bg-gray-50/50 dark:bg-slate-950/30 border-gray-100 dark:border-white/5 opacity-60'}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all ${isUnlocked ? 'bg-union-green-500 text-white shadow-lg shadow-union-green-500/30' : 'bg-gray-200 dark:bg-white/5 text-gray-400'}`}>
                                                {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-black uppercase tracking-tighter ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-gray-400'}`}>{lvl.name}</p>
                                                <p className="text-[10px] opacity-60 font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">
                                                    {lvl.sub}
                                                </p>
                                            </div>
                                        </div>
                                        {isUnlocked ? (
                                            <div className="flex items-center gap-2 text-union-green-600 dark:text-union-green-400 font-black text-[10px] uppercase tracking-widest bg-union-green-500/10 px-3 py-1.5 rounded-xl">
                                                <CheckCircle2 size={14} />
                                                {t('comm_sync.unlocked')}
                                            </div>
                                        ) : (
                                            <div className="text-[10px] font-black text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-gray-200/50">
                                                {t('comm_sync.needs_units', { n: lvl.condition })}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="tree"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            id="export-card-tree"
                            className={`p-8 rounded-[3rem] shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white text-slate-800 border border-gray-100'}`}
                        >
                            {theme === 'dark' && <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent pointer-events-none"></div>}

                            <div className="flex justify-between items-start mb-10 no-export relative z-10">
                                <div>
                                    <h3 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-yellow-500' : 'text-union-green-600'}`}>{t('comm_sync.visualizer_pro')}</h3>
                                    <p className="text-xs font-bold opacity-50 mt-1">{t('comm_sync.visualizer_desc')}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-4xl font-black ${theme === 'dark' ? 'text-yellow-500' : 'text-union-green-600'}`}>{isProjection ? '20+' : '12'}</p>
                                    <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">{t('comm_sync.total_members')}</p>
                                </div>
                            </div>

                            <div className="relative z-0">
                                <CommunityTree theme={theme} isProjectionMode={isProjection} />
                            </div>

                            <BrandingOverlay />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Shary Tip Modal Premium */}
            <AnimatePresence>
                {isSharyTipOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSharyTipOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 rounded-[3rem] p-8 w-full max-w-md shadow-2xl overflow-hidden border border-cyan-500/20"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500" />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-4xl shadow-inner border border-cyan-200/50">🤖</div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 dark:text-white leading-tight tracking-tighter">{t('comm_sync.tip_title')}</h3>
                                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-widest mt-1 opacity-70">{t('comm_sync.tip_subtitle')}</p>
                                </div>
                                <button onClick={() => setIsSharyTipOpen(false)} className="ml-auto p-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="space-y-6 text-slate-600 dark:text-gray-400 text-xs font-bold leading-relaxed mb-8">
                                <div className="p-4 bg-cyan-50/50 dark:bg-cyan-500/5 rounded-2xl border border-cyan-100 dark:border-cyan-500/10">
                                    <strong className="text-cyan-700 dark:text-cyan-400 block mb-2 text-sm uppercase tracking-tight">{t('comm_sync.tip_1_title')}</strong>
                                    <p className="opacity-80">{t('comm_sync.tip_1_desc')}</p>
                                </div>

                                <div className="p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-4">
                                    <strong className="text-slate-800 dark:text-white block text-sm uppercase tracking-tight">{t('comm_sync.tip_2_title')}</strong>
                                    <div className="space-y-3">
                                        {[
                                            { l: '0', u: '1' },
                                            { l: '1', u: '3' },
                                            { l: '2', u: '5' },
                                            { l: '3', u: '7' },
                                            { l: '4-5', u: '10' }
                                        ].map(item => (
                                            <div key={item.l} className="flex justify-between items-center bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl shadow-sm">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVELLO {item.l}</span>
                                                <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{item.u} Utenze</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] italic opacity-60 mt-4 leading-normal" dangerouslySetInnerHTML={{ __html: t('comm_sync.tip_2_desc') }} />
                                </div>

                                <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                                    <strong className="text-blue-700 dark:text-blue-400 block mb-2 text-sm uppercase tracking-tight">{t('comm_sync.tip_3_title')}</strong>
                                    <p className="opacity-80">{t('comm_sync.tip_3_desc')}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsSharyTipOpen(false)}
                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                            >
                                {t('comm_sync.understand_btn')}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {isSettingsOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSettingsOpen(false)}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="relative bg-white dark:bg-slate-900 rounded-[3rem] p-8 w-full max-w-md shadow-2xl overflow-hidden border border-union-green-500/20"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-union-green-500 to-cyan-600" />
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">{t('comm_sync.customize_brand')}</h2>
                                <p className="text-xs opacity-60 font-bold italic text-slate-500 dark:text-gray-400 mt-1">{t('comm_sync.customize_desc')}</p>
                            </div>
                            <button onClick={() => setIsSettingsOpen(false)} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={20} /></button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                    <User size={14} /> {t('comm_sync.full_name')}
                                </label>
                                <input
                                    value={profile.name} onChange={(e) => profile.setProfile({ name: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                    placeholder="Esempio: Marco Rossi"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                        <Instagram size={14} /> Instagram
                                    </label>
                                    <input
                                        value={profile.instagram} onChange={(e) => profile.setProfile({ instagram: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                        placeholder="username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                        <Send size={14} /> Telegram
                                    </label>
                                    <input
                                        value={profile.telegram} onChange={(e) => profile.setProfile({ telegram: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                    <Phone size={14} /> {t('comm_sync.phone')}
                                </label>
                                <input
                                    value={profile.phone} onChange={(e) => profile.setProfile({ phone: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                    placeholder="+39 333..."
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="w-full mt-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 hover:bg-union-green-600 dark:hover:bg-union-green-500 dark:hover:text-white transition-all shadow-xl active:scale-95"
                        >
                            <Save size={20} /> {t('comm_sync.save_close')}
                        </button>
                    </motion.div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-indigo-500/5 dark:bg-indigo-500/10 p-6 rounded-[2.5rem] border border-indigo-500/20 shadow-lg relative overflow-hidden group"
            >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-1">{t('comm_sync.unlock_rule_title')}</p>
                        <p className="text-[10px] text-indigo-700/80 dark:text-indigo-400/70 leading-relaxed font-bold">
                            {t('comm_sync.unlock_rule_desc', { n: UNLOCK_CONDITIONS.LEVEL_5 })}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Community;
