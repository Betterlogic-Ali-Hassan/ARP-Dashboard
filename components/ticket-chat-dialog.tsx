"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TicketStatusBadge } from "@/components/ticket-status-badge"
import { ChatMessage } from "@/components/chat-message"
import { useTicketStore, type Ticket } from "@/lib/ticket-store"
import { Send, PaperclipIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TicketChatDialogProps {
  ticket: Ticket
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketChatDialog({ ticket, open, onOpenChange }: TicketChatDialogProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { sendMessage, getMessagesForTicket, updateTicketStatus } = useTicketStore()
  const messages = getMessagesForTicket(ticket.id)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      await sendMessage(ticket.id, message)
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (status: Ticket["status"]) => {
    try {
      await updateTicketStatus(ticket.id, status)
    } catch (error) {
      console.error("Failed to update ticket status:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="flex items-center gap-3">
              {ticket.title}
              <TicketStatusBadge status={ticket.status} />
            </DialogTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="text-xs rounded border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1"
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as Ticket["status"])}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </DialogHeader>

        {/* Ticket details */}
        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md mb-4 text-sm">
          <p className="font-medium mb-1">Description:</p>
          <p className="text-gray-600 dark:text-gray-400">{ticket.description}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <p>Category: {ticket.category}</p>
            <p>Priority: {ticket.priority}</p>
          </div>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[300px] min-h-[200px] p-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} isUser={msg.sender === "user"} />)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={ticket.status === "closed"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button type="button" size="icon" variant="outline" disabled={ticket.status === "closed"}>
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button type="submit" size="icon" disabled={!message.trim() || isSubmitting || ticket.status === "closed"}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {ticket.status === "closed" && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            This ticket is closed. You cannot send new messages.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
