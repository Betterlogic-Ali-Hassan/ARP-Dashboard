"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTicketStore } from "@/lib/ticket-store"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Update the CreateTicketDialog component to be more responsive
export function CreateTicketDialog({ open, onOpenChange }: CreateTicketDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("devices")
  const [priority, setPriority] = useState("normal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { createTicket } = useTicketStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!title.trim()) {
      setError("Please enter a title for your ticket")
      return
    }

    if (!description.trim()) {
      setError("Please enter a description for your ticket")
      return
    }

    setIsSubmitting(true)
    try {
      await createTicket({
        title,
        description,
        category,
        priority,
      })
      setSuccess(true)
      setTimeout(() => {
        resetForm()
        onOpenChange(false)
      }, 1500)
    } catch (err) {
      setError("Failed to create ticket. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setCategory("devices")
    setPriority("normal")
    setError(null)
    setSuccess(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm()
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px] w-[calc(100%-2rem)] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg md:text-xl">Create Support Ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 mt-1 sm:mt-2">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-2.5 sm:p-3 rounded-md flex items-start gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-2.5 sm:p-3 rounded-md flex items-start gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
              <span>Ticket created successfully!</span>
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="title" className="text-xs sm:text-sm">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your issue"
              disabled={isSubmitting || success}
              className="h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="description" className="text-xs sm:text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about your issue"
              rows={4}
              disabled={isSubmitting || success}
              className="text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="category" className="text-xs sm:text-sm">
                Category
              </Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={cn(
                  "flex h-8 sm:h-10 w-full rounded-md border border-input bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm",
                  "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                )}
                disabled={isSubmitting || success}
              >
                <option value="account">Account</option>
                <option value="billing">Billing</option>
                <option value="devices">Devices</option>
                <option value="profiles">Profiles</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="priority" className="text-xs sm:text-sm">
                Priority
              </Label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={cn(
                  "flex h-8 sm:h-10 w-full rounded-md border border-input bg-background px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm",
                  "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                  "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                )}
                disabled={isSubmitting || success}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-2 sm:pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || success}
              className="h-8 sm:h-10 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success} className="h-8 sm:h-10 text-xs sm:text-sm">
              {isSubmitting ? "Creating..." : success ? "Created!" : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
