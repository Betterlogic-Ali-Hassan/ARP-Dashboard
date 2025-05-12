import { create } from "zustand"
import { produce } from "immer"

export interface Notification {
  id: string
  url: string
  keyword: string
  eventType: "Keyword Found" | "Keyword Lost" | "Page Change Detected"
  type: "Normal" | "XHR" | "Custom"
  deviceName: string
  profileName: string
  timestamp: string
  isNew?: boolean // Added to track new notifications for UI effects
  read?: boolean // Added to track read status
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  markAsRead: (id: string) => Promise<void> // Added to mark notifications as read
  markAllAsRead: () => Promise<void> // Added to mark all notifications as read
}

// Simulate API call to update notification status
const updateNotificationStatus = async (id: string, read: boolean): Promise<void> => {
  // In a real app, this would be an API call to update the server
  return new Promise((resolve) => {
    console.log(`Updating notification ${id} status to ${read ? "read" : "unread"}`)
    // Simulate network delay
    setTimeout(resolve, 300)
  })
}

// Sample notification data
const sampleNotifications: Notification[] = [
  {
    id: "notif-1",
    url: "example.com/products/limited-edition",
    keyword: "In Stock",
    eventType: "Keyword Found",
    type: "Normal",
    deviceName: "Windows PC",
    profileName: "Work Profile",
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: "notif-2",
    url: "shop.example.org/electronics/phones",
    keyword: "Sale",
    eventType: "Keyword Lost",
    type: "XHR",
    deviceName: "MacBook Pro",
    profileName: "Personal Profile",
    timestamp: "15 minutes ago",
    read: false,
  },
  {
    id: "notif-3",
    url: "tickets.example.net/events/concert",
    keyword: "Available",
    eventType: "Page Change Detected",
    type: "Custom",
    deviceName: "iPhone 13",
    profileName: "Default Profile",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "notif-4",
    url: "marketplace.example.com/listings/vintage",
    keyword: "Discount",
    eventType: "Keyword Found",
    type: "Normal",
    deviceName: "Office PC",
    profileName: "Work Profile",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "notif-5",
    url: "deals.example.io/flash-sale",
    keyword: "Limited Time",
    eventType: "Keyword Found",
    type: "XHR",
    deviceName: "Galaxy Tab",
    profileName: "Media Profile",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: "notif-6",
    url: "housing.example.com/apartments/downtown",
    keyword: "New Listing",
    eventType: "Page Change Detected",
    type: "Normal",
    deviceName: "Pixel 6",
    profileName: "Default Profile",
    timestamp: "Yesterday",
    read: true,
  },
]

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: sampleNotifications,

  addNotification: (notification) =>
    set(
      produce((state: NotificationStore) => {
        // Ensure new notifications are unread by default
        state.notifications.unshift({
          ...notification,
          read: false,
        })
      }),
    ),

  removeNotification: (id) =>
    set(
      produce((state: NotificationStore) => {
        state.notifications = state.notifications.filter((notification) => notification.id !== id)
      }),
    ),

  clearAllNotifications: () => set({ notifications: [] }),

  markAsRead: async (id) => {
    // First update the server (simulated)
    await updateNotificationStatus(id, true)

    // Then update the local state
    set(
      produce((state: NotificationStore) => {
        const notification = state.notifications.find((n) => n.id === id)
        if (notification) {
          notification.read = true
          notification.isNew = false // Also remove the "new" status
        }
      }),
    )
  },

  markAllAsRead: async () => {
    // Get all unread notification IDs
    let unreadIds: string[] = []
    set(
      produce((state: NotificationStore) => {
        unreadIds = state.notifications.filter((n) => !n.read).map((n) => n.id)
      }),
    )

    // Update the server for all unread notifications (simulated)
    await updateNotificationStatus("all", true)

    // Update the local state
    set(
      produce((state: NotificationStore) => {
        state.notifications.forEach((notification) => {
          notification.read = true
          notification.isNew = false
        })
      }),
    )
  },
}))
