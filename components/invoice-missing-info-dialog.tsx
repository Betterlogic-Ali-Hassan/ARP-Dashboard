"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface InvoiceMissingInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateBillingInfo: () => void
}

export function InvoiceMissingInfoDialog({ open, onOpenChange, onUpdateBillingInfo }: InvoiceMissingInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span>Billing Information Required</span>
          </DialogTitle>
          <DialogDescription>
            We need your complete billing information to generate an invoice. Please update your billing address to
            continue.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your invoice will include your billing address details. This information is required for tax and legal
            purposes.
          </p>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={onUpdateBillingInfo} className="w-full sm:w-auto">
            Update Billing Information
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
