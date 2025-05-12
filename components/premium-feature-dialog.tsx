"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  Crown,
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  LockIcon,
  Mail,
  AlertCircle,
  Users,
  BuildingIcon as Buildings,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  PLANS,
  type PlanType,
  type BillingPeriodType,
  getYearlyDiscountPercentage,
} from "@/lib/plan-utils";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PremiumFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  isLoggedIn?: boolean; // Added prop to check if user is logged in
}

type SubscriptionStep = "plan-selection" | "email-collection" | "plan-summary";

export function PremiumFeatureDialog({
  open,
  onOpenChange,
  featureName,
  isLoggedIn = false, // Default to not logged in
}: PremiumFeatureDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriodType>("monthly");
  const [currentStep, setCurrentStep] =
    useState<SubscriptionStep>("plan-selection");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Use media query hook to detect screen size
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 768px)");

  // Get discount percentage from the shared utility
  const discountPercentage = getYearlyDiscountPercentage("individual");

  // Helper function to get the appropriate price based on billing period
  const getPlanPrice = (plan: PlanType, period: BillingPeriodType) => {
    return period === "monthly"
      ? PLANS[plan].pricing.monthly
      : PLANS[plan].pricing.yearly;
  };

  // Helper function to get monthly equivalent price for yearly plans
  const getMonthlyEquivalent = (plan: PlanType) => {
    return PLANS[plan].pricing.yearlyPerMonth;
  };

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle subscription button click
  const handleSubscribe = (plan: PlanType) => {
    setSelectedPlan(plan);

    // If Individual plan is selected and user is not logged in, show email collection step
    if (plan === "individual" && !isLoggedIn) {
      setCurrentStep("email-collection");
    } else {
      // Otherwise, go directly to plan summary
      setCurrentStep("plan-summary");
    }
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user types
    if (emailError) setEmailError("");
  };

  // Handle next button click in email collection step
  const handleEmailNext = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Email is valid, proceed to plan summary
    setCurrentStep("plan-summary");
  };

  // Handle back button click
  const handleBack = () => {
    // If we're in the email collection step, go back to plan selection
    if (currentStep === "email-collection") {
      setCurrentStep("plan-selection");
    }
    // If we're in the plan summary step and we came from email collection, go back to that
    else if (
      currentStep === "plan-summary" &&
      selectedPlan === "individual" &&
      !isLoggedIn
    ) {
      setCurrentStep("email-collection");
    }
    // Otherwise go back to plan selection
    else {
      setCurrentStep("plan-selection");
    }
  };

  // Handle confirm payment
  const handleConfirmPayment = () => {
    // In a real implementation, this would redirect to Stripe
    console.log(`Redirecting to Stripe for ${selectedPlan} plan payment...`);
    // For demo purposes, we'll just close the dialog
    onOpenChange(false);
  };

  // Reset to first step when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentStep("plan-selection");
      setSelectedPlan(null);
      setEmail("");
      setEmailError("");
    }
  }, [open]);

  // Render the plan selection step
  const renderPlanSelection = () => {
    return (
      <>
        <div className='flex flex-col items-center mb-4 sm:mb-6'>
          <div className='inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1'>
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all ${
                billingPeriod === "monthly"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Yearly
              {billingPeriod === "yearly" ? (
                <span className='absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full font-medium'>
                  -{discountPercentage}%
                </span>
              ) : (
                <span className='absolute -top-2 -right-2 bg-green-100 text-green-700 text-xs px-1 py-0.5 rounded-full font-medium dark:bg-green-900 dark:text-green-300'>
                  -{discountPercentage}%
                </span>
              )}
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 sm:mb-6'>
          {/* Individual Plan */}
          <div
            className={`border rounded-lg overflow-hidden transition-all ${
              selectedPlan === "individual"
                ? "ring-2 ring-emerald-600 dark:ring-emerald-400"
                : "hover:border-emerald-200 dark:hover:border-emerald-800"
            }`}
          >
            <div className='bg-white dark:bg-gray-800 p-4 sm:p-5'>
              <div className='flex items-center mb-2'>
                <Crown className='h-5 w-5 mr-2' style={{ color: "#059669" }} />
                <h3 className='font-bold text-base sm:text-lg'>
                  {PLANS.individual.name}
                </h3>
              </div>
              <div className='text-xl sm:text-2xl font-bold mb-1'>
                {getPlanPrice("individual", billingPeriod)}
                <span className='text-xs sm:text-sm font-normal text-muted-foreground'>
                  {billingPeriod === "monthly" ? "/month" : "/year"}
                </span>
                {billingPeriod === "yearly" && (
                  <div className='text-xs sm:text-sm font-normal text-green-600 dark:text-green-400'>
                    {getMonthlyEquivalent("individual")}/mo equivalent
                  </div>
                )}
              </div>
              <p className='text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4'>
                Perfect for personal use
              </p>

              <ul className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4'>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.individual.color.badgeText}`}
                  />
                  <span>Full access to all premium features</span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.individual.color.badgeText}`}
                  />
                  <span>Support within 4 business days</span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.individual.color.badgeText}`}
                  />
                  <span>Manage up to 3 devices</span>
                </li>
              </ul>

              <Button
                variant='default'
                className={`w-full ${PLANS.individual.color.primary} text-white hover:${PLANS.individual.color.hover}`}
                onClick={() => handleSubscribe("individual")}
              >
                <CreditCard className='mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4' />
                Subscribe
              </Button>
            </div>
          </div>

          {/* Team Plan */}
          <div
            className={`border rounded-lg overflow-hidden transition-all ${
              selectedPlan === "team"
                ? "ring-2 ring-amber-500 dark:ring-amber-400"
                : "hover:border-amber-200 dark:hover:border-amber-800"
            }`}
          >
            <div className='relative'>
              <div className='absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-bl-lg'>
                POPULAR
              </div>
            </div>
            <div className='bg-gradient-to-b from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-5'>
              <div className='flex items-center mb-2'>
                <Users className='h-5 w-5 mr-2' style={{ color: "#F59E0B" }} />
                <h3 className='font-bold text-base sm:text-lg'>
                  {PLANS.team.name}
                </h3>
              </div>
              <div className='text-xl sm:text-2xl font-bold mb-1'>
                {getPlanPrice("team", billingPeriod)}
                <span className='text-xs sm:text-sm font-normal text-muted-foreground'>
                  {billingPeriod === "monthly" ? "/month" : "/year"}
                </span>
                {billingPeriod === "yearly" && (
                  <div className='text-xs sm:text-sm font-normal text-green-600 dark:text-green-400'>
                    {getMonthlyEquivalent("team")}/mo equivalent
                  </div>
                )}
              </div>
              <p className='text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4'>
                Great for small teams
              </p>

              <ul className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4'>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.team.color.badgeText}`}
                  />
                  <span>Full access to all premium features</span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.team.color.badgeText}`}
                  />
                  <span>Support within 3 business days</span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.team.color.badgeText}`}
                  />
                  <span>Manage up to 10 devices</span>
                </li>
              </ul>

              <Button
                variant='default'
                className={`w-full ${PLANS.team.color.primary} text-white hover:${PLANS.team.color.hover}`}
                onClick={() => handleSubscribe("team")}
              >
                <CreditCard className='mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4' />
                Subscribe
              </Button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div
            className={`border rounded-lg overflow-hidden transition-all ${
              selectedPlan === "enterprise"
                ? "ring-2 ring-purple-600 dark:ring-purple-400"
                : "hover:border-purple-200 dark:hover:border-purple-800"
            } sm:col-span-2 lg:col-span-1`}
          >
            <div className='bg-white dark:bg-gray-800 p-4 sm:p-5'>
              <div className='flex items-center mb-2'>
                <Buildings className='h-5 w-5 mr-2 text-purple-500' />
                <h3 className='font-bold text-base sm:text-lg'>
                  {PLANS.enterprise.name}
                </h3>
              </div>
              <div className='text-xl sm:text-2xl font-bold mb-1'>
                {getPlanPrice("enterprise", billingPeriod)}
                <span className='text-xs sm:text-sm font-normal text-muted-foreground'>
                  {billingPeriod === "monthly" ? "/month" : "/year"}
                </span>
                {billingPeriod === "yearly" && (
                  <div className='text-xs sm:text-sm font-normal text-green-600 dark:text-green-400'>
                    {getMonthlyEquivalent("enterprise")}/mo equivalent
                  </div>
                )}
              </div>
              <p className='text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4'>
                For larger organizations
              </p>

              <ul className='space-y-1.5 sm:space-y-2 text-xs sm:text-sm mb-3 sm:mb-4'>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.enterprise.color.badgeText}`}
                  />
                  <span>Full access to all premium features</span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.enterprise.color.badgeText}`}
                  />
                  <span>Priority support within 1 business day</span>
                </li>
                <li className='flex items-start'>
                  <Check
                    className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 ${PLANS.enterprise.color.badgeText}`}
                  />
                  <span>Manage up to 100 devices</span>
                </li>
              </ul>

              <Button
                variant='default'
                className={`w-full ${PLANS.enterprise.color.primary} text-white hover:${PLANS.enterprise.color.hover}`}
                onClick={() => handleSubscribe("enterprise")}
              >
                <CreditCard className='mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4' />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-center p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800'>
          <ShieldCheck className='h-4 sm:h-5 w-4 sm:w-5 text-green-600 dark:text-green-400 mr-1.5 sm:mr-2 flex-shrink-0' />
          <p className='text-xs sm:text-sm font-medium text-green-800 dark:text-green-300'>
            All plans include a 14 days refund policy. Cancel anytime.
          </p>
        </div>
      </>
    );
  };

  // Render the email collection step
  const renderEmailCollection = () => {
    if (!selectedPlan) return null;

    const planColor = PLANS[selectedPlan].color;
    const planPrice = getPlanPrice(selectedPlan, billingPeriod);
    const planName = PLANS[selectedPlan].name;

    return (
      <div className='py-2'>
        <button
          onClick={handleBack}
          className='flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 sm:mb-6'
        >
          <ArrowLeft className='h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1' />
          Back to plans
        </button>

        <div className='text-center mb-4 sm:mb-6'>
          <div className='mx-auto bg-emerald-100 dark:bg-emerald-800 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4'>
            <Mail className='h-5 sm:h-6 w-5 sm:w-6 text-emerald-600 dark:text-emerald-300' />
          </div>
          <h3 className='text-lg sm:text-xl font-bold mb-1 sm:mb-2'>
            Almost there!
          </h3>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
            Enter your email address to continue with your {planName} plan
            subscription.
          </p>
        </div>

        <div className='border rounded-lg overflow-hidden mb-4 sm:mb-6 shadow-sm'>
          <div
            className={`p-3 sm:p-4 border-b bg-emerald-50 dark:bg-emerald-900/20`}
          >
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
              <div className='mb-2 sm:mb-0'>
                <h4
                  className={`font-bold text-sm sm:text-base text-emerald-800 dark:text-emerald-300`}
                >
                  {planName} Plan
                </h4>
                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  {billingPeriod === "monthly" ? "Monthly" : "Annual"} billing
                </p>
              </div>
              <div className='sm:text-right'>
                <div
                  className={`text-lg sm:text-xl font-bold text-emerald-800 dark:text-emerald-300`}
                >
                  {planPrice}
                </div>
                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  {billingPeriod === "monthly" ? "per month" : "per year"}
                </p>
              </div>
            </div>
          </div>

          <div className='p-4 sm:p-6 bg-gradient-to-b from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20'>
            <div className='relative mb-4 sm:mb-6'>
              <label
                htmlFor='email'
                className='block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-emerald-700 dark:text-emerald-300'
              >
                Email address
              </label>
              <div className='relative'>
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter your email address'
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete='email'
                  className={`pl-9 sm:pl-10 border-2 focus:ring-2 focus:ring-offset-1 text-sm ${
                    emailError
                      ? "border-red-300 focus:border-red-400 focus:ring-red-200 dark:border-red-700 dark:focus:border-red-600"
                      : "border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 dark:border-emerald-800 dark:focus:border-emerald-600"
                  }`}
                />
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 sm:h-4 w-3.5 sm:w-4 text-emerald-500 dark:text-emerald-400' />
              </div>
              {emailError && (
                <div className='flex items-center mt-1.5 sm:mt-2 text-red-500 text-xs sm:text-sm'>
                  <AlertCircle className='h-3 sm:h-3.5 w-3 sm:w-3.5 mr-1' />
                  {emailError}
                </div>
              )}
            </div>

            <div className='bg-blue-50 dark:bg-blue-900/30 p-3 sm:p-4 rounded-md mb-2 border-l-4 border-blue-400 dark:border-blue-600 shadow-sm'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <ShieldCheck className='h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400' />
                </div>
                <div className='ml-2 sm:ml-3'>
                  <p className='text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium'>
                    We will register your subscription under this email. Don't
                    worry, you won't lose your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          className={`w-full ${planColor.primary} text-white hover:${planColor.hover} py-2 sm:py-2.5 text-sm`}
          onClick={handleEmailNext}
        >
          Next <ArrowRight className='ml-1 h-4 w-4' />
        </Button>
      </div>
    );
  };

  // Render the plan summary step
  const renderPlanSummary = () => {
    if (!selectedPlan) return null;

    const planColor = PLANS[selectedPlan].color;
    const planPrice = getPlanPrice(selectedPlan, billingPeriod);
    const planName = PLANS[selectedPlan].name;

    // Get plan-specific background colors
    const getBgColor = () => {
      switch (selectedPlan) {
        case "individual":
          return "bg-emerald-50 dark:bg-emerald-900/20";
        case "team":
          return "bg-amber-50 dark:bg-amber-900/20";
        case "enterprise":
          return "bg-purple-50 dark:bg-purple-900/20";
        default:
          return "bg-gray-50 dark:bg-gray-800";
      }
    };

    // Get plan-specific text colors
    const getTextColor = () => {
      switch (selectedPlan) {
        case "individual":
          return "text-emerald-800 dark:text-emerald-300";
        case "team":
          return "text-amber-800 dark:text-amber-300";
        case "enterprise":
          return "text-purple-800 dark:text-purple-300";
        default:
          return "text-gray-800 dark:text-gray-300";
      }
    };

    return (
      <div className='py-2'>
        <button
          onClick={handleBack}
          className='flex items-center text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 sm:mb-6'
        >
          <ArrowLeft className='h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1' />
          Back
        </button>

        <div className='text-center mb-4 sm:mb-6'>
          <h3 className='text-lg sm:text-xl font-bold mb-1 sm:mb-2'>
            Plan Change Summary
          </h3>
          <p className='text-xs sm:text-sm text-gray-500 dark:text-gray-400'>
            Review your subscription details before proceeding to payment
          </p>
        </div>

        <div className='border rounded-lg overflow-hidden mb-4 sm:mb-6 shadow-sm'>
          <div className={`p-3 sm:p-4 border-b ${getBgColor()}`}>
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
              <div className='mb-2 sm:mb-0'>
                <h4
                  className={`font-bold text-sm sm:text-base ${getTextColor()}`}
                >
                  {planName} Plan
                </h4>
                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  {billingPeriod === "monthly" ? "Monthly" : "Annual"} billing
                </p>
              </div>
              <div className='sm:text-right'>
                <div
                  className={`text-lg sm:text-xl font-bold ${getTextColor()}`}
                >
                  {planPrice}
                </div>
                <p className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                  {billingPeriod === "monthly" ? "per month" : "per year"}
                </p>
              </div>
            </div>
          </div>

          <div className='p-3 sm:p-4 bg-white dark:bg-gray-800'>
            <h5 className='font-medium text-sm mb-2'>Plan includes:</h5>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm mb-3 sm:mb-4'>
              {PLANS[selectedPlan].features
                .slice(0, 4)
                .map((feature, index) => (
                  <div key={index} className='flex items-start'>
                    <Check
                      className={`h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0 ${planColor.badgeText}`}
                    />
                    <span className='text-xs sm:text-sm'>{feature}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Show email information if it was collected */}
        {selectedPlan === "individual" && !isLoggedIn && email && (
          <div className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6'>
            <div className='flex items-center'>
              <div className='bg-blue-100 dark:bg-blue-800/50 rounded-full p-1.5 mr-3'>
                <Mail className='h-3.5 sm:h-4 w-3.5 sm:w-4 text-blue-600 dark:text-blue-300' />
              </div>
              <div>
                <h5 className='text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 mb-0.5'>
                  Account Information
                </h5>
                <p className='text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400'>
                  {email}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6'>
          <div className='flex justify-between items-center mb-1.5 sm:mb-2'>
            <span className='text-xs sm:text-sm'>Subtotal</span>
            <span className='text-xs sm:text-sm font-medium'>{planPrice}</span>
          </div>

          {billingPeriod === "yearly" && (
            <div className='flex justify-between items-center mb-1.5 sm:mb-2'>
              <span className='text-xs sm:text-sm text-green-600 dark:text-green-400'>
                Annual discount
              </span>
              <span className='text-xs sm:text-sm font-medium text-green-600 dark:text-green-400'>
                -{discountPercentage}%
              </span>
            </div>
          )}

          <div className='border-t my-1.5 sm:my-2 pt-1.5 sm:pt-2'>
            <div className='flex justify-between items-center'>
              <span className='font-medium text-sm sm:text-base'>
                Total due today
              </span>
              <span className='font-bold text-base sm:text-lg'>
                {planPrice}
              </span>
            </div>
          </div>
        </div>

        <div className='bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-start'>
            <div className='flex-shrink-0 mb-2 sm:mb-0 sm:mr-3 flex items-center justify-center sm:justify-start'>
              <LockIcon className='h-4 sm:h-5 w-4 sm:w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div className='flex-grow'>
              <div className='flex flex-wrap items-center mb-1.5 sm:mb-2'>
                <h5 className='font-medium text-xs sm:text-sm text-blue-800 dark:text-blue-300 mr-1.5 sm:mr-2'>
                  Secure Payment Processing by
                </h5>
                <div className='bg-[#635BFF] text-white px-1.5 sm:px-2 py-0.5 rounded text-xs sm:text-sm font-bold'>
                  stripe
                </div>
              </div>
              <p className='text-xs sm:text-sm text-blue-700 dark:text-blue-400'>
                Payments securely processed by{" "}
                <span className='font-semibold'>Stripe</span>. No card data
                stored on our servers.
              </p>
            </div>
          </div>
        </div>

        <div className='sticky bottom-0 pt-4 pb-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto'>
          <Button
            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-5 text-sm sm:text-base'
            onClick={handleConfirmPayment}
          >
            <LockIcon className='h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2' />
            Confirm & Pay {planPrice}
          </Button>

          <p className='text-[10px] sm:text-xs text-center text-gray-500 dark:text-gray-400 mt-3 sm:mt-4'>
            By confirming, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[calc(100%-2rem)] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] p-0 overflow-x-hidden max-sm:max-h-[600px] max-sm:overflow-y-auto'>
        {currentStep === "plan-selection" && (
          <div className='bg-gradient-to-b from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 p-4 sm:p-6 text-center'>
            <div className='mx-auto bg-amber-200 dark:bg-amber-700 rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center mb-3 sm:mb-4'>
              <Crown className='h-5 sm:h-6 w-5 sm:w-6 text-amber-600 dark:text-amber-200' />
            </div>
            <DialogTitle className='text-lg sm:text-2xl font-bold mb-1 sm:mb-2'>
              Unlock Premium Features
            </DialogTitle>
            <DialogDescription className='text-sm sm:text-base max-w-md mx-auto'>
              <span className='font-medium text-amber-700 dark:text-amber-300'>
                {featureName}
              </span>{" "}
              is a premium feature. Upgrade to access all premium tools and
              enhance your experience.
            </DialogDescription>
          </div>
        )}

        <div className='p-4 sm:p-6 sm:overflow-y-auto sm:max-h-[750px] relative'>
          {currentStep === "plan-selection"
            ? renderPlanSelection()
            : currentStep === "email-collection"
            ? renderEmailCollection()
            : renderPlanSummary()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
