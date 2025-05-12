"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Search, Laptop, Smartphone, Tablet } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DeviceAssociationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: any
  devices: any[]
  onSave: (deviceIds: string[]) => void
}

export function DeviceAssociationDialog({
  open,
  onOpenChange,
  profile,
  devices,
  onSave,
}: DeviceAssociationDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Reset selected devices when profile changes
  useEffect(() => {
    if (profile) {
      const associatedDeviceIds = devices.filter((device) => device.profileId === profile.id).map((device) => device.id)

      setSelectedDevices(associatedDeviceIds)
    } else {
      setSelectedDevices([])
    }
  }, [profile, devices])

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices((prev) => (prev.includes(deviceId) ? prev.filter((id) => id !== deviceId) : [...prev, deviceId]))
  }

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([])
    } else {
      setSelectedDevices(filteredDevices.map((device) => device.id))
    }
  }

  const handleSave = () => {
    onSave(selectedDevices)
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

  // Filter devices based on search query
  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const allSelected =
    filteredDevices.length > 0 && filteredDevices.every((device) => selectedDevices.includes(device.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Device Associations</DialogTitle>
          <DialogDescription>
            {profile
              ? `Select devices to associate with the "${profile.name}" profile.`
              : "Select devices to associate with this profile."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search devices..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <div className="p-3 border-b bg-gray-50 dark:bg-gray-900/50 flex items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="select-all" checked={allSelected} onCheckedChange={handleSelectAll} />
                <Label htmlFor="select-all">Select All</Label>
              </div>
              <Badge className="ml-auto">{selectedDevices.length} selected</Badge>
            </div>

            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <Checkbox
                      id={`device-${device.id}`}
                      checked={selectedDevices.includes(device.id)}
                      onCheckedChange={() => toggleDeviceSelection(device.id)}
                    />
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <Label htmlFor={`device-${device.id}`} className="font-medium">
                          {device.name}
                        </Label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {device.type} • {device.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No devices match your search query." : "No devices available."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Associations</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
