"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import type React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Check,
  X,
  RefreshCw,
  Trash2,
  ExternalLink,
  Globe,
  Settings,
  Laptop,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  ChevronDown,
  Search,
  SlidersHorizontal,
  Download,
  FileJson,
  FileSpreadsheet,
  Upload,
  Play,
  Pause,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  useNotificationStore,
  type Notification,
} from "@/lib/notification-store";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/lib/store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogClose } from "@radix-ui/react-dialog";

// Predefined sound options
const PREDEFINED_SOUNDS = [
  {
    id: "default",
    name: "Default Notification",
    url: "/notification-sound.mp3",
  },
  { id: "bell", name: "Bell", url: "/sounds/bell.mp3" },
  { id: "chime", name: "Chime", url: "/sounds/chime.mp3" },
  { id: "alert", name: "Alert", url: "/sounds/alert.mp3" },
  { id: "success", name: "Success", url: "/sounds/success.mp3" },
];

// Countdown component for next refresh
const RefreshCountdown = ({
  refreshInterval,
  isRefreshing,
  onCountdownChange,
}: {
  refreshInterval: number;
  isRefreshing: boolean;
  onCountdownChange?: (countdown: number) => void;
}) => {
  const [countdown, setCountdown] = useState(refreshInterval);

  useEffect(() => {
    // Reset countdown when refresh interval changes or when refreshing
    setCountdown(refreshInterval);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        const newValue = prev <= 1 ? refreshInterval : prev - 1;
        if (onCountdownChange) {
          onCountdownChange(newValue);
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, isRefreshing, onCountdownChange]);

  return (
    <span className='text-[10px] text-muted-foreground'>
      Next:{" "}
      {Math.floor(countdown / 60) > 0 ? `${Math.floor(countdown / 60)}m ` : ""}
      {countdown % 60}s
    </span>
  );
};

// Generate a random notification
const generateRandomNotification = (): Notification => {
  // Sample data arrays for random generation
  const urls = [
    "shop.example.com/flash-sale",
    "marketplace.example.com/limited-stock",
    "tracker.example.org/price-drops",
    "deals.example.net/new-arrivals",
    "monitor.example.io/stock-changes",
  ];

  const keywords = [
    "In Stock",
    "Available",
    "Sale",
    "New Price",
    "Limited Time",
    "Deal",
    "Discount",
  ];

  const eventTypes: Array<
    "Keyword Found" | "Keyword Lost" | "Page Change Detected"
  > = ["Keyword Found", "Keyword Lost", "Page Change Detected"];

  const types: Array<"Normal" | "XHR" | "Custom"> = ["Normal", "XHR", "Custom"];

  const deviceNames = [
    "Windows PC",
    "MacBook Pro",
    "iPad",
    "iPhone 13",
    "Galaxy S22",
    "Office PC",
  ];

  const profileNames = [
    "Default Profile",
    "Work Profile",
    "Shopping Profile",
    "Personal Profile",
    "Media Profile",
  ];

  // Generate random values
  const url = urls[Math.floor(Math.random() * urls.length)];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const deviceName =
    deviceNames[Math.floor(Math.random() * deviceNames.length)];
  const profileName =
    profileNames[Math.floor(Math.random() * profileNames.length)];

  return {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    url,
    keyword,
    eventType,
    type,
    deviceName,
    profileName,
    timestamp: "Just now",
    isNew: true, // Mark as new for animation
    read: false, // New notifications are unread by default
  };
};

// Sound Settings Dialog Component
const SoundSettingsDialog = ({
  soundEnabled,
  setSoundEnabled,
  selectedSound,
  setSelectedSound,
  volume,
  setVolume,
  customSoundUrl,
  setCustomSoundUrl,
}: {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  selectedSound: string;
  setSelectedSound: (sound: string) => void;
  volume: number[];
  setVolume: (volume: number[]) => void;
  customSoundUrl: string;
  setCustomSoundUrl: (url: string) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlValidationStatus, setUrlValidationStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [urlValidationMessage, setUrlValidationMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (selectedSound === "custom" && customSoundUrl) {
      audioRef.current = new Audio(customSoundUrl);
    } else {
      const sound = PREDEFINED_SOUNDS.find((s) => s.id === selectedSound);
      audioRef.current = new Audio(sound?.url || PREDEFINED_SOUNDS[0].url);
    }

    audioRef.current.volume = volume[0] / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [selectedSound, customSoundUrl, volume]);

  // Handle play/pause
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      // Create a new audio element each time to avoid interruption issues
      const soundToPlay =
        selectedSound === "custom" && customSoundUrl
          ? customSoundUrl
          : PREDEFINED_SOUNDS.find((s) => s.id === selectedSound)?.url ||
            PREDEFINED_SOUNDS[0].url;

      // Dispose of previous audio element if it exists
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create a new audio element
      const audio = new Audio(soundToPlay);
      audio.volume = volume[0] / 100;

      // Set up event listeners
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      audio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
      });

      // Ensure audio is loaded before playing
      audio.addEventListener("canplaythrough", () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Playback failed:", error);
              setIsPlaying(false);
            });
        }
      });

      // Store the audio element
      audioRef.current = audio;

      // Start loading the audio
      audio.load();
    }
  };

  // Handle audio ended event
  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [audioRef.current]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an audio file
    if (!file.type.startsWith("audio/")) {
      setUploadError("Please upload an audio file (MP3, WAV, OGG, etc.)");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size exceeds 2MB limit");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError("");

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate file upload (in a real app, this would be an actual upload to a server)
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Create object URL for the uploaded file
      const objectUrl = URL.createObjectURL(file);
      setCustomSoundUrl(objectUrl);
      setSelectedSound("custom");
      setIsUploading(false);

      // Validate the URL
      setUrlValidationStatus("valid");
      setUrlValidationMessage("Custom sound uploaded successfully");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 2000);
  };

  // Handle URL validation
  const validateAudioUrl = () => {
    if (!customSoundUrl) {
      setUrlValidationStatus("invalid");
      setUrlValidationMessage("Please enter a URL");
      return;
    }

    setIsValidatingUrl(true);
    setUrlValidationStatus("validating");

    // Create a temporary audio element to test the URL
    const audio = new Audio(customSoundUrl);

    // Set up event listeners
    audio.addEventListener("canplaythrough", () => {
      setIsValidatingUrl(false);
      setUrlValidationStatus("valid");
      setUrlValidationMessage("Audio URL validated successfully");
    });

    audio.addEventListener("error", () => {
      setIsValidatingUrl(false);
      setUrlValidationStatus("invalid");
      setUrlValidationMessage(
        "Invalid audio URL. Please check the URL and try again."
      );
    });

    // Start loading the audio
    audio.load();
  };

  return (
    <DialogContent className='sm:max-w-[500px]'>
      <DialogHeader>
        <DialogTitle>Notification Sound Settings</DialogTitle>
        <DialogDescription>
          Customize how notification sounds are played when new alerts are
          received.
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-6 py-4'>
        {/* Enable/Disable Sound */}
        <div className='flex items-center justify-between'>
          <div className='space-y-0.5'>
            <Label className='text-base'>Sound Notifications</Label>
            <p className='text-sm text-muted-foreground'>
              Enable or disable notification sounds
            </p>
          </div>
          <Button
            variant={soundEnabled ? "default" : "outline"}
            size='sm'
            onClick={() => setSoundEnabled(!soundEnabled)}
            className='min-w-[100px]'
          >
            {soundEnabled ? (
              <>
                <Volume2 className='mr-2 h-4 w-4' />
                Enabled
              </>
            ) : (
              <>
                <VolumeX className='mr-2 h-4 w-4' />
                Disabled
              </>
            )}
          </Button>
        </div>

        {/* Sound Selection */}
        <div className='space-y-4'>
          <Label className='text-base'>Select Notification Sound</Label>
          <RadioGroup
            value={selectedSound}
            onValueChange={setSelectedSound}
            className='space-y-3'
          >
            {PREDEFINED_SOUNDS.map((sound) => (
              <div key={sound.id} className='flex items-center space-x-2'>
                <RadioGroupItem value={sound.id} id={sound.id} />
                <Label htmlFor={sound.id} className='flex items-center'>
                  {sound.name}
                  {sound.id === "default" && (
                    <Badge className='ml-2'>Default</Badge>
                  )}
                </Label>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 ml-auto'
                  onClick={(e) => {
                    e.preventDefault();
                    if (isPlaying) {
                      // If already playing, stop it first
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                        setIsPlaying(false);
                      }
                    } else {
                      // Create a new audio element to avoid interruption
                      const audio = new Audio(sound.url);
                      audio.volume = volume[0] / 100;

                      // Set up event listeners
                      audio.addEventListener("ended", () => {
                        setIsPlaying(false);
                      });

                      audio.addEventListener("error", (e) => {
                        console.error("Audio playback error:", e);
                        setIsPlaying(false);
                      });

                      // Ensure audio is loaded before playing
                      audio.addEventListener("canplaythrough", () => {
                        const playPromise = audio.play();
                        if (playPromise !== undefined) {
                          playPromise
                            .then(() => {
                              setIsPlaying(true);
                            })
                            .catch((error) => {
                              console.error("Playback failed:", error);
                              setIsPlaying(false);
                            });
                        }
                      });

                      // Store the audio element
                      if (audioRef.current) {
                        audioRef.current.pause();
                      }
                      audioRef.current = audio;

                      // Start loading the audio
                      audio.load();
                    }
                  }}
                >
                  {isPlaying && selectedSound === sound.id ? (
                    <Pause className='h-4 w-4' />
                  ) : (
                    <Play className='h-4 w-4' />
                  )}
                </Button>
              </div>
            ))}

            {/* Custom Sound Option */}
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='custom' id='custom' />
              <Label htmlFor='custom'>Custom Sound</Label>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 ml-auto'
                disabled={!customSoundUrl || selectedSound !== "custom"}
                onClick={(e) => {
                  e.preventDefault();
                  if (isPlaying) {
                    // If already playing, stop it first
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                      setIsPlaying(false);
                    }
                  } else if (customSoundUrl) {
                    // Create a new audio element to avoid interruption
                    const audio = new Audio(customSoundUrl);
                    audio.volume = volume[0] / 100;

                    // Set up event listeners
                    audio.addEventListener("ended", () => {
                      setIsPlaying(false);
                    });

                    audio.addEventListener("error", (e) => {
                      console.error("Audio playback error:", e);
                      setIsPlaying(false);
                    });

                    // Ensure audio is loaded before playing
                    audio.addEventListener("canplaythrough", () => {
                      const playPromise = audio.play();
                      if (playPromise !== undefined) {
                        playPromise
                          .then(() => {
                            setIsPlaying(true);
                          })
                          .catch((error) => {
                            console.error("Playback failed:", error);
                            setIsPlaying(false);
                          });
                      }
                    });

                    // Store the audio element
                    if (audioRef.current) {
                      audioRef.current.pause();
                    }
                    audioRef.current = audio;

                    // Start loading the audio
                    audio.load();
                  }
                }}
              >
                {isPlaying && selectedSound === "custom" ? (
                  <Pause className='h-4 w-4' />
                ) : (
                  <Play className='h-4 w-4' />
                )}
              </Button>
            </div>
          </RadioGroup>
        </div>

        {/* Custom Sound URL Input */}
        {selectedSound === "custom" && (
          <div className='space-y-3'>
            <Label htmlFor='custom-sound-url'>Custom Sound URL</Label>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Input
                  id='custom-sound-url'
                  placeholder='https://example.com/sound.mp3'
                  value={customSoundUrl}
                  onChange={(e) => {
                    setCustomSoundUrl(e.target.value);
                    setUrlValidationStatus("idle");
                  }}
                  className={cn(
                    urlValidationStatus === "valid" &&
                      "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-400",
                    urlValidationStatus === "invalid" &&
                      "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-400"
                  )}
                  disabled={isValidatingUrl}
                />
                {urlValidationStatus !== "idle" && (
                  <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                    {urlValidationStatus === "validating" ? (
                      <RefreshCw className='h-4 w-4 text-gray-400 animate-spin' />
                    ) : urlValidationStatus === "valid" ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <X className='h-4 w-4 text-red-500' />
                    )}
                  </div>
                )}
              </div>
              <Button
                onClick={validateAudioUrl}
                disabled={isValidatingUrl || !customSoundUrl}
                className='whitespace-nowrap'
              >
                {isValidatingUrl ? (
                  <div className='flex items-center gap-1'>
                    <RefreshCw className='h-4 w-4 animate-spin' />
                    <span>Validating</span>
                  </div>
                ) : (
                  <span>Validate URL</span>
                )}
              </Button>
            </div>

            {urlValidationMessage && (
              <div
                className={cn(
                  "p-3 rounded-md text-sm flex items-center gap-2",
                  urlValidationStatus === "valid"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                )}
              >
                {urlValidationStatus === "valid" ? (
                  <Check className='h-4 w-4 flex-shrink-0' />
                ) : (
                  <AlertCircle className='h-4 w-4 flex-shrink-0' />
                )}
                <span>{urlValidationMessage}</span>
              </div>
            )}

            <div className='flex items-center gap-2 mt-2'>
              <div className='relative'>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Upload className='h-4 w-4' />
                  Upload Sound File
                  <input
                    type='file'
                    className='absolute inset-0 opacity-0 cursor-pointer'
                    accept='audio/*'
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    disabled={isUploading}
                  />
                </Button>
              </div>
              <p className='text-xs text-muted-foreground'>Max size: 2MB</p>
            </div>

            {isUploading && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-xs'>
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className='h-2' />
              </div>
            )}

            {uploadError && (
              <div className='p-3 rounded-md text-sm flex items-center gap-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'>
                <AlertCircle className='h-4 w-4 flex-shrink-0' />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        )}

        {/* Volume Control */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='text-base'>Volume</Label>
            <span className='text-sm font-medium'>{volume[0]}%</span>
          </div>
          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => setVolume([Math.max(0, volume[0] - 10)])}
            >
              <Volume2 className='h-4 w-4' />
            </Button>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className='flex-1'
              onValueCommit={(value) => {
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                }
              }}
            />
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => setVolume([Math.min(100, volume[0] + 10)])}
            >
              <Volume2 className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Test Sound Button */}
        <Button
          onClick={togglePlayback}
          disabled={
            !soundEnabled || (selectedSound === "custom" && !customSoundUrl)
          }
          className='w-full'
        >
          {isPlaying ? (
            <>
              <Pause className='mr-2 h-4 w-4' />
              Stop Sound
            </>
          ) : (
            <>
              <Play className='mr-2 h-4 w-4' />
              Test Sound
            </>
          )}
        </Button>
      </div>

      <DialogFooter>
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <Info className='h-4 w-4' />
          <span>Settings are automatically saved</span>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};

