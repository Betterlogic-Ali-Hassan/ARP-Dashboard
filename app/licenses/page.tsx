"use client"

import { Sidebar } from "@/components/sidebar"

export default function LicensesPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar activePage="licenses" />

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Licenses</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Manage your licenses and view license details.</p>

          {/* License content will go here */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No licenses found. Purchase a license to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
