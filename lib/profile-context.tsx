"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useDeviceStore } from "@/lib/store"

// Define the context type
interface ProfileContextType {
  activeProfileId: string | null
  setActiveProfileId: (id: string) => void
  activeProfile: any | null
}

// Create the context with default values
const ProfileContext = createContext<ProfileContextType>({
  activeProfileId: null,
  setActiveProfileId: () => {},
  activeProfile: null,
})

// Provider component
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { profiles } = useDeviceStore()
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null)

  // Get the active profile object
  const activeProfile = activeProfileId
    ? profiles.find((p) => p.id === activeProfileId)
    : profiles.find((p) => p.isDefault) || null

  // Load the last used profile from localStorage on component mount
  useEffect(() => {
    const lastUsedProfileId = localStorage.getItem("lastUsedProfileId")
    if (lastUsedProfileId) {
      const profile = profiles.find((p) => p.id === lastUsedProfileId)
      if (profile) {
        setActiveProfileId(profile.id)
      } else {
        // If the saved profile doesn't exist anymore, use the default profile
        const defaultProfile = profiles.find((p) => p.isDefault)
        if (defaultProfile) {
          setActiveProfileId(defaultProfile.id)
          localStorage.setItem("lastUsedProfileId", defaultProfile.id)
        }
      }
    } else {
      // If no profile was previously selected, use the default profile
      const defaultProfile = profiles.find((p) => p.isDefault)
      if (defaultProfile) {
        setActiveProfileId(defaultProfile.id)
        localStorage.setItem("lastUsedProfileId", defaultProfile.id)
      }
    }
  }, [profiles])

  // Update localStorage when activeProfileId changes
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem("lastUsedProfileId", activeProfileId)
    }
  }, [activeProfileId])

  return (
    <ProfileContext.Provider value={{ activeProfileId, setActiveProfileId, activeProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// Custom hook to use the profile context
export function useProfile() {
  return useContext(ProfileContext)
}