// Export Dialog Component
const ExportDialog = ({
  notifications,
  selectedProfiles,
  selectedDevices,
  readFilter,
  activeTab,
  searchQuery,
  profiles,
  devices,
}: {
  notifications: Notification[];
  selectedProfiles: string[];
  selectedDevices: string[];
  readFilter: "all" | "read" | "unread";
  activeTab: string;
  searchQuery: string;
  profiles: any[];
  devices: any[];
}) => {
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [exportError, setExportError] = useState("");
  const [includeReadStatus, setIncludeReadStatus] = useState(true);
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);
  const [includeProfileInfo, setIncludeProfileInfo] = useState(true);
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [exportFilename, setExportFilename] = useState(
    `notifications-export-${new Date().toISOString().split("T")[0]}`
  );

  // Filter notifications based on current filters
  const filteredNotifications = useMemo(() => {
    let result = notifications;

    // Filter by event type (tab)
    if (activeTab !== "all") {
      result = result.filter(
        (notification) => notification.eventType.toLowerCase() === activeTab
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (notification) =>
          notification.url.toLowerCase().includes(query) ||
          notification.keyword.toLowerCase().includes(query) ||
          notification.deviceName.toLowerCase().includes(query) ||
          notification.profileName.toLowerCase().includes(query)
      );
    }

    // Filter by profiles
    if (selectedProfiles.length > 0) {
      // Find profile names from IDs
      const profileNames = selectedProfiles
        .map((id) => profiles.find((p) => p.id === id)?.name || "")
        .filter((name) => name);

      result = result.filter((notification) =>
        profileNames.some((name) => notification.profileName === name)
      );
    }

    // Filter by devices
    if (selectedDevices.length > 0) {
      // Find device names from IDs
      const deviceNames = selectedDevices
        .map((id) => devices.find((d) => d.id === id)?.name || "")
        .filter((name) => name);

      result = result.filter((notification) =>
        deviceNames.some((name) => notification.deviceName === name)
      );
    }

    // Filter by read status
    if (readFilter === "read") {
      result = result.filter((notification) => notification.read);
    } else if (readFilter === "unread") {
      result = result.filter((notification) => !notification.read);
    }

    return result;
  }, [
    notifications,
    activeTab,
    searchQuery,
    selectedProfiles,
    selectedDevices,
    readFilter,
    profiles,
    devices,
  ]);

  // Reset state when dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (!open) {
      setExportProgress(0);
      setIsExporting(false);
      setExportComplete(false);
      setExportError("");
    }
  };

  // Export notifications
  const exportNotifications = () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    setExportError("");

    // Simulate export progress
    const totalSteps = 10;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setExportProgress((currentStep / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        finishExport();
      }
    }, 200);

    // Prepare export data
    const exportData = filteredNotifications.map((notification) => {
      const data: Record<string, any> = {
        url: notification.url,
        keyword: notification.keyword,
        eventType: notification.eventType,
        type: notification.type,
      };

      if (includeReadStatus) {
        data.read = notification.read;
      }

      if (includeDeviceInfo) {
        data.deviceName = notification.deviceName;
      }

      if (includeProfileInfo) {
        data.profileName = notification.profileName;
      }

      if (includeTimestamp) {
        data.timestamp = notification.timestamp;
      }

      return data;
    });

    // Store export data for download
    sessionStorage.setItem("exportData", JSON.stringify(exportData));
  };

  // Finish export and trigger download
  const finishExport = () => {
    try {
      const exportData = JSON.parse(
        sessionStorage.getItem("exportData") || "[]"
      );

      if (exportData.length === 0) {
        setExportError("No notifications to export");
        setIsExporting(false);
        return;
      }

      let dataStr: string;
      let mimeType: string;
      let fileExtension: string;

      if (exportFormat === "json") {
        dataStr = JSON.stringify(exportData, null, 2);
        mimeType = "application/json";
        fileExtension = "json";
      } else {
        // CSV format
        const headers = Object.keys(exportData[0]).join(",");
        const rows = exportData.map((item: any) =>
          Object.values(item).join(",")
        );
        dataStr = [headers, ...rows].join("\n");
        mimeType = "text/csv";
        fileExtension = "csv";
      }

      // Create download link
      const blob = new Blob([dataStr], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${exportFilename}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportComplete(true);
      setIsExporting(false);
      sessionStorage.removeItem("exportData");
    } catch (error) {
      console.error("Export error:", error);
      setExportError("An error occurred during export");
      setIsExporting(false);
    }
  };

  return (
    <DialogContent className='sm:max-w-[500px]'>
      <DialogHeader>
        <DialogTitle>Export Notifications</DialogTitle>
        <DialogDescription>
          Export your notifications to CSV or JSON format with your preferred
          settings.
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-6 py-4'>
        {/* Export Format */}
        <div className='space-y-3'>
          <Label className='text-base'>Export Format</Label>
          <RadioGroup
            value={exportFormat}
            onValueChange={(value: "csv" | "json") => setExportFormat(value)}
            className='flex gap-4'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='csv' id='csv' />
              <Label htmlFor='csv' className='flex items-center gap-2'>
                <FileSpreadsheet className='h-4 w-4' />
                CSV
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='json' id='json' />
              <Label htmlFor='json' className='flex items-center gap-2'>
                <FileJson className='h-4 w-4' />
                JSON
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Export Filename */}
        <div className='space-y-3'>
          <Label htmlFor='export-filename' className='text-base'>
            Filename
          </Label>
          <div className='flex gap-2 items-center'>
            <Input
              id='export-filename'
              value={exportFilename}
              onChange={(e) => setExportFilename(e.target.value)}
              placeholder='notifications-export'
            />
            <span className='text-sm text-muted-foreground'>
              .{exportFormat}
            </span>
          </div>
        </div>

        {/* Export Options */}
        <div className='space-y-3'>
          <Label className='text-base'>Include Fields</Label>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='include-read-status'
                checked={includeReadStatus}
                onChange={(e) => setIncludeReadStatus(e.target.checked)}
                className='rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='include-read-status'>Read Status</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='include-device-info'
                checked={includeDeviceInfo}
                onChange={(e) => setIncludeDeviceInfo(e.target.checked)}
                className='rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='include-device-info'>Device Info</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='include-profile-info'
                checked={includeProfileInfo}
                onChange={(e) => setIncludeProfileInfo(e.target.checked)}
                className='rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='include-profile-info'>Profile Info</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='include-timestamp'
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className='rounded border-gray-300 text-primary focus:ring-primary'
              />
              <Label htmlFor='include-timestamp'>Timestamp</Label>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <div className='bg-muted p-4 rounded-md space-y-2'>
          <h4 className='font-medium text-sm'>Export Summary</h4>
          <div className='text-sm space-y-1'>
            <p>
              Format:{" "}
              <span className='font-medium'>{exportFormat.toUpperCase()}</span>
            </p>
            <p>
              Notifications:{" "}
              <span className='font-medium'>
                {filteredNotifications.length}
              </span>
            </p>
            <p>
              Filters Applied:{" "}
              <span className='font-medium'>
                {selectedProfiles.length +
                  selectedDevices.length +
                  (readFilter !== "all" ? 1 : 0) +
                  (searchQuery ? 1 : 0)}
              </span>
            </p>
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span>Exporting notifications...</span>
              <span>{Math.round(exportProgress)}%</span>
            </div>
            <Progress value={exportProgress} className='h-2' />
          </div>
        )}

        {/* Export Complete Message */}
        {exportComplete && (
          <div className='p-3 rounded-md text-sm flex items-center gap-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'>
            <Check className='h-4 w-4 flex-shrink-0' />
            <span>Export completed successfully!</span>
          </div>
        )}

        {/* Export Error Message */}
        {exportError && (
          <div className='p-3 rounded-md text-sm flex items-center gap-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'>
            <AlertCircle className='h-4 w-4 flex-shrink-0' />
            <span>{exportError}</span>
          </div>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant='outline'
            onClick={() => handleDialogOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          onClick={exportNotifications}
          disabled={isExporting || filteredNotifications.length === 0}
        >
          {isExporting ? (
            <>
              <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
              Exporting...
            </>
          ) : (
            <>
              <Download className='mr-2 h-4 w-4' />
              Export {filteredNotifications.length} Notifications
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default function NotificationCenter() {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();
  const { devices, profiles } = useDeviceStore();
  const [activeTab, setActiveTab] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null); // Track which notification is being marked as read
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  // Advanced filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">(
    "all"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Sound settings state
  const [selectedSound, setSelectedSound] = useState("default");
  const [volume, setVolume] = useState([50]);
  const [customSoundUrl, setCustomSoundUrl] = useState("");

  // Export dialog state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [soundSettingsDialogOpen, setSoundSettingsDialogOpen] = useState(false);

  const [countdown, setCountdown] = useState(refreshInterval);

  // Get devices associated with selected profiles
  const filteredDevices = useMemo(() => {
    if (selectedProfiles.length === 0) return devices;
    return devices.filter((device) => selectedProfiles.includes(device.id));
  }, [devices, selectedProfiles]);

  // Initialize audio element
  useEffect(() => {
    // Create audio element based on selected sound
    if (selectedSound === "custom" && customSoundUrl) {
      notificationSoundRef.current = new Audio(customSoundUrl);
    } else {
      const sound = PREDEFINED_SOUNDS.find((s) => s.id === selectedSound);
      notificationSoundRef.current = new Audio(
        sound?.url || PREDEFINED_SOUNDS[0].url
      );
    }

    // Set volume
    if (notificationSoundRef.current) {
      notificationSoundRef.current.volume = volume[0] / 100;
    }

    // Create a fallback sound using AudioContext if the audio file fails to load
    notificationSoundRef.current?.addEventListener("error", () => {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitContext)();

        // Store the audio context for later use
        notificationSoundRef.current = {
          play: () => {
            // Create a short bell-like sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(830, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
              500,
              audioContext.currentTime + 0.2
            );

            gainNode.gain.setValueAtTime(
              0.3 * (volume[0] / 100),
              audioContext.currentTime
            );
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 0.5
            );

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);

            // Return a resolved promise to mimic the Audio.play() API
            return Promise.resolve();
          },
        } as any;
      } catch (e) {
        console.error("Could not create audio fallback:", e);
        // Create a dummy play method that does nothing but returns a resolved promise
        notificationSoundRef.current = { play: () => Promise.resolve() } as any;
      }
    });

    return () => {
      if (
        notificationSoundRef.current &&
        "pause" in notificationSoundRef.current
      ) {
        notificationSoundRef.current.pause();
      }
    };
  }, [selectedSound, customSoundUrl, volume]);

  // Auto-refresh functionality
  useEffect(() => {
    const fetchNewNotifications = () => {
      setIsRefreshing(true);

      // Simulate network delay (300-1500ms)
      setTimeout(() => {
        // 40% chance of getting a new notification on each refresh
        if (Math.random() < 0.4) {
          const newNotification = generateRandomNotification();
          addNotification(newNotification);

          // Play sound if enabled
          if (soundEnabled) {
            try {
              // Create a new audio element each time to avoid interruption
              const soundToPlay =
                selectedSound === "custom" && customSoundUrl
                  ? customSoundUrl
                  : PREDEFINED_SOUNDS.find((s) => s.id === selectedSound)
                      ?.url || PREDEFINED_SOUNDS[0].url;

              const audio = new Audio(soundToPlay);
              audio.volume = volume[0] / 100;

              // Ensure audio is loaded before playing
              audio.addEventListener("canplaythrough", () => {
                const playPromise = audio.play();
                if (playPromise && typeof playPromise.catch === "function") {
                  playPromise.catch((e) =>
                    console.log("Error playing sound:", e)
                  );
                }
              });

              // Handle errors
              audio.addEventListener("error", (e) => {
                console.error("Audio playback error:", e);
              });

              // Start loading the audio
              audio.load();
            } catch (e) {
              console.log("Error playing notification sound:", e);
            }
          }
        }

        setIsRefreshing(false);
      }, Math.random() * 1200 + 300);
    };

    // Set up interval for auto-refresh
    const intervalId = setInterval(
      fetchNewNotifications,
      refreshInterval * 1000
    );

    // Clean up
    return () => clearInterval(intervalId);
  }, [
    addNotification,
    refreshInterval,
    soundEnabled,
    notificationSoundRef,
    selectedSound,
    customSoundUrl,
    volume,
  ]);

  // Update timestamps periodically
  useEffect(() => {
    const updateTimestamps = () => {
      const updatedNotifications = notifications.map((notification) => {
        if (notification.timestamp === "Just now") {
          return { ...notification, timestamp: "1 minute ago", isNew: false };
        } else if (notification.timestamp === "1 minute ago") {
          return { ...notification, timestamp: "Few minutes ago" };
        }
        return notification;
      });

      if (
        JSON.stringify(updatedNotifications) !== JSON.stringify(notifications)
      ) {
        // We would update the store here, but since we don't have a direct way to replace all notifications,
        // in a real implementation we would add this functionality to the store
      }
    };

    const timestampInterval = setInterval(updateTimestamps, 60000); // Every minute

    return () => clearInterval(timestampInterval);
  }, [notifications]);

  // Apply all filters to notifications
  const filteredNotifications = useMemo(() => {
    let result = notifications;

    // Filter by event type (tab)
    if (activeTab !== "all") {
      result = result.filter(
        (notification) => notification.eventType.toLowerCase() === activeTab
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (notification) =>
          notification.url.toLowerCase().includes(query) ||
          notification.keyword.toLowerCase().includes(query) ||
          notification.deviceName.toLowerCase().includes(query) ||
          notification.profileName.toLowerCase().includes(query)
      );
    }

    // Filter by profiles
    if (selectedProfiles.length > 0) {
      // Find profile names from IDs
      const profileNames = selectedProfiles
        .map((id) => profiles.find((p) => p.id === id)?.name || "")
        .filter((name) => name);

      result = result.filter((notification) =>
        profileNames.some((name) => notification.profileName === name)
      );
    }

    // Filter by devices
    if (selectedDevices.length > 0) {
      // Find device names from IDs
      const deviceNames = selectedDevices
        .map((id) => devices.find((d) => d.id === id)?.name || "")
        .filter((name) => name);

      result = result.filter((notification) =>
        deviceNames.some((name) => notification.deviceName === name)
      );
    }

    // Filter by read status
    if (readFilter === "read") {
      result = result.filter((notification) => notification.read);
    } else if (readFilter === "unread") {
      result = result.filter((notification) => !notification.read);
    }

    return result;
  }, [
    notifications,
    activeTab,
    searchQuery,
    selectedProfiles,
    selectedDevices,
    readFilter,
    profiles,
    devices,
  ]);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle manual refresh
  const handleManualRefresh = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);

      setTimeout(() => {
        const newNotification = generateRandomNotification();
        addNotification(newNotification);

        // Play sound if enabled
        if (soundEnabled) {
          try {
            // Create a new audio element each time to avoid interruption
            const soundToPlay =
              selectedSound === "custom" && customSoundUrl
                ? customSoundUrl
                : PREDEFINED_SOUNDS.find((s) => s.id === selectedSound)?.url ||
                  PREDEFINED_SOUNDS[0].url;

            const audio = new Audio(soundToPlay);
            audio.volume = volume[0] / 100;

            // Ensure audio is loaded before playing
            audio.addEventListener("canplaythrough", () => {
              const playPromise = audio.play();
              if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch((e) =>
                  console.log("Error playing sound:", e)
                );
              }
            });

            // Handle errors
            audio.addEventListener("error", (e) => {
              console.error("Audio playback error:", e);
            });

            // Start loading the audio
            audio.load();
          } catch (e) {
            console.log("Error playing notification sound:", e);
          }
        }

        setIsRefreshing(false);
      }, 800);
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Change refresh interval
  const handleRefreshIntervalChange = (value: string) => {
    setRefreshInterval(Number.parseInt(value));
  };

  // Handle notification click to mark as read
  const handleNotificationClick = async (
    e: React.MouseEvent,
    notification: Notification
  ) => {
    // Don't mark as read if already read
    if (notification.read) return;

    // Don't mark as read if clicking on a button or link
    if (
      e.target instanceof HTMLElement &&
      (e.target.closest("button") ||
        e.target.closest("a") ||
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "A")
    ) {
      return;
    }

    // Set loading state
    setMarkingAsRead(notification.id);

    // Mark as read
    await markAsRead(notification.id);

    // Clear loading state
    setMarkingAsRead(null);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    setIsRefreshing(true);
    await markAllAsRead();
    setIsRefreshing(false);
  };

  // Toggle profile selection
  const toggleProfile = (profileId: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((id) => id !== profileId)
        : [...prev, profileId]
    );

    // Clear device selection if profile changes
    setSelectedDevices([]);
  };

  // Toggle device selection
  const toggleDevice = (deviceId: string) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedProfiles([]);
    setSelectedDevices([]);
    setReadFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedProfiles.length > 0 ||
    selectedDevices.length > 0 ||
    readFilter !== "all";

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "keyword found":
        return "#10b981"; // green
      case "keyword lost":
        return "#ef4444"; // red
      case "page change detected":
        return "#10b981"; // changed from blue to green
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <>
      <div className='container mx-auto px-4 py-6 max-w-6xl'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight max-md:ml-[52px]'>
              Notification Center
            </h1>
            <p className='text-muted-foreground mt-1.5'>
              View and manage all your recent notifications triggered by keyword
              activity across your devices.
            </p>
          </div>
        </div>

        {/* Advanced filtering UI */}
        <div className='mb-6'>
          <div className='flex flex-col md:flex-row gap-3 mb-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search notifications by URL, keyword, device or profile...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />
            </div>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                className={cn(
                  "flex items-center gap-2",
                  showFilters && "bg-muted"
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className='h-4 w-4' />
                Filters
                {hasActiveFilters && (
                  <Badge
                    variant='secondary'
                    className='ml-1 px-1.5 py-0 h-5 min-w-5 flex items-center justify-center'
                  >
                    {selectedProfiles.length +
                      selectedDevices.length +
                      (readFilter !== "all" ? 1 : 0) +
                      (searchQuery ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              {hasActiveFilters && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={resetFilters}
                  className='text-xs'
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className='bg-muted/40 p-4 rounded-md mb-4 border'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {/* Profile filter */}
                <div>
                  <h3 className='text-sm font-medium mb-2 flex items-center'>
                    <Settings className='h-4 w-4 mr-2 text-muted-foreground' />
                    Settings Profiles
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                      >
                        <span className='truncate'>
                          {selectedProfiles.length === 0
                            ? "All Profiles"
                            : selectedProfiles.length === 1
                            ? profiles.find((p) => p.id === selectedProfiles[0])
                                ?.name || "1 Profile"
                            : `${selectedProfiles.length} Profiles`}
                        </span>
                        <ChevronDown className='h-4 w-4 ml-2 opacity-50' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='md:w-56 '>
                      <DropdownMenuLabel>Filter by Profile</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {profiles.map((profile) => (
                        <DropdownMenuCheckboxItem
                          key={profile.id}
                          checked={selectedProfiles.includes(profile.id)}
                          onCheckedChange={() => toggleProfile(profile.id)}
                        >
                          {profile.name}
                          {profile.isDefault && (
                            <span className='ml-2 text-xs text-muted-foreground'>
                              (Default)
                            </span>
                          )}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Device filter */}
                <div>
                  <h3 className='text-sm font-medium mb-2 flex items-center'>
                    <Laptop className='h-4 w-4 mr-2 text-muted-foreground' />
                    Devices
                  </h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='outline'
                        className='w-full justify-between'
                      >
                        <span className='truncate'>
                          {selectedDevices.length === 0
                            ? "All Devices"
                            : selectedDevices.length === 1
                            ? devices.find((d) => d.id === selectedDevices[0])
                                ?.name || "1 Device"
                            : `${selectedDevices.length} Devices`}
                        </span>
                        <ChevronDown className='h-4 w-4 ml-2 opacity-50' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-56'>
                      <DropdownMenuLabel>Filter by Device</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filteredDevices.map((device) => (
                        <DropdownMenuCheckboxItem
                          key={device.id}
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => toggleDevice(device.id)}
                        >
                          {device.name}
                          <span className='ml-2 text-xs text-muted-foreground'>
                            (
                            {
                              profiles.find((p) => p.id === device.profileId)
                                ?.name
                            }
                            )
                          </span>
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Read status filter */}
                <div>
                  <h3 className='text-sm font-medium mb-2 flex items-center'>
                    <Bell className='h-4 w-4 mr-2 text-muted-foreground' />
                    Status
                  </h3>
                  <div className='flex gap-2'>
                    <Button
                      variant={readFilter === "all" ? "default" : "outline"}
                      size='sm'
                      className='flex-1'
                      onClick={() => setReadFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      variant={readFilter === "unread" ? "default" : "outline"}
                      size='sm'
                      className='flex-1'
                      onClick={() => setReadFilter("unread")}
                    >
                      Unread
                    </Button>
                    <Button
                      variant={readFilter === "read" ? "default" : "outline"}
                      size='sm'
                      className='flex-1'
                      onClick={() => setReadFilter("read")}
                    >
                      Read
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Tabs
          defaultValue='all'
          className='w-full'
          onValueChange={setActiveTab}
        >
          <div className='mb-6 space-y-4'>
            {/* Tabs and Controls Container */}
            <div className='bg-transparent dark:bg-gray-800 rounded-lg border  p-2'>
              <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                {/* Tabs with improved styling */}
                <div className='w-full md:w-auto overflow-x-auto pb-1 md:pb-0'>
                  <TabsList className='h-auto flex-wrap max-sm:items-start p-1 bg-muted/60'>
                    <TabsTrigger value='all' className='h-9 px-4 rounded-md'>
                      <span className='flex items-center gap-1.5'>
                        <Bell className='h-4 w-4' />
                        <span>All</span>
                        {notifications.length > 0 && (
                          <Badge
                            variant='secondary'
                            className='ml-1 h-5 px-1.5 min-w-[20px] flex items-center justify-center'
                          >
                            {notifications.length}
                          </Badge>
                        )}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='keyword found'
                      className='h-9 px-4 rounded-md'
                    >
                      <span className='flex items-center gap-1.5'>
                        <Check className='h-4 w-4' />
                        <span>Found</span>
                        {notifications.filter(
                          (n) => n.eventType.toLowerCase() === "keyword found"
                        ).length > 0 && (
                          <Badge
                            variant='secondary'
                            className='ml-1 h-5 px-1.5 min-w-[20px] flex items-center justify-center'
                          >
                            {
                              notifications.filter(
                                (n) =>
                                  n.eventType.toLowerCase() === "keyword found"
                              ).length
                            }
                          </Badge>
                        )}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='keyword lost'
                      className='h-9 px-4 rounded-md'
                    >
                      <span className='flex items-center gap-1.5'>
                        <X className='h-4 w-4' />
                        <span>Lost</span>
                        {notifications.filter(
                          (n) => n.eventType.toLowerCase() === "keyword lost"
                        ).length > 0 && (
                          <Badge
                            variant='secondary'
                            className='ml-1 h-5 px-1.5 min-w-[20px] flex items-center justify-center'
                          >
                            {
                              notifications.filter(
                                (n) =>
                                  n.eventType.toLowerCase() === "keyword lost"
                              ).length
                            }
                          </Badge>
                        )}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger
                      value='page change detected'
                      className='h-9 px-4 rounded-md'
                    >
                      <span className='flex items-center gap-1.5'>
                        <RefreshCw className='h-4 w-4' />
                        <span>Changes</span>
                        {notifications.filter(
                          (n) =>
                            n.eventType.toLowerCase() === "page change detected"
                        ).length > 0 && (
                          <Badge
                            variant='secondary'
                            className='ml-1 h-5 px-1.5 min-w-[20px] flex items-center justify-center'
                          >
                            {
                              notifications.filter(
                                (n) =>
                                  n.eventType.toLowerCase() ===
                                  "page change detected"
                              ).length
                            }
                          </Badge>
                        )}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Controls with improved styling */}
                <div className='flex flex-wrap gap-2 w-full md:w-auto justify-end'>
                  {/* Sound and Refresh Controls */}
                  {/* Sound and Refresh Controls - Redesigned */}
                  <div className='flex items-center gap-2 bg-gradient-to-r from-muted/50 to-muted/30 p-1.5 rounded-md border border-muted/50 shadow-sm'>
                    <div className='flex items-center'>
                      <Dialog
                        open={soundSettingsDialogOpen}
                        onOpenChange={setSoundSettingsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            title={
                              soundEnabled
                                ? "Sound settings (enabled)"
                                : "Sound settings (disabled)"
                            }
                            className={cn(
                              "h-8 w-8 rounded-md transition-colors",
                              soundEnabled
                                ? "text-primary hover:text-primary/80"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {soundEnabled ? (
                              <Volume2 className='h-4 w-4' />
                            ) : (
                              <VolumeX className='h-4 w-4' />
                            )}
                            <span className='sr-only'>Sound settings</span>
                          </Button>
                        </DialogTrigger>
                        <SoundSettingsDialog
                          soundEnabled={soundEnabled}
                          setSoundEnabled={setSoundEnabled}
                          selectedSound={selectedSound}
                          setSelectedSound={setSelectedSound}
                          volume={volume}
                          setVolume={setVolume}
                          customSoundUrl={customSoundUrl}
                          setCustomSoundUrl={setCustomSoundUrl}
                        />
                      </Dialog>
                    </div>

                    <div className='h-8 w-px bg-muted mx-0.5'></div>

                    <div className='flex items-center'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex items-center gap-1 -pr-1 py-1 rounded-md hover:bg-muted/50 transition-colors cursor-default'>
                              <Clock className='h-3.5 w-3.5 text-muted-foreground' />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side='bottom'>
                            <p>Auto-refresh interval</p>
                          </TooltipContent>
                        </Tooltip>

                        <div className='flex items-center gap-2'>
                          <div className='relative'>
                            <Select>
                              <SelectTrigger
                                className='bg-transparent text-xs outline-none appearance-none pr-5 py-0 h-4 border-none cursor-pointer'
                                aria-label='Refresh interval'
                                value={refreshInterval}
                                onChange={(e) =>
                                  handleRefreshIntervalChange(
                                    (e.target as HTMLSelectElement).value
                                  )
                                }
                              >
                                <SelectValue placeholder='30s' />
                              </SelectTrigger>
                              <SelectContent className='mt-2 -ml-4 '>
                                <SelectItem value='10'>10s</SelectItem>
                                <SelectItem value='20'>20s</SelectItem>
                                <SelectItem value='30'>30s</SelectItem>
                                <SelectItem value='60'>1m</SelectItem>
                                <SelectItem value='300'>5m</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap",
                              isRefreshing
                                ? "bg-primary/15 text-primary animate-pulse"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {Math.floor(countdown / 60) > 0
                              ? `${Math.floor(countdown / 60)}m `
                              : ""}
                            {countdown % 60}s
                          </div>
                        </div>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={handleManualRefresh}
                              disabled={isRefreshing}
                              className={cn(
                                "h-8 w-8 rounded-md transition-all",
                                isRefreshing && "bg-muted/60"
                              )}
                            >
                              <RefreshCw
                                className={cn(
                                  "h-4 w-4",
                                  isRefreshing && "animate-spin text-primary"
                                )}
                              />
                              <span className='sr-only'>Refresh now</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side='bottom'>
                            <p>Refresh now</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex items-center gap-2 bg-muted/40 p-1 rounded-md'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 rounded-md'
                        >
                          <SlidersHorizontal className='h-4 w-4 mr-1.5' />
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>
                          Notification Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Mark All Read option */}
                        {unreadCount > 0 ? (
                          <DropdownMenuItem
                            onClick={handleMarkAllAsRead}
                            disabled={isRefreshing || unreadCount === 0}
                          >
                            <CheckCircle2 className='h-4 w-4 mr-2' />
                            Mark All as Read
                            <span className='ml-1 text-xs text-muted-foreground'>
                              ({unreadCount})
                            </span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <CheckCircle2 className='h-4 w-4 mr-2' />
                            Mark All as Read
                          </DropdownMenuItem>
                        )}

                        {/* Clear All option */}
                        <DropdownMenuItem
                          onClick={clearAllNotifications}
                          disabled={notifications.length === 0}
                        >
                          <Trash2 className='h-4 w-4 mr-2' />
                          Clear All Notifications
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Export Options</DropdownMenuLabel>

                        {/* Advanced Export */}
                        <Dialog
                          open={exportDialogOpen}
                          onOpenChange={setExportDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <FileSpreadsheet className='h-4 w-4 mr-2' />
                              Advanced Export
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <ExportDialog
                            notifications={notifications}
                            selectedProfiles={selectedProfiles}
                            selectedDevices={selectedDevices}
                            readFilter={readFilter}
                            activeTab={activeTab}
                            searchQuery={searchQuery}
                            profiles={profiles}
                            devices={devices}
                          />
                        </Dialog>

                        {/* Quick Export Sub-menu */}
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <FileSpreadsheet className='h-4 w-4 mr-2' />
                            Quick Export
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Quick export as CSV
                                  const headers = [
                                    "url",
                                    "keyword",
                                    "eventType",
                                    "type",
                                    "deviceName",
                                    "profileName",
                                    "timestamp",
                                    "read",
                                  ].join(",");
                                  const rows = filteredNotifications.map(
                                    (item) =>
                                      [
                                        item.url,
                                        item.keyword,
                                        item.eventType,
                                        item.type,
                                        item.deviceName,
                                        item.profileName,
                                        item.timestamp,
                                        item.read,
                                      ].join(",")
                                  );
                                  const csv = [headers, ...rows].join("\n");

                                  const blob = new Blob([csv], {
                                    type: "text/csv",
                                  });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = `notifications-export-${
                                    new Date().toISOString().split("T")[0]
                                  }.csv`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(url);
                                }}
                              >
                                <FileSpreadsheet className='h-4 w-4 mr-2' />
                                Export as CSV
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Quick export as JSON
                                  const json = JSON.stringify(
                                    filteredNotifications,
                                    null,
                                    2
                                  );
                                  const blob = new Blob([json], {
                                    type: "application/json",
                                  });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = `notifications-export-${
                                    new Date().toISOString().split("T")[0]
                                  }.json`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  URL.revokeObjectURL(url);
                                }}
                              >
                                <FileJson className='h-4 w-4 mr-2' />
                                Export as JSON
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TabsContent value={activeTab} className='mt-0'>
            {filteredNotifications.length > 0 ? (
              <div className='sm:max-w-3xl  max-sm:max-w-[20rem] ml-0 md:pl-4 '>
                <div className='relative'>
                  {/* Timeline line */}
                  <div className='absolute left-6 md:left-[9.5rem] top-0 bottom-0 w-[2px] bg-gray-200 dark:bg-gray-800'></div>

                  <div className='space-y-6'>
                    {filteredNotifications.map((notification, index) => {
                      const eventColor = getEventTypeColor(
                        notification.eventType
                      );
                      const isNew = notification.isNew;
                      const isRead = notification.read;
                      const isMarking = markingAsRead === notification.id;

                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "relative transition-all duration-500",
                            isNew && !isRead && "animate-fadeIn"
                          )}
                        >
                          {/* Desktop timestamp */}
                          <div className='hidden md:block absolute left-0 top-6'>
                            <div
                              className={cn(
                                "flex items-center justify-between min-w-[8rem] px-3 py-1.5 rounded-md bg-gradient-to-r border border-gray-200 dark:border-gray-700 transition-all duration-300",
                                isRead
                                  ? "from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-800/40 border-l-gray-300 dark:border-l-gray-600 border-l-4"
                                  : isNew
                                  ? "from-yellow-50 to-yellow-100/70 dark:from-yellow-900/20 dark:to-yellow-900/10 border-l-yellow-400 dark:border-l-yellow-600 border-l-4"
                                  : "from-emerald-50 to-emerald-100/70 dark:from-emerald-900/20 dark:to-emerald-900/10 border-l-primary border-l-4"
                              )}
                            >
                              <div className='flex items-center'>
                                <Clock
                                  className={cn(
                                    "h-4 w-4",
                                    isRead
                                      ? "text-gray-400 dark:text-gray-500"
                                      : isNew
                                      ? "text-yellow-500 dark:text-yellow-400"
                                      : "text-primary"
                                  )}
                                />
                              </div>
                              <span
                                className={cn(
                                  "text-sm font-medium ml-2",
                                  isRead
                                    ? "text-gray-500 dark:text-gray-400"
                                    : isNew
                                    ? "text-yellow-700 dark:text-yellow-400"
                                    : "text-gray-700 dark:text-gray-200"
                                )}
                              >
                                {notification.timestamp}
                              </span>
                            </div>
                          </div>

                          {/* Timeline dot */}
                          <div
                            className={cn(
                              "absolute left-6 md:left-[9.5rem] top-6 w-[14px] h-[14px] rounded-full border-[3px] z-10 -ml-[7px] md:-ml-[7px] transition-all duration-300",
                              isRead
                                ? "border-gray-200 dark:border-gray-700 opacity-70"
                                : isNew
                                ? "border-yellow-200 dark:border-yellow-900 animate-pulse"
                                : "border-white dark:border-gray-900"
                            )}
                            style={{
                              backgroundColor: isRead ? "#9ca3af" : eventColor,
                            }}
                          ></div>

                          {/* Card content */}
                          <div className='ml-12 md:ml-[11rem]'>
                            <Card
                              className={cn(
                                "overflow-hidden transition-all duration-300 cursor-pointer",
                                isMarking && "opacity-80",
                                isRead
                                  ? "shadow-sm border-gray-200 dark:border-gray-800"
                                  : isNew
                                  ? "shadow-md border-yellow-200 dark:border-yellow-900/30"
                                  : "shadow-md border-emerald-200 dark:border-emerald-900/30 hover:border-primary/50 dark:hover:border-primary/50"
                              )}
                              onClick={(e) =>
                                handleNotificationClick(e, notification)
                              }
                            >
                              <CardContent className='p-0'>
                                <div
                                  className={cn(
                                    "p-5 flex gap-4 relative",
                                    isRead
                                      ? "bg-gray-50/50 dark:bg-gray-800/20"
                                      : isNew
                                      ? "bg-yellow-50/50 dark:bg-yellow-900/5"
                                      : "bg-emerald-50/30 dark:bg-emerald-900/5"
                                  )}
                                >
                                  {/* Read indicator */}
                                  {!isRead && (
                                    <div className='absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-primary animate-pulse' />
                                  )}
                                  {/* Loading indicator when marking as read */}
                                  {isMarking && (
                                    <div className='absolute inset-0 bg-white/30 dark:bg-black/20 flex items-center justify-center z-10'>
                                      <div className='h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
                                    </div>
                                  )}
                                  {/* Notification icon */}
                                  <div className='flex-shrink-0 mt-1'>
                                    <div
                                      className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                        isRead
                                          ? "opacity-70"
                                          : isNew && "animate-pulse"
                                      )}
                                      style={{
                                        backgroundColor: isRead
                                          ? "#9ca3af20"
                                          : `${eventColor}20`,
                                      }}
                                    >
                                      {notification.eventType.toLowerCase() ===
                                        "keyword found" && (
                                        <Check
                                          className='h-4 w-4'
                                          style={{
                                            color: isRead
                                              ? "#9ca3af"
                                              : eventColor,
                                          }}
                                        />
                                      )}
                                      {notification.eventType.toLowerCase() ===
                                        "keyword lost" && (
                                        <X
                                          className='h-4 w-4'
                                          style={{
                                            color: isRead
                                              ? "#9ca3af"
                                              : eventColor,
                                          }}
                                        />
                                      )}
                                      {notification.eventType.toLowerCase() ===
                                        "page change detected" && (
                                        <RefreshCw
                                          className='h-4 w-4'
                                          style={{
                                            color: isRead
                                              ? "#9ca3af"
                                              : eventColor,
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                  {/* Content */}
                                  <div className='flex-1 min-w-0'>
                                    {/* Mobile timestamp */}
                                    <div
                                      className={cn(
                                        "md:hidden flex items-center text-xs mb-2 transition-colors",
                                        isRead
                                          ? "text-gray-400"
                                          : isNew
                                          ? "text-yellow-600 dark:text-yellow-400"
                                          : "text-primary"
                                      )}
                                    >
                                      <Clock className='h-3.5 w-3.5 mr-1.5' />
                                      {notification.timestamp}
                                      {isNew && !isRead && (
                                        <span className='ml-1.5 text-[10px] uppercase font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded-sm'>
                                          New
                                        </span>
                                      )}
                                      {!isRead && !isNew && (
                                        <span className='ml-1.5 text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm'>
                                          Unread
                                        </span>
                                      )}
                                    </div>

                                    {/* URL and actions */}
                                    <div className='flex items-start justify-between mb-3 flex-wrap'>
                                      <div className='flex items-center space-x-2 max-w-[70%]'>
                                        <Globe
                                          className={cn(
                                            "h-4 w-4 flex-shrink-0",
                                            isRead
                                              ? "text-gray-400"
                                              : "text-muted-foreground"
                                          )}
                                        />
                                        <h3
                                          className={cn(
                                            "truncate",
                                            isRead
                                              ? "font-normal text-gray-500"
                                              : "font-medium"
                                          )}
                                        >
                                          {notification.url}
                                        </h3>
                                      </div>
                                      <div className='flex items-center space-x-2 flex-shrink-0'>
                                        <Button
                                          variant='ghost'
                                          size='sm'
                                          className='h-7 px-2 text-xs hover:bg-transparent hover:text-primary'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(
                                              notification.url,
                                              "_blank"
                                            );
                                          }}
                                        >
                                          <ExternalLink className='h-3 w-3 mr-1' />
                                          Open
                                        </Button>
                                        <Button
                                          variant='ghost'
                                          size='icon'
                                          className='h-7 w-7'
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notification.id);
                                          }}
                                        >
                                          <Trash2 className='h-3.5 w-3.5 text-muted-foreground' />
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Event info and keyword */}
                                    <div className='mb-3'>
                                      <div className='flex flex-wrap items-center gap-2 mb-2'>
                                        <Badge
                                          variant='outline'
                                          className={cn(
                                            "bg-gray-50 dark:bg-gray-800",
                                            isRead && "opacity-70"
                                          )}
                                        >
                                          {notification.type}
                                        </Badge>
                                        <div className='flex items-center'>
                                          <span
                                            className={cn(
                                              "text-xs mr-1.5",
                                              isRead
                                                ? "text-gray-400"
                                                : "text-muted-foreground"
                                            )}
                                          >
                                            Keyword:
                                          </span>
                                          <span
                                            className={cn(
                                              "text-xs font-medium px-2 py-0.5 rounded",
                                              isRead
                                                ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                                : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                                            )}
                                          >
                                            {notification.keyword}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Footer with metadata */}
                                    <div className='flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                                      <div className='flex items-center gap-1.5'>
                                        <Laptop
                                          className={cn(
                                            "h-3.5 w-3.5",
                                            isRead && "opacity-70"
                                          )}
                                        />
                                        <span
                                          className={cn(
                                            "truncate",
                                            isRead && "text-gray-400"
                                          )}
                                        >
                                          {notification.deviceName}
                                        </span>
                                      </div>
                                      <div className='flex items-center gap-1.5'>
                                        <Settings
                                          className={cn(
                                            "h-3.5 w-3.5",
                                            isRead && "opacity-70"
                                          )}
                                        />
                                        <span
                                          className={cn(
                                            "truncate",
                                            isRead && "text-gray-400"
                                          )}
                                        >
                                          {notification.profileName}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
                <div className='bg-gray-50 dark:bg-gray-800/50 rounded-full p-4 mb-4'>
                  <Bell className='h-10 w-10 text-muted-foreground' />
                </div>
                <h3 className='text-xl font-medium mb-2'>
                  {hasActiveFilters
                    ? "No matching notifications"
                    : "You're all caught up"}
                </h3>
                <p className='text-muted-foreground max-w-md'>
                  {hasActiveFilters
                    ? "Try adjusting your filters to see more notifications."
                    : "No recent notification events. When your page monitors detect changes, they'll appear here."}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant='outline'
                    className='mt-4'
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
