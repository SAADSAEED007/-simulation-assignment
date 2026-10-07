import { CalculatedResults, CalculationStep } from '@/types/queueing';

export function calculateMM1Model(
  lambda: number,
  mu: number,
  interArrivalTimeMin: number,
  serviceTimeMin: number
): CalculatedResults {
  const rho = lambda / mu;
  const isStable = rho < 0.9999;
  const isCritical = Math.abs(rho - 1.0) <= 0.0001;

  if (isCritical) {
    return {
      modelType: 'MM1',
      modelName: 'M/M/1 Queueing Model',
      lambda,
      mu,
      meanInterArrivalMin: interArrivalTimeMin,
      meanServiceMin: serviceTimeMin,
      rho,
      status: 'CRITICAL',
      isStable: false,
      statusMessage:
        'The server is operating at 100% utilization (ρ = 1.0). A finite steady-state queue is not obtained under stochastic fluctuations.',
      Lq: null,
      L: null,
      WqMin: null,
      WMin: null,
      WqHours: null,
      WHours: null,
      idleProbabilityP0: 0,
      steps: [
        {
          title: 'Step 1: Arrival Rate (λ)',
          formula: 'λ = 60 / Average Inter-Arrival Time',
          substitution: `λ = 60 / ${interArrivalTimeMin.toFixed(2)}`,
          result: `λ = ${lambda.toFixed(2)} vehicles/hour`,
        },
        {
          title: 'Step 2: Service Rate (μ)',
          formula: 'μ = 60 / Average Service Time',
          substitution: `μ = 60 / ${serviceTimeMin.toFixed(2)}`,
          result: `μ = ${mu.toFixed(2)} vehicles/hour`,
        },
        {
          title: 'Step 3: Server Utilization (ρ)',
          formula: 'ρ = λ / μ',
          substitution: `ρ = ${lambda.toFixed(2)} / ${mu.toFixed(2)}`,
          result: `ρ = 1.000 (Critical Saturation)`,
          explanation: 'When ρ = 1, queue length drifts upwards without bound.',
        },
      ],
    };
  }

  if (!isStable) {
    return {
      modelType: 'MM1',
      modelName: 'M/M/1 Queueing Model',
      lambda,
      mu,
      meanInterArrivalMin: interArrivalTimeMin,
      meanServiceMin: serviceTimeMin,
      rho,
      status: 'UNSTABLE',
      isStable: false,
      statusMessage:
        'Arrivals are occurring faster than the single server can process vehicles (ρ > 1). Under the single-server assumption, the queue will continue to grow rather than reach steady state (Lq → ∞).',
      Lq: null,
      L: null,
      WqMin: null,
      WMin: null,
      WqHours: null,
      WHours: null,
      idleProbabilityP0: null,
      steps: [
        {
          title: 'Step 1: Arrival Rate (λ)',
          formula: 'λ = 60 / Average Inter-Arrival Time',
          substitution: `λ = 60 / ${interArrivalTimeMin.toFixed(2)}`,
          result: `λ = ${lambda.toFixed(2)} vehicles/hour`,
        },
        {
          title: 'Step 2: Service Rate (μ)',
          formula: 'μ = 60 / Average Service Time',
          substitution: `μ = 60 / ${serviceTimeMin.toFixed(2)}`,
          result: `μ = ${mu.toFixed(2)} vehicles/hour`,
        },
        {
          title: 'Step 3: Server Utilization (ρ)',
          formula: 'ρ = λ / μ',
          substitution: `ρ = ${lambda.toFixed(2)} / ${mu.toFixed(2)}`,
          result: `ρ = ${rho.toFixed(3)} (ρ > 1)`,
          explanation: 'System violates stability condition ρ < 1. Vehicles arrive faster than single server clearance.',
        },
        {
          title: 'Step 4: Queue Length & Waiting Time (Lq, Wq)',
          formula: 'Lq = ρ² / (1 - ρ),  Wq = Lq / λ',
          substitution: `Denominator (1 - ρ) = 1 - ${rho.toFixed(3)} < 0`,
          result: 'Lq → ∞,  Wq → ∞',
          explanation: 'Steady-state distribution does not exist for an overloaded single server.',
        },
      ],
    };
  }

  // Stable M/M/1 Calculations
  const Lq = (rho * rho) / (1 - rho);
  const L = rho / (1 - rho);
  const WqHours = Lq / lambda;
  const WqMin = WqHours * 60;
  const WHours = L / lambda;
  const WMin = WHours * 60;
  const p0 = 1 - rho;

  const steps: CalculationStep[] = [
    {
      title: 'Step 1: Calculate Arrival Rate (λ)',
      formula: 'λ = 60 / Average Inter-Arrival Time',
      substitution: `λ = 60 / ${interArrivalTimeMin.toFixed(2)}`,
      result: `λ = ${lambda.toFixed(2)} vehicles/hour`,
      explanation: 'Rate at which vehicles enter the petrol pump station.',
    },
    {
      title: 'Step 2: Calculate Service Rate (μ)',
      formula: 'μ = 60 / Average Service Time',
      substitution: `μ = 60 / ${serviceTimeMin.toFixed(2)}`,
      result: `μ = ${mu.toFixed(2)} vehicles/hour`,
      explanation: 'Rate at which one fuel attendant dispenses fuel and clears vehicles.',
    },
    {
      title: 'Step 3: Calculate Utilization (ρ)',
      formula: 'ρ = λ / μ',
      substitution: `ρ = ${lambda.toFixed(2)} / ${mu.toFixed(2)}`,
      result: `ρ = ${rho.toFixed(3)} (${(rho * 100).toFixed(1)}%)`,
      explanation: 'Traffic intensity is under 1.0; system is stable.',
    },
    {
      title: 'Step 4: Calculate Average Queue Length (Lq)',
      formula: 'Lq = ρ² / (1 - ρ)',
      substitution: `Lq = (${rho.toFixed(3)})² / (1 - ${rho.toFixed(3)}) = ${(rho * rho).toFixed(4)} / ${(1 - rho).toFixed(4)}`,
      result: `Lq = ${Lq.toFixed(2)} vehicles`,
      explanation: 'Average number of vehicles waiting in line before the pump.',
    },
    {
      title: 'Step 5: Calculate Average System Length (L)',
      formula: 'L = ρ / (1 - ρ)  [or L = Lq + ρ]',
      substitution: `L = ${rho.toFixed(3)} / (1 - ${rho.toFixed(3)}) = ${Lq.toFixed(2)} + ${rho.toFixed(3)}`,
      result: `L = ${L.toFixed(2)} vehicles`,
      explanation: 'Average total vehicles at the petrol pump (queue + being fueled).',
    },
    {
      title: 'Step 6: Calculate Average Waiting Time in Queue (Wq)',
      formula: 'Wq = Lq / λ',
      substitution: `Wq = ${Lq.toFixed(2)} / ${lambda.toFixed(2)} hours = (${Lq.toFixed(2)} / ${lambda.toFixed(2)}) × 60 min`,
      result: `Wq = ${WqMin.toFixed(1)} minutes (${WqHours.toFixed(3)} hrs)`,
      explanation: 'Average delay before a vehicle reaches the fuel attendant.',
    },
    {
      title: 'Step 7: Calculate Average Total Time in System (W)',
      formula: 'W = L / λ  [or W = Wq + 1/μ]',
      substitution: `W = ${WqMin.toFixed(1)} min + ${serviceTimeMin.toFixed(1)} min`,
      result: `W = ${WMin.toFixed(1)} minutes (${WHours.toFixed(3)} hrs)`,
      explanation: 'Total time a driver spends at the station from arrival to departure.',
    },
  ];

  return {
    modelType: 'MM1',
    modelName: 'M/M/1 Queueing Model',
    lambda,
    mu,
    meanInterArrivalMin: interArrivalTimeMin,
    meanServiceMin: serviceTimeMin,
    rho,
    status: 'STABLE',
    isStable: true,
    statusMessage: `STABLE SYSTEM (ρ = ${rho.toFixed(2)} < 1.0) — Fuel attendant has sufficient capacity to handle vehicle arrival flow.`,
    Lq,
    L,
    WqMin,
    WMin,
    WqHours,
    WHours,
    idleProbabilityP0: p0,
    steps,
  };
}
