"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TicketStatusBadge } from "@/components/ticket-status-badge"
import { ChatMessage } from "@/components/chat-message"
import { useTicketStore, type Ticket } from "@/lib/ticket-store"
import { Send, PaperclipIcon, X, ChevronLeft, MessageSquare, ImageIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import DOMPurify from "dompurify"

// Sanitize user content to prevent XSS attacks
const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  })
}

interface TicketChatPanelProps {
  ticket: Ticket | null | undefined
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

// Update the TicketChatPanel component to be more responsive
export function TicketChatPanel({ ticket, isOpen, onClose, isMobile }: TicketChatPanelProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const [fileError, setFileError] = useState<string | null>(null)

  const { sendMessage, getMessagesForTicket, updateTicketStatus } = useTicketStore()
  const messages = ticket ? getMessagesForTicket(ticket.id) : []

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError(null) // Reset error state

    // Enhanced security checks for file uploads

    // Check if file is an image with specific allowed types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setFileError("Only JPG, PNG, GIF, and WebP images are supported")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Image size must be 5MB or less")
      return
    }

    // Create preview with additional error handling
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const result = e.target?.result as string

        // Additional validation - ensure it's actually an image
        const img = new Image()
        img.onload = () => {
          // Image loaded successfully, it's a valid image
          setSelectedImage(result)
          setSelectedFile(file)
        }

        img.onerror = () => {
          // Failed to load as an image
          setFileError("Invalid image file")
          setSelectedImage(null)
          setSelectedFile(null)
        }

        img.src = result
      } catch (error) {
        console.error("Error processing image:", error)
        setFileError("Failed to process image")
        setSelectedImage(null)
        setSelectedFile(null)
      }
    }

    reader.onerror = () => {
      setFileError("Failed to read file")
      setSelectedImage(null)
      setSelectedFile(null)
    }

    reader.readAsDataURL(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setFileError(null)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && !selectedImage) || !ticket) return

    setIsSubmitting(true)
    try {
      // Sanitize the message content to prevent XSS attacks
      const sanitizedMessage = sanitizeContent(message)

      // If we have an image, create a message with image content
      if (selectedImage) {
        // For images, we need to handle them securely
        // In a real app, you would upload the image to a server and get a secure URL
        // Here we're just demonstrating the concept
        const imageContent = `[Image]${selectedImage}`
        const textContent = sanitizedMessage.trim() ? `${sanitizedMessage}\n${imageContent}` : imageContent

        await sendMessage(ticket.id, textContent)
        setSelectedImage(null)
        setSelectedFile(null)
      } else {
        // Regular text message
        await sendMessage(ticket.id, sanitizedMessage)
      }
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (status: Ticket["status"]) => {
    if (!ticket) return

    try {
      await updateTicketStatus(ticket.id, status)
    } catch (error) {
      console.error("Failed to update ticket status:", error)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out",
        isMobile
          ? "fixed inset-0 z-50"
          : "sticky top-0 right-0 h-[calc(100vh-64px)] w-[350px] sm:w-[400px] lg:w-[450px] max-w-[50%] overflow-hidden",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 sm:p-3 md:p-4 border-b border-gray-200 dark:border-gray-800">
        {ticket ? (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={onClose} className="mr-0.5 -ml-1.5 h-8 w-8 sm:h-9 sm:w-9">
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate text-xs sm:text-sm md:text-base">{ticket.title}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                  <span>Ticket #{ticket.id.split("-")[1]}</span>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <h3 className="font-medium text-sm sm:text-base">Support Chat</h3>
            <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">Select a ticket to start chatting</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {ticket && (
            <select
              className="text-[10px] xs:text-xs rounded border border-gray-200 dark:border-gray-700 bg-transparent px-1.5 sm:px-2 py-0.5 sm:py-1 h-7 sm:h-8"
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value as Ticket["status"])}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
              <option value="closed">Closed</option>
            </select>
          )}
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 sm:h-8 sm:w-8">
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>
      </div>

      {ticket ? (
        <>
          {/* Ticket details */}
          <div className="bg-gray-50 dark:bg-gray-900 p-2.5 sm:p-3 text-xs sm:text-sm border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-[10px] xs:text-xs sm:text-sm">Details</p>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2 text-[10px] xs:text-xs sm:text-sm">
              {ticket.description}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-[10px] xs:text-xs text-gray-500">
              <p>Category: {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}</p>
              <p>Priority: {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-[10px] xs:text-xs sm:text-sm">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                // Ensure message content is sanitized before rendering
                const sanitizedMessage = {
                  ...msg,
                  content: sanitizeContent(msg.content),
                }
                return <ChatMessage key={msg.id} message={sanitizedMessage} isUser={msg.sender === "user"} />
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form
            onSubmit={handleSendMessage}
            className="sticky bottom-0 bg-white dark:bg-gray-900 p-2.5 sm:p-3 md:p-4 border-t border-gray-200 dark:border-gray-800 z-10"
          >
            {ticket.status === "closed" ? (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2.5 sm:p-3 text-center text-[10px] xs:text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                This ticket is closed. You cannot send new messages.
              </div>
            ) : (
              <>
                {/* Image preview */}
                {selectedImage && (
                  <div className="mb-2.5 sm:mb-3 relative">
                    <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 w-full max-w-[150px] sm:max-w-[200px]">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Selected"
                        className="w-full h-auto object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full opacity-90"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-1.5 sm:gap-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[50px] xs:min-h-[60px] sm:min-h-[80px] resize-none text-[10px] xs:text-xs sm:text-sm"
                      disabled={isSubmitting}
                    />
                    {fileError && (
                      <div className="mt-1 text-[10px] xs:text-xs text-red-500 dark:text-red-400">{fileError}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileSelect}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={triggerFileInput}
                      className={cn(
                        selectedImage && "border-primary text-primary",
                        fileError && "border-red-500",
                        "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 relative",
                      )}
                      title="Attach image (max 5MB)"
                    >
                      {selectedImage ? (
                        <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      ) : (
                        <PaperclipIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={(!message.trim() && !selectedImage) || isSubmitting}
                      className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                    >
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1 text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                  Images only • Max size: 5MB
                </div>
              </>
            )}
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3 sm:mb-4">
              <MessageSquare className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-gray-400" />
            </div>
            <h3 className="font-medium mb-1 text-sm sm:text-base">No ticket selected</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select a ticket from the list to view the conversation
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Ensure the component is properly exported
export default TicketChatPanel
