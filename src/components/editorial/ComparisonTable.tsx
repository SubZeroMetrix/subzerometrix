import type { SeedProduct } from '@/../../content/products'

interface ComparisonTableProps {
  products: SeedProduct[]
  features: { key: keyof SeedProduct | 'category_display'; label: string }[]
}

function renderCell(product: SeedProduct, key: string): string {
  if (key === 'category_display') return product.category.replace(/-/g, ' ')
  if (key === 'free_plan_or_trial') return product.free_plan_or_trial ? 'Yes' : 'No'
  if (key === 'setup_complexity') return product.setup_complexity

  const value = product[key as keyof SeedProduct]
  if (typeof value === 'string') return value
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ')
  return '—'
}

export function ComparisonTable({ products, features }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-4 text-gray-500 font-medium">Feature</th>
            {products.map((p) => (
              <th key={p.slug} className="text-left py-3 px-4 text-white font-medium">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {features.map((f) => (
            <tr key={f.key}>
              <td className="py-3 px-4 text-gray-400">{f.label}</td>
              {products.map((p) => (
                <td key={p.slug} className="py-3 px-4 text-gray-300 capitalize">
                  {renderCell(p, f.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
