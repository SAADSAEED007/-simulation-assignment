import { CalculatedResults, CalculationStep } from '@/types/queueing';

export function calculateGG1Model(
  lambda: number,
  mu: number,
  interArrivalTimeMin: number,
  serviceTimeMin: number,
  arrivalStdDevMin: number,
  serviceStdDevMin: number
): CalculatedResults {
  const rho = lambda / mu;
  const isStable = rho < 0.9999;
  const isCritical = Math.abs(rho - 1.0) <= 0.0001;

  // Coefficients of variation
  const Ca = interArrivalTimeMin > 0 ? arrivalStdDevMin / interArrivalTimeMin : 1;
  const Cs = serviceTimeMin > 0 ? serviceStdDevMin / serviceTimeMin : 1;

  if (isCritical || !isStable) {
    return {
      modelType: 'GG1',
      modelName: 'G/G/1 (Kingman Approximation)',
      lambda,
      mu,
      meanInterArrivalMin: interArrivalTimeMin,
      meanServiceMin: serviceTimeMin,
      rho,
      status: isCritical ? 'CRITICAL' : 'UNSTABLE',
      isStable: false,
      statusMessage:
        'Arrival demand exceeds service capacity (ρ ≥ 1). Under Kingman approximation, (1 - ρ) ≤ 0, so queues expand infinitely rather than reaching steady state.',
      Lq: null,
      L: null,
      WqMin: null,
      WMin: null,
      WqHours: null,
      WHours: null,
      Ca,
      Cs,
      steps: [
        {
          title: 'Kingman Stability Check',
          formula: 'ρ = λ / μ',
          substitution: `ρ = ${lambda.toFixed(2)} / ${mu.toFixed(2)} = ${rho.toFixed(3)}`,
          result: `ρ = ${rho.toFixed(3)} ≥ 1 (Unstable)`,
          explanation: 'Denominator (1 - ρ) ≤ 0. Steady-state queueing requires ρ < 1.',
        },
      ],
    };
  }

  // Kingman's Heavy-Traffic Approximation:
  // Wq ≈ [rho / (1 - rho)] * [(Ca² + Cs²) / 2] * E[S] (in minutes)
  const varianceFactor = (Ca * Ca + Cs * Cs) / 2;
  const WqMin = (rho / (1 - rho)) * varianceFactor * serviceTimeMin;
  const WqHours = WqMin / 60;
  const WMin = WqMin + serviceTimeMin;
  const WHours = WMin / 60;

  const Lq = lambda * WqHours;
  const L = lambda * WHours;

  const steps: CalculationStep[] = [
    {
      title: 'Step 1: Compute Arrival & Service Rates',
      formula: 'λ = 60 / E[A],  μ = 60 / E[S]',
      substitution: `λ = 60 / ${interArrivalTimeMin.toFixed(2)} = ${lambda.toFixed(2)} veh/hr,  μ = 60 / ${serviceTimeMin.toFixed(2)} = ${mu.toFixed(2)} veh/hr`,
      result: `Utilization ρ = λ / μ = ${rho.toFixed(3)}`,
    },
    {
      title: 'Step 2: Coefficients of Variation (Ca & Cs)',
      formula: 'Ca = σA / E[A],  Cs = σS / E[S]',
      substitution: `Ca = ${arrivalStdDevMin.toFixed(2)} / ${interArrivalTimeMin.toFixed(2)} = ${Ca.toFixed(3)},  Cs = ${serviceStdDevMin.toFixed(2)} / ${serviceTimeMin.toFixed(2)} = ${Cs.toFixed(3)}`,
      result: `Combined Variance Factor [(Ca² + Cs²) / 2] = ${varianceFactor.toFixed(4)}`,
      explanation: 'Reflects simultaneous stochastic variability in vehicle arrival surges and attendant fueling durations.',
    },
    {
      title: 'Step 3: Kingman\'s Waiting Time Approximation (Wq)',
      formula: 'Wq ≈ [ρ / (1 - ρ)] × [(Ca² + Cs²) / 2] × E[S]',
      substitution: `Wq ≈ [${rho.toFixed(3)} / (1 - ${rho.toFixed(3)})] × ${varianceFactor.toFixed(4)} × ${serviceTimeMin.toFixed(2)} min`,
      result: `Wq ≈ ${WqMin.toFixed(1)} minutes (${WqHours.toFixed(3)} hrs)`,
      explanation: 'Heavy-traffic approximation for single-server general arrival and service distributions.',
    },
    {
      title: 'Step 4: Average Queue Length (Lq)',
      formula: 'Lq = λ · Wq (Little\'s Law)',
      substitution: `Lq = ${lambda.toFixed(2)} × ${WqHours.toFixed(3)}`,
      result: `Lq ≈ ${Lq.toFixed(2)} vehicles`,
      explanation: 'Average count of waiting vehicles.',
    },
    {
      title: 'Step 5: Total Time in System (W)',
      formula: 'W = Wq + E[S]',
      substitution: `W = ${WqMin.toFixed(1)} min + ${serviceTimeMin.toFixed(1)} min`,
      result: `W ≈ ${WMin.toFixed(1)} minutes (${WHours.toFixed(3)} hrs)`,
      explanation: 'Expected total time on site.',
    },
    {
      title: 'Step 6: Total Vehicles in System (L)',
      formula: 'L = λ · W',
      substitution: `L = ${lambda.toFixed(2)} × ${WHours.toFixed(3)}`,
      result: `L ≈ ${L.toFixed(2)} vehicles`,
    },
  ];

  return {
    modelType: 'GG1',
    modelName: 'G/G/1 (Kingman Approximation)',
    lambda,
    mu,
    meanInterArrivalMin: interArrivalTimeMin,
    meanServiceMin: serviceTimeMin,
    rho,
    status: 'STABLE',
    isStable: true,
    statusMessage: `STABLE SYSTEM (ρ = ${rho.toFixed(2)} < 1.0) — Kingman approximation predicts finite queueing delay under general distributions.`,
    Lq,
    L,
    WqMin,
    WMin,
    WqHours,
    WHours,
    Ca,
    Cs,
    steps,
  };
}
