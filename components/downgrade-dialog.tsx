"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup } from "@/components/ui/radio-group"
import { Loader2, Calendar, Clock, CheckCircle2, ChevronDown, AlertTriangle, X, Check, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { PLANS, type PlanType, type BillingPeriodType, getPreviousPlan } from "@/lib/plan-utils"
import { useDeviceStore } from "@/lib/store"

interface DowngradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: PlanType
  targetPlan?: PlanType
  billingPeriod: BillingPeriodType
  nextBillingDate: string
  onComplete: (success: boolean, immediate: boolean) => void
}

export function DowngradeDialog({
  open,
  onOpenChange,
  currentPlan,
  targetPlan: propTargetPlan,
  billingPeriod,
  nextBillingDate,
  onComplete,
}: DowngradeDialogProps) {
  // If targetPlan is not provided, calculate it from the current plan
  const targetPlan = propTargetPlan || getPreviousPlan(currentPlan)
  const [downgradeType, setDowngradeType] = useState<"immediate" | "scheduled">("scheduled")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if downgrade is possible (not already on the lowest plan)
  const canDowngrade = currentPlan !== "basic"

  // Get plan details
  const currentPlanDetails = PLANS[currentPlan]
  const targetPlanDetails = PLANS[targetPlan]

  // Get real-time device counts from the device store
  const { devices } = useDeviceStore()
  const activeDevices = devices.filter((device) => device.status === "active").length

  // Check if active devices exceed the target plan's limit
  const deviceLimitExceeded = activeDevices > targetPlanDetails.deviceLimit
  const excessDevices = activeDevices - targetPlanDetails.deviceLimit

  const getPlanPrice = (plan: PlanType) => {
    if (billingPeriod === "yearly") {
      return PLANS[plan].pricing.yearlyPerMonth + "/month"
    } else {
      return PLANS[plan].pricing.monthly + "/month"
    }
  }

  // Calculate feature differences between plans
  const calculateSavings = () => {
    if (currentPlan === "basic" || targetPlan === "basic") return null

    const currentPrice =
      billingPeriod === "yearly"
        ? Number.parseFloat(currentPlanDetails.pricing.yearlyPerMonth.replace("$", ""))
        : Number.parseFloat(currentPlanDetails.pricing.monthly.replace("$", ""))

    const targetPrice =
      billingPeriod === "yearly"
        ? Number.parseFloat(targetPlanDetails.pricing.yearlyPerMonth.replace("$", ""))
        : Number.parseFloat(targetPlanDetails.pricing.monthly.replace("$", ""))

    const monthlySavings = currentPrice - targetPrice

    if (billingPeriod === "yearly") {
      return {
        monthly: `$${monthlySavings.toFixed(2)}/month`,
        yearly: `$${(monthlySavings * 12).toFixed(2)}/year`,
      }
    } else {
      return {
        monthly: `$${monthlySavings.toFixed(2)}/month`,
        yearly: `$${(monthlySavings * 12).toFixed(2)}/year`,
      }
    }
  }

  // Memoize feature differences calculation to prevent recalculation on every render
  const { lostFeatures, keptFeatures } = useMemo(() => {
    // Get all features from both plans
    const currentFeatures = currentPlanDetails.features
    const targetFeatures = targetPlanDetails.features

    // Features that will be lost (in current but not in target)
    const lostFeatures = currentFeatures.filter((feature) => !targetFeatures.includes(feature))

    // Features that will be kept (in both plans)
    const keptFeatures = currentFeatures.filter((feature) => targetFeatures.includes(feature))

    return { lostFeatures, keptFeatures }
  }, [currentPlanDetails.features, targetPlanDetails.features])

  // Features to exclude from lost features display
  const excludedFeatures = [
    "Priority Support (4 hours)",
    "Custom integrations",
    "Dedicated account manager",
    "Premium Support (24 hours)",
    "Team collaboration features",
    "Advanced analytics",
  ]

  // Memoize filtered features to prevent recalculation on every render
  const filteredLostFeatures = useMemo(() => {
    return lostFeatures.filter((feature) => !excludedFeatures.includes(feature))
  }, [lostFeatures])

  // Features to exclude from kept features display
  const excludedKeptFeatures = ["Team collaboration features", "Advanced analytics"]

  const filteredKeptFeatures = useMemo(() => {
    return keptFeatures.filter((feature) => !excludedKeptFeatures.includes(feature))
  }, [keptFeatures])

  // Memoize savings calculation
  const savings = useMemo(() => {
    return calculateSavings()
  }, [currentPlan, targetPlan, billingPeriod, currentPlanDetails, targetPlanDetails])

  const handleSubmit = async () => {
    if (deviceLimitExceeded) {
      setError(
        `You need to deactivate at least ${excessDevices} ${excessDevices === 1 ? "device" : "devices"} before downgrading to the ${targetPlanDetails.name} plan.`,
      )
      return
    }

    if (!canDowngrade) {
      setError("You are already on the lowest plan.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate API call with proper error handling
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // In a real app, this would be an API call to downgrade the subscription
          // For demo purposes, we'll always succeed
          resolve()
        }, 1500)
      })

      onComplete(true, downgradeType === "immediate")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred while processing your request.")
      console.error("Downgrade error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      // Clear any pending timers
      const timers = window.setTimeout(() => {}, 0)
      for (let i = 0; i < timers; i++) {
        window.clearTimeout(i)
      }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] p-0 overflow-hidden">
        <div className="flex flex-col">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <DialogTitle>Downgrade Plan</DialogTitle>
            <DialogDescription>
              {canDowngrade
                ? `You are about to downgrade from ${currentPlanDetails.name} to ${targetPlanDetails.name}.`
                : "You are already on the Basic plan, which is our lowest tier."}
            </DialogDescription>
          </DialogHeader>

          {canDowngrade ? (
            <>
              {/* Content */}
              <div className="flex flex-col md:flex-row">
                {/* Left side - Plan comparison */}
                <div className="md:w-1/2 p-6 border-r border-gray-100 dark:border-gray-800">
                  <div className="space-y-4">
                    {/* Plan comparison - REDESIGNED */}
                    <div className="relative">
                      {/* Current Plan - Top card with gradient */}
                      <div className="relative z-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className={`${currentPlanDetails.color.primary} p-3`}>
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            Current Plan
                          </Badge>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{currentPlanDetails.name} Plan</h3>
                            <span className={`font-bold ${currentPlanDetails.color.badgeText}`}>
                              {getPlanPrice(currentPlan)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Downgrade arrow and connector */}
                      <div className="relative h-12 flex items-center justify-center my-1">
                        <div className="absolute left-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -translate-x-1/2"></div>
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-100 dark:bg-emerald-900 rounded-full p-1 border-2 border-emerald-300 dark:border-emerald-700 z-20">
                          <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                      </div>

                      {/* New Plan - Bottom card with muted styling */}
                      <div className="relative z-10 rounded-lg shadow-sm overflow-hidden">
                        <div className={`${targetPlanDetails.color.primary} p-3`}>
                          <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            New Plan
                          </Badge>
                        </div>
                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{targetPlanDetails.name} Plan</h3>
                            <span className={`font-bold ${targetPlanDetails.color.badgeText}`}>
                              {getPlanPrice(targetPlan)}
                            </span>
                          </div>

                          {/* Savings calculation */}
                          {savings && (
                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">You save:</span>
                                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                  {billingPeriod === "yearly" ? savings.yearly : savings.monthly}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Feature changes summary - IMPROVED */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">What Will Change</h4>

                      {/* Device limit comparison */}
                      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
                            <span className="font-medium text-amber-800 dark:text-amber-300">Device Limit</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-amber-700 dark:text-amber-400">
                              {currentPlanDetails.deviceLimit} → {targetPlanDetails.deviceLimit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Options and warning - REDESIGNED */}
                <div className="md:w-1/2 p-6 bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-6">
                    {/* Section title */}
                    <div>
                      <h3 className="text-base font-medium">Downgrade Options</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Choose when you'd like your changes to take effect
                      </p>
                    </div>

                    {/* Downgrade timing options */}
                    <div className="space-y-3">
                      <RadioGroup
                        value={downgradeType}
                        onValueChange={(value: "immediate" | "scheduled") => setDowngradeType(value)}
                        className="space-y-3"
                      >
                        {/* Scheduled option */}
                        <label
                          className={`block relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                            downgradeType === "scheduled"
                              ? "ring-2 ring-emerald-500 dark:ring-emerald-400"
                              : "ring-1 ring-gray-200 dark:ring-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            value="scheduled"
                            checked={downgradeType === "scheduled"}
                            onChange={() => setDowngradeType("scheduled")}
                          />
                          <div className="p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div
                                  className={`p-2 rounded-full ${
                                    downgradeType === "scheduled"
                                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                                      : "bg-gray-100 dark:bg-gray-700"
                                  }`}
                                >
                                  <Calendar
                                    className={`h-5 w-5 ${
                                      downgradeType === "scheduled"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">Scheduled Downgrade</h4>
                                  {downgradeType === "scheduled" && (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Your current plan will remain active until {nextBillingDate}
                                </p>
                                <div className="mt-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 p-2 rounded">
                                  <div className="flex">
                                    <Info className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                    <span>Recommended: Keep all features until your billing date</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>

                        {/* Immediate option */}
                        <label
                          className={`block relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                            downgradeType === "immediate"
                              ? "ring-2 ring-amber-500 dark:ring-amber-400"
                              : "ring-1 ring-gray-200 dark:ring-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            value="immediate"
                            checked={downgradeType === "immediate"}
                            onChange={() => setDowngradeType("immediate")}
                          />
                          <div className="p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div
                                  className={`p-2 rounded-full ${
                                    downgradeType === "immediate"
                                      ? "bg-amber-100 dark:bg-amber-900/30"
                                      : "bg-gray-100 dark:bg-gray-700"
                                  }`}
                                >
                                  <Clock
                                    className={`h-5 w-5 ${
                                      downgradeType === "immediate"
                                        ? "text-amber-600 dark:text-amber-400"
                                        : "text-gray-500 dark:text-gray-400"
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">Immediate Downgrade</h4>
                                  {downgradeType === "immediate" && (
                                    <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Your plan will be downgraded now with a prorated refund
                                </p>
                              </div>
                            </div>
                          </div>
                        </label>
                      </RadioGroup>
                    </div>

                    {/* Features you'll lose - RELOCATED HERE */}
                    {filteredLostFeatures.length > 0 && (
                      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h5 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                          Features you'll lose
                        </h5>
                        <ul className="space-y-2">
                          {filteredLostFeatures.map((feature, index) => (
                            <li
                              key={`lost-${index}`}
                              className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900 border-l-2 border-red-400 dark:border-red-600"
                            >
                              <X className="h-4 w-4 text-red-500 dark:text-red-400 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Features you'll keep - RELOCATED HERE */}
                    {filteredKeptFeatures.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                          Features you'll keep
                        </h5>
                        <ul className="space-y-2">
                          {filteredKeptFeatures.map((feature, index) => (
                            <li
                              key={`kept-${index}`}
                              className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900 border-l-2 border-emerald-400 dark:border-emerald-600"
                            >
                              <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Device limit warning */}
                    {deviceLimitExceeded && (
                      <Alert
                        variant="destructive"
                        className="mt-4 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        <AlertDescription className="flex flex-col gap-2">
                          <p className="font-medium">Device limit exceeded</p>
                          <p className="text-sm">
                            You currently have <span className="font-semibold">{activeDevices} active devices</span>,
                            but the {targetPlanDetails.name} plan only supports up to{" "}
                            <span className="font-semibold">{targetPlanDetails.deviceLimit} devices</span>.
                          </p>
                          <p className="text-sm">
                            You need to deactivate at least{" "}
                            <span className="font-semibold">
                              {excessDevices} {excessDevices === 1 ? "device" : "devices"}
                            </span>{" "}
                            before downgrading.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full sm:w-auto border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/50"
                            onClick={() => {
                              onOpenChange(false)
                              // Navigate to devices page
                              window.location.href = "/devices"
                            }}
                          >
                            Manage Devices
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <DialogFooter className="flex justify-end space-x-2 p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                  Confirm Downgrade
                </Button>
              </DialogFooter>
            </>
          ) : (
            // Content for users already on the lowest plan
            <div className="p-6">
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Info className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Already on Basic Plan</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  You're currently on our Basic (Free) plan, which is our lowest tier. There are no plans available to
                  downgrade to.
                </p>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
