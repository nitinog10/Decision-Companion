export type Goal = "career" | "money" | "health" | "learning" | "productivity" | "relationships";

export type EnergyLevel = "low" | "medium" | "high";

export interface DecisionContext {
  question: string;
  goal: Goal;
  timeAvailable: string;
  budget?: string;
  energyLevel: EnergyLevel;
}

export interface Option {
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  shortTermScore: number;
  longTermScore: number;
}

export interface DecisionResult {
  id: string;
  question: string;
  context: DecisionContext;
  options: Option[];
  recommendedIndex: number;
  explanation: string;
  createdAt: string;
}
