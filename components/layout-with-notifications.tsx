"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { SubscriptionNotification } from "@/components/subscription-notification";
import { useSubscriptionStore } from "@/lib/subscription-store";

interface LayoutWithNotificationsProps {
  children: React.ReactNode;
}

export function LayoutWithNotifications({
  children,
}: LayoutWithNotificationsProps) {
  const [mounted, setMounted] = useState(false);
  const { status, expiryDate } = useSubscriptionStore();

  // Ensure hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='min-h-screen bg-background text-foreground'>
        {children}
        <Toaster />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {status === "scheduled_downgrade" && expiryDate && (
        <SubscriptionNotification expiryDate={expiryDate} />
      )}
      {children}
      <Toaster />
    </div>
  );
}
