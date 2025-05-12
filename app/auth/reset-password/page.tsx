"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Loader2, ArrowRight, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!email) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to send reset link
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Reset link sent",
        description: "Check your email for instructions to reset your password.",
      })
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      {!isSubmitted ? (
        <div key="request-form">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Reset your password</h1>
            <p className="text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center justify-between">
                Email address
                {email && validateEmail(email) && (
                  <span className="text-green-500 flex items-center text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" /> Valid email
                  </span>
                )}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) setEmailError("")
                  }}
                  className={cn(
                    "pl-10 transition-all duration-200",
                    emailError ? "border-red-500 focus-visible:ring-red-500" : "",
                    email && validateEmail(email) ? "border-green-500 focus-visible:ring-green-500" : "",
                  )}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" /> {emailError}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Send reset link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-green-500 font-medium hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <div key="success" className="text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We've sent a password reset link to <span className="font-medium">{email}</span>
          </p>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The link will expire in 10 minutes. If you don't see the email, check your spam folder.
            </p>

            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={() => setIsSubmitted(false)} className="transition-all duration-300">
                Try another email address
              </Button>

              <Link href="/auth/login" className="inline-block">
                <Button variant="ghost" className="w-full transition-all duration-300">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
