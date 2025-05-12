"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BillingAddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (success: boolean, address?: any) => void
  initialAddress?: any
}

export function BillingAddressDialog({ open, onOpenChange, onComplete, initialAddress }: BillingAddressDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState(initialAddress?.name || "")
  const [line1, setLine1] = useState(initialAddress?.line1 || "")
  const [line2, setLine2] = useState(initialAddress?.line2 || "")
  const [city, setCity] = useState(initialAddress?.city || "")
  const [state, setState] = useState(initialAddress?.state || "")
  const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || "")
  const [country, setCountry] = useState(initialAddress?.country || "US")

  const handleSubmit = () => {
    setLoading(true)
    setError(null)

    // Validate form
    if (!name || !line1 || !city || !state || !postalCode || !country) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Success - return the address
      onComplete(true, {
        name,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
      })
      setLoading(false)
      resetForm()
    }, 1000)
  }

  const resetForm = () => {
    if (!initialAddress) {
      setName("")
      setLine1("")
      setLine2("")
      setCity("")
      setState("")
      setPostalCode("")
      setCountry("US")
    }
    setError(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) resetForm()
      }}
    >
      <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialAddress ? "Update Billing Address" : "Add Billing Address"}</DialogTitle>
          <DialogDescription>
            {initialAddress ? "Update your billing address information." : "Add a new billing address to your account."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="line1">Address Line 1</Label>
            <Input id="line1" placeholder="123 Main St" value={line1} onChange={(e) => setLine1(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="line2">Address Line 2 (Optional)</Label>
            <Input id="line2" placeholder="Apt 4B" value={line2} onChange={(e) => setLine2(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="San Francisco" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State / Province</Label>
              <Input id="state" placeholder="CA" value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="94103"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialAddress ? "Update Address" : "Add Address"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
