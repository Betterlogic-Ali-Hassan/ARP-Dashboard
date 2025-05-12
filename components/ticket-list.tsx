"use client"

import { useTicketStore, type Ticket } from "@/lib/ticket-store"
import { TicketStatusBadge } from "@/components/ticket-status-badge"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface TicketListProps {
  onTicketClick: (ticketId: string) => void
  activeTicketId?: string | null
  searchQuery?: string
  tickets?: Ticket[] // Add this prop to accept filtered tickets
  isMobile?: boolean
}

export function TicketList({
  onTicketClick,
  activeTicketId,
  searchQuery = "",
  tickets: filteredTickets, // Rename to make it clear these are already filtered
  isMobile = false,
}: TicketListProps) {
  // If no filtered tickets are provided, get all tickets from the store
  const { tickets: allTickets } = useTicketStore()
  const tickets = filteredTickets || allTickets

  // If using the store tickets, filter by search query
  const displayedTickets = filteredTickets
    ? tickets
    : tickets.filter((ticket) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.category.toLowerCase().includes(query)
        )
      })

  if (displayedTickets.length === 0) {
    return (
      <div className="text-center py-4 sm:py-6">
        {searchQuery || filteredTickets ? (
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">No tickets match your criteria.</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">You don't have any support tickets yet.</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
      {displayedTickets.map((ticket) => (
        <div
          key={ticket.id}
          className={cn(
            "flex flex-col p-2.5 sm:p-3 md:p-4 rounded-lg border transition-all duration-200 cursor-pointer",
            activeTicketId === ticket.id
              ? "border-primary/50 bg-primary/5 dark:bg-primary/10 shadow-sm"
              : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50",
            isMobile ? "touch-manipulation" : "", // Better touch handling on mobile
          )}
          onClick={() => onTicketClick(ticket.id)}
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <h3 className="font-medium truncate text-xs sm:text-sm md:text-base">{ticket.title}</h3>
            <TicketStatusBadge status={ticket.status} />
          </div>
          <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-1.5 sm:mb-2 md:mb-3">
            {ticket.description}
          </p>
          <div className="flex items-center justify-between text-[10px] xs:text-xs">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <span
                className={cn(
                  "px-1 sm:px-1.5 md:px-2 py-0.5 rounded-full text-[10px] xs:text-xs",
                  ticket.priority === "urgent"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : ticket.priority === "high"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : ticket.priority === "normal"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
                )}
              >
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-[10px] xs:text-xs">
                {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 ml-1 sm:ml-2">
              <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="text-[10px] xs:text-xs whitespace-nowrap">
                {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
