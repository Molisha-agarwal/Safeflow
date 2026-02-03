import { MetricData, RiskScore, LocationData } from './types';

export const CURRENT_LOCATION: LocationData = {
  name: 'Chorabari Glacial Lake',
  latitude: 30.57,
  longitude: 79.57,
  lastUpdated: '2025-10-09 00:05',
};

export const METRICS: MetricData[] = [
  {
    id: 'velocity',
    label: 'Predicted Ice Velocity (ML Model)',
    value: 409.6,
    unit: 'm/yr',
    threshold: 200,
    isDangerous: true,
    warningMessage: 'Any velocity >200m/yr is dangerous',
  },
  {
    id: 'temp',
    label: 'Predicted Surface Temperature (ML Model)',
    value: 12.7,
    unit: '°C',
    threshold: 6,
    isDangerous: true,
    warningMessage: 'Any temperature >6°C is dangerous',
  },
  {
    id: 'rainfall',
    label: 'Predicted Rainfall (ML Model)',
    value: 25.4,
    unit: 'mm',
    threshold: 100,
    isDangerous: false,
    warningMessage: 'Any rainfall >100mm is dangerous',
  },
];

export const CURRENT_RISK: RiskScore = {
  score: 76.4,
  change: 26.4,
  level: 'High',
};
