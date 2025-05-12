"use client"

import React, { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface UrlPatternTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValidChange?: (isValid: boolean, value: string) => void
}

// Updated regex to support more URL patterns
const URL_PATTERN_REGEX =
  /^((\*\.)?[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z0-9][-a-zA-Z0-9]*)((\/[a-zA-Z0-9][-a-zA-Z0-9_]*)*)(\/\*)?$/

const UrlPatternTextarea = React.forwardRef<HTMLTextAreaElement, UrlPatternTextareaProps>(
  ({ className, onValidChange, onChange, value, ...props }, ref) => {
    const [invalidLines, setInvalidLines] = useState<number[]>([])
    const [internalValue, setInternalValue] = useState<string>(
      value?.toString() || props.defaultValue?.toString() || "",
    )
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Combine the forwarded ref with our local ref
    const handleRef = (element: HTMLTextAreaElement) => {
      textareaRef.current = element
      if (typeof ref === "function") {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
    }

    // Update internal value when external value changes
    useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value.toString())
        validateLines(value.toString())
      }
    }, [value])

    const validateLines = (text: string) => {
      const lines = text.split("\n")
      const newInvalidLines: number[] = []

      lines.forEach((line, index) => {
        const trimmedLine = line.trim()
        if (trimmedLine && !URL_PATTERN_REGEX.test(trimmedLine)) {
          newInvalidLines.push(index)
        }
      })

      setInvalidLines(newInvalidLines)

      if (onValidChange) {
        onValidChange(newInvalidLines.length === 0, text)
      }

      return newInvalidLines
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)
      validateLines(newValue)

      if (onChange) {
        onChange(e)
      }
    }

    useEffect(() => {
      // Initial validation
      if (internalValue) {
        validateLines(internalValue)
      }
    }, [])

    return (
      <div className="relative">
        <Textarea
          ref={handleRef}
          className={cn(invalidLines.length > 0 && "border-red-500 focus-visible:ring-red-500", className)}
          onChange={handleChange}
          value={internalValue}
          {...props}
        />
        {invalidLines.length > 0 && (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1.5">
                <p className="font-medium text-red-800">
                  Invalid URL pattern format on {invalidLines.length > 1 ? "lines" : "line"}{" "}
                  {invalidLines.map((i) => i + 1).join(", ")}.
                </p>
                <p className="text-red-700">Please use one of these formats:</p>
                <div className="grid gap-1.5 pl-1 text-red-700">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-xs">example.com</code>
                    <span className="text-xs">- matches both HTTP and HTTPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-xs">example.com/path</code>
                    <span className="text-xs">- matches specific path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-xs">example.com/path/*</code>
                    <span className="text-xs">- matches all pages under path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-xs">sub.example.com</code>
                    <span className="text-xs">- matches specific subdomain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <code className="bg-red-100 px-1.5 py-0.5 rounded font-mono text-xs">*.example.com/*</code>
                    <span className="text-xs">- matches all subdomains and paths</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
)

UrlPatternTextarea.displayName = "UrlPatternTextarea"

export { UrlPatternTextarea }
