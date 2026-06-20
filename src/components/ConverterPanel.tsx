import type { Category, UnitDef } from '../utils/conversions'
import {
  LENGTH_UNITS,
  WEIGHT_UNITS,
  TEMPERATURE_UNITS,
} from '../utils/conversions'
import UnitRow from './UnitRow'

interface ConverterPanelProps {
  category: Category
  values: Record<string, string>
  errors: Record<string, string | null>
  onUnitChange: (unitKey: string, value: string) => void
}

function getUnits(category: Category): UnitDef[] {
  switch (category) {
    case 'length':
      return LENGTH_UNITS
    case 'weight':
      return WEIGHT_UNITS
    case 'temperature':
      return TEMPERATURE_UNITS
  }
}

function ConverterPanel({
  category,
  values,
  errors,
  onUnitChange,
}: ConverterPanelProps) {
  const units = getUnits(category)

  return (
    <div className="max-w-lg mx-auto px-4 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {units.map((unit) => (
          <UnitRow
            key={unit.key}
            unit={unit}
            value={values[unit.key] ?? ''}
            error={errors[unit.key] ?? null}
            onChange={(v) => onUnitChange(unit.key, v)}
          />
        ))}
      </div>
    </div>
  )
}

export default ConverterPanel
