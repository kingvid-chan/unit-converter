import type { UnitDef } from '../utils/conversions'

interface UnitRowProps {
  unit: UnitDef
  value: string
  onChange: (value: string) => void
  error?: string | null
}

function UnitRow({ unit, value, onChange, error }: UnitRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm transition-shadow hover:shadow-md focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
        <span className="text-sm font-semibold text-gray-500 w-8 shrink-0">
          {unit.symbol}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          aria-label={unit.label}
          className="flex-1 text-lg font-medium text-gray-800 bg-transparent outline-none placeholder:text-gray-300 min-w-0"
        />
        <span className="text-xs text-gray-400 shrink-0">{unit.label}</span>
      </div>
      {error && (
        <p className="text-xs text-red-500 px-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default UnitRow
