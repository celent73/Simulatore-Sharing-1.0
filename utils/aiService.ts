import { GoogleGenerativeAI } from "@google/generative-ai";
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker locally to avoid CORS issues
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface ExtractedBillData {
    type: 'electricity' | 'gas' | 'both' | 'unknown';
    electricity?: {
        consumption?: number; // kWh
        fixedCosts?: number;
        pun?: number;
        spread?: number;
        totalAmount?: number;
    };
    gas?: {
        consumption?: number; // Smc
        fixedCosts?: number;
        psv?: number;
        spread?: number;
        totalAmount?: number;
    };
}

/**
 * Converts up to the first 3 pages of a base64 PDF to a single vertical base64 JPEG image.
 */
async function convertPdfToImage(base64Pdf: string): Promise<string> {
    try {
        const base64Data = base64Pdf.split(',')[1] || base64Pdf;
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = pdfjsLib.getDocument({ data: bytes });
        const pdf = await loadingTask.promise;

        // Determine how many pages to render (max 3)
        const pagesToRender = Math.min(pdf.numPages, 3);
        const scale = 1.0; // Standard scale is sufficient for text
        const pageCanvases: HTMLCanvasElement[] = [];
        let totalHeight = 0;
        let maxWidth = 0;

        for (let i = 1; i <= pagesToRender; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) throw new Error("Could not create canvas context");

            await page.render({ canvasContext: context, viewport: viewport } as any).promise;

            pageCanvases.push(canvas);
            totalHeight += viewport.height;
            maxWidth = Math.max(maxWidth, viewport.width);
        }

        // Stitch them together
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = maxWidth;
        finalCanvas.height = totalHeight;
        const finalContext = finalCanvas.getContext('2d');
        if (!finalContext) throw new Error("Could not create final canvas context");

        let currentY = 0;
        for (const canvas of pageCanvases) {
            finalContext.drawImage(canvas, 0, currentY);
            currentY += canvas.height;
        }

        return finalCanvas.toDataURL('image/jpeg', 0.80); // Compressed for speed
    } catch (error) {
        console.error("PDF Conversion Error:", error);
        throw new Error("Impossibile convertire il PDF in immagine. Riprova o usa un'immagine JPG/PNG.");
    }
}

