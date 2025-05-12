"use client"

import * as React from "react"
import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  suffix?: string
  urlMode?: boolean
  audioValidation?: boolean
  onValidationChange?: (isValid: boolean, value: string) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, suffix, urlMode, audioValidation, onValidationChange, onChange, value, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState<string>((value as string) || "")
    const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle")

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string)
        if (audioValidation && (value as string)) {
          validateAudioUrl(value as string)
        }
      }
    }, [value, audioValidation])

    const validateAudioUrl = (url: string) => {
      if (!url) {
        setValidationState("idle")
        if (onValidationChange) onValidationChange(false, url)
        return
      }

      // Check if URL is valid
      try {
        new URL(url.startsWith("http") ? url : `https://${url}`)
      } catch (e) {
        setValidationState("invalid")
        if (onValidationChange) onValidationChange(false, url)
        return
      }

      // Check if file extension is valid audio format
      const validAudioFormats = ["mp3", "m4a", "ogg", "wav", "opus", "webm"]
      const fileExtension = url.split(".").pop()?.toLowerCase()

      if (fileExtension && validAudioFormats.includes(fileExtension)) {
        setValidationState("valid")
        if (onValidationChange) onValidationChange(true, url)
      } else {
        setValidationState("invalid")
        if (onValidationChange) onValidationChange(false, url)
      }
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      if (urlMode) {
        let processedValue = newValue

        // Remove http:// or https:// prefixes
        processedValue = processedValue.replace(/^https?:\/\//, "")

        // Remove www. prefix
        processedValue = processedValue.replace(/^www\./, "")

        // Prevent wildcards
        if (processedValue.includes("*")) {
          return
        }

        setInternalValue(processedValue)

        // Create a synthetic event to pass back the modified value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: processedValue,
          },
        }

        if (onChange) {
          onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
        }
      } else {
        setInternalValue(newValue)
        if (onChange) {
          onChange(e)
        }
      }

      // Validate audio URL if audioValidation is enabled
      if (audioValidation) {
        validateAudioUrl(newValue)
      }
    }

    const getInputClassName = () => {
      return cn(
        "flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm transition-colors duration-200 ease-in-out ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 hover:border-primary/30 hover:bg-background/50 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/20",
        validationState === "valid" &&
          audioValidation &&
          "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-400",
        validationState === "invalid" &&
          audioValidation &&
          "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-400",
        suffix && "pr-16",
        className,
      )
    }

    if (suffix) {
      return (
        <div className="relative">
          <input
            type={type}
            className={getInputClassName()}
            ref={ref}
            value={urlMode ? internalValue : value}
            onChange={handleUrlChange}
            {...props}
          />
          <span className="absolute right-0 top-0 flex h-full items-center justify-center rounded-r-md border-l border-input bg-muted px-3 text-xs font-medium text-muted-foreground">
            {suffix}
          </span>
          {audioValidation && validationState === "valid" && (
            <div className="absolute right-16 top-0 flex h-full items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {audioValidation && validationState === "invalid" && (
            <div className="absolute right-16 top-0 flex h-full items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={getInputClassName()}
          ref={ref}
          value={urlMode ? internalValue : value}
          onChange={handleUrlChange}
          {...props}
        />
        {audioValidation && validationState === "valid" && (
          <div className="absolute right-0 top-0 flex h-full items-center pr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {audioValidation && validationState === "invalid" && (
          <div className="absolute right-0 top-0 flex h-full items-center pr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
