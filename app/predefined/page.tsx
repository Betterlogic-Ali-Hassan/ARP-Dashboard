"use client";

import type React from "react";

import {
  useState,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  ExternalLink,
  AlarmClock,
  LinkIcon,
  AlertTriangle,
  X,
  Circle,
  Upload,
  Download,
  Trash2,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

export default function PredefinedPage() {
  // State for form controls
  const [predefinedText, setPredefinedText] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showCommaHelp, setShowCommaHelp] = useState(false);
  const [predefinedUrl, setPredefinedUrl] = useState(false);
  const [predefinedUrlValue, setPredefinedUrlValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for comma in input to show help text
  useEffect(() => {
    if (inputValue.includes(",")) {
      setShowCommaHelp(true);
    } else {
      setShowCommaHelp(false);
    }
  }, [inputValue]);

  const addKeywords = (value: string) => {
    if (value.includes(", ")) {
      // Handle bulk keywords (comma + space separated)
      const newKeywords = value.split(", ").filter((k) => k.trim() !== "");
      setKeywords([...keywords, ...newKeywords]);
    } else {
      // Handle single keyword
      setKeywords([...keywords, value]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addKeywords(inputValue.trim());
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      keywords.length > 0
    ) {
      setKeywords(keywords.slice(0, -1));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes(", ")) {
      e.preventDefault();
      addKeywords(pastedText);
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const clearAllKeywords = () => {
    setKeywords([]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Process file content - split by newlines and/or commas
        const lines = content
          .split(/\r?\n/)
          .filter((line) => line.trim() !== "");
        const newKeywords: string[] = [];

        lines.forEach((line) => {
          if (line.includes(",")) {
            // Handle comma-separated values on each line
            const lineKeywords = line
              .split(",")
              .map((k) => k.trim())
              .filter((k) => k !== "");
            newKeywords.push(...lineKeywords);
          } else {
            // Handle single keyword per line
            newKeywords.push(line.trim());
          }
        });

        setKeywords([...keywords, ...newKeywords]);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExportKeywords = () => {
    if (keywords.length === 0) return;

    const content = keywords.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "predefined_keywords.txt";
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[56rem]'>
          <h1 className='mb-6 text-3xl font-bold tracking-tight max-md:ml-[52px]'>
            Predefined
          </h1>

          {/* Predefined Text */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <AlarmClock className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>Predefined Text</CardTitle>
                </div>
                <CardDescription>
                  Insert one or multiple keywords here, and as soon as any are
                  found on the web page, Auto Refresh Plus will begin auto page
                  refreshing at the default interval frequency.
                </CardDescription>
              </div>
              <Switch
                id='predefined-text'
                checked={predefinedText}
                onCheckedChange={setPredefinedText}
              />
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {/* Multi-keyword input component */}
                <div
                  className={`flex flex-wrap items-center gap-2 p-2 border rounded-md ${
                    !predefinedText
                      ? "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                      : "bg-white dark:bg-gray-900"
                  } ${
                    inputValue && predefinedText
                      ? "ring-2 ring-red-300 dark:ring-red-700/40"
                      : ""
                  }`}
                  onClick={focusInput}
                >
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-md text-sm'
                    >
                      <span>{keyword}</span>
                      <button
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          removeKeyword(index);
                        }}
                        disabled={!predefinedText}
                        className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </div>
                  ))}
                  <input
                    ref={inputRef}
                    type='text'
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    disabled={!predefinedText}
                    className='flex-grow min-w-[120px] bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-sm'
                    placeholder={
                      keywords.length === 0
                        ? "Type and press Enter to add keywords"
                        : ""
                    }
                  />
                  {inputValue && predefinedText && !showCommaHelp && (
                    <span className='text-xs text-red-500 dark:text-red-400 ml-auto'>
                      Press Enter
                    </span>
                  )}
                </div>

                {/* Dynamic comma help text */}
                {showCommaHelp && predefinedText && (
                  <div className='flex items-center gap-1.5 text-xs text-orange-500 dark:text-orange-400 pl-1'>
                    <Circle className='h-2.5 w-2.5 fill-orange-500 dark:fill-orange-400' />
                    <span>For bulk keywords, use a space after each comma</span>
                  </div>
                )}

                {/* Import/Export/Clear buttons */}
                {predefinedText && (
                  <div className='flex flex-wrap gap-2 mt-3'>
                    <input
                      type='file'
                      ref={fileInputRef}
                      accept='.txt'
                      className='hidden'
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-xs h-8'
                      onClick={triggerFileInput}
                      disabled={!predefinedText}
                    >
                      <Upload className='h-3.5 w-3.5 mr-1.5' />
                      Import Keywords
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='text-xs h-8'
                      onClick={handleExportKeywords}
                      disabled={!predefinedText || keywords.length === 0}
                    >
                      <Download className='h-3.5 w-3.5 mr-1.5' />
                      Export Keywords
                    </Button>
                    {keywords.length > 0 && (
                      <Button
                        variant='outline'
                        size='sm'
                        className='text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/50'
                        onClick={clearAllKeywords}
                        disabled={!predefinedText}
                      >
                        <Trash2 className='h-3.5 w-3.5 mr-1.5' />
                        Clear All
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className='flex justify-end pt-2 pb-4'>
              <Button
                variant='outline'
                size='sm'
                className='text-xs h-8'
                asChild
              >
                <a
                  href='#'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center'
                >
                  Supported Expressions
                  <ExternalLink className='ml-1.5 h-3.5 w-3.5' />
                </a>
              </Button>
            </CardFooter>
          </Card>

          {/* Predefined URL */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <LinkIcon className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <CardTitle className='text-xl'>Predefined URL</CardTitle>
                </div>
                <CardDescription>
                  Enter a specific URL here to refresh this URL, rather than the
                  current tab you're using. So, for example, if you save
                  Google.com into the settings and then start the auto-refresh
                  while on Yahoo.com, Google.com will be refreshing, rather than
                  the page you're looking at.
                </CardDescription>
              </div>
              <Switch
                id='predefined-url'
                checked={predefinedUrl}
                onCheckedChange={setPredefinedUrl}
              />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Input
                  placeholder='(e.g., google.com)'
                  value={predefinedUrlValue}
                  onChange={(e) => setPredefinedUrlValue(e.target.value)}
                  disabled={!predefinedUrl}
                  urlMode={true}
                />

                {predefinedUrl && (
                  <div className='bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 dark:border-amber-500 rounded-md p-4 shadow-sm'>
                    <div className='flex items-start'>
                      <div className='flex-shrink-0'>
                        <div className='w-7 h-7 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/70'>
                          <AlertTriangle className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                        </div>
                      </div>
                      <div className='ml-3'>
                        <h3 className='text-sm font-medium text-amber-800 dark:text-amber-300'>
                          URL Limitation Warning
                        </h3>
                        <div className='mt-1 text-sm text-amber-700 dark:text-amber-400'>
                          <p>
                            Enabling the "Refresh Predefined URL" feature will
                            limit all auto-refresh functions to the specified
                            URL only that you write in this input. You will not
                            be able to refresh any other URLs when this feature
                            is active.{" "}
                            <a
                              href='#'
                              className='font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-200 underline'
                            >
                              Read more
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer Help Link */}
          <div className='mt-8 text-center'>
            <a
              href='#'
              className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              How to use predefined settings
              <ExternalLink className='ml-1 h-4 w-4' />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
