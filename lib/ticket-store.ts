import { create } from "zustand"

export type TicketStatus = "open" | "in_progress" | "waiting" | "closed"
export type TicketPriority = "low" | "normal" | "high" | "urgent"
export type TicketCategory = "account" | "billing" | "devices" | "profiles" | "other"

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  ticketId: string
  content: string
  sender: "user" | "agent"
  timestamp: string
}

interface CreateTicketParams {
  title: string
  description: string
  priority: string
  category: string
}

interface TicketStore {
  tickets: Ticket[]
  messages: Message[]

  // Ticket actions
  createTicket: (params: CreateTicketParams) => Promise<Ticket>
  updateTicketStatus: (id: string, status: TicketStatus) => Promise<void>

  // Message actions
  sendMessage: (ticketId: string, content: string) => Promise<Message>
  getMessagesForTicket: (ticketId: string) => Message[]
}

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [
    {
      id: "ticket-1",
      title: "Cannot connect to my device",
      description:
        "I'm trying to connect to my Windows PC but it keeps showing an error message saying 'Connection refused'.",
      status: "open",
      priority: "high",
      category: "devices",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ticket-2",
      title: "Billing question about my subscription",
      description: "I was charged twice for my monthly subscription. Can you please help me resolve this issue?",
      status: "in_progress",
      priority: "normal",
      category: "billing",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "ticket-3",
      title: "How do I reset my password?",
      description:
        "I forgot my password and need to reset it. I tried the 'Forgot Password' link but I'm not receiving the email.",
      status: "closed",
      priority: "normal",
      category: "account",
      createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      updatedAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    },
  ],

  messages: [
    {
      id: "msg-1",
      ticketId: "ticket-1",
      content:
        "I'm trying to connect to my Windows PC but it keeps showing an error message saying 'Connection refused'. I've tried restarting the device but it didn't help.",
      sender: "user",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "msg-2",
      ticketId: "ticket-1",
      content:
        "Hello! I'm sorry to hear you're having trouble connecting to your device. Could you please tell me which version of our software you're using?",
      sender: "agent",
      timestamp: new Date(Date.now() - 82800000).toISOString(),
    },
    {
      id: "msg-3",
      ticketId: "ticket-2",
      content:
        "I was charged twice for my monthly subscription on April 15th. The transaction IDs are #TRX-12345 and #TRX-12346.",
      sender: "user",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "msg-4",
      ticketId: "ticket-2",
      content:
        "Thank you for reporting this issue. I can see the duplicate charge in our system. I've initiated a refund for the second charge, which should appear in your account within 3-5 business days.",
      sender: "agent",
      timestamp: new Date(Date.now() - 169200000).toISOString(),
    },
    {
      id: "msg-5",
      ticketId: "ticket-2",
      content: "Thank you! I'll keep an eye out for the refund.",
      sender: "user",
      timestamp: new Date(Date.now() - 165600000).toISOString(),
    },
    {
      id: "msg-6",
      ticketId: "ticket-3",
      content:
        "I forgot my password and need to reset it. I tried the 'Forgot Password' link but I'm not receiving the email.",
      sender: "user",
      timestamp: new Date(Date.now() - 604800000).toISOString(),
    },
    {
      id: "msg-7",
      ticketId: "ticket-3",
      content:
        "Hello! I'm sorry you're having trouble with password reset. Let me check if the email address on your account is correct. Could you please confirm the email address you're using?",
      sender: "agent",
      timestamp: new Date(Date.now() - 601200000).toISOString(),
    },
    {
      id: "msg-8",
      ticketId: "ticket-3",
      content: "I'm using john.doe@example.com",
      sender: "user",
      timestamp: new Date(Date.now() - 597600000).toISOString(),
    },
    {
      id: "msg-9",
      ticketId: "ticket-3",
      content:
        "Thank you for confirming. I've manually sent a password reset link to john.doe@example.com. Please check your inbox and spam folder. The link will expire in 24 hours.",
      sender: "agent",
      timestamp: new Date(Date.now() - 594000000).toISOString(),
    },
    {
      id: "msg-10",
      ticketId: "ticket-3",
      content: "I got the email and was able to reset my password. Thank you for your help!",
      sender: "user",
      timestamp: new Date(Date.now() - 590400000).toISOString(),
    },
    {
      id: "msg-11",
      ticketId: "ticket-3",
      content: "You're welcome! I'm glad we could resolve this issue. Is there anything else you need help with?",
      sender: "agent",
      timestamp: new Date(Date.now() - 586800000).toISOString(),
    },
    {
      id: "msg-12",
      ticketId: "ticket-3",
      content: "No, that's all. Thanks again!",
      sender: "user",
      timestamp: new Date(Date.now() - 583200000).toISOString(),
    },
    {
      id: "msg-13",
      ticketId: "ticket-3",
      content: "Great! I'll close this ticket now. Feel free to open a new one if you need any further assistance.",
      sender: "agent",
      timestamp: new Date(Date.now() - 579600000).toISOString(),
    },
  ],

  createTicket: async (params) => {
    // Simulate API call
    await delay(1000)

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: params.title,
      description: params.description,
      status: "open",
      priority: params.priority as TicketPriority,
      category: params.category as TicketCategory,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    set((state) => ({
      tickets: [...state.tickets, newTicket],
    }))

    // Automatically add the first message from the user
    const firstMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId: newTicket.id,
      content: params.description,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, firstMessage],
    }))

    // Simulate agent response after 2 seconds
    setTimeout(() => {
      const agentResponse: Message = {
        id: `msg-${Date.now()}`,
        ticketId: newTicket.id,
        content: "Thank you for contacting support. An agent will review your ticket shortly and get back to you.",
        sender: "agent",
        timestamp: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, agentResponse],
      }))
    }, 2000)

    return newTicket
  },

  updateTicketStatus: async (id, status) => {
    // Simulate API call
    await delay(500)

    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status, updatedAt: new Date().toISOString() } : ticket,
      ),
    }))

    // If status is closed, add a system message
    if (status === "closed") {
      const closedMessage: Message = {
        id: `msg-${Date.now()}`,
        ticketId: id,
        content:
          "This ticket has been marked as resolved and is now closed. If you need further assistance, please open a new ticket.",
        sender: "agent",
        timestamp: new Date().toISOString(),
      }

      set((state) => ({
        messages: [...state.messages, closedMessage],
      }))
    }
  },

  sendMessage: async (ticketId, content) => {
    // Simulate API call
    await delay(500)

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ticketId,
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }))

    // Update the ticket's updatedAt timestamp
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, updatedAt: new Date().toISOString() } : ticket,
      ),
    }))

    // Simulate agent response after a delay (only for open tickets)
    const ticket = get().tickets.find((t) => t.id === ticketId)
    if (ticket && ticket.status !== "closed") {
      setTimeout(() => {
        // Generate a contextual response
        let responseContent = "Thank you for your message. An agent will review it shortly."

        if (content.toLowerCase().includes("thank")) {
          responseContent = "You're welcome! Is there anything else I can help you with today?"
        } else if (content.toLowerCase().includes("help")) {
          responseContent =
            "I understand you need assistance. Could you please provide more details about your issue so I can better help you?"
        } else if (content.toLowerCase().includes("not working")) {
          responseContent =
            "I'm sorry to hear that. Let's troubleshoot this issue. Could you tell me what steps you've already taken?"
        } else if (content.includes("[Image]")) {
          responseContent = "Thank you for sharing the image. This will help us better understand your issue."
        }

        const agentResponse: Message = {
          id: `msg-${Date.now()}`,
          ticketId,
          content: responseContent,
          sender: "agent",
          timestamp: new Date().toISOString(),
        }

        set((state) => ({
          messages: [...state.messages, agentResponse],
        }))
      }, 3000)
    }

    return newMessage
  },

  getMessagesForTicket: (ticketId) => {
    return get()
      .messages.filter((message) => message.ticketId === ticketId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  },
}))
