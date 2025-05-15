"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Laptop,
  MoreHorizontal,
  Plus,
  Smartphone,
  Tablet,
  Trash,
  Monitor,
  ComputerIcon as Desktop,
  Download,
  HelpCircle,
  Upload,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileEditorDialog } from "@/components/profile-editor-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeviceStore } from "@/lib/store";
import { Sidebar } from "@/components/sidebar";
import { DeviceAssociationDialog } from "@/components/device-association-dialog";
import { ImportSettingsDialog } from "@/components/import-settings-dialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsProfilesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [associationDialogOpen, setAssociationDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [targetProfileId, setTargetProfileId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock subscription data - in a real app, this would come from a store or API
  const [subscription] = useState({
    plan: "basic", // Changed to basic to demonstrate the upgrade flow
    status: "active",
    billingPeriod: "yearly",
    nextBillingDate: "2024-04-01",
    deviceLimit: 3,
  });

  const {
    devices,
    profiles,
    addProfile,
    removeProfile,
    duplicateProfile,
    updateDevice,
    updateProfile,
    getDevicesByProfileId,
    assignDeviceToProfile,
    unassignDeviceFromProfile,
    syncDeviceProfiles,
    syncStatus,
  } = useDeviceStore();

  // Reset target profile when selected profile changes
  useEffect(() => {
    if (selectedProfile) {
      // Find the first available profile that's not the selected one and not inactive
      const availableProfiles = profiles.filter(
        (p) => p.id !== selectedProfile.id && p.isDefault
      );

      if (availableProfiles.length > 0) {
        setTargetProfileId(availableProfiles[0].id);
      } else {
        const otherProfiles = profiles.filter(
          (p) => p.id !== selectedProfile.id
        );
        if (otherProfiles.length > 0) {
          setTargetProfileId(otherProfiles[0].id);
        } else {
          setTargetProfileId("");
        }
      }
    } else {
      setTargetProfileId("");
    }
  }, [selectedProfile, profiles]);

  // Filter profiles based on active tab
  const filteredProfiles = profiles.filter((profile) => {
    if (activeTab === "all") return true;

    // Get associated devices for this profile
    const profileDevices = getDevicesByProfileId(profile.id);

    // A profile is inactive if it has no devices OR all devices are offline
    const isInactive =
      profileDevices.length === 0 ||
      profileDevices.every(
        (device) => device.status === "inactive" || device.status === "offline"
      );

    if (activeTab === "active") return !isInactive;
    if (activeTab === "inactive") return isInactive;
    return true;
  });

  const handleCreateProfile = () => {
    setSelectedProfile(null);
    setCreateProfileDialogOpen(true);
  };

  const handleEditProfile = (profile: any) => {
    // Make a deep copy to avoid direct state mutation
    setSelectedProfile(JSON.parse(JSON.stringify(profile)));
    setCreateProfileDialogOpen(true);
  };

  const handleDeleteProfile = (profile: any) => {
    setSelectedProfile(profile);
    setDeleteDialogOpen(true);
  };

  const handleDuplicateProfile = (profile: any) => {
    const newProfile = duplicateProfile(profile.id);
    toast({
      title: "Profile duplicated",
      description: `A copy of "${profile.name}" has been created.`,
    });
  };

  const handleExportSettings = (profile: any) => {
    toast({
      title: "Settings exported",
      description: `Settings for "${profile.name}" have been exported successfully.`,
    });
  };

  const handleImportSettings = (profile: any) => {
    setSelectedProfile(profile);
    setImportDialogOpen(true);
  };

  const handleImportSettingsSubmit = (settings: any) => {
    if (selectedProfile) {
      // In a real app, you would merge these settings with the profile
      // For this demo, we'll just update the profile with a mock implementation
      const updatedProfile = {
        ...selectedProfile,
        // Add any imported settings here
        lastImported: new Date().toISOString(),
      };

      updateProfile(selectedProfile.id, updatedProfile);
    }
  };

  const confirmDeleteProfile = () => {
    if (selectedProfile) {
      // Get devices associated with this profile
      const associatedDevices = getDevicesByProfileId(selectedProfile.id);

      // If there are associated devices and a target profile is selected
      if (associatedDevices.length > 0 && targetProfileId) {
        // Reassign all devices to the target profile
        associatedDevices.forEach((device) => {
          assignDeviceToProfile(device.id, targetProfileId);
        });

        // Show success message with reassignment info
        const targetProfile = profiles.find((p) => p.id === targetProfileId);

        removeProfile(selectedProfile.id);
        toast({
          title: "Profile deleted",
          description: `"${selectedProfile.name}" has been deleted and ${
            associatedDevices.length
          } device${associatedDevices.length !== 1 ? "s" : ""} reassigned to "${
            targetProfile?.name
          }".`,
        });
      } else if (associatedDevices.length > 0) {
        // If there are devices but no target profile (should not happen with our UI)
        // Find the default profile
        const defaultProfile = profiles.find((p) => p.isDefault);

        if (defaultProfile && defaultProfile.id !== selectedProfile.id) {
          // Reassign to default profile
          associatedDevices.forEach((device) => {
            assignDeviceToProfile(device.id, defaultProfile.id);
          });

          removeProfile(selectedProfile.id);
          toast({
            title: "Profile deleted",
            description: `"${selectedProfile.name}" has been deleted and ${
              associatedDevices.length
            } device${
              associatedDevices.length !== 1 ? "s" : ""
            } reassigned to the default profile "${defaultProfile.name}".`,
          });
        } else {
          // No suitable profile found, unassign devices
          associatedDevices.forEach((device) => {
            unassignDeviceFromProfile(device.id);
          });

          removeProfile(selectedProfile.id);
          toast({
            title: "Profile deleted",
            description: `"${selectedProfile.name}" has been deleted and ${
              associatedDevices.length
            } device${
              associatedDevices.length !== 1 ? "s" : ""
            } have been unassigned.`,
          });
        }
      } else {
        // No devices to worry about
        removeProfile(selectedProfile.id);
        toast({
          title: "Profile deleted",
          description: `"${selectedProfile.name}" has been deleted successfully.`,
        });
      }

      setDeleteDialogOpen(false);
    }
  };

  const handleProfileSave = (profileData: any) => {
    // Get the profile ID
    const profileId = profileData.id;
    const isEditing = !!selectedProfile;

    // Get the selected device IDs
    const selectedDeviceIds = profileData.deviceIds || [];

    // Find devices that were previously assigned to this profile
    const previouslyAssignedDevices = devices.filter(
      (device) => device.profileId === profileId
    );
    const previouslyAssignedDeviceIds = previouslyAssignedDevices.map(
      (device) => device.id
    );

    // Find devices that need to be assigned to this profile (newly selected)
    const devicesToAssign = selectedDeviceIds.filter(
      (id: string) => !previouslyAssignedDeviceIds.includes(id)
    );

    // Find devices that need to be unassigned from this profile (no longer selected)
    const devicesToUnassign = previouslyAssignedDeviceIds.filter(
      (id) => !selectedDeviceIds.includes(id)
    );

    // Assign selected devices to this profile
    devicesToAssign.forEach((deviceId: string) => {
      updateDevice(deviceId, { profileId });
    });

    // Unassign deselected devices from this profile
    devicesToUnassign.forEach((deviceId) => {
      // Find the default profile to assign unselected devices to
      const defaultProfile = profiles.find((p) => p.isDefault);
      updateDevice(deviceId, {
        profileId: defaultProfile ? defaultProfile.id : null,
      });
    });

    if (isEditing) {
      // Update existing profile
      updateProfile(profileId, profileData);
    } else {
      // Create new profile
      addProfile(profileData);
    }

    // Show success message
    toast({
      title: isEditing ? "Profile updated" : "Profile created",
      description: isEditing
        ? `"${profileData.name}" has been updated successfully.`
        : "New profile has been created successfully.",
    });

    setCreateProfileDialogOpen(false);
  };

  const handleManageAssociations = (profile: any) => {
    setSelectedProfile(profile);
    setAssociationDialogOpen(true);
  };

  const handleDeviceAssociationSave = (deviceIds: string[]) => {
    if (!selectedProfile) return;

    // Get the profile ID
    const profileId = selectedProfile.id;

    // Find devices that were previously assigned to this profile
    const previouslyAssignedDevices = getDevicesByProfileId(profileId);
    const previouslyAssignedDeviceIds = previouslyAssignedDevices.map(
      (device) => device.id
    );

    // Find devices that need to be assigned to this profile (newly selected)
    const devicesToAssign = deviceIds.filter(
      (id) => !previouslyAssignedDeviceIds.includes(id)
    );

    // Find devices that need to be unassigned from this profile (no longer selected)
    const devicesToUnassign = previouslyAssignedDeviceIds.filter(
      (id) => !deviceIds.includes(id)
    );

    // Assign selected devices to this profile
    devicesToAssign.forEach((deviceId) => {
      assignDeviceToProfile(deviceId, profileId);
    });

    // Unassign deselected devices from this profile
    devicesToUnassign.forEach((deviceId) => {
      unassignDeviceFromProfile(deviceId);
    });

    // Trigger a sync to ensure all devices are updated
    syncDeviceProfiles();

    // Show success message
    toast({
      title: "Devices updated",
      description: `Device associations for "${selectedProfile.name}" have been updated.`,
    });

    setAssociationDialogOpen(false);
  };

  const getAssociatedDevices = (profileId: string) => {
    return getDevicesByProfileId(profileId);
  };

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "laptop":
        return <Laptop className='h-4 w-4' />;
      case "smartphone":
        return <Smartphone className='h-4 w-4' />;
      case "tablet":
        return <Tablet className='h-4 w-4' />;
      case "desktop":
        return <Desktop className='h-4 w-4' />;
      case "monitor":
        return <Monitor className='h-4 w-4' />;
      default:
        return <Laptop className='h-4 w-4' />;
    }
  };

  const getDeviceSyncStats = (profileId: string) => {
    const associatedDevices = devices.filter(
      (device) => device.profileId === profileId
    );
    const syncingDevices = associatedDevices.filter(
      (device) => device.status === "active" || device.status === "online"
    );
    const inactiveDevices = associatedDevices.filter(
      (device) => device.status === "inactive" || device.status === "offline"
    );

    return {
      total: associatedDevices.length,
      syncing: syncingDevices.length,
      inactive: inactiveDevices.length,
    };
  };

  const getDeviceTypeCounts = (profileId: string) => {
    const associatedDevices = devices.filter(
      (device) => device.profileId === profileId
    );

    // Group devices by type and count them
    const deviceCounts: Record<string, number> = {};
    const deviceModels: Record<string, Record<string, number>> = {};

    associatedDevices.forEach((device) => {
      // Count by general type
      const type = device.type || "unknown";
      deviceCounts[type] = (deviceCounts[type] || 0) + 1;

      // Count by specific model within type
      if (!deviceModels[type]) deviceModels[type] = {};
      const model = "Generic";
      deviceModels[type][model] = (deviceModels[type][model] || 0) + 1;
    });

    // Format the device type tags
    const deviceTags = [];

    // Common device type display names
    const typeDisplayNames: Record<string, string> = {
      laptop: "Laptop",
      desktop: "Desktop",
      smartphone: "Phone",
      tablet: "Tablet",
      monitor: "Monitor",
    };

    // Add model-specific tags for types with multiple models
    for (const type in deviceModels) {
      const models = deviceModels[type];
      const typeName =
        typeDisplayNames[type] || type.charAt(0).toUpperCase() + type.slice(1);

      if (
        Object.keys(models).length === 1 &&
        Object.keys(models)[0] === "Generic"
      ) {
        // If only generic models, just show the type count
        deviceTags.push({
          type,
          label: `${typeName} (${deviceCounts[type]})`,
        });
      } else {
        // Show specific models
        for (const model in models) {
          if (model !== "Generic") {
            deviceTags.push({
              type,
              label: `${model} (${models[model]})`,
            });
          }
        }

        // If there are generic models of this type, add them too
        if (models["Generic"] && models["Generic"] > 0) {
          deviceTags.push({
            type,
            label: `${typeName} (${models["Generic"]})`,
          });
        }
      }
    }

    return deviceTags;
  };

  const handleSyncProfiles = () => {
    syncDeviceProfiles();
    toast({
      title: "Synchronization started",
      description: "Synchronizing profiles with their devices...",
    });
  };

  const getInactivityReason = (profileId: string) => {
    const profileDevices = getDevicesByProfileId(profileId);

    if (profileDevices.length === 0) {
      return "No devices associated";
    } else if (
      profileDevices.every(
        (device) => device.status === "inactive" || device.status === "offline"
      )
    ) {
      return "All devices offline";
    }

    return "";
  };

  // Get available profiles for reassignment (excluding the selected profile)
  const getAvailableProfiles = () => {
    if (!selectedProfile) return [];

    // Filter out the profile being deleted and any inactive profiles
    return profiles.filter((profile) => {
      if (profile.id === selectedProfile.id) return false;

      // Include all active profiles
      const profileDevices = getDevicesByProfileId(profile.id);
      const isInactive =
        profileDevices.length === 0 ||
        profileDevices.every(
          (device) =>
            device.status === "inactive" || device.status === "offline"
        );

      // Prioritize active profiles, but include inactive ones too if needed
      return true;
    });
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* Main content */}
      <main className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <div className='flex items-center'>
                <h1 className='text-3xl font-bold tracking-tight mb-2 max-md:ml-[52px] '>
                  Settings Profiles
                </h1>
                <a
                  href='https://yourdomain.com/help/settings-profiles'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                  aria-label='Help for Settings Profiles'
                >
                  <HelpCircle className='h-5 w-5' />
                </a>
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
              <p className='text-gray-500 dark:text-gray-400 max-w-2xl'>
                Create and manage settings profiles to apply consistent
                configurations across multiple devices.
              </p>
            </div>
            <Button
              className=' whitespace-nowrap w-full sm:w-auto'
              onClick={handleCreateProfile}
            >
              <Plus className='mr-2 h-4 w-4' />
              Create New Profile
            </Button>
          </div>

          <Tabs
            defaultValue='all'
            className='mb-8'
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className='mb-4'>
              <TabsTrigger
                value='all'
                className={activeTab === "all" ? "font-medium" : ""}
              >
                All Profiles
              </TabsTrigger>
              <TabsTrigger
                value='active'
                className={activeTab === "active" ? "font-medium" : ""}
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value='inactive'
                className={activeTab === "inactive" ? "font-medium" : ""}
              >
                Inactive
              </TabsTrigger>
            </TabsList>

            <TabsContent value='all' className='mt-0'>
              <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {filteredProfiles.map((profile) => {
                  const associatedDevices = getAssociatedDevices(profile.id);
                  const deviceTags = getDeviceTypeCounts(profile.id);
                  const syncStats = getDeviceSyncStats(profile.id);
                  const isDefault = profile.isDefault;
                  const profileDevices = getDevicesByProfileId(profile.id);
                  const isInactive =
                    profileDevices.length === 0 ||
                    profileDevices.every(
                      (device) =>
                        device.status === "inactive" ||
                        device.status === "offline"
                    );

                  return (
                    <Card
                      key={profile.id}
                      className={
                        isDefault
                          ? "border-2 border-emerald-100 dark:border-emerald-900"
                          : ""
                      }
                    >
                      <CardHeader className='pb-4'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-xl'>
                            {profile.name}
                          </CardTitle>
                          {isDefault ? (
                            <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                              Default
                            </Badge>
                          ) : isInactive ? (
                            <Badge
                              variant='outline'
                              className='bg-gray-100 dark:bg-gray-800'
                            >
                              Inactive
                            </Badge>
                          ) : (
                            <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'>
                              Custom
                            </Badge>
                          )}
                        </div>
                        <CardDescription className='text-sm text-gray-500 dark:text-gray-400'></CardDescription>
                      </CardHeader>
                      <CardContent className='pb-4'>
                        <div className='mb-4'>
                          <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                            ASSOCIATED DEVICES
                          </h4>
                          {deviceTags.length > 0 ? (
                            <div className='flex flex-wrap gap-2'>
                              {deviceTags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant='outline'
                                  className='bg-gray-100 dark:bg-gray-800 flex items-center gap-1'
                                >
                                  {getDeviceIcon(tag.type)}
                                  {tag.label}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              No devices associated
                            </p>
                          )}
                        </div>
                        <div>
                          <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                            DEVICE SYNC STATUS
                          </h4>
                          {syncStats.total > 0 ? (
                            <div className='space-y-3'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    Syncing
                                  </span>
                                </div>
                                <span className='font-medium text-sm'>
                                  {syncStats.syncing} devices
                                </span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  <div className='h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    Inactive
                                  </span>
                                </div>
                                <span className='font-medium text-sm'>
                                  {syncStats.inactive} devices
                                </span>
                              </div>
                              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2'>
                                {syncStats.total > 0 && (
                                  <div
                                    className='bg-emerald-500 h-2 rounded-full'
                                    style={{
                                      width: `${
                                        (syncStats.syncing / syncStats.total) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              No devices to sync
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className='flex flex-col sm:flex-row justify-between gap-2'>
                        <div className='flex gap-2 w-full sm:w-auto'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleManageAssociations(profile)}
                            className='flex-1 sm:flex-none'
                          >
                            Manage Devices
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEditProfile(profile)}
                            className='flex-1 sm:flex-none'
                          >
                            Edit
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='ml-auto'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleManageAssociations(profile)}
                            >
                              <Laptop className='mr-2 h-4 w-4' />
                              <span>Manage Devices</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateProfile(profile)}
                            >
                              <Copy className='mr-2 h-4 w-4' />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExportSettings(profile)}
                            >
                              <Download className='mr-2 h-4 w-4' />
                              <span>Export Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleImportSettings(profile)}
                            >
                              <Upload className='mr-2 h-4 w-4' />
                              <span>Import Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSyncProfiles()}
                            >
                              <RefreshCw className='mr-2 h-4 w-4' />
                              <span>Sync Devices</span>
                            </DropdownMenuItem>
                            {!profile.isDefault && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteProfile(profile)}
                                className='text-red-600 dark:text-red-400'
                              >
                                <Trash className='mr-2 h-4 w-4' />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  );
                })}

                {/* Create New Profile Card */}
                <Card
                  className='border-dashed border-2 border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 h-[250px] sm:h-[300px] cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-colors'
                  onClick={handleCreateProfile}
                >
                  <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4'>
                    <Plus className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium mb-2'>
                    Create New Profile
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-4'>
                    Set up a new configuration profile for your devices
                  </p>
                  <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Create Profile
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='active' className='mt-0'>
              <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {filteredProfiles.map((profile) => {
                  const deviceTags = getDeviceTypeCounts(profile.id);
                  const syncStats = getDeviceSyncStats(profile.id);
                  const isDefault = profile.isDefault;

                  return (
                    <Card
                      key={profile.id}
                      className={
                        isDefault
                          ? "border-2 border-emerald-100 dark:border-emerald-900"
                          : ""
                      }
                    >
                      <CardHeader className='pb-4'>
                        <div className='flex items-center justify-between'>
                          <CardTitle className='text-xl'>
                            {profile.name}
                          </CardTitle>
                          {isDefault ? (
                            <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                              Default
                            </Badge>
                          ) : (
                            <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300'>
                              Custom
                            </Badge>
                          )}
                        </div>
                        <CardDescription className='text-sm text-gray-500 dark:text-gray-400'></CardDescription>
                      </CardHeader>
                      <CardContent className='pb-4'>
                        <div className='mb-4'>
                          <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                            ASSOCIATED DEVICES
                          </h4>
                          {deviceTags.length > 0 ? (
                            <div className='flex flex-wrap gap-2'>
                              {deviceTags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant='outline'
                                  className='bg-gray-100 dark:bg-gray-800 flex items-center gap-1'
                                >
                                  {getDeviceIcon(tag.type)}
                                  {tag.label}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              No devices associated
                            </p>
                          )}
                        </div>
                        <div>
                          <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                            DEVICE SYNC STATUS
                          </h4>
                          {syncStats.total > 0 ? (
                            <div className='space-y-3'>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    Syncing
                                  </span>
                                </div>
                                <span className='font-medium text-sm'>
                                  {syncStats.syncing} devices
                                </span>
                              </div>
                              <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                  <div className='h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                                  <span className='text-sm text-gray-600 dark:text-gray-300'>
                                    Inactive
                                  </span>
                                </div>
                                <span className='font-medium text-sm'>
                                  {syncStats.inactive} devices
                                </span>
                              </div>
                              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2'>
                                {syncStats.total > 0 && (
                                  <div
                                    className='bg-emerald-500 h-2 rounded-full'
                                    style={{
                                      width: `${
                                        (syncStats.syncing / syncStats.total) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                              No devices to sync
                            </p>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className='flex flex-col sm:flex-row justify-between gap-2'>
                        <div className='flex gap-2 w-full sm:w-auto'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleManageAssociations(profile)}
                            className='flex-1 sm:flex-none'
                          >
                            Manage Devices
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEditProfile(profile)}
                            className='flex-1 sm:flex-none'
                          >
                            Edit
                          </Button>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='ml-auto'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleManageAssociations(profile)}
                            >
                              <Laptop className='mr-2 h-4 w-4' />
                              <span>Manage Devices</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateProfile(profile)}
                            >
                              <Copy className='mr-2 h-4 w-4' />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExportSettings(profile)}
                            >
                              <Download className='mr-2 h-4 w-4' />
                              <span>Export Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleImportSettings(profile)}
                            >
                              <Upload className='mr-2 h-4 w-4' />
                              <span>Import Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSyncProfiles()}
                            >
                              <RefreshCw className='mr-2 h-4 w-4' />
                              <span>Sync Devices</span>
                            </DropdownMenuItem>
                            {!profile.isDefault && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteProfile(profile)}
                                className='text-red-600 dark:text-red-400'
                              >
                                <Trash className='mr-2 h-4 w-4' />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value='inactive' className='mt-0'>
              {filteredProfiles.length > 0 ? (
                <div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                  {filteredProfiles.map((profile) => {
                    const deviceTags = getDeviceTypeCounts(profile.id);
                    const syncStats = getDeviceSyncStats(profile.id);
                    const inactivityReason = getInactivityReason(profile.id);

                    return (
                      <Card key={profile.id}>
                        <CardHeader className='pb-4'>
                          <div className='flex items-center justify-between'>
                            <CardTitle className='text-xl'>
                              {profile.name}
                            </CardTitle>
                            <div className='flex flex-col items-end'>
                              <Badge
                                variant='outline'
                                className='bg-gray-100 dark:bg-gray-800'
                              >
                                Inactive
                              </Badge>
                              {inactivityReason && (
                                <span className='text-xs text-gray-500 mt-1'>
                                  {inactivityReason}
                                </span>
                              )}
                            </div>
                          </div>
                          <CardDescription className='text-sm text-gray-500 dark:text-gray-400'></CardDescription>
                        </CardHeader>
                        <CardContent className='pb-4'>
                          <div className='mb-4'>
                            <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                              ASSOCIATED DEVICES
                            </h4>
                            {deviceTags.length > 0 ? (
                              <div className='flex flex-wrap gap-2'>
                                {deviceTags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant='outline'
                                    className='bg-gray-100 dark:bg-gray-800 flex items-center gap-1'
                                  >
                                    {getDeviceIcon(tag.type)}
                                    {tag.label}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                No devices associated
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2'>
                              DEVICE SYNC STATUS
                            </h4>
                            {syncStats.total > 0 ? (
                              <div className='space-y-3'>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-2'>
                                    <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                                      Syncing
                                    </span>
                                  </div>
                                  <span className='font-medium text-sm'>
                                    {syncStats.syncing} devices
                                  </span>
                                </div>
                                <div className='flex items-center justify-between'>
                                  <div className='flex items-center gap-2'>
                                    <div className='h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                                      Inactive
                                    </span>
                                  </div>
                                  <span className='font-medium text-sm'>
                                    {syncStats.inactive} devices
                                  </span>
                                </div>
                                <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2'>
                                  {syncStats.total > 0 && (
                                    <div
                                      className='bg-emerald-500 h-2 rounded-full'
                                      style={{
                                        width: `${
                                          (syncStats.syncing /
                                            syncStats.total) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <p className='text-sm text-gray-500 dark:text-gray-400'>
                                No devices to sync
                              </p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className='flex flex-col sm:flex-row justify-between gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full sm:w-auto'
                          >
                            Activate
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteProfile(profile)}
                            className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 w-full sm:w-auto mt-2 sm:mt-0'
                          >
                            <Trash className='h-4 w-4 mr-2' />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-12 text-center'>
                  <div className='rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-gray-500 dark:text-gray-400'
                    >
                      <rect width='20' height='14' x='2' y='3' rx='2' />
                      <path d='M12 17v4' />
                      <path d='M8 21h8' />
                    </svg>
                  </div>
                  <h3 className='text-lg font-medium mb-2'>
                    No Inactive Profiles
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400 max-w-md'>
                    You don't have any inactive profiles. A profile becomes
                    inactive when it has no associated devices or all its
                    devices are offline.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Sticky Create Profile Button for Mobile */}
      <div className='fixed bottom-4 right-4 sm:hidden z-10'>
        <Button
          className='bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-full shadow-lg h-14 w-14 p-0'
          onClick={handleCreateProfile}
        >
          <Plus className='h-6 w-6' />
        </Button>
      </div>

      {/* Create Profile Dialog */}
      <ProfileEditorDialog
        open={createProfileDialogOpen}
        onOpenChange={setCreateProfileDialogOpen}
        profile={selectedProfile}
        devices={devices}
        onSave={handleProfileSave}
        profiles={profiles}
      />

      {/* Device Association Dialog */}
      <DeviceAssociationDialog
        open={associationDialogOpen}
        onOpenChange={setAssociationDialogOpen}
        profile={selectedProfile}
        devices={devices}
        onSave={handleDeviceAssociationSave}
      />

      {/* Import Settings Dialog */}
      <ImportSettingsDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        profileName={selectedProfile?.name || ""}
        onImport={handleImportSettingsSubmit}
      />

      {/* Enhanced Delete Confirmation Dialog with Device Reassignment */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-red-500' />
              Delete Profile
            </AlertDialogTitle>
          </AlertDialogHeader>

          {selectedProfile && (
            <div className='py-2'>
              <div className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Are you sure you want to delete the profile &quot;
                {selectedProfile.name}&quot;? This action cannot be undone.
              </div>

              {/* Show device reassignment options if the profile has devices */}
              {getDevicesByProfileId(selectedProfile.id).length > 0 && (
                <div className='mt-4 space-y-3 border rounded-md p-4 bg-gray-50 dark:bg-gray-900'>
                  <div className='flex items-start gap-2'>
                    <Laptop className='h-5 w-5 text-gray-500 mt-0.5' />
                    <div className='flex-1'>
                      <h4 className='font-medium text-sm'>
                        {getDevicesByProfileId(selectedProfile.id).length}{" "}
                        device
                        {getDevicesByProfileId(selectedProfile.id).length !== 1
                          ? "s"
                          : ""}{" "}
                        associated with this profile
                      </h4>
                      <div className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
                        Please select where to reassign these devices:
                      </div>

                      {getAvailableProfiles().length > 0 ? (
                        <Select
                          value={targetProfileId}
                          onValueChange={setTargetProfileId}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select a profile' />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableProfiles().map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.name}
                                {profile.isDefault && " (Default)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className='flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-md text-sm'>
                          <AlertTriangle className='h-4 w-4' />
                          <div>
                            No other profiles available. Devices will be
                            unassigned.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProfile}
              className='bg-red-600 hover:bg-red-700 text-white'
            >
              Delete Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
