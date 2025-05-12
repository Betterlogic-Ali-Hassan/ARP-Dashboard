"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, ArrowRight, AlertCircle, ShieldCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function TwoFactorAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [codeError, setCodeError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Clear error when typing
    if (codeError) setCodeError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key down for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setVerificationCode(digits)

      // Focus the last input
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    const code = verificationCode.join("")

    if (code.length !== 6) {
      setCodeError("Please enter all 6 digits")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to verify the code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Verification successful",
        description: "You have been logged in successfully.",
      })

      // Redirect to dashboard
      router.push("/")
    } catch (error) {
      setCodeError("Invalid verification code. Please try again.")
      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect or has expired.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to resend the code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset timer
      setTimeLeft(300)

      // Clear inputs
      setVerificationCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()

      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <ShieldCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Two-factor authentication</h1>
        <p className="text-muted-foreground">
          {email ? (
            <>
              We sent a verification code to <span className="font-medium">{email}</span>
            </>
          ) : (
            <>Enter the verification code sent to your email</>
          )}
        </p>
      </div>

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Verification code</label>
            <span className={cn("text-xs font-medium", timeLeft <= 60 ? "text-red-500" : "text-muted-foreground")}>
              {timeLeft > 0 ? `Expires in ${formatTime(timeLeft)}` : "Code expired"}
            </span>
          </div>

          <div className="flex gap-2 justify-center">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={cn(
                  "w-12 h-12 text-center text-lg font-medium p-0",
                  codeError ? "border-red-500 focus-visible:ring-red-500" : "",
                )}
                disabled={isLoading || timeLeft <= 0}
              />
            ))}
          </div>

          {codeError && (
            <p className="text-red-500 text-xs flex items-center mt-1 justify-center">
              <AlertCircle className="h-3 w-3 mr-1" /> {codeError}
            </p>
          )}
        </div>

        <div>
          {timeLeft > 0 ? (
            <div key="verify">
              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={isLoading || verificationCode.join("").length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Verify and continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          ) : (
            <div key="resend">
              <Button
                type="button"
                onClick={handleResendCode}
                className="w-full"
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend verification code
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>

        {timeLeft > 0 && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              className="text-xs text-green-500 hover:underline transition-colors"
              disabled={isLoading}
            >
              Didn't receive a code? Resend
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
        <h3 className="text-sm font-medium mb-2">Security tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Never share your verification code with anyone</li>
          <li>• Our team will never ask for your verification code</li>
          <li>• Make sure you're on the correct website before entering your code</li>
        </ul>
      </div>
    </div>
  )
}
