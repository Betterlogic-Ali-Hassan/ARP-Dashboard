"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Check,
  Crown,
  Users,
  BuildingIcon as Buildings,
  Gift,
  AlertTriangle,
  CreditCard,
  CalendarDays,
  MoveRight,
  Smartphone,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  PLANS,
  type PlanType,
  type BillingPeriodType,
  getYearlyDiscountPercentage,
} from "@/lib/plan-utils";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDeviceStore } from "@/lib/store";

interface PlanChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: PlanType;
  selectedPlan?: PlanType | null;
  billingPeriod?: BillingPeriodType;
  onComplete?: (success: boolean, newPlan: PlanType) => void;
  isNewSubscription?: boolean;
}

export function PlanChangeDialog({
  open,
  onOpenChange,
  currentPlan,
  selectedPlan: initialSelectedPlan = null,
  billingPeriod: initialBillingPeriod,
  onComplete,
  isNewSubscription = false,
}: PlanChangeDialogProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(
    initialSelectedPlan
  );
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<
    BillingPeriodType | undefined
  >(initialBillingPeriod);
  const [paymentMethod, setPaymentMethod] = useState({
    type: "card",
    last4: "4242",
    expiry: "04/25",
    brand: "visa",
  });

  // Get real-time device counts from the device store
  const { devices } = useDeviceStore();
  const activeDevices = devices.filter(
    (device) => device.status === "active"
  ).length;

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedPlan(initialSelectedPlan);
      setConfirmationStep(initialSelectedPlan !== null);
      setLoading(false);
      setError(null);
      setBillingPeriod(initialBillingPeriod);
    }
  }, [open, initialBillingPeriod, initialSelectedPlan]);

  const allPlans: PlanType[] = ["basic", "individual", "team", "enterprise"];

  const getPlanPrice = (plan: PlanType) => {
    if (plan === "basic") return "$0";

    if (billingPeriod === "yearly") {
      return `$${PLANS[plan].pricing.yearlyPerMonth
        .toString()
        .replace("$", "")}/mo`;
    } else {
      return `$${PLANS[plan].pricing.monthly.replace("$", "")}/mo`;
    }
  };

  const getPlanYearlyPrice = (plan: PlanType) => {
    if (plan === "basic") return "Free";

    if (billingPeriod === "yearly") {
      return `$${PLANS[plan].pricing.yearly.replace("$", "")}/year`;
    }
    return null;
  };

  const getPlanFeatures = (plan: PlanType) => {
    if (plan === "basic") {
      return [
        "Basic access with limited features",
        "Manage up to 3 devices",
        "Different settings profiles",
        "Access to support articles",
      ];
    } else if (plan === "individual") {
      return [
        "Full access to all premium features",
        "Manage up to 3 devices",
        "Different settings profiles",
        "Premium Support (4 business days)",
      ];
    } else if (plan === "team") {
      return [
        "Full access to all premium features",
        "Manage up to 10 devices",
        "Different settings profiles",
        "Premium Support (3 business days)",
        "Team collaboration features",
      ];
    } else {
      return [
        "Full access to all premium features",
        "Manage up to 100 devices",
        "Custom settings profiles",
        "Priority Support (1 business day)",
        "Team collaboration features",
        "Custom integrations",
      ];
    }
  };

  const isUpgrade = (plan: PlanType) => {
    const planOrder = { basic: 0, individual: 1, team: 2, enterprise: 3 };
    return planOrder[plan] > planOrder[currentPlan];
  };

  const isDowngrade = (plan: PlanType) => {
    const planOrder = { basic: 0, individual: 1, team: 2, enterprise: 3 };
    return planOrder[plan] < planOrder[currentPlan];
  };

  // Calculate if device limit is exceeded for downgrades - moved after isUpgrade is defined
  const isDeviceLimitExceeded =
    selectedPlan &&
    selectedPlan !== null &&
    !isUpgrade(selectedPlan) &&
    activeDevices > (selectedPlan ? PLANS[selectedPlan].deviceLimit : 0);

  const handleSelectPlan = (plan: PlanType) => {
    if (plan === currentPlan) return;

    setSelectedPlan(plan);
    setConfirmationStep(true);
  };

  const handleGoBack = () => {
    setConfirmationStep(false);
    setError(null);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;

    // Check if the user is trying to downgrade with too many devices
    if (
      !isUpgrade(selectedPlan) &&
      activeDevices > PLANS[selectedPlan].deviceLimit
    ) {
      setError(
        `You currently have ${activeDevices} devices. The ${
          PLANS[selectedPlan].name
        } Plan only allows ${
          PLANS[selectedPlan].deviceLimit
        } devices. Please remove ${
          activeDevices - PLANS[selectedPlan].deviceLimit
        } devices before downgrading.`
      );
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      if (onComplete) onComplete(true, selectedPlan);
      setLoading(false);
    }, 1500);
  };

  const renderBillingToggle = () => {
    return (
      <div className='flex items-center'>
        <div className='flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100/70 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30'>
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              billingPeriod === "monthly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              billingPeriod === "yearly"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-transparent"
            )}
          >
            Yearly
            <span className='ml-1 text-xs font-normal text-green-600 dark:text-green-400'>
              {getYearlyDiscountPercentage("individual") > 0
                ? `Save ${getYearlyDiscountPercentage("individual")}%`
                : ""}
            </span>
          </button>
        </div>
      </div>
    );
  };

  const renderPlanCard = (plan: PlanType) => {
    const isCurrentPlan = plan === currentPlan;
    const features = getPlanFeatures(plan);
    const planDetails = PLANS[plan];

    return (
      <div
        className={cn(
          "relative rounded-xl border transition-all duration-200 overflow-hidden",
          isCurrentPlan
            ? "border-2 border-blue-500 dark:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
        )}
      >
        {/* Current plan badge */}
        {isCurrentPlan && (
          <div className='absolute top-0 right-0'>
            <div className='bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-bl-lg'>
              Current Plan
            </div>
          </div>
        )}

        {/* Plan header */}
        <div
          className={cn(
            "p-5 border-b border-gray-100 dark:border-gray-800",
            plan === "basic"
              ? "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
              : plan === "individual"
              ? "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20"
              : plan === "team"
              ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20"
              : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
          )}
        >
          <div className='flex items-center mb-3'>
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center mr-3",
                plan === "basic"
                  ? "bg-blue-100 dark:bg-blue-900/50"
                  : plan === "individual"
                  ? "bg-emerald-100 dark:bg-emerald-900/50"
                  : plan === "team"
                  ? "bg-amber-100 dark:bg-amber-900/50"
                  : "bg-purple-100 dark:bg-purple-900/50"
              )}
            >
              {plan === "basic" && (
                <Gift className='h-5 w-5 text-blue-600 dark:text-blue-400' />
              )}
              {plan === "individual" && (
                <Crown className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
              )}
              {plan === "team" && (
                <Users className='h-5 w-5 text-amber-600 dark:text-amber-400' />
              )}
              {plan === "enterprise" && (
                <Buildings className='h-5 w-5 text-purple-600 dark:text-purple-400' />
              )}
            </div>
            <h3 className='text-lg font-bold'>{planDetails.name}</h3>
          </div>

          <div className='mb-2'>
            <span className='text-3xl font-bold'>{getPlanPrice(plan)}</span>
            {billingPeriod === "yearly" && plan !== "basic" && (
              <span className='text-sm text-gray-500 dark:text-gray-400 ml-1'>
                billed annually
              </span>
            )}
          </div>

          {billingPeriod === "yearly" && plan !== "basic" && (
            <div className='text-sm text-gray-600 dark:text-gray-400 mb-2'>
              {getPlanYearlyPrice(plan)}
            </div>
          )}

          {billingPeriod === "yearly" && plan !== "basic" && (
            <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-normal'>
              {`Save ${getYearlyDiscountPercentage(plan)}% with yearly billing`}
            </Badge>
          )}
        </div>

        {/* Plan features */}
        <div className='p-5'>
          <ul className='space-y-3'>
            {features.map((feature, index) => (
              <li key={index} className='flex items-start'>
                <Check
                  className={cn(
                    "h-5 w-5 mr-2 flex-shrink-0 mt-0.5",
                    plan === "basic"
                      ? "text-blue-500 dark:text-blue-400"
                      : plan === "individual"
                      ? "text-emerald-500 dark:text-emerald-400"
                      : plan === "team"
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-purple-500 dark:text-purple-400"
                  )}
                />
                <span className='text-sm'>{feature}</span>
              </li>
            ))}
          </ul>

          <div className='mt-6'>
            <Button
              onClick={() => handleSelectPlan(plan)}
              disabled={isCurrentPlan}
              className={cn(
                "w-full",
                isCurrentPlan
                  ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                  : isUpgrade(plan)
                  ? plan === "individual"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : plan === "team"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              )}
            >
              {isCurrentPlan ? "Current Plan" : "Switch to this plan"}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (!selectedPlan) return null;

    const planDetails = PLANS[selectedPlan];
    const isUpgrading = isUpgrade(selectedPlan);
    const currentPlanDetails = PLANS[currentPlan];

    return (
      <div className='space-y-4'>
        <div className='bg-white dark:bg-gray-900 rounded-xl overflow-hidden'>
          <div className='px-5 py-[5px] md:px-6 md:py-[5px] space-y-5'>
            {/* Plan summary card */}
            <div className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/70 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm'>
              <div className='p-5 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                  <div className='flex items-center mb-3 md:mb-0'>
                    <div
                      className={cn(
                        "h-12 w-12 rounded-full flex items-center justify-center mr-3",
                        selectedPlan === "basic"
                          ? "bg-blue-100 dark:bg-blue-900/50"
                          : selectedPlan === "individual"
                          ? "bg-emerald-100 dark:bg-emerald-900/50"
                          : selectedPlan === "team"
                          ? "bg-amber-100 dark:bg-amber-900/50"
                          : "bg-purple-100 dark:bg-purple-900/50"
                      )}
                    >
                      {selectedPlan === "basic" && (
                        <Gift className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                      )}
                      {selectedPlan === "individual" && (
                        <Crown className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                      )}
                      {selectedPlan === "team" && (
                        <Users className='h-6 w-6 text-amber-600 dark:text-amber-400' />
                      )}
                      {selectedPlan === "enterprise" && (
                        <Buildings className='h-6 w-6 text-purple-600 dark:text-purple-400' />
                      )}
                    </div>
                    <div>
                      <h4 className='text-lg font-bold'>
                        {planDetails.name} Plan
                      </h4>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {billingPeriod === "yearly"
                          ? "Billed annually"
                          : "Billed monthly"}
                      </p>
                    </div>
                  </div>
                  <div className='text-left md:text-right'>
                    <div className='text-2xl font-bold'>
                      {getPlanPrice(selectedPlan)}
                    </div>
                    {billingPeriod === "yearly" && selectedPlan !== "basic" && (
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {getPlanYearlyPrice(selectedPlan)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan change summary */}
            <div className='bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 p-3'>
              <h4 className='font-medium mb-2 text-lg'>Plan Change Summary</h4>

              <div className='flex flex-col md:flex-row items-center justify-between gap-2'>
                <div className='flex flex-col items-center text-center mb-3 md:mb-0'>
                  <div className='h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 border border-gray-200 dark:border-gray-700'>
                    {currentPlan === "basic" && (
                      <Gift className='h-7 w-7 text-blue-600 dark:text-blue-400' />
                    )}
                    {currentPlan === "individual" && (
                      <Crown className='h-7 w-7 text-emerald-600 dark:text-emerald-400' />
                    )}
                    {currentPlan === "team" && (
                      <Users className='h-7 w-7 text-amber-600 dark:text-amber-400' />
                    )}
                    {currentPlan === "enterprise" && (
                      <Buildings className='h-7 w-7 text-purple-600 dark:text-purple-400' />
                    )}
                  </div>
                  <p className='font-medium'>{currentPlanDetails.name} Plan</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Current plan
                  </p>
                </div>

                <div className='flex-1 flex justify-center items-center my-2 md:my-0 relative'>
                  <div className='h-0.5 w-full bg-gray-200 dark:bg-gray-700 absolute hidden md:block'></div>
                  <div className='md:hidden'>
                    <MoveRight className='h-6 w-6 text-gray-400 rotate-90 my-2' />
                  </div>
                  <div
                    className={cn(
                      "rounded-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 hidden md:flex",
                      isUpgrading ? "text-green-500" : "text-amber-500"
                    )}
                  >
                    <MoveRight className='h-6 w-6' />
                  </div>
                </div>

                <div className='flex flex-col items-center text-center'>
                  <div
                    className={cn(
                      "h-16 w-16 rounded-full flex items-center justify-center mb-2 border border-gray-200 dark:border-gray-700",
                      selectedPlan === "basic"
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : selectedPlan === "individual"
                        ? "bg-emerald-100 dark:bg-emerald-900/50"
                        : selectedPlan === "team"
                        ? "bg-amber-100 dark:bg-amber-900/50"
                        : "bg-purple-100 dark:bg-purple-900/50"
                    )}
                  >
                    {selectedPlan === "basic" && (
                      <Gift className='h-7 w-7 text-blue-600 dark:text-blue-400' />
                    )}
                    {selectedPlan === "individual" && (
                      <Crown className='h-7 w-7 text-emerald-600 dark:text-emerald-400' />
                    )}
                    {selectedPlan === "team" && (
                      <Users className='h-7 w-7 text-amber-600 dark:text-amber-400' />
                    )}
                    {selectedPlan === "enterprise" && (
                      <Buildings className='h-7 w-7 text-purple-600 dark:text-purple-400' />
                    )}
                  </div>
                  <p className='font-medium'>{planDetails.name} Plan</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    New plan
                  </p>
                </div>
              </div>

              {/* Warning for downgrades */}
              {!isUpgrading && (
                <Alert className='mt-4'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>
                    Your current plan will remain active until the end of your
                    billing period. You'll still have access to all features
                    until then.
                  </AlertDescription>
                </Alert>
              )}

              {/* Device count warning for downgrades */}
              {!isUpgrading &&
                activeDevices < PLANS[selectedPlan].deviceLimit && (
                  <div className='mt-4 rounded-md border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20 p-4'>
                    <div className='flex items-start'>
                      <AlertTriangle className='h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 mr-3' />
                      <div className='flex-1'>
                        <div className='text-sm font-medium text-red-800 dark:text-red-300'>
                          The Individual Plan allows 3 devices, but you have 7
                          devices registered. Please remove 4 devices to proceed
                          with downgrade.
                        </div>
                        <div className='mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                          <div className='text-xs text-red-600 dark:text-red-400'>
                            Remove 4 devices to proceed
                          </div>
                          <Button
                            size='sm'
                            onClick={() => (window.location.href = "/devices")}
                            className='bg-red-600 hover:bg-red-700 text-white text-xs h-8 dark:bg-red-700 dark:hover:bg-red-600 w-full sm:w-auto'
                          >
                            <Smartphone className='h-3.5 w-3.5 mr-1.5' />
                            Manage Devices
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Error message */}
              {error && isUpgrading && (
                <Alert variant='destructive' className='mt-4'>
                  <AlertDescription className='flex items-center'>
                    <AlertTriangle className='h-4 w-4 mr-2' />
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Billing details - only show for upgrades or paid plans (but not for downgrades) */}
            {isUpgrading && selectedPlan !== "basic" && (
              <div className='bg-white dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700 p-5'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2'>
                  <h4 className='font-medium text-lg'>Payment Details</h4>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full md:w-auto'
                  >
                    Change
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className='space-y-4'>
                    {selectedPlan !== "basic" && (
                      <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg space-y-4'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <div className='flex items-center'>
                            <CalendarDays className='h-4 w-4 mr-2 text-gray-500' />
                            <p className='text-sm font-medium mr-1'>
                              Billing Cycle:
                            </p>
                            <p className='text-sm font-medium'>
                              {billingPeriod === "yearly"
                                ? "Annual"
                                : "Monthly"}
                            </p>
                          </div>

                          {billingPeriod === "yearly" && (
                            <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-normal ml-1'>
                              {`${getYearlyDiscountPercentage(
                                selectedPlan
                              )}% savings`}
                            </Badge>
                          )}
                        </div>

                        <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                          <div className='flex items-center mb-1'>
                            <p className='text-sm font-medium'>
                              {isUpgrading
                                ? "Amount due today"
                                : "New plan price"}
                            </p>
                          </div>

                          {billingPeriod === "yearly" ? (
                            <>
                              <p className='text-xl font-bold'>
                                {getPlanYearlyPrice(selectedPlan)}
                              </p>
                              <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                (equivalent to {getPlanPrice(selectedPlan)} per
                                month)
                              </p>
                            </>
                          ) : (
                            <p className='text-xl font-bold'>
                              {getPlanPrice(selectedPlan)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg'>
                    <div className='flex items-center mb-3'>
                      <CreditCard className='h-4 w-4 mr-2 text-gray-500' />
                      <p className='text-sm font-medium'>Payment Method</p>
                      <span className='ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full flex items-center'>
                        <svg
                          className='h-3 w-3 mr-1'
                          viewBox='0 0 32 32'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fill='currentColor'
                            d='M15.48 14.67h-1.7c-.1 0-.19.07-.21.17l-.58 3.7a.13.13 0 0 0 .12.14h.8c.1 0 .19-.07.21-.17l.15-.99c.02-.1.11-.17.21-.17h.54c1 0 1.57-.48 1.73-1.44.07-.42.01-.75-.2-.98-.23-.25-.6-.26-1.07-.26zm.24 1.43c-.08.54-.5.54-.9.54h-.23l.16-1.02c.01-.06.07-.1.13-.1h.1c.27 0 .53 0 .66.16.08.1.1.23.08.42zm4.7-.03h-.8c-.07 0-.13.05-.14.12l-.04.25-.06-.09c-.18-.26-.59-.35-1-.35-.93 0-1.73.7-1.89 1.69-.08.49.03.96.31 1.29.25.3.62.42 1.05.42.74 0 1.16-.48 1.16-.48l-.04.23c-.01.08.04.16.13.16h.72c.1 0 .2-.08.21-.17l.4-2.57c.02-.08-.05-.16-.14-.16h.01zm-1.1 1.48c-.08.48-.47.8-.96.8-.25 0-.45-.08-.57-.23-.12-.14-.17-.35-.13-.58.08-.47.47-.8.95-.8.24 0 .44.08.57.22.12.15.17.36.13.59zm-8.19-1.48h-.8c-.08 0-.15.04-.2.1l-1.14 1.7-.49-1.63c-.03-.1-.12-.17-.23-.17h-.79c-.1 0-.17.1-.14.2l.92 2.7-.86 1.23c-.07.1 0 .24.12.24h.8c.08 0 .15-.04.2-.1l2.76-3.98c.07-.1 0-.24-.12-.24l-.03-.05z'
                          />
                          <path
                            fill='currentColor'
                            d='M22.9 10.5H9.1c-.83 0-1.5.67-1.5 1.5v8c0 .83.67 1.5 1.5 1.5h13.8c.83 0 1.5-.67 1.5-1.5v-8c0-.83-.67-1.5-1.5-1.5zm.5 9.5c0 .28-.22.5-.5.5H9.1c-.28 0-.5-.22-.5-.5v-8c0-.28.22-.5.5-.5h13.8c.28 0 .5.22.5.5v8z'
                          />
                        </svg>
                        Secure
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <div className='h-10 w-14 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold mr-3'>
                        VISA
                      </div>
                      <div>
                        <div className='font-medium text-sm'>
                          Visa ending in {paymentMethod.last4}
                        </div>
                        <div className='text-xs text-gray-500 dark:text-gray-400'>
                          Expires {paymentMethod.expiry}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto rounded-2xl p-0 w-[95vw] transition-all duration-300",
          confirmationStep ? "sm:max-w-[700px] mx-auto" : "sm:max-w-[1200px]"
        )}
      >
        <DialogHeader className='py-4 px-4 md:px-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
          {confirmationStep && selectedPlan ? (
            <>
              <DialogTitle className='text-xl md:text-2xl'>
                {isNewSubscription
                  ? `Subscribe to ${PLANS[selectedPlan].name} Plan`
                  : isUpgrade(selectedPlan)
                  ? `Upgrade to ${PLANS[selectedPlan].name} Plan`
                  : `Downgrade to ${PLANS[selectedPlan].name} Plan`}
              </DialogTitle>
              <DialogDescription>
                {isNewSubscription
                  ? "You're about to subscribe to a new plan. You'll be charged immediately."
                  : isUpgrade(selectedPlan)
                  ? "You're about to upgrade your subscription. You'll be charged immediately."
                  : "You're about to downgrade your subscription. Changes will take effect at the end of your current billing period."}
              </DialogDescription>
            </>
          ) : (
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-4 pr-10'>
              <div>
                <DialogTitle className='text-xl md:text-2xl'>
                  Choose Your Plan
                </DialogTitle>
                <DialogDescription>
                  {isNewSubscription
                    ? "Choose a plan that fits your needs. You can upgrade or downgrade anytime."
                    : "Upgrade or downgrade your plan anytime. You'll only be charged for what you use."}
                </DialogDescription>
              </div>
              <div className='md:flex-shrink-0 self-center sm:self-auto mr-4'>
                {renderBillingToggle()}
              </div>
            </div>
          )}
        </DialogHeader>

        <div className='p-4'>
          <AnimatePresence mode='wait'>
            {!confirmationStep ? (
              <motion.div
                key='plan-selection'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {allPlans.map((plan) => renderPlanCard(plan))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key='confirmation'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderConfirmation()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {confirmationStep && selectedPlan && (
          <div className='sticky bottom-0 z-10 mt-auto shadow-[0_-4px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)]'>
            <DialogFooter className='flex flex-col md:flex-row md:justify-end p-4 border-t border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 gap-2'>
              <Button
                variant='outline'
                onClick={handleGoBack}
                disabled={loading}
                className='w-full md:w-auto order-2 md:order-1'
              >
                ← Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={loading || isDeviceLimitExceeded}
                className={cn(
                  "w-full md:w-auto order-1 md:order-2",
                  isUpgrade(selectedPlan)
                    ? selectedPlan === "individual"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : selectedPlan === "team"
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                    : isDeviceLimitExceeded
                    ? "bg-red-300 text-white cursor-not-allowed dark:bg-red-900/50 dark:text-gray-400"
                    : "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isNewSubscription
                  ? billingPeriod === "yearly"
                    ? `Subscribe for ${getPlanYearlyPrice(selectedPlan)}`
                    : `Subscribe for ${getPlanPrice(selectedPlan)}`
                  : isUpgrade(selectedPlan)
                  ? billingPeriod === "yearly"
                    ? `Confirm and Pay ${getPlanYearlyPrice(selectedPlan)}`
                    : `Confirm and Pay ${getPlanPrice(selectedPlan)}`
                  : `Confirm Downgrade`}
                {isDeviceLimitExceeded && (
                  <span className='ml-2 text-xs'>(Remove devices first)</span>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
