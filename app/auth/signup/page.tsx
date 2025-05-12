"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  AlertCircle,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [termsError, setTermsError] = useState("")
  const [activeTab, setActiveTab] = useState("email")

  // Password strength requirements
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const passwordStrength = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar].filter(Boolean).length

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Clear errors when inputs change
  useEffect(() => {
    if (name) setNameError("")
    if (email) setEmailError("")
    if (password) setPasswordError("")
    if (acceptTerms) setTermsError("")
  }, [name, email, password, acceptTerms])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    let hasError = false

    if (!name) {
      setNameError("Name is required")
      hasError = true
    }

    if (!email) {
      setEmailError("Email is required")
      hasError = true
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      hasError = true
    }

    if (!password) {
      setPasswordError("Password is required")
      hasError = true
    } else if (passwordStrength < 3) {
      setPasswordError("Password is too weak")
      hasError = true
    }

    if (!acceptTerms) {
      setTermsError("You must accept the terms and conditions")
      hasError = true
    }

    if (hasError) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create account
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      })

      // Redirect to login page
      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = async (provider: string) => {
    setIsLoading(true)

    try {
      // In a real app, this would redirect to the OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: `${provider} signup initiated`,
        description: `Redirecting to ${provider} for authentication...`,
      })

      // Simulate redirect delay
      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      toast({
        title: "Signup failed",
        description: `Could not connect to ${provider}. Please try again.`,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
        <p className="text-muted-foreground">Sign up to get started with DeviceManager</p>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="email" className="text-sm">
            Email
          </TabsTrigger>
          <TabsTrigger value="social" className="text-sm">
            Social Signup
          </TabsTrigger>
        </TabsList>

        <div>
          <div key={activeTab}>
            <TabsContent value="email" className="mt-0 space-y-4">
              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Full name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={cn(
                          "pl-10 transition-all duration-200",
                          nameError ? "border-red-500 focus-visible:ring-red-500" : "",
                        )}
                        autoComplete="name"
                        disabled={isLoading}
                      />
                    </div>
                    {nameError && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {nameError}
                      </p>
                    )}
                  </div>

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
                        disabled={isLoading}
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
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
                          password && passwordStrength >= 4 ? "border-green-500 focus-visible:ring-green-500" : "",
                        )}
                        autoComplete="new-password"
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

                    {/* Password strength indicator */}
                    {password && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">Password strength:</span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              passwordStrength < 3
                                ? "text-red-500"
                                : passwordStrength < 4
                                  ? "text-amber-500"
                                  : "text-green-500",
                            )}
                          >
                            {passwordStrength < 3 ? "Weak" : passwordStrength < 4 ? "Medium" : "Strong"}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              passwordStrength < 3
                                ? "bg-red-500"
                                : passwordStrength < 4
                                  ? "bg-amber-500"
                                  : "bg-green-500",
                            )}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <ul className="space-y-1 mt-2">
                          <li className="text-xs flex items-center">
                            {hasMinLength ? (
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                            )}
                            <span className={hasMinLength ? "text-green-500" : "text-muted-foreground"}>
                              At least 8 characters
                            </span>
                          </li>
                          <li className="text-xs flex items-center">
                            {hasUppercase ? (
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                            )}
                            <span className={hasUppercase ? "text-green-500" : "text-muted-foreground"}>
                              Uppercase letter (A-Z)
                            </span>
                          </li>
                          <li className="text-xs flex items-center">
                            {hasLowercase ? (
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                            )}
                            <span className={hasLowercase ? "text-green-500" : "text-muted-foreground"}>
                              Lowercase letter (a-z)
                            </span>
                          </li>
                          <li className="text-xs flex items-center">
                            {hasNumber ? (
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                            )}
                            <span className={hasNumber ? "text-green-500" : "text-muted-foreground"}>Number (0-9)</span>
                          </li>
                          <li className="text-xs flex items-center">
                            {hasSpecialChar ? (
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                            )}
                            <span className={hasSpecialChar ? "text-green-500" : "text-muted-foreground"}>
                              Special character (!@#$%^&*)
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                        disabled={isLoading}
                        className={cn(termsError ? "border-red-500 data-[state=checked]:bg-red-500" : "")}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I accept the{" "}
                          <Link href="#" className="text-green-500 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="#" className="text-green-500 hover:underline">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                    {termsError && (
                      <p className="text-red-500 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" /> {termsError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group bg-green-500 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create account
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="social" className="mt-0">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create an account using your social profile
                </p>

                <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 h-11 relative overflow-hidden group"
                    onClick={() => handleSocialSignup("Google")}
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
                    <span className="font-medium">Sign up with Google</span>
                  </Button>
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 h-11 relative overflow-hidden group"
                    onClick={() => handleSocialSignup("Microsoft")}
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
                    <span className="font-medium">Sign up with Microsoft</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-green-500 font-medium hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
