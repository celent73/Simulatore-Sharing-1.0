
import { useMemo } from 'react';
import { CondoInput, CondoSimulationResult } from '../types';

const RATES = {
    GREEN: {
        OT: 100,
        REC_Y1: 5.0,
        REC_Y2: 7.5,
        REC_Y3: 10.0
    },
    LIGHT: {
        OT: 50,
        REC_Y1: 2.5,
        REC_Y2: 3.75,
        REC_Y3: 5.0
    }
};

export const useCondoSimulation = (inputs: CondoInput): CondoSimulationResult => {
    return useMemo(() => {
        const { greenUnits, lightUnits, yearlyNewUnitsGreen, yearlyNewUnitsLight } = inputs;

        // --- YEAR 1 ---
        // Contracts acquired at start of Year 1
        const y1_Green = greenUnits;
        const y1_Light = lightUnits;
        
        const y1_OT = (y1_Green * RATES.GREEN.OT) + (y1_Light * RATES.LIGHT.OT);
        const y1_RecMonthly = (y1_Green * RATES.GREEN.REC_Y1) + (y1_Light * RATES.LIGHT.REC_Y1);
        const y1_TotalAnnual = y1_OT + (y1_RecMonthly * 12);
        
        const y1_ActiveUnits = y1_Green + y1_Light;

        // --- YEAR 2 ---
        // New contracts acquired at start of Year 2
        const y2_NewGreen = yearlyNewUnitsGreen;
        const y2_NewLight = yearlyNewUnitsLight;

        // Income from New Contracts (Y2 Vintage) -> Rate Y1
        const y2_New_OT = (y2_NewGreen * RATES.GREEN.OT) + (y2_NewLight * RATES.LIGHT.OT);
        const y2_New_Rec = (y2_NewGreen * RATES.GREEN.REC_Y1) + (y2_NewLight * RATES.LIGHT.REC_Y1);

        // Income from Old Contracts (Y1 Vintage) -> Rate Y2
        const y2_Old_Rec = (y1_Green * RATES.GREEN.REC_Y2) + (y1_Light * RATES.LIGHT.REC_Y2);

        const y2_RecMonthly = y2_New_Rec + y2_Old_Rec;
        const y2_TotalAnnual = y2_New_OT + (y2_RecMonthly * 12);
        
        const y2_ActiveUnits = y1_ActiveUnits + y2_NewGreen + y2_NewLight;

        // --- YEAR 3 ---
        // New contracts acquired at start of Year 3
        const y3_NewGreen = yearlyNewUnitsGreen;
        const y3_NewLight = yearlyNewUnitsLight;

        // Income from New Contracts (Y3 Vintage) -> Rate Y1
        const y3_New_OT = (y3_NewGreen * RATES.GREEN.OT) + (y3_NewLight * RATES.LIGHT.OT);
        const y3_New_Rec = (y3_NewGreen * RATES.GREEN.REC_Y1) + (y3_NewLight * RATES.LIGHT.REC_Y1);

        // Income from Mid Contracts (Y2 Vintage) -> Rate Y2
        const y3_Mid_Rec = (y2_NewGreen * RATES.GREEN.REC_Y2) + (y2_NewLight * RATES.LIGHT.REC_Y2);

        // Income from Old Contracts (Y1 Vintage) -> Rate Y3
        const y3_Old_Rec = (y1_Green * RATES.GREEN.REC_Y3) + (y1_Light * RATES.LIGHT.REC_Y3);

        const y3_RecMonthly = y3_New_Rec + y3_Mid_Rec + y3_Old_Rec;
        const y3_TotalAnnual = y3_New_OT + (y3_RecMonthly * 12);

        const y3_ActiveUnits = y2_ActiveUnits + y3_NewGreen + y3_NewLight;

        return {
            year1: {
                activeUnits: y1_ActiveUnits,
                oneTimeBonus: y1_OT,
                recurringMonthly: y1_RecMonthly,
                totalAnnual: y1_TotalAnnual
            },
            year2: {
                activeUnits: y2_ActiveUnits,
                oneTimeBonus: y2_New_OT,
                recurringMonthly: y2_RecMonthly,
                totalAnnual: y2_TotalAnnual
            },
            year3: {
                activeUnits: y3_ActiveUnits,
                oneTimeBonus: y3_New_OT,
                recurringMonthly: y3_RecMonthly,
                totalAnnual: y3_TotalAnnual
            },
            total3Years: y1_TotalAnnual + y2_TotalAnnual + y3_TotalAnnual
        };

    }, [inputs]);
};
