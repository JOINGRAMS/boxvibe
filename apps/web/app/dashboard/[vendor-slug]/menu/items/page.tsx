import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'All Items — Meal Builder' }

export default function MenuItemsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">All Items</h1>
      <p className="mt-1 text-sm text-gray-500">
        Browse, search, and manage all menu items and their scaled portion versions.
      </p>
      <div className="mt-12 flex flex-col items-center text-center">
        <p className="text-sm text-gray-400">No items yet. Import your first recipe to get started.</p>
      </div>
    </div>
  )
}
