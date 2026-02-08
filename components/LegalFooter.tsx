import React from 'react';

interface LegalFooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookie') => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({ onOpenLegal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 text-slate-400 text-sm transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-xs uppercase tracking-widest opacity-70">
          &copy; {currentYear} Sharing Simulator. Tutti i diritti riservati. <span className="ml-2 font-black text-union-orange-500">v1.1.50</span>
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-6">
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors underline decoration-dotted">
            Privacy Policy
          </button>
          <button onClick={() => onOpenLegal('terms')} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors underline decoration-dotted">
            Termini e Condizioni
          </button>
          <button onClick={() => onOpenLegal('cookie')} className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors underline decoration-dotted">
            Cookie Policy
          </button>
        </div>

        <p>
          DISCLAIMER: Applicazione indipendente a scopo puramente illustrativo ed educativo.
          NON è un prodotto ufficiale di Union Energia S.r.l.
          I risultati sono proiezioni matematiche e non costituiscono garanzia di guadagno.
        </p>
        <p className="mt-2 text-[8px] opacity-50 uppercase tracking-[0.2em] font-black">
          v1.1.50 - Protetto da crittografia SSL a 256 bit 🔒
        </p>
      </div>
    </footer>
  );
};