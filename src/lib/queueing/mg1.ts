import { CalculatedResults, CalculationStep } from '@/types/queueing';

export function calculateMG1Model(
  lambda: number,
  mu: number,
  interArrivalTimeMin: number,
  serviceTimeMin: number,
  varS_min2: number
): CalculatedResults {
  const rho = lambda / mu;
  const isStable = rho < 0.9999;
  const isCritical = Math.abs(rho - 1.0) <= 0.0001;

  // Mean service time in hours
  const ES_hours = serviceTimeMin / 60;
  // Variance in hours²: 1 hr² = 3600 min²
  const varS_hours2 = varS_min2 / 3600;
  // Second moment of service time: E[S²] = Var(S) + (E[S])²
  const ES2_hours2 = varS_hours2 + ES_hours * ES_hours;

  if (isCritical || !isStable) {
    return {
      modelType: 'MG1',
      modelName: 'M/G/1 (Pollaczek–Khinchine)',
      lambda,
      mu,
      meanInterArrivalMin: interArrivalTimeMin,
      meanServiceMin: serviceTimeMin,
      rho,
      status: isCritical ? 'CRITICAL' : 'UNSTABLE',
      isStable: false,
      statusMessage:
        'Arrival demand exceeds service capacity (ρ ≥ 1). Under Pollaczek–Khinchine theory, denominator (1 - ρ) ≤ 0, so queues expand infinitely rather than reaching steady state.',
      Lq: null,
      L: null,
      WqMin: null,
      WMin: null,
      WqHours: null,
      WHours: null,
      varS_min2,
      steps: [
        {
          title: 'Step 1: Traffic Intensity (ρ)',
          formula: 'ρ = λ · E[S] = λ / μ',
          substitution: `ρ = ${lambda.toFixed(2)} / ${mu.toFixed(2)}`,
          result: `ρ = ${rho.toFixed(3)} (Unstable)`,
          explanation: 'Steady-state equilibrium requires ρ < 1.',
        },
      ],
    };
  }

  // Stable M/G/1 via Pollaczek–Khinchine
  // Wq = (lambda * E[S²]) / (2 * (1 - rho)) in hours
  const WqHours = (lambda * ES2_hours2) / (2 * (1 - rho));
  const WqMin = WqHours * 60;
  const WHours = WqHours + ES_hours;
  const WMin = WHours * 60;

  const Lq = lambda * WqHours;
  const L = lambda * WHours;

  const stdDevMin = Math.sqrt(varS_min2);
  const Cs = serviceTimeMin > 0 ? stdDevMin / serviceTimeMin : 1;

  const steps: CalculationStep[] = [
    {
      title: 'Step 1: Calculate Arrival & Service Rates',
      formula: 'λ = 60 / Inter-Arrival,  μ = 60 / Service Time',
      substitution: `λ = 60 / ${interArrivalTimeMin.toFixed(2)} = ${lambda.toFixed(2)} veh/hr,  μ = 60 / ${serviceTimeMin.toFixed(2)} = ${mu.toFixed(2)} veh/hr`,
      result: `Utilization ρ = λ / μ = ${rho.toFixed(3)}`,
    },
    {
      title: 'Step 2: Service-Time Variance & Second Moment E[S²]',
      formula: 'E[S²] = Var(S) + (E[S])²',
      substitution: `Var(S) = ${varS_min2.toFixed(2)} min² (${varS_hours2.toFixed(6)} hr²), E[S] = ${ES_hours.toFixed(4)} hr`,
      result: `E[S²] = ${ES2_hours2.toFixed(6)} hr² (Coefficient of variation Cs = ${Cs.toFixed(2)})`,
      explanation: 'Pollaczek–Khinchine incorporates the dispersion of fueling durations around the average.',
    },
    {
      title: 'Step 3: Pollaczek–Khinchine Formula for Waiting Time (Wq)',
      formula: 'Wq = λ · E[S²] / [2(1 - ρ)]',
      substitution: `Wq = (${lambda.toFixed(2)} × ${ES2_hours2.toFixed(6)}) / [2 × (1 - ${rho.toFixed(3)})]`,
      result: `Wq = ${WqMin.toFixed(1)} minutes (${WqHours.toFixed(3)} hrs)`,
      explanation: 'Queueing delay before fueling starts. Reducing service variance directly reduces Wq.',
    },
    {
      title: 'Step 4: Average Queue Length (Lq)',
      formula: 'Lq = λ · Wq (Little\'s Law)',
      substitution: `Lq = ${lambda.toFixed(2)} × ${WqHours.toFixed(3)}`,
      result: `Lq = ${Lq.toFixed(2)} vehicles`,
      explanation: 'Average number of waiting vehicles behind the fuel attendant.',
    },
    {
      title: 'Step 5: Total Time in System (W)',
      formula: 'W = Wq + E[S]',
      substitution: `W = ${WqMin.toFixed(1)} min + ${serviceTimeMin.toFixed(1)} min`,
      result: `W = ${WMin.toFixed(1)} minutes (${WHours.toFixed(3)} hrs)`,
      explanation: 'Sum of queue delay plus mean vehicle fueling duration.',
    },
    {
      title: 'Step 6: Total Vehicles in System (L)',
      formula: 'L = λ · W',
      substitution: `L = ${lambda.toFixed(2)} × ${WHours.toFixed(3)}`,
      result: `L = ${L.toFixed(2)} vehicles`,
      explanation: 'Total vehicles currently on station premises.',
    },
  ];

  return {
    modelType: 'MG1',
    modelName: 'M/G/1 (Pollaczek–Khinchine)',
    lambda,
    mu,
    meanInterArrivalMin: interArrivalTimeMin,
    meanServiceMin: serviceTimeMin,
    rho,
    status: 'STABLE',
    isStable: true,
    statusMessage: `STABLE SYSTEM (ρ = ${rho.toFixed(2)} < 1.0) — Pollaczek–Khinchine relationship predicts steady-state operation.`,
    Lq,
    L,
    WqMin,
    WMin,
    WqHours,
    WHours,
    varS_min2,
    steps,
  };
}
