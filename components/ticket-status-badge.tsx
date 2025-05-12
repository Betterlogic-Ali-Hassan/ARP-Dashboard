import { cn } from "@/lib/utils"
import type { Ticket } from "@/lib/ticket-store"

// Add this to make the TicketStatusBadge component more responsive
// (Assuming this component exists and needs to be updated)
export function TicketStatusBadge({ status }: { status: Ticket["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] xs:text-xs font-medium",
        status === "open" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        status === "in_progress" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        status === "waiting" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        status === "closed" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
      )}
    >
      <span
        className={cn(
          "mr-1 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full",
          status === "open" && "bg-green-500 dark:bg-green-400",
          status === "in_progress" && "bg-blue-500 dark:bg-blue-400",
          status === "waiting" && "bg-yellow-500 dark:bg-yellow-400",
          status === "closed" && "bg-gray-500 dark:bg-gray-400",
        )}
      />
      {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
