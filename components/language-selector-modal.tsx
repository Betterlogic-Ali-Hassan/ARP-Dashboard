"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Language {
  code: string;
  countryCode: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", countryCode: "US", name: "English" },
  { code: "es", countryCode: "ES", name: "Español" },
  { code: "tr", countryCode: "TR", name: "Türkçe" },
  { code: "fr", countryCode: "FR", name: "Français" },
  { code: "de", countryCode: "DE", name: "Deutsch" },
  { code: "it", countryCode: "IT", name: "Italiano" },
  { code: "pt", countryCode: "BR", name: "Português" },
  { code: "ru", countryCode: "RU", name: "Русский" },
  { code: "ja", countryCode: "JP", name: "日本語" },
  { code: "ko", countryCode: "KR", name: "한국어" },
  { code: "zh", countryCode: "CN", name: "中文" },
  { code: "hi", countryCode: "IN", name: "हिन्दी" },
];

interface LanguageSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LanguageSelectorModal({
  open,
  onOpenChange,
}: LanguageSelectorModalProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  // Load the current language preference when the modal opens
  useEffect(() => {
    if (open) {
      const savedLanguage = localStorage.getItem("preferredLanguage") || "en";
      setSelectedLanguage(savedLanguage);
    }
  }, [open]);

  const handleSelectLanguage = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleApply = () => {
    localStorage.setItem("preferredLanguage", selectedLanguage);

    onOpenChange(false);

    alert(
      `Language changed to ${
        languages.find((lang) => lang.code === selectedLanguage)?.name
      }`
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[550px] max-sm:max-h-[600px] max-sm:overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Select Language
          </DialogTitle>
          <DialogDescription className='text-center text-sm text-gray-500'>
            Changing the language will also update the language used in the
            extension popup.
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-4 '>
          {languages.map((language) => (
            <div
              key={language.code}
              className={`
                flex flex-col items-center p-3 rounded-lg cursor-pointer border transition-all
                ${
                  selectedLanguage === language.code
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }
              `}
              onClick={() => handleSelectLanguage(language.code)}
            >
              <div className='relative mb-2'>
                <div className='text-2xl'>
                  {getFlagEmoji(language.countryCode)}
                </div>
                {selectedLanguage === language.code && (
                  <div className='absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5'>
                    <Check className='h-3 w-3' />
                  </div>
                )}
              </div>
              <div className='text-sm font-medium'>{language.name}</div>
              <div className='text-xs text-gray-500 mt-1'>
                {language.countryCode}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className='flex justify-between sm:justify-end gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to convert country code to flag emoji
function getFlagEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
