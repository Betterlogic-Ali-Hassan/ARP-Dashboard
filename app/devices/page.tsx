"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Filter,
  HardDrive,
  Laptop,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  X,
  Server,
  Menu,
  Chrome,
  Globe,
  Monitor,
  HelpCircle,
  InfoIcon,
} from "lucide-react";
import { DeviceDialog } from "@/components/device-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeviceStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { DeviceLimitUpgradeDialog } from "@/components/device-limit-upgrade-dialog";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
// Removed virtualization imports as they're not needed for the standard table
import debounce from "lodash.debounce";
import {
  useSubscriptionStore,
  useDeviceCountSync,
} from "@/lib/subscription-store";

export default function DevicesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceDialogOpen, setDeviceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterProfile, setFilterProfile] = useState<string | null>(null);
  const [deleteSettings, setDeleteSettings] = useState(false);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [upgradeLimitDialogOpen, setUpgradeLimitDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage here

  const isMobile = useMediaQuery("(max-width: 768px)");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Use the new hook to sync device count
  const deviceCount = useDeviceCountSync();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  // Close sidebar when pressing escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Get the device limit from the subscription store
  const { deviceLimit } = useSubscriptionStore();

  // Replace the mock subscription data with the subscription store data
  const [subscription] = useState({
    plan: useSubscriptionStore.getState().currentPlan,
    status: useSubscriptionStore.getState().status,
    billingPeriod: useSubscriptionStore.getState().billingPeriod,
    nextBillingDate: useSubscriptionStore.getState().expiryDate,
    deviceLimit: useSubscriptionStore.getState().deviceLimit,
  });

  const {
    devices,
    profiles,
    addDevice,
    updateDevice,
    removeDevice,
    syncStatus,
    assignDeviceToProfile,
    getProfileByDeviceId,
    syncDeviceProfiles,
    resetDeviceSettings,
  } = useDeviceStore();
  const router = useRouter();

  // Add browser information to devices (mock data)
  const enhancedDevices = devices.map((device) => ({
    ...device,
    browser: {
      name: ["Chrome", "Firefox", "Safari", "Edge"][
        Math.floor(Math.random() * 4)
      ],
      version: `v${Math.floor(Math.random() * 120)}.${Math.floor(
        Math.random() * 10
      )}.${Math.floor(Math.random() * 10000)}`,
    },
  }));

  // Calculate device usage metrics
  const devicesInUse = deviceCount;
  const devicesRemaining = subscription.deviceLimit - devicesInUse;
  const usagePercentage = Math.round(
    (devicesInUse / subscription.deviceLimit) * 100
  );

  // Determine usage level for styling
  const getUsageLevel = () => {
    if (usagePercentage >= 90) return "high";
    if (usagePercentage >= 70) return "medium";
    return "low";
  };

  const usageLevel = getUsageLevel();
  const usageColorClass = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  }[usageLevel];

  // Filter devices based on search query and filters
  const filteredDevices = enhancedDevices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.browser.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTypeFilter = !filterType || device.type === filterType;
    const matchesProfileFilter =
      !filterProfile || device.profileId === filterProfile;
    const matchesStatusFilter = !filterStatus || device.status === filterStatus;

    return (
      matchesSearch &&
      matchesTypeFilter &&
      matchesProfileFilter &&
      matchesStatusFilter
    );
  });

  const handleAddDevice = () => {
    // Check if user has reached device limit for their plan
    if (deviceCount >= subscription.deviceLimit) {
      setUpgradeLimitDialogOpen(true);
      return;
    }

    setSelectedDevice(null);
    setDeviceDialogOpen(true);
  };

  const handleEditDevice = (device: any) => {
    setSelectedDevice(device);
    setDeviceDialogOpen(true);
  };

  const handleDeleteDevice = (device: any) => {
    setSelectedDevice(device);
    setDeleteDialogOpen(true);
  };

  // Update the confirmDeleteDevice function to use the new resetDeviceSettings method
  const confirmDeleteDevice = () => {
    if (selectedDevice) {
      // If the checkbox is checked, reset the device's settings before removing it
      if (deleteSettings) {
        resetDeviceSettings(selectedDevice.id);

        toast({
          title: "Settings reset",
          description: `Settings for "${selectedDevice.name}" have been reset to default configuration.`,
        });
      }

      // Remove the device
      removeDevice(selectedDevice.id);

      toast({
        title: "Device deleted",
        description: `${selectedDevice.name} has been removed successfully.`,
      });

      setDeleteDialogOpen(false);
      setDeleteSettings(false); // Reset the checkbox state
    }
  };

  // Add a profile selection dropdown to the device edit dialog
  // Update the handleDeviceSave function to use the new assignDeviceToProfile method
  const handleDeviceSave = (deviceData: any) => {
    if (selectedDevice) {
      // If the profile has changed, use the assignDeviceToProfile method
      if (selectedDevice.profileId !== deviceData.profileId) {
        updateDevice(selectedDevice.id, {
          ...deviceData,
          profileId: undefined,
        });
        assignDeviceToProfile(selectedDevice.id, deviceData.profileId);
      } else {
        updateDevice(selectedDevice.id, deviceData);
      }

      toast({
        title: "Device updated",
        description: "The device has been updated successfully.",
      });
    } else {
      toast({
        title: "Device added",
        description:
          "New device has been added successfully. Waiting for device to connect.",
      });
    }
    setDeviceDialogOpen(false);
  };

  const handleRefreshDevices = () => {
    // Use local state to track refresh status
    setIsRefreshing(true);

    // Simulate API call to refresh devices
    setTimeout(() => {
      // In a real app, you would fetch fresh data here
      // For now, we'll just simulate the refresh

      // End the refreshing state
      setIsRefreshing(false);

      toast({
        title: "Devices refreshed",
        description: "Your device list has been updated with the latest data.",
      });
    }, 1500);
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map((device) => device.id));
    }
  };

  const handleBulkDelete = () => {
    setBulkDeleteDialogOpen(true);
  };

  // Also update the bulk delete dialog to include the settings reset option
  // Add state for bulk delete settings
  const [bulkDeleteSettings, setBulkDeleteSettings] = useState(false);

  // Update the confirmBulkDelete function to use the new resetDeviceSettings method
  const confirmBulkDelete = () => {
    try {
      selectedDevices.forEach((deviceId) => {
        // If settings reset is checked, reset settings for each device
        if (bulkDeleteSettings) {
          resetDeviceSettings(deviceId);
        }

        // Remove each device
        removeDevice(deviceId);
      });

      // Show appropriate toast based on whether settings were reset
      if (bulkDeleteSettings) {
        toast({
          title: "Devices and settings deleted",
          description: `${selectedDevices.length} device${
            selectedDevices.length !== 1 ? "s" : ""
          } and their settings successfully reset and removed.`,
        });
      } else {
        toast({
          title: "Devices deleted",
          description: `${selectedDevices.length} device${
            selectedDevices.length !== 1 ? "s" : ""
          } successfully removed.`,
        });
      }

      setSelectedDevices([]);
      setBulkDeleteDialogOpen(false);
      setBulkDeleteSettings(false); // Reset checkbox state
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem deleting the selected devices. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update the getDeviceIcon function to handle the new device types:

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "laptop":
        return <Laptop className='h-4 w-4' />;
      case "smartphone":
        return <Smartphone className='h-4 w-4' />;
      case "tablet":
        return <Tablet className='h-4 w-4' />;
      case "desktop":
        return <HardDrive className='h-4 w-4' />;
      case "server":
        return <Server className='h-4 w-4' />;
      default:
        return <Laptop className='h-4 w-4' />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    switch (browser.toLowerCase()) {
      case "chrome":
        return <Chrome className='h-5 w-5' />;
      case "firefox":
        return <Globe className='h-5 w-5' />;
      case "safari":
        return <Globe className='h-5 w-5' />;
      case "edge":
        return <Monitor className='h-5 w-5' />;
      default:
        return <Globe className='h-5 w-5' />;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "active":
        return (
          <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
            <Check className='mr-1 h-3 w-3' /> Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant='outline' className='text-gray-500 dark:text-gray-400'>
            <X className='mr-1 h-3 w-3' /> Inactive
          </Badge>
        );
      case "syncing":
        return (
          <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'>
            <RefreshCw className='mr-1 h-3 w-3 animate-spin' /> Syncing
          </Badge>
        );
      case "error":
        return (
          <Badge className='bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'>
            <AlertCircle className='mr-1 h-3 w-3' /> Error
          </Badge>
        );
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  const clearFilters = () => {
    setFilterType(null);
    setFilterProfile(null);
    setFilterStatus(null);
    setSearchQuery("");
  };

  const handleUpgrade = (plan: string, billingPeriod: string) => {
    setUpgradeLimitDialogOpen(false);

    // Navigate to subscription page or open subscription dialog
    router.push(`/account/subscription?plan=${plan}&billing=${billingPeriod}`);

    toast({
      title: "Upgrading your plan",
      description:
        "You're being redirected to complete your subscription upgrade.",
    });
  };

  // Add a profile info section to the device card
  const DeviceCard = ({ device }: { device: any }) => {
    const profile = getProfileByDeviceId(device.id);

    return (
      <Card className='mb-4 border-gray-200 dark:border-gray-800'>
        <div className='flex items-center justify-between p-4'>
          <div className='flex items-center'>
            <div className='h-10 w-10 mr-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center'>
              {getBrowserIcon(device.browser.name)}
            </div>
            <div>
              <div className='font-medium'>{device.browser.name}</div>
              <div className='text-xs text-gray-500 dark:text-gray-400'>
                {device.browser.version}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditDevice(device)}>
                <Pencil className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteDevice(device)}>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Change Profile</DropdownMenuItem>
              <DropdownMenuItem>Sync Now</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600 dark:text-red-400'>
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='px-4 py-2 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex items-center justify-between text-sm mb-2'>
            <div className='flex items-center'>
              <div className='h-8 w-8 mr-2 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center'>
                {getDeviceIcon(device.type)}
              </div>
              <div>
                <div className='font-medium'>{device.name}</div>
                <div className='text-xs text-gray-500 dark:text-gray-400'>
                  {device.ipAddress}
                </div>
              </div>
            </div>
            <div>
              <span className='font-medium'>Status:</span>{" "}
              {getStatusBadge(device.status)}
            </div>
          </div>
          <div className='mt-2 flex items-center justify-between text-sm'>
            <div>
              <span className='font-medium'>Profile:</span>{" "}
              {profile ? (
                <Badge variant='outline' className='font-normal'>
                  {profile.name}
                </Badge>
              ) : (
                <span className='text-gray-500 dark:text-gray-400 text-sm'>
                  Not assigned
                </span>
              )}
            </div>
            <div>
              <span className='font-medium'>Last Connected:</span>{" "}
              {device.lastConnected || "Never"}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Add a sync button to manually trigger synchronization
  const handleSyncDeviceProfiles = () => {
    syncDeviceProfiles();
    toast({
      title: "Synchronization started",
      description: "Synchronizing devices with their profiles...",
    });
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* Main content */}
      <main className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl'>
          {/* Mobile header with menu button */}
          {isMobile && (
            <div className='flex items-center mb-4'>
              <h1 className='text-xl font-bold ml-[54px]'>Devices</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href='https://yourdomain.com/help/devices'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      aria-label='Help for Devices'
                    >
                      <HelpCircle className='h-4 w-4' />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Help</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className='ml-auto'>
                <Button onClick={handleAddDevice} size='sm' className='h-9'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add
                </Button>
              </div>
            </div>
          )}
          <div className='mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              {/* Hide heading on mobile as we already have it in the header */}
              <div className={cn("flex items-center", isMobile && "sr-only")}>
                <h1 className='text-3xl font-bold tracking-tight mb-2'>
                  Devices
                </h1>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href='https://yourdomain.com/help/devices'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                        aria-label='Help for Devices'
                      >
                        <HelpCircle className='h-5 w-5' />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Help</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className='text-gray-500 dark:text-gray-400 max-w-2xl text-sm md:text-base'>
                Manage and sync your connected devices, with a maximum of{" "}
                {subscription.deviceLimit} devices allowed in your{" "}
                {subscription.plan === "team" ? "Team" : "Individual"} Plan.
                {subscription.status === "scheduled_downgrade" && (
                  <span className='block mt-1 text-amber-600 dark:text-amber-400'>
                    Your plan will be downgraded on{" "}
                    {subscription.nextBillingDate}.
                  </span>
                )}
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Button onClick={handleAddDevice} className='whitespace-nowrap'>
                <Plus className='mr-2 h-4 w-4' />
                Add Device
              </Button>
              {/* Add a sync status indicator */}
              <div className='flex items-center gap-2 ml-4'>
                <div
                  className={`h-2 w-2 rounded-full ${
                    syncStatus.inProgress
                      ? "bg-amber-500 animate-pulse"
                      : "bg-emerald-500"
                  }`}
                ></div>
                <span className='text-xs text-gray-500 dark:text-gray-400'>
                  {syncStatus.inProgress
                    ? "Syncing..."
                    : syncStatus.lastSynced
                    ? `Last synced: ${new Date(
                        syncStatus.lastSynced
                      ).toLocaleTimeString()}`
                    : "Not synced yet"}
                </span>
              </div>
            </div>
          </div>

          {/* Enhance the device usage indicator for better mobile display */}
          <Card className='mb-6 border-gray-200 dark:border-gray-800'>
            <div className='p-4 md:p-5'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4'>
                <div className='flex items-center mb-3 sm:mb-0'>
                  <div className='h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3'>
                    <HardDrive className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                  </div>
                  <div>
                    <h3 className='font-medium text-lg flex items-center gap-2'>
                      Device Usage
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className='h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help' />
                          </TooltipTrigger>
                          <TooltipContent side='top' className='max-w-xs'>
                            <p>
                              All connected devices are counted toward your plan
                              limit, including inactive ones.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {subscription.plan === "team" ? "Team" : "Individual"}{" "}
                      Plan
                    </p>
                  </div>
                </div>
                <div className='self-start sm:self-auto'>
                  <Badge
                    className={`px-3 py-1 text-white ${
                      usagePercentage >= 90
                        ? "bg-red-500"
                        : usagePercentage >= 70
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  >
                    {devicesInUse} of {subscription.deviceLimit} devices used
                  </Badge>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium'>
                    {devicesInUse} devices in use
                  </span>
                  <span className='text-gray-500 dark:text-gray-400'>
                    {devicesRemaining} remaining
                  </span>
                </div>
                <Progress
                  value={usagePercentage}
                  className='h-3 bg-gray-100 dark:bg-gray-800'
                  // indicatorClassName={usageColorClass}
                />
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-3'>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    {devicesRemaining > 0
                      ? `You can add ${devicesRemaining} more device${
                          devicesRemaining !== 1 ? "s" : ""
                        } with your current plan.`
                      : "You've reached your device limit. Upgrade to add more devices."}
                  </p>
                  {devicesRemaining <= 2 && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setUpgradeLimitDialogOpen(true)}
                      className='whitespace-nowrap self-start sm:self-auto h-10'
                    >
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Update the mobile search and filters section to be more mobile-friendly */}
          <div className='mb-6 flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-grow'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              {/* Create a debounced search handler */}

              {/* Update the input handler */}
              <Input
                placeholder='Search devices...'
                className='pl-10 bg-white dark:bg-gray-900 h-11'
                value={searchInputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInputValue(value);
                  debouncedSearch(value);
                }}
              />
            </div>
            <div className='flex gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='bg-white dark:bg-gray-900 h-11 flex-grow md:flex-grow-0'
                  >
                    <Filter className='mr-2 h-4 w-4' />
                    <span className='inline'>Filters</span>
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-[calc(100vw-32px)] sm:w-56'>
                  <DropdownMenuLabel>Filter Devices</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <div className='p-2'>
                    <p className='text-sm font-medium mb-2'>Device Type</p>
                    <Select
                      value={filterType || "all"}
                      onValueChange={(value) =>
                        setFilterType(value === "all" ? null : value)
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='All Types' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Types</SelectItem>
                        <SelectItem value='laptop'>Laptop</SelectItem>
                        <SelectItem value='smartphone'>Smartphone</SelectItem>
                        <SelectItem value='tablet'>Tablet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add a profile filter to the filters dropdown */}
                  <div className='p-2'>
                    <p className='text-sm font-medium mb-2'>Profile</p>
                    <Select
                      value={filterProfile || "all"}
                      onValueChange={(value) =>
                        setFilterProfile(value === "all" ? null : value)
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='All Profiles' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Profiles</SelectItem>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='p-2'>
                    <p className='text-sm font-medium mb-2'>Status</p>
                    <Select
                      value={filterStatus || "all"}
                      onValueChange={(value) =>
                        setFilterStatus(value === "all" ? null : value)
                      }
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='All Statuses' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Statuses</SelectItem>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                        <SelectItem value='syncing'>Syncing</SelectItem>
                        <SelectItem value='error'>Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DropdownMenuSeparator />
                  <div className='p-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='w-full'
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='bg-white dark:bg-gray-900 h-11 w-11'
                      onClick={handleRefreshDevices}
                      disabled={isRefreshing}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          isRefreshing ? "animate-spin" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh device list</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {filteredDevices.length > 0 ? (
            <>
              {/* Desktop Table View - Hidden on Mobile */}
              <div className='hidden md:block'>
                <Card className='border-gray-200 dark:border-gray-800 overflow-hidden'>
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'>
                          <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                            <Checkbox
                              checked={
                                filteredDevices.length > 0 &&
                                selectedDevices.length ===
                                  filteredDevices.length
                              }
                              onCheckedChange={toggleSelectAll}
                              className='mr-2'
                              aria-label='Select all devices'
                            />
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Browser
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Device
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Settings Profile
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Last Connected
                          </th>
                          <th className='px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Status
                          </th>
                          <th className='px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDevices.map((device) => {
                          const profile = profiles.find(
                            (p) => p.id === device.profileId
                          );

                          return (
                            <tr
                              key={device.id}
                              className='border-b border-gray-200 dark:border-gray-800'
                            >
                              <td className='px-4 py-4'>
                                <Checkbox
                                  checked={selectedDevices.includes(device.id)}
                                  onCheckedChange={() =>
                                    toggleDeviceSelection(device.id)
                                  }
                                  aria-label={`Select ${device.name}`}
                                />
                              </td>
                              <td className='px-4 py-4'>
                                <div className='flex items-center gap-3'>
                                  <div className='h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center'>
                                    {getBrowserIcon(device.browser.name)}
                                  </div>
                                  <div>
                                    <div className='font-medium'>
                                      {device.browser.name}
                                    </div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                                      {device.browser.version}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='px-4 py-4'>
                                <div className='flex items-center gap-3'>
                                  <div className='h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center'>
                                    {getDeviceIcon(device.type)}
                                  </div>
                                  <div>
                                    <div className='font-medium'>
                                      {device.name}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className='px-4 py-4'>
                                {profile ? (
                                  <Badge
                                    variant='outline'
                                    className='font-normal'
                                  >
                                    {profile.name}
                                  </Badge>
                                ) : (
                                  <span className='text-gray-500 dark:text-gray-400 text-sm'>
                                    Not assigned
                                  </span>
                                )}
                              </td>
                              <td className='px-4 py-4 text-sm'>Never</td>
                              <td className='px-4 py-4'>
                                {getStatusBadge(device.status)}
                              </td>
                              <td className='px-4 py-4 text-right'>
                                <div className='flex justify-end gap-2'>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => handleEditDevice(device)}
                                  >
                                    <Pencil className='h-4 w-4' />
                                    <span className='sr-only'>Edit</span>
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8'
                                    onClick={() => handleDeleteDevice(device)}
                                  >
                                    <Trash2 className='h-4 w-4' />
                                    <span className='sr-only'>Delete</span>
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='h-8 w-8'
                                      >
                                        <MoreHorizontal className='h-4 w-4' />
                                        <span className='sr-only'>More</span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end'>
                                      <DropdownMenuLabel>
                                        Actions
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem>
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Change Profile
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        Sync Now
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className='text-red-600 dark:text-red-400'>
                                        Disconnect
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className='flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-800'>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Show
                      </span>
                      <Select defaultValue='10'>
                        <SelectTrigger className='h-8 w-20'>
                          <SelectValue placeholder='10' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='10'>10</SelectItem>
                          <SelectItem value='20'>20</SelectItem>
                          <SelectItem value='50'>50</SelectItem>
                          <SelectItem value='100'>100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                      <span>Page</span>
                      <span className='font-medium'>1</span>
                      <span>of</span>
                      <span className='font-medium'>1</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled
                        className='h-8'
                      >
                        Previous
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        disabled
                        className='h-8'
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Mobile Card View - Only shown on Mobile */}
              <div className='md:hidden'>
                {/* Implement pagination for mobile view */}
                {(() => {
                  const itemsPerPage = 5;
                  const totalPages = Math.ceil(
                    filteredDevices.length / itemsPerPage
                  );

                  // Get current devices
                  const indexOfLastDevice = currentPage * itemsPerPage;
                  const indexOfFirstDevice = indexOfLastDevice - itemsPerPage;
                  const currentDevices = filteredDevices.slice(
                    indexOfFirstDevice,
                    indexOfLastDevice
                  );

                  const handlePageChange = (newPage: number) => {
                    setCurrentPage(newPage);
                  };

                  return (
                    <>
                      {currentDevices.map((device) => (
                        <DeviceCard key={device.id} device={device} />
                      ))}

                      {/* Pagination controls */}
                      <div className='flex items-center justify-between mt-4 border-t border-gray-200 dark:border-gray-800 pt-4'>
                        <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                          <span>Page</span>
                          <span className='font-medium'>{currentPage}</span>
                          <span>of</span>
                          <span className='font-medium'>{totalPages || 1}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            disabled={currentPage === 1}
                            onClick={() =>
                              handlePageChange(Math.max(currentPage - 1, 1))
                            }
                            className='h-10 px-4'
                          >
                            Previous
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            disabled={
                              currentPage === totalPages || totalPages === 0
                            }
                            onClick={() =>
                              handlePageChange(
                                Math.min(currentPage + 1, totalPages)
                              )
                            }
                            className='h-10 px-4'
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            /* Enhance the "No devices found" section for better mobile display */
            <div className='flex flex-col items-center justify-center py-8 md:py-12 text-center px-4'>
              <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4'>
                <Laptop className='h-6 w-6 text-gray-500 dark:text-gray-400' />
              </div>
              <h3 className='text-lg font-medium mb-2'>No devices found</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6'>
                {searchQuery || filterType || filterProfile || filterStatus
                  ? "No devices match your current filters. Try adjusting your search or filters."
                  : "You haven't added any devices yet. Add your first device to get started."}
              </p>
              {(searchQuery || filterType || filterProfile || filterStatus) && (
                <Button
                  variant='outline'
                  onClick={clearFilters}
                  className='h-10 w-full sm:w-auto'
                >
                  Clear Filters
                </Button>
              )}
              {!searchQuery &&
                !filterType &&
                !filterProfile &&
                !filterStatus && (
                  <Button
                    onClick={handleAddDevice}
                    className='h-10 w-full sm:w-auto'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add Your First Device
                  </Button>
                )}
            </div>
          )}
        </div>
        {/* Enhance the bulk action bar for better mobile display */}
        <div
          className={cn(
            "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-50 w-[calc(100%-32px)] max-w-md",
            selectedDevices.length === 0 && "hidden"
          )}
        >
          <div className='font-medium'>
            {selectedDevices.length} device
            {selectedDevices.length !== 1 ? "s" : ""} selected
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setSelectedDevices([])}
              className='h-10'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={handleBulkDelete}
              className='h-10'
            >
              <Trash2 className='h-4 w-4 mr-1.5' />
              Delete Selected
            </Button>
          </div>
        </div>
      </main>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={(open) => {
          setBulkDeleteDialogOpen(open);
          if (!open) setBulkDeleteSettings(false); // Reset checkbox when dialog closes
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple devices?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to delete {selectedDevices.length} device
              {selectedDevices.length !== 1 ? "s" : ""}. This action cannot be
              undone and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='flex items-start space-x-2 py-3'>
            <Checkbox
              id='bulk-delete-settings'
              checked={bulkDeleteSettings}
              onCheckedChange={(checked) =>
                setBulkDeleteSettings(checked === true)
              }
            />
            <div className='grid gap-1.5 leading-none'>
              <label
                htmlFor='bulk-delete-settings'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Also reset device settings to default configuration
              </label>
              <p className='text-sm text-muted-foreground'>
                This will remove all custom settings associated with these
                devices
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBulkDelete}
              className='bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800'
            >
              Delete {selectedDevices.length} device
              {selectedDevices.length !== 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Device Dialog */}
      <DeviceDialog
        open={deviceDialogOpen}
        onOpenChange={setDeviceDialogOpen}
        device={selectedDevice}
        profiles={profiles}
        onSave={handleDeviceSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setDeleteSettings(false); // Reset checkbox when dialog closes
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the device &quot;
              {selectedDevice?.name}&quot; and remove all associated data. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className='flex items-start space-x-2 py-3'>
            <Checkbox
              id='delete-settings'
              checked={deleteSettings}
              onCheckedChange={(checked) => setDeleteSettings(checked === true)}
            />
            <div className='grid gap-1.5 leading-none'>
              <label
                htmlFor='delete-settings'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Also reset device settings to default configuration
              </label>
              <p className='text-sm text-muted-foreground'>
                This will remove all custom settings associated with this device
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteDevice}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Device Limit Upgrade Dialog */}
      <DeviceLimitUpgradeDialog
        open={upgradeLimitDialogOpen}
        onOpenChange={setUpgradeLimitDialogOpen}
        onUpgrade={handleUpgrade}
        currentPlan={subscription.plan}
        onViewMorePlans={() => router.push("/account/subscription")}
      />
    </div>
  );
}
