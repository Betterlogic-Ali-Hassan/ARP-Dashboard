"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Laptop,
  Smartphone,
  Tablet,
  Search,
  Settings,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProfileEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile?: any
  devices: any[]
  onSave: (profileData: any) => void
  profiles?: any[] // Make profiles optional with a default value
}

export function ProfileEditorDialog({
  open,
  onOpenChange,
  profile,
  devices,
  onSave,
  profiles = [], // Provide a default empty array
}: ProfileEditorDialogProps) {
  const isEditing = !!profile
  const [activeTab, setActiveTab] = useState("general")
  const [name, setName] = useState(profile?.name || "")
  const [description, setDescription] = useState(profile?.description || "")
  const [permissions, setPermissions] = useState(profile?.permissions || "Read & Write")
  const [autoSync, setAutoSync] = useState(profile?.autoSync || false)
  const [notifications, setNotifications] = useState(profile?.notifications || "All")
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [isDefault, setIsDefault] = useState(profile?.isDefault || false)
  const [inactive, setInactive] = useState(false) // We don't allow setting inactive directly
  const [searchQuery, setSearchQuery] = useState("")
  const [nameError, setNameError] = useState("")

  // Default color for styling
  const themeColor = "emerald"

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.os && device.os.toLowerCase().includes(searchQuery.toLowerCase())) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || "")
      setDescription(profile.description || "")
      setPermissions(profile.permissions || "Read & Write")
      setAutoSync(profile.autoSync || false)
      setNotifications(profile.notifications || "All")
      setIsDefault(profile.isDefault || false)
      setInactive(false) // We don't allow setting inactive directly

      // Find devices associated with this profile
      const associatedDeviceIds = devices.filter((device) => device.profileId === profile.id).map((device) => device.id)
      setSelectedDevices(associatedDeviceIds)
    } else {
      setName("")
      setDescription("")
      setPermissions("Read & Write")
      setAutoSync(false)
      setNotifications("All")
      setIsDefault(false)
      setInactive(false)
      setSelectedDevices([])
    }
    setSearchQuery("")
    setNameError("")
    setActiveTab("general")
  }, [profile, devices])

  const validateForm = () => {
    let isValid = true

    if (!name.trim()) {
      setNameError("Profile name is required")
      isValid = false
    } else {
      setNameError("")
    }

    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    const profileData = {
      // If editing, use the existing ID, otherwise generate a new one
      id: profile?.id || `profile-${Date.now()}`,
      name,
      description,
      permissions,
      autoSync,
      notifications,
      isDefault,
      deviceIds: selectedDevices,
      color: profile?.color || themeColor, // Preserve existing color or use default
    }

    onSave(profileData)
  }

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices((prev) => (prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]))
  }

  const selectAllDevices = () => {
    setSelectedDevices(filteredDevices.map((device) => device.id))
  }

  const deselectAllDevices = () => {
    setSelectedDevices([])
  }

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "laptop":
        return <Laptop className="h-4 w-4" />
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Laptop className="h-4 w-4" />
    }
  }

  const goToNextTab = () => {
    if (activeTab === "general") {
      if (validateForm()) {
        setActiveTab("devices")
      }
    }
  }

  const goToPreviousTab = () => {
    if (activeTab === "devices") {
      setActiveTab("general")
    }
  }

  // Helper function to safely get profile name
  const getProfileName = (profileId: string) => {
    if (!profiles || profiles.length === 0) return "Unknown Profile"
    const foundProfile = profiles.find((p) => p.id === profileId)
    return foundProfile ? foundProfile.name : "Unknown Profile"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-white dark:bg-gray-950 p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-full bg-${themeColor}-100 dark:bg-${themeColor}-900/50 p-2`}>
                {isEditing ? (
                  <Settings className={`h-5 w-5 text-${themeColor}-500`} />
                ) : (
                  <FileText className={`h-5 w-5 text-${themeColor}-500`} />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {isEditing ? "Edit Profile" : "Create New Profile"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1">
                  {isEditing
                    ? "Make changes to your profile settings"
                    : "Set up a new configuration profile for your devices"}
                </DialogDescription>
              </div>
            </div>
            <div className="flex gap-1">
              {["general", "devices"].map((tab, index) => (
                <div
                  key={tab}
                  className={`w-2 h-2 rounded-full ${
                    activeTab === tab ? `bg-${themeColor}-500` : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-6 pt-6 pb-0">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="general"
              className={activeTab === "general" ? `border-b-2 border-${themeColor}-500 rounded-none` : ""}
            >
              <FileText className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="devices"
              className={activeTab === "devices" ? `border-b-2 border-${themeColor}-500 rounded-none` : ""}
            >
              <Laptop className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 pb-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Profile Name
                  </Label>
                  {nameError && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {nameError}
                    </span>
                  )}
                </div>
                <Input
                  id="name"
                  placeholder="Enter a descriptive name (e.g., Work Settings)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value.trim()) setNameError("")
                  }}
                  className={`mt-1 ${nameError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe how this profile will be used (e.g., Settings for my work devices)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 resize-none"
                  rows={3}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  A good description helps you remember the purpose of this profile.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="default-profile"
                    checked={isDefault}
                    onCheckedChange={setIsDefault}
                    disabled={profile?.isDefault}
                  />
                  <div>
                    <Label htmlFor="default-profile" className="font-medium">
                      Set as default profile
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      New devices will use this profile automatically
                    </p>
                  </div>
                </div>
                {isDefault && (
                  <Badge
                    className={`bg-${themeColor}-100 text-${themeColor}-700 dark:bg-${themeColor}-900 dark:text-${themeColor}-300`}
                  >
                    Default
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Need Help
              </Button>
              <Button onClick={goToNextTab} className={`bg-${themeColor}-500 hover:bg-${themeColor}-600`}>
                Continue to Devices
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    placeholder="Search devices by name or type..."
                    className="h-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllDevices}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={deselectAllDevices}>
                    Clear
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {filteredDevices.length > 0 ? (
                  <div className="max-h-[360px] overflow-y-auto pr-1">
                    {filteredDevices.map((device) => (
                      <div
                        key={device.id}
                        className={`flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 ${
                          selectedDevices.includes(device.id) ? `bg-${themeColor}-50 dark:bg-${themeColor}-950/30` : ""
                        } border-b last:border-b-0 border-gray-100 dark:border-gray-800`}
                      >
                        <Checkbox
                          id={`device-${device.id}`}
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => toggleDeviceSelection(device.id)}
                          className={selectedDevices.includes(device.id) ? `text-${themeColor}-500` : ""}
                        />
                        <Label
                          htmlFor={`device-${device.id}`}
                          className="flex items-center gap-3 ml-3 flex-1 cursor-pointer"
                        >
                          <div
                            className={`w-8 h-8 rounded-full bg-${themeColor}-100 dark:bg-${themeColor}-900/50 flex items-center justify-center`}
                          >
                            {getDeviceIcon(device.type)}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{device.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              {device.os || device.type}
                              <span className="inline-block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                              <span
                                className={`flex items-center gap-1 ${
                                  device.status === "active" || device.status === "online"
                                    ? "text-emerald-500"
                                    : "text-gray-500"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    device.status === "active" || device.status === "online"
                                      ? "bg-emerald-500"
                                      : "bg-gray-500"
                                  }`}
                                ></span>
                                {device.status || "Connected"}
                              </span>
                            </div>
                          </div>

                          {/* Show current profile assignment if different from the one being edited */}
                          {device.profileId && device.profileId !== profile?.id && (
                            <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                              Currently in: {getProfileName(device.profileId)}
                            </div>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-3">
                      <Laptop className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">
                      {devices.length === 0 ? "No devices available" : "No devices match your search"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mt-1">
                      {devices.length === 0
                        ? "Add devices to your account before creating a profile"
                        : "Try adjusting your search or clear filters"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className={`rounded-full p-1.5 bg-${themeColor}-100 dark:bg-${themeColor}-900/50`}>
                  <CheckCircle2 className={`h-4 w-4 text-${themeColor}-500`} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{selectedDevices.length}</span> device
                  {selectedDevices.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={goToPreviousTab}>
                Back to General
              </Button>
              <Button
                onClick={handleSave}
                disabled={!name.trim()}
                className={`bg-${themeColor}-500 hover:bg-${themeColor}-600`}
              >
                {isEditing ? "Save Changes" : "Create Profile"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
