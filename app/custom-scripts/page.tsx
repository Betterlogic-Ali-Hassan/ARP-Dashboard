"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Edit2,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Globe,
  ChevronDown,
  Clock,
  RefreshCw,
  SearchIcon,
  EyeOff,
  Activity,
  Download,
  Upload,
  FileUp,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/confirm-dialog";
import debounce from "lodash.debounce";

// Updated timing types to include all the new options
type ExecutionTiming =
  | "url_opens"
  | "page_refresh"
  | "monitor_finds_text"
  | "monitor_loses_text"
  | "any_change";

interface Script {
  id: number;
  name: string;
  targetUrl: string;
  urlMode: "whitelist" | "blacklist";
  code: string;
  timing: ExecutionTiming;
  injection: "before" | "after";
  enabled: boolean;
}

export default function CustomScriptsPage() {
  // Add toast functionality
  const { toast } = useToast();

  // State for URL patterns section
  const [showUrlPatterns, setShowUrlPatterns] = useState(false);

  // State for scripts list
  const [scripts, setScripts] = useState<Script[]>([
    {
      id: 1,
      name: "Auto Fill Login Form",
      targetUrl: "https://example.com/login",
      urlMode: "whitelist",
      code: "// Fill username and password\ndocument.querySelector('#username').value = 'demo';\ndocument.querySelector('#password').value = 'password';",
      timing: "url_opens",
      injection: "after",
      enabled: true,
    },
    {
      id: 2,
      name: "Skip Ads",
      targetUrl: "https://example.com/videos/*",
      urlMode: "whitelist",
      code: "// Skip ads when they appear\nconst skipButton = document.querySelector('.skip-ad-button');\nif (skipButton) skipButton.click();",
      timing: "page_refresh",
      injection: "after",
      enabled: false,
    },
    {
      id: 3,
      name: "Notify When Item In Stock",
      targetUrl: "https://example.com/product/*",
      urlMode: "whitelist",
      code: "// Play sound when in-stock text is found\nconst audio = new Audio('https://example.com/notification.mp3');\naudio.play();",
      timing: "monitor_finds_text",
      injection: "after",
      enabled: true,
    },
  ]);

  // State for form and editing
  const [showScriptForm, setShowScriptForm] = useState(false);
  const [editingScript, setEditingScript] = useState<null | number>(null);
  const [scriptName, setScriptName] = useState("");
  const [scriptTargetUrl, setScriptTargetUrl] = useState("");
  const [scriptUrlMode, setScriptUrlMode] = useState<"whitelist" | "blacklist">(
    "whitelist"
  );
  const [scriptCode, setScriptCode] = useState("");
  const [scriptTiming, setScriptTiming] =
    useState<ExecutionTiming>("url_opens");
  const [scriptInjection, setScriptInjection] = useState<"before" | "after">(
    "after"
  );
  const [scriptMessage, setScriptMessage] = useState({ type: "", message: "" });

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredScripts, setFilteredScripts] = useState<Script[]>(scripts);

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (!query.trim()) {
        setFilteredScripts(scripts);
        return;
      }

      const lowerCaseQuery = query.toLowerCase();
      const filtered = scripts.filter(
        (script) =>
          script.name.toLowerCase().includes(lowerCaseQuery) ||
          script.targetUrl.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredScripts(filtered);
    }, 300),
    [scripts]
  );

  // Update filtered scripts when search query or scripts change
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, scripts, debouncedSearch]);

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<number | null>(null);

  // State for import dialog
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get timing icon based on timing value
  const getTimingIcon = (timing: ExecutionTiming) => {
    switch (timing) {
      case "url_opens":
        return <Clock className='h-3.5 w-3.5' />;
      case "page_refresh":
        return <RefreshCw className='h-3.5 w-3.5' />;
      case "monitor_finds_text":
        return <SearchIcon className='h-3.5 w-3.5' />;
      case "monitor_loses_text":
        return <EyeOff className='h-3.5 w-3.5' />;
      case "any_change":
        return <Activity className='h-3.5 w-3.5' />;
      default:
        return <Clock className='h-3.5 w-3.5' />;
    }
  };

  // Get timing label based on timing value
  const getTimingLabel = (timing: ExecutionTiming) => {
    switch (timing) {
      case "url_opens":
        return "When URL Opens";
      case "page_refresh":
        return "On Each Page Refresh";
      case "monitor_finds_text":
        return "When Target Text Found";
      case "monitor_loses_text":
        return "When Target Text Lost";
      case "any_change":
        return "When Any Change Occurs";
      default:
        return "When URL Opens";
    }
  };

  // Handle script toggle
  const handleToggleScript = (id: number) => {
    setScripts(
      scripts.map((script) =>
        script.id === id ? { ...script, enabled: !script.enabled } : script
      )
    );
  };

  // Handle script edit
  const handleEditScript = (script: Script) => {
    setEditingScript(script.id);
    setScriptName(script.name);
    setScriptTargetUrl(script.targetUrl);
    setScriptUrlMode(script.urlMode);
    setScriptCode(script.code);
    setScriptTiming(script.timing);
    setScriptInjection(script.injection);
    setShowScriptForm(true);
  };

  // Handle script delete
  const handleDeleteScript = (id: number) => {
    setScripts(scripts.filter((script) => script.id !== id));
    setScriptMessage({
      type: "success",
      message: "Script deleted successfully!",
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setScriptMessage({ type: "", message: "" });
    }, 3000);
  };

  // Handle showing delete confirmation dialog
  const handleShowDeleteDialog = (id: number) => {
    setScriptToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Handle script form submission
  const handleScriptSubmit = () => {
    if (!scriptName || !scriptTargetUrl || !scriptCode) {
      setScriptMessage({
        type: "error",
        message: !scriptName
          ? "Please enter a script name."
          : !scriptTargetUrl
          ? "Please enter a target URL."
          : "Please enter script code.",
      });
      return;
    }

    if (editingScript !== null) {
      // Update existing script
      setScripts(
        scripts.map((script) =>
          script.id === editingScript
            ? {
                ...script,
                name: scriptName,
                targetUrl: scriptTargetUrl,
                urlMode: scriptUrlMode,
                code: scriptCode,
                timing: scriptTiming,
                injection: scriptInjection,
              }
            : script
        )
      );
    } else {
      // Add new script
      const newScript: Script = {
        id: Date.now(),
        name: scriptName,
        targetUrl: scriptTargetUrl,
        urlMode: scriptUrlMode,
        code: scriptCode,
        timing: scriptTiming,
        injection: scriptInjection,
        enabled: true,
      };
      setScripts([...scripts, newScript]);
    }

    // Reset form
    resetScriptForm();
    setScriptMessage({
      type: "success",
      message: `Script ${
        editingScript !== null ? "updated" : "added"
      } successfully!`,
    });

    // Clear message after 3 seconds
    setTimeout(() => {
      setScriptMessage({ type: "", message: "" });
    }, 3000);
  };

  // Reset script form
  const resetScriptForm = () => {
    setScriptName("");
    setScriptTargetUrl("");
    setScriptUrlMode("whitelist");
    setScriptCode("");
    setScriptTiming("url_opens");
    setScriptInjection("after");
    setShowScriptForm(false);
    setEditingScript(null);
  };

  // Export scripts function
  const handleExportScripts = () => {
    if (scripts.length === 0) {
      toast({
        title: "No scripts to export",
        description: "You don't have any scripts to export.",
        variant: "destructive",
      });
      return;
    }

    const dataStr = JSON.stringify(scripts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-scripts-export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Scripts exported successfully",
      description: `${scripts.length} script${
        scripts.length > 1 ? "s" : ""
      } exported to JSON file.`,
    });
  };

  // Export single script function
  const handleExportSingleScript = (script: Script) => {
    const dataStr = JSON.stringify(script, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${script.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Script exported successfully",
      description: `"${script.name}" exported to JSON file.`,
    });
  };

  // Import scripts function
  const handleImportScripts = (
    event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
  ) => {
    let files: FileList | null = null;

    if ("dataTransfer" in event) {
      // Drag and drop
      event.preventDefault();
      setIsDragging(false);
      files = event.dataTransfer.files;
    } else if ("target" in event && event.target) {
      // File input
      files = (event.target as HTMLInputElement).files;
    }

    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== "application/json") {
      toast({
        title: "Invalid file format",
        description: "Please upload a JSON file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);

        // Validate imported data
        let importedScripts: Script[] = [];

        if (Array.isArray(importedData)) {
          // Multiple scripts
          importedScripts = importedData.filter(
            (script) =>
              typeof script === "object" &&
              script !== null &&
              "name" in script &&
              "targetUrl" in script &&
              "code" in script
          );
        } else if (typeof importedData === "object" && importedData !== null) {
          // Single script
          if (
            "name" in importedData &&
            "targetUrl" in importedData &&
            "code" in importedData
          ) {
            importedScripts = [importedData as Script];
          }
        }

        if (importedScripts.length === 0) {
          toast({
            title: "Invalid script format",
            description: "The uploaded file doesn't contain valid script data.",
            variant: "destructive",
          });
          return;
        }

        // Generate new IDs for imported scripts to avoid conflicts
        const newScripts = importedScripts.map((script) => ({
          ...script,
          id: Date.now() + Math.floor(Math.random() * 1000),
        }));

        setScripts((prev) => [...prev, ...newScripts]);
        setImportDialogOpen(false);

        toast({
          title: "Scripts imported successfully",
          description: `${newScripts.length} script${
            newScripts.length > 1 ? "s" : ""
          } imported.`,
        });
      } catch (error) {
        toast({
          title: "Error importing scripts",
          description:
            "Failed to parse the JSON file. Please check the file format.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      <div>
        <Sidebar activePage='custom-scripts' />
      </div>

      <div className='flex-1 p-4 sm:p-6 lg:p-8'>
        <div className='mx-auto max-w-[56rem]'>
          <h1 className='mb-6 text-3xl font-bold tracking-tight'>
            Custom Scripts
          </h1>

          {/* Header Section */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                  <Code className='h-5 w-5 text-green-600 dark:text-green-400' />
                </div>
                <CardTitle className='text-xl'>
                  Execute Custom Scripts on the Page
                </CardTitle>
              </div>
              <CardDescription>
                If you love playing with automation, scraping, changing default
                website behavior, and have some basic knowledge of JavaScript,
                there's a lot you can do here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* URL Patterns Collapsible Section */}
              <div className='mb-6'>
                <button
                  onClick={() => setShowUrlPatterns(!showUrlPatterns)}
                  className='flex items-center justify-between w-full text-left font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
                >
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center justify-center h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/30'>
                      <Globe className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <span>What URL Patterns Are Allowed</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-gray-500 transition-transform duration-200",
                      showUrlPatterns ? "transform rotate-180" : ""
                    )}
                  />
                </button>

                {showUrlPatterns && (
                  <div className='mt-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50'>
                    <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-400'>
                      <li className='flex items-start gap-2'>
                        <span className='text-gray-400'>-</span>
                        <span>
                          To match both HTTP and HTTPS, just write{" "}
                          <code className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs'>
                            example.com
                          </code>
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-gray-400'>-</span>
                        <span>
                          To match a specific path, write{" "}
                          <code className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs'>
                            example.com/path/to/page
                          </code>
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-gray-400'>-</span>
                        <span>
                          To match all pages under a path, write{" "}
                          <code className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs'>
                            example.com/path/*
                          </code>
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-gray-400'>-</span>
                        <span>
                          To match a specific subdomain, write{" "}
                          <code className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs'>
                            sub.example.com
                          </code>
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-gray-400'>-</span>
                        <span>
                          To match a specific subdomain with path, write{" "}
                          <code className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs'>
                            sub.example.com/path
                          </code>
                        </span>
                      </li>
                      <li className='flex items-start gap-2'>
                        <span className='text-gray-400'>-</span>
                        <span>
                          To match every page on a domain and its subdomains,
                          write{" "}
                          <code className='px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs'>
                            *.example.com/*
                          </code>
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Script List Section */}
          <Card className='mb-6 overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between gap-3 mb-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center justify-center h-8 w-8 rounded-md bg-green-100 dark:bg-green-950/50'>
                    <Code className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <div className='flex items-center gap-2'>
                    <CardTitle className='text-xl'>Script List</CardTitle>
                    <Badge className='bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-0'>
                      {scripts.length}
                    </Badge>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleExportScripts}
                    className='flex items-center gap-1.5 h-8'
                  >
                    <Download className='h-3.5 w-3.5' />
                    <span className='hidden sm:inline'>Export</span>
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setImportDialogOpen(true)}
                    className='flex items-center gap-1.5 h-8'
                  >
                    <Upload className='h-3.5 w-3.5' />
                    <span className='hidden sm:inline'>Import</span>
                  </Button>
                </div>
              </div>
              <CardDescription>
                Manage your custom JavaScript scripts that will be executed on
                specified web pages.
              </CardDescription>

              {/* Search Bar */}
              <div className='mt-4'>
                <div className='relative'>
                  <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                  <Input
                    type='text'
                    placeholder='🔍 Search by script name or URL'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-9 pr-10 h-10'
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
                    >
                      <X className='h-3 w-3 text-gray-500 dark:text-gray-400' />
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {scriptMessage.message && (
                <div
                  className={cn(
                    "p-3 rounded-md text-sm flex items-center gap-2 mb-4",
                    scriptMessage.type === "error"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  )}
                >
                  {scriptMessage.type === "error" ? (
                    <AlertCircle className='h-4 w-4' />
                  ) : (
                    <Check className='h-4 w-4' />
                  )}
                  {scriptMessage.message}
                </div>
              )}

              {/* Script List */}
              <div className='space-y-4 mb-6'>
                {filteredScripts.map((script) => (
                  <div
                    key={script.id}
                    className={cn(
                      "group relative overflow-hidden border rounded-lg transition-all duration-200",
                      "hover:border-gray-300 dark:hover:border-gray-700",
                      script.enabled
                        ? "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800"
                    )}
                  >
                    <div className='flex flex-col md:flex-row md:items-center justify-between p-4'>
                      <div className='space-y-2 mb-3 md:mb-0'>
                        <div className='flex items-center gap-2'>
                          <span className='font-medium text-base'>
                            {script.name}
                          </span>
                          <Badge
                            variant={script.enabled ? "default" : "outline"}
                            className='text-xs border-0'
                          >
                            {script.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
                          <div className='flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400'>
                            <Globe className='h-3.5 w-3.5' />
                            <span>{script.targetUrl}</span>
                          </div>

                          <div className='flex items-center gap-1.5'>
                            <span className='hidden sm:inline text-gray-400'>
                              •
                            </span>
                            <div className='flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400'>
                              {getTimingIcon(script.timing)}
                              <span>{getTimingLabel(script.timing)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-2 ml-auto'>
                        <div className='flex items-center mr-2'>
                          <Switch
                            checked={script.enabled}
                            onCheckedChange={() =>
                              handleToggleScript(script.id)
                            }
                            className='data-[state=checked]:bg-green-500'
                          />
                        </div>

                        <div className='flex items-center gap-1.5'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleEditScript(script)}
                            className='h-8 w-8 p-0'
                          >
                            <Edit2 className='h-3.5 w-3.5' />
                            <span className='sr-only'>Edit</span>
                          </Button>

                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleExportSingleScript(script)}
                            className='h-8 w-8 p-0'
                          >
                            <Download className='h-3.5 w-3.5' />
                            <span className='sr-only'>Export</span>
                          </Button>

                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleShowDeleteDialog(script.id)}
                            className='h-8 w-8 p-0 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                            <span className='sr-only'>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredScripts.length === 0 && searchQuery && (
                  <div className='flex flex-col items-center justify-center py-8 px-4 border border-dashed rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30'>
                    <SearchIcon className='h-10 w-10 text-gray-400 mb-3' />
                    <p className='text-gray-500 dark:text-gray-400 mb-1'>
                      No matching scripts found
                    </p>
                    <p className='text-sm text-gray-400 dark:text-gray-500 mb-4'>
                      Try adjusting your search query or clear the search
                    </p>
                    <Button
                      variant='outline'
                      onClick={() => setSearchQuery("")}
                      className='flex items-center gap-2'
                    >
                      <X className='h-4 w-4' />
                      Clear Search
                    </Button>
                  </div>
                )}

                {filteredScripts.length === 0 && !searchQuery && (
                  <div className='flex flex-col items-center justify-center py-8 px-4 border border-dashed rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30'>
                    <Code className='h-10 w-10 text-gray-400 mb-3' />
                    <p className='text-gray-500 dark:text-gray-400 mb-1'>
                      No scripts configured
                    </p>
                    <p className='text-sm text-gray-400 dark:text-gray-500 mb-4'>
                      Add your first script to automate tasks on websites
                    </p>
                    <Button
                      variant='outline'
                      onClick={() => setShowScriptForm(true)}
                      className='flex items-center gap-2'
                    >
                      <Plus className='h-4 w-4' />
                      Add Script
                    </Button>
                  </div>
                )}
              </div>

              {/* Script Form */}
              {showScriptForm ? (
                <div
                  className={cn(
                    "border rounded-lg shadow-sm transition-all duration-200",
                    editingScript !== null
                      ? "bg-amber-50/70 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/40"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  )}
                >
                  {/* Form Header */}
                  <div className='flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-4'>
                    <div className='flex items-center gap-3'>
                      {editingScript !== null ? (
                        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30'>
                          <Edit2 className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                        </div>
                      ) : (
                        <div className='flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30'>
                          <Plus className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </div>
                      )}
                      <h4 className='font-medium text-lg'>
                        {editingScript !== null
                          ? "Edit Script"
                          : "Add New Script"}
                      </h4>
                    </div>
                    {editingScript !== null && (
                      <Badge
                        variant='outline'
                        className='bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/30'
                      >
                        Editing Script
                      </Badge>
                    )}
                  </div>

                  {/* Form Content */}
                  <div className='p-5 space-y-5'>
                    {/* Script Name Field */}
                    <div className='grid gap-2'>
                      <Label
                        htmlFor='script-name'
                        className='text-sm font-medium'
                      >
                        Script Name
                      </Label>
                      <Input
                        id='script-name'
                        value={scriptName}
                        onChange={(e) => setScriptName(e.target.value)}
                        placeholder='Enter a descriptive name'
                        className='max-w-md'
                      />
                    </div>

                    {/* Target URL Field */}
                    <div className='grid gap-2'>
                      <Label
                        htmlFor='target-url'
                        className='text-sm font-medium'
                      >
                        Target URL
                      </Label>
                      <div className='flex flex-col sm:flex-row gap-3'>
                        <Input
                          id='target-url'
                          value={scriptTargetUrl}
                          onChange={(e) => setScriptTargetUrl(e.target.value)}
                          placeholder='https://example.com/*'
                          className='flex-1'
                        />
                        <Select
                          value={scriptUrlMode}
                          onValueChange={(value: "whitelist" | "blacklist") =>
                            setScriptUrlMode(value)
                          }
                        >
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='URL Mode' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='whitelist'>Whitelist</SelectItem>
                            <SelectItem value='blacklist'>Blacklist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Use * as a wildcard. Example: https://example.com/* will
                        match all pages on example.com
                      </p>
                    </div>

                    {/* Script Code Field */}
                    <div className='grid gap-2'>
                      <Label
                        htmlFor='script-code'
                        className='text-sm font-medium'
                      >
                        JavaScript Code
                      </Label>
                      <Textarea
                        id='script-code'
                        value={scriptCode}
                        onChange={(e) => setScriptCode(e.target.value)}
                        placeholder='// Enter your JavaScript code here'
                        className='min-h-[200px] font-mono text-sm'
                      />
                    </div>

                    {/* Script Timing and Injection */}
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <div className='grid gap-2'>
                        <Label
                          htmlFor='script-timing'
                          className='text-sm font-medium flex items-center gap-2'
                        >
                          Execution Timing
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='cursor-help rounded-full bg-gray-100 dark:bg-gray-800 p-0.5'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-3 w-3 text-gray-500 dark:text-gray-400'
                                  >
                                    <circle cx='12' cy='12' r='10' />
                                    <path d='M12 16v-4' />
                                    <path d='M12 8h.01' />
                                  </svg>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className='max-w-xs'>
                                <p>
                                  Choose when your script should execute on the
                                  page
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={scriptTiming}
                          onValueChange={(value: ExecutionTiming) =>
                            setScriptTiming(value)
                          }
                        >
                          <SelectTrigger id='script-timing'>
                            <SelectValue placeholder='When to execute' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='url_opens'>
                              When URL Opens
                            </SelectItem>
                            <SelectItem value='page_refresh'>
                              On Each Page Refresh
                            </SelectItem>
                            <SelectItem value='monitor_finds_text'>
                              When Target Text Found
                            </SelectItem>
                            <SelectItem value='monitor_loses_text'>
                              When Target Text Lost
                            </SelectItem>
                            <SelectItem value='any_change'>
                              When Any Change Occurs
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        {(scriptTiming === "monitor_finds_text" ||
                          scriptTiming === "monitor_loses_text") && (
                          <div className='mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-md'>
                            <p className='text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='h-3.5 w-3.5'
                              >
                                <circle cx='12' cy='12' r='10' />
                                <path d='M12 16v-4' />
                                <path d='M12 8h.01' />
                              </svg>
                              Configure target text in the Page Monitor settings
                            </p>
                          </div>
                        )}
                      </div>

                      <div className='grid gap-2'>
                        <Label
                          htmlFor='script-injection'
                          className='text-sm font-medium flex items-center gap-2'
                        >
                          Injection Point
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className='cursor-help rounded-full bg-gray-100 dark:bg-gray-800 p-0.5'>
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-3 w-3 text-gray-500 dark:text-gray-400'
                                  >
                                    <circle cx='12' cy='12' r='10' />
                                    <path d='M12 16v-4' />
                                    <path d='M12 8h.01' />
                                  </svg>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className='max-w-xs'>
                                <p>
                                  Choose when in the page lifecycle your script
                                  should be injected
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={scriptInjection}
                          onValueChange={(value: "before" | "after") =>
                            setScriptInjection(value)
                          }
                        >
                          <SelectTrigger id='script-injection'>
                            <SelectValue placeholder='Injection point' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='before'>
                              Before Page Load
                            </SelectItem>
                            <SelectItem value='after'>
                              After Page Load
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Form Footer */}
                  <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 rounded-b-lg'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {editingScript !== null
                        ? "Update your script settings"
                        : "Configure your new script"}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button
                        variant='outline'
                        onClick={resetScriptForm}
                        className='border-gray-300 dark:border-gray-700'
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleScriptSubmit}
                        disabled={
                          !scriptName || !scriptTargetUrl || !scriptCode
                        }
                        className={cn(
                          "transition-all",
                          !scriptName || !scriptTargetUrl || !scriptCode
                            ? "opacity-70"
                            : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                        )}
                      >
                        {editingScript !== null ? "Update" : "Add"} Script
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button
                    onClick={() => setShowScriptForm(true)}
                    className='flex items-center gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    Add New Script
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => setImportDialogOpen(true)}
                    className='flex items-center gap-2'
                  >
                    <Upload className='h-4 w-4' />
                    Import Scripts
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Box Section - Redesigned */}
          <Card className='mb-6 overflow-hidden border-0 shadow-sm'>
            <CardContent className='p-0'>
              <div className='bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 p-6 rounded-lg border border-green-100 dark:border-green-900/30'>
                <div className='flex flex-col mb-6'>
                  <h3 className='text-xl font-semibold text-green-800 dark:text-green-300'>
                    Enhance Your Browsing Experience
                  </h3>
                  <p className='text-green-700/90 dark:text-green-400/90 mt-1'>
                    Custom scripts can automate repetitive tasks and add new
                    functionality to websites
                  </p>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                  {/* Community Scripts */}
                  <div className='bg-white/80 dark:bg-gray-900/60 rounded-lg p-5 border border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center justify-center h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 shrink-0 mt-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-5 w-5 text-green-600 dark:text-green-400'
                        >
                          <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'></path>
                          <circle cx='9' cy='7' r='4'></circle>
                          <path d='M23 21v-2a4 4 0 0 0-3-3.87'></path>
                          <path d='M16 3.13a4 4 0 0 1 0 7.75'></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className='font-medium text-lg text-green-700 dark:text-green-300 mb-2'>
                          Community Scripts (Free)
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          Share your script ideas with our community. If your
                          script benefits other users, we'll develop it for free
                          and publish it in our marketplace for everyone to use.
                        </p>
                        <div className='mt-4'>
                          <Button
                            variant='outline'
                            className='text-xs h-8 border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/50'
                          >
                            Browse Community Scripts
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Solutions */}
                  <div className='bg-white/80 dark:bg-gray-900/60 rounded-lg p-5 border border-emerald-100 dark:border-emerald-900/30 shadow-sm hover:shadow-md transition-shadow duration-200'>
                    <div className='flex items-start gap-3'>
                      <div className='flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 shrink-0 mt-1'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='h-5 w-5 text-emerald-600 dark:text-emerald-400'
                        >
                          <path d='M12 2L2 7l10 5 10-5-10-5z'></path>
                          <path d='M2 17l10 5 10-5'></path>
                          <path d='M2 12l10 5 10-5'></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className='font-medium text-lg text-emerald-700 dark:text-emerald-300 mb-2'>
                          Custom Business Solutions
                        </h4>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          Need specialized automation for your business? Our
                          team can develop custom scripts tailored to your
                          specific requirements, with pricing based on
                          complexity and scope.
                        </p>
                        <div className='mt-4'>
                          <Button
                            variant='outline'
                            className='text-xs h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/50'
                          >
                            Request Custom Quote
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title='Delete Script?'
            description={`Are you sure you want to permanently delete the script titled '${
              scripts.find((s) => s.id === scriptToDelete)?.name || ""
            }'? This action cannot be undone.`}
            confirmLabel='Delete'
            cancelLabel='Cancel'
            onConfirm={() => {
              if (scriptToDelete !== null) {
                handleDeleteScript(scriptToDelete);
                setScriptToDelete(null);
              }
            }}
            variant='destructive'
          />

          {/* Import Scripts Dialog */}
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Import Scripts</DialogTitle>
                <DialogDescription>
                  Upload a JSON file containing script configurations to import.
                </DialogDescription>
              </DialogHeader>

              <div
                className={cn(
                  "mt-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-green-400 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-700"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleImportScripts}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <FileUp className='h-10 w-10 text-gray-400 dark:text-gray-500' />
                  <p className='text-sm font-medium'>
                    {isDragging
                      ? "Drop your file here"
                      : "Drag and drop your file here or click to browse"}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    Supports JSON files containing script configurations
                  </p>
                </div>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='.json,application/json'
                  onChange={handleImportScripts}
                />
              </div>

              <DialogFooter className='mt-4'>
                <Button
                  variant='outline'
                  onClick={() => setImportDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
