import React from 'react';

interface LegalFooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookie') => void;
}

const LegalFooter: React.FC<LegalFooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full py-12 px-6 bg-footer-dynamic border-t border-slate-800 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl opacity-80">
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <button onClick={() => onOpenLegal('terms')} className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold transition-colors">Termini</button>
          <button onClick={() => onOpenLegal('privacy')} className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold transition-colors">Privacy</button>
          <button onClick={() => onOpenLegal('cookie')} className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold transition-colors">Cookie</button>
        </div>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto uppercase tracking-wider mb-4">
          Tutti i diritti riservati © {new Date().getFullYear()} - Sharing Simulator v1.2.30
        </p>
        <p className="text-[10px] text-slate-500 font-medium max-w-2xl mx-auto italic">
          I risultati sono proiezioni matematiche e non costituiscono garanzia di guadagno.
        </p>
        <p className="mt-2 text-[8px] opacity-50 uppercase tracking-[0.2em] font-black">
          v1.2.30 - Protetto da crittografia SSL a 256 bit 🔒
        </p>
      </div>
    </footer>
  );
};

export default LegalFooter;