import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import ConverterPanel from './components/ConverterPanel'
import { useConverter } from './hooks/useConverter'

function App() {
  const { category, values, errors, setCategory, handleUnitChange } =
    useConverter('length')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryTabs active={category} onSelect={setCategory} />
      <main>
        <ConverterPanel
          category={category}
          values={values}
          errors={errors}
          onUnitChange={handleUnitChange}
        />
      </main>
    </div>
  )
}

export default App
