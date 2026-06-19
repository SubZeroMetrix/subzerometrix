'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Product {
  id: string
  slug: string
  name: string
  category: string
  is_active: boolean
  last_verified_date: string | null
  setup_complexity: string
  free_plan_or_trial: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, slug, name, category, is_active, last_verified_date, setup_complexity, free_plan_or_trial')
      .order('name')
    setProducts(data || [])
    setLoading(false)
  }

  async function toggleActive(id: string, current: boolean) {
    if (!confirm(`${current ? 'Deactivate' : 'Activate'} this product?`)) return
    const supabase = createClient()
    await supabase.from('products').update({ is_active: !current, updated_at: new Date().toISOString() }).eq('id', id)
    loadProducts()
  }

  if (loading) return <div className="py-12 section-container"><p className="text-gray-400">Loading...</p></div>

  return (
    <div className="py-12">
      <div className="section-container">
        <h1 className="text-2xl font-bold text-white mb-6">Products ({products.length})</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="py-2 px-3 text-gray-500">Name</th>
                <th className="py-2 px-3 text-gray-500">Category</th>
                <th className="py-2 px-3 text-gray-500">Complexity</th>
                <th className="py-2 px-3 text-gray-500">Free</th>
                <th className="py-2 px-3 text-gray-500">Verified</th>
                <th className="py-2 px-3 text-gray-500">Active</th>
                <th className="py-2 px-3 text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="py-2 px-3 text-white">{p.name}</td>
                  <td className="py-2 px-3 text-gray-400 capitalize">{p.category.replace(/-/g, ' ')}</td>
                  <td className="py-2 px-3 text-gray-400 capitalize">{p.setup_complexity}</td>
                  <td className="py-2 px-3 text-gray-400">{p.free_plan_or_trial ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-3 text-gray-400">{p.last_verified_date || 'Not verified'}</td>
                  <td className="py-2 px-3">
                    <span className={p.is_active ? 'text-green-400' : 'text-red-400'}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => toggleActive(p.id, p.is_active)}
                      className="text-xs text-brand-cyan hover:text-white"
                    >
                      {p.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
