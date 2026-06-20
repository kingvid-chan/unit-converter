import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import ConverterPanel from './components/ConverterPanel'
import Footer from './components/Footer'
import { useConverter } from './hooks/useConverter'

function App() {
  const { category, values, errors, setCategory, handleUnitChange } =
    useConverter('length')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <div className="flex-1 max-w-2xl mx-auto w-full">
        <Header />
        <CategoryTabs active={category} onSelect={setCategory} />
        <main className="mt-2">
          <ConverterPanel
            category={category}
            values={values}
            errors={errors}
            onUnitChange={handleUnitChange}
          />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
