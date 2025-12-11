import React from 'react';
import { X, Shield, FileText, Cookie } from 'lucide-react';

type LegalType = 'privacy' | 'terms' | 'cookie' | 'none';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void; 
  onAccept?: () => void; 
  type: LegalType;
  mode: 'startup' | 'view';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, onAccept, type, mode }) => {
  if (!isOpen) return null;

  const content = {
    privacy: {
      title: "Privacy Policy",
      icon: <Shield size={24} className="text-green-600" />,
      text: (
        <div className="space-y-4">
            <p><strong>1. Titolare del Trattamento</strong><br/>Il titolare del trattamento è <strong>Luca Celentano</strong>.<br/>Per qualsiasi informazione o richiesta, puoi contattare il titolare all'indirizzo email: <strong>celesharing@gmail.com</strong></p>
            <p><strong>2. Dati Raccolti</strong><br/>Questa applicazione raccoglie esclusivamente i dati tecnici strettamente necessari al funzionamento del simulatore (es. preferenze di calcolo inserite localmente nel tuo dispositivo). Non vengono raccolti dati sensibili, nomi o indirizzi senza il tuo esplicito consenso.</p>
            <p><strong>3. Finalità del Trattamento</strong><br/>I dati vengono utilizzati unicamente per fornire il servizio di simulazione economica e per migliorare l'esperienza utente. Nessun dato viene ceduto a terzi per finalità di marketing.</p>
            <p><strong>4. Diritti dell'Utente</strong><br/>In conformità al GDPR, hai il diritto di chiedere l'accesso, la rettifica o la cancellazione dei tuoi dati contattando il titolare all'indirizzo sopra indicato.</p>
        </div>
      )
    },
    terms: {
      title: "Termini e Condizioni",
      icon: <FileText size={24} className="text-blue-600" />,
      text: (
        <div className="space-y-4">
            <p><strong>1. Accettazione dei Termini</strong><br/>Utilizzando questa applicazione ("Simulatore Sharing"), accetti di essere vincolato dai presenti Termini e Condizioni. Se non accetti, ti invitiamo a non utilizzare l'app.</p>
            <p><strong>2. Scopo dell'App</strong><br/>L'applicazione è uno strumento di simulazione matematica a scopo puramente illustrativo ed educativo. I risultati generati sono stime basate sui dati inseriti dall'utente e non costituiscono in alcun modo una promessa di guadagno, un'offerta finanziaria o una garanzia di risultato.</p>
            <p><strong>3. Limitazione di Responsabilità</strong><br/>L'autore (Luca Celentano) non è responsabile per eventuali decisioni economiche prese sulla base delle simulazioni fornite. L'utente si assume la piena responsabilità dell'uso delle informazioni. Questa app non è un prodotto ufficiale di Union Energia.</p>
            <p><strong>4. Proprietà Intellettuale</strong><br/>Tutti i contenuti, il codice, il design e la logica di calcolo sono di proprietà esclusiva di Luca Celentano. È vietata la copia, la ridistribuzione o il reverse engineering senza autorizzazione.</p>
        </div>
      )
    },
    cookie: {
      title: "Cookie Policy",
      icon: <Cookie size={24} className="text-orange-600" />,
      text: (
        <div className="space-y-4">
            <p><strong>1. Cosa sono i cookie</strong><br/>I cookie sono piccoli file di testo che i siti salvano sul tuo dispositivo per ricordare le tue preferenze.</p>
            <p><strong>2. Cookie Tecnici (Essenziali)</strong><br/>Questa applicazione utilizza esclusivamente cookie tecnici e di sessione (LocalStorage) necessari per salvare le tue impostazioni (es. modalità scura, dati della simulazione) e garantire il corretto funzionamento dell'app. Non utilizziamo cookie di profilazione o di terze parti per tracciamento pubblicitario.</p>
            <p><strong>3. Gestione dei Cookie</strong><br/>Puoi cancellare i dati salvati in qualsiasi momento tramite le impostazioni del tuo browser o utilizzando la funzione "Reset" all'interno dell'applicazione.</p>
        </div>
      )
    },
    startup: {
      title: "Benvenuto nel Simulatore",
      icon: <Shield size={24} className="text-union-blue-600" />,
      text: (
        <div className="space-y-4">
          <p className="font-bold text-red-500">DISCLAIMER IMPORTANTE</p>
          <p>Questo strumento è un simulatore a scopo puramente illustrativo. I risultati non garantiscono guadagni reali.</p>
          <p>Continuando, dichiari di accettare i <strong>Termini e Condizioni</strong> e di aver preso visione della <strong>Privacy Policy</strong> di Luca Celentano.</p>
        </div>
      )
    }
  };

  const currentContent = mode === 'startup' ? content.startup : (type !== 'none' ? content[type] : content.privacy);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative flex flex-col max-h-[85vh]">
        
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            {currentContent.icon}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentContent.title}</h2>
            {mode === 'view' && (
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X size={24} />
                </button>
            )}
        </div>

        <div className="overflow-y-auto pr-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed custom-scrollbar">
            {currentContent.text}
        </div>

        {mode === 'startup' && onAccept && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                    onClick={onAccept}
                    className="w-full py-3 bg-union-blue-600 text-white font-bold rounded-xl hover:bg-union-blue-700 transition-all shadow-lg"
                >
                    Ho capito e Accetto
                </button>
            </div>
        )}
      </div>
    </div>
  );
};