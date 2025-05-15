"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, CreditCard, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type PlanType,
  type BillingPeriodType,
  PLANS,
  getPreviousPlan,
} from "@/lib/plan-utils";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlanCardProps {
  plan: PlanType;
  status: "active" | "canceled" | "scheduled_downgrade" | "past_due" | null;
  billingPeriod: BillingPeriodType;
  nextBillingDate: string;
  devicesUsed: number;
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
    brand: string;
  };
  onUpgrade: () => void;
  onDowngrade: () => void;
  onCancel: () => void;
  onReactivate: () => void;
}

export function PlanCard({
  plan,
  status,
  billingPeriod,
  nextBillingDate,
  devicesUsed,
  paymentMethod,
  onUpgrade,
  onDowngrade,
  onCancel,
  onReactivate,
}: PlanCardProps) {
  const planDetails = PLANS[plan];
  const deviceLimit = planDetails.deviceLimit;
  const amount =
    billingPeriod === "yearly"
      ? planDetails.pricing.yearly
      : planDetails.pricing.monthly;

  // Get the previous plan for downgrade button styling
  const previousPlan = getPreviousPlan(plan);
  const previousPlanDetails = previousPlan ? PLANS[previousPlan] : null;

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return (
          <Badge className={cn("flex items-center", planDetails.color.badge)}>
            <Check className='mr-1 h-3 w-3' /> Active
          </Badge>
        );
      case "canceled":
        return (
          <Badge
            variant='outline'
            className='text-amber-600 dark:text-amber-400'
          >
            Canceled
          </Badge>
        );
      case "scheduled_downgrade":
        return (
          <Badge className='bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300'>
            <AlertCircle className='mr-1 h-3 w-3' /> Downgrade Scheduled
          </Badge>
        );
      case "past_due":
        return (
          <Badge className='bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300'>
            <AlertCircle className='mr-1 h-3 w-3' /> Past Due
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  // Create dynamic hover styles for the current plan
  const extractColorInfo = (colorClass: string) => {
    if (!colorClass.includes("bg-")) return { name: "gray", shade: "600" };
    const colorBase = colorClass.split("bg-")[1];
    const [name, shade] = colorBase.split("-");
    return { name, shade };
  };

  const { name: colorName, shade: colorShade } = extractColorInfo(
    planDetails.color.primary
  );
  const hoverShade = Math.max(Number.parseInt(colorShade) - 100, 300); // Lighter shade for hover, but not too light
  const hoverClass = `hover:bg-${colorName}-${hoverShade}`;

  // CSS custom properties for the button
  const buttonStyle = {
    "--plan-current-color": `var(--${colorName}-${colorShade})`,
    "--plan-current-color-light": `var(--${colorName}-${hoverShade})`,
    transition: "background-color 0.2s ease, transform 0.1s ease",
  } as React.CSSProperties;

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <CardTitle>Current Plan</CardTitle>
          {getStatusBadge(status)}
        </div>
        <CardDescription>
          Your current subscription plan and usage details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6'>
          <div className='grid gap-2'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium'>{planDetails.name} Plan</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {billingPeriod === "yearly"
                    ? "Billed yearly"
                    : "Billed monthly"}
                </p>
              </div>
              <div className='text-right'>
                <div className='text-lg font-medium'>{amount}</div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  per {billingPeriod === "yearly" ? "year" : "month"}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-4 space-y-2'>
            <div className='flex justify-between text-sm'>
              <div className='flex items-center gap-1.5'>
                <h4 className='text-sm font-medium'>Device Usage</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className='h-3.5 w-3.5 text-gray-400 dark:text-gray-500' />
                    </TooltipTrigger>
                    <TooltipContent side='top' className='max-w-xs'>
                      <p>
                        All connected devices are counted toward your plan
                        limit, including inactive ones.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className='font-medium'>
                {devicesUsed} / {deviceLimit} devices
              </span>
            </div>
            <Progress
              value={(devicesUsed / deviceLimit) * 100}
              className='h-2'
            />
          </div>

          <div className='grid gap-2'>
            <h4 className='text-sm font-medium'>Billing Information</h4>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <p className='text-gray-500 dark:text-gray-400'>
                  Next billing date
                </p>
                <p>{nextBillingDate}</p>
              </div>
              <div>
                <p className='text-gray-500 dark:text-gray-400'>
                  Payment method
                </p>
                <p className='flex items-center'>
                  <CreditCard className='h-4 w-4 mr-1' />
                  {paymentMethod.brand.toUpperCase()} •••• {paymentMethod.last4}
                </p>
              </div>
            </div>
          </div>

          {status === "canceled" && (
            <div className='bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 relative overflow-hidden'>
              <div className='flex items-start gap-3 relative z-10'>
                <div className='bg-amber-100 dark:bg-amber-800 rounded-full p-2 mt-1'>
                  <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-1'>
                    Subscription Canceled
                  </h4>
                  <p className='text-amber-700 dark:text-amber-400 text-sm'>
                    Your subscription has been canceled and will end on{" "}
                    <span className='font-medium'>{nextBillingDate}</span>.
                  </p>
                  <p className='text-amber-700 dark:text-amber-400 text-sm mt-1'>
                    You can reactivate your subscription at any time before this
                    date.
                  </p>
                </div>
              </div>
              <div className='absolute right-0 bottom-0 opacity-10'>
                <svg
                  width='100'
                  height='100'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-amber-700'
                >
                  <path
                    d='M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          )}

          {status === "scheduled_downgrade" && (
            <div className='bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-lg p-4 relative overflow-hidden'>
              <div className='flex items-start gap-3 relative z-10'>
                <div className='bg-amber-100 dark:bg-amber-800 rounded-full p-2 mt-1'>
                  <AlertCircle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                </div>
                <div className='flex-1'>
                  <h4 className='font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-1'>
                    Downgrade Scheduled
                    <span className='inline-block w-5 h-5 relative'>
                      <span className='absolute inset-0 flex items-center justify-center'>
                        <span className='block w-0.5 h-3 bg-amber-600 dark:bg-amber-400 rotate-45'></span>
                        <span className='block w-0.5 h-3 bg-amber-600 dark:bg-amber-400 -rotate-45'></span>
                      </span>
                    </span>
                  </h4>
                  <p className='text-amber-700 dark:text-amber-400 text-sm'>
                    Your plan will be downgraded on{" "}
                    <span className='font-medium'>{nextBillingDate}</span>.
                  </p>
                  <p className='text-amber-700 dark:text-amber-400 text-sm mt-1'>
                    You'll continue to have access to all features until then.
                  </p>
                </div>
              </div>
              <div className='absolute right-0 bottom-0 opacity-10'>
                <svg
                  width='100'
                  height='100'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='text-amber-700'
                >
                  <path
                    d='M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col sm:flex-row gap-3'>
        {status === "active" ? (
          <>
            <Button
              variant='default'
              className={cn(
                "w-full sm:w-auto change-plan-btn",
                planDetails.color.primary,
                hoverClass
              )}
              style={buttonStyle}
              onClick={onUpgrade}
            >
              Change Plan
            </Button>
            <Button
              variant='outline'
              className='w-full sm:w-auto'
              onClick={onCancel}
            >
              Cancel Subscription
            </Button>
          </>
        ) : status === "scheduled_downgrade" ? (
          <Button
            variant='default'
            className={cn(
              "w-full sm:w-auto",
              planDetails.color.primary,
              hoverClass
            )}
            style={buttonStyle}
            onClick={onReactivate}
          >
            Cancel Scheduled Downgrade
          </Button>
        ) : (
          <Button
            variant='default'
            className={cn(
              "w-full sm:w-auto",
              planDetails.color.primary,
              hoverClass
            )}
            style={buttonStyle}
            onClick={onReactivate}
          >
            Reactivate Subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
