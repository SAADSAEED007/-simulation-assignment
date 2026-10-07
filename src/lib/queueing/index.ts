export * from './conversions';
export * from './validation';
export * from './mm1';
export * from './mg1';
export * from './gg1';

import { ModelType, CalculatorFormValues, CalculatedResults } from '@/types/queueing';
import { validateAndParseInput } from './validation';
import { calculateMM1Model } from './mm1';
import { calculateMG1Model } from './mg1';
import { calculateGG1Model } from './gg1';

export function executeQueueCalculation(
  model: ModelType,
  values: CalculatorFormValues
): { success: boolean; results?: CalculatedResults; errors?: Record<string, string> } {
  const validation = validateAndParseInput(model, values);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const { lambda, mu, interArrivalTimeMin, serviceTimeMin } = validation.sanitized;

  if (model === 'MM1') {
    return {
      success: true,
      results: calculateMM1Model(lambda, mu, interArrivalTimeMin, serviceTimeMin),
    };
  }

  if (model === 'MG1') {
    const varS = validation.sanitized.serviceVarianceMin2 ?? 0;
    return {
      success: true,
      results: calculateMG1Model(lambda, mu, interArrivalTimeMin, serviceTimeMin, varS),
    };
  }

  if (model === 'GG1') {
    const arrStd = validation.sanitized.arrivalStdDevMin ?? 0;
    const servStd = validation.sanitized.serviceStdDevMin ?? 0;
    return {
      success: true,
      results: calculateGG1Model(lambda, mu, interArrivalTimeMin, serviceTimeMin, arrStd, servStd),
    };
  }

  return { success: false, errors: { general: 'Unsupported queueing model' } };
}
