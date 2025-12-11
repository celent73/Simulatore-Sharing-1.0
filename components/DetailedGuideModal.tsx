import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DetailedGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailedGuideModal: React.FC<DetailedGuideModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'intro' | 'network' | 'bonus' | 'vision' | 'admin'>('intro');

  if (!isOpen) return null;

  const tabs = [
    { id: 'intro', icon: '👋', label: t('guide_wow.tabs.intro') },
    { id: 'network', icon: '👥', label: t('guide_wow.tabs.network') },
    { id: 'bonus', icon: '💎', label: t('guide_wow.tabs.bonus') },
    { id: 'vision', icon: '✨', label: t('guide_wow.tabs.vision') },
    { id: 'admin', icon: '🏢', label: t('guide_wow.tabs.admin') },
  ] as const;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-union-blue-600 to-union-blue-500 p-6 flex items-center justify-between shrink-0">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-3xl">🎓</span> 
                    {t('guide_wow.title')} <span className="text-union-orange-500">{t('guide_wow.highlight')}</span>
                </h2>
                <p className="text-blue-100 text-sm sm:text-base opacity-90 mt-1">
                    {t('guide_wow.subtitle')}
                </p>
            </div>
            <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Body Container */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            
            {/* Sidebar Tabs (Mobile: Top Bar) */}
            <div className="w-full md:w-64 bg-gray-50 dark:bg-slate-800/50 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-2 overflow-x-auto flex md:flex-col gap-2 shrink-0">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-white dark:bg-slate-700 text-union-blue-600 dark:text-white shadow-md border border-gray-100 dark:border-gray-600' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700'}
                        `}
                    >
                        <span className="text-xl">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white dark:bg-slate-900">
                
                {/* INTRO CONTENT */}
                {activeTab === 'intro' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <h3 className="text-2xl font-bold text-union-blue-700 dark:text-blue-300 mb-3">
                                {t('guide_wow.content.intro_title')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {t('guide_wow.content.intro_text')}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">🎛️</div>
                                <h4 className="font-bold text-gray-800 dark:text-white">Input Panel</h4>
                                <p className="text-xs text-gray-500">Imposta i numeri della tua attività.</p>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <div className="text-3xl mb-2">📈</div>
                                <h4 className="font-bold text-gray-800 dark:text-white">Grafici</h4>
                                <p className="text-xs text-gray-500">Visualizza la crescita nel tempo.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* NETWORK CONTENT */}
                {activeTab === 'network' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-union-orange-500">👥</span> {t('guide_wow.content.network_title')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t('guide_wow.content.network_desc')}
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600">1</div>
                                <div>
                                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: t('guide_wow.content.network_p1')}} />
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg text-purple-600">2</div>
                                <div>
                                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: t('guide_wow.content.network_p2')}} />
                                </div>
                            </div>
                            <div className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600">3</div>
                                <div>
                                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed" dangerouslySetInnerHTML={{__html: t('guide_wow.content.network_p3')}} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BONUS CONTENT */}
                {activeTab === 'bonus' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                            <h3 className="text-2xl font-bold mb-2">{t('guide_wow.content.bonus_title')}</h3>
                            <p className="text-fuchsia-100">{t('guide_wow.content.bonus_desc')}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="border-l-4 border-fuchsia-500 pl-4 py-1">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">🛍️ Cashback</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: t('guide_wow.content.bonus_p1')}} />
                            </div>
                            <div className="border-l-4 border-emerald-500 pl-4 py-1">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">💼 Clienti Personali</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: t('guide_wow.content.bonus_p2')}} />
                            </div>
                        </div>
                    </div>
                )}

                {/* VISION (WOW) CONTENT */}
                {activeTab === 'vision' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('guide_wow.content.vision_title')}
                        </h3>
                        <p className="text-gray-500 italic mb-6">{t('guide_wow.content.vision_desc')}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                                <span className="text-2xl">🧾</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2" dangerouslySetInnerHTML={{__html: t('guide_wow.content.vision_zero')}} />
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                                <span className="text-2xl">🦅</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2" dangerouslySetInnerHTML={{__html: t('guide_wow.content.vision_freedom')}} />
                            </div>
                            <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800">
                                <span className="text-2xl">🌠</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2" dangerouslySetInnerHTML={{__html: t('guide_wow.content.vision_dreams')}} />
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                                <span className="text-2xl">🛡️</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2" dangerouslySetInnerHTML={{__html: t('guide_wow.content.vision_pension')}} />
                            </div>
                        </div>
                    </div>
                )}

                {/* ADMIN CONTENT */}
                {activeTab === 'admin' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold mb-2">🏢 {t('guide_wow.content.admin_title')}</h3>
                            <p className="text-gray-400">{t('guide_wow.content.admin_desc')}</p>
                        </div>
                        
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex gap-3">
                                <span className="text-union-blue-500">●</span>
                                <span dangerouslySetInnerHTML={{__html: t('guide_wow.content.admin_p1')}} />
                            </li>
                            <li className="flex gap-3">
                                <span className="text-union-blue-500">●</span>
                                <span dangerouslySetInnerHTML={{__html: t('guide_wow.content.admin_p2')}} />
                            </li>
                            <li className="flex gap-3">
                                <span className="text-union-orange-500 font-bold">★</span>
                                <span dangerouslySetInnerHTML={{__html: t('guide_wow.content.admin_p3')}} />
                            </li>
                        </ul>
                    </div>
                )}

            </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-gray-700 shrink-0">
            <button 
                onClick={onClose}
                className="w-full bg-union-blue-600 hover:bg-union-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.99]"
            >
                {t('guide_wow.close')}
            </button>
        </div>

      </div>
    </div>
  );
};

export default DetailedGuideModal;