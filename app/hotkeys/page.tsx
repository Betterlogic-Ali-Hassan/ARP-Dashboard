"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Keyboard, AlertCircle } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { HotkeyInput } from "@/components/hotkey-input"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"

// Define hotkey types
interface Hotkey {
  id: string
  label: string
  value: string
}

export default function HotkeysPage() {
  const { toast } = useToast()
  const [hotkeysEnabled, setHotkeysEnabled] = useState(false)
  const [hotkeys, setHotkeys] = useState<Hotkey[]>([
    { id: "start-time-interval", label: "Start Time Interval", value: "" },
    { id: "start-random-interval", label: "Start Random Interval", value: "" },
    { id: "start-timer-mode", label: "Start Timer Mode", value: "" },
    { id: "stop-interval", label: "Stop Interval", value: "" },
    { id: "kill-notification-sound", label: "Kill Notification Sound", value: "" },
  ])

  // Load hotkeys from localStorage on component mount
  useEffect(() => {
    const savedHotkeys = localStorage.getItem("autoRefreshHotkeys")
    const savedEnabled = localStorage.getItem("autoRefreshHotkeysEnabled")

    if (savedHotkeys) {
      setHotkeys(JSON.parse(savedHotkeys))
    }

    if (savedEnabled) {
      setHotkeysEnabled(savedEnabled === "true")
    }
  }, [])

  // Save hotkeys to localStorage when they change
  useEffect(() => {
    localStorage.setItem("autoRefreshHotkeys", JSON.stringify(hotkeys))
  }, [hotkeys])

  // Save enabled state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("autoRefreshHotkeysEnabled", hotkeysEnabled.toString())
  }, [hotkeysEnabled])

  // Handle hotkey change
  const handleHotkeyChange = (id: string, value: string) => {
    // Check for duplicates
    const duplicate = hotkeys.find((hotkey) => hotkey.value === value && hotkey.id !== id)

    if (duplicate) {
      toast({
        title: "Duplicate Hotkey",
        description: `This hotkey is already assigned to "${duplicate.label}"`,
        variant: "destructive",
      })
      return
    }

    // Update the hotkey
    const updatedHotkeys = hotkeys.map((hotkey) => (hotkey.id === id ? { ...hotkey, value } : hotkey))

    setHotkeys(updatedHotkeys)

    // Show success toast
    toast({
      title: "Hotkey Updated",
      description: `Hotkey for "${hotkeys.find((h) => h.id === id)?.label}" has been updated.`,
    })
  }

  // Handle error in hotkey input
  const handleHotkeyError = (message: string) => {
    toast({
      title: "Invalid Hotkey",
      description: message,
      variant: "destructive",
    })
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div>
        <Sidebar activePage="hotkeys" />
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[56rem]">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">Assign Hotkeys</h1>

          {/* Main Toggle Card */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                    <Keyboard className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Assign Hotkeys</CardTitle>
                </div>
                <CardDescription>
                  Set Your Custom Keyboard Shortcuts for Auto Refresh Plus Actions. Enable this option to use keyboard
                  shortcuts for quick access to extension features.
                </CardDescription>
              </div>
              <Switch id="hotkeys-enabled" checked={hotkeysEnabled} onCheckedChange={setHotkeysEnabled} />
            </CardHeader>
            <CardContent>
              {!hotkeysEnabled && (
                <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 p-3 rounded-md text-sm border border-amber-100 dark:border-amber-900 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>Hotkeys are currently disabled. Enable the toggle above to set and use keyboard shortcuts.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hotkey Settings Card */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                  <Keyboard className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Keyboard Shortcuts</CardTitle>
              </div>
              <CardDescription>
                Configure keyboard shortcuts for common actions. Each shortcut must include at least one modifier key
                (Ctrl, Alt, Shift, or Command).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {hotkeys.map((hotkey) => (
                  <div key={hotkey.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Label htmlFor={hotkey.id} className="text-sm font-medium">
                      {hotkey.label}
                    </Label>
                    <div className="md:col-span-2">
                      <HotkeyInput
                        id={hotkey.id}
                        value={hotkey.value}
                        onChange={(value) => handleHotkeyChange(hotkey.id, value)}
                        disabled={!hotkeysEnabled}
                        onError={handleHotkeyError}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Help Info Card */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tips for Setting Hotkeys</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Use at least one modifier key (Ctrl, Alt, Shift, or Command) with each hotkey.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Avoid using hotkeys that conflict with browser or system shortcuts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Click on any input field and press the desired key combination to set a hotkey.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span>Hotkeys are saved per device and will persist between browser sessions.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
