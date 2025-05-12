"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  PlayCircle,
  RefreshCw,
  Globe,
  HelpCircle,
  Lock,
  Upload,
  Download,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { UrlPatternTextarea } from "@/components/url-pattern-textarea";
import { toast } from "@/hooks/use-toast";

export default function AutostartPage() {
  const [autoStartUrls, setAutoStartUrls] = useState(false);
  const [refreshOnBrowserRestart, setRefreshOnBrowserRestart] = useState(false);
  const [refreshOnUrlsOpening, setRefreshOnUrlsOpening] = useState(false);
  const [urlsValid, setUrlsValid] = useState(true);
  const [urlsValue, setUrlsValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset dependent toggles when main toggle is disabled
  useEffect(() => {
    if (!autoStartUrls) {
      setRefreshOnBrowserRestart(false);
      setRefreshOnUrlsOpening(false);
    }
  }, [autoStartUrls]);

  // Handle toggle changes with dependency check
  const handleRefreshOnBrowserRestartChange = (checked: boolean) => {
    if (autoStartUrls) {
      setRefreshOnBrowserRestart(checked);
    }
  };

  const handleRefreshOnUrlsOpeningChange = (checked: boolean) => {
    if (autoStartUrls) {
      setRefreshOnUrlsOpening(checked);
    }
  };

  const handleUrlValidChange = (isValid: boolean, value: string) => {
    setUrlsValid(isValid);
    setUrlsValue(value);
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Process the file content
        const lines = content
          .split(/\r?\n/)
          .filter((line) => line.trim() !== "");

        // Combine with existing URLs if any
        const existingUrls = urlsValue
          .split(/\r?\n/)
          .filter((line) => line.trim() !== "");
        const combinedUrls = [...new Set([...existingUrls, ...lines])];

        // Update the textarea
        const newUrlsValue = combinedUrls.join("\n");
        setUrlsValue(newUrlsValue);

        // Show success toast
        toast({
          title: "URLs Imported",
          description: `Successfully imported ${lines.length} URL${
            lines.length !== 1 ? "s" : ""
          }.`,
          variant: "default",
        });
      }
    };
    reader.readAsText(file);

    // Reset the file input
    e.target.value = "";
  };

  const handleExportUrls = () => {
    if (!urlsValue.trim()) {
      toast({
        title: "No URLs to Export",
        description: "Please add some URLs before exporting.",
        variant: "destructive",
      });
      return;
    }

    const urls = urlsValue.split(/\r?\n/).filter((line) => line.trim() !== "");
    const content = urls.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "autostart_urls.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "URLs Exported",
      description: `Successfully exported ${urls.length} URL${
        urls.length !== 1 ? "s" : ""
      }.`,
      variant: "default",
    });
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[56rem]'>
          <h1 className='mb-6 text-3xl font-bold tracking-tight'>Autostart</h1>

          {/* Section 1: Auto Start URLs */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <PlayCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>Auto Start URLs</CardTitle>
                </div>
                <CardDescription>
                  Auto Refresh Plus will auto-start the page reload function
                  when these URLs are opened in your browser. It also opens all
                  of these URLs when your browser restarts and begins
                  auto-refreshing at the desired interval.
                </CardDescription>
              </div>
              <Switch
                id='auto-start-urls'
                checked={autoStartUrls}
                onCheckedChange={setAutoStartUrls}
              />
            </CardHeader>
            <CardContent>
              <Accordion type='single' collapsible className='w-full mb-4'>
                <AccordionItem value='url-patterns' className='border-b-0'>
                  <AccordionTrigger className='py-2 text-sm font-medium'>
                    <div className='flex items-center gap-2'>
                      <HelpCircle className='h-4 w-4 text-muted-foreground' />
                      What URL Patterns Are Allowed
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className='list-disc pl-6 space-y-1 text-sm text-muted-foreground'>
                      <li>
                        To match both HTTP and HTTPS, just write{" "}
                        <code className='bg-muted px-1 py-0.5 rounded'>
                          example.com
                        </code>
                      </li>
                      <li>
                        To match a specific path, write{" "}
                        <code className='bg-muted px-1 py-0.5 rounded'>
                          example.com/path/to/page
                        </code>
                      </li>
                      <li>
                        To match all pages under a path, write{" "}
                        <code className='bg-muted px-1 py-0.5 rounded'>
                          example.com/path/*
                        </code>
                      </li>
                      <li>
                        To match a specific subdomain, write{" "}
                        <code className='bg-muted px-1 py-0.5 rounded'>
                          sub.example.com
                        </code>
                      </li>
                      <li>
                        To match a specific subdomain with path, write{" "}
                        <code className='bg-muted px-1 py-0.5 rounded'>
                          sub.example.com/path
                        </code>
                      </li>
                      <li>
                        To match every page on a domain and its subdomains,
                        write{" "}
                        <code className='bg-muted px-1 py-0.5 rounded'>
                          *.example.com/*
                        </code>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className='space-y-4'>
                <UrlPatternTextarea
                  placeholder='Automatically start refreshing when these URLs are opened. One URL per line, e.g.
example.com
google.com/maps
blog.example.com/posts/*'
                  rows={6}
                  className='font-mono text-sm'
                  disabled={!autoStartUrls}
                  onValidChange={handleUrlValidChange}
                  value={urlsValue}
                  onChange={(e) => setUrlsValue(e.target.value)}
                />

                {/* URL Import/Export Buttons */}
                <div className='flex flex-wrap gap-3'>
                  <input
                    type='file'
                    ref={fileInputRef}
                    accept='.txt'
                    className='hidden'
                    onChange={handleFileChange}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-1.5'
                    onClick={handleFileUpload}
                    disabled={!autoStartUrls}
                  >
                    <Upload className='h-4 w-4' />
                    Import URLs
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-1.5'
                    onClick={handleExportUrls}
                    disabled={!autoStartUrls || !urlsValue.trim()}
                  >
                    <Download className='h-4 w-4' />
                    Export URLs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Refresh on Browser Restart */}
          <Card
            className={cn(
              "mb-6 overflow-hidden transition-opacity duration-200",
              !autoStartUrls && "opacity-75"
            )}
          >
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3 relative'>
              {!autoStartUrls && (
                <div className='absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center'>
                  <div className='bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md flex items-center gap-2'>
                    <Lock className='h-4 w-4 text-amber-500' />
                    <span className='text-sm font-medium'>
                      Enable Auto Start URLs first
                    </span>
                  </div>
                </div>
              )}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <RefreshCw className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>
                    Refresh on Browser Restart
                  </CardTitle>
                </div>
                <CardDescription>
                  Autostart refreshing these URLs when the browser restarts.
                </CardDescription>
              </div>
              <Switch
                id='refresh-on-restart'
                checked={refreshOnBrowserRestart}
                onCheckedChange={handleRefreshOnBrowserRestartChange}
                disabled={!autoStartUrls || !urlsValid}
              />
            </CardHeader>
            <CardContent>
              {refreshOnBrowserRestart && autoStartUrls && (
                <div className='bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-md overflow-hidden shadow-sm'>
                  <div className='p-4 flex items-start gap-3'>
                    <div className='bg-amber-400/20 dark:bg-amber-400/10 p-1.5 rounded-full'>
                      <AlertTriangle className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                    </div>
                    <div className='space-y-1'>
                      <h4 className='font-medium text-amber-800 dark:text-amber-300'>
                        Wildcard URL Limitation
                      </h4>
                      <p className='text-amber-700 dark:text-amber-400 text-sm'>
                        Wildcard URLs (containing * character) are not supported
                        on Browser restart. Only exact URLs will be opened.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Refresh on URLs Opening */}
          <Card
            className={cn(
              "mb-6 overflow-hidden transition-opacity duration-200",
              !autoStartUrls && "opacity-75"
            )}
          >
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3 relative'>
              {!autoStartUrls && (
                <div className='absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center'>
                  <div className='bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md flex items-center gap-2'>
                    <Lock className='h-4 w-4 text-amber-500' />
                    <span className='text-sm font-medium'>
                      Enable Auto Start URLs first
                    </span>
                  </div>
                </div>
              )}
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <Globe className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>
                    Refresh on URLs Opening
                  </CardTitle>
                </div>
                <CardDescription>
                  Autostart Refresh When Any of These URLs Open
                </CardDescription>
              </div>
              <Switch
                id='refresh-on-opening'
                checked={refreshOnUrlsOpening}
                onCheckedChange={handleRefreshOnUrlsOpeningChange}
                disabled={!autoStartUrls || !urlsValid}
              />
            </CardHeader>
            <CardContent>
              {refreshOnUrlsOpening && autoStartUrls && (
                <div className='bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 p-3 rounded-md text-sm border border-green-100 dark:border-green-900'>
                  ✓ URLs will refresh automatically when opened
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Help Link */}
          <div className='mt-8 text-center'>
            <a
              href='#'
              className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Learn more about autostart settings
              <HelpCircle className='ml-1 h-4 w-4' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
