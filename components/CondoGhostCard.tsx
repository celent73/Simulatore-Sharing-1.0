
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CondoGhostCardProps {
  recurringMonthlyYear3: number;
}

const CondoGhostCard: React.FC<CondoGhostCardProps> = ({ recurringMonthlyYear3 }) => {
  const [feePerUnit, setFeePerUnit] = useState<number>(80); // Parcella media annuale per unità (es. 80€)
  const [unitsPerCondo, setUnitsPerCondo] = useState<number>(20); // Unità medie per condominio
  const { t } = useLanguage();

  const recurringAnnual = recurringMonthlyYear3 * 12;
  
  // Calcoli
  const equivalentUnits = feePerUnit > 0 ? Math.round(recurringAnnual / feePerUnit) : 0;
  const equivalentCondos = unitsPerCondo > 0 ? (equivalentUnits / unitsPerCondo).toFixed(1) : "0";

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl shadow-xl border border-indigo-500/60 p-6 sm:p-8 overflow-hidden relative mt-8 group hover:border-indigo-400 transition-all">
       
       {/* Background effects */}
       <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-purple-500/10 rounded-full blur-[80px]"></div>
           {/* Floating Icons */}
           <div className="absolute top-10 right-10 text-6xl opacity-10 transform rotate-12">👻</div>
       </div>

       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Controls & Concept */}
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <span>👻</span> {t('ghost.tag')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white tracking-tight">
                {t('ghost.title')}
              </h2>
              <p className="text-indigo-200 mb-6 leading-relaxed text-sm sm:text-base">
                  {t('ghost.desc')}
              </p>
              
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4">
                  <div>
                      <div className="flex justify-between items-end mb-2">
                          <label className="text-xs text-indigo-300 uppercase font-bold tracking-wider">{t('ghost.fee_label')}</label>
                          <span className="font-bold text-white">{feePerUnit} €</span>
                      </div>
                      <input 
                            type="range" 
                            min="30" 
                            max="200" 
                            step="5"
                            value={feePerUnit}
                            onChange={(e) => setFeePerUnit(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 hover:accent-indigo-300 transition-all"
                        />
                  </div>
                   <div>
                      <div className="flex justify-between items-end mb-2">
                          <label className="text-xs text-indigo-300 uppercase font-bold tracking-wider">{t('ghost.size_label')}</label>
                          <span className="font-bold text-white">{unitsPerCondo} Unità</span>
                      </div>
                      <input 
                            type="range" 
                            min="5" 
                            max="100" 
                            step="5"
                            value={unitsPerCondo}
                            onChange={(e) => setUnitsPerCondo(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 hover:accent-indigo-300 transition-all"
                        />
                  </div>
              </div>
          </div>

          {/* Right: Visualizer */}
          <div className="flex flex-col gap-4">
              
              {/* Scenario TRADIZIONALE */}
              <div className="bg-white/5 border border-white/20 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden grayscale opacity-70">
                  <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      😓
                  </div>
                  <div>
                      <h4 className="text-gray-300 font-bold text-sm uppercase">{t('ghost.traditional')}</h4>
                      <p className="text-white font-bold text-lg leading-tight">
                         +{equivalentCondos} {t('ghost.new_condos')}
                      </p>
                      <p className="text-xs text-red-400 mt-1 font-medium">
                         ⚠️ +{equivalentCondos} {t('ghost.stress_warn')}
                      </p>
                  </div>
              </div>

              {/* ARROW */}
              <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-slate-800 p-1 rounded-full border border-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                    </svg>
                  </div>
              </div>

              {/* Scenario UNION */}
              <div className="bg-gradient-to-r from-indigo-600/40 to-purple-600/40 border border-indigo-400 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden shadow-lg shadow-indigo-500/20 transform scale-105">
                   <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shrink-0 shadow-lg relative z-10">
                      👻
                  </div>
                  <div className="relative z-10">
                      <h4 className="text-indigo-200 font-bold text-sm uppercase">{t('ghost.union_way')}</h4>
                      <p className="text-white font-bold text-lg leading-tight">
                         +{equivalentCondos} {t('ghost.ghost_condos')}
                      </p>
                      <p className="text-xs text-emerald-300 mt-1 font-bold">
                         ✅ {t('ghost.union_benefit')}
                      </p>
                  </div>
              </div>

              <div className="text-center mt-2">
                  <p className="text-xs text-indigo-300">
                      {t('ghost.summary')} <strong className="text-white">{equivalentUnits} {t('ghost.units_extra')}</strong> {t('ghost.no_effort')}
                  </p>
              </div>

          </div>
       </div>

    </div>
  );
};

export default CondoGhostCard;
