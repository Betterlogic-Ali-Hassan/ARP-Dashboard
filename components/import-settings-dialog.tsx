"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileJson, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImportSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileName: string;
  onImport: (settings: any) => void;
}

export function ImportSettingsDialog({
  open,
  onOpenChange,
  profileName,
  onImport,
}: ImportSettingsDialogProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Check file type
    if (!selectedFile.name.endsWith(".json")) {
      setError("Only JSON files are allowed");
      setFile(null);
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    try {
      const fileContent = await file.text();
      let settingsData;

      try {
        settingsData = JSON.parse(fileContent);
      } catch (e) {
        setError("Invalid JSON format. Please check the file content.");
        return;
      }

      // Basic validation that it's a settings object
      if (!settingsData || typeof settingsData !== "object") {
        setError("Invalid settings format");
        return;
      }

      // Call the onImport callback with the parsed settings
      onImport(settingsData);

      // Close the dialog
      onOpenChange(false);

      // Show success toast
      toast({
        title: "✅ Settings imported successfully",
        description: `Settings have been imported for "${profileName}"`,
      });
    } catch (e) {
      setError("Failed to read or process the file");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileJson className='h-5 w-5 text-emerald-500' />
            Import Settings for {profileName}
          </DialogTitle>
          <DialogDescription>
            Upload a JSON file containing settings to import into this profile.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-gray-300 dark:border-gray-700"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className='flex flex-col items-center justify-center gap-3'>
            <div className='rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3'>
              <Upload className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div>
              <p className='text-sm font-medium mb-1'>
                Drag and drop your JSON file here
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                or click to browse
              </p>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={handleBrowseClick}
              className='mt-2'
            >
              Browse Files
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type='file'
            accept='.json'
            onChange={handleFileChange}
            className='hidden'
            data-testid='file-input'
          />
        </div>

        {file && (
          <div className='bg-gray-50 dark:bg-gray-900 rounded-md p-3 mt-2 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <FileJson className='h-5 w-5 text-emerald-500' />
              <div>
                <p className='text-sm font-medium'>{file.name}</p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setFile(null)}
              className='text-gray-500 hover:text-red-500'
            >
              Remove
            </Button>
          </div>
        )}

        <DialogFooter className='mt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Import Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
