"use client"

import { Sidebar } from "@/components/sidebar"

export default function StatementPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar activePage="statement" />

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Statement</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">View your account statements and billing history.</p>

          {/* Statement content will go here */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
            <p className="text-center text-gray-500 dark:text-gray-400">
              No statements available. Your billing history will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
