"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent, type ChangeEvent, useEffect } from "react"
import {
  Bell,
  Eye,
  ExternalLink,
  Target,
  MousePointer,
  Focus,
  AlertCircle,
  Clock,
  Upload,
  Download,
  Trash2,
  X,
  Circle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PageMonitor() {
  // State for keyword input
  const [keywords, setKeywords] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [showCommaHelp, setShowCommaHelp] = useState(false)
  const [defaultTargetText, setDefaultTargetText] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for radio buttons
  const [monitorPattern, setMonitorPattern] = useState("find")

  // State for toggles
  const [continueRefreshing, setContinueRefreshing] = useState(true)
  const [scrollToKeyword, setScrollToKeyword] = useState(false)
  const [enableWindowFocus, setEnableWindowFocus] = useState(false)
  const [showAlertTabs, setShowAlertTabs] = useState(true)

  // State for dropdown
  const [retainDuration, setRetainDuration] = useState("1hour")

  // Check for comma in input to show help text
  useEffect(() => {
    if (inputValue.includes(",")) {
      setShowCommaHelp(true)
    } else {
      setShowCommaHelp(false)
    }
  }, [inputValue])

  const addKeywords = (value: string) => {
    if (value.includes(", ")) {
      // Handle bulk keywords (comma + space separated)
      const newKeywords = value.split(", ").filter((k) => k.trim() !== "")
      setKeywords([...keywords, ...newKeywords])
    } else {
      // Handle single keyword
      setKeywords([...keywords, value])
    }
    setInputValue("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      addKeywords(inputValue.trim())
    } else if (e.key === "Backspace" && inputValue === "" && keywords.length > 0) {
      setKeywords(keywords.slice(0, -1))
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text")
    if (pastedText.includes(", ")) {
      e.preventDefault()
      addKeywords(pastedText)
    }
  }

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const clearAllKeywords = () => {
    setKeywords([])
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        // Process file content - split by newlines and/or commas
        const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "")
        const newKeywords: string[] = []

        lines.forEach((line) => {
          if (line.includes(",")) {
            // Handle comma-separated values on each line
            const lineKeywords = line
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k !== "")
            newKeywords.push(...lineKeywords)
          } else {
            // Handle single keyword per line
            newKeywords.push(line.trim())
          }
        })

        setKeywords([...keywords, ...newKeywords])
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleExportKeywords = () => {
    if (keywords.length === 0) return

    const content = keywords.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "monitor_keywords.txt"
    document.body.appendChild(a)
    a.click()

    // Cleanup
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div>
        <Sidebar activePage="page-monitor" />
      </div>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-[56rem]">
          <h1 className="mb-6 text-3xl font-bold tracking-tight">Page Monitor</h1>

          {/* Section 1: Default Target Text */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Default Target Text</CardTitle>
                </div>
                <CardDescription>
                  Add default monitoring keywords here. You can also add custom keywords for each website from the
                  extension popup.
                </CardDescription>
              </div>
              <Switch id="default-target-text" checked={defaultTargetText} onCheckedChange={setDefaultTargetText} />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Multi-keyword input component */}
                <div
                  className={`flex flex-wrap items-center gap-2 p-2 border rounded-md ${
                    !defaultTargetText ? "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed" : "bg-background"
                  } ${inputValue && defaultTargetText ? "ring-2 ring-red-300 dark:ring-red-800/30" : ""}`}
                  onClick={focusInput}
                >
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-md text-sm"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeKeyword(index)
                        }}
                        disabled={!defaultTargetText}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    disabled={!defaultTargetText}
                    className="flex-grow min-w-[120px] bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-sm"
                    placeholder={keywords.length === 0 ? "Type and press Enter to add keywords" : ""}
                  />
                  {inputValue && defaultTargetText && !showCommaHelp && (
                    <span className="text-xs text-red-500 dark:text-red-400 ml-auto">Press Enter</span>
                  )}
                </div>

                {/* Dynamic comma help text */}
                {showCommaHelp && defaultTargetText && (
                  <div className="flex items-center gap-1.5 text-xs text-orange-500 dark:text-orange-400 pl-1">
                    <Circle className="h-2.5 w-2.5 fill-orange-500 dark:fill-orange-400" />
                    <span>For bulk keywords, use a space after each comma</span>
                  </div>
                )}

                {/* Import/Export/Clear buttons */}
                {defaultTargetText && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".txt"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={triggerFileInput}
                      disabled={!defaultTargetText}
                    >
                      <Upload className="h-3.5 w-3.5 mr-1.5" />
                      Import Keywords
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={handleExportKeywords}
                      disabled={!defaultTargetText || keywords.length === 0}
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Export Keywords
                    </Button>
                    {keywords.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50"
                        onClick={clearAllKeywords}
                        disabled={!defaultTargetText}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Clear All
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-2 pb-4">
              <Button variant="outline" size="sm" className="text-xs h-8" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                  Supported Expressions
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Section 2: Page Monitor Pattern - Redesigned with selectable cards */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                  <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">Page Monitor Pattern</CardTitle>
              </div>
              <CardDescription>
                Automatically get notified when any given webpage has found or lost your defined keyword.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Notify When Keyword is Found */}
                <div
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all",
                    monitorPattern === "find"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                  )}
                  onClick={() => setMonitorPattern("find")}
                >
                  {monitorPattern === "find" && (
                    <div className="absolute top-3 right-3 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="mb-2 flex items-center">
                    <div className="mr-2 rounded-full bg-green-100 p-1.5 dark:bg-green-900/50">
                      <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium">Notify When Keyword is Found</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Triggers a popup as soon as the defined text or pattern appears on the page.
                  </p>
                </div>

                {/* Card 2: Notify When Keyword is Lost */}
                <div
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all",
                    monitorPattern === "lose"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                  )}
                  onClick={() => setMonitorPattern("lose")}
                >
                  {monitorPattern === "lose" && (
                    <div className="absolute top-3 right-3 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="mb-2 flex items-center">
                    <div className="mr-2 rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/50">
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-medium">Notify When Keyword is Lost</h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Triggers a popup when the defined text or pattern disappears from the page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Continue Refreshing on Keyword Detection */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                    <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Continue Refreshing on Keyword Detection</CardTitle>
                </div>
                <CardDescription>
                  Auto Refresh Plus will continue to refresh the page even if it finds or loses the monitored keyword.
                  It will still trigger a notification, email, or bell depending on your page monitor&apos;s settings.
                </CardDescription>
              </div>
              <Switch checked={continueRefreshing} onCheckedChange={setContinueRefreshing} />
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Section 4: Scroll to Keyword Location */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                    <MousePointer className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Scroll to Keyword Location</CardTitle>
                </div>
                <CardDescription>
                  Automatically scroll the page to the location of the specified keyword when it is found.
                </CardDescription>
              </div>
              <Switch checked={scrollToKeyword} onCheckedChange={setScrollToKeyword} />
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Section 5: Enable Window Focus on Keyword Detection */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                    <Focus className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Enable Window Focus on Keyword Detection</CardTitle>
                </div>
                <CardDescription>
                  Enable window focus when Page Monitor finds or loses a keyword. This feature ensures that the window
                  automatically comes to the forefront of your screen whenever the specified keyword is detected or
                  lost.
                </CardDescription>
              </div>
              <Switch checked={enableWindowFocus} onCheckedChange={setEnableWindowFocus} />
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Consolidated Section: Show Alert Tabs in Extension Popup */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                    <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Show Alert Tabs in Extension Popup</CardTitle>
                </div>
                <CardDescription>
                  Show alert tabs in the extension popup to see any updates or changes made by the page monitor. This
                  feature provides a convenient way to stay informed, especially when you have many tabs open.
                </CardDescription>
              </div>
              <Switch checked={showAlertTabs} onCheckedChange={setShowAlertTabs} />
            </CardHeader>
            {showAlertTabs && (
              <CardContent className="border-t pt-6">
                <div className="space-y-6">
                  {/* Retain Alerted Tabs section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50">
                        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium">Retain Alerted Tabs</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-10 mb-4">
                      Select the time duration to retain the record of Alerted Tabs before they automatically disappear.
                    </p>
                    <div className="ml-10 max-w-xs">
                      <Select value={retainDuration} onValueChange={setRetainDuration}>
                        <SelectTrigger id="retain-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30min">30 Minutes</SelectItem>
                          <SelectItem value="1hour">1 Hour</SelectItem>
                          <SelectItem value="6hours">6 Hours</SelectItem>
                          <SelectItem value="12hours">12 Hours</SelectItem>
                          <SelectItem value="24hours">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Notification Settings Link */}
          <div className="mt-8 text-center">
            <a
              href="#"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Notification Settings
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
