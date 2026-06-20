import { useState } from 'react'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import ConverterPanel from './components/ConverterPanel'
import type { Category } from './utils/conversions'

function App() {
  const [category, setCategory] = useState<Category>('length')
  const [values, setValues] = useState<Record<string, string>>({})

  function handleUnitChange(unitKey: string, value: string) {
    setValues((prev) => ({ ...prev, [unitKey]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryTabs active={category} onSelect={setCategory} />
      <main>
        <ConverterPanel
          category={category}
          values={values}
          errors={{}}
          onUnitChange={handleUnitChange}
        />
      </main>
    </div>
  )
}

export default App
