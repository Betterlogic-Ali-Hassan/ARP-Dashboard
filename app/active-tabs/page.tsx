"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  X,
  RefreshCw,
  Clock,
  Monitor,
  Laptop,
  User,
  StopCircle,
  XCircle,
  ExternalLink,
  Eye,
  Bell,
  Coffee,
  ArrowUpRight,
  CheckCircle2,
  XCircleIcon,
  AlertOctagon,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeviceStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMediaQuery } from "@/hooks/use-media-query"

// Define the ActiveTab type
interface ActiveTab {
  id: string
  url: string
  interval: number // in seconds
  nextRefresh: number // timestamp
  monitorEnabled: boolean
  keywordAlert: boolean
  deviceId: string
  profileId: string
  alertType?: "found" | "lost" // Type of alert: keywords found or lost
  alertDetails?: {
    keywords: string[]
    timestamp: number
    screenshot?: string
  }
}

export default function ActiveTabsPage() {
  // Get devices and profiles from store
  const { devices, profiles } = useDeviceStore()
  const { toast } = useToast()

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  // State for active tabs
  const [activeTabs, setActiveTabs] = useState<ActiveTab[]>([])

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // State for confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    tabId: "",
    action: "" as "stop" | "kill",
  })

  // State for alert dialog
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    tab: null as ActiveTab | null,
  })

  // State for tab action menu on mobile
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null)

  // State for countdown timers
  const [now, setNow] = useState(Date.now())

  // Mock data for active tabs
  useEffect(() => {
    const mockTabs: ActiveTab[] = [
      {
        id: "tab-1",
        url: "https://www.amazon.com/deals",
        interval: 10,
        nextRefresh: Date.now() + 10000,
        monitorEnabled: true,
        keywordAlert: false,
        deviceId: "device-1",
        profileId: "profile-1",
      },
      {
        id: "tab-2",
        url: "https://www.ebay.com/deals",
        interval: 30,
        nextRefresh: Date.now() + 25000,
        monitorEnabled: true,
        keywordAlert: true,
        deviceId: "device-2",
        profileId: "profile-2",
        alertType: "found",
        alertDetails: {
          keywords: ["discount", "sale", "limited offer"],
          timestamp: Date.now() - 300000, // 5 minutes ago
          screenshot: "/placeholder.svg?key=k7e3c",
        },
      },
      {
        id: "tab-3",
        url: "https://www.amazon.com/gp/goldbox",
        interval: 5,
        nextRefresh: Date.now() + 3000,
        monitorEnabled: false,
        keywordAlert: false,
        deviceId: "device-3",
        profileId: "profile-3",
      },
      {
        id: "tab-4",
        url: "https://www.ebay.com/sch/i.html?_nkw=electronics",
        interval: 60,
        nextRefresh: Date.now() + 45000,
        monitorEnabled: true,
        keywordAlert: true,
        deviceId: "device-4",
        profileId: "profile-4",
        alertType: "lost",
        alertDetails: {
          keywords: ["free shipping", "best offer"],
          timestamp: Date.now() - 900000, // 15 minutes ago
          screenshot: "/placeholder.svg?key=z1dq4",
        },
      },
      {
        id: "tab-5",
        url: "https://www.amazon.com/gp/new-releases",
        interval: 15,
        nextRefresh: Date.now() + 12000,
        monitorEnabled: true,
        keywordAlert: false,
        deviceId: "device-5",
        profileId: "profile-5",
      },
    ]

    setActiveTabs(mockTabs)
  }, [])

  // Update countdown timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simulate refreshing the tab data every 10 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setActiveTabs((prevTabs) =>
        prevTabs.map((tab) => {
          // If the tab has reached its refresh time, update the next refresh time
          if (tab.nextRefresh <= Date.now()) {
            return {
              ...tab,
              nextRefresh: Date.now() + tab.interval * 1000,
              // Randomly trigger keyword alerts for demo purposes
              keywordAlert: Math.random() > 0.8 ? true : tab.keywordAlert,
            }
          }
          return tab
        }),
      )
    }, 1000)

    return () => clearInterval(refreshInterval)
  }, [])

  // Filter tabs based on search query and selected filters
  const filteredTabs = activeTabs.filter((tab) => {
    // Filter by search query
    if (searchQuery && !tab.url.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by profile
    if (selectedProfile && tab.profileId !== selectedProfile) {
      return false
    }

    // Filter by device
    if (selectedDevice && tab.deviceId !== selectedDevice) {
      return false
    }

    // Filter by status
    if (selectedStatus) {
      switch (selectedStatus) {
        case "refreshing":
          return true // All tabs are refreshing in this demo
        case "monitor":
          return tab.monitorEnabled
        case "alert":
          return tab.keywordAlert
        default:
          return true
      }
    }

    return true
  })

  // Handle stopping refresh for a tab
  const handleStopRefresh = (tabId: string) => {
    setActiveTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === tabId ? { ...tab, interval: 0, nextRefresh: 0 } : tab)),
    )
    setConfirmDialog({ isOpen: false, tabId: "", action: "stop" })
    setActionMenuOpen(null)
  }

  // Handle killing a tab
  const handleKillTab = (tabId: string) => {
    setActiveTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId))
    setConfirmDialog({ isOpen: false, tabId: "", action: "kill" })
    setActionMenuOpen(null)
  }

  // Format time remaining for countdown
  const formatTimeRemaining = (nextRefresh: number) => {
    const timeRemaining = Math.max(0, nextRefresh - now) / 1000
    return `${Math.floor(timeRemaining)}s`
  }

  // Get device name by ID
  const getDeviceName = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    return device ? device.name : "Unknown Device"
  }

  // Get profile name by ID
  const getProfileName = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    return profile ? profile.name : "Unknown Profile"
  }

  // Handle refreshing tabs
  const handleRefreshDevices = () => {
    // Simulate refreshing tabs
    const refreshPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        setActiveTabs((prevTabs) =>
          prevTabs.map((tab) => ({
            ...tab,
            nextRefresh: Date.now() + tab.interval * 1000,
          })),
        )
        resolve()
      }, 1000)
    })

    toast({
      title: "Refreshing tabs",
      description: "Updating all active tabs with the latest data...",
    })

    return refreshPromise
  }

  // Format timestamp to readable time
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Handle opening alert dialog
  const handleOpenAlertDialog = (tab: ActiveTab) => {
    if (tab.keywordAlert && tab.alertDetails) {
      setAlertDialog({
        isOpen: true,
        tab,
      })
    }
  }

  // Handle visiting website from alert dialog
  const handleVisitWebsite = (url: string) => {
    window.open(url, "_blank")
    setAlertDialog({ isOpen: false, tab: null })
  }

  // Toggle mobile filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedProfile(null)
    setSelectedDevice(null)
    setSelectedStatus(null)
  }

  // Get domain from URL for display
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar activePage="active-tabs" />

      {/* Main content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 sm:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">Active Tabs</h1>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-sm">
                View and control all actively refreshing tabs across your synced devices and profiles.
              </p>
            </div>
            <div className="flex flex-row gap-2 sm:gap-3">
              <Button variant="outline" onClick={handleRefreshDevices} className="whitespace-nowrap h-9 px-3 sm:px-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                <span className="hidden xs:inline">Refresh Tabs</span>
                <span className="xs:hidden">Refresh</span>
              </Button>
              {isMobile && (
                <Button
                  variant="outline"
                  onClick={toggleFilters}
                  className="whitespace-nowrap h-9 px-3"
                  aria-expanded={showFilters}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              )}
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
            {/* Monitored Tabs Card */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Monitored Tabs Active</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">18</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">Across</span>
                  <span className="font-medium mx-1">4 devices</span>
                  <span className="text-muted-foreground">and</span>
                  <span className="font-medium mx-1">5 profiles</span>
                </div>
              </CardContent>
            </Card>

            {/* Keyword Alerts Card */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keyword Alerts Triggered</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">32</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <ArrowUpRight className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                  <span className="font-medium text-amber-500">8 new</span>
                  <span className="text-muted-foreground ml-1">in the last hour</span>
                </div>
              </CardContent>
            </Card>

            {/* Idle Tabs Card */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Idle Tabs</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">71</h3>
                  </div>
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                  <span className="text-muted-foreground">Tabs with</span>
                  <span className="font-medium mx-1">no activity</span>
                  <span className="text-muted-foreground">in the last 24h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filter Bar */}
          <Card className="mb-4 sm:mb-6 border-gray-200 dark:border-gray-800">
            <div className="p-3 sm:p-4 md:p-5">
              {/* Always visible search bar */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by URL or keyword..."
                  className="pl-10 bg-white dark:bg-gray-900 h-10 sm:h-11 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Filter controls - visible on desktop or when toggled on mobile */}
              {(!isMobile || showFilters) && (
                <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-wrap gap-2 sm:flex-1">
                    {/* Profile Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-shrink-0 h-9 text-sm">
                          <User className="mr-2 h-4 w-4" />
                          <span>{selectedProfile ? getProfileName(selectedProfile) : "All Profiles"}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => setSelectedProfile(null)}
                            className={selectedProfile === null ? "bg-muted" : ""}
                          >
                            All Profiles
                          </DropdownMenuItem>
                          {profiles.map((profile) => (
                            <DropdownMenuItem
                              key={profile.id}
                              onClick={() => setSelectedProfile(profile.id)}
                              className={selectedProfile === profile.id ? "bg-muted" : ""}
                            >
                              {profile.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Device Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-shrink-0 h-9 text-sm">
                          <Laptop className="mr-2 h-4 w-4" />
                          <span>{selectedDevice ? getDeviceName(selectedDevice) : "All Devices"}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => setSelectedDevice(null)}
                            className={selectedDevice === null ? "bg-muted" : ""}
                          >
                            All Devices
                          </DropdownMenuItem>
                          {devices.map((device) => (
                            <DropdownMenuItem
                              key={device.id}
                              onClick={() => setSelectedDevice(device.id)}
                              className={selectedDevice === device.id ? "bg-muted" : ""}
                            >
                              {device.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Status Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-shrink-0 h-9 text-sm">
                          <Filter className="mr-2 h-4 w-4" />
                          <span>
                            {selectedStatus
                              ? selectedStatus === "refreshing"
                                ? "Refreshing"
                                : selectedStatus === "monitor"
                                  ? "Monitored"
                                  : "Alerts"
                              : "All Statuses"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => setSelectedStatus(null)}
                            className={selectedStatus === null ? "bg-muted" : ""}
                          >
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedStatus("refreshing")}
                            className={selectedStatus === "refreshing" ? "bg-muted" : ""}
                          >
                            Refreshing Only
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedStatus("monitor")}
                            className={selectedStatus === "monitor" ? "bg-muted" : ""}
                          >
                            Monitor Enabled
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setSelectedStatus("alert")}
                            className={selectedStatus === "alert" ? "bg-muted" : ""}
                          >
                            Keyword Alert Active
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Clear Filters Button - only show when filters are active */}
                  {(searchQuery || selectedProfile || selectedDevice || selectedStatus) && (
                    <Button variant="ghost" size="sm" className="flex-shrink-0 h-9" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-1" />
                      <span>Clear filters</span>
                    </Button>
                  )}
                </div>
              )}

              {/* Active filters display */}
              {(selectedProfile || selectedDevice || selectedStatus) && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  <div className="text-sm text-muted-foreground mr-2">Active filters:</div>
                  {selectedProfile && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{getProfileName(selectedProfile)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setSelectedProfile(null)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove profile filter</span>
                      </Button>
                    </Badge>
                  )}

                  {selectedDevice && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Laptop className="h-3 w-3" />
                      <span>{getDeviceName(selectedDevice)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setSelectedDevice(null)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove device filter</span>
                      </Button>
                    </Badge>
                  )}

                  {selectedStatus && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Filter className="h-3 w-3" />
                      <span>
                        {selectedStatus === "refreshing"
                          ? "Refreshing Only"
                          : selectedStatus === "monitor"
                            ? "Monitor Enabled"
                            : "Keyword Alert Active"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setSelectedStatus(null)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove status filter</span>
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Tab List */}
          <Card className="mb-6 border-gray-200 dark:border-gray-800">
            <CardContent className="p-0">
              {filteredTabs.length > 0 ? (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>URL</TableHead>
                          <TableHead>Refresh Interval</TableHead>
                          <TableHead>Next Refresh</TableHead>
                          <TableHead>Monitor Status</TableHead>
                          <TableHead>Device</TableHead>
                          <TableHead>Profile</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTabs.map((tab) => (
                          <TableRow
                            key={tab.id}
                            className={tab.keywordAlert ? "cursor-pointer hover:bg-muted/50" : ""}
                            onClick={() => tab.keywordAlert && handleOpenAlertDialog(tab)}
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <div className="w-6 h-6 mr-2 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                  <img
                                    src={`https://icons.duckduckgo.com/ip3/${tab.url.split("/")[2]}.ico`}
                                    alt=""
                                    className="w-4 h-4"
                                    onError={(e) => {
                                      // Fallback if icon fails to load
                                      ;(e.target as HTMLImageElement).src = "/abstract-website-design.png"
                                    }}
                                  />
                                </div>
                                <a
                                  href={tab.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline truncate max-w-[200px] inline-block"
                                  onClick={(e) => e.stopPropagation()} // Prevent row click handler
                                >
                                  {tab.url}
                                </a>
                                <ExternalLink className="h-3.5 w-3.5 ml-1 text-gray-400" />
                              </div>
                            </TableCell>
                            <TableCell>
                              {tab.interval > 0 ? (
                                <Badge variant="secondary" className="flex items-center w-fit">
                                  <RefreshCw className="mr-1 h-3 w-3" />
                                  {tab.interval}s
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {tab.nextRefresh > 0 ? (
                                <Badge variant="outline" className="flex items-center w-fit">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatTimeRemaining(tab.nextRefresh)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {tab.monitorEnabled ? (
                                <Badge
                                  variant="outline"
                                  className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center w-fit"
                                >
                                  <Monitor className="h-3 w-3 mr-1" />
                                  Enabled
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 flex items-center w-fit"
                                >
                                  <Monitor className="h-3 w-3 mr-1" />
                                  Disabled
                                </Badge>
                              )}
                              {tab.keywordAlert && (
                                <Badge
                                  variant="outline"
                                  className={`flex items-center ${tab.alertType === "found" ? "animate-pulse bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"} mt-1 w-fit`}
                                >
                                  {tab.alertType === "found" ? (
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                  ) : (
                                    <AlertCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {tab.alertType === "found" ? "Found" : "Lost"}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Laptop className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span>{getDeviceName(tab.deviceId)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <User className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span>{getProfileName(tab.profileId)}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <TooltipProvider delayDuration={300}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          setConfirmDialog({
                                            isOpen: true,
                                            tabId: tab.id,
                                            action: "stop",
                                          })
                                        }
                                        disabled={tab.interval === 0}
                                      >
                                        <StopCircle className="h-4 w-4" />
                                        <span className="sr-only">Stop refresh</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center" className="font-medium">
                                      <p>Stop Refresh</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider delayDuration={300}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                          setConfirmDialog({
                                            isOpen: true,
                                            tabId: tab.id,
                                            action: "kill",
                                          })
                                        }
                                      >
                                        <XCircle className="h-4 w-4" />
                                        <span className="sr-only">Kill tab</span>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="center" className="font-medium">
                                      <p>Kill Tab</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredTabs.map((tab) => (
                      <div
                        key={tab.id}
                        className={`p-4 ${tab.keywordAlert ? "cursor-pointer" : ""}`}
                        onClick={() => tab.keywordAlert && handleOpenAlertDialog(tab)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-3 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <img
                                src={`https://icons.duckduckgo.com/ip3/${tab.url.split("/")[2]}.ico`}
                                alt=""
                                className="w-5 h-5"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src = "/abstract-website-design.png"
                                }}
                              />
                            </div>
                            <div>
                              <a
                                href={tab.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline text-sm flex items-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {getDomain(tab.url)}
                                <ExternalLink className="h-3 w-3 ml-1 text-gray-400" />
                              </a>
                              <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px]">
                                {tab.url}
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    tabId: tab.id,
                                    action: "stop",
                                  })
                                }}
                                disabled={tab.interval === 0}
                                className="cursor-pointer"
                              >
                                <StopCircle className="h-4 w-4 mr-2" />
                                Stop Refresh
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setConfirmDialog({
                                    isOpen: true,
                                    tabId: tab.id,
                                    action: "kill",
                                  })
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Kill Tab
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                          <div className="flex items-center">
                            <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Interval:</span>
                            <span className="ml-1 font-medium">{tab.interval > 0 ? `${tab.interval}s` : "-"}</span>
                          </div>

                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Next:</span>
                            <span className="ml-1 font-medium">
                              {tab.nextRefresh > 0 ? formatTimeRemaining(tab.nextRefresh) : "-"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Laptop className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Device:</span>
                            <span className="ml-1 font-medium truncate max-w-[100px]">
                              {getDeviceName(tab.deviceId)}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            <span className="text-muted-foreground">Profile:</span>
                            <span className="ml-1 font-medium truncate max-w-[100px]">
                              {getProfileName(tab.profileId)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {tab.monitorEnabled ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 flex items-center"
                            >
                              <Monitor className="h-3 w-3 mr-1" />
                              Monitoring Enabled
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 flex items-center"
                            >
                              <Monitor className="h-3 w-3 mr-1" />
                              Monitoring Disabled
                            </Badge>
                          )}

                          {tab.keywordAlert && (
                            <Badge
                              variant="outline"
                              className={`flex items-center ${tab.alertType === "found" ? "animate-pulse bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"}`}
                            >
                              {tab.alertType === "found" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : (
                                <AlertCircle className="mr-1 h-3 w-3" />
                              )}
                              {tab.alertType === "found" ? "Keywords Found" : "Keywords Lost"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center px-4">
                  <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                    <RefreshCw className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No active tabs found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    No active tabs found across your devices. Tabs will appear here when they are actively refreshing or
                    being monitored.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog
            open={confirmDialog.isOpen}
            onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, isOpen: false })}
          >
            <DialogContent className="sm:max-w-[425px] p-5 sm:p-6">
              <DialogHeader>
                <DialogTitle>{confirmDialog.action === "stop" ? "Stop Refreshing" : "Kill Tab"}</DialogTitle>
                <DialogDescription>
                  {confirmDialog.action === "stop"
                    ? "Are you sure you want to stop refreshing this tab? This will disable auto-refresh functionality for this tab."
                    : "Are you sure you want to kill this tab? This will close the tab on the device."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4 sm:mt-0">
                <Button variant="outline" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
                  Cancel
                </Button>
                <Button
                  variant={confirmDialog.action === "stop" ? "default" : "destructive"}
                  onClick={() =>
                    confirmDialog.action === "stop"
                      ? handleStopRefresh(confirmDialog.tabId)
                      : handleKillTab(confirmDialog.tabId)
                  }
                >
                  {confirmDialog.action === "stop" ? "Stop Refresh" : "Kill Tab"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Alert Dialog */}
          <Dialog
            open={alertDialog.isOpen}
            onOpenChange={(open) => !open && setAlertDialog({ ...alertDialog, isOpen: false })}
          >
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl shadow-md bg-white dark:bg-gray-950">
              <div className="flex flex-col sm:flex-row">
                {/* Left icon section */}
                <div className="p-4 sm:p-5 md:p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-900 sm:border-r border-gray-200 dark:border-gray-800">
                  {alertDialog.tab?.alertType === "found" ? (
                    <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-10 w-10 sm:h-12 sm:w-12 text-red-500" />
                  )}
                </div>

                {/* Right content section */}
                <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {alertDialog.tab?.alertType === "found" ? "Keywords Found Alert" : "Keywords Lost Alert"}
                  </h2>

                  {/* URL and timestamp */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">URL:</span>
                    <a
                      href={alertDialog.tab?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate max-w-[180px] sm:max-w-[350px]"
                    >
                      {alertDialog.tab?.url}
                    </a>
                    <span className="text-gray-500 text-sm">
                      • {alertDialog.tab?.alertDetails && formatTimestamp(alertDialog.tab.alertDetails.timestamp)}
                    </span>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Keywords:</span>
                    <div className="flex flex-wrap gap-2">
                      {alertDialog.tab?.alertDetails?.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          className={
                            alertDialog.tab?.alertType === "found"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                          }
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Screenshot - conditional */}
                  {alertDialog.tab?.alertDetails?.screenshot && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Screenshot</h3>
                      <div className="rounded-md overflow-hidden border inline-block">
                        <img
                          src={alertDialog.tab.alertDetails.screenshot || "/placeholder.svg"}
                          alt="Page screenshot"
                          className="w-full sm:w-[250px] h-auto"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Screenshot captured at {formatTimestamp(alertDialog.tab.alertDetails.timestamp)}
                      </p>
                    </div>
                  )}

                  {/* Alert message */}
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {alertDialog.tab?.alertType === "found"
                        ? "This alert will remain active until acknowledged."
                        : "This alert indicates content has been removed from the page."}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-2">
                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto"
                      onClick={() => setAlertDialog({ isOpen: false, tab: null })}
                    >
                      Dismiss
                    </Button>
                    <Button
                      className={`w-full sm:w-auto ${
                        alertDialog.tab?.alertType === "found"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() => alertDialog.tab && handleVisitWebsite(alertDialog.tab.url)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}
