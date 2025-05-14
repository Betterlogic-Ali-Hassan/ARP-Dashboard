"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  Monitor,
  Settings,
  Clock,
  Play,
  ListChecks,
  Menu,
  X,
  Timer,
  Eye,
  Bell,
  Code,
  Keyboard,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PremiumFeatureDialog } from "@/components/premium-feature-dialog";

interface NavSection {
  title: string;
  items: (
    | {
        name: string;
        href: string;
        icon: React.ReactNode;
        active?: boolean;
        badge?: React.ReactNode;
      }
    | {
        type: "divider";
      }
  )[];
}

export function Sidebar({ activePage }: { activePage?: string }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPremiumDialogOpen, setIsPremiumDialogOpen] = useState(false);

  const navSections: NavSection[] = [
    {
      title: "Admin Settings",
      items: [
        {
          name: "Synchronizing",
          href: "/Synchronizing",
          icon: <RefreshCw className='h-5 w-5' />,
          active:
            activePage === "synchronizing" || pathname === "/Synchronizing",
        },
        {
          name: "Devices",
          href: "/devices",
          icon: <Monitor className='h-5 w-5' />,
          active: activePage === "devices" || pathname === "/devices",
          badge: (
            <span className='ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-[#e6f4ea] text-[#22863a]'>
              7
            </span>
          ),
        },
        {
          name: "Settings Profiles",
          href: "/settings-profiles",
          icon: <Settings className='h-5 w-5' />,
          active:
            activePage === "settings-profiles" ||
            pathname === "/settings-profiles",
          badge: (
            <span className='ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-[#e6f0ff] text-[#1a73e8]'>
              3
            </span>
          ),
        },
        {
          type: "divider",
        },
        {
          name: "Active Tabs",
          href: "/active-tabs",
          icon: <Layers className='h-5 w-5' />,
          active: pathname === "/active-tabs",
        },
        {
          name: "Notification Center",
          href: "/notifications",
          icon: <Bell className='h-5 w-5' />,
          active: pathname === "/notifications",
          badge: (
            <span className='ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-[#fef0f0] text-[#e53935]'>
              3
            </span>
          ),
        },
        {
          type: "divider",
        },
      ],
    },
    {
      title: "Extension Settings",
      items: [
        {
          name: "Time Interval",
          href: "/time-interval",
          icon: <Clock className='h-5 w-5' />,
          active: pathname === "/time-interval",
        },
        // "General" entry removed from here
        {
          name: "Autostart",
          href: "/autostart",
          icon: <Play className='h-5 w-5' />,
          active: pathname === "/autostart",
        },
        {
          name: "Predefined",
          href: "/predefined",
          icon: <ListChecks className='h-5 w-5' />,
          active: pathname === "/predefined",
        },
        {
          name: "Countdown",
          href: "/countdown",
          icon: <Timer className='h-5 w-5' />,
          active: pathname === "/countdown",
        },
        {
          name: "Page Monitor",
          href: "/page-monitor",
          icon: <Eye className='h-5 w-5' />,
          active: pathname === "/page-monitor",
        },
        {
          name: "Custom Scripts",
          href: "/custom-scripts",
          icon: <Code className='h-5 w-5' />,
          active: pathname === "/custom-scripts",
        },
        {
          name: "Hotkeys",
          href: "/hotkeys",
          icon: <Keyboard className='h-5 w-5' />,
          active: pathname === "/hotkeys",
        },
        {
          name: "Notification Settings",
          href: "/notification-settings",
          icon: <Bell className='h-5 w-5' />,
          active: pathname === "/notification-settings",
        },
      ],
    },
    // "Other" section removed as those items are now in the user dropdown menu
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant='outline'
        size='icon'
        className='fixed top-20 left-4 z-10 md:hidden'
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className='h-5 w-5' />
        <span className='sr-only'>Toggle menu</span>
      </Button>

      {/* Sidebar for desktop */}
      <div
        className={cn(
          "fixed top-16 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto h-[calc(100vh-4rem)]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className='flex flex-col h-full relative'>
          {/* User profile */}
          <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
            <div className='flex items-center space-x-3'>
              <Avatar>
                <AvatarImage
                  src='/placeholder.svg?height=40&width=40'
                  alt='User'
                />
                <AvatarFallback>HM</AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>Hashim Mansoor</div>
                <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1'>
                  <span>Team</span>
                  <span>•</span>
                  <span>7 Devices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='flex-1 py-4 overflow-y-auto'>
            {navSections.map((section, index) => (
              <div key={index} className='mb-6'>
                <h3 className='px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase'>
                  {section.title}
                </h3>
                <ul className='space-y-1'>
                  {section.items.map((item, itemIndex) =>
                    "type" in item && item.type === "divider" ? (
                      <li key={itemIndex} className='px-4 py-2'>
                        <div className='border-t border-gray-200 dark:border-gray-800'></div>
                      </li>
                    ) : (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                            item.active
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                          )}
                        >
                          <span
                            className={cn(
                              "mr-3",
                              item.active
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-gray-500 dark:text-gray-400"
                            )}
                          >
                            {item.icon}
                          </span>
                          {item.name}
                          {item.badge}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Upgrade button */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
            <Button
              className='w-full '
              onClick={() => setIsPremiumDialogOpen(true)}
            >
              Upgrade Plan
            </Button>
          </div>
          {/* Premium Feature Dialog */}
          <PremiumFeatureDialog
            open={isPremiumDialogOpen}
            onOpenChange={setIsPremiumDialogOpen}
            featureName='Premium Plan Features'
            isLoggedIn={true}
          />
          <Button
            variant='ghost'
            className='absolute top-0 right-2 p-0 !bg-transparent md:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={22} />
          </Button>
        </div>
      </div>
    </>
  );
}
