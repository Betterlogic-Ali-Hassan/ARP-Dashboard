import { create } from "zustand"
import { persist } from "zustand/middleware"

// Define types
export interface Device {
  id: string
  name: string
  type: string
  lastActive: string
  profileId: string
  status?: string
}

export interface Profile {
  id: string
  name: string
  isDefault: boolean
  createdAt: string
}

// Define store interface
interface DeviceStore {
  devices: Device[]
  profiles: Profile[]
  addDevice: (device: Device) => void
  removeDevice: (id: string) => void
  updateDevice: (id: string, data: Partial<Device>) => void
  addProfile: (profile: Profile) => void
  removeProfile: (id: string) => void
  updateProfile: (id: string, data: Partial<Profile>) => void
  duplicateProfile: (id: string) => Profile
  syncStatus: {
    lastSynced: string | null
    inProgress: boolean
  }
  // New methods for bidirectional synchronization
  assignDeviceToProfile: (deviceId: string, profileId: string) => void
  unassignDeviceFromProfile: (deviceId: string) => void
  getDevicesByProfileId: (profileId: string) => Device[]
  getProfileByDeviceId: (deviceId: string) => Profile | undefined
  syncDeviceProfiles: () => void
  resetDeviceSettings: (deviceId: string) => void
}

// Sample data
const sampleProfiles: Profile[] = [
  {
    id: "profile-1",
    name: "Default Profile",
    isDefault: true,
    createdAt: "2023-01-15T12:00:00Z",
  },
  {
    id: "profile-2",
    name: "Work Profile",
    isDefault: false,
    createdAt: "2023-02-20T09:30:00Z",
  },
  {
    id: "profile-3",
    name: "Shopping Profile",
    isDefault: false,
    createdAt: "2023-03-10T15:45:00Z",
  },
  {
    id: "profile-4",
    name: "Personal Profile",
    isDefault: false,
    createdAt: "2023-04-05T18:20:00Z",
  },
  {
    id: "profile-5",
    name: "Media Profile",
    isDefault: false,
    createdAt: "2023-05-12T11:10:00Z",
  },
]

const sampleDevices: Device[] = [
  {
    id: "device-1",
    name: "Windows PC",
    type: "desktop",
    lastActive: "2023-06-01T10:15:00Z",
    profileId: "profile-1",
  },
  {
    id: "device-2",
    name: "MacBook Pro",
    type: "laptop",
    lastActive: "2023-06-02T14:30:00Z",
    profileId: "profile-2",
  },
  {
    id: "device-3",
    name: "iPad",
    type: "tablet",
    lastActive: "2023-06-03T09:45:00Z",
    profileId: "profile-3",
  },
  {
    id: "device-4",
    name: "iPhone 13",
    type: "mobile",
    lastActive: "2023-06-04T16:20:00Z",
    profileId: "profile-4",
  },
  {
    id: "device-5",
    name: "Galaxy S22",
    type: "mobile",
    lastActive: "2023-06-05T11:10:00Z",
    profileId: "profile-5",
  },
  {
    id: "device-6",
    name: "Office PC",
    type: "desktop",
    lastActive: "2023-06-06T08:30:00Z",
    profileId: "profile-2",
  },
]

// Create store
export const useDeviceStore = create<DeviceStore>()(
  persist(
    (set, get) => ({
      devices: sampleDevices,
      profiles: sampleProfiles,
      addDevice: (device) => set((state) => ({ devices: [...state.devices, device] })),
      removeDevice: (id) => set((state) => ({ devices: state.devices.filter((device) => device.id !== id) })),
      updateDevice: (id, data) =>
        set((state) => ({
          devices: state.devices.map((device) => (device.id === id ? { ...device, ...data } : device)),
        })),
      addProfile: (profile) => set((state) => ({ profiles: [...state.profiles, profile] })),
      removeProfile: (id) => {
        const state = get()
        // Find the default profile to reassign devices
        const defaultProfile = state.profiles.find((p) => p.isDefault)

        // Reassign devices to default profile
        if (defaultProfile) {
          state.devices
            .filter((device) => device.profileId === id)
            .forEach((device) => {
              get().updateDevice(device.id, { profileId: defaultProfile.id })
            })
        }

        set({ profiles: state.profiles.filter((profile) => profile.id !== id) })
      },
      updateProfile: (id, data) =>
        set((state) => ({
          profiles: state.profiles.map((profile) => (profile.id === id ? { ...profile, ...data } : profile)),
        })),
      duplicateProfile: (id) => {
        const state = get()
        const profileToDuplicate = state.profiles.find((profile) => profile.id === id)

        if (!profileToDuplicate) {
          throw new Error(`Profile with id ${id} not found`)
        }

        const newProfile = {
          ...profileToDuplicate,
          id: `profile-${Date.now()}`,
          name: `${profileToDuplicate.name} (Copy)`,
          isDefault: false,
          createdAt: new Date().toISOString(),
        }

        get().addProfile(newProfile)
        return newProfile
      },
      syncStatus: {
        lastSynced: null,
        inProgress: false,
      },
      // New method implementations
      assignDeviceToProfile: (deviceId, profileId) => {
        const state = get()
        const device = state.devices.find((d) => d.id === deviceId)
        const profile = state.profiles.find((p) => p.id === profileId)

        if (!device || !profile) {
          console.error("Device or profile not found")
          return
        }

        get().updateDevice(deviceId, { profileId })

        // Update sync status
        set({
          syncStatus: {
            lastSynced: new Date().toISOString(),
            inProgress: false,
          },
        })
      },
      unassignDeviceFromProfile: (deviceId) => {
        const state = get()
        const device = state.devices.find((d) => d.id === deviceId)

        if (!device) {
          console.error("Device not found")
          return
        }

        // Find default profile
        const defaultProfile = state.profiles.find((p) => p.isDefault)

        if (defaultProfile) {
          get().updateDevice(deviceId, { profileId: defaultProfile.id })
        } else {
          // If no default profile exists, just remove the profileId
          get().updateDevice(deviceId, { profileId: "" })
        }

        // Update sync status
        set({
          syncStatus: {
            lastSynced: new Date().toISOString(),
            inProgress: false,
          },
        })
      },
      getDevicesByProfileId: (profileId) => {
        return get().devices.filter((device) => device.profileId === profileId)
      },
      getProfileByDeviceId: (deviceId) => {
        const device = get().devices.find((d) => d.id === deviceId)
        if (!device) return undefined

        return get().profiles.find((p) => p.id === device.profileId)
      },
      syncDeviceProfiles: () => {
        set({
          syncStatus: {
            ...get().syncStatus,
            inProgress: true,
          },
        })

        // Simulate sync process
        setTimeout(() => {
          set({
            syncStatus: {
              lastSynced: new Date().toISOString(),
              inProgress: false,
            },
          })
        }, 1000)
      },
      resetDeviceSettings: (deviceId: string) => {
        const state = get()
        const device = state.devices.find((d) => d.id === deviceId)

        if (!device) {
          console.error("Device not found")
          return
        }

        // Find default profile
        const defaultProfile = state.profiles.find((p) => p.isDefault)

        if (defaultProfile) {
          // Reset the device to use the default profile
          get().updateDevice(deviceId, {
            profileId: defaultProfile.id,
            
          })

          // Update sync status
          set({
            syncStatus: {
              lastSynced: new Date().toISOString(),
              inProgress: false,
            },
          })
        }
      },
    }),
    {
      name: "device-store",
    },
  ),
)
