export interface PSOSession {
  sessionNumber: number;
  day: string;
  date: string;
  timeWindow: string;
  vehicleCount: number;
}

export interface PSODatasetOverview {
  totalVehicles: number;
  totalSessions: number;
  vehiclesPerSession: number;
  sessions: PSOSession[];
  timings: {
    interArrivalTimeMin: number;
    arrivalRatePerHour: number;
    fuelingDurationMin: number;
    serviceRatePerHour: number;
    waitingTimeMin: number;
    paymentExitTimeMin: number;
    totalTimeOnSiteMin: number;
  };
  financials: {
    totalRevenuePKR: number;
    averageTransactionPKR: number;
    currency: string;
  };
  singleServerTheory: {
    rho: number;
    isStable: boolean;
    explanation: string;
    realStationInsight: string;
  };
}

export const PSO_DATASET_INFO: PSODatasetOverview = {
  totalVehicles: 300,
  totalSessions: 4,
  vehiclesPerSession: 75,
  sessions: [
    {
      sessionNumber: 1,
      day: 'Sunday',
      date: '16 August 2026',
      timeWindow: '5:00 PM – 7:00 PM',
      vehicleCount: 75,
    },
    {
      sessionNumber: 2,
      day: 'Monday',
      date: '17 August 2026',
      timeWindow: '1:00 PM – 3:00 PM',
      vehicleCount: 75,
    },
    {
      sessionNumber: 3,
      day: 'Tuesday',
      date: '18 August 2026',
      timeWindow: '3:00 PM – 5:00 PM',
      vehicleCount: 75,
    },
    {
      sessionNumber: 4,
      day: 'Wednesday',
      date: '19 August 2026',
      timeWindow: '1:00 PM – 3:00 PM',
      vehicleCount: 75,
    },
  ],
  timings: {
    interArrivalTimeMin: 1.60,
    arrivalRatePerHour: 37.39,
    fuelingDurationMin: 4.52,
    serviceRatePerHour: 13.27,
    waitingTimeMin: 4.42,
    paymentExitTimeMin: 1.17,
    totalTimeOnSiteMin: 10.12,
  },
  financials: {
    totalRevenuePKR: 576300,
    averageTransactionPKR: 1921,
    currency: 'PKR',
  },
  singleServerTheory: {
    rho: 2.818,
    isStable: false,
    explanation:
      'Under a single-server assumption, vehicles arrive (λ ≈ 37.39/hr) faster than one attendant can fuel them (μ ≈ 13.27/hr). The single-server queue diverges towards infinity (Lq → ∞, Wq → ∞).',
    realStationInsight:
      'The observed waiting time is only 4.42 minutes, proving the real station operates multiple fueling dispensers in parallel. The single-server model is used here to study what happens if only one server were present, satisfying the academic coursework requirement while identifying its operational boundary.',
  },
};
