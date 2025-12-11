// src/types.ts

export interface PlanInput {
  directRecruits: number;
  contractsPerUser: number;
  indirectRecruits: number;
  networkDepth: number;
  realizationTimeMonths: number;
  personalClientsGreen: number;
  personalClientsLight: number;
  personalClientsBusinessGreen: number; // Clienti Business Green (100€ bonus, 2€ ricorrente)
  personalClientsBusinessLight: number; // Clienti Business Light (50€ bonus, 1€ ricorrente)
  myPersonalUnitsGreen: number; // Mie Utenze Green (50€ bonus, 1€ ricorrente base)
  myPersonalUnitsLight: number; // Mie Utenze Light (25€ bonus, 0.5€ ricorrente base)
  cashbackSpending: number;
  cashbackPercentage: number;
}

export interface CondoInput {
  greenUnits: number;
  lightUnits: number;
  yearlyNewUnitsGreen: number;
  yearlyNewUnitsLight: number;
  // Simplified Network Input
  networkDirects: number; // 0-50
}

export type ViewMode = 'family' | 'client' | 'condo';

export interface LevelData {
  level: number;
  users: number;
  oneTimeBonus: number;
  recurringYear1: number;
  recurringYear2: number;
  recurringYear3: number;
}

export interface MonthlyGrowthData {
  month: number;
  cumulativeEarnings: number;
  monthlyRecurring: number;
  monthlyOneTimeBonus: number;
  monthlyTotalEarnings: number;
  cumulativeOneTimeBonus: number;
  cumulativeRecurring: number;
  users: number; // Aggiunto per evitare errori nel grafico
}

export interface CompensationPlanResult {
  levelData: LevelData[];
  levels: LevelData[]; // Alias per compatibilità
  totalUsers: number;
  totalContracts: number;
  totalOneTimeBonus: number;
  totalRecurringYear1: number;
  totalRecurringYear2: number;
  totalRecurringYear3: number;
  monthlyData: MonthlyGrowthData[];
  monthlyCashback: number;
}

export interface CondoSimulationResult {
  year1: {
    activeUnits: number;
    oneTimeBonus: number;
    recurringMonthly: number;
    totalAnnual: number;
  };
  year2: {
    activeUnits: number;
    oneTimeBonus: number;
    recurringMonthly: number;
    totalAnnual: number;
  };
  year3: {
    activeUnits: number;
    oneTimeBonus: number;
    recurringMonthly: number;
    totalAnnual: number;
  };
  total3Years: number;
  // Network Stats
  networkStats?: {
    usersCount: number;
    oneTimeBonus: number;
    recurringYear1: number;
    recurringYear2: number;
    recurringYear3: number;
    totalAnnualYear1: number;
    totalAnnualYear2: number;
    totalAnnualYear3: number;
  };
}