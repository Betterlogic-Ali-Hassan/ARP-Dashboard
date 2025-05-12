"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotkeyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  onError?: (message: string) => void;
  id?: string;
}

export function HotkeyInput({
  value,
  onChange,
  disabled = false,
  placeholder = "Set Hotkey",
  onError,
}: HotkeyInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [displayValue, setDisplayValue] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Format key combinations for display
  const formatKeyCombo = (combo: string) => {
    if (!combo) return "";
    return combo
      .split("+")
      .map((key) => {
        // Capitalize first letter of each key
        return key.charAt(0).toUpperCase() + key.slice(1);
      })
      .join(" + ");
  };

  // Update display value when value prop changes
  useEffect(() => {
    setDisplayValue(formatKeyCombo(value));
  }, [value]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRecording || disabled) return;

    e.preventDefault();

    // Get modifier keys
    const modifiers = [];
    if (e.ctrlKey) modifiers.push("ctrl");
    if (e.altKey) modifiers.push("alt");
    if (e.shiftKey) modifiers.push("shift");
    if (e.metaKey) modifiers.push("meta"); // Command key on Mac

    // Get the main key
    let key = e.key.toLowerCase();

    // Skip if only modifier keys are pressed
    if (["control", "alt", "shift", "meta"].includes(key)) {
      return;
    }

    // Format special keys
    if (key === " ") key = "space";
    if (key === "escape") key = "esc";
    if (key === "arrowup") key = "up";
    if (key === "arrowdown") key = "down";
    if (key === "arrowleft") key = "left";
    if (key === "arrowright") key = "right";

    // Require at least one modifier key
    if (modifiers.length === 0) {
      onError?.(
        "Please include at least one modifier key (Ctrl, Alt, Shift, or Command)"
      );
      return;
    }

    // Create the key combination
    const keyCombo = [...modifiers, key].join("+");

    // Update the value
    onChange(keyCombo);
    setDisplayValue(formatKeyCombo(keyCombo));
    setIsRecording(false);
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsRecording(true);
      setDisplayValue("Press keys...");
    }
  };

  const handleBlur = () => {
    setIsRecording(false);
    setDisplayValue(formatKeyCombo(value));
  };

  return (
    <div className='relative'>
      <Input
        ref={inputRef}
        type='text'
        value={displayValue}
        onChange={() => {}} // Controlled input with no onChange handler
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly
        className={cn(
          "pr-10",
          isRecording && "border-green-500 ring-1 ring-green-500",
          disabled && "opacity-60"
        )}
      />
      <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
        <Keyboard
          className={cn(
            "h-4 w-4 text-muted-foreground",
            isRecording && "text-green-500"
          )}
        />
      </div>
    </div>
  );
}
