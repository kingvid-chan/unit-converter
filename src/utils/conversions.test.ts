import { describe, it, expect } from 'vitest'
import { convertLength, convertWeight, convertTemperature } from './conversions'

// ============================================================
// Length conversion tests
// ============================================================
describe('convertLength', () => {
  it('1 meter = 100 centimeters', () => {
    expect(convertLength(1, 'm', 'cm')).toBeCloseTo(100, 6)
  })

  it('1 kilometer = 1000 meters', () => {
    expect(convertLength(1, 'km', 'm')).toBeCloseTo(1000, 6)
  })

  it('1 foot = 12 inches', () => {
    expect(convertLength(1, 'ft', 'in')).toBeCloseTo(12, 6)
  })

  it('1 mile = 5280 feet', () => {
    expect(convertLength(1, 'mi', 'ft')).toBeCloseTo(5280, 4)
  })

  it('1 inch = 2.54 centimeters', () => {
    expect(convertLength(1, 'in', 'cm')).toBeCloseTo(2.54, 6)
  })

  it('1 mile ≈ 1.60934 kilometers', () => {
    expect(convertLength(1, 'mi', 'km')).toBeCloseTo(1.609344, 6)
  })

  it('zero converts to zero', () => {
    expect(convertLength(0, 'm', 'cm')).toBe(0)
    expect(convertLength(0, 'km', 'mi')).toBe(0)
  })

  it('negative value converts correctly', () => {
    expect(convertLength(-1, 'm', 'cm')).toBeCloseTo(-100, 6)
  })

  it('bidirectional consistency: m→cm→m', () => {
    const original = 5
    const cm = convertLength(original, 'm', 'cm')
    const back = convertLength(cm, 'cm', 'm')
    expect(back).toBeCloseTo(original, 6)
  })

  it('large value', () => {
    const result = convertLength(1e6, 'm', 'km')
    expect(result).toBeCloseTo(1000, 6)
  })

  it('same unit returns same value', () => {
    expect(convertLength(42, 'm', 'm')).toBe(42)
  })
})

// ============================================================
// Weight conversion tests
// ============================================================
describe('convertWeight', () => {
  it('1 kilogram = 1000 grams', () => {
    expect(convertWeight(1, 'kg', 'g')).toBeCloseTo(1000, 6)
  })

  it('1 pound ≈ 453.592 grams', () => {
    expect(convertWeight(1, 'lb', 'g')).toBeCloseTo(453.59237, 4)
  })

  it('1 pound = 16 ounces', () => {
    expect(convertWeight(1, 'lb', 'oz')).toBeCloseTo(16, 6)
  })

  it('1 ounce ≈ 28.3495 grams', () => {
    expect(convertWeight(1, 'oz', 'g')).toBeCloseTo(28.349523125, 4)
  })

  it('1000 grams = 1 kilogram', () => {
    expect(convertWeight(1000, 'g', 'kg')).toBeCloseTo(1, 6)
  })

  it('zero converts to zero', () => {
    expect(convertWeight(0, 'kg', 'lb')).toBe(0)
  })

  it('bidirectional consistency: kg→lb→kg', () => {
    const original = 10
    const lb = convertWeight(original, 'kg', 'lb')
    const back = convertWeight(lb, 'lb', 'kg')
    expect(back).toBeCloseTo(original, 6)
  })

  it('negative value', () => {
    expect(convertWeight(-5, 'kg', 'g')).toBeCloseTo(-5000, 6)
  })
})

// ============================================================
// Temperature conversion tests
// ============================================================
describe('convertTemperature', () => {
  it('0°C = 32°F (freezing point)', () => {
    expect(convertTemperature(0, '°C', '°F')).toBeCloseTo(32, 6)
  })

  it('100°C = 212°F (boiling point)', () => {
    expect(convertTemperature(100, '°C', '°F')).toBeCloseTo(212, 6)
  })

  it('0°C = 273.15 K', () => {
    expect(convertTemperature(0, '°C', 'K')).toBeCloseTo(273.15, 6)
  })

  it('0 K = -273.15°C (absolute zero)', () => {
    expect(convertTemperature(0, 'K', '°C')).toBeCloseTo(-273.15, 6)
  })

  it('32°F = 0°C', () => {
    expect(convertTemperature(32, '°F', '°C')).toBeCloseTo(0, 6)
  })

  it('-40°C = -40°F (crossover point)', () => {
    expect(convertTemperature(-40, '°C', '°F')).toBeCloseTo(-40, 6)
    expect(convertTemperature(-40, '°F', '°C')).toBeCloseTo(-40, 6)
  })

  it('bidirectional: °C→°F→°C', () => {
    const original = 25
    const f = convertTemperature(original, '°C', '°F')
    const back = convertTemperature(f, '°F', '°C')
    expect(back).toBeCloseTo(original, 6)
  })

  it('bidirectional: °C→K→°C', () => {
    const original = 30
    const k = convertTemperature(original, '°C', 'K')
    const back = convertTemperature(k, 'K', '°C')
    expect(back).toBeCloseTo(original, 6)
  })

  it('kelvin from negative celsius', () => {
    // -100°C = 173.15K, still positive
    const k = convertTemperature(-100, '°C', 'K')
    expect(k).toBeGreaterThan(0)
    expect(k).toBeCloseTo(173.15, 6)
  })

  it('kelvin below zero (below absolute zero)', () => {
    // -300°C → K would be negative
    const k = convertTemperature(-300, '°C', 'K')
    expect(k).toBeLessThan(0)
  })

  it('zero kelvin is absolute zero', () => {
    expect(convertTemperature(0, 'K', '°C')).toBeCloseTo(-273.15, 6)
    expect(convertTemperature(0, 'K', '°F')).toBeCloseTo(-459.67, 4)
  })
})
