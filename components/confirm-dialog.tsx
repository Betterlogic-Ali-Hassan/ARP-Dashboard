"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  checkboxLabel?: string;
  checkboxDescription?: string;
  onCheckboxChange?: (checked: boolean) => void;
  checkboxDefaultChecked?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  checkboxLabel,
  checkboxDescription,
  onCheckboxChange,
  checkboxDefaultChecked = false,
}: ConfirmDialogProps) {
  // Split description by newlines to create paragraphs
  const descriptionParagraphs = description.split("\n\n");

  // State for checkbox if provided
  const [isChecked, setIsChecked] = useState(checkboxDefaultChecked);

  // Reset checkbox state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setIsChecked(checkboxDefaultChecked);
    }
  }, [open, checkboxDefaultChecked]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] w-[95vw]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {variant === "destructive" && (
              <AlertTriangle className='h-5 w-5 text-red-500' />
            )}
            {title}
          </DialogTitle>
          <div className='text-sm text-muted-foreground pt-2'>
            {descriptionParagraphs.map((paragraph, index) => (
              <p key={index} className={cn(index > 0 ? "mt-4" : "")}>
                {paragraph}
              </p>
            ))}
          </div>
        </DialogHeader>

        {/* Render checkbox if label is provided */}
        {checkboxLabel && (
          <div className='flex items-start space-x-2 py-2'>
            <Checkbox
              id='confirm-dialog-checkbox'
              checked={isChecked}
              onCheckedChange={(checked) => {
                const newValue = checked === true;
                setIsChecked(newValue);
                if (onCheckboxChange) onCheckboxChange(newValue);
              }}
            />
            <div className='grid gap-1.5 leading-none'>
              <label
                htmlFor='confirm-dialog-checkbox'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                {checkboxLabel}
              </label>
              {checkboxDescription && (
                <p className='text-sm text-muted-foreground'>
                  {checkboxDescription}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2  gap-2 mt-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full sm:w-auto max-sm:mt-3 '
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className='w-full sm:w-auto'
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
