import { Skeleton } from "@/components/ui/skeleton"

export default function HotkeysLoading() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="w-64 shrink-0">
        {/* Sidebar skeleton */}
        <Skeleton className="h-screen w-64" />
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[56rem]">
          {/* Title skeleton */}
          <Skeleton className="h-10 w-64 mb-6" />

          {/* Card skeletons */}
          <Skeleton className="h-48 w-full mb-6 rounded-lg" />
          <Skeleton className="h-72 w-full mb-6 rounded-lg" />
          <Skeleton className="h-48 w-full mb-6 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
