"use client"

import { useReducer } from "react"
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
import { Loader2, CreditCard, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (success: boolean, paymentMethod?: any) => void
}

type PaymentFormState = {
  loading: boolean
  error: string | null
  cardFocus: string | null
  cardFlipped: boolean
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvc: string
  cardType: string
}

type PaymentFormAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CARD_FOCUS"; payload: string | null }
  | { type: "UPDATE_CARD_NUMBER"; payload: string }
  | { type: "UPDATE_CARD_NAME"; payload: string }
  | { type: "UPDATE_CARD_EXPIRY"; payload: string }
  | { type: "UPDATE_CARD_CVC"; payload: string }
  | { type: "RESET_FORM" }

const initialState: PaymentFormState = {
  loading: false,
  error: null,
  cardFocus: null,
  cardFlipped: false,
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvc: "",
  cardType: "unknown",
}

function paymentFormReducer(state: PaymentFormState, action: PaymentFormAction): PaymentFormState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_CARD_FOCUS":
      return {
        ...state,
        cardFocus: action.payload,
        cardFlipped: action.payload === "cvc",
      }
    case "UPDATE_CARD_NUMBER":
      const cardNumber = action.payload
      let cardType = "unknown"

      // Determine card type based on first digit
      if (cardNumber.startsWith("4")) {
        cardType = "visa"
      } else if (cardNumber.startsWith("5")) {
        cardType = "mastercard"
      } else if (cardNumber.startsWith("3")) {
        cardType = "amex"
      } else if (cardNumber.startsWith("6")) {
        cardType = "discover"
      }

      return { ...state, cardNumber, cardType }
    case "UPDATE_CARD_NAME":
      return { ...state, cardName: action.payload }
    case "UPDATE_CARD_EXPIRY":
      return { ...state, cardExpiry: action.payload }
    case "UPDATE_CARD_CVC":
      return { ...state, cardCvc: action.payload }
    case "RESET_FORM":
      return initialState
    default:
      return state
  }
}

export function PaymentMethodDialog({ open, onOpenChange, onComplete }: PaymentMethodDialogProps) {
  const [state, dispatch] = useReducer(paymentFormReducer, initialState)
  const { loading, error, cardFocus, cardFlipped, cardNumber, cardName, cardExpiry, cardCvc, cardType } = state

  const handleSubmit = async () => {
    // Batch state updates with a single dispatch
    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    // Validate form
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      dispatch({ type: "SET_ERROR", payload: "Please fill in all fields" })
      dispatch({ type: "SET_LOADING", payload: false })
      return
    }

    try {
      // Simulate API call with a promise instead of setTimeout
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (cardNumber === "4242424242424242") {
            resolve()
          } else {
            reject(new Error("Invalid card number. Please try again."))
          }
        }, 1500)
      })

      // Success - return the new payment method
      onComplete(true, {
        type: "card",
        brand: cardType,
        last4: cardNumber.slice(-4),
        expiry: cardExpiry,
        name: cardName,
        isDefault: true,
      })

      dispatch({ type: "RESET_FORM" })
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "An unexpected error occurred",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16)
    // Format as 4 groups of 4 digits
    const groups = []
    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.slice(i, i + 4))
    }
    return groups.join(" ")
  }

  const formatCardExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4)
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
    }
    return cleaned
  }

  const formatCardCvc = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 3)
  }

  const getCardTypeIcon = () => {
    switch (cardType) {
      case "visa":
        return <div className="text-blue-600 font-bold text-lg tracking-wider">VISA</div>
      case "mastercard":
        return <div className="text-red-500 font-bold text-lg">MC</div>
      case "amex":
        return <div className="text-blue-400 font-bold text-lg">AMEX</div>
      case "discover":
        return <div className="text-orange-500 font-bold text-lg">DISC</div>
      default:
        return <CreditCard className="h-6 w-6 text-gray-400" />
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) dispatch({ type: "RESET_FORM" })
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account. Your payment information is securely stored.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Credit Card Preview */}
          <div className="perspective-1000 mx-auto w-full max-w-[360px] h-[200px] relative">
            <div
              className={cn(
                "w-full h-full transition-all duration-500 transform-style-preserve-3d relative rounded-xl shadow-lg",
                cardFlipped ? "rotate-y-180" : "",
              )}
            >
              {/* Front of card */}
              <div className="absolute w-full h-full backface-hidden rounded-xl p-6 flex flex-col justify-between bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      {getCardTypeIcon()}
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Credit Card</div>
                </div>

                <div className="space-y-6">
                  <div className="text-xl tracking-widest font-mono">
                    {cardNumber ? formatCardNumber(cardNumber) : "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-xs opacity-70">Card Holder</div>
                      <div className="font-medium uppercase tracking-wide">{cardName || "YOUR NAME"}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs opacity-70">Expires</div>
                      <div className="font-medium">{cardExpiry || "MM/YY"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute w-full h-full backface-hidden rounded-xl rotate-y-180 bg-gradient-to-br from-gray-800 to-gray-900 text-white overflow-hidden">
                <div className="w-full h-12 bg-black/30 mt-6"></div>
                <div className="p-6 pt-4">
                  <div className="flex justify-end items-center mb-4">
                    <div className="bg-white/80 text-gray-800 h-10 w-3/4 flex items-center justify-end pr-3 rounded">
                      <div className="font-mono">{cardCvc || "•••"}</div>
                    </div>
                  </div>
                  <div className="text-xs opacity-70 text-center mt-8">
                    For security, please enter the 3-digit code on the back of your card.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => dispatch({ type: "UPDATE_CARD_NUMBER", payload: e.target.value.replace(/\s/g, "") })}
                  onFocus={() => dispatch({ type: "SET_CARD_FOCUS", payload: "number" })}
                  onBlur={() => dispatch({ type: "SET_CARD_FOCUS", payload: null })}
                  className="pl-10 font-mono"
                />
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">For testing, use: 4242 4242 4242 4242</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => dispatch({ type: "UPDATE_CARD_NAME", payload: e.target.value })}
                onFocus={() => dispatch({ type: "SET_CARD_FOCUS", payload: "name" })}
                onBlur={() => dispatch({ type: "SET_CARD_FOCUS", payload: null })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cardExpiry">Expiry Date</Label>
                <Input
                  id="cardExpiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => dispatch({ type: "UPDATE_CARD_EXPIRY", payload: formatCardExpiry(e.target.value) })}
                  onFocus={() => dispatch({ type: "SET_CARD_FOCUS", payload: "expiry" })}
                  onBlur={() => dispatch({ type: "SET_CARD_FOCUS", payload: null })}
                  className="font-mono"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cardCvc">CVC</Label>
                <Input
                  id="cardCvc"
                  placeholder="123"
                  value={cardCvc}
                  onChange={(e) => dispatch({ type: "UPDATE_CARD_CVC", payload: formatCardCvc(e.target.value) })}
                  onFocus={() => dispatch({ type: "SET_CARD_FOCUS", payload: "cvc" })}
                  onBlur={() => dispatch({ type: "SET_CARD_FOCUS", payload: null })}
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Add Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
