/**
 * Unit conversions and mathematical sanitization utilities for Queueing Engine.
 * All core queueing models evaluate rates in vehicles/hour and service times in hours.
 */

export function timeToRate(minutes: number): number {
  if (minutes <= 0) return 0;
  return 60 / minutes;
}

export function rateToTime(ratePerHour: number): number {
  if (ratePerHour <= 0) return 0;
  return 60 / ratePerHour;
}

export function minutesToHours(min: number): number {
  return min / 60;
}

export function hoursToMinutes(hours: number): number {
  return hours * 60;
}

export function secondsToMinutes(sec: number): number {
  return sec / 60;
}

export function minutesToSeconds(min: number): number {
  return min * 60;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateQueueInput(
  arrivalRate: number,
  serviceRate: number,
  serviceStdDevMin: number = 0,
  arrivalStdDevMin: number = 0
): ValidationResult {
  const errors: Record<string, string> = {};

  if (isNaN(arrivalRate) || arrivalRate <= 0) {
    errors.arrivalRate = 'Arrival rate (λ) must be greater than 0.';
  } else if (arrivalRate > 1000) {
    errors.arrivalRate = 'Arrival rate exceeds realistic simulation range (max 1000/hr).';
  }

  if (isNaN(serviceRate) || serviceRate <= 0) {
    errors.serviceRate = 'Service rate (μ) must be greater than 0.';
  } else if (serviceRate > 1000) {
    errors.serviceRate = 'Service rate exceeds realistic simulation range (max 1000/hr).';
  }

  if (isNaN(serviceStdDevMin) || serviceStdDevMin < 0) {
    errors.serviceStdDevMin = 'Service standard deviation cannot be negative.';
  }

  if (isNaN(arrivalStdDevMin) || arrivalStdDevMin < 0) {
    errors.arrivalStdDevMin = 'Arrival standard deviation cannot be negative.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatNumber(val: number | null | undefined, decimals: number = 3): string {
  if (val === null || val === undefined || !isFinite(val)) {
    return '∞';
  }
  return Number(val).toFixed(decimals);
}
