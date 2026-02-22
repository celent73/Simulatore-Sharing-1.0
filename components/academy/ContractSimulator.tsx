import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Search, Check, ChevronDown, Save, Info, ArrowRight, ArrowLeft,
    User, Home, PartyPopper, Mail, Smartphone, FileText, Lock, Clock, Eye
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import AIScannerModal from '../AIScannerModal';
import { ExtractedBillData } from '../../utils/aiService';

const ContractSimulator: React.FC = () => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [lastScanType, setLastScanType] = useState<'electricity' | 'gas' | 'any'>('any');
    const [selectedProfile, setSelectedProfile] = useState<'light' | 'green' | null>(null);
    const [sigStep, setSigStep] = useState<number>(1); // 1: Table, 2: Loading, 3-9: Contract View with Overlays
    const [otp, setOtp] = useState(['', '', '', '']);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', fiscalCode: '',
        city: '', address: '', zip: '', podPdr: '', power: '3.3',
        consumption: '', isDemo: false
    });

    const [docs, setDocs] = useState<{ [key: string]: boolean }>({
        id: false, cf: false, bill: false
    });

    const [acceptanceChecks, setAcceptanceChecks] = useState<{ [key: string]: boolean }>({
        check1: false, check2: false, check3: false, check4: false,
        check5: false, check6: false, check7: false, check8: false
    });

    const allChecked = Object.values(acceptanceChecks).every(v => v);

    const toggleAllChecks = () => {
        const newState = !allChecked;
        setAcceptanceChecks({
            check1: newState, check2: newState, check3: newState, check4: newState,
            check5: newState, check6: newState, check7: newState, check8: newState
        });
    };

    const populateDemoData = () => {
        setFormData({
            firstName: 'Mario', lastName: 'Rossi', email: 'mario.rossi@example.com',
            fiscalCode: 'RSSMRA80A01H501U', city: 'Roma', address: 'Via del Corso 1',
            zip: '00186', podPdr: 'IT001E12345678', power: '3.3', consumption: '2500',
            isDemo: true
        });
        setDocs({ id: true, cf: true, bill: true });
    };

    const handleNext = () => {
        if (currentStep < 9) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleApplyScan = (data: ExtractedBillData) => {
        const elec = data.electricity;
        const gas = data.gas;

        setFormData(prev => ({
            ...prev,
            podPdr: elec?.pod || gas?.pdr || prev.podPdr,
            consumption: (elec?.consumption || gas?.consumption || prev.consumption).toString(),
            power: elec?.power?.toString() || prev.power
        }));
    };

    // Auto-transition for loading state
    useEffect(() => {
        if (currentStep === 8 && sigStep === 2) {
            const timer = setTimeout(() => setSigStep(3), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, sigStep]);

    const renderProgress = () => (
        <div className="flex items-center justify-between mb-8 max-w-lg mx-auto px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
                <React.Fragment key={step}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 shadow-md ${currentStep >= step
                        ? 'bg-[#FF6600] text-white ring-4 ring-orange-500/10'
                        : 'bg-white dark:bg-slate-800 text-gray-400 border border-slate-200 dark:border-slate-700'
                        }`}>
                        {currentStep > step ? <Check size={14} strokeWidth={3} /> : step}
                    </div>
                    {step < 8 && (
                        <div className={`flex-1 h-0.5 mx-1 rounded-full duration-500 transition-colors ${currentStep > step ? 'bg-[#FF6600]' : 'bg-slate-200 dark:bg-slate-700'
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><User size={20} /></div>
                <h2 className="text-xl font-bold dark:text-white">{t('academy.contract.step1_title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="lbl">{t('academy.contract.label_name')}</label>
                    <input type="text" className="inp" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="lbl">{t('academy.contract.label_surname')}</label>
                    <input type="text" className="inp" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                </div>
                <div className="col-span-full space-y-1">
                    <label className="lbl">{t('academy.contract.label_cf')}</label>
                    <input type="text" className="inp uppercase" value={formData.fiscalCode} onChange={e => setFormData({ ...formData, fiscalCode: e.target.value })} />
                </div>
                <div className="col-span-full space-y-1">
                    <label className="lbl">{t('academy.contract.label_email')}</label>
                    <input type="email" className="inp" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
            </div>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500"><Home size={20} /></div>
                <h2 className="text-xl font-bold dark:text-white">{t('academy.contract.step2_title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full space-y-1">
                    <label className="lbl">{t('academy.contract.label_address')}</label>
                    <input type="text" className="inp" placeholder={t('academy.contract.placeholder_address')} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="lbl">{t('academy.contract.label_city')}</label>
                    <input type="text" className="inp" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="lbl">{t('academy.contract.label_zip')}</label>
                    <input type="text" className="inp" value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                </div>
                <div className="col-span-full md:col-span-1 space-y-1">
                    <label className="lbl">{t('academy.contract.label_pod')}</label>
                    <input type="text" className="inp uppercase" placeholder={t('academy.contract.placeholder_pod')} value={formData.podPdr} onChange={e => setFormData({ ...formData, podPdr: e.target.value })} />
                </div>
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center text-[#FF6600]"><Upload size={40} /></div>
                <div>
                    <h2 className="text-2xl font-black dark:text-white mb-2">{t('academy.contract.step3_title')}</h2>
                    <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">{t('academy.contract.upload_sub')}</p>
                </div>
                <button onClick={() => { setLastScanType('any'); setIsScannerOpen(true); }} className="mt-4 bg-[#FF6600] text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 shadow-xl hover:bg-orange-600 transition-all active:scale-95 group">
                    <Search className="group-hover:scale-110 transition-transform" />
                    {t('academy.contract.upload_cta')}
                </button>
            </div>
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 gap-4">
            {/* Selection logic... simplified for brevity, keeping existing structure */}
            <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                <div className="mb-4 text-blue-500"><User size={48} /></div>
                <h3 className="text-xs font-black text-blue-900 dark:text-blue-400 mb-6 uppercase tracking-wider text-center">{t('academy.contract.profile_selection.client_title')}</h3>
                <button onClick={() => { setSelectedProfile('light'); handleNext(); }} className="w-full py-4 rounded-xl font-black text-xs bg-blue-600 text-white shadow-lg active:scale-95 transition-all uppercase tracking-widest">{t('academy.contract.profile_selection.choose_light')}</button>
            </div>
            <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl">
                <div className="mb-4 text-emerald-500"><div className="grid grid-cols-2 gap-0.5">{[1, 2, 3, 4].map(i => <User key={i} size={18} />)}</div></div>
                <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 mb-6 uppercase tracking-wider text-center">{t('academy.contract.profile_selection.member_title')}</h3>
                <button onClick={() => { setSelectedProfile('green'); handleNext(); }} className="w-full py-4 rounded-xl font-black text-xs bg-emerald-600 text-white shadow-lg active:scale-95 transition-all uppercase tracking-widest">{t('academy.contract.profile_selection.choose_green')}</button>
            </div>
        </motion.div>
    );

    const renderStep5 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="bg-blue-600 rounded-t-2xl p-4 flex justify-between items-center text-white">
                <span className="text-xs font-black uppercase tracking-wider">{t('academy.contract.acceptance.title')}</span>
                <ChevronDown size={16} />
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-b-2xl border-x border-b border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-900 dark:text-amber-200 leading-relaxed">{t('academy.contract.acceptance.checkbox_warning')}</p>
                </div>
                <div className="space-y-3">
                    <button onClick={toggleAllChecks} className="flex items-center gap-3 p-3 w-full bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors group">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${allChecked ? 'bg-[#FF6600] border-[#FF6600]' : 'border-slate-300 dark:border-slate-600'}`}>{allChecked && <Check size={14} className="text-white" strokeWidth={4} />}</div>
                        <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('academy.contract.acceptance.accept_all_checks') || "SELEZIONA TUTTO"}</span>
                    </button>
                    {/* Checkboxes... simplified */}
                    <div className="grid gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <button key={num} onClick={() => setAcceptanceChecks(prev => ({ ...prev, [`check${num}`]: !prev[`check${num}`] }))} className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${acceptanceChecks[`check${num}`] ? 'bg-orange-500 border-orange-500' : 'border-slate-200 dark:border-slate-700'}`}>{acceptanceChecks[`check${num}`] && <Check size={10} className="text-white" strokeWidth={4} />}</div>
                                <span className="text-[10px] font-bold text-slate-500">Concetto di accettazione {num}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleBack} className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest"><ArrowLeft size={14} className="inline mr-1" /> Back</button>
                    <button onClick={handleNext} disabled={!allChecked} className={`font-black py-3 px-10 rounded-xl shadow-lg flex items-center gap-2 text-xs uppercase transition-all active:scale-95 ${allChecked ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>SAVE <Save size={16} /></button>
                </div>
            </div>
        </motion.div>
    );

    const renderStep6 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-blue-600 rounded-t-2xl p-3 flex justify-between items-center text-white">
                <span className="text-[10px] font-black uppercase tracking-wider">{t('academy.contract.docs.title')}</span>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-b-2xl border-x border-b border-slate-100 dark:border-slate-800 shadow-lg space-y-6">
                {[
                    { id: 'id', lbl: 'id_card', files: ['ident_fronte.pdf', 'ident_retro.pdf'] },
                    { id: 'cf', lbl: 'fiscal_code', files: [] },
                    { id: 'bill', lbl: 'bill', files: [] }
                ].map((doc) => (
                    <div key={doc.id} className="pb-4 border-b border-gray-100 dark:border-slate-800 last:border-0 flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase">{t(`academy.contract.docs.${doc.lbl}`)}</h4>
                        <button className="bg-blue-700 text-white text-[9px] font-black py-2 px-3 rounded-lg flex items-center gap-2 uppercase tracking-widest">ADD DOC +</button>
                    </div>
                ))}
                <div className="flex justify-end pt-4"><button onClick={handleNext} className="bg-orange-600 text-white font-black py-3 px-8 rounded-xl shadow-lg active:scale-95 text-xs uppercase tracking-widest">CONTINUE</button></div>
            </div>
        </motion.div>
    );

    const renderStep7 = () => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="bg-blue-600 rounded-t-2xl p-3 flex justify-between items-center text-white"><span className="text-[10px] font-black uppercase tracking-wider">Verifica Pratica</span></div>
            <div className="bg-white dark:bg-slate-800/50 p-8 rounded-b-2xl border-x border-b border-slate-100 dark:border-slate-800 shadow-2xl relative">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90"><circle cx="80" cy="80" r="70" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="12" /><circle cx="80" cy="80" r="70" className="stroke-orange-500 fill-none transition-all duration-1000" strokeWidth="12" strokeDasharray="440" strokeDashoffset="330" strokeLinecap="round" /></svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col"><span className="text-3xl font-black text-slate-800 dark:text-white">25%</span></div>
                    </div>
                    <p className="flex-1 text-[11px] font-bold text-blue-900 dark:text-blue-300 leading-relaxed text-center md:text-left">{t('academy.contract.status.subtitle')}</p>
                </div>
                <div className="mt-8 flex justify-center"><button onClick={handleNext} className="bg-slate-900 text-white font-black py-4 px-10 rounded-2xl shadow-xl active:scale-95 transition-all text-xs uppercase tracking-widest">PROCEED TO SIGNATURE</button></div>
            </div>
        </motion.div>
    );

    const renderStep8 = () => (
        <AnimatePresence mode="wait">
            {sigStep === 1 && (
                <motion.div key="sig1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Firma Digitale</h3>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="pb-3 px-2">Documento</th>
                                        <th className="pb-3 px-2">Data Avvio</th>
                                        <th className="pb-3 px-2">Stato</th>
                                        <th className="pb-3 px-2">Email</th>
                                        <th className="pb-3 px-2 text-right">Azione</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                        <td className="py-4 px-2">CTE e Contratto</td>
                                        <td className="py-4 px-2">14/04/2025</td>
                                        <td className="py-4 px-2"><span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[8px] uppercase font-black">In firma</span></td>
                                        <td className="py-4 px-2 text-slate-400">{formData.email || 'mario.rossi@...'}</td>
                                        <td className="py-4 px-2 text-right">
                                            <button onClick={() => setSigStep(2)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-500/20 flex items-center gap-1 inline-flex">
                                                Firma ora <ArrowRight size={10} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {sigStep === 2 && (
                <motion.div key="sig2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-2xl space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xl">e</div>
                        <span className="text-2xl font-black text-slate-800 tracking-tighter italic">Sign AnyWhere</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento in caricamento, attendi per favore...</p>
                    </div>
                </motion.div>
            )}

            {sigStep >= 3 && (
                <motion.div key="sig3plus" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
                    <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-800 font-black tracking-tight italic">eSign</span>
                            <div className="flex items-center gap-1 ml-4 bg-slate-200 p-1 rounded-lg">
                                <ArrowLeft size={12} className="text-slate-400" />
                                <ArrowRight size={12} className="text-slate-800" />
                            </div>
                        </div>
                        <div className="bg-blue-600 text-white px-6 py-2 rounded font-black text-[10px] uppercase shadow-inner">
                            {sigStep >= 7 ? "Contratto firmato correttamente" : "Inizia qui per firmare il tuo documento"}
                        </div>
                        <button
                            onClick={sigStep >= 7 && sigStep < 8 ? () => setSigStep(8) : undefined}
                            className={`${sigStep >= 7 && sigStep < 8 ? 'bg-cyan-500 text-white hover:bg-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/20' : 'bg-slate-200 text-slate-600 cursor-default'} px-4 py-2 rounded font-black text-[10px] uppercase tracking-widest transition-all`}
                        >
                            Completa
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 relative bg-slate-500/10 no-scrollbar">
                        <div className="max-w-2xl mx-auto bg-white shadow-lg p-12 min-h-[1000px] border border-slate-200 relative">
                            {sigStep >= 7 && (
                                <div className="absolute bottom-20 right-20 text-right space-y-1">
                                    <p className="text-[8px] font-black text-slate-800">Firmato da: DANIELE DI CECCO</p>
                                    <p className="text-[8px] font-bold text-slate-400">Numero telefonico: +393663092786</p>
                                    <p className="text-[8px] font-bold text-slate-400">Transactiontoken: 6744</p>
                                    <p className="text-[8px] font-bold text-slate-400">Ora/data firma: 14-04-2025 15:52:08</p>
                                    <p className="text-[8px] font-bold text-slate-400">Indirizzo IP: 93.35.222.22</p>
                                </div>
                            )}
                            {/* Contract Content Simulation */}
                            <div className="flex justify-between items-start mb-12">
                                <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs text-center p-2">UNION<br />ENERGIA</div>
                                <div className="text-right">
                                    <h4 className="text-xl font-black text-blue-900 tracking-tighter">Modulo di adesione</h4>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Fornitura Energia Elettrica</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 bg-slate-100 rounded w-1/3" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-10 bg-slate-50 border border-slate-200 rounded p-2 text-[10px] font-bold">MARCELLO ZERRA</div>
                                    <div className="h-10 bg-slate-50 border border-slate-200 rounded p-2 text-[10px] font-bold">GRPD119394</div>
                                </div>
                                <div className="h-40 bg-slate-50 border border-slate-100 rounded" />
                                <div className="h-20 bg-slate-50 border border-slate-100 rounded" />
                                <div className="h-20 bg-slate-50 border border-slate-100 rounded" />
                                <div className="h-40 bg-slate-50 border border-slate-100 rounded" />
                            </div>
                        </div>

                        {/* Phase 3 Sign Box Overlay */}
                        {sigStep === 3 && (
                            <div className="absolute top-[400px] left-1/2 -translate-x-1/2 z-10">
                                <motion.button
                                    onClick={() => setSigStep(4)}
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-emerald-50 text-emerald-700 border-2 border-dashed border-emerald-400 py-6 px-12 rounded-xl shadow-2xl flex flex-col items-center gap-2 group transition-all hover:bg-emerald-100"
                                >
                                    <Lock size={20} className="text-emerald-500" />
                                    <span className="font-black text-lg">Clicca per firmare!</span>
                                </motion.button>
                            </div>
                        )}
                    </div>

                    <div className="bg-blue-50/95 backdrop-blur p-4 border-t border-blue-200 flex items-center justify-between text-blue-900 font-bold text-[10px] z-20">
                        <span>Permetti al nostro sito web di consentire un'esperienza di firma di prima classe memorizzando i dati nella memoria locale del browser.</span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded font-black uppercase tracking-widest text-[9px]">Accetta Tutto</button>
                    </div>

                    {/* MODALS OVERLAY */}
                    <AnimatePresence>
                        {/* Passo 4: Seleziona tipo firma */}
                        {sigStep === 4 && (
                            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-left">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Seleziona il tipo di firma</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scegli come apporre la tua firma sul documento</p>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="p-6 bg-blue-50 border-2 border-blue-500 rounded-2xl flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 mt-1"><Check size={14} /></div>
                                            <div>
                                                <h4 className="font-black text-blue-900 text-sm">Firma con un SMS di conferma</h4>
                                                <p className="text-[10px] font-bold text-blue-700/60 leading-relaxed mt-1">Conferma la tua firma con un codice OTP che verrà inviato al tuo cellulare</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button onClick={() => setSigStep(3)} className="bg-white border border-slate-200 py-4 px-6 rounded-xl font-black text-[10px] text-slate-400 uppercase tracking-widest hover:border-slate-400 transition-colors">Ignora</button>
                                            <button onClick={() => setSigStep(5)} className="bg-emerald-600 py-4 px-6 rounded-xl font-black text-[10px] text-white uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">Prosegui <ArrowRight size={14} /></button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Passo 5: Invia SMS */}
                        {sigStep === 5 && (
                            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-left">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Firma con il codice via SMS</h3>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">Vuoi inviare il codice via SMS per iniziare il processo di firma?</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button onClick={() => setSigStep(4)} className="bg-white border border-slate-200 py-3 rounded-xl font-black text-[10px] text-slate-400 uppercase tracking-widest transition-all">Ignora</button>
                                            <button onClick={() => setSigStep(4)} className="bg-white border border-slate-200 py-3 rounded-xl font-black text-[10px] text-slate-400 uppercase tracking-widest transition-all">Annulla</button>
                                            <button onClick={() => setSigStep(6)} className="bg-cyan-500 hover:bg-cyan-400 py-3 rounded-xl font-black text-[10px] text-white uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all">Invia</button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Passo 6: Inserimento OTP */}
                        {sigStep === 6 && (
                            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl max-sm w-full overflow-hidden border border-slate-200">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-center text-left">
                                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Inserisci il codice OTP</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Inserisci il codice a 4 cifre ricevuto via SMS</p>
                                    </div>
                                    <div className="p-8 space-y-8">
                                        <div className="flex justify-center gap-4">
                                            {otp.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => {
                                                        const newOtp = [...otp];
                                                        newOtp[idx] = e.target.value.replace(/[^0-9]/g, '');
                                                        setOtp(newOtp);
                                                        if (e.target.value && idx < 3) {
                                                            const next = e.target.nextElementSibling as HTMLInputElement;
                                                            next?.focus();
                                                        }
                                                    }}
                                                    className="w-12 h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl font-black text-slate-800 focus:border-cyan-500 focus:bg-white outline-none transition-all"
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setSigStep(7)}
                                            disabled={otp.some(d => !d)}
                                            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${otp.every(d => d) ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-100 text-slate-300'}`}
                                        >
                                            Conferma Firma
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Passo 8: Completa Documento Confirm (Foto 18) */}
                        {sigStep === 8 && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-left">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Completa documento</h3>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">Sei sicuro di voler completare il documento?</p>
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => setSigStep(7)} className="bg-white border border-slate-200 py-3 px-6 rounded-xl font-black text-[10px] text-slate-400 uppercase tracking-widest">Annulla</button>
                                            <button onClick={() => setSigStep(9)} className="bg-cyan-500 hover:bg-cyan-400 py-3 px-6 rounded-xl font-black text-[10px] text-white uppercase tracking-widest shadow-lg shadow-cyan-500/20">Completa</button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Passo 9: Scarica Documento (Foto 19) */}
                        {sigStep === 9 && (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 text-left">
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
                                    <div className="bg-slate-50 p-6 border-b border-slate-100 text-left">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Scarica il documento</h3>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-4">
                                            <p className="text-xs font-bold text-slate-500">Grazie per aver firmato con eSignAnyWhere!</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                {['Documento', 'Audit Trail', 'Documento & Audit Trail', 'Documento & Audit Trail compressi'].map((type) => (
                                                    <button key={type} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[11px] text-slate-700 hover:bg-slate-100 transition-colors">
                                                        <Upload size={14} className="text-blue-500 rotate-180" />
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="pt-4 border-t border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Documento/i originale/i</p>
                                                <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl font-bold text-[11px] text-blue-600 hover:border-blue-500 transition-all">
                                                    <FileText size={14} />
                                                    Contratto_CTE_118394_1744645837.pdf
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button onClick={handleNext} className="bg-white border border-slate-200 py-3 px-8 rounded-xl font-black text-[10px] text-slate-700 uppercase tracking-widest hover:bg-slate-50">Chiudi</button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const renderStep9 = () => (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20"><PartyPopper size={48} className="text-emerald-500" /></div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{t('academy.contract.success_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-12 max-w-sm mx-auto leading-relaxed">{t('academy.contract.success_desc')}</p>
            <button onClick={() => { setCurrentStep(1); setFormData({ firstName: '', lastName: '', email: '', fiscalCode: '', city: '', address: '', zip: '', podPdr: '', power: '3.3', consumption: '', isDemo: false }); setSelectedProfile(null); setAcceptanceChecks({ check1: false, check2: false, check3: false, check4: false, check5: false, check6: false, check7: false, check8: false }); setSigStep(1); }} className="bg-[#FF6600] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-orange-500/20 active:scale-95 transition-all uppercase text-sm tracking-widest">{t('academy.contract.new_sim')}</button>
        </motion.div>
    );

    return (
        <div id="contract-form-container" className="h-full bg-transparent overflow-hidden flex flex-col no-scrollbar">
            {currentStep < 9 && (
                <div className="shrink-0 mb-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                <h1 className="text-xl font-black text-[#003366] dark:text-blue-400 tracking-tight leading-none">{currentStep >= 5 ? `Contratto GRPD119394` : t('academy.contract.title')}</h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{t('academy.contract.tutorial_tag')}</p>
                            </div>
                        </div>
                        <button onClick={populateDemoData} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"><User size={14} className="text-orange-500" />{t('academy.contract.demo_btn')}</button>
                    </div>
                    {renderProgress()}
                </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}
                    {currentStep === 6 && renderStep6()}
                    {currentStep === 7 && renderStep7()}
                    {currentStep === 8 && renderStep8()}
                    {currentStep === 9 && renderStep9()}
                </AnimatePresence>
            </div>

            {currentStep < 8 && currentStep !== 4 && currentStep !== 5 && currentStep !== 6 && (
                <div className="shrink-0 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-between gap-4">
                    <button onClick={handleBack} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-sm transition-all ${currentStep === 1 ? 'opacity-30 cursor-not-allowed text-gray-400' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-lg active:scale-95'}`}><ArrowLeft size={18} />{t('common.back')}</button>
                    <button onClick={handleNext} className="bg-[#FF6600] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 hover:bg-orange-600 active:scale-95 transition-all">{t('academy.contract.next_btn')} <ArrowRight size={18} /></button>
                </div>
            )}

            <AIScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onConfirm={handleApplyScan} scanType={lastScanType} />

            <style>{`
                .lbl { display: block; font-size: 10px; font-weight: 800; color: #64748b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
                .dark .lbl { color: #94a3b8; }
                .inp { width: 100%; background-color: white; border: 2px solid #f1f5f9; border-radius: 1rem; padding: 12px 16px; font-size: 14px; font-weight: 700; color: #1e293b; outline: none; transition: all 0.2s; }
                .dark .inp { background-color: #0f172a; border-color: #1e293b; color: #f1f5f9; }
                .inp:focus { border-color: #FF6600; background-color: #fffaf5; box-shadow: 0 0 0 4px rgba(255, 102, 0, 0.1); }
                .dark .inp:focus { background-color: #0f172a; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ContractSimulator;
