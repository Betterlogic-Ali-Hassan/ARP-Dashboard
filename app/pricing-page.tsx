import { Check, Crown, ExternalLink, Settings, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getDiscountText } from "@/lib/plan-utils";

export default function PricingPage() {
  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* Sidebar */}
      <aside className='hidden w-64 border-r bg-white p-6 shadow-sm dark:bg-gray-950 dark:border-gray-800 lg:block'>
        <div className='flex items-center gap-3 mb-8'>
          <div className='h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-white'
            >
              <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
            </svg>
          </div>
          <div>
            <h3 className='font-semibold'>Hashim Mansoor</h3>
            <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
              <span>Free</span>
              <span>•</span>
              <span>1 Device</span>
            </div>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full mb-8 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900'
        >
          <Crown className='mr-2 h-4 w-4' />
          Upgrade Premium
        </Button>

        <nav className='space-y-1'>
          <Link
            href='/devices'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-gray-500 dark:text-gray-400'
            >
              <rect width='16' height='10' x='4' y='2' rx='2' />
              <rect width='6' height='6' x='9' y='16' rx='2' />
              <path d='M12 12v4' />
            </svg>
            <span>Devices</span>
          </Link>
          <Link
            href='/settings-profiles'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-gray-500 dark:text-gray-400'
            >
              <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
              <circle cx='12' cy='12' r='3' />
            </svg>
            <span>Settings Profiles</span>
          </Link>
          <Link
            href='/licenses'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-gray-500 dark:text-gray-400'
            >
              <rect width='20' height='14' x='2' y='5' rx='2' />
              <line x1='2' x2='22' y1='10' y2='10' />
            </svg>
            <span>Licenses</span>
          </Link>
          <Link
            href='/statement'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-gray-500 dark:text-gray-400'
            >
              <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
              <path d='M14 2v6h6' />
              <line x1='16' x2='8' y1='13' y2='13' />
              <line x1='16' x2='8' y1='17' y2='17' />
              <line x1='10' x2='8' y1='9' y2='9' />
            </svg>
            <span>Statement</span>
          </Link>
          <Link
            href='/support'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-gray-500 dark:text-gray-400'
            >
              <path d='M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0z' />
            </svg>
            <span>Support</span>
          </Link>
          <Link
            href='/settings'
            className='flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='text-gray-500 dark:text-gray-400'
            >
              <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
            </svg>
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className='flex-1 p-6 lg:p-8'>
        <div className='mx-auto max-w-6xl'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold tracking-tight mb-2 md:ml-[52px]'>
              Pricing Plans
            </h1>
            <div className='flex items-center justify-between'>
              <p className='text-gray-500 dark:text-gray-400 max-w-2xl'>
                Explore and choose from our available pricing plans to unlock
                additional features and increase device limits.
              </p>
              <Link
                href='#'
                className='inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
              >
                View detailed pricing table
                <ExternalLink className='ml-1 h-4 w-4' />
              </Link>
            </div>
          </div>

          <Tabs defaultValue='yearly' className='mb-8'>
            <div className='flex justify-center'>
              <TabsList className='grid w-64 grid-cols-2'>
                <TabsTrigger value='yearly'>Yearly</TabsTrigger>
                <TabsTrigger value='monthly'>Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='yearly' className='mt-6'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Individual Plan */}
                <Card className='relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                      {getDiscountText("individual")}
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Crown className='h-6 w-6 text-amber-500 mr-2' />
                      <CardTitle className='text-xl'>Individual</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Ideal for personal use with comprehensive premium features
                      and reliable support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>$2.99</span>
                      <span className='ml-1 text-gray-500 dark:text-gray-400 line-through text-sm'>
                        $3.99
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
                        Billed yearly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Full access to all premium features
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Manage up to 3 devices (Non-Extendable)
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Different settings profiles
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Premium Support (72 hours)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'>
                      Try 7 Days Free Trial
                    </Button>
                  </CardFooter>
                </Card>

                {/* Team Plan */}
                <Card className='relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                      {getDiscountText("team")}
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Users className='h-6 w-6 text-orange-500 mr-2' />
                      <CardTitle className='text-xl'>Team plan</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Perfect for teams and businesses, offering extended device
                      management and priority support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>$7.99</span>
                      <span className='ml-1 text-gray-500 dark:text-gray-400 line-through text-sm'>
                        $9.99
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
                        Billed yearly
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Full access to all premium features
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Manage up to 10 devices (Extendable)
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Different settings profiles
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Premium Support (24 hours)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700'>
                      Buy Now!
                    </Button>
                  </CardFooter>
                </Card>

                {/* Basic Plan */}
                <Card className='border-2 border-gray-100 dark:border-gray-800'>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Settings className='h-6 w-6 text-cyan-500 mr-2' />
                      <CardTitle className='text-xl'>Basic</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Suitable for casual users with limited features and
                      support through self-service resources.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>Free</span>
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
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Basic access with limited features
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Manage up to 3 devices
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Different settings profiles
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Access to support articles
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant='outline' className='w-full'>
                      Current Plan
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value='monthly' className='mt-6'>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Individual Plan - Monthly */}
                <Card className='relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                      {getDiscountText("individual")}
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Crown className='h-6 w-6 text-amber-500 mr-2' />
                      <CardTitle className='text-xl'>Individual</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Ideal for personal use with comprehensive premium features
                      and reliable support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>$3.99</span>
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
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Full access to all premium features
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Manage up to 3 devices (Non-Extendable)
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Different settings profiles
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Premium Support (72 hours)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'>
                      Try 7 Days Free Trial
                    </Button>
                  </CardFooter>
                </Card>

                {/* Team Plan - Monthly */}
                <Card className='relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900'>
                  <div className='absolute right-4 top-4'>
                    <Badge className='bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300'>
                      {getDiscountText("team")}
                    </Badge>
                  </div>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Users className='h-6 w-6 text-orange-500 mr-2' />
                      <CardTitle className='text-xl'>Team plan</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Perfect for teams and businesses, offering extended device
                      management and priority support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>$9.99</span>
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
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Full access to all premium features
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Manage up to 10 devices (Extendable)
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Different settings profiles
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Premium Support (24 hours)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700'>
                      Buy Now!
                    </Button>
                  </CardFooter>
                </Card>

                {/* Basic Plan - Monthly */}
                <Card className='border-2 border-gray-100 dark:border-gray-800'>
                  <CardHeader className='pb-8 pt-6'>
                    <div className='flex items-center mb-2'>
                      <Settings className='h-6 w-6 text-cyan-500 mr-2' />
                      <CardTitle className='text-xl'>Basic</CardTitle>
                    </div>
                    <CardDescription className='text-sm text-gray-500 dark:text-gray-400'>
                      Suitable for casual users with limited features and
                      support through self-service resources.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pb-6'>
                    <div className='flex items-baseline mb-6'>
                      <span className='text-3xl font-bold'>Free</span>
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
                        Always free
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-3'>
                        WHAT'S INCLUDED
                      </h4>
                      <div className='grid gap-3'>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Basic access with limited features
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Manage up to 3 devices
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Different settings profiles
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='h-4 w-4 text-emerald-500 mr-2 flex-shrink-0' />
                          <span className='text-sm'>
                            Access to support articles
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant='outline' className='w-full'>
                      Current Plan
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
