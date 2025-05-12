"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [otpError, setOtpError] = useState("")
  const [activeTab, setActiveTab] = useState("email")

  // Enhanced email validation with more comprehensive checks
  const validateEmail = (email: string): boolean => {
    // Basic format check
    const basicFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!basicFormatRegex.test(email)) return false

    // Additional security checks
    // Check length
    if (email.length > 254) return false

    // Check for dangerous characters
    const dangerousChars = /[<>()[\]\\,;:"\s]/
    if (dangerousChars.test(email)) return false

    // Check local part and domain part separately
    const [localPart, domainPart] = email.split("@")

    // Local part checks
    if (localPart.length > 64) return false

    // Domain part checks
    if (!domainPart.includes(".")) return false

    const domainLabels = domainPart.split(".")
    for (const label of domainLabels) {
      if (label.length === 0 || label.length > 63) return false
      if (!/^[a-zA-Z0-9-]+$/.test(label)) return false
      if (label.startsWith("-") || label.endsWith("-")) return false
    }

    return true
  }

  // Password strength validation
  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (!password) {
      return { valid: false, message: "Password is required" }
    }

    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters" }
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return { valid: false, message: "Password must contain at least one number" }
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: "Password must contain at least one uppercase letter" }
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: "Password must contain at least one special character" }
    }

    return { valid: true, message: "" }
  }

  // Clear errors when inputs change
  useEffect(() => {
    if (email) setEmailError("")
    if (password) setPasswordError("")
    if (otp) setOtpError("")
  }, [email, password, otp])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset previous errors
    setEmailError("")
    setPasswordError("")

    // Validate inputs with enhanced validation
    if (!email) {
      setEmailError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }

    // Use the new password validation
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message)
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to verify credentials
      // Simulate network request with proper error handling
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // For demo purposes, we'll always resolve
          // In a real app, this would validate credentials against a backend
          resolve()
        }, 1500)
      })

      // Implement rate limiting for login attempts (simulated)
      const loginAttempts = Number.parseInt(sessionStorage.getItem(`loginAttempts_${email}`) || "0")
      if (loginAttempts > 5) {
        throw new Error("Too many login attempts. Please try again later.")
      }
      sessionStorage.setItem(`loginAttempts_${email}`, (loginAttempts + 1).toString())

      // Simulate successful login
      toast({
        title: "Verification successful",
        description: "Redirecting to 2FA verification...",
      })

      // Use a more secure approach for passing email to 2FA page
      // In a real app, you would store this in a secure HTTP-only cookie or server session
      sessionStorage.setItem("pendingAuthEmail", email)

      // Redirect to 2FA page without exposing email in URL
      router.push(`/auth/2fa`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password. Please try again."

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })

      // Log the error (in a real app, this would go to a monitoring service)
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
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
      // In a real app, this would be an API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOtpSent(true)
      toast({
        title: "OTP sent",
        description: `A one-time PIN has been sent to ${email}`,
      })
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please check your email address and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset previous errors
    setOtpError("")

    // Validate OTP with enhanced validation
    if (!otp) {
      setOtpError("Please enter the verification code")
      return
    }

    if (otp.length !== 6) {
      setOtpError("Please enter all 6 digits")
      return
    }

    // Ensure OTP contains only digits
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Verification code must contain only digits")
      return
    }

    setIsLoading(true)

    try {
      // Implement rate limiting for OTP attempts (simulated)
      const otpAttempts = Number.parseInt(sessionStorage.getItem(`otpAttempts_${email}`) || "0")
      if (otpAttempts > 3) {
        throw new Error("Too many verification attempts. Please request a new code.")
      }
      sessionStorage.setItem(`otpAttempts_${email}`, (otpAttempts + 1).toString())

      // In a real app, this would be an API call to verify OTP with proper CSRF protection
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // For demo purposes, accept any 6-digit code
          // In a real app, this would validate the OTP against a backend
          resolve()
        }, 1500)
      })

      // Clear login attempt counters on successful login
      sessionStorage.removeItem(`loginAttempts_${email}`)
      sessionStorage.removeItem(`otpAttempts_${email}`)
      sessionStorage.removeItem("pendingAuthEmail")

      toast({
        title: "Login successful",
        description: "Welcome back to DeviceManager!",
      })

      // Redirect to dashboard
      router.push("/")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid verification code. Please try again."

      setOtpError(errorMessage)
      toast({
        title: "Invalid OTP",
        description: errorMessage,
        variant: "destructive",
      })

      // Log the error (in a real app, this would go to a monitoring service)
      console.error("OTP verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would redirect to the OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: `${provider} login initiated`,
        description: `Redirecting to ${provider} for authentication...`,
      })

      // Simulate redirect delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      toast({
        title: "Login failed",
        description: `Could not connect to ${provider}. Please try again.`,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
        <p className="text-muted-foreground">Log in to your account to continue</p>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="text-sm">
            Email
          </TabsTrigger>
          <TabsTrigger value="social" className="text-sm">
            Social Login
          </TabsTrigger>
        </TabsList>

        <div>
          <div key={activeTab}>
            <TabsContent value="email" className="mt-0 space-y-4">
              <form
                onSubmit={loginMethod === "password" ? handlePasswordLogin : otpSent ? handleVerifyOTP : handleSendOTP}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center justify-between">
                      Email address
                      {email && validateEmail(email) && (
                        <span className="text-green-500 flex items-center text-xs">
                          <Check className="h-3 w-3 mr-1" /> Valid email
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
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          "pl-10 transition-all duration-200",
                          emailError ? "border-red-500 focus-visible:ring-red-500" : "",
                          email && validateEmail(email) ? "border-green-500 focus-visible:ring-green-500" : "",
                        )}
                        autoComplete="email"
                        disabled={isLoading || otpSent}
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {emailError}
                      </p>
                    )}
                  </div>

                  {loginMethod === "password" ? (
                    <div key="password" className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <Link href="/auth/reset-password" className="text-xs text-green-500 hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={cn(
                            "pl-10 pr-10 transition-all duration-200",
                            passwordError ? "border-red-500 focus-visible:ring-red-500" : "",
                          )}
                          autoComplete="current-password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" /> {passwordError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        className="w-full relative overflow-hidden group bg-green-500 hover:bg-green-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Log in
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <button
                          type="button"
                          onClick={() => setLoginMethod("otp")}
                          className="text-xs text-green-500 hover:underline transition-colors"
                        >
                          Log in with a one-time PIN instead
                        </button>
                      </div>
                    </div>
                  ) : otpSent ? (
                    <div key="otp" className="space-y-2">
                      <Label htmlFor="otp" className="text-sm font-medium">
                        Enter the 6-digit PIN sent to your email
                      </Label>
                      <div className="relative">
                        <Input
                          id="otp"
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, "")
                            if (value.length <= 6) setOtp(value)
                          }}
                          className={cn(
                            "text-center tracking-widest text-lg font-medium transition-all duration-200",
                            otpError ? "border-red-500 focus-visible:ring-red-500" : "",
                          )}
                          maxLength={6}
                          disabled={isLoading}
                        />
                      </div>
                      {otpError && (
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" /> {otpError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        className="w-full relative overflow-hidden group bg-green-500 hover:bg-green-600"
                        disabled={isLoading || otp.length !== 6}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Verify PIN
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>

                      <div className="flex justify-between mt-4 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false)
                            setLoginMethod("password")
                            setOtp("")
                          }}
                          className="text-green-500 hover:underline transition-colors"
                        >
                          Use password instead
                        </button>

                        <button
                          type="button"
                          onClick={handleSendOTP}
                          className="text-green-500 hover:underline transition-colors"
                          disabled={isLoading}
                        >
                          Resend PIN
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div key="send-otp" className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        We'll send a one-time PIN to your email address for secure login.
                      </p>
                      <Button
                        type="submit"
                        className="w-full relative overflow-hidden group bg-green-500 hover:bg-green-600"
                        disabled={isLoading || !email || !validateEmail(email)}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending PIN...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Send one-time PIN
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <button
                          type="button"
                          onClick={() => setLoginMethod("password")}
                          className="text-xs text-green-500 hover:underline transition-colors"
                        >
                          Log in with password instead
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </TabsContent>

            <TabsContent value="social" className="mt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Continue with your social account for faster login
                </p>

                <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 h-11 relative overflow-hidden group"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-0 group-hover:w-full group-hover:opacity-10 transition-all duration-300"></div>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="font-medium">Continue with Google</span>
                  </Button>
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 h-11 relative overflow-hidden group"
                    onClick={() => handleSocialLogin("Microsoft")}
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-[#05a6f0] to-[#ffba08] opacity-0 group-hover:w-full group-hover:opacity-10 transition-all duration-300"></div>
                    <svg width="20" height="20" viewBox="0 0 23 23">
                      <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    <span className="font-medium">Continue with Microsoft</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-green-500 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
