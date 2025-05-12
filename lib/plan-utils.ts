// Plan utility functions to ensure consistency across the application

export type PlanType =  "individual" | "team" | "enterprise" | "basic"
export type BillingPeriodType = "monthly" | "yearly"

export interface PlanDetails {
  name: string
  color: {
    primary: string
    secondary: string
    badge: string
    badgeText: string
    progressBar: string
    hover: string // Added hover color property
  }
  pricing: {
    monthly: string
    yearly: string
    yearlyPerMonth: string
  }
  deviceLimit: number
  features: string[]
}

export const PLANS = {
  basic: {
    name: "Basic",
    color: {
      primary: "bg-blue-500",
      secondary: "bg-blue-100 dark:bg-blue-900/30",
      badge: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300",
      badgeText: "text-blue-700 dark:text-blue-300",
      progressBar: "bg-blue-500",
      hover: "bg-blue-400 dark:bg-blue-400", // Lighter blue for hover
    },
    pricing: {
      monthly: "Free",
      yearly: "Free",
      yearlyPerMonth: "Free",
    },
    deviceLimit: 3,
    features: [
      "Basic access with limited features",
      "Manage up to 3 devices",
      "Different settings profiles",
      "Access to support articles",
    ],
  },
  individual: {
    name: "Individual",
    color: {
      primary: "bg-emerald-600",
      secondary: "bg-emerald-50/50 dark:bg-emerald-950/20",
      badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      progressBar: "bg-emerald-600",
      hover: "bg-emerald-500 dark:bg-emerald-500", // Lighter emerald for hover
    },
    pricing: {
      monthly: "$3.99",
      yearly: "$35.88",
      yearlyPerMonth: "$2.99",
    },
    deviceLimit: 3,
    features: [
      "Full access to all premium features",
      "Manage up to 3 devices (Non-Extendable)",
      "Different settings profiles",
      "Premium Support (72 hours)",
    ],
  },
  team: {
    name: "Team",
    color: {
      primary: "bg-amber-500",
      secondary: "bg-amber-50/50 dark:bg-amber-950/20",
      badge: "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300",
      badgeText: "text-amber-700 dark:text-amber-300",
      progressBar: "bg-amber-500",
      hover: "bg-amber-400 dark:bg-amber-400", // Lighter amber for hover
    },
    pricing: {
      monthly: "$9.99",
      yearly: "$95.88",
      yearlyPerMonth: "$7.99",
    },
    deviceLimit: 10,
    features: [
      "Full access to all premium features",
      "Manage up to 10 devices (Extendable)",
      "Different settings profiles",
      "Premium Support (24 hours)",
      "Team collaboration features",
      "Advanced analytics",
    ],
  },
  enterprise: {
    name: "Enterprise",
    color: {
      primary: "bg-purple-600",
      secondary: "bg-purple-50/50 dark:bg-purple-950/20",
      badge: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300",
      badgeText: "text-purple-700 dark:text-purple-300",
      progressBar: "bg-purple-600",
      hover: "bg-purple-500 dark:bg-purple-500", // Lighter purple for hover
    },
    pricing: {
      monthly: "$39.99",
      yearly: "$359.88",
      yearlyPerMonth: "$29.99",
    },
    deviceLimit: 100,
    features: [
      "Full access to all premium features",
      "Manage up to 100 devices",
      "Custom settings profiles",
      "Priority Support (4 hours)",
      "Team collaboration features",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
}

export function getPlanAmount(plan: PlanType, billingPeriod: BillingPeriodType): string {
  if (plan === "basic") return "Free"

  return billingPeriod === "yearly" ? PLANS[plan].pricing.yearly : PLANS[plan].pricing.monthly
}

export function getNextPlan(currentPlan: PlanType): PlanType {
  switch (currentPlan) {
    case "basic":
      return "individual"
    case "individual":
      return "team"
    case "team":
      return "enterprise"
    case "enterprise":
      return "enterprise" // Already at highest plan
  }
}

export function getPreviousPlan(currentPlan: PlanType): PlanType {
  switch (currentPlan) {
    case "basic":
      return "basic" // Already at lowest plan
    case "individual":
      return "basic"
    case "team":
      return "individual"
    case "enterprise":
      return "team"
  }
}

// Add a new function to calculate the discount percentage for yearly plans
export function getYearlyDiscountPercentage(plan: PlanType): number {
  if (plan === "basic") return 0

  const monthlyPrice = Number.parseFloat(PLANS[plan].pricing.monthly.replace("$", ""))
  const yearlyPrice = Number.parseFloat(PLANS[plan].pricing.yearly.replace("$", ""))

  // Calculate discount: (1 - (yearlyPrice / (monthlyPrice * 12))) * 100
  const discount = (1 - yearlyPrice / (monthlyPrice * 12)) * 100

  // Round to nearest whole number
  return Math.round(discount)
}

// Add a helper function to get the discount text
export function getDiscountText(plan: PlanType): string {
  const percentage = getYearlyDiscountPercentage(plan)
  return percentage > 0 ? `Save ${percentage}%` : ""
}
