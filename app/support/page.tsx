"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  X,
  Check,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { TicketList } from "@/components/ticket-list";
import TicketChatPanel from "@/components/ticket-chat-panel";
import { CreateTicketDialog } from "@/components/create-ticket-dialog";
import { cn } from "@/lib/utils";
import {
  useTicketStore,
  type TicketStatus,
  type TicketPriority,
  type TicketCategory,
} from "@/lib/ticket-store";
import { useMediaQuery } from "@/hooks/use-media-query";

// Replace the entire SupportPage component with this enhanced responsive version
export default function SupportPage() {
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { tickets } = useTicketStore();

  // Filter states
  const [statusFilters, setStatusFilters] = useState<TicketStatus[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<TicketPriority[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<TicketCategory[]>([]);

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallMobile = useMediaQuery("(max-width: 480px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const activeTicket = activeTicketId
    ? tickets.find((ticket) => ticket.id === activeTicketId)
    : null;

  // Handle opening the chat panel when a ticket is selected
  useEffect(() => {
    if (activeTicketId) {
      setIsChatPanelOpen(true);
    }
  }, [activeTicketId]);

  // Close the chat panel when on mobile and no ticket is selected
  useEffect(() => {
    if (!activeTicketId && isMobile) {
      setIsChatPanelOpen(false);
    }
  }, [activeTicketId, isMobile]);

  // Filter tickets based on search query and filters
  const filteredTickets = tickets.filter((ticket) => {
    // Search query filter
    const matchesSearch =
      !searchQuery ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(ticket.status);

    // Priority filter
    const matchesPriority =
      priorityFilters.length === 0 || priorityFilters.includes(ticket.priority);

    // Category filter
    const matchesCategory =
      categoryFilters.length === 0 || categoryFilters.includes(ticket.category);

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Count active filters
  const activeFilterCount =
    statusFilters.length + priorityFilters.length + categoryFilters.length;

  // Toggle filter selection
  const toggleStatusFilter = (status: TicketStatus) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const togglePriorityFilter = (priority: TicketPriority) => {
    setPriorityFilters((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const toggleCategoryFilter = (category: TicketCategory) => {
    setCategoryFilters((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilters([]);
    setPriorityFilters([]);
    setCategoryFilters([]);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* Main content area with ticket list and chat panel */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Ticket list section - hidden on mobile when chat is open */}
        <main
          className={cn(
            "flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 ease-in-out",
            isMobile && isChatPanelOpen ? "hidden" : "block",
            !isMobile && isChatPanelOpen
              ? "max-w-[50%] lg:max-w-[60%] xl:max-w-[65%]"
              : "max-w-full"
          )}
        >
          <div className='mx-auto max-w-4xl'>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6'>
              <div>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-0.5 sm:mb-1  max-md:ml-[52px]'>
                  Support
                </h1>
                <p className='text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-md:mt-1.5'>
                  Get help with your account and devices
                </p>
              </div>
              <Button
                onClick={() => setIsCreateTicketOpen(true)}
                className='flex items-center gap-1.5 sm:gap-2 shadow-sm mt-2 sm:mt-0'
                size={isSmallMobile ? "sm" : "default"}
              >
                <PlusCircle className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                <span className='text-sm sm:text-base'>New Ticket</span>
              </Button>
            </div>

            {/* Search and filter */}
            <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 shadow-sm'>
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-3'>
                <div className='relative flex-1'>
                  <Search className='absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400' />
                  <Input
                    placeholder='Search tickets...'
                    className='pl-8 sm:pl-9 h-9 sm:h-10 text-sm'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={activeFilterCount > 0 ? "default" : "outline"}
                      size='icon'
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 shrink-0 relative",
                        activeFilterCount > 0 &&
                          "bg-primary text-primary-foreground"
                      )}
                    >
                      <Filter className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                      {activeFilterCount > 0 && (
                        <Badge
                          className='absolute -top-1.5 -right-1.5 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs'
                          variant='destructive'
                        >
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-[260px] sm:w-[280px] md:w-80'
                    align='end'
                  >
                    <div className='space-y-3 sm:space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h3 className='font-medium text-sm sm:text-base'>
                          Filter Tickets
                        </h3>
                        {activeFilterCount > 0 && (
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-7 sm:h-8 text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground'
                            onClick={clearFilters}
                          >
                            <X className='h-3 w-3' />
                            Clear all
                          </Button>
                        )}
                      </div>

                      <div className='space-y-1.5 sm:space-y-2'>
                        <h4 className='text-xs sm:text-sm font-medium'>
                          Status
                        </h4>
                        <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
                          {[
                            { value: "open", label: "Open" },
                            { value: "in_progress", label: "In Progress" },
                            { value: "waiting", label: "Waiting" },
                            { value: "closed", label: "Closed" },
                          ].map((status) => (
                            <div
                              key={status.value}
                              className='flex items-center space-x-1.5 sm:space-x-2'
                            >
                              <Checkbox
                                id={`status-${status.value}`}
                                checked={statusFilters.includes(
                                  status.value as TicketStatus
                                )}
                                onCheckedChange={() =>
                                  toggleStatusFilter(
                                    status.value as TicketStatus
                                  )
                                }
                                className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              />
                              <Label
                                htmlFor={`status-${status.value}`}
                                className='text-xs sm:text-sm cursor-pointer'
                              >
                                {status.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className='space-y-1.5 sm:space-y-2'>
                        <h4 className='text-xs sm:text-sm font-medium'>
                          Priority
                        </h4>
                        <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
                          {[
                            { value: "low", label: "Low" },
                            { value: "normal", label: "Normal" },
                            { value: "high", label: "High" },
                            { value: "urgent", label: "Urgent" },
                          ].map((priority) => (
                            <div
                              key={priority.value}
                              className='flex items-center space-x-1.5 sm:space-x-2'
                            >
                              <Checkbox
                                id={`priority-${priority.value}`}
                                checked={priorityFilters.includes(
                                  priority.value as TicketPriority
                                )}
                                onCheckedChange={() =>
                                  togglePriorityFilter(
                                    priority.value as TicketPriority
                                  )
                                }
                                className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              />
                              <Label
                                htmlFor={`priority-${priority.value}`}
                                className='text-xs sm:text-sm cursor-pointer'
                              >
                                {priority.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className='space-y-1.5 sm:space-y-2'>
                        <h4 className='text-xs sm:text-sm font-medium'>
                          Category
                        </h4>
                        <div className='grid grid-cols-2 gap-1.5 sm:gap-2'>
                          {[
                            { value: "account", label: "Account" },
                            { value: "billing", label: "Billing" },
                            { value: "devices", label: "Devices" },
                            { value: "profiles", label: "Profiles" },
                            { value: "other", label: "Other" },
                          ].map((category) => (
                            <div
                              key={category.value}
                              className='flex items-center space-x-1.5 sm:space-x-2'
                            >
                              <Checkbox
                                id={`category-${category.value}`}
                                checked={categoryFilters.includes(
                                  category.value as TicketCategory
                                )}
                                onCheckedChange={() =>
                                  toggleCategoryFilter(
                                    category.value as TicketCategory
                                  )
                                }
                                className='h-3.5 w-3.5 sm:h-4 sm:w-4'
                              />
                              <Label
                                htmlFor={`category-${category.value}`}
                                className='text-xs sm:text-sm cursor-pointer'
                              >
                                {category.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className='flex justify-between pt-1 sm:pt-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setIsFilterOpen(false)}
                          className='text-xs h-7 sm:h-8'
                        >
                          Cancel
                        </Button>
                        <Button
                          size='sm'
                          onClick={() => setIsFilterOpen(false)}
                          className='flex items-center gap-1 text-xs h-7 sm:h-8'
                        >
                          <Check className='h-3 w-3' />
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Active filters display */}
              {activeFilterCount > 0 && (
                <div className='flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3'>
                  {statusFilters.map((status) => (
                    <Badge
                      key={`status-${status}`}
                      variant='outline'
                      className='flex items-center gap-1 bg-primary/5 text-[10px] sm:text-xs py-0 h-5 sm:h-6'
                    >
                      Status: {status.replace("_", " ")}
                      <X
                        className='h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer'
                        onClick={() => toggleStatusFilter(status)}
                      />
                    </Badge>
                  ))}

                  {priorityFilters.map((priority) => (
                    <Badge
                      key={`priority-${priority}`}
                      variant='outline'
                      className='flex items-center gap-1 bg-primary/5 text-[10px] sm:text-xs py-0 h-5 sm:h-6'
                    >
                      Priority: {priority}
                      <X
                        className='h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer'
                        onClick={() => togglePriorityFilter(priority)}
                      />
                    </Badge>
                  ))}

                  {categoryFilters.map((category) => (
                    <Badge
                      key={`category-${category}`}
                      variant='outline'
                      className='flex items-center gap-1 bg-primary/5 text-[10px] sm:text-xs py-0 h-5 sm:h-6'
                    >
                      Category: {category}
                      <X
                        className='h-2.5 w-2.5 sm:h-3 sm:w-3 cursor-pointer'
                        onClick={() => toggleCategoryFilter(category)}
                      />
                    </Badge>
                  ))}

                  {activeFilterCount > 1 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-5 sm:h-6 text-[10px] sm:text-xs px-1.5 sm:px-2'
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Ticket list */}
            <div className='bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 shadow-sm'>
              <h2 className='text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 flex items-center'>
                <span className='relative'>
                  Your Tickets
                  <span className='absolute -right-5 sm:-right-6 -top-1 bg-primary text-primary-foreground text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center'>
                    {filteredTickets.length}
                  </span>
                </span>
              </h2>
              <div className='max-h-[350px] sm:max-h-[400px] md:max-h-[450px] overflow-y-auto pr-0.5 sm:pr-1'>
                <TicketList
                  onTicketClick={(ticketId) => {
                    setActiveTicketId(ticketId);
                    if (isMobile) {
                      setIsChatPanelOpen(true);
                    }
                  }}
                  activeTicketId={activeTicketId}
                  tickets={filteredTickets}
                  isMobile={isMobile}
                />
              </div>
            </div>

            {/* Support resources */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6'>
              <div className='bg-white dark:bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2'>
                      Knowledge Base
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4'>
                      Find answers to common questions in our documentation.
                    </p>
                  </div>
                  <div className='bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-full'>
                    <svg
                      className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    </svg>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full group text-xs sm:text-sm h-8 sm:h-9 md:h-10'
                >
                  Browse Articles
                  <ChevronRight className='h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform' />
                </Button>
              </div>
              <div className='bg-white dark:bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2'>
                      Community Forum
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4'>
                      Connect with other users and share solutions.
                    </p>
                  </div>
                  <div className='bg-primary/10 dark:bg-primary/20 p-1.5 sm:p-2 rounded-full'>
                    <svg
                      className='h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
                      />
                    </svg>
                  </div>
                </div>
                <Button
                  variant='outline'
                  className='w-full group text-xs sm:text-sm h-8 sm:h-9 md:h-10'
                >
                  Visit Forum
                  <ChevronRight className='h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform' />
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Chat side panel */}
        <TicketChatPanel
          ticket={activeTicket}
          isOpen={isChatPanelOpen}
          onClose={() => {
            setIsChatPanelOpen(false);
            if (isMobile) {
              setActiveTicketId(null);
            }
          }}
          isMobile={isMobile}
        />
      </div>

      {/* Create ticket dialog */}
      <CreateTicketDialog
        open={isCreateTicketOpen}
        onOpenChange={setIsCreateTicketOpen}
      />
    </div>
  );
}
