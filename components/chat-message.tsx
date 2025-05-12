"use client"

import { cn } from "@/lib/utils"
import type { Message } from "@/lib/ticket-store"
import { MessageSquare, User } from "lucide-react"
import { useState } from "react"

// Add this to make the ChatMessage component more responsive
// (Assuming this component exists and needs to be updated)
export function ChatMessage({ message, isUser }: { message: Message; isUser: boolean }) {
  const [imageOpen, setImageOpen] = useState(false)

  // Check if the message contains an image
  const hasImage = message.content.includes("[Image]")

  // Extract text and image content
  let textContent = message.content
  let imageContent = null

  if (hasImage) {
    const imageParts = message.content.split("[Image]")
    textContent = imageParts[0].trim()
    imageContent = imageParts[1]
  }

  return (
    <>
      <div className={cn("flex items-start gap-2 sm:gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center shrink-0",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
          )}
        >
          {isUser ? (
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          ) : (
            <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          )}
        </div>
        <div
          className={cn(
            "rounded-lg px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 max-w-[80%] text-[10px] xs:text-xs sm:text-sm break-words",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          )}
        >
          {message.content.includes("[Image]") ? (
            <div>
              {message.content.split("[Image]")[0].trim() && (
                <p className="mb-2">{message.content.split("[Image]")[0].trim()}</p>
              )}
              <div className="rounded-md overflow-hidden">
                <img
                  src={message.content.split("[Image]")[1] || "/placeholder.svg"}
                  alt="Attached"
                  className="max-w-full h-auto"
                />
              </div>
            </div>
          ) : (
            <p>{message.content}</p>
          )}
          <div
            className={cn(
              "text-[8px] xs:text-[9px] sm:text-[10px] mt-1 opacity-70",
              isUser ? "text-right" : "text-left",
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>

      {/* Image Overlay Dialog */}
      {/* {imageContent && (
        <Dialog open={imageOpen} onOpenChange={setImageOpen}>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
            <div className="relative w-full h-full flex items-center justify-center">
              <DialogClose className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                <X className="h-5 w-5" />
              </DialogClose>
              <img
                src={imageContent || "/placeholder.svg"}
                alt="Enlarged image"
                className="max-w-full max-h-[80vh] object-contain rounded shadow-xl"
              />
            </div>
          </DialogContent>
        </Dialog>
      )} */}
    </>
  )
}
