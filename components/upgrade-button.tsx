"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { SubscriptionDialog } from "@/components/subscription-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface UpgradeButtonProps extends ButtonProps {
  targetPlan?: string;
  showIcon?: boolean;
  variant?: "default" | "destructive" | "outline" | "ghost" | "link" | "muted";
  size?: "default" | "sm" | "lg" | "icon";
}

export function UpgradeButton({
  targetPlan = "team",
  showIcon = true,
  variant = "default",
  size = "default",
  className,
  children,
  ...props
}: UpgradeButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);

  const handleUpgrade = () => {
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
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleUpgrade}
        {...props}
      >
        {showIcon && <Crown className='mr-2 h-4 w-4' />}
        {children || "Upgrade"}
      </Button>

      <SubscriptionDialog
        open={subscriptionDialogOpen}
        onOpenChange={setSubscriptionDialogOpen}
        plan={targetPlan}
        billingPeriod='yearly'
        onComplete={handleSubscriptionComplete}
        isUpgrade={true}
      />
    </>
  );
}
