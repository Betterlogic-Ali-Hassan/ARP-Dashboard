"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Timer, Check, Clock, Calendar } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

export default function CountdownPage() {
  // State for countdown mode toggles
  const [countdownMode, setCountdownMode] = useState(false);
  const [countdownTimer, setCountdownTimer] = useState(true);
  const [countdownSchedules, setCountdownSchedules] = useState(false);

  // Handle countdown mode toggle
  const handleCountdownModeChange = (checked: boolean) => {
    setCountdownMode(checked);
    // When enabling countdown mode, ensure at least one option is enabled
    if (checked && !countdownTimer && !countdownSchedules) {
      setCountdownTimer(true);
    }
  };

  // Handle countdown timer toggle
  const handleCountdownTimerChange = (checked: boolean) => {
    // Prevent disabling if it's the only enabled option
    if (!checked && !countdownSchedules) {
      return;
    }
    setCountdownTimer(checked);
  };

  // Handle countdown schedules toggle
  const handleCountdownSchedulesChange = (checked: boolean) => {
    // Prevent disabling if it's the only enabled option
    if (!checked && !countdownTimer) {
      return;
    }
    setCountdownSchedules(checked);
  };

  // Auto-disable countdown mode if both options are turned off
  useEffect(() => {
    if (countdownMode && !countdownTimer && !countdownSchedules) {
      setCountdownMode(false);
    }
  }, [countdownTimer, countdownSchedules, countdownMode]);

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[56rem]'>
          <h1 className='mb-6 text-3xl font-bold tracking-tight max-md:ml-[52px]'>
            Countdown
          </h1>

          {/* Enable Countdown Mode */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <Timer className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>
                    Enable Countdown Mode
                  </CardTitle>
                </div>
                <CardDescription>
                  Perform a page refresh on a specific page after a certain
                  amount of time has passed. Auto Refresh Plus&apos;s countdown
                  timer lets you do it. Simply enable and set the time, and the
                  countdown timer will begin. Once the countdown reaches zero,
                  Auto Refresh Plus will begin refreshing the page again at the
                  set default intervals.
                </CardDescription>
              </div>
              <Switch
                id='countdown-mode'
                checked={countdownMode}
                onCheckedChange={handleCountdownModeChange}
              />
            </CardHeader>
            <CardContent>
              {countdownMode && (
                <>
                  <div className='bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 p-3 rounded-md text-sm border border-green-100 dark:border-green-900 flex items-center gap-2 mb-6'>
                    <Check className='h-4 w-4 text-green-600 dark:text-green-400' />
                    Countdown Mode Added in Auto Refresh Plus Popup
                  </div>

                  {/* Countdown Timer Toggle */}
                  <div className='border-t pt-4 mt-2'>
                    <div className='flex flex-row items-start justify-between'>
                      <div>
                        <div className='flex items-center gap-3 mb-4'>
                          <div className='flex items-center justify-center h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-950/50'>
                            <Clock className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                          </div>
                          <h3 className='text-lg font-medium'>
                            Countdown Timer
                          </h3>
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400 ml-10'>
                          The Countdown Timer in the Auto Refresh extension
                          allows you to schedule a one-time page refresh either
                          after a set duration (e.g., 10 minutes) or at a
                          specific date and time. This feature is useful for
                          situations where you want the page to reload at a
                          precise moment or after a countdown, rather than using
                          regular refresh intervals.
                        </p>
                      </div>
                      <Switch
                        id='countdown-timer'
                        checked={countdownTimer}
                        onCheckedChange={handleCountdownTimerChange}
                      />
                    </div>
                  </div>

                  {/* Countdown Schedules Toggle */}
                  <div className='border-t pt-4 mt-4'>
                    <div className='flex flex-row items-start justify-between'>
                      <div>
                        <div className='flex items-center gap-3 mb-4'>
                          <div className='flex items-center justify-center h-7 w-7 rounded-md bg-purple-100 dark:bg-purple-950/50'>
                            <Calendar className='h-4 w-4 text-purple-600 dark:text-purple-400' />
                          </div>
                          <h3 className='text-lg font-medium'>
                            Countdown Schedules
                          </h3>
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400 ml-10'>
                          Schedule Countdown lets you automatically start or
                          stop refreshing a page at specific times on selected
                          days. You can create multiple schedules by choosing
                          days and exact times, and optionally enable features
                          like auto-stop (to limit refresh duration) or
                          auto-disable (to run only once). It's ideal for
                          setting up regular, timed page refreshes without
                          manual input.
                        </p>
                      </div>
                      <Switch
                        id='countdown-schedules'
                        checked={countdownSchedules}
                        onCheckedChange={handleCountdownSchedulesChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
