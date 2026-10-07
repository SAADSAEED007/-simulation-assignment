export type ModelType = 'MM1' | 'MG1' | 'GG1';

export type StabilityStatus = 'STABLE' | 'CRITICAL' | 'UNSTABLE';

export interface CalculationStep {
  title: string;
  formula: string;
  substitution: string;
  result: string;
  explanation?: string;
}

export interface CalculatedResults {
  modelType: ModelType;
  modelName: string;
  lambda: number; // vehicles per hour
  mu: number; // vehicles per hour
  meanInterArrivalMin: number;
  meanServiceMin: number;
  rho: number; // utilization
  status: StabilityStatus;
  isStable: boolean;
  statusMessage: string;

  // Steady-state metrics (null if unstable)
  Lq: number | null; // Avg vehicles in queue
  L: number | null; // Avg vehicles in system
  WqMin: number | null; // Avg wait in queue (minutes)
  WMin: number | null; // Avg time in system (minutes)
  WqHours: number | null; // Avg wait in queue (hours)
  WHours: number | null; // Avg time in system (hours)
  idleProbabilityP0?: number | null; // M/M/1 idle prob 1 - rho

  // Model-specific metrics
  varS_min2?: number; // Service variance min² (M/G/1)
  Ca?: number; // Arrival CV (G/G/1)
  Cs?: number; // Service CV (G/G/1)

  // Step-by-step substitution for teacher demonstration
  steps: CalculationStep[];
}

export interface CalculatorFormValues {
  // Common inputs
  interArrivalTime: string; // minutes
  arrivalRate: string; // vehicles/hour
  serviceTime: string; // minutes
  serviceRate: string; // vehicles/hour

  // M/G/1 inputs
  serviceVarianceOption: 'variance' | 'stdDev';
  serviceVariance: string; // min²
  serviceStdDev: string; // min

  // G/G/1 inputs
  arrivalStdDev: string; // min
}
