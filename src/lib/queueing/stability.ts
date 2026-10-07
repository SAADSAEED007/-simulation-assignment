import { StabilityStatus } from '@/types/queueing';

export interface StabilityAssessment {
  status: StabilityStatus;
  isStable: boolean;
  rho: number;
  title: string;
  summary: string;
  academicExplanation: string;
  statusColor: 'emerald' | 'amber' | 'rose';
}

export function assessStability(arrivalRate: number, serviceRate: number): StabilityAssessment {
  if (serviceRate <= 0) {
    return {
      status: 'UNSTABLE',
      isStable: false,
      rho: Infinity,
      title: 'INVALID SERVICE CAPACITY',
      summary: 'Service rate is non-positive; system cannot process vehicles.',
      academicExplanation: 'With zero service capacity, every arriving vehicle accumulates indefinitely.',
      statusColor: 'rose',
    };
  }

  const rho = arrivalRate / serviceRate;

  if (rho < 0.9999) {
    let summary = 'Server has adequate capacity to handle steady-state traffic.';
    if (rho < 0.5) {
      summary = 'Low congestion. Attendant is idle more than 50% of the time with minimal vehicle delay.';
    } else if (rho < 0.8) {
      summary = 'Moderate utilization. System operates with stable queueing delays and balanced throughput.';
    } else {
      summary = 'High utilization. System remains technically stable, but queues become sensitive to arrival bursts.';
    }

    return {
      status: 'STABLE',
      isStable: true,
      rho,
      title: 'SYSTEM STABLE (ρ < 1)',
      summary,
      academicExplanation: `Arrival rate (λ = ${arrivalRate.toFixed(2)} veh/hr) is strictly lower than service capacity (μ = ${serviceRate.toFixed(2)} veh/hr). Theoretical steady-state equilibrium is satisfied.`,
      statusColor: 'emerald',
    };
  } else if (Math.abs(rho - 1.0) <= 0.0001) {
    return {
      status: 'CRITICAL',
      isStable: false,
      rho: 1.0,
      title: 'CRITICAL SATURATION (ρ = 1.0)',
      summary: 'Arrival rate equals maximum single-server processing capacity.',
      academicExplanation: 'Under stochastic fluctuations with ρ = 1, expected queue length drifts upwards without bound over time. Steady-state distribution does not exist.',
      statusColor: 'amber',
    };
  } else {
    return {
      status: 'UNSTABLE',
      isStable: false,
      rho,
      title: 'SYSTEM UNSTABLE (ρ > 1)',
      summary: `Vehicle arrival demand exceeds single attendant throughput by ${((rho - 1) * 100).toFixed(1)}%.`,
      academicExplanation: `With λ = ${arrivalRate.toFixed(2)} veh/hr and μ = ${serviceRate.toFixed(2)} veh/hr, the traffic intensity ρ = ${rho.toFixed(3)} > 1. Under a single-server assumption, the queue grows infinitely (Lq → ∞, Wq → ∞). In a real petrol station, parallel fueling pumps and island attendants prevent infinite accumulation.`,
      statusColor: 'rose',
    };
  }
}
