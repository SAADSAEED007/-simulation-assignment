import { CalculatorFormValues, ModelType } from '@/types/queueing';

export interface ValidationOutput {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: {
    lambda: number;
    mu: number;
    interArrivalTimeMin: number;
    serviceTimeMin: number;
    serviceVarianceMin2?: number;
    serviceStdDevMin?: number;
    arrivalStdDevMin?: number;
  };
}

export function validateAndParseInput(
  model: ModelType,
  values: CalculatorFormValues
): ValidationOutput {
  const errors: Record<string, string> = {};

  // 1. ARRIVAL INPUT VALIDATION
  let lambda = 0;
  let interArrivalTimeMin = 0;

  const hasInterArrival = values.interArrivalTime.trim() !== '';
  const hasArrivalRate = values.arrivalRate.trim() !== '';

  if (!hasInterArrival && !hasArrivalRate) {
    errors.arrival = 'Please enter either the average inter-arrival time or arrival rate (λ).';
  } else if (hasInterArrival) {
    const parsed = parseFloat(values.interArrivalTime);
    if (isNaN(parsed) || parsed <= 0) {
      errors.arrival = 'Average inter-arrival time must be a positive number greater than 0.';
    } else if (parsed > 1000) {
      errors.arrival = 'Inter-arrival time is unreasonably large (max 1000 min).';
    } else {
      interArrivalTimeMin = parsed;
      lambda = 60 / parsed;
    }
  } else if (hasArrivalRate) {
    const parsed = parseFloat(values.arrivalRate);
    if (isNaN(parsed) || parsed <= 0) {
      errors.arrival = 'Arrival rate (λ) must be a positive number greater than 0.';
    } else if (parsed > 5000) {
      errors.arrival = 'Arrival rate exceeds realistic simulation range (max 5000 veh/hr).';
    } else {
      lambda = parsed;
      interArrivalTimeMin = 60 / parsed;
    }
  }

  // 2. SERVICE INPUT VALIDATION
  let mu = 0;
  let serviceTimeMin = 0;

  const hasServiceTime = values.serviceTime.trim() !== '';
  const hasServiceRate = values.serviceRate.trim() !== '';

  if (!hasServiceTime && !hasServiceRate) {
    errors.service = 'Please enter either the average service time or service rate (μ).';
  } else if (hasServiceTime) {
    const parsed = parseFloat(values.serviceTime);
    if (isNaN(parsed) || parsed <= 0) {
      errors.service = 'Average service time must be a positive number greater than 0.';
    } else if (parsed > 1000) {
      errors.service = 'Service time is unreasonably large (max 1000 min).';
    } else {
      serviceTimeMin = parsed;
      mu = 60 / parsed;
    }
  } else if (hasServiceRate) {
    const parsed = parseFloat(values.serviceRate);
    if (isNaN(parsed) || parsed <= 0) {
      errors.service = 'Service rate (μ) must be a positive number greater than 0.';
    } else if (parsed > 5000) {
      errors.service = 'Service rate exceeds realistic simulation range (max 5000 veh/hr).';
    } else {
      mu = parsed;
      serviceTimeMin = 60 / parsed;
    }
  }

  // 3. MODEL-SPECIFIC VALIDATIONS
  let serviceVarianceMin2: number | undefined;
  let serviceStdDevMin: number | undefined;
  let arrivalStdDevMin: number | undefined;

  if (model === 'MG1') {
    if (values.serviceVarianceOption === 'variance') {
      if (values.serviceVariance.trim() === '') {
        errors.serviceVariance = 'Please enter the service-time variance Var(S) in min².';
      } else {
        const parsed = parseFloat(values.serviceVariance);
        if (isNaN(parsed) || parsed < 0) {
          errors.serviceVariance = 'Service-time variance cannot be negative.';
        } else {
          serviceVarianceMin2 = parsed;
          serviceStdDevMin = Math.sqrt(parsed);
        }
      }
    } else {
      // stdDev
      if (values.serviceStdDev.trim() === '') {
        errors.serviceVariance = 'Please enter the service-time standard deviation (σS) in minutes.';
      } else {
        const parsed = parseFloat(values.serviceStdDev);
        if (isNaN(parsed) || parsed < 0) {
          errors.serviceVariance = 'Service-time standard deviation cannot be negative.';
        } else {
          serviceStdDevMin = parsed;
          serviceVarianceMin2 = parsed * parsed;
        }
      }
    }
  } else if (model === 'GG1') {
    // Requires both arrivalStdDev and serviceStdDev
    if (values.arrivalStdDev.trim() === '') {
      errors.arrivalStdDev = 'Please enter the arrival standard deviation (σA) in minutes for G/G/1.';
    } else {
      const parsed = parseFloat(values.arrivalStdDev);
      if (isNaN(parsed) || parsed < 0) {
        errors.arrivalStdDev = 'Arrival standard deviation cannot be negative.';
      } else {
        arrivalStdDevMin = parsed;
      }
    }

    if (values.serviceStdDev.trim() === '') {
      errors.serviceStdDev = 'Please enter the service standard deviation (σS) in minutes for G/G/1.';
    } else {
      const parsed = parseFloat(values.serviceStdDev);
      if (isNaN(parsed) || parsed < 0) {
        errors.serviceStdDev = 'Service standard deviation cannot be negative.';
      } else {
        serviceStdDevMin = parsed;
        serviceVarianceMin2 = parsed * parsed;
      }
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    sanitized: {
      lambda,
      mu,
      interArrivalTimeMin,
      serviceTimeMin,
      serviceVarianceMin2,
      serviceStdDevMin,
      arrivalStdDevMin,
    },
  };
}
