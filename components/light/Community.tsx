import React from 'react';
import { UNLOCK_CONDITIONS } from './constants';
import { Lock, Unlock, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityProps {
    personalUnits: number;
}

const Community: React.FC<CommunityProps> = ({ personalUnits }) => {
    const levels = [
        { id: 0, label: 'Livello 0', condition: 0, desc: 'Commissioni Dirette (Collaboratori)' },
        { id: 1, label: 'Livello 1', condition: UNLOCK_CONDITIONS.LEVEL_1, desc: 'Rendita Indiretta 1° Livello' },
        { id: 2, label: 'Livello 2', condition: UNLOCK_CONDITIONS.LEVEL_2, desc: 'Rendita Indiretta 2° Livello' },
        { id: 3, label: 'Livello 3', condition: UNLOCK_CONDITIONS.LEVEL_3, desc: 'Rendita Indiretta 3° Livello' },
        { id: 4, label: 'Livello 4', condition: UNLOCK_CONDITIONS.LEVEL_4, desc: 'Rendita Indiretta 4° Livello' },
        { id: 5, label: 'Livello 5', condition: UNLOCK_CONDITIONS.LEVEL_5, desc: 'Rendita Indiretta 5° Livello' },
    ];

    return (
        <div className="space-y-6 pb-20 sm:pb-0">
            <div className="glass-card-light p-6 border-l-4 border-union-green-500">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-2 text-union-black">
                    <Users className="text-union-green-500 w-5 h-5" />
                    Community Sync
                </h2>
                <p className="text-xs opacity-60 mb-6 text-union-black">Sblocca i livelli di profondità della tua rete in base alle tue utenze personali attive.</p>

                <div className="space-y-3">
                    {levels.map((level, i) => {
                        const isUnlocked = personalUnits >= level.condition;

                        return (
                            <motion.div
                                key={level.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-4 rounded-2xl flex items-center justify-between transition-all duration-500 border-2 ${isUnlocked
                                    ? 'bg-union-green-500/5 border-union-green-500/20 shadow-sm'
                                    : 'bg-gray-50 border-gray-100 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isUnlocked ? 'bg-union-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
                                    </div>
                                    <div>
                                        <p className={`text-xs font-black uppercase tracking-wider ${isUnlocked ? 'text-union-green-600' : 'text-gray-400'}`}>
                                            {level.label}
                                        </p>
                                        <p className="text-[10px] font-medium text-gray-400">{level.desc}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {isUnlocked ? (
                                        <div className="flex items-center gap-1 text-union-green-600 font-bold text-[10px] uppercase">
                                            <CheckCircle2 size={12} />
                                            Sbloccato
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-black text-gray-400 uppercase">
                                            Richiede {level.condition} utenze
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-card-light p-5 bg-gradient-to-br from-union-green-50 to-white border-union-green-100">
                <p className="text-[10px] text-union-green-800 font-bold leading-relaxed text-center italic">
                    "Più utenze personali gestisci, più in profondità viene calcolata la tua rendita passiva sulla rete."
                </p>
            </div>
        </div>
    );
};

export default Community;
