import { useState } from 'react'
import Header from './components/Header'
import CategoryTabs from './components/CategoryTabs'
import type { Category } from './utils/conversions'

function App() {
  const [category, setCategory] = useState<Category>('length')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryTabs active={category} onSelect={setCategory} />
    </div>
  )
}

export default App
