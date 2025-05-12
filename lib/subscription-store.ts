"use client"

import { create } from "zustand"
import { useEffect, useState } from "react"
import { useDeviceStore } from "./store"

type SubscriptionStatus = "active" | "canceled" | "scheduled_downgrade" | "past_due"
type PlanType = "basic" | "individual" | "team" | "enterprise"
type BillingPeriodType = "monthly" | "yearly"

interface SubscriptionState {
  status: SubscriptionStatus
  currentPlan: PlanType
  targetPlan: PlanType | null
  expiryDate: string
  billingPeriod: BillingPeriodType
  deviceLimit: number
  devicesUsed: number // Add this to track the current device count in the state
}

interface SubscriptionActions {
  updateStatus: (status: SubscriptionStatus) => void
  updatePlan: (plan: PlanType) => void
  updateTargetPlan: (plan: PlanType | null) => void
  updateExpiryDate: (date: string) => void
  reactivateSubscription: () => void
  getDevicesUsed: () => number
  getActiveDevicesUsed: () => number
  syncDeviceCount: () => void // Add this action to manually sync the device count
}

export const useSubscriptionStore = create<SubscriptionState & SubscriptionActions>((set, get) => ({
  status: "active",
  currentPlan: "team",
  targetPlan: null,
  expiryDate: "2024-04-01",
  billingPeriod: "yearly",
  deviceLimit: 10,
  devicesUsed: 0, // Initialize with 0, will be updated on first sync

  // Actions
  updateStatus: (status: SubscriptionStatus) => set({ status }),
  updatePlan: (plan: PlanType) => set({ currentPlan: plan }),
  updateTargetPlan: (plan: PlanType | null) => set({ targetPlan: plan }),
  updateExpiryDate: (date: string) => set({ expiryDate: date }),
  reactivateSubscription: () =>
    set({
      status: "active",
      targetPlan: null,
    }),

  // Methods to get device counts from the device store
  getDevicesUsed: () => {
    const { devices } = useDeviceStore.getState()
    return devices.length
  },

  getActiveDevicesUsed: () => {
    const { devices } = useDeviceStore.getState()
    return devices.filter((device) => device.status === "active").length
  },

  // New method to sync the device count with the state
  syncDeviceCount: () => {
    const deviceCount = get().getDevicesUsed()
    set({ devicesUsed: deviceCount })
  },
}))

// Add this custom hook to the subscription store file
// This will maintain the device count synchronization while allowing us to restore the UI

// Custom hook to sync device count between stores
export function useDeviceCountSync() {
  const [deviceCount, setDeviceCount] = useState(() => {
    // Initialize with the current count from device store
    return useDeviceStore.getState().devices.length
  })

  useEffect(() => {
    // Subscribe to changes in the device store
    const unsubscribe = useDeviceStore.subscribe(
      (state) => state.devices.length,
      (count) => {
        setDeviceCount(count)
      },
    )

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [])

  return deviceCount
}
