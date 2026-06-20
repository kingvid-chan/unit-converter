// ============================================================
// Unit type definitions
// ============================================================

export type LengthUnit = 'm' | 'cm' | 'km' | 'ft' | 'in' | 'mi';
export type WeightUnit = 'kg' | 'g' | 'lb' | 'oz';
export type TemperatureUnit = '°C' | '°F' | 'K';

export type Category = 'length' | 'weight' | 'temperature';

export interface UnitDef {
  key: string;
  label: string;
  symbol: string;
}

export const LENGTH_UNITS: UnitDef[] = [
  { key: 'm', label: '米', symbol: 'm' },
  { key: 'cm', label: '厘米', symbol: 'cm' },
  { key: 'km', label: '公里', symbol: 'km' },
  { key: 'ft', label: '英尺', symbol: 'ft' },
  { key: 'in', label: '英寸', symbol: 'in' },
  { key: 'mi', label: '英里', symbol: 'mi' },
];

// ============================================================
// Length conversion: all units convert through meters (base)
// ============================================================

const LENGTH_TO_METER: Record<LengthUnit, number> = {
  m: 1,
  cm: 0.01,
  km: 1000,
  ft: 0.3048,
  in: 0.0254,
  mi: 1609.344,
};

const METER_TO_LENGTH: Record<LengthUnit, number> = {
  m: 1,
  cm: 100,
  km: 0.001,
  ft: 1 / 0.3048,
  in: 1 / 0.0254,
  mi: 1 / 1609.344,
};

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit
): number {
  const meters = value * LENGTH_TO_METER[from];
  return meters * METER_TO_LENGTH[to];
}
