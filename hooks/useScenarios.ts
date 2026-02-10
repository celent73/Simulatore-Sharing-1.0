import { useState, useEffect } from 'react';
import { PlanInput, CondoInput, ViewMode, SavedScenario } from '../types';

const STORAGE_KEY = 'sharing_simulator_scenarios_v1';

export const useScenarios = () => {
    const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

    // Carica scenari all'avvio
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setScenarios(JSON.parse(saved));
            } catch (e) {
                console.error("Errore nel parsing degli scenari salvati", e);
                // Se c'è un errore, magari resettiamo o lasciamo vuoto, ma meglio non cancellare tutto subito per sicurezza
            }
        }
    }, []);

    const saveToStorage = (newScenarios: SavedScenario[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newScenarios));
            setScenarios(newScenarios);
        } catch (e) {
            console.error("Errore nel salvataggio su LocalStorage", e);
            alert("Impossibile salvare lo scenario. Memoria piena o errore del browser.");
        }
    };

    const saveScenario = (name: string, data: PlanInput, viewMode: ViewMode, condoData?: CondoInput) => {
        const newScenario: SavedScenario = {
            id: crypto.randomUUID(),
            name: name.trim() || `Scenario ${new Date().toLocaleDateString()}`,
            createdAt: Date.now(),
            data,
            condoData,
            viewMode
        };

        const updatedScenarios = [newScenario, ...scenarios];
        saveToStorage(updatedScenarios);
        return newScenario;
    };

    const deleteScenario = (id: string) => {
        const updatedScenarios = scenarios.filter(s => s.id !== id);
        saveToStorage(updatedScenarios);
    };

    const updateScenario = (id: string, newName: string) => {
        const updatedScenarios = scenarios.map(s =>
            s.id === id ? { ...s, name: newName } : s
        );
        saveToStorage(updatedScenarios);
    }

    return {
        scenarios,
        saveScenario,
        deleteScenario,
        updateScenario
    };
};
