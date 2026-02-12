import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';

interface BonusProgressProps {
  totalContracts: number;
  onBonusChange?: (bonusAmount: number) => void;
}

const MedalIcon = () => (
  <span className="text-2xl mr-2">🥇</span>
);

const TrophyIcon = () => (
  <span className="text-2xl mr-2">🏆</span>
);

const CrownIcon = () => (
  <span className="text-2xl mr-2">👑</span>
);

const ProgressBar = ({ current, target, isCompleted }: { current: number; target: number; isCompleted: boolean }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="w-full h-3 bg-slate-200/50 rounded-full mt-3 overflow-hidden shadow-inner border border-slate-300/30">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isCompleted ? 'bg-emerald-500' : 'bg-blue-600'}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface BonusCardProps {
  icon: React.ReactNode;
  level: string;
  levelNum: number;
  bonusAmount: string;
  target: number;
  current: number;
  t: any;
  managerTitleKey?: string;
  monthlyBonus: number;
  isActive: boolean;
  onToggle: () => void;
}

const BonusCard: React.FC<BonusCardProps> = ({
  icon,
  level,
  levelNum,
  bonusAmount,
  target,
  current,
  t,
  managerTitleKey,
  monthlyBonus,
  isActive,
  onToggle
}) => {
  const { language } = useLanguage();
  const remaining = target - current;
  const isCompleted = remaining <= 0;
  const locale = language === 'it' ? 'it-IT' : (language === 'de' ? 'de-DE' : 'en-US');

  return (
    <div className={`
        relative p-6 rounded-[2rem] border-2 transition-all duration-300 backdrop-blur-xl
        ${isCompleted
        ? 'bg-amber-50/60 border-amber-200/80 shadow-md scale-[1.02]'
        : 'bg-white/70 border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300/80'}
    `}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center flex-1">
          <div className="p-2 bg-white/50 rounded-xl shadow-sm mr-2">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-gray-900 text-sm tracking-tight">{level} {levelNum}</h4>
              {isCompleted && managerTitleKey && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border-2 border-amber-200 uppercase tracking-tighter shadow-sm">
                  {t(managerTitleKey)}
                </span>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{t('focus_mode.active')}</span>
                  <button
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors shadow-inner ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                    role="switch"
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <span className={`font-black text-base ${isCompleted ? 'text-amber-600' : 'text-blue-700'} drop-shadow-sm`}>{bonusAmount}</span>
      </div>

      <ProgressBar current={current} target={target} isCompleted={isCompleted} />

      <div className="text-[10px] text-slate-500 mt-3 font-black uppercase tracking-widest flex justify-between items-center">
        <span>{t('bonus.card_done')}: <span className="text-gray-900">{current.toLocaleString(locale)}</span></span>
        {!isCompleted && <span>{t('bonus.card_remaining_prefix')}: <span className="text-red-500 animate-pulse">{remaining.toLocaleString(locale)}</span></span>}
        {isCompleted && isActive && (
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
            +€{monthlyBonus.toLocaleString(locale)}{t('results.per_month')}
          </span>
        )}
      </div>
    </div>
  );
};

const BonusProgress: React.FC<BonusProgressProps> = ({ totalContracts, onBonusChange }) => {
  const { t } = useLanguage();

  const [activeBonuses, setActiveBonuses] = useState<{ [key: number]: boolean }>({
    600: false,
    1500: false,
    5000: false
  });

  const milestones = [
    { target: 600, amount: `+300€${t('results.per_month')}`, icon: <MedalIcon />, levelNum: 600, managerTitleKey: "bonus.role_pro", monthlyBonus: 300 },
    { target: 1500, amount: `+1000€${t('results.per_month')}`, icon: <TrophyIcon />, levelNum: 1500, managerTitleKey: "bonus.role_reg", monthlyBonus: 1000 },
    { target: 5000, amount: `+3000€${t('results.per_month')}`, icon: <CrownIcon />, levelNum: 5000, managerTitleKey: "bonus.role_nat", monthlyBonus: 3000 },
  ];

  React.useEffect(() => {
    let highestBonus = 0;
    milestones.forEach(milestone => {
      if (activeBonuses[milestone.levelNum] && totalContracts >= milestone.target) {
        if (milestone.monthlyBonus > highestBonus) {
          highestBonus = milestone.monthlyBonus;
        }
      }
    });
    if (onBonusChange) onBonusChange(highestBonus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalContracts, activeBonuses, onBonusChange]);

  const handleToggle = (levelNum: number) => {
    setActiveBonuses(prev => {
      const newState = { ...prev, [levelNum]: !prev[levelNum] };
      return newState;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[3rem] shadow-xl border-2 border-slate-100 relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl shadow-sm">🎯</div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('bonus.title')}</h2>
          <SharyTrigger message="..." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {milestones.map((milestone) => (
            <BonusCard
              key={milestone.target}
              current={totalContracts}
              target={milestone.target}
              icon={milestone.icon}
              level={t('bonus.level')}
              levelNum={milestone.levelNum}
              bonusAmount={milestone.amount}
              managerTitleKey={milestone.managerTitleKey}
              t={t}
              monthlyBonus={milestone.monthlyBonus}
              isActive={activeBonuses[milestone.levelNum]}
              onToggle={() => handleToggle(milestone.levelNum)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusProgress;