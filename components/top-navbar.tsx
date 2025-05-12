"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Moon,
  Sun,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  Edit,
  LayoutGrid,
  CreditCard,
  Receipt,
  LogOut,
  Laptop,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useEffect } from "react";
import { Profile, useDeviceStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { LanguageSelectorModal } from "@/components/language-selector-modal";

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const [notificationCount] = useState(3);
  const { profiles } = useDeviceStore();
  const { toast } = useToast();
  const router = useRouter();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);

  // State for the active profile
  const [activeProfile, setActiveProfile] = useState<any>(null);

  // Load the last used profile from localStorage on component mount
  useEffect(() => {
    const lastUsedProfileId = localStorage.getItem("lastUsedProfileId");
    if (lastUsedProfileId) {
      const profile = profiles.find((p) => p.id === lastUsedProfileId);
      if (profile) {
        setActiveProfile(profile);
      } else {
        // If the saved profile doesn't exist anymore, use the default profile
        const defaultProfile = profiles.find((p) => p.isDefault);
        if (defaultProfile) {
          setActiveProfile(defaultProfile);
          localStorage.setItem("lastUsedProfileId", defaultProfile.id);
        }
      }
    } else {
      // If no profile was previously selected, use the default profile
      const defaultProfile = profiles.find((p) => p.isDefault);
      if (defaultProfile) {
        setActiveProfile(defaultProfile);
        localStorage.setItem("lastUsedProfileId", defaultProfile.id);
      }
    }
  }, [profiles]);

  // Handle profile change
  const handleProfileChange = (profile: Profile) => {
    setActiveProfile(profile);
    localStorage.setItem("lastUsedProfileId", profile.id);

    toast({
      title: "Profile Changed",
      description: `Switched to "${profile.name}"`,
      duration: 3000,
    });
  };

  // Handle edit profile
  const handleEditProfile = () => {
    if (activeProfile) {
      router.push("/settings-profiles");
    }
  };

  // Handle manage profiles
  const handleManageProfiles = () => {
    router.push("/settings-profiles");
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950'>
      <div className='container flex h-16 items-center px-4 sm:px-6'>
        <div className='flex items-center space-x-3'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-5 w-5'
              >
                <path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
                <path d='M3 3v5h5' />
                <path d='M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' />
                <path d='M16 16h5v5' />
              </svg>
            </div>
            <div className='flex items-center space-x-2'>
              <span className='hidden md:inline-block font-bold text-lg '>
                Auto Refresh Plus
              </span>
              <Badge
                variant='outline'
                className='bg-emerald-50 max-[410px]:hidden text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              >
                Premium
              </Badge>
            </div>
          </Link>

          {/* Profile Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='default'
                size='default'
                className='bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-9 px-3 max-w-[220px] text-left justify-between overflow-hidden transition-all duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none'
              >
                <div className='flex items-center gap-2'>
                  <div className='h-5 w-5 rounded-full bg-white/20 flex items-center justify-center'>
                    <Settings className='h-3 w-3 text-white' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='truncate font-medium leading-tight'>
                      {activeProfile ? activeProfile.name : "Select Profile"}
                    </span>
                    <span className='text-[10px] text-white/80 leading-tight'>
                      5 Devices
                    </span>
                  </div>
                </div>
                <ChevronDown className='h-4 w-4 text-white/70' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-[200px]'>
              <DropdownMenuLabel>Settings Profiles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {profiles.map((profile) => (
                <DropdownMenuItem
                  key={profile.id}
                  onClick={() => handleProfileChange(profile)}
                  className={activeProfile?.id === profile.id ? "bg-muted" : ""}
                >
                  <div className='flex items-center justify-between w-full'>
                    <span className='truncate'>{profile.name}</span>
                    {profile.isDefault && (
                      <Badge className='ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 text-[10px] h-5'>
                        Default
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEditProfile}>
                <Edit className='mr-2 h-4 w-4' />
                <span>Edit Current Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleManageProfiles}>
                <LayoutGrid className='mr-2 h-4 w-4' />
                <span>Manage Profiles</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='flex-1' />

        <div className='flex items-center space-x-4'>
          {/* Notifications */}
          <Button variant='ghost' size='icon' className='h-9 w-9 relative'>
            <Bell className='h-4 w-4' />
            {notificationCount > 0 && (
              <span className='absolute top-1 right-1 h-4 w-4 text-[10px] font-medium flex items-center justify-center rounded-full bg-red-500 text-white'>
                {notificationCount}
              </span>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
                <Avatar className='h-9 w-9'>
                  <AvatarImage
                    src='/placeholder.svg?height=36&width=36'
                    alt='User'
                  />
                  <AvatarFallback>HM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-64' align='end' forceMount>
              {/* User Info Section - Redesigned */}
              <div className='relative overflow-hidden'>
                {/* Background gradient */}
                <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 dark:from-emerald-900/30 dark:to-blue-900/30' />

                <div className='relative px-4 pt-4 pb-5'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-12 w-12 ring-2 ring-white dark:ring-gray-800 ring-offset-2 ring-offset-emerald-50 dark:ring-offset-gray-950'>
                      <AvatarImage
                        src='/placeholder.svg?height=48&width=48'
                        alt='User'
                      />
                      <AvatarFallback>HM</AvatarFallback>
                    </Avatar>

                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <p className='font-semibold text-base'>
                          Hashim Mansoor
                        </p>
                        <Badge
                          variant='outline'
                          className='bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 h-5 px-1.5 text-[10px]'
                        >
                          Premium
                        </Badge>
                      </div>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        hashim@example.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className='my-1' />

              {/* Main Menu Items */}
              <DropdownMenuGroup className='p-1'>
                <DropdownMenuItem
                  className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  asChild
                >
                  <Link href='/pricing-page'>
                    <CreditCard className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                    <span>Pricing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  asChild
                >
                  <Link href='/account/subscription'>
                    <Receipt className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                    <span>Subscription</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  asChild
                >
                  <Link href='/support'>
                    <HelpCircle className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  asChild
                >
                  <Link href='/settings'>
                    <Settings className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800'
                  onClick={() => setLanguageModalOpen(true)}
                >
                  <Globe className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                  <span>Language</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className='my-1' />

              {/* Theme Toggle Section */}
              <div className='px-3 py-2'>
                <div className='mb-2 text-xs font-medium text-muted-foreground'>
                  Appearance
                </div>
                <div className='flex items-center justify-between rounded-md border p-2 dark:border-gray-700'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <div className='text-sm font-medium'>
                        {theme === "system"
                          ? "System"
                          : theme === "dark"
                          ? "Dark"
                          : "Light"}
                      </div>
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={`h-8 w-8 rounded-md ${
                        theme === "light" ? "bg-gray-200 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => setTheme("light")}
                      title='Light Mode'
                    >
                      <Sun className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={`h-8 w-8 rounded-md ${
                        theme === "dark" ? "bg-gray-200 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => setTheme("dark")}
                      title='Dark Mode'
                    >
                      <Moon className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className={`h-8 w-8 rounded-md ${
                        theme === "system" ? "bg-gray-200 dark:bg-gray-700" : ""
                      }`}
                      onClick={() => setTheme("system")}
                      title='System Setting'
                    >
                      <Laptop className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator className='my-1' />

              {/* Logout Option */}
              <div className='p-1'>
                <DropdownMenuItem className='flex cursor-pointer items-center gap-2 rounded-md px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/50 dark:hover:text-red-400'>
                  <LogOut className='h-4 w-4' />
                  <span>Log out</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        open={languageModalOpen}
        onOpenChange={setLanguageModalOpen}
      />
    </header>
  );
}