export const analyzeBillImage = async (inputBase64: string, priorityType: 'electricity' | 'gas' | 'any' = 'any'): Promise<ExtractedBillData | null> => {
    if (!genAI) {
        console.error("Gemini API Key missing. Please add VITE_GEMINI_API_KEY to .env.local");
        return null;
    }

    try {
        let imageToSend = inputBase64;
        let mimeType = "image/jpeg";

        // Handle PDF Detection and Conversion
        if (inputBase64.includes("application/pdf") || inputBase64.startsWith("JVBERi0")) {
            console.log("Detected PDF. Converting first 3 pages to stitched image...");
            imageToSend = await convertPdfToImage(inputBase64);
            mimeType = "image/jpeg";
        } else {
            const matches = inputBase64.match(/^data:([^;]+);base64,(.+)$/);
            if (matches) {
                mimeType = matches[1];
            }
        }

        const base64Data = imageToSend.includes("base64,") ? imageToSend.split(",")[1] : imageToSend;
        const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash-001", "gemini-1.5-flash-8b", "gemini-2.0-flash-lite-001", "gemini-2.0-flash"];
        let errors: string[] = [];
        let responseText = null;

        let focusInstruction = "";
        if (priorityType === 'electricity') {
            focusInstruction = "CONCENTRATI ESCLUSIVAMENTE SUI DATI DELL'ENERGIA ELETTRICA (LUCE). Se trovi anche Gas, ignoralo o estrailo solo se evidente.";
        } else if (priorityType === 'gas') {
            focusInstruction = "CONCENTRATI ESCLUSIVAMENTE SUI DATI DEL GAS METANO. Se trovi anche Luce, ignorala o estraila solo se evidente.";
        }

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting analysis with model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `
              Analizza questa immagine (contenente le prime 3 pagine della bolletta).
              Il tuo obiettivo è estrarre i dati tecnici specifici per una simulazione precisa.
              ${focusInstruction}
              
              IMPORTANTE SU CALCOLI E FORMATO JSON:
              - NON SCRIVERE OPERAZIONI MATEMATICHE (es. "24.90 + 1.90"). È VIETATO!
              - FAI I CALCOLI MENTALMENTE e scrivi SOLO IL RISULTATO FINALE (es. "26.80").
              - Usa il PUNTO per i decimali (es. 0.05). Usa null se assente.

              ESTRAI I SEGUENTI DATI CON PRECISIONE:

              1. ENERGIA ELETTRICA (Luce):
                 - "consumption": CONSUMO MENS (kWh).
                 - "fixedCosts": COSTO FISSO MENS (€). SOMMA: PCV, Quota fisse, "Spesa trasporto e gestione contatore", "Oneri di sistema", "ACCISE", "IVA/Imposte", "Canone RAI". Tutto tranne la materia energia.
                 - "pun": Prezzo €/kWh (solo quota energia, escluso spread).
                 - "spread": SPREAD / MARGINE (€/kWh).
                 - "totalAmount": Totale bolletta.

              2. GAS NATURALE:
                 - "consumption": CONSUMO MENS (Smc).
                 - "fixedCosts": COSTO FISSO MENS (€). SOMMA: QVD, Quota fisse, "Spesa trasporto", "Oneri di sistema", "ACCISE", "IVA/Imposte". Tutto tranne materia prima.
                 - "psv": Prezzo €/Smc.
                 - "spread": SPREAD / MARGINE (€/Smc). Cerca: "Spread", "Fee", "Corrispettivo variabile", "Quota vendita". Se esplicito.

              Rispondi SOLO JSON:
              {
                "type": "electricity" | "gas" | "both" | "unknown",
                "electricity": { "consumption": number|null, "fixedCosts": number|null, "pun": number|null, "spread": number|null, "totalAmount": number|null },
                "gas": { "consumption": number|null, "fixedCosts": number|null, "psv": number|null, "spread": number|null, "totalAmount": number|null }
              }
            `;

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(`Timeout model ${modelName}`)), 60000)
                );

                const result = await Promise.race([
                    model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: mimeType,
                            },
                        },
                    ]),
                    timeoutPromise
                ]) as any;

                const response = await result.response;
                responseText = response.text();

                if (responseText && responseText.trim().length > 0) {
                    console.log(`Success with model: ${modelName}`);
                    break; // Success!
                }

            } catch (err: any) {
                console.warn(`Failed with model ${modelName}:`, err.message);
                errors.push(`${modelName}: ${err.message}`);
                // Continue to next model
            }
        }

        if (!responseText || responseText.trim().length === 0) {
            const errorMsg = errors.length > 0 ? errors.join(" | ") : "Tutti i modelli hanno fallito senza errori specifici.";
            throw new Error(`Analisi fallita. Dettagli errori: ${errorMsg}`);
        }

        console.log("--- GEMINI RESPONSE START ---");
        console.log(responseText);
        console.log("--- GEMINI RESPONSE END ---");

        // Extract JSON from response (sometimes AI wraps in ```json)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                console.log("Successfully parsed JSON:", parsed);
                return parsed as ExtractedBillData;
            } catch (pErr) {
                console.error("JSON Parse Error:", pErr, "Original text:", jsonMatch[0]);
                throw new Error("Errore nel parsing della risposta dell'IA.");
            }
        }

        console.warn("No JSON pattern found in AI response.");
        throw new Error("L'IA non ha restituito un formato valido.");

    } catch (error: any) {
        console.error("CRITICAL ERROR in analyzeBillImage:", error);

        // Propagate specific errors
        if (error.message?.includes("convertire il PDF")) {
            throw error; // Re-throw PDF errors as is
        }

        // Throw the raw error to see the details in the UI
        throw error;
    }
};
