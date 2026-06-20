import { useState, useCallback, useRef } from 'react'
import type { Category } from '../utils/conversions'
import {
  LENGTH_UNITS,
  WEIGHT_UNITS,
  TEMPERATURE_UNITS,
  convertLength,
  convertWeight,
  convertTemperature,
} from '../utils/conversions'

function getUnits(category: Category) {
  switch (category) {
    case 'length':
      return LENGTH_UNITS
    case 'weight':
      return WEIGHT_UNITS
    case 'temperature':
      return TEMPERATURE_UNITS
  }
}

function formatValue(value: number): string {
  if (!Number.isFinite(value)) return ''
  // Round to 6 decimal places and strip trailing zeros
  const fixed = parseFloat(value.toFixed(6))
  return String(fixed)
}

export function useConverter(initialCategory: Category = 'length') {
  const [category, setCategory] = useState<Category>(initialCategory)
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  // Track the last edited unit and its raw parsed value in base units
  const lastBaseValue = useRef<number | null>(null)
  const lastBaseUnit = useRef<string | null>(null)

  const handleCategoryChange = useCallback((newCategory: Category) => {
    setCategory(newCategory)
    setValues({})
    setErrors({})
    lastBaseValue.current = null
    lastBaseUnit.current = null
  }, [])

  const handleUnitChange = useCallback(
    (unitKey: string, rawValue: string) => {
      // Empty input: clear all values
      if (rawValue.trim() === '') {
        setValues({})
        setErrors({})
        lastBaseValue.current = null
        lastBaseUnit.current = null
        return
      }

      const parsed = parseFloat(rawValue)
      // Non-numeric: ignore
      if (isNaN(parsed)) {
        return
      }

      // Convert from edited unit to base unit value
      let baseValue: number
      if (category === 'length') {
        baseValue = convertLength(parsed, unitKey as Parameters<typeof convertLength>[1], 'm')
      } else if (category === 'weight') {
        baseValue = convertWeight(parsed, unitKey as Parameters<typeof convertWeight>[1], 'kg')
      } else {
        baseValue = convertTemperature(parsed, unitKey as Parameters<typeof convertTemperature>[1], '°C')
      }

      lastBaseValue.current = baseValue
      lastBaseUnit.current = unitKey

      // Convert base value to all units
      const units = getUnits(category)
      const newValues: Record<string, string> = {}
      const newErrors: Record<string, string | null> = {}

      for (const unit of units) {
        let result: number
        if (category === 'length') {
          result = convertLength(baseValue, 'm', unit.key as Parameters<typeof convertLength>[2])
        } else if (category === 'weight') {
          result = convertWeight(baseValue, 'kg', unit.key as Parameters<typeof convertWeight>[2])
        } else {
          result = convertTemperature(baseValue, '°C', unit.key as Parameters<typeof convertTemperature>[2])
          // Check Kelvin < 0
          if (unit.key === 'K' && result < 0) {
            newErrors[unit.key] = '开尔文不能小于 0'
          }
        }
        newValues[unit.key] = formatValue(result)
      }

      setValues(newValues)
      setErrors(newErrors)
    },
    [category]
  )

  return {
    category,
    values,
    errors,
    setCategory: handleCategoryChange,
    handleUnitChange,
  }
}
