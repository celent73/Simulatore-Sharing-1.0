import React, { useState } from 'react';
import { Lightbulb, ShoppingBag, Users, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
import { useLanguage } from '../../contexts/LanguageContext';

interface RoadToZeroProps {
    networkSize: number[];
    utilityType: 'DOMESTIC' | 'BUSINESS';
    monthRange: string;
    personalUnits: number;
}

const RoadToZero: React.FC<RoadToZeroProps> = ({ networkSize, utilityType, monthRange, personalUnits }) => {
    const { t } = useLanguage();
    const [billAmount, setBillAmount] = useState(80);
    const [monthlySpending, setMonthlySpending] = useState(400);

    const cashback = monthlySpending * 0.03; // 3% average cashback

    // Calculate actual earnings from network
    const commissions = utilityType === 'DOMESTIC' ? (
        monthRange === '1' ? LEVEL_COMMISSIONS.DOMESTIC.RECURRING :
            monthRange === '13' ? LEVEL_COMMISSIONS.DOMESTIC.RECURRING_13_24 :
                LEVEL_COMMISSIONS.DOMESTIC.RECURRING_25_PLUS
    ) : (
        monthRange === '1' ? LEVEL_COMMISSIONS.BUSINESS.RECURRING :
            monthRange === '13' ? LEVEL_COMMISSIONS.BUSINESS.RECURRING_13_24 :
                LEVEL_COMMISSIONS.BUSINESS.RECURRING_25_PLUS
    );

    let networkEarnings = 0;
    networkSize.forEach((count, i) => {
        let isUnlocked = true;
        if (i === 1) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_1;
        else if (i === 2) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_2;
        else if (i === 3) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_3;
        else if (i === 4) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_4;
        else if (i === 5) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_5;

        if (isUnlocked) {
            networkEarnings += count * commissions[i];
        }
    });

    // Also add personal units earnings
    networkEarnings += personalUnits * commissions[0];

    const totalDiscount = cashback + networkEarnings;
    const isZeroed = totalDiscount >= billAmount;
    const progress = Math.min(100, (totalDiscount / billAmount) * 100);

    return (
        <div className="space-y-6 pb-20 sm:pb-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-light p-6 border-b-4 border-union-green-500"
            >
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-union-black">
                    <Lightbulb className="text-yellow-500 w-5 h-5" />
                    {t('light_simulator.rtz_title')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold opacity-40 text-union-black">{t('light_simulator.rtz_bill')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                            <input
                                type="number"
                                value={billAmount || ''}
                                onChange={(e) => setBillAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-union-light p-3 pl-8 rounded-xl font-bold focus:ring-2 focus:ring-union-green-500 outline-none transition-all text-union-black"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold opacity-40 text-union-black">{t('light_simulator.rtz_spend')}</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                            <input
                                type="number"
                                value={monthlySpending || ''}
                                onChange={(e) => setMonthlySpending(e.target.value === '' ? 0 : Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-union-light p-3 pl-8 rounded-xl font-bold focus:ring-2 focus:ring-union-green-500 outline-none transition-all text-union-black"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Progress Visualizer */}
                <div className="mb-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400">{t('light_simulator.rtz_coverage')}</p>
                            <h3 className="text-2xl font-black text-union-black">€{totalDiscount.toFixed(2)} <span className="text-xs font-bold text-gray-400">/ €{billAmount}</span></h3>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black ${isZeroed ? 'bg-union-green-500 text-white' : 'bg-union-green-100 text-union-green-600'}`}>
                            {isZeroed ? t('light_simulator.rtz_zeroed') : `${Math.round(progress)}%`}
                        </div>
                    </div>

                    <div className="h-4 bg-white rounded-full overflow-hidden border border-gray-200">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full transition-colors duration-500 ${isZeroed ? 'bg-union-green-500 shadow-[0_0_15px_rgba(46,204,113,0.5)]' : 'bg-union-green-500/60'}`}
                        />
                    </div>
                </div>

                {/* Results Section Breakdown */}
                <motion.div
                    layout
                    className="relative p-6 bg-union-black text-white rounded-[2rem] overflow-hidden shadow-2xl"
                >
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold opacity-60">{t('light_simulator.rtz_detail')}</p>
                            {isZeroed && <CheckCircle2 className="text-union-green-500 w-5 h-5" />}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <ShoppingBag className="w-5 h-5 mb-2 text-union-green-500" />
                                <p className="text-lg font-black text-white">€{cashback.toFixed(2)}</p>
                                <p className="text-[9px] opacity-40 uppercase font-bold">{t('light_simulator.rtz_from_spend')}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <TrendingUp className="w-5 h-5 mb-2 text-union-green-500" />
                                <p className="text-lg font-black text-white">€{networkEarnings.toFixed(2)}</p>
                                <p className="text-[9px] opacity-40 uppercase font-bold">{t('light_simulator.rtz_from_comm')}</p>
                            </div>
                        </div>

                        {!isZeroed && (
                            <div className="pt-2 text-center">
                                <p className="text-[10px] font-medium text-white/60">
                                    {t('light_simulator.rtz_missing').replace('{{n}}', (billAmount - totalDiscount).toFixed(2))}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-union-green-500/10 blur-3xl -mr-10 -mt-10"></div>
                </motion.div>
            </motion.div>

            <div className="flex items-center gap-3 p-4 bg-union-green-500/5 rounded-2xl border border-union-green-500/10">
                <CheckCircle2 className="text-union-green-500 w-6 h-6 shrink-0" />
                <p className="text-[10px] opacity-60 leading-relaxed italic text-union-black font-medium">
                    {t('light_simulator.rtz_note')}
                </p>
            </div>
        </div>
    );
};

export default RoadToZero;
