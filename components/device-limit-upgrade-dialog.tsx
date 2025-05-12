"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DeviceLimitUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpgrade: (plan: string, billingPeriod: string) => void
  currentPlan: string
  onViewMorePlans: () => void
}

export function DeviceLimitUpgradeDialog({
  open,
  onOpenChange,
  onUpgrade,
  currentPlan,
  onViewMorePlans,
}: DeviceLimitUpgradeDialogProps) {
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<"monthly" | "yearly">("yearly")

  const handleUpgrade = (billingPeriod: "monthly" | "yearly") => {
    // Determine which plan to upgrade to based on current plan
    const targetPlan = currentPlan === "basic" ? "individual" : "team"
    onUpgrade(targetPlan, billingPeriod)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-emerald-500" />
          </div>

          <DialogHeader className="text-center space-y-2 pb-2">
            <DialogTitle className="text-2xl font-bold text-center">Unlock More Devices</DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-[350px] mx-auto">
              Your{" "}
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
              </span>{" "}
              has reached its device limit. Upgrade to add more devices and access premium features.
            </p>
          </DialogHeader>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6">
          {/* Monthly Plan */}
          <div
            className={cn(
              "border rounded-lg p-5 cursor-pointer transition-all",
              selectedBillingPeriod === "monthly"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800",
            )}
            onClick={() => setSelectedBillingPeriod("monthly")}
          >
            <h3 className="font-medium text-center mb-2">Monthly</h3>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold">$3.99</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm"> /month</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Up to 3 devices</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>All premium features</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Premium support</span>
              </div>
            </div>
          </div>

          {/* Yearly Plan */}
          <div
            className={cn(
              "border rounded-lg p-5 cursor-pointer transition-all relative",
              selectedBillingPeriod === "yearly"
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-gray-200 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800",
            )}
            onClick={() => setSelectedBillingPeriod("yearly")}
          >
            <Badge className="absolute -top-2 right-4 bg-emerald-500 hover:bg-emerald-600">Best Value</Badge>
            <h3 className="font-medium text-center mb-2">Yearly</h3>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold">$35.88</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm"> /year</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Up to 3 devices</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>All premium features</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Premium support</span>
              </div>
              <div className="flex items-start">
                <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Save 25%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <Button
            className={cn(
              "w-full h-11",
              selectedBillingPeriod === "yearly"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white",
            )}
            onClick={() => handleUpgrade(selectedBillingPeriod)}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe {selectedBillingPeriod === "yearly" ? "Yearly" : "Monthly"}
          </Button>

          <Button variant="outline" className="w-full" onClick={onViewMorePlans}>
            View More Plans
          </Button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
