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

// ============================================================
// Weight conversion: all units convert through kilograms (base)
// ============================================================

export const WEIGHT_UNITS: UnitDef[] = [
  { key: 'kg', label: '千克', symbol: 'kg' },
  { key: 'g', label: '克', symbol: 'g' },
  { key: 'lb', label: '磅', symbol: 'lb' },
  { key: 'oz', label: '盎司', symbol: 'oz' },
];

const WEIGHT_TO_KG: Record<WeightUnit, number> = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.028349523125,
};

const KG_TO_WEIGHT: Record<WeightUnit, number> = {
  kg: 1,
  g: 1000,
  lb: 1 / 0.45359237,
  oz: 1 / 0.028349523125,
};

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit
): number {
  const kg = value * WEIGHT_TO_KG[from];
  return kg * KG_TO_WEIGHT[to];
}

// ============================================================
// Temperature conversion: all units convert through Celsius (base)
// Temperature is non-linear with offsets, requires special handling
// ============================================================

export const TEMPERATURE_UNITS: UnitDef[] = [
  { key: '°C', label: '摄氏度', symbol: '°C' },
  { key: '°F', label: '华氏度', symbol: '°F' },
  { key: 'K', label: '开尔文', symbol: 'K' },
];

export function convertTemperature(
  value: number,
  from: TemperatureUnit,
  to: TemperatureUnit
): number {
  // Step 1: convert from source unit to Celsius
  let celsius: number;
  switch (from) {
    case '°C':
      celsius = value;
      break;
    case '°F':
      celsius = (value - 32) * (5 / 9);
      break;
    case 'K':
      celsius = value - 273.15;
      break;
  }

  // Step 2: convert from Celsius to target unit
  switch (to) {
    case '°C':
      return celsius;
    case '°F':
      return celsius * (9 / 5) + 32;
    case 'K':
      return celsius + 273.15;
  }
}
