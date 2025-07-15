import type { Pump } from '../types/pump';

export interface PressureStats {
  min: number;
  max: number;
  current: number;
}

export function getPressureStats(pressureArr: Pump['pressure']): PressureStats {
  // Handle empty pressure arrays by returning default values
  if (!pressureArr || pressureArr.length === 0) {
    return { min: 0, max: 0, current: 0 };
  }

  let min = pressureArr[0].pressure;
  let max = pressureArr[0].pressure;
  for (let i = 1; i < pressureArr.length; i++) {
    const val = pressureArr[i].pressure;
    if (val < min) min = val;
    if (val > max) max = val;
  }
  const current = pressureArr[pressureArr.length - 1].pressure;
  return { min, max, current };
}
