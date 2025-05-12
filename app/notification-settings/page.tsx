"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Bell,
  Volume2,
  Play,
  Mail,
  Link,
  Trash2,
  Edit2,
  Plus,
  Check,
  AlertCircle,
  ExternalLink,
  Info,
  Globe,
  MessageSquare,
  Send,
  FileText,
  Smartphone,
  Zap,
  Loader2,
  X,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from "@/components/ui/custom-radio-group";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Define webhook service options with icons
const webhookServices = [
  { id: "custom", name: "Custom URL", icon: Globe },
  { id: "discord", name: "Discord", icon: MessageSquare },
  { id: "slack", name: "Slack", icon: MessageSquare },
  { id: "telegram", name: "Telegram", icon: Send },
  { id: "mattermost", name: "Mattermost", icon: FileText },
  { id: "pushbullet", name: "Mobile Pushbullet", icon: Smartphone },
  { id: "ifttt", name: "IFTTT", icon: Zap },
];

export default function NotificationSettingsPage() {
  // Sound Playback Settings
  const [soundOption, setSoundOption] = useState("never");
  const [soundUrl, setSoundUrl] = useState("");
  const [volume, setVolume] = useState([50]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMessage, setPlaybackMessage] = useState("");

  // Sound Length Settings
  const [soundLength, setSoundLength] = useState("until_click");
  const [customSeconds, setCustomSeconds] = useState("10");

  // Email Notification Settings
  const [email, setEmail] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: "", message: "" });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Webhook Settings
  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "Google Sheet Hook",
      service: "Custom URL",
      url: "https://example.com/success",
      enabled: true,
    },
    {
      id: 2,
      name: "Telegram Bot",
      service: "Telegram",
      url: "https://example.com/fail",
      enabled: true,
    },
  ]);
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<null | number>(null);
  const [webhookName, setWebhookName] = useState("");
  const [webhookService, setWebhookService] = useState("Custom URL");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookMessage, setWebhookMessage] = useState({
    type: "",
    message: "",
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<number | null>(null);

  // URL validation states
  const [isValidatingUrl, setIsValidatingUrl] = useState(false);
  const [urlValidationStatus, setUrlValidationStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [urlValidationMessage, setUrlValidationMessage] = useState("");
  const urlValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // URL validation states
  const [isValidatingAudioUrl, setIsValidatingAudioUrl] = useState(false);
  const [audioUrlValidationStatus, setAudioUrlValidationStatus] = useState<
    "idle" | "validating" | "valid" | "invalid"
  >("idle");
  const [audioUrlValidationMessage, setAudioUrlValidationMessage] =
    useState("");
  const audioUrlValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle sound test play
  const handleTestPlay = () => {
    if (soundOption === "never") {
      setPlaybackMessage("Sound playback is disabled.");
      return;
    }

    if (soundOption === "url" && audioUrlValidationStatus !== "valid") {
      setPlaybackMessage("Please validate the audio URL first.");
      return;
    }

    setIsPlaying(true);
    setPlaybackMessage("Playing sound...");

    // Simulate sound playback
    setTimeout(() => {
      setIsPlaying(false);
      setPlaybackMessage("Sound played successfully!");

      // Clear message after 3 seconds
      setTimeout(() => {
        setPlaybackMessage("");
      }, 3000);
    }, 2000);
  };

  // Handle audio URL validation
  const validateAudioUrl = (url: string) => {
    // Clear any previous validation timeout
    if (audioUrlValidationTimeoutRef.current) {
      clearTimeout(audioUrlValidationTimeoutRef.current);
    }

    // Reset validation state if URL is empty
    if (!url.trim()) {
      setAudioUrlValidationStatus("idle");
      setAudioUrlValidationMessage("");
      return;
    }

    // Start validation process
    setIsValidatingAudioUrl(true);
    setAudioUrlValidationStatus("validating");

    // Check if URL has a valid audio file extension
    const validAudioFormats = ["mp3", "m4a", "ogg", "wav", "opus", "webm"];
    const fileExtension = url.split(".").pop()?.toLowerCase();
    const hasValidExtension =
      fileExtension && validAudioFormats.includes(fileExtension);

    // Simulate network request to validate URL accessibility
    audioUrlValidationTimeoutRef.current = setTimeout(() => {
      if (!hasValidExtension) {
        setAudioUrlValidationStatus("invalid");
        setAudioUrlValidationMessage(
          `Invalid audio format. Supported formats: ${validAudioFormats.join(
            ", "
          )}`
        );
      } else if (url.includes("error") || url.includes("fail")) {
        // Simulate failure for URLs containing "error" or "fail"
        setAudioUrlValidationStatus("invalid");
        setAudioUrlValidationMessage(
          "Unable to access this audio file. Please check the URL and try again."
        );
      } else {
        setAudioUrlValidationStatus("valid");
        setAudioUrlValidationMessage("Audio URL validated successfully!");
      }
      setIsValidatingAudioUrl(false);
    }, 1500); // Simulate network delay
  };

  // Handle audio URL change
  const handleAudioUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setSoundUrl(newUrl);

    // Reset validation state when user starts typing
    if (audioUrlValidationStatus !== "idle") {
      setAudioUrlValidationStatus("idle");
      setAudioUrlValidationMessage("");
    }
  };

  // Handle audio URL submission
  const handleAudioUrlSubmit = () => {
    if (!soundUrl.trim()) {
      setAudioUrlValidationStatus("invalid");
      setAudioUrlValidationMessage("Please enter an audio URL");
      return;
    }

    validateAudioUrl(soundUrl);
  };

  // Handle email verification
  const handleVerifyEmail = () => {
    if (!email || !email.includes("@")) {
      setEmailMessage({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setShowOtpInput(true);
    setEmailMessage({
      type: "info",
      message: "Verification code sent to your email. Please check your inbox.",
    });
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 6) {
      verifyOtp(newOtp.join(""));
    }
  };

  // Handle OTP verification
  const verifyOtp = (otpValue: string) => {
    if (otpValue === "111111") {
      setEmailVerified(true);
      setEmailMessage({
        type: "success",
        message: "Email added successfully for notifications",
      });
      setShowOtpInput(false);
    } else if (otpValue === "222222") {
      setEmailMessage({
        type: "error",
        message: "Verification failed. Please try again.",
      });
      setOtp(["", "", "", "", "", ""]);
    } else {
      setEmailMessage({
        type: "error",
        message: "Invalid OTP. Please try again.",
      });
      setOtp(["", "", "", "", "", ""]);
    }
  };

  // Handle webhook test
  const handleTestWebhook = (url: string) => {
    if (url.includes("/success")) {
      setWebhookMessage({
        type: "success",
        message: "Webhook connection successful.",
      });
    } else if (url.includes("/fail")) {
      setWebhookMessage({
        type: "error",
        message: "Webhook test failed. Please check the URL and try again.",
      });
    } else {
      setWebhookMessage({ type: "error", message: "Invalid webhook URL." });
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setWebhookMessage({ type: "", message: "" });
    }, 3000);
  };

  // Handle webhook URL validation
  const validateWebhookUrl = (url: string) => {
    // Reset previous timeout if exists
    if (urlValidationTimeoutRef.current) {
      clearTimeout(urlValidationTimeoutRef.current);
    }

    // Don't validate empty URLs
    if (!url.trim()) {
      setUrlValidationStatus("idle");
      setUrlValidationMessage("");
      return;
    }

    setUrlValidationStatus("validating");

    // Simulate API call with timeout
    urlValidationTimeoutRef.current = setTimeout(() => {
      if (url.includes("/success")) {
        setUrlValidationStatus("valid");
        setUrlValidationMessage("URL verified successfully.");
      } else if (url.includes("/fail")) {
        setUrlValidationStatus("invalid");
        setUrlValidationMessage(
          "URL is not responding. Please check and try again."
        );
      } else {
        setUrlValidationStatus("invalid");
        setUrlValidationMessage(
          "Invalid URL format. Please enter a valid webhook URL."
        );
      }
    }, 1500); // Simulate network delay
  };

  // Handle webhook URL change
  const handleWebhookUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setWebhookUrl(newUrl);
    validateWebhookUrl(newUrl);
  };

  // Handle webhook form submission
  const handleWebhookSubmit = () => {
    if (!webhookName || !webhookUrl || urlValidationStatus !== "valid") {
      setWebhookMessage({
        type: "error",
        message: !webhookName
          ? "Please enter a webhook name."
          : !webhookUrl
          ? "Please enter a webhook URL."
          : "Please ensure the webhook URL is valid.",
      });
      return;
    }

    if (editingWebhook !== null) {
      // Update existing webhook
      setWebhooks(
        webhooks.map((webhook) =>
          webhook.id === editingWebhook
            ? {
                ...webhook,
                name: webhookName,
                service: webhookService,
                url: webhookUrl,
              }
            : webhook
        )
      );
    } else {
      // Add new webhook
      const newWebhook = {
        id: Date.now(),
        name: webhookName,
        service: webhookService,
        url: webhookUrl,
        enabled: true,
      };
      setWebhooks([...webhooks, newWebhook]);
    }

    // Reset form
    resetWebhookForm();
    setWebhookMessage({
      type: "success",
      message: `Webhook ${
        editingWebhook !== null ? "updated" : "added"
      } successfully!`,
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setWebhookMessage({ type: "", message: "" });
    }, 3000);
  };

  // Reset webhook form
  const resetWebhookForm = () => {
    setWebhookName("");
    setWebhookService("Custom URL");
    setWebhookUrl("");
    setShowWebhookForm(false);
    setEditingWebhook(null);
    setUrlValidationStatus("idle");
    setUrlValidationMessage("");

    if (urlValidationTimeoutRef.current) {
      clearTimeout(urlValidationTimeoutRef.current);
    }
  };

  // Handle webhook edit
  const handleEditWebhook = (webhook: any) => {
    setEditingWebhook(webhook.id);
    setWebhookName(webhook.name);
    setWebhookService(webhook.service);
    setWebhookUrl(webhook.url);
    setShowWebhookForm(true);

    // Validate the URL immediately when editing
    validateWebhookUrl(webhook.url);
  };

  // Handle webhook delete
  const handleDeleteWebhook = (id: number) => {
    const webhook = webhooks.find((wh) => wh.id === id);
    if (webhook) {
      setWebhookToDelete(id);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDeleteWebhook = () => {
    if (webhookToDelete) {
      setWebhooks(webhooks.filter((webhook) => webhook.id !== webhookToDelete));
      setWebhookMessage({
        type: "success",
        message: "Webhook deleted successfully!",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setWebhookMessage({ type: "", message: "" });
      }, 3000);
    }
    setWebhookToDelete(null);
  };

  // Handle webhook toggle
  const handleToggleWebhook = (id: number) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id ? { ...webhook, enabled: !webhook.enabled } : webhook
      )
    );
  };

  // Handle service tag selection
  const handleServiceTagSelect = (serviceName: string) => {
    setWebhookService(serviceName);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[56rem]'>
          <h1 className='mb-6 text-3xl font-bold tracking-tight max-md:ml-[52px]'>
            Notifications
          </h1>

          {/* Section 1: Push Notification Sound Playback Settings */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Volume2 className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>
                  Push Notification Sound Playback Settings
                </CardTitle>
              </div>
              <CardDescription>
                Configure how sound notifications are played when the page
                monitor detects changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomRadioGroup
                value={soundOption}
                onValueChange={setSoundOption}
                className='space-y-5'
              >
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='never' id='never' />
                  <Label htmlFor='never' className='text-base leading-6'>
                    Never Play Sound
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='candidate1' id='candidate1' />
                  <Label htmlFor='candidate1' className='text-base leading-6'>
                    Play Sound Candidate 1 (1 Second)
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='candidate2' id='candidate2' />
                  <Label htmlFor='candidate2' className='text-base leading-6'>
                    Play Sound Candidate 2 (6 Seconds)
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='url' id='url' />
                  <Label htmlFor='url' className='text-base leading-6'>
                    Play Sound From URL:
                  </Label>
                </div>

                {soundOption === "url" && (
                  <div className='ml-9 mt-3 space-y-3'>
                    <div className='flex flex-col sm:flex-row sm:items-start gap-3 max-w-md'>
                      <div className='relative flex-1'>
                        <Input
                          placeholder='Enter audio URL (mp3, m4a, ogg, wav, opus, webm)'
                          value={soundUrl}
                          onChange={handleAudioUrlChange}
                          className={cn(
                            audioUrlValidationStatus === "valid" &&
                              "border-green-500 focus-visible:border-green-500 focus-visible:ring-green-400",
                            audioUrlValidationStatus === "invalid" &&
                              "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-400",
                            "pr-10"
                          )}
                          disabled={isValidatingAudioUrl}
                        />
                        {audioUrlValidationStatus !== "idle" && (
                          <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                            {audioUrlValidationStatus === "validating" ? (
                              <Loader2 className='h-4 w-4 text-gray-400 animate-spin' />
                            ) : audioUrlValidationStatus === "valid" ? (
                              <Check className='h-4 w-4 text-green-500' />
                            ) : (
                              <X className='h-4 w-4 text-red-500' />
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={handleAudioUrlSubmit}
                        disabled={isValidatingAudioUrl || !soundUrl.trim()}
                        className='min-w-[80px]'
                      >
                        {isValidatingAudioUrl ? (
                          <div className='flex items-center gap-1'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            <span>Validating</span>
                          </div>
                        ) : (
                          <span>Validate</span>
                        )}
                      </Button>
                    </div>

                    {audioUrlValidationMessage && (
                      <div
                        className={cn(
                          "p-3 rounded-md text-sm flex items-center gap-2",
                          audioUrlValidationStatus === "valid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        )}
                      >
                        {audioUrlValidationStatus === "valid" ? (
                          <Check className='h-4 w-4 flex-shrink-0' />
                        ) : (
                          <AlertCircle className='h-4 w-4 flex-shrink-0' />
                        )}
                        <span>{audioUrlValidationMessage}</span>
                      </div>
                    )}

                    {audioUrlValidationStatus === "valid" && (
                      <div className='flex items-center gap-2 p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-sm border border-blue-100 dark:border-blue-900/30'>
                        <Info className='h-4 w-4 flex-shrink-0' />
                        <span>
                          Audio URL has been validated and is ready to use.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CustomRadioGroup>

              <div className='mt-8 space-y-5'>
                <div className='bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border border-gray-100 dark:border-gray-800'>
                  <div className='flex items-center justify-between mb-3'>
                    <Label
                      htmlFor='volume'
                      className='text-base font-medium flex items-center gap-2'
                    >
                      <Volume2 className='h-5 w-5 text-green-600 dark:text-green-500' />
                      Volume
                    </Label>
                    <div className='flex items-center gap-2'>
                      <div
                        className={cn(
                          "h-8 w-12 flex items-center justify-center rounded-md font-medium text-sm transition-colors",
                          volume[0] > 75
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : volume[0] > 30
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        )}
                      >
                        {volume[0]}%
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={() => setVolume(volume[0] === 0 ? [50] : [0])}
                      >
                        {volume[0] === 0 ? (
                          <Volume2 className='h-4 w-4' />
                        ) : (
                          <Volume2 className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {volume[0] === 0 ? "Unmute" : "Mute"}
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className='relative pt-1'>
                    <div className='flex items-center gap-3'>
                      <button
                        onClick={() => setVolume([Math.max(0, volume[0] - 10)])}
                        className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                      >
                        <Volume2 className='h-4 w-4' />
                      </button>
                      <Slider
                        id='volume'
                        value={volume}
                        onValueChange={setVolume}
                        max={100}
                        step={1}
                        className={cn(
                          "flex-1",
                          volume[0] > 75
                            ? "bg-green-100 dark:bg-green-900/40"
                            : volume[0] > 30
                            ? "bg-blue-100 dark:bg-blue-900/40"
                            : "bg-gray-100 dark:bg-gray-800"
                        )}
                      />
                      <button
                        onClick={() =>
                          setVolume([Math.min(100, volume[0] + 10)])
                        }
                        className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors'
                      >
                        <Volume2 className='h-5 w-5' />
                      </button>
                    </div>

                    <div className='flex justify-between mt-2 px-1'>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        Low
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        Medium
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        High
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <Button
                    onClick={handleTestPlay}
                    disabled={isPlaying || soundOption === "never"}
                    className='flex items-center gap-2'
                  >
                    <Play className='h-4 w-4' />
                    Test Play
                  </Button>

                  {playbackMessage && (
                    <span
                      className={cn(
                        "text-sm",
                        playbackMessage.includes("disabled")
                          ? "text-amber-600"
                          : "text-green-600"
                      )}
                    >
                      {playbackMessage}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Sound Length */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Bell className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>Sound Length</CardTitle>
              </div>
              <CardDescription>
                Configure how long notification sounds should play when
                triggered.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomRadioGroup
                value={soundLength}
                onValueChange={setSoundLength}
                className='space-y-5'
              >
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='until_click' id='until_click' />
                  <Label htmlFor='until_click' className='text-base leading-6'>
                    Play Until I Click The Notification Box
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='once' id='once' />
                  <Label htmlFor='once' className='text-base leading-6'>
                    Play Only Once
                  </Label>
                </div>
                <div className='flex items-center space-x-3'>
                  <CustomRadioGroupItem value='custom' id='custom' />
                  <Label htmlFor='custom' className='text-base leading-6'>
                    Play For
                  </Label>
                  {soundLength === "custom" && (
                    <div className='flex items-center ml-2'>
                      <Input
                        type='number'
                        value={customSeconds}
                        onChange={(e) => setCustomSeconds(e.target.value)}
                        className='w-20 h-8 text-center'
                        min='1'
                      />
                      <span className='ml-2'>seconds</span>
                    </div>
                  )}
                </div>
              </CustomRadioGroup>
            </CardContent>
          </Card>

          {/* Section 3: Email Alert Notifications */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Mail className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>
                  Email Alert Notifications
                </CardTitle>
              </div>
              <CardDescription>
                Receive email notifications when the page monitor detects
                changes on your monitored websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Blue notification message moved below description */}
              {emailMessage.type === "info" && (
                <div className='mb-6 p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-sm border border-blue-100 dark:border-blue-900/30 flex items-start gap-2'>
                  <Mail className='h-4 w-4 mt-0.5 flex-shrink-0 text-blue-500 dark:text-blue-400' />
                  <p>
                    {emailMessage.message} If you are not receiving OTPs, please
                    refer to{" "}
                    <a
                      href='#'
                      className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
                      onClick={(e) => e.preventDefault()}
                    >
                      this article
                    </a>{" "}
                    for troubleshooting steps.
                  </p>
                </div>
              )}

              {!emailVerified ? (
                <div className='space-y-6'>
                  {!showOtpInput ? (
                    <div className='flex flex-col md:flex-row md:items-center gap-3'>
                      <Input
                        type='email'
                        placeholder='Enter your email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='sm:max-w-md'
                      />
                      <Button onClick={handleVerifyEmail}>Verify</Button>
                    </div>
                  ) : (
                    <div className='space-y-6'>
                      <Label className='block'>
                        Enter the 6-digit verification code sent to your email
                      </Label>
                      <div className='flex gap-2 max-w-md'>
                        {otp.map((digit, index) => (
                          <Input
                            key={index}
                            type='text'
                            inputMode='numeric'
                            pattern='[0-9]*'
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleOtpChange(index, e.target.value)
                            }
                            className='w-12 h-12 text-center text-lg'
                            ref={(el) => {
                              otpRefs.current[index] = el;
                            }}
                            onKeyDown={(e) => {
                              // Handle backspace
                              if (
                                e.key === "Backspace" &&
                                !digit &&
                                index > 0
                              ) {
                                otpRefs.current[index - 1]?.focus();
                              }
                            }}
                          />
                        ))}
                      </div>

                      {/* Buttons placed side by side */}
                      <div className='flex items-center gap-3'>
                        <Button
                          variant='outline'
                          onClick={() => {
                            setShowOtpInput(false);
                            setEmailMessage({ type: "", message: "" });
                          }}
                        >
                          Back
                        </Button>
                        <Button
                          onClick={() => verifyOtp(otp.join(""))}
                          className='bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                        >
                          Verify Code
                        </Button>
                      </div>
                    </div>
                  )}

                  {emailMessage.type === "error" && (
                    <div
                      className='p-3 rounded-md text-sm flex items-center gap-2 mt-4'
                      style={{
                        backgroundColor: "rgba(254, 226, 226, 1)",
                        color: "rgba(153, 27, 27, 1)",
                      }}
                    >
                      <AlertCircle className='h-4 w-4' />
                      {emailMessage.message}
                    </div>
                  )}

                  {emailMessage.type === "success" && (
                    <div className='p-3 rounded-md text-sm flex items-center gap-2 mt-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'>
                      <Check className='h-4 w-4' />
                      {emailMessage.message}
                    </div>
                  )}
                </div>
              ) : (
                <div className='space-y-5'>
                  <div className='relative overflow-hidden rounded-lg border border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 p-5'>
                    <div className='absolute top-0 right-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-green-100 dark:bg-green-800/20 blur-2xl'></div>

                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                          <Check className='h-5 w-5 text-green-600 dark:text-green-400' />
                        </div>
                        <div>
                          <h4 className='text-base font-medium text-green-800 dark:text-green-300'>
                            Email Verified
                          </h4>
                          <p className='text-sm text-green-700 dark:text-green-400 font-medium'>
                            {email}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 self-start sm:self-center'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setEmailVerified(false);
                            setEmail("");
                            setEmailMessage({ type: "", message: "" });
                          }}
                          className='border-green-200 hover:border-green-300 hover:bg-green-50 dark:border-green-800 dark:hover:border-green-700 dark:hover:bg-green-900/30'
                        >
                          <Edit2 className='mr-2 h-3.5 w-3.5' />
                          Change Email
                        </Button>

                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setEmailVerified(false);
                            setEmail("");
                            setEmailMessage({ type: "", message: "" });
                          }}
                          className='border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-900/30'
                        >
                          <Trash2 className='mr-2 h-3.5 w-3.5' />
                          Remove Email
                        </Button>
                      </div>
                    </div>

                    <div className='mt-4 flex items-center gap-2 rounded-md bg-white/80 dark:bg-gray-900/50 p-3 text-sm border border-green-100 dark:border-green-900/50'>
                      <Bell className='h-4 w-4 text-green-500 dark:text-green-400' />
                      <span className='text-green-800 dark:text-green-300'>
                        Email notifications are now enabled for this account
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 4: Webhooks */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Link className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-xl'>Webhooks</CardTitle>
                  <Badge className='bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0'>
                    New
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Configure webhook notifications to receive alerts when Page
                Monitor detects changes on your monitored websites.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {webhookMessage.message && (
                <div
                  className={cn(
                    "p-3 rounded-md text-sm flex items-center gap-2 mb-4",
                    webhookMessage.type === "error"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  )}
                >
                  {webhookMessage.type === "error" ? (
                    <AlertCircle className='h-4 w-4' />
                  ) : (
                    <Check className='h-4 w-4' />
                  )}
                  {webhookMessage.message}
                </div>
              )}

              {/* Webhook List */}
              <div className='space-y-4 mb-6'>
                {webhooks.map((webhook) => {
                  // Get the service icon
                  const ServiceIcon =
                    webhookServices.find((s) => s.name === webhook.service)
                      ?.icon || Globe;

                  return (
                    <div
                      key={webhook.id}
                      className={cn(
                        "group relative overflow-hidden border rounded-lg transition-all duration-200",
                        "hover:border-gray-300 dark:hover:border-gray-700",
                        webhook.enabled
                          ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                          : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                      )}
                    >
                      <div className='flex flex-col md:flex-row md:items-center justify-between p-4'>
                        <div className='space-y-2 mb-3 md:mb-0'>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-base'>
                              {webhook.name}
                            </span>
                            {!webhook.enabled && (
                              <Badge
                                variant='outline'
                                className='text-xs bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                              >
                                Disabled
                              </Badge>
                            )}
                          </div>

                          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
                            <div className='flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400'>
                              <ServiceIcon className='h-3.5 w-3.5' />
                              <span>{webhook.service}</span>
                            </div>

                            <div className='flex items-center gap-1.5'>
                              <span className='hidden sm:inline text-gray-400'>
                                •
                              </span>
                              <span className='text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] md:max-w-[300px]'>
                                {webhook.url}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-2 ml-auto'>
                          <div className='flex items-center mr-2'>
                            <Switch
                              checked={webhook.enabled}
                              onCheckedChange={() =>
                                handleToggleWebhook(webhook.id)
                              }
                              className='data-[state=checked]:bg-green-500'
                            />
                          </div>

                          <div className='flex items-center gap-1.5'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleTestWebhook(webhook.url)}
                              className='h-8 px-3 text-xs'
                            >
                              Test
                            </Button>

                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleEditWebhook(webhook)}
                              className='h-8 w-8 p-0'
                            >
                              <Edit2 className='h-3.5 w-3.5' />
                              <span className='sr-only'>Edit</span>
                            </Button>

                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDeleteWebhook(webhook.id)}
                              className='h-8 w-8 p-0 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                            >
                              <Trash2 className='h-3.5 w-3.5' />
                              <span className='sr-only'>Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {webhooks.length === 0 && (
                  <div className='flex flex-col items-center justify-center py-8 px-4 border border-dashed rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30'>
                    <Link className='h-10 w-10 text-gray-400 mb-3' />
                    <p className='text-gray-500 dark:text-gray-400 mb-1'>
                      No webhooks configured
                    </p>
                    <p className='text-sm text-gray-400 dark:text-gray-500 mb-4'>
                      Add your first webhook to receive notifications
                    </p>
                    <Button
                      variant='outline'
                      onClick={() => setShowWebhookForm(true)}
                      className='flex items-center gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Add Webhook
                    </Button>
                  </div>
                )}
              </div>

              {/* Webhook Form */}
              {showWebhookForm ? (
                <div
                  className={cn(
                    "border rounded-lg shadow-sm transition-all duration-200",
                    editingWebhook !== null
                      ? "bg-amber-50/70 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/40"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  )}
                >
                  {/* Form Header */}
                  <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-4'>
                    <div className='flex items-center gap-3'>
                      {editingWebhook !== null ? (
                        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30'>
                          <Edit2 className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30'>
                          <Plus className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </div>
                      )}
                      <h4 className='font-medium text-lg'>
                        {editingWebhook !== null
                          ? "Edit Webhook"
                          : "Add New Webhook"}
                      </h4>
                    </div>
                    {editingWebhook !== null && (
                      <Badge
                        variant='outline'
                        className='bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30'
                      >
                        Editing Webhook
                      </Badge>
                    )}
                  </div>

                  {/* Form Content */}
                  <div className='p-5 space-y-5'>
                    {/* Name Field */}
                    <div className='grid gap-2'>
                      <Label
                        htmlFor='webhook-name'
                        className='text-sm font-medium'
                      >
                        Webhook Name
                      </Label>
                      <Input
                        id='webhook-name'
                        value={webhookName}
                        onChange={(e) => setWebhookName(e.target.value)}
                        placeholder='Enter a descriptive name'
                        className='max-w-md'
                      />
                    </div>

                    {/* Service Field */}
                    <div className='grid gap-3'>
                      <Label
                        htmlFor='webhook-service'
                        className='text-sm font-medium'
                      >
                        Service Type
                      </Label>

                      {/* Service Tag Selection Panel */}
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {webhookServices.map((service) => {
                          const ServiceIcon = service.icon;
                          const isActive = webhookService === service.name;

                          return (
                            <button
                              key={service.id}
                              type='button'
                              onClick={() =>
                                handleServiceTagSelect(service.name)
                              }
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-all",
                                "border hover:shadow-sm",
                                isActive
                                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 ring-2 ring-green-500/20"
                                  : "bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
                              )}
                            >
                              <ServiceIcon className='h-4 w-4' />
                              <span>{service.name}</span>
                              {isActive && (
                                <Check className='h-3.5 w-3.5 ml-1' />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        Select the service you want to connect to or choose
                        "Custom URL" for a generic webhook
                      </div>
                    </div>

                    {/* URL Field */}
                    <div className='grid gap-3'>
                      <Label
                        htmlFor='webhook-url'
                        className='text-sm font-medium'
                      >
                        Webhook URL
                      </Label>
                      <div className='space-y-2 max-w-lg'>
                        <div className='relative'>
                          <Input
                            id='webhook-url'
                            value={webhookUrl}
                            onChange={handleWebhookUrlChange}
                            placeholder='https://'
                            className={cn(
                              "pr-10 font-mono text-sm",
                              urlValidationStatus === "valid" &&
                                "border-green-500 focus-visible:ring-green-500",
                              urlValidationStatus === "invalid" &&
                                "border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          {urlValidationStatus !== "idle" && (
                            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
                              {urlValidationStatus === "validating" ? (
                                <Loader2 className='h-4 w-4 text-gray-400 animate-spin' />
                              ) : urlValidationStatus === "valid" ? (
                                <Check className='h-4 w-4 text-green-500' />
                              ) : (
                                <X className='h-4 w-4 text-red-500' />
                              )}
                            </div>
                          )}
                        </div>

                        {/* URL validation message */}
                        {urlValidationStatus !== "idle" &&
                          urlValidationStatus !== "validating" && (
                            <div
                              className={cn(
                                "text-sm flex items-center gap-1.5 transition-all",
                                urlValidationStatus === "valid"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              )}
                            >
                              {urlValidationStatus === "valid" ? (
                                <Check className='h-3.5 w-3.5' />
                              ) : (
                                <AlertCircle className='h-3.5 w-3.5' />
                              )}
                              {urlValidationMessage}
                            </div>
                          )}

                        {webhookService !== "Custom URL" && (
                          <div className='flex items-start gap-2 p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-xs border border-blue-100 dark:border-blue-900/30'>
                            <Info className='h-4 w-4 mt-0.5 flex-shrink-0' />
                            <div>
                              <p className='font-medium mb-1'>
                                Using {webhookService}
                              </p>
                              <p>
                                {webhookService === "Discord" &&
                                  "Use a Discord webhook URL from your server's integration settings."}
                                {webhookService === "Slack" &&
                                  "Use a Slack incoming webhook URL from your workspace's app settings."}
                                {webhookService === "Telegram" &&
                                  "Enter your Telegram bot API URL with your chat ID."}
                                {webhookService === "Mattermost" &&
                                  "Use a Mattermost incoming webhook URL from your team settings."}
                                {webhookService === "Mobile Pushbullet" &&
                                  "Enter your Pushbullet access token URL."}
                                {webhookService === "IFTTT" &&
                                  "Use your IFTTT webhook URL with your maker key."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 rounded-b-lg'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {editingWebhook !== null
                        ? "Update your webhook settings"
                        : "Configure your new webhook"}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        onClick={resetWebhookForm}
                        className='border-gray-300 dark:border-gray-700'
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleWebhookSubmit}
                        disabled={
                          !webhookName ||
                          !webhookUrl ||
                          urlValidationStatus !== "valid"
                        }
                        className={cn(
                          "transition-all",
                          !webhookName ||
                            !webhookUrl ||
                            urlValidationStatus !== "valid"
                            ? "opacity-70"
                            : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        )}
                      >
                        {editingWebhook !== null ? "Update" : "Add"} Webhook
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setShowWebhookForm(true)}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Add New Webhook
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings Link */}
          <div className='mt-8 text-center'>
            <a
              href='/page-monitor'
              className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              Back to Page Monitor
              <ExternalLink className='ml-1 h-4 w-4' />
            </a>
          </div>
        </div>

        {/* Add the ConfirmDialog at the end, right before the closing div */}
        <ConfirmDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title='Delete Webhook?'
          description={`Are you sure you want to delete the webhook named '${
            webhooks.find((w) => w.id === webhookToDelete)?.name || ""
          }'? This action cannot be undone.`}
          confirmLabel='Delete'
          cancelLabel='Cancel'
          onConfirm={confirmDeleteWebhook}
          variant='destructive'
        />
      </div>
    </div>
  );
}
