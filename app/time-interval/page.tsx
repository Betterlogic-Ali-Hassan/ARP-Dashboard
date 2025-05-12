"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  Clock,
  Shuffle,
  Eye,
  Compass,
  Link,
  MousePointer,
  Crown,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { PremiumFeatureDialog } from "@/components/premium-feature-dialog";

export default function TimeIntervalPage() {
  // State for form controls
  const [defaultInterval, setDefaultInterval] = useState("12");
  const [randomInterval, setRandomInterval] = useState(false);
  const [visualTimer, setVisualTimer] = useState(false); // Default to false for premium feature
  const [timerPosition, setTimerPosition] = useState("top-right");
  const [urlHandling, setUrlHandling] = useState("new-url");
  const [stopOnInteraction, setStopOnInteraction] = useState(false); // Default to false for premium feature

  // Premium feature dialog state
  const [premiumDialogOpen, setPremiumDialogOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");

  // Handle premium feature toggle
  const handlePremiumFeature = (featureName: string) => {
    setCurrentFeature(featureName);
    setPremiumDialogOpen(true);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[56rem]'>
          <h1 className='mb-6 text-3xl font-bold tracking-tight max-md:ml-[52px]'>
            Time Interval
          </h1>

          {/* Default Time Interval */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Clock className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>Default Time Interval</CardTitle>
              </div>
              <CardDescription>
                Set the default time for every page refresh. You can select
                either the predefined time intervals or provide your custom time
                interval from the extension popup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-center space-x-2 max-w-xs'>
                <div className='grid flex-1 gap-2'>
                  <div className='relative'>
                    <Input
                      id='default-interval'
                      type='number'
                      placeholder='12'
                      value={defaultInterval}
                      onChange={(e) => setDefaultInterval(e.target.value)}
                      className='pr-20'
                    />
                    <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground'>
                      Seconds
                    </div>
                  </div>
                </div>
              </div>
              <p className='text-xs text-muted-foreground mt-2'>
                (Minimum 0.10 Sec)
              </p>
            </CardContent>
          </Card>

          {/* Random Interval */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <Shuffle className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>
                    Enable Random Interval
                  </CardTitle>
                </div>
                <CardDescription>
                  Randomize the time interval of each page refresh that Auto
                  Refresh Plus makes. All that you need to do is choose a
                  minimum and maximum time duration, and the extension will
                  perform automatic page refreshes between the defined range.
                </CardDescription>
              </div>
              <Switch
                id='random-interval'
                checked={randomInterval}
                onCheckedChange={setRandomInterval}
              />
            </CardHeader>
            <CardContent>
              {randomInterval && (
                <div className='bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 p-3 rounded-md text-sm border border-green-100 dark:border-green-900'>
                  ✓ Random Interval Function Added in Auto Refresh Plus Popup
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visual Timer - Premium Feature */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-amber-50 dark:bg-amber-950/50'>
                    <Eye className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                  </div>
                  <div className='flex items-center gap-2'>
                    <CardTitle className='text-xl'>
                      Enable Visual Timer by Default
                    </CardTitle>
                    <Badge
                      variant='outline'
                      className='bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1'
                    >
                      <Crown className='h-3 w-3' />
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  By default, enable visual timer for all pages you will
                  refresh. If disabled, you can enable this feature individually
                  from the extension popup.
                </CardDescription>
              </div>
              <Switch
                id='visual-timer'
                checked={visualTimer}
                onCheckedChange={() => handlePremiumFeature("Visual Timer")}
                className='cursor-pointer'
              />
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Timer Position */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Compass className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>
                  Visual Timer Position Control
                </CardTitle>
              </div>
              <CardDescription>
                Control where the visual timer appears on the page. Choose the
                display position that suits you best for showing the visual
                counter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='max-w-xs'>
                <Select value={timerPosition} onValueChange={setTimerPosition}>
                  <SelectTrigger id='timer-position'>
                    <SelectValue placeholder='Select position' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='top-right'>Top Right</SelectItem>
                    <SelectItem value='top-left'>Top Left</SelectItem>
                    <SelectItem value='bottom-right'>Bottom Right</SelectItem>
                    <SelectItem value='bottom-left'>Bottom Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* URL Handling */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Link className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>
                  URL Changes / Redirection Handling
                </CardTitle>
              </div>
              <CardDescription>
                If the website's URL changes while Auto Refresh Plus is running,
                it will automatically update to follow the new URL or stay on
                the original URL. This ensures that the page continues to
                refresh correctly without any interruptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='max-w-xs'>
                <Select value={urlHandling} onValueChange={setUrlHandling}>
                  <SelectTrigger id='url-handling'>
                    <SelectValue placeholder='Select option' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='new-url'>New URL</SelectItem>
                    <SelectItem value='original-url'>Original URL</SelectItem>
                    <SelectItem value='ask'>Ask every time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stop on Interaction - Premium Feature */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-amber-50 dark:bg-amber-950/50'>
                    <MousePointer className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                  </div>
                  <div className='flex items-center gap-2'>
                    <CardTitle className='text-xl'>
                      Stop Refresh on User Interaction
                    </CardTitle>
                    <Badge
                      variant='outline'
                      className='bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800 flex items-center gap-1'
                    >
                      <Crown className='h-3 w-3' />
                      Premium
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Auto Refresh Plus will pause refreshing the page if you click
                  the mouse or use the keyboard. Enable this feature here for
                  all websites, or enable it for individual pages/websites from
                  the extension popup.
                </CardDescription>
              </div>
              <Switch
                id='stop-interaction'
                checked={stopOnInteraction}
                onCheckedChange={() =>
                  handlePremiumFeature("Stop Refresh on User Interaction")
                }
                className='cursor-pointer'
              />
            </CardHeader>
            <CardContent></CardContent>
          </Card>

          {/* Footer Help Link */}
          <div className='mt-8 text-center'>
            <a
              href='#'
              className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              How To: Allow in Incognito
              <ExternalLink className='ml-1 h-4 w-4' />
            </a>
          </div>
        </div>
      </div>

      {/* Premium Feature Dialog */}
      <PremiumFeatureDialog
        open={premiumDialogOpen}
        onOpenChange={setPremiumDialogOpen}
        featureName={currentFeature}
      />
    </div>
  );
}
