"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Check,
  Copy,
  HelpCircle,
  Info,
  Laptop,
  Smartphone,
  Tablet,
  Download,
  LinkIcon,
  Settings,
  AlertCircle,
  ChevronRight,
  FileText,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionStore } from "@/stores/subscription-store";

interface DeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device?: any;
  profiles: any[];
  onSave: (deviceData: any) => void;
}

// Function to generate a random 25-character key
const generateDeviceKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 25; i++) {
    // Insert a hyphen every 5 characters for readability, except at the beginning
    if (i > 0 && i % 5 === 0) {
      result += "-";
    }
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function DeviceDialog({
  open,
  onOpenChange,
  device,
  profiles,
  onSave,
}: DeviceDialogProps) {
  const isEditing = !!device;
  const { toast } = useToast();
  const themeColor = "emerald"; // Match the theme color used in ProfileEditorDialog

  const [activeTab, setActiveTab] = useState("general");
  const [name, setName] = useState(device?.name || "");
  const [type, setType] = useState(device?.type || "laptop");
  const [ipAddress, setIpAddress] = useState(device?.ipAddress || "");
  const [description, setDescription] = useState(device?.description || "");
  const [profileId, setProfileId] = useState(
    device?.profileId || profiles[0]?.id || ""
  );
  const [status, setStatus] = useState(device?.status || "inactive");
  const [autoConnect, setAutoConnect] = useState(device?.autoConnect || false);
  const [deviceKey, setDeviceKey] = useState("");
  const [keyCopied, setKeyCopied] = useState(false);
  const [nameError, setNameError] = useState("");

  // Generate a new device key when the dialog opens for adding a new device
  useEffect(() => {
    if (open && !isEditing) {
      setDeviceKey(generateDeviceKey());
      setKeyCopied(false);
    }
    // Reset form when device changes
    if (device) {
      setName(device.name || "");
      setType(device.type || "laptop");
      setIpAddress(device.ipAddress || "");
      setDescription(device.description || "");
      setProfileId(device.profileId || profiles[0]?.id || "");
      setStatus(device.status || "inactive");
      setAutoConnect(device.autoConnect || false);
    } else {
      setName("");
      setType("laptop");
      setIpAddress("");
      setDescription("");
      setProfileId(profiles[0]?.id || "");
      setStatus("inactive");
      setAutoConnect(false);
    }
    setNameError("");
    setActiveTab("general");
  }, [open, isEditing, device, profiles]);

  useEffect(() => {
    if (!name.trim()) {
      setNameError("Device name is required");
    } else if (name.trim().length < 3) {
      setNameError("Name must be at least 3 characters");
    } else {
      setNameError("");
    }
  }, [name]);

  const isFormValid = useMemo(() => {
    if (!name.trim()) {
      return false;
    } else if (name.trim().length < 3) {
      return false;
    }
    return true;
  }, [name]);

  const handleSave = () => {
    if (!isFormValid) {
      return;
    }

    const deviceData = {
      id: device?.id || `device-${Date.now()}`,
      name,
      type,
      ipAddress: isEditing ? ipAddress : "Pending connection",
      description,
      profileId,
      status,
      autoConnect,
      lastConnected: device?.lastConnected || null,
      deviceKey: isEditing ? device.deviceKey : deviceKey,
    };

    onSave(deviceData);

    // Force a refresh of the subscription store's device counts if the methods exist
    // const subscriptionStore = useSubscriptionStore.getState()
    // if (typeof subscriptionStore.syncDeviceCount === "function") {
    //   subscriptionStore.syncDeviceCount()
    // }
  };

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(deviceKey);
    setKeyCopied(true);
    toast({
      title: "Sync key copied",
      description: "Ready to paste in your device setup",
    });

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      setKeyCopied(false);
    }, 3000);
  };

  const getDeviceTypeIcon = () => {
    switch (type) {
      case "laptop":
        return <Laptop className='h-5 w-5' />;
      case "smartphone":
        return <Smartphone className='h-5 w-5' />;
      case "tablet":
        return <Tablet className='h-5 w-5' />;
      default:
        return <Laptop className='h-5 w-5' />;
    }
  };

  const goToNextTab = () => {
    if (activeTab === "general") {
      if (isFormValid) {
        setActiveTab("information");
      }
    }
  };

  const goToPreviousTab = () => {
    if (activeTab === "information") {
      setActiveTab("general");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] p-0 overflow-hidden'>
        {isEditing ? (
          // Edit Device - Styled header and tabs like ProfileEditorDialog
          <>
            <div className='bg-white dark:bg-gray-950 p-6 border-b border-gray-100 dark:border-gray-800'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-2'>
                    <Settings className='h-5 w-5 text-emerald-500' />
                  </div>
                  <div>
                    <DialogTitle className='text-xl font-semibold'>
                      Edit Device
                    </DialogTitle>
                    <DialogDescription className='text-gray-500 dark:text-gray-400 mt-1'>
                      Make changes to your device settings
                    </DialogDescription>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {status === "active" ? (
                    <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                      <div className='w-2 h-2 rounded-full bg-emerald-500 mr-2'></div>
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant='outline'
                      className='text-gray-500 dark:text-gray-400'
                    >
                      <div className='w-2 h-2 rounded-full bg-gray-400 mr-2'></div>
                      Inactive
                    </Badge>
                  )}
                  <div className='flex gap-1'>
                    {["general", "information"].map((tab, index) => (
                      <div
                        key={tab}
                        className={`w-2 h-2 rounded-full ${
                          activeTab === tab
                            ? "bg-emerald-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='px-6 pt-6 pb-0'
            >
              <TabsList className='grid w-full grid-cols-2 mb-6'>
                <TabsTrigger
                  value='general'
                  className={
                    activeTab === "general"
                      ? "border-b-2 border-emerald-500 rounded-none"
                      : ""
                  }
                >
                  <FileText className='h-4 w-4 mr-2' />
                  General
                </TabsTrigger>
                <TabsTrigger
                  value='information'
                  className={
                    activeTab === "information"
                      ? "border-b-2 border-emerald-500 rounded-none"
                      : ""
                  }
                >
                  <Info className='h-4 w-4 mr-2' />
                  Information
                </TabsTrigger>
              </TabsList>

              <TabsContent value='general' className='space-y-6 pb-6'>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='name' className='text-sm font-medium'>
                        Device Name
                      </Label>
                      {nameError && (
                        <span className='text-xs text-red-500 flex items-center'>
                          <AlertCircle className='h-3 w-3 mr-1' />
                          {nameError}
                        </span>
                      )}
                    </div>
                    <Input
                      id='name'
                      placeholder='Enter a descriptive name (e.g., Work Laptop)'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim().length >= 3) setNameError("");
                      }}
                      className={`mt-1 ${
                        nameError
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor='description'
                      className='text-sm font-medium'
                    >
                      Description
                    </Label>
                    <Textarea
                      id='description'
                      placeholder='Describe this device (e.g., Personal laptop for work and browsing)'
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className='mt-1 resize-none'
                      rows={3}
                    />
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      A good description helps you identify this device later.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor='profile' className='text-sm font-medium'>
                      Settings Profile
                    </Label>
                    <Select value={profileId} onValueChange={setProfileId}>
                      <SelectTrigger id='profile' className='mt-1'>
                        <SelectValue placeholder='Select a profile' />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className='flex items-center'>
                              <span>{profile.name}</span>
                              {profile.isDefault && (
                                <Badge className='ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'>
                                  Default
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                      The selected profile will determine the settings applied
                      to this device.
                    </p>

                    {/* Add a link to view/edit the selected profile */}
                    {profileId && (
                      <Button
                        variant='link'
                        className='p-0 h-auto text-xs text-emerald-600 dark:text-emerald-400'
                        onClick={(e) => {
                          e.preventDefault();
                          // Open profile editor or navigate to profile page
                          window.open(
                            `/settings-profiles?edit=${profileId}`,
                            "_blank"
                          );
                        }}
                      >
                        View/Edit Profile Settings
                      </Button>
                    )}
                  </div>

                  <div
                    className={`rounded-lg p-4 ${
                      autoConnect
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className='flex flex-col space-y-4'>
                      {/* Sync Toggle Section */}
                      <div className='flex items-center justify-between'>
                        <div>
                          <Label htmlFor='sync-toggle' className='font-medium'>
                            Synchronization
                          </Label>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            Enable or disable settings synchronization with this
                            device
                          </p>
                        </div>
                        <div className='flex items-center'>
                          <Switch
                            id='sync-toggle'
                            checked={autoConnect}
                            onCheckedChange={setAutoConnect}
                            className={
                              autoConnect
                                ? "data-[state=checked]:bg-emerald-500"
                                : "data-[state=unchecked]:bg-red-500"
                            }
                          />
                          <span
                            className={`ml-2 text-sm ${
                              autoConnect
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-red-700 dark:text-red-400"
                            }`}
                          >
                            {autoConnect ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end'>
                  <Button
                    onClick={goToNextTab}
                    className='bg-emerald-500 hover:bg-emerald-600'
                  >
                    Continue to Information
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value='information' className='space-y-6 pb-6'>
                <div className='space-y-4'>
                  <div className='grid gap-2'>
                    <Label className='text-sm font-medium'>Device Type</Label>
                    <div className='flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-900'>
                      <div className='w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center'>
                        {getDeviceTypeIcon()}
                      </div>
                      <span className='capitalize'>{type}</span>
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <Label className='text-sm font-medium'>IP Address</Label>
                    <div className='flex gap-2'>
                      <Input
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder='Device IP address'
                        className='font-mono text-sm'
                      />
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <Label className='text-sm font-medium'>
                      Connection History
                    </Label>
                    <div className='rounded-md border border-gray-200 dark:border-gray-800 p-4 text-sm'>
                      {device?.lastConnected ? (
                        <div className='space-y-2'>
                          <div className='flex justify-between'>
                            <span className='text-gray-500 dark:text-gray-400'>
                              Last connected:
                            </span>
                            <span>{device.lastConnected}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-500 dark:text-gray-400'>
                              Connection count:
                            </span>
                            <span>{Math.floor(Math.random() * 50) + 1}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span className='text-gray-500 dark:text-gray-400'>
                              Average session:
                            </span>
                            <span>
                              {Math.floor(Math.random() * 120) + 10} minutes
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className='text-gray-500 dark:text-gray-400'>
                          No connection history available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='grid gap-2'>
                    <Label className='text-sm font-medium'>
                      Device Identifier
                    </Label>
                    <Input
                      disabled
                      value={device?.id || "Will be generated automatically"}
                      className='font-mono text-sm'
                    />
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      This is a unique identifier for your device and cannot be
                      changed.
                    </p>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <Button variant='outline' onClick={goToPreviousTab}>
                    Back to General
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={!isFormValid}
                    className='bg-emerald-500 hover:bg-emerald-600'
                  >
                    <Check className='h-4 w-4 mr-2' />
                    Save Changes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Add Device - Keep the existing streamlined interface
          <>
            <DialogHeader className='p-6 pb-0'>
              <DialogTitle className='text-xl'>Connect New Device</DialogTitle>
              <DialogDescription>
                Follow these steps to connect a new device
              </DialogDescription>
            </DialogHeader>

            <div className='p-6 space-y-6'>
              <div className='flex justify-between mb-6'>
                <div className='w-full max-w-[500px] mx-auto flex justify-between'>
                  <div className='flex flex-col items-center'>
                    <div className='w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-2'>
                      <Download className='h-5 w-5' />
                    </div>
                    <span className='text-xs font-medium'>Install</span>
                  </div>
                  <div className='w-16 border-t-2 border-dashed border-gray-200 dark:border-gray-700 self-start mt-5'></div>
                  <div className='flex flex-col items-center'>
                    <div className='w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-2'>
                      <LinkIcon className='h-5 w-5' />
                    </div>
                    <span className='text-xs font-medium'>Connect</span>
                  </div>
                  <div className='w-16 border-t-2 border-dashed border-gray-200 dark:border-gray-700 self-start mt-5'></div>
                  <div className='flex flex-col items-center'>
                    <div className='w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300 mb-2'>
                      <Settings className='h-5 w-5' />
                    </div>
                    <span className='text-xs font-medium'>Sync</span>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div className='bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-5 shadow-sm'>
                  <div className='flex items-center justify-between mb-4'>
                    <Label htmlFor='sync-key' className='text-base font-medium'>
                      Your Sync Key
                    </Label>
                  </div>

                  <div className='flex gap-2'>
                    <Input
                      id='sync-key'
                      value={deviceKey}
                      readOnly
                      className='font-mono text-base bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                    />
                    <Button
                      onClick={copyKeyToClipboard}
                      variant={keyCopied ? "default" : "outline"}
                      className={cn(
                        "min-w-[100px]",
                        keyCopied && "bg-emerald-600 hover:bg-emerald-700"
                      )}
                    >
                      {keyCopied ? (
                        <>
                          <Check className='h-4 w-4 mr-2' />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className='h-4 w-4 mr-2' />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                    Master Key – Use on all devices anytime
                  </p>
                </div>

                <div className='space-y-4'>
                  <h3 className='font-medium text-base'>
                    How to connect your device
                  </h3>
                  <div className='space-y-3'>
                    <div className='flex gap-3'>
                      <div className='w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0'>
                        1
                      </div>
                      <p className='text-sm'>
                        Install{" "}
                        <span className='font-medium'>Auto Refresh Plus</span>{" "}
                        on your new device
                      </p>
                    </div>

                    <div className='flex gap-3'>
                      <div className='w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0'>
                        2
                      </div>
                      <p className='text-sm'>
                        Open the app and select{" "}
                        <span className='font-medium'>
                          "Connect to Master Device"
                        </span>
                      </p>
                    </div>

                    <div className='flex gap-3'>
                      <div className='w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0'>
                        3
                      </div>
                      <p className='text-sm'>
                        Enter the sync key when prompted to connect devices
                      </p>
                    </div>

                    <div className='flex gap-3'>
                      <div className='w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0'>
                        4
                      </div>
                      <p className='text-sm'>
                        Settings will automatically sync between your devices
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className='p-6 pt-0'>
              <Button
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='gap-2 max-sm:mt-2'
              >
                <HelpCircle className='h-4 w-4' />
                Need Help
              </Button>
              <Button onClick={() => onOpenChange(false)} className='gap-2'>
                <X className='h-4 w-4' />
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
