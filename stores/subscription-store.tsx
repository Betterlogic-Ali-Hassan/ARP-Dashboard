"use client"

import { create } from "zustand"

type SubscriptionStatus = "active" | "canceled" | "scheduled_downgrade" | "past_due" | null
type PlanType = "basic" | "individual" | "team" | "enterprise"
type BillingPeriodType = "monthly" | "yearly"

interface SubscriptionState {
  status: SubscriptionStatus
  currentPlan: PlanType
  targetPlan: PlanType | null
  expiryDate: string
  billingPeriod: BillingPeriodType
}

interface SubscriptionActions {
  updateStatus: (status: SubscriptionStatus) => void
  updatePlan: (plan: PlanType) => void
  updateTargetPlan: (plan: PlanType | null) => void
  updateExpiryDate: (date: string) => void
  reactivateSubscription: () => void
}

export const useSubscriptionStore = create<SubscriptionState & SubscriptionActions>((set) => ({
  status: "active",
  currentPlan: "team",
  targetPlan: null,
  expiryDate: "2024-04-01",
  billingPeriod: "yearly",

  updateStatus: (status) => set({ status }),
  updatePlan: (plan) => set({ currentPlan: plan }),
  updateTargetPlan: (plan) => set({ targetPlan: plan }),
  updateExpiryDate: (date) => set({ expiryDate: date }),
  reactivateSubscription: () =>
    set({
      status: "active",
      targetPlan: null,
    }),
}))
