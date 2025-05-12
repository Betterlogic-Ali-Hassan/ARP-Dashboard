"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (success: boolean, immediate?: boolean) => void;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  onComplete,
}: CancelSubscriptionDialogProps) {
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelImmediately, setCancelImmediately] = useState(false);

  const handleReasonChange = (value: string) => {
    setReason(value);
    // Clear feedback if switching away from "other"
    if (value !== "other" && feedback) {
      setFeedback("");
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    // Simulate API call with immediate cancellation parameter
    setTimeout(() => {
      onComplete(true, cancelImmediately);
      setLoading(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setReason("");
    setFeedback("");
    setCancelImmediately(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent className='sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            We're sorry to see you go. Please let us know why you're canceling
            your subscription.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4 space-y-6'>
          <div>
            <h3 className='text-sm font-medium mb-3'>
              Reason for cancellation
            </h3>
            <RadioGroup
              value={reason}
              onValueChange={handleReasonChange}
              className='space-y-3'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='too-expensive' id='too-expensive' />
                <Label htmlFor='too-expensive'>Too expensive</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem
                  value='missing-features'
                  id='missing-features'
                />
                <Label htmlFor='missing-features'>
                  Missing features I need
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='not-using' id='not-using' />
                <Label htmlFor='not-using'>Not using it enough</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='switching' id='switching' />
                <Label htmlFor='switching'>Switching to another service</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='other' id='other' />
                <Label htmlFor='other'>Other reason</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Only show feedback textarea when "other" reason is selected */}
          <div
            className={`grid gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
              reason === "other"
                ? "max-h-[200px] opacity-100 my-6"
                : "max-h-0 opacity-0 my-0"
            }`}
          >
            {reason === "other" && (
              <>
                <Label htmlFor='feedback'>Additional feedback (optional)</Label>
                <Textarea
                  id='feedback'
                  placeholder='Tell us how we can improve...'
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </>
            )}
          </div>

          <div className='space-y-4'>
            <div className='flex items-start space-x-2'>
              <Checkbox
                id='cancelImmediately'
                checked={cancelImmediately}
                onCheckedChange={(checked) =>
                  setCancelImmediately(checked === true)
                }
                className='mt-1'
              />
              <div className='grid gap-1.5 leading-none'>
                <Label
                  htmlFor='cancelImmediately'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Cancel immediately and lose access now
                </Label>
                <p className='text-sm text-muted-foreground'>
                  Instead of waiting until the end of your billing period
                </p>
              </div>
            </div>
          </div>

          <div className='bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md'>
            <p className='text-sm text-amber-800 dark:text-amber-300'>
              {cancelImmediately
                ? "Your subscription will be cancelled immediately and you'll lose premium access right now."
                : "Your subscription will remain active until the end of your current billing period. You will not be charged again unless you reactivate your subscription."}
            </p>
          </div>
        </div>

        <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-between  sm:space-x-2 gap-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto max-sm:mt-2'
          >
            Keep Subscription
          </Button>
          <Button
            variant='destructive'
            onClick={handleSubmit}
            disabled={!reason || loading}
            className='w-full sm:w-auto'
          >
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
