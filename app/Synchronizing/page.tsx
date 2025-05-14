"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/sidebar";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Server,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Check,
  AlertTriangle,
  LogOut,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PLANS } from "@/lib/plan-utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function SynchronizingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [syncMode, setSyncMode] = useState<string>("primary");
  const [syncKey, setSyncKey] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "success" | "waiting" | "error"
  >("idle");
  const [progress, setProgress] = useState<number>(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deviceName, setDeviceName] = useState<string>("");
  const [deviceNameError, setDeviceNameError] = useState<string>("");
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [deviceLimitReached, setDeviceLimitReached] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<
    "basic" | "individual" | "team" | "enterprise"
  >("team");

  // OTP related states
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpResendDisabled, setOtpResendDisabled] = useState(false);
  const [otpResendCountdown, setOtpResendCountdown] = useState(0);

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  // Logged in state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalDevices, setTotalDevices] = useState(5);
  const [totalProfiles, setTotalProfiles] = useState(2);

  // Logout dialog state
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [logoutConfirmed, setLogoutConfirmed] = useState(false);
  const [disconnectAllDevices, setDisconnectAllDevices] = useState(false);

  // Format sync key as user types
  const formatSyncKey = (input: string) => {
    // Remove any non-alphanumeric characters
    const cleaned = input.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    // Format with dashes
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 5 === 0 && i < 25) {
        formatted += "-";
      }
      if (i < 25) {
        formatted += cleaned[i];
      }
    }

    return formatted;
  };

  // Handle sync key input
  const handleSyncKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSyncKey(e.target.value);
    setSyncKey(formatted);
  };

  // Validate device name
  const validateDeviceName = (name: string): boolean => {
    if (!name || name.trim().length === 0) {
      setDeviceNameError("Device name is required");
      return false;
    }

    if (name.length < 3) {
      setDeviceNameError("Device name must be at least 3 characters");
      return false;
    }

    if (name.length > 30) {
      setDeviceNameError("Device name must be less than 30 characters");
      return false;
    }

    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      setDeviceNameError(
        "Device name can only contain letters, numbers, spaces, hyphens, and underscores"
      );
      return false;
    }

    setDeviceNameError("");
    return true;
  };

  // Handle sync process with animated progress
  const handleSync = () => {
    // Reset device limit warning state
    setDeviceLimitReached(false);

    // Check for the special device limit key
    if (syncKey === "AP349-SCI2Q-H6DO2-NPHBS-916H3") {
      setDeviceLimitReached(true);
      return;
    }

    // Validate device name first
    if (!validateDeviceName(deviceName)) {
      toast({
        title: "Invalid device name",
        description: deviceNameError,
        variant: "destructive",
      });
      return;
    }

    if (syncKey.length < 29) {
      // 5 groups of 5 chars + 4 dashes = 29
      toast({
        title: "Invalid sync key",
        description:
          "Please enter a complete sync key in the format XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    setProgress(0);

    // Animate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      clearInterval(interval);
      setProgress(100);

      if (syncKey === "AP349-SCI2Q-H6DO2-NPHBS-916H2") {
        setSyncStatus("success");
        toast({
          title: "Synchronization successful",
          description:
            "Your device has been successfully synchronized with the Default Profile",
          variant: "default",
        });
      } else if (syncKey === "AP349-SCI2Q-H6DO2-NPHBS-916H1") {
        setSyncStatus("waiting");
        toast({
          title: "Awaiting profile assignment",
          description:
            "Your device is waiting for a settings profile to be assigned",
          variant: "default",
        });
      } else {
        setSyncStatus("error");
        toast({
          title: "Synchronization failed",
          description: "The sync key you entered is invalid or has expired",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  // Handle device unlinking
  const handleUnlinkDevice = () => {
    // In a real app, this would make an API call to unlink the device
    toast({
      title: "Device unlinked",
      description: "This device has been disconnected from your account",
      variant: "default",
    });

    // Reset the sync status and form
    setSyncStatus("idle");
    setSyncKey("");
    setDeviceName("");
  };

  // Handle primary device authentication - Step 1: Email/Password
  const handlePrimaryAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Basic validation
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    // Show loading state
    setIsLoggingIn(true);

    try {
      // Simulate API call to verify credentials
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset loading state
      setIsLoggingIn(false);

      // Show OTP verification screen
      setShowOtpVerification(true);

      // Show toast for OTP sent
      toast({
        title: "Verification code sent",
        description: "A one-time password has been sent to your email",
        variant: "default",
      });

      // Start countdown for resend button
      setOtpResendDisabled(true);
      setOtpResendCountdown(30);
      const countdownInterval = setInterval(() => {
        setOtpResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setOtpResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setIsLoggingIn(false);
      toast({
        title: "Authentication failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle OTP verification - Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    if (!otp) {
      setOtpError("Please enter the verification code");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("Verification code must be 6 digits");
      return;
    }

    if (!/^\d+$/.test(otp)) {
      setOtpError("Verification code must contain only digits");
      return;
    }

    setIsLoggingIn(true);

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Check if OTP is correct (111111 for success, anything else for failure)
          if (otp === "111111") {
            resolve(true);
          } else {
            reject(new Error("Invalid verification code"));
          }
        }, 1500);
      });

      // Reset states
      setIsLoggingIn(false);
      setShowOtpVerification(false);
      setOtp("");

      // Set logged in state
      setIsLoggedIn(true);

      // Show success toast
      toast({
        title: "Authentication successful",
        description: "You are now logged in as the Primary Device",
        variant: "default",
      });
    } catch (error) {
      setIsLoggingIn(false);
      setOtpError("Invalid verification code. Please try again.");

      toast({
        title: "Verification failed",
        description: "The code you entered is incorrect or has expired",
        variant: "destructive",
      });
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (otpResendDisabled) return;

    setIsLoggingIn(true);

    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsLoggingIn(false);
      setOtp("");
      setOtpError("");

      // Start countdown for resend button
      setOtpResendDisabled(true);
      setOtpResendCountdown(30);
      const countdownInterval = setInterval(() => {
        setOtpResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setOtpResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Verification code resent",
        description: "A new verification code has been sent to your email",
        variant: "default",
      });
    } catch (error) {
      setIsLoggingIn(false);
      toast({
        title: "Failed to resend code",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  // Handle back to login from OTP screen
  const handleBackToLogin = () => {
    setShowOtpVerification(false);
    setOtp("");
    setOtpError("");
  };

  // Handle sign up form submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setFullNameError("");
    setEmailError("");
    setPasswordError("");
    setTermsError("");

    // Basic validation
    let hasError = false;

    if (!fullName) {
      setFullNameError("Full name is required");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    }

    if (!termsAccepted) {
      setTermsError("You must accept the Terms of Service and Privacy Policy");
      hasError = true;
    }

    if (hasError) return;

    // Show loading state
    setIsLoggingIn(true);

    // Simulate sign-up process
    setTimeout(() => {
      setIsLoggingIn(false);

      // Show success toast
      toast({
        title: "Account created successfully",
        description: "You are now logged in as the Primary Device",
        variant: "default",
      });

      // Set logged in state
      setIsLoggedIn(true);
    }, 1500);
  };

  // Handle logout
  const handleLogout = () => {
    // Reset logout dialog state
    setLogoutConfirmed(false);
    setDisconnectAllDevices(false);

    // Open logout dialog
    setLogoutDialogOpen(true);
  };

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    // Close the dialog
    setLogoutDialogOpen(false);

    // Perform logout actions
    setIsLoggedIn(false);

    // Show toast based on disconnect choice
    if (disconnectAllDevices) {
      toast({
        title: "Logged out successfully",
        description: "All slave devices have been disconnected from cloud sync",
        variant: "default",
      });
    } else {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out as the Primary Device",
        variant: "default",
      });
    }

    // Reset form fields
    setEmail("");
    setPassword("");
    setFullName("");
    setTermsAccepted(false);
    setIsSignUp(false);
  };

  return (
    <div className='flex min-h-screen'>
      <div className='flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-background'>
        <div className='w-full max-w-4xl mx-auto'>
          {/* Page header */}
          <div className='mb-10 text-center '>
            <h1 className='text-4xl font-bold tracking-tight mb-3 max-md:ml-[52px]'>
              Device Synchronization
            </h1>
            <p className='text-muted-foreground max-w-lg mx-auto'>
              Connect and synchronize your devices to share settings and
              preferences across your account
            </p>
          </div>

          {/* Decorative elements */}
          <div className='absolute top-20 right-20 -z-10 hidden lg:block'>
            <div className='h-24 w-24 rounded-full bg-primary/5 blur-xl'></div>
          </div>
          <div className='absolute bottom-20 left-20 -z-10 hidden lg:block'>
            <div className='h-32 w-32 rounded-full bg-primary/5 blur-xl'></div>
          </div>

          {/* Device type selection */}
          <div className='mb-8'>
            <Tabs
              value={syncMode}
              onValueChange={setSyncMode}
              className='w-full max-w-[40rem] mx-auto'
            >
              {/* Only show the tabs when not logged in and not synced */}
              {!isLoggedIn &&
                syncStatus !== "success" &&
                syncStatus !== "waiting" && (
                  <TabsList className='grid w-full grid-cols-2 mb-8'>
                    <TabsTrigger
                      value='primary'
                      className='data-[state=active]:bg-btn data-[state=active]:text-text'
                    >
                      <Server className='mr-2 h-4 w-4' />
                      Primary Device
                    </TabsTrigger>
                    <TabsTrigger
                      value='secondary'
                      className='data-[state=active]:bg-btn data-[state=active]:text-text'
                    >
                      <Laptop className='mr-2 h-4 w-4' />
                      Secondary Device
                    </TabsTrigger>
                  </TabsList>
                )}

              {/* Always show the content of the selected tab */}
              <TabsContent value='primary' className='space-y-4'>
                {isLoggedIn ? (
                  <Card className='border-primary/20'>
                    <CardContent className='pt-6'>
                      <div className='text-center mb-6'>
                        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4'>
                          <Server className='h-8 w-8 text-primary' />
                        </div>
                        <h2 className='text-2xl font-bold mb-2'>
                          You are logged in as the Primary Device
                        </h2>
                        <p className='text-muted-foreground'>
                          Total{" "}
                          <span className='font-semibold'>
                            {totalDevices} devices
                          </span>{" "}
                          attached to your account under{" "}
                          <span className='font-semibold'>
                            {totalProfiles} profiles
                          </span>
                        </p>
                      </div>

                      <div className='flex justify-center'>
                        <Button
                          variant='outline'
                          className='border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/30 text-red-600 dark:text-red-500 hover:text-red-700'
                          onClick={handleLogout}
                        >
                          <LogOut className='mr-2 h-4 w-4' />
                          Logout
                        </Button>
                      </div>

                      <div className='mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md p-4'>
                        <h4 className='font-medium text-blue-800 dark:text-blue-400 mb-2 flex items-center'>
                          <CheckCircle2 className='h-4 w-4 mr-2' />
                          Primary Device Status
                        </h4>
                        <ul className='space-y-2 text-sm text-blue-700 dark:text-blue-300'>
                          <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                              Your settings are being synchronized to all
                              connected devices
                            </span>
                          </li>
                          <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                              You can manage all connected devices from the
                              Devices page
                            </span>
                          </li>
                          <li className='flex items-start'>
                            <span className='mr-2'>•</span>
                            <span>
                              Any changes you make will automatically sync to
                              secondary devices
                            </span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className='border-primary/20'>
                    <CardHeader>
                      <CardTitle className='flex items-center'>
                        <Server className='mr-2 h-5 w-5 text-primary' />
                        {showOtpVerification
                          ? "Two-Factor Authentication"
                          : isSignUp
                          ? "Create Your Account"
                          : "Primary Device Setup"}
                      </CardTitle>
                      <CardDescription>
                        {showOtpVerification
                          ? "Enter the verification code sent to your email"
                          : isSignUp
                          ? "Sign up to create your account and start synchronizing your devices"
                          : "Set up this device as your primary device to manage your devices and settings"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showOtpVerification ? (
                        // OTP Verification Form
                        <form onSubmit={handleVerifyOtp} className='space-y-4'>
                          <div className='space-y-2'>
                            <div className='flex justify-center mb-4'>
                              <div className='rounded-full bg-primary/10 p-3'>
                                <Shield className='h-8 w-8 text-primary' />
                              </div>
                            </div>

                            <Label
                              htmlFor='otp'
                              className='text-sm font-medium'
                            >
                              Verification Code
                            </Label>
                            <Input
                              id='otp'
                              type='text'
                              inputMode='numeric'
                              placeholder='Enter 6-digit code'
                              value={otp}
                              onChange={(e) => {
                                // Only allow digits and max 6 characters
                                const value = e.target.value.replace(/\D/g, "");
                                if (value.length <= 6) setOtp(value);
                              }}
                              className={cn(
                                "text-center text-lg tracking-widest font-mono",
                                otpError
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              )}
                              disabled={isLoggingIn}
                              maxLength={6}
                            />
                            {otpError && (
                              <p className='text-red-500 text-xs flex items-center mt-1'>
                                <AlertCircle className='h-3 w-3 mr-1' />{" "}
                                {otpError}
                              </p>
                            )}
                            <p className='text-xs text-muted-foreground text-center mt-1'>
                              We've sent a verification code to {email}
                            </p>
                          </div>

                          <Button
                            type='submit'
                            className='w-full'
                            disabled={isLoggingIn || otp.length !== 6}
                          >
                            {isLoggingIn ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <ArrowRight className='mr-2 h-4 w-4' />
                                Verify and continue
                              </>
                            )}
                          </Button>

                          <div className='flex justify-between items-center text-xs'>
                            <button
                              type='button'
                              onClick={handleBackToLogin}
                              className='text-primary hover:underline'
                              disabled={isLoggingIn}
                            >
                              Back to login
                            </button>
                            <button
                              type='button'
                              onClick={handleResendOtp}
                              className={cn(
                                "text-primary hover:underline",
                                otpResendDisabled &&
                                  "text-muted-foreground cursor-not-allowed hover:no-underline"
                              )}
                              disabled={isLoggingIn || otpResendDisabled}
                            >
                              {otpResendDisabled
                                ? `Resend code (${otpResendCountdown}s)`
                                : "Resend code"}
                            </button>
                          </div>

                          <div className='mt-4 p-3 bg-muted/50 rounded-lg border border-border'>
                            <h3 className='text-sm font-medium mb-2'>
                              Security tips
                            </h3>
                            <ul className='text-xs text-muted-foreground space-y-1'>
                              <li>
                                • Never share your verification code with anyone
                              </li>
                              <li>
                                • Our team will never ask for your verification
                                code
                              </li>
                              <li>
                                • Make sure you're on the correct website before
                                entering your code
                              </li>
                            </ul>
                          </div>
                        </form>
                      ) : (
                        // Email/Password Login or Signup Form
                        <form
                          onSubmit={isSignUp ? handleSignUp : handlePrimaryAuth}
                          className='space-y-4'
                        >
                          {isSignUp && (
                            <div className='space-y-2'>
                              <Label
                                htmlFor='fullName'
                                className='text-sm font-medium'
                              >
                                Full Name
                              </Label>
                              <div className='relative'>
                                <Input
                                  id='fullName'
                                  type='text'
                                  placeholder='John Doe'
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className={cn(
                                    "transition-all duration-200",
                                    fullNameError
                                      ? "border-red-500 focus-visible:ring-red-500"
                                      : ""
                                  )}
                                  autoComplete='name'
                                  disabled={isLoggingIn}
                                />
                              </div>
                              {fullNameError && (
                                <p className='text-red-500 text-xs flex items-center mt-1'>
                                  <AlertCircle className='h-3 w-3 mr-1' />{" "}
                                  {fullNameError}
                                </p>
                              )}
                            </div>
                          )}

                          <div className='space-y-2'>
                            <Label
                              htmlFor='email'
                              className='text-sm font-medium flex items-center justify-between'
                            >
                              Email address
                              {email &&
                                !/^\s*$/.test(email) &&
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ===
                                  false && (
                                  <span className='text-green-500 flex items-center text-xs'>
                                    <Check className='h-3 w-3 mr-1' /> Valid
                                    email
                                  </span>
                                )}
                            </Label>
                            <div className='relative'>
                              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                              <Input
                                id='email'
                                type='email'
                                placeholder='name@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={cn(
                                  "pl-10 transition-all duration-200",
                                  emailError
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : "",
                                  email &&
                                    !/^\s*$/.test(email) &&
                                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                      email
                                    ) === false
                                    ? "border-green-500 focus-visible:ring-green-500"
                                    : ""
                                )}
                                autoComplete='email'
                                disabled={isLoggingIn}
                              />
                            </div>
                            {emailError && (
                              <p className='text-red-500 text-xs flex items-center mt-1'>
                                <AlertCircle className='h-3 w-3 mr-1' />{" "}
                                {emailError}
                              </p>
                            )}
                          </div>

                          <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                              <Label
                                htmlFor='password'
                                className='text-sm font-medium'
                              >
                                Password
                              </Label>
                              {!isSignUp && (
                                <a
                                  href='/auth/reset-password'
                                  className='text-xs text-primary hover:underline'
                                >
                                  Forgot password?
                                </a>
                              )}
                            </div>
                            <div className='relative'>
                              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                              <Input
                                id='password'
                                type={showPassword ? "text" : "password"}
                                placeholder={
                                  isSignUp ? "Create a password" : "••••••••"
                                }
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={cn(
                                  "pl-10 pr-10 transition-all duration-200",
                                  passwordError
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                                )}
                                autoComplete={
                                  isSignUp ? "new-password" : "current-password"
                                }
                                disabled={isLoggingIn}
                              />
                              <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                                disabled={isLoggingIn}
                              >
                                {showPassword ? (
                                  <EyeOff className='h-4 w-4' />
                                ) : (
                                  <Eye className='h-4 w-4' />
                                )}
                              </button>
                            </div>
                            {passwordError && (
                              <p className='text-red-500 text-xs flex items-center mt-1'>
                                <AlertCircle className='h-3 w-3 mr-1' />{" "}
                                {passwordError}
                              </p>
                            )}
                          </div>

                          {isSignUp && (
                            <div className='space-y-2'>
                              <div className='flex items-start'>
                                <div className='flex items-center h-5 mt-0.5'>
                                  <input
                                    id='terms'
                                    type='checkbox'
                                    checked={termsAccepted}
                                    onChange={(e) =>
                                      setTermsAccepted(e.target.checked)
                                    }
                                    className={cn(
                                      "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                                      termsError ? "border-red-500" : ""
                                    )}
                                    disabled={isLoggingIn}
                                  />
                                </div>
                                <div className='ml-3 text-sm'>
                                  <label
                                    htmlFor='terms'
                                    className='text-muted-foreground'
                                  >
                                    I accept the{" "}
                                    <a
                                      href='#'
                                      className='text-primary hover:underline'
                                    >
                                      Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a
                                      href='#'
                                      className='text-primary hover:underline'
                                    >
                                      Privacy Policy
                                    </a>
                                  </label>
                                </div>
                              </div>
                              {termsError && (
                                <p className='text-red-500 text-xs flex items-center mt-1'>
                                  <AlertCircle className='h-3 w-3 mr-1' />{" "}
                                  {termsError}
                                </p>
                              )}
                            </div>
                          )}

                          <Button
                            type='submit'
                            className='w-full'
                            disabled={isLoggingIn}
                          >
                            {isLoggingIn ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                {isSignUp
                                  ? "Creating account..."
                                  : "Logging in..."}
                              </>
                            ) : (
                              <>
                                <ArrowRight className='mr-2 h-4 w-4' />
                                {isSignUp
                                  ? "Create account"
                                  : "Log in and continue"}
                              </>
                            )}
                          </Button>

                          <div className='relative mt-6'>
                            <div className='absolute inset-0 flex items-center'>
                              <span className='w-full border-t' />
                            </div>
                            <div className='relative flex justify-center text-xs uppercase'>
                              <span className='bg-background px-2 text-muted-foreground'>
                                {isSignUp ? "or sign up with" : "or login with"}
                              </span>
                            </div>
                          </div>

                          <div className='mt-4 space-y-2'>
                            <Button
                              type='button'
                              variant='outline'
                              className='w-full bg-background hover:bg-muted/50 border border-input hover:border-primary/50 transition-colors'
                              onClick={() => {
                                // Google login/signup logic would go here
                                toast({
                                  title: isSignUp
                                    ? "Google Sign Up"
                                    : "Google Login",
                                  description: `Google authentication would be triggered here for ${
                                    isSignUp ? "sign up" : "login"
                                  }`,
                                });
                              }}
                            >
                              <svg
                                className='mr-2 h-4 w-4'
                                aria-hidden='true'
                                focusable='false'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                  fill='#4285F4'
                                />
                                <path
                                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                  fill='#34A853'
                                />
                                <path
                                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                  fill='#FBBC05'
                                />
                                <path
                                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                  fill='#EA4335'
                                />
                              </svg>
                              {isSignUp
                                ? "Continue with Google"
                                : "Login with Google"}
                            </Button>

                            <Button
                              type='button'
                              variant='outline'
                              className='w-full bg-background hover:bg-muted/50 border border-input hover:border-primary/50 transition-colors'
                              onClick={() => {
                                // Microsoft login/signup logic would go here
                                toast({
                                  title: isSignUp
                                    ? "Microsoft Sign Up"
                                    : "Microsoft Login",
                                  description: `Microsoft authentication would be triggered here for ${
                                    isSignUp ? "sign up" : "login"
                                  }`,
                                });
                              }}
                            >
                              <svg
                                className='mr-2 h-4 w-4'
                                aria-hidden='true'
                                focusable='false'
                                viewBox='0 0 23 23'
                              >
                                <path fill='#f3f3f3' d='M0 0h23v23H0z' />
                                <path fill='#f35325' d='M1 1h10v10H1z' />
                                <path fill='#81bc06' d='M12 1h10v10H12z' />
                                <path fill='#05a6f0' d='M1 12h10v10H1z' />
                                <path fill='#ffba08' d='M12 12h10v10H12z' />
                              </svg>
                              {isSignUp
                                ? "Continue with Microsoft"
                                : "Login with Microsoft"}
                            </Button>
                          </div>

                          <div className='text-center text-sm text-muted-foreground'>
                            {isSignUp ? (
                              <>
                                Already have an account?{" "}
                                <button
                                  type='button'
                                  onClick={() => setIsSignUp(false)}
                                  className='text-primary hover:underline'
                                >
                                  Log in
                                </button>
                              </>
                            ) : (
                              <>
                                Don't have an account?{" "}
                                <button
                                  type='button'
                                  onClick={() => setIsSignUp(true)}
                                  className='text-primary hover:underline'
                                >
                                  Sign up
                                </button>
                              </>
                            )}
                          </div>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Help section for Primary Device */}
                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>
                      What is a Primary (Master) Device?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='text-sm text-muted-foreground space-y-2'>
                    <p>
                      The Primary Device is your main control device. It is
                      responsible for:
                    </p>
                    <p>• Creating and managing the settings profiles</p>
                    <p>
                      • Syncing those settings across all connected secondary
                      devices
                    </p>
                    <p>
                      • Making real-time updates that reflect automatically on
                      slave devices
                    </p>
                  </CardContent>
                  <CardFooter className='pt-0'>
                    <Button variant='link' className='px-0 text-primary'>
                      View synchronization guide
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value='secondary' className='space-y-4'>
                <Card className='border-primary/20'>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <Laptop className='mr-2 h-5 w-5 text-primary' />
                      Secondary Device Setup
                    </CardTitle>
                    <CardDescription>
                      Connect this device to your primary device using a sync
                      key
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-6'>
                      {/* Device Name Input */}
                      <div className='space-y-2'>
                        <Label
                          htmlFor='deviceName'
                          className='flex items-center justify-between'
                        >
                          Device Name
                          <span className='text-xs text-muted-foreground'>
                            {deviceName.length}/30
                          </span>
                        </Label>
                        <Input
                          id='deviceName'
                          value={deviceName}
                          onChange={(e) => {
                            setDeviceName(e.target.value);
                            if (deviceNameError)
                              validateDeviceName(e.target.value);
                          }}
                          placeholder='Enter a name for this device'
                          className={cn(
                            "transition-all duration-200",
                            deviceNameError
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          )}
                          disabled={
                            isSyncing ||
                            syncStatus === "success" ||
                            syncStatus === "waiting"
                          }
                        />
                        {deviceNameError ? (
                          <p className='text-red-500 text-xs flex items-center mt-1'>
                            <AlertCircle className='h-3 w-3 mr-1' />{" "}
                            {deviceNameError}
                          </p>
                        ) : (
                          <p className='text-xs text-muted-foreground'>
                            Choose a name that helps you identify this device
                            (e.g., "Work Laptop", "Home PC")
                          </p>
                        )}
                      </div>

                      {/* Existing Sync Key Input */}
                      <div className='space-y-2'>
                        <Label htmlFor='syncKey'>Enter Sync Key</Label>
                        <Input
                          id='syncKey'
                          value={syncKey}
                          onChange={handleSyncKeyChange}
                          placeholder='XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
                          className='text-center font-mono tracking-wider'
                          disabled={
                            isSyncing ||
                            syncStatus === "success" ||
                            syncStatus === "waiting"
                          }
                        />
                        <p className='text-xs text-muted-foreground text-center'>
                          Enter the sync key generated on your primary device
                        </p>
                      </div>

                      {syncStatus === "idle" && !isSyncing && (
                        <Button
                          onClick={handleSync}
                          className='w-full'
                          disabled={syncKey.length < 29}
                        >
                          Connect Device
                        </Button>
                      )}

                      {isSyncing && (
                        <div className='space-y-3'>
                          <Progress value={progress} className='h-2' />
                          <div className='flex items-center justify-center text-sm text-muted-foreground'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Synchronizing... {progress}%
                          </div>
                        </div>
                      )}

                      {deviceLimitReached && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='space-y-4'
                        >
                          <div className='flex items-center justify-center text-amber-500 dark:text-amber-400'>
                            <AlertTriangle className='h-12 w-12' />
                          </div>
                          <div className='p-5 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 rounded-lg shadow-sm'>
                            <div className='flex flex-col'>
                              <div className='mb-3 text-amber-600 dark:text-amber-400 font-medium text-center'>
                                Device Limit Reached
                              </div>
                              <div className='space-y-3'>
                                <p className='text-sm text-amber-800 dark:text-amber-300'>
                                  Your{" "}
                                  <strong>
                                    {PLANS[currentPlan].name} Plan
                                  </strong>{" "}
                                  has a limit of{" "}
                                  <strong>
                                    {PLANS[currentPlan].deviceLimit} devices
                                  </strong>
                                  , and you've reached this limit.
                                </p>
                                <div className='bg-amber-100 dark:bg-amber-900/50 rounded-md p-3'>
                                  <p className='text-sm font-medium text-amber-800 dark:text-amber-300 mb-2'>
                                    To add this device, you can:
                                  </p>
                                  <ul className='text-xs text-amber-700 dark:text-amber-400 space-y-2'>
                                    <li className='flex items-start'>
                                      <span className='mr-2'>•</span>
                                      <span>
                                        Remove inactive devices from your
                                        account
                                      </span>
                                    </li>
                                    <li className='flex items-start'>
                                      <span className='mr-2'>•</span>
                                      <span>
                                        Upgrade to the{" "}
                                        {currentPlan === "individual"
                                          ? "Team"
                                          : currentPlan === "team"
                                          ? "Enterprise"
                                          : "Enterprise"}{" "}
                                        Plan to increase your device limit
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant='outline'
                              className='w-full'
                              onClick={() => {
                                setSyncStatus("idle");
                                setSyncKey("");
                                setDeviceLimitReached(false);
                              }}
                            >
                              Try Different Key
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {syncStatus === "success" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='space-y-6'
                        >
                          {/* Success animation and header */}
                          <div className='relative'>
                            <div className='absolute inset-0 flex items-center justify-center'>
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                  delay: 0.2,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                                className='w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center'
                              >
                                <CheckCircle2 className='h-10 w-10 text-green-600 dark:text-green-400' />
                              </motion.div>
                            </div>
                            <div className='h-20'></div>
                          </div>

                          {/* Success message */}
                          <div className='text-center'>
                            <h3 className='text-xl font-medium text-green-700 dark:text-green-400 mb-2'>
                              Synchronization Complete
                            </h3>
                            <p className='text-muted-foreground'>
                              Your device "{deviceName}" is now connected to
                              your account
                            </p>
                          </div>

                          {/* Device details card */}
                          <div className='bg-card border rounded-lg p-4 shadow-sm'>
                            <div className='space-y-4'>
                              <div>
                                <div className='flex justify-between items-center mb-2'>
                                  <Label className='text-sm font-medium'>
                                    Device Name
                                  </Label>
                                  <Badge
                                    variant='outline'
                                    className='bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                  >
                                    Active
                                  </Badge>
                                </div>
                                <div className='bg-muted rounded-md px-3 py-2 font-medium'>
                                  {deviceName}
                                </div>
                              </div>

                              <div>
                                <div className='flex justify-between items-center mb-2'>
                                  <Label className='text-sm font-medium'>
                                    Settings Profile
                                  </Label>
                                  <span className='text-xs text-muted-foreground'>
                                    Default
                                  </span>
                                </div>
                                <div className='bg-muted rounded-md px-3 py-2 flex justify-between items-center'>
                                  <span>Default Profile</span>
                                  <Badge className='bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'>
                                    Applied
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Next steps */}
                          <div className='bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-md p-4'>
                            <h4 className='font-medium text-green-800 dark:text-green-400 mb-2 flex items-center'>
                              <CheckCircle2 className='h-4 w-4 mr-2' />
                              Next Steps
                            </h4>
                            <ul className='space-y-2 text-sm text-green-700 dark:text-green-300'>
                              <li className='flex items-start'>
                                <span className='mr-2'>•</span>
                                <span>
                                  Your settings are now being synchronized
                                </span>
                              </li>
                              <li className='flex items-start'>
                                <span className='mr-2'>•</span>
                                <span>
                                  Any changes made on your primary device will
                                  automatically apply here
                                </span>
                              </li>
                              <li className='flex items-start'>
                                <span className='mr-2'>•</span>
                                <span>
                                  You can manage this device from your primary
                                  device's dashboard
                                </span>
                              </li>
                            </ul>
                          </div>

                          <div className='flex justify-center mt-2'>
                            <Button
                              variant='outline'
                              className='border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 hover:text-red-700'
                              onClick={() => setUnlinkDialogOpen(true)}
                            >
                              Unlink this Device
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {syncStatus === "waiting" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='space-y-4'
                        >
                          <div className='p-5 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 rounded-lg shadow-sm'>
                            <div className='flex flex-col items-center'>
                              <div className='mb-3 text-amber-600 dark:text-amber-400 font-medium'>
                                Waiting for Profile Assignment
                              </div>
                              <div className='w-full bg-amber-100 dark:bg-amber-900/50 rounded-md p-3 mb-3'>
                                <div className='flex items-center'>
                                  <div className='relative mr-3'>
                                    <div className='w-2 h-2 bg-amber-500 rounded-full animate-ping absolute'></div>
                                    <div className='w-2 h-2 bg-amber-500 rounded-full'></div>
                                  </div>
                                  <p className='text-sm text-amber-800 dark:text-amber-300'>
                                    Your device is in queue for administrator
                                    approval
                                  </p>
                                </div>
                              </div>
                              <div className='text-xs text-amber-700 dark:text-amber-400 space-y-2 w-full'>
                                <p className='flex items-start'>
                                  <span className='mr-2'>•</span>
                                  <span>
                                    Your device has been registered successfully
                                  </span>
                                </p>
                                <p className='flex items-start'>
                                  <span className='mr-2'>•</span>
                                  <span>
                                    An administrator needs to assign a settings
                                    profile
                                  </span>
                                </p>
                                <p className='flex items-start'>
                                  <span className='mr-2'>•</span>
                                  <span>
                                    You'll receive a notification when your
                                    device is ready
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant='outline'
                            className='w-full'
                            onClick={() => {
                              setSyncStatus("idle");
                              setSyncKey("");
                            }}
                          >
                            Try Different Key
                          </Button>
                        </motion.div>
                      )}

                      {syncStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='space-y-4'
                        >
                          <div className='flex items-center justify-center text-red-600 dark:text-red-400'>
                            <AlertCircle className='h-12 w-12' />
                          </div>
                          <div className='p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md text-center text-red-800 dark:text-red-300'>
                            <p className='font-medium mb-1'>Invalid Sync Key</p>
                            <p className='text-sm'>
                              The sync key you entered is invalid or has
                              expired. Please check the key and try again.
                            </p>
                          </div>
                          <Button
                            variant='outline'
                            className='w-full'
                            onClick={() => {
                              setSyncStatus("idle");
                              setSyncKey("");
                            }}
                          >
                            Try Again
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Help section for Secondary Device */}
                <Card>
                  <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>
                      What is a Secondary (Slave) Device?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='text-sm text-muted-foreground space-y-2'>
                    <p>
                      The Secondary Device is a linked device that mirrors the
                      settings of the primary device. It:
                    </p>
                    <p>• Uses the Sync Key to connect to the primary device</p>
                    <p>
                      • Automatically receives all updates made on the master
                    </p>
                    <p>• Cannot make changes to the profile—it's read-only</p>
                  </CardContent>
                  <CardFooter className='pt-0'>
                    <Button variant='link' className='px-0 text-primary'>
                      View synchronization guide
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Unlink confirmation dialog */}
      <ConfirmDialog
        open={unlinkDialogOpen}
        onOpenChange={setUnlinkDialogOpen}
        title='Unlink Device'
        description="Are you sure you want to unlink this device? This will disconnect it from your account and remove all synchronized settings.\n\nYou'll need a new sync key to reconnect this device in the future."
        confirmLabel='Unlink Device'
        cancelLabel='Cancel'
        onConfirm={handleUnlinkDevice}
        variant='destructive'
      />

      {/* Logout confirmation dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription className='pt-2'>
              By signing out, your Auto Refresh Plus extension will be
              disconnected from the cloud sync system.
            </DialogDescription>
            <div className='text-sm text-muted-foreground mt-2'>
              The slave devices will no longer sync settings from your device,
              but the settings they already have will remain unchanged.
            </div>
          </DialogHeader>

          <div className='space-y-4 py-2'>
            <div className='flex items-start space-x-2'>
              <Checkbox
                id='logout-confirm'
                checked={logoutConfirmed}
                onCheckedChange={(checked) =>
                  setLogoutConfirmed(checked === true)
                }
              />
              <label
                htmlFor='logout-confirm'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                I understand and agree to logout
              </label>
            </div>

            <div className='flex items-start space-x-2'>
              <Checkbox
                id='disconnect-all'
                checked={disconnectAllDevices}
                onCheckedChange={(checked) =>
                  setDisconnectAllDevices(checked === true)
                }
              />
              <label
                htmlFor='disconnect-all'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Disconnect cloud sync for all slave devices
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleLogoutConfirm}
              disabled={!logoutConfirmed}
            >
              Confirm Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
