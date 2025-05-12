"use client"

import { useState } from "react"
import { AlertCircle, Clock, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface SubscriptionNotificationProps {
  status: "canceled" | "scheduled_downgrade" | null
  currentPlan: string
  targetPlan?: string
  expiryDate: string
  onReactivate: () => void
  className?: string
}

export function SubscriptionNotification({
  status,
  currentPlan,
  targetPlan,
  expiryDate,
  onReactivate,
  className,
}: SubscriptionNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { toast } = useToast()

  if (!status || !isVisible) return null

  const handleReactivate = () => {
    onReactivate()
    toast({
      title: "Subscription reactivated",
      description: "Your subscription has been successfully reactivated.",
    })
  }

  const handleDismiss = () => {
    setIsVisible(false)
    toast({
      title: "Notification dismissed",
      description: "You can still manage your subscription from the Account page.",
    })
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "basic":
        return "Basic"
      case "individual":
        return "Individual"
      case "team":
        return "Team"
      case "enterprise":
        return "Enterprise"
      default:
        return "Unknown"
    }
  }

  const getNotificationContent = () => {
    if (status === "canceled") {
      return {
        icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        title: "Subscription Cancellation Pending",
        description: `Your ${getPlanName(currentPlan)} plan will be canceled on ${expiryDate}.`,
        bgColor: "bg-amber-50 dark:bg-amber-950/40",
        borderColor: "border-amber-200 dark:border-amber-800",
        textColor: "text-amber-800 dark:text-amber-300",
      }
    } else if (status === "scheduled_downgrade") {
      return {
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        title: "Plan Downgrade Scheduled",
        description: `Your plan will be downgraded from ${getPlanName(currentPlan)} to ${getPlanName(
          targetPlan || "basic",
        )} on ${expiryDate}.`,
        bgColor: "bg-blue-50 dark:bg-blue-950/40",
        borderColor: "border-blue-200 dark:border-blue-800",
        textColor: "text-blue-800 dark:text-blue-300",
      }
    }

    return {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Subscription Status Change",
      description: "Your subscription status has changed.",
      bgColor: "bg-gray-50 dark:bg-gray-900",
      borderColor: "border-gray-200 dark:border-gray-800",
      textColor: "text-gray-800 dark:text-gray-300",
    }
  }

  const content = getNotificationContent()

  return (
    <div
      className={cn(
        "relative border rounded-lg shadow-sm my-2 overflow-hidden",
        content.bgColor,
        content.borderColor,
        content.textColor,
        className,
      )}
    >
      {/* Status indicator bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          status === "canceled" ? "bg-amber-500 dark:bg-amber-600" : "bg-blue-500 dark:bg-blue-600",
        )}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 pl-6">
        <div className="flex items-start space-x-3 mb-3 sm:mb-0">
          <div
            className={cn(
              "p-2 rounded-full flex-shrink-0",
              status === "canceled"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
            )}
          >
            {content.icon}
          </div>
          <div>
            <h4 className="font-medium text-sm">
              {status === "canceled" ? "Subscription Ending" : "Plan Change Scheduled"}
            </h4>
            <p className="text-sm opacity-90 mt-0.5">
              {status === "canceled" ? (
                <>
                  Your <span className="font-medium">{getPlanName(currentPlan)}</span> plan will be canceled on{" "}
                  <span className="font-medium">{expiryDate}</span>.
                </>
              ) : (
                <>
                  Your plan will change from <span className="font-medium">{getPlanName(currentPlan)}</span> to{" "}
                  <span className="font-medium">{getPlanName(targetPlan || "basic")}</span> on{" "}
                  <span className="font-medium">{expiryDate}</span>.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-3 flex-shrink-0 ml-10 sm:ml-0">
          <Button
            onClick={handleReactivate}
            className={cn(
              "text-white",
              status === "canceled"
                ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700"
                : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700",
            )}
            size="sm"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            {status === "canceled" ? "Keep Subscription" : "Keep Current Plan"}
          </Button>
          <button
            type="button"
            className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700"
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
