import type { Category } from '../utils/conversions'

interface CategoryTabsProps {
  active: Category
  onSelect: (category: Category) => void
}

const TABS: { key: Category; label: string; icon: string }[] = [
  { key: 'length', label: '长度', icon: '📏' },
  { key: 'weight', label: '重量', icon: '⚖️' },
  { key: 'temperature', label: '温度', icon: '🌡️' },
]

function CategoryTabs({ active, onSelect }: CategoryTabsProps) {
  return (
    <nav className="flex justify-center gap-2 px-4 py-4" role="tablist">
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.key)}
            className={`
              px-4 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-200 ease-in-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400
              ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
              }
            `}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

export default CategoryTabs
