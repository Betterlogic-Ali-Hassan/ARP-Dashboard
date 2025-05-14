"use client";

import { useState } from "react";
import {
  Check,
  Crown,
  ExternalLink,
  Users,
  BuildingIcon as Buildings,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { PlanChangeDialog } from "@/components/plan-change-dialog";
import {
  PLANS,
  type PlanType,
  type BillingPeriodType,
  getYearlyDiscountPercentage,
} from "@/lib/plan-utils";

export default function PricingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState("yearly");
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    setSubscriptionDialogOpen(true);
  };

  const handleFreeTrial = (plan: string) => {
    setSelectedPlan(plan);
    setSubscriptionDialogOpen(true);
  };

  const handleSubscriptionComplete = (success: boolean) => {
    setSubscriptionDialogOpen(false);

    if (success) {
      toast({
        title: "Subscription successful!",
        description:
          "Your subscription has been activated. Enjoy your new features!",
      });

      // Redirect to account page after successful subscription
      setTimeout(() => {
        router.push("/account/subscription");
      }, 1500);
    }
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* Main content */}
      <main className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold tracking-tight mb-2 max-md:ml-[52px]'>
              Pricing Plans
            </h1>
            <div className='flex items-center justify-between flex-wrap gap-4'>
              <p className='text-gray-500 dark:text-gray-400 max-w-2xl'>
                Explore and choose from our available pricing plans to unlock
                additional features and increase device limits.
              </p>
              <Link
                href='#comparison'
                className='inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
              >
                View detailed pricing table
                <ExternalLink className='ml-1 h-4 w-4' />
              </Link>
            </div>
          </div>

          <Tabs
            defaultValue='yearly'
            className='mb-8'
            value={billingPeriod}
            onValueChange={setBillingPeriod}
          >
            <div className='flex justify-center'>
              <TabsList className='grid w-64 grid-cols-2'>
                <TabsTrigger value='yearly' className='relative'>
                  Yearly
                  <span className='absolute -top-2 -right-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-medium px-1.5 py-0.5 rounded-full'>
                    -{getYearlyDiscountPercentage("individual")}%
                  </span>
                </TabsTrigger>
                <TabsTrigger value='monthly'>Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='yearly' className='mt-6'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Individual Plan */}
                <Card className='relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                      Save 25%
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Crown
                        className='h-6 w-6 mr-2'
                        style={{ color: "#059669" }}
                      />
                      <CardTitle className='text-xl'>Individual</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Ideal for personal use with comprehensive premium features
                      and reliable support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>
                        {billingPeriod === "yearly"
                          ? PLANS.individual.pricing.yearlyPerMonth
                          : PLANS.individual.pricing.monthly}
                      </span>
                      {billingPeriod === "yearly" && (
                        <span className='ml-1 text-gray-500 dark:text-gray-400 line-through text-sm'>
                          {PLANS.individual.pricing.monthly}
                        </span>
                      )}
                      <span className='ml-1 text-gray-500 dark:text-gray-400 text-sm'>
                        /month
                      </span>
                    </div>

                    <div className='mb-6'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium'>Devices</span>
                        <Badge
                          variant='outline'
                          className='bg-gray-100 dark:bg-gray-800'
                        >
                          3
                        </Badge>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        Billed yearly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        {PLANS.individual.features.map((feature, index) => (
                          <div key={index} className='flex items-center'>
                            <Check
                              className='h-4 w-4 mr-2 flex-shrink-0'
                              style={{ color: "#059669" }}
                            />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      className='w-full text-white hover:bg-opacity-90 dark:hover:bg-opacity-90'
                      style={{ backgroundColor: "#059669" }}
                      onClick={() => handleFreeTrial("individual")}
                    >
                      Buy Now!
                    </Button>
                    <div className='flex items-center justify-center mt-1 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-2 rounded-md border border-amber-200 dark:border-amber-800'>
                      <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        ✓ 100% Refund if Cancelled in 14 Days
                      </span>
                    </div>
                  </CardFooter>
                </Card>

                {/* Team Plan */}
                <Card className='relative overflow-hidden border-2 border-amber-100 dark:border-amber-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-300'>
                      Save 20%
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Users
                        className='h-6 w-6 mr-2'
                        style={{ color: "#F59E0B" }}
                      />
                      <CardTitle className='text-xl'>Team plan</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Perfect for teams and businesses, offering extended device
                      management and priority support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>
                        {billingPeriod === "yearly"
                          ? PLANS.team.pricing.yearlyPerMonth
                          : PLANS.team.pricing.monthly}
                      </span>
                      {billingPeriod === "yearly" && (
                        <span className='ml-1 text-gray-500 dark:text-gray-400 line-through text-sm'>
                          {PLANS.team.pricing.monthly}
                        </span>
                      )}
                      <span className='ml-1 text-gray-500 dark:text-gray-400 text-sm'>
                        /month
                      </span>
                    </div>

                    <div className='mb-6'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium'>Devices</span>
                        <Badge
                          variant='outline'
                          className='bg-gray-100 dark:bg-gray-800'
                        >
                          10
                        </Badge>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        Billed yearly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        {PLANS.team.features.map((feature, index) => (
                          <div key={index} className='flex items-center'>
                            <Check
                              className='h-4 w-4 mr-2 flex-shrink-0'
                              style={{ color: "#F59E0B" }}
                            />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      className='w-full text-white hover:bg-opacity-90 dark:hover:bg-opacity-90'
                      style={{ backgroundColor: "#F59E0B" }}
                      onClick={() => handleSubscribe("team")}
                    >
                      Buy Now!
                    </Button>
                    <div className='flex items-center justify-center mt-1 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-2 rounded-md border border-amber-200 dark:border-amber-800'>
                      <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        ✓ 100% Refund if Cancelled in 14 Days
                      </span>
                    </div>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className='relative overflow-hidden border-2 border-purple-100 dark:border-purple-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300'>
                      Save 25%
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Buildings className='h-6 w-6 text-purple-500 mr-2' />
                      <CardTitle className='text-xl'>Enterprise</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Comprehensive solution for large organizations with
                      advanced requirements and dedicated support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>
                        {billingPeriod === "yearly"
                          ? PLANS.enterprise.pricing.yearlyPerMonth
                          : PLANS.enterprise.pricing.monthly}
                      </span>
                      {billingPeriod === "yearly" && (
                        <span className='ml-1 text-gray-500 dark:text-gray-400 line-through text-sm'>
                          {PLANS.enterprise.pricing.monthly}
                        </span>
                      )}
                      <span className='ml-1 text-gray-500 dark:text-gray-400 text-sm'>
                        /month
                      </span>
                    </div>

                    <div className='mb-6'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium'>Devices</span>
                        <Badge
                          variant='outline'
                          className='bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        >
                          100
                        </Badge>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        Billed monthly or yearly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        {PLANS.enterprise.features.map((feature, index) => (
                          <div key={index} className='flex items-center'>
                            <Check className='h-4 w-4 text-purple-500 mr-2 flex-shrink-0' />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      className='w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
                      onClick={() => handleSubscribe("enterprise")}
                    >
                      Buy Now
                    </Button>
                    <div className='flex items-center justify-center mt-1 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-2 rounded-md border border-amber-200 dark:border-amber-800'>
                      <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        ✓ 100% Refund if Cancelled in 14 Days
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='monthly' className='mt-6'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Individual Plan - Monthly */}
                <Card className='relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900'>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Crown
                        className='h-6 w-6 mr-2'
                        style={{ color: "#059669" }}
                      />
                      <CardTitle className='text-xl'>Individual</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Ideal for personal use with comprehensive premium features
                      and reliable support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>
                        {PLANS.individual.pricing.monthly}
                      </span>
                      <span className='ml-1 text-gray-500 dark:text-gray-400 text-sm'>
                        /month
                      </span>
                    </div>

                    <div className='mb-6'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium'>Devices</span>
                        <Badge
                          variant='outline'
                          className='bg-gray-100 dark:bg-gray-800'
                        >
                          3
                        </Badge>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        Billed monthly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        {PLANS.individual.features.map((feature, index) => (
                          <div key={index} className='flex items-center'>
                            <Check
                              className='h-4 w-4 mr-2 flex-shrink-0'
                              style={{ color: "#059669" }}
                            />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      className='w-full text-white hover:bg-opacity-90 dark:hover:bg-opacity-90'
                      style={{ backgroundColor: "#059669" }}
                      onClick={() => handleFreeTrial("individual")}
                    >
                      Buy Now!
                    </Button>
                    <div className='flex items-center justify-center mt-1 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-2 rounded-md border border-amber-200 dark:border-amber-800'>
                      <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        ✓ 100% Refund if Cancelled in 14 Days
                      </span>
                    </div>
                  </CardFooter>
                </Card>

                {/* Team Plan - Monthly */}
                <Card className='relative overflow-hidden border-2 border-amber-100 dark:border-amber-900'>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Users
                        className='h-6 w-6 mr-2'
                        style={{ color: "#F59E0B" }}
                      />
                      <CardTitle className='text-xl'>Team plan</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Perfect for teams and businesses, offering extended device
                      management and priority support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>
                        {PLANS.team.pricing.monthly}
                      </span>
                      <span className='ml-1 text-gray-500 dark:text-gray-400 text-sm'>
                        /month
                      </span>
                    </div>

                    <div className='mb-6'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium'>Devices</span>
                        <Badge
                          variant='outline'
                          className='bg-gray-100 dark:bg-gray-800'
                        >
                          10
                        </Badge>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        Billed monthly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        {PLANS.team.features.map((feature, index) => (
                          <div key={index} className='flex items-center'>
                            <Check
                              className='h-4 w-4 mr-2 flex-shrink-0'
                              style={{ color: "#F59E0B" }}
                            />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      className='w-full text-white hover:bg-opacity-90 dark:hover:bg-opacity-90'
                      style={{ backgroundColor: "#F59E0B" }}
                      onClick={() => handleSubscribe("team")}
                    >
                      Buy Now!
                    </Button>
                    <div className='flex items-center justify-center mt-1 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-2 rounded-md border border-amber-200 dark:border-amber-800'>
                      <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        ✓ 100% Refund if Cancelled in 14 Days
                      </span>
                    </div>
                  </CardFooter>
                </Card>

                {/* Enterprise Plan - Monthly */}
                <Card className='relative overflow-hidden border-2 border-purple-100 dark:border-purple-900'>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Buildings className='h-6 w-6 text-purple-500 mr-2' />
                      <CardTitle className='text-xl'>Enterprise</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Comprehensive solution for large organizations with
                      advanced requirements and dedicated support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>
                        {PLANS.enterprise.pricing.monthly}
                      </span>
                      <span className='ml-1 text-gray-500 dark:text-gray-400 text-sm'>
                        /month
                      </span>
                    </div>

                    <div className='mb-6'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm font-medium'>Devices</span>
                        <Badge
                          variant='outline'
                          className='bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        >
                          100
                        </Badge>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        Billed monthly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        {PLANS.enterprise.features.map((feature, index) => (
                          <div key={index} className='flex items-center'>
                            <Check className='h-4 w-4 text-purple-500 mr-2 flex-shrink-0' />
                            <span className='text-sm'>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col gap-2'>
                    <Button
                      className='w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
                      onClick={() => handleSubscribe("enterprise")}
                    >
                      Buy Now
                    </Button>
                    <div className='flex items-center justify-center mt-1 bg-amber-50 dark:bg-amber-950/40 py-1.5 px-2 rounded-md border border-amber-200 dark:border-amber-800'>
                      <span className='text-xs font-medium text-amber-700 dark:text-amber-400'>
                        ✓ 100% Refund if Cancelled in 14 Days
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Basic Free Plan */}
          <div className='mt-12 mb-16'>
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                <div>
                  <div className='flex items-center mb-2'>
                    <Gift className='h-6 w-6 text-blue-500 mr-2' />
                    <h3 className='text-xl font-bold'>Basic</h3>
                    <Badge className='ml-2 bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300'>
                      Free version
                    </Badge>
                  </div>
                  <p className='text-gray-500 dark:text-gray-400 mb-4 md:mb-0 max-w-2xl'>
                    Get started with our free plan. Manage up to 3 devices with
                    basic features and access to support articles.
                  </p>
                  <div className='mt-4 flex flex-wrap gap-3'>
                    <div className='flex items-center'>
                      <Check className='h-4 w-4 text-blue-500 mr-2 flex-shrink-0' />
                      <span className='text-sm'>
                        Basic access with limited features
                      </span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='h-4 w-4 text-blue-500 mr-2 flex-shrink-0' />
                      <span className='text-sm'>Manage up to 3 devices</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='h-4 w-4 text-blue-500 mr-2 flex-shrink-0' />
                      <span className='text-sm'>
                        Access to support articles
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='text-center mb-2'>
                    <span className='text-xl font-bold'>Always free</span>
                  </div>
                  <Button
                    className='bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 whitespace-nowrap border border-gray-300 dark:border-gray-600 cursor-default'
                    onClick={() => router.push("/account")}
                  >
                    Current Plan
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='mb-16'>
            <h2 className='text-2xl font-bold mb-6'>
              Frequently Asked Questions
            </h2>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                <h3 className='text-lg font-medium mb-2'>
                  How do I upgrade my subscription?
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  You can upgrade your subscription at any time from your
                  account settings. Your new plan will be activated immediately,
                  and you'll be charged the prorated amount for the remainder of
                  your billing cycle.
                </p>
              </div>
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                <h3 className='text-lg font-medium mb-2'>
                  Can I downgrade my subscription?
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  Yes, you can downgrade your subscription at any time. The
                  changes will take effect at the end of your current billing
                  cycle. You'll continue to have access to your current plan's
                  features until then.
                </p>
              </div>
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                <h3 className='text-lg font-medium mb-2'>
                  How does the free trial work?
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  Our 7-day free trial gives you full access to all features of
                  the Individual plan. No credit card is required to start. At
                  the end of the trial, you can choose to subscribe or your
                  account will automatically revert to the Basic plan.
                </p>
              </div>
              <div className='bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800'>
                <h3 className='text-lg font-medium mb-2'>
                  What payment methods do you accept?
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  We accept all major credit cards (Visa, Mastercard, American
                  Express) and PayPal. For Enterprise plans, we also offer
                  invoice-based payments with net-30 terms.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className='bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-700 dark:to-teal-800 rounded-xl p-8 text-white'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
              <div>
                <h2 className='text-2xl font-bold mb-2'>
                  Ready to get started?
                </h2>
                <p className='text-emerald-50 max-w-2xl'>
                  Choose the plan that's right for you and start managing your
                  devices with ease. All plans come with a satisfaction
                  guarantee.
                </p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button
                  className='bg-white text-emerald-600 hover:bg-gray-100 hover:text-emerald-700'
                  onClick={() => handleFreeTrial("individual")}
                >
                  Start Free Trial
                </Button>
                <Button
                  variant='outline'
                  className='border-white text-white bg-transparent hover:bg-white/20'
                  onClick={() => router.push("#comparison")}
                >
                  Compare Plans
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Plan Change Dialog */}
      <PlanChangeDialog
        open={subscriptionDialogOpen}
        onOpenChange={setSubscriptionDialogOpen}
        currentPlan='basic' // Default to basic for new users
        selectedPlan={(selectedPlan as PlanType) || null}
        billingPeriod={billingPeriod as BillingPeriodType}
        onComplete={handleSubscriptionComplete}
        isNewSubscription={true} // Flag to indicate this is a new subscription, not a plan change
      />
    </div>
  );
}
