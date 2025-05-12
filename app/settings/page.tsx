"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import {
  Mail,
  User,
  KeyRound,
  Check,
  Shield,
  Trash2,
  Edit,
  Save,
  Eye,
  EyeOff,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ChevronsUpDown,
  LinkIcon,
  Unlink,
  ComputerIcon as Microsoft,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Add the useTheme hook import at the top of the file with the other imports
import { useTheme } from "@/components/theme-provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Add the following imports at the top with the other imports
import { FcGoogle } from "react-icons/fc";

export default function SettingsPage() {
  // State for general settings
  const [oneTimeCodeEnabled, setOneTimeCodeEnabled] = useState(true);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [transactionalEnabled, setTransactionalEnabled] = useState(true);
  const [receiptsEnabled, setReceiptsEnabled] = useState(false);
  const [language, setLanguage] = useState("en");

  // State for editable sections
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Email section state
  const [email, setEmail] = useState("hashimtopaz@gmail.com");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Personal details section state
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "Hashim",
    lastName: "Topaz",
    company: "Autorefresh Inc.",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Lane",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "US",
  });
  const [newPersonalDetails, setNewPersonalDetails] = useState({
    ...personalDetails,
  });
  const [personalLoading, setPersonalLoading] = useState(false);
  const [personalSuccess, setPersonalSuccess] = useState(false);

  // Password section state
  const [passwordDetails, setPasswordDetails] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 2FA section state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("email");
  const [twoFactorSetupStep, setTwoFactorSetupStep] = useState(0);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [confirmDisable2FA, setConfirmDisable2FA] = useState(false);

  // Mock backup codes
  const backupCodes = [
    "ABCD-EFGH-IJKL",
    "MNOP-QRST-UVWX",
    "1234-5678-9012",
    "WXYZ-3456-7890",
    "LMNO-PQRS-TUVW",
    "5678-9012-3456",
    "HIJK-LMNO-PQRS",
    "9012-3456-7890",
  ];

  // Countries list
  const countries = [
    { name: "Afghanistan", code: "AF" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Brazil", code: "BR" },
    { name: "Brunei", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cabo Verde", code: "CV" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Costa Rica", code: "CR" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Eswatini", code: "SZ" },
    { name: "Ethiopia", code: "ET" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Greece", code: "GR" },
    { name: "Grenada", code: "GD" },
    { name: "Guatemala", code: "GT" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Honduras", code: "HN" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea, North", code: "KP" },
    { name: "Korea, South", code: "KR" },
    { name: "Kosovo", code: "XK" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Laos", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia", code: "FM" },
    { name: "Moldova", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "North Macedonia", code: "MK" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Palestine", code: "PS" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Qatar", code: "QA" },
    { name: "Romania", code: "RO" },
    { name: "Russia", code: "RU" },
    { name: "Rwanda", code: "RW" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia", code: "RS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Sudan", code: "SS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syria", code: "SY" },
    { name: "Taiwan", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "United States", code: "US" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Vatican City", code: "VA" },
    { name: "Venezuela", code: "VE" },
    { name: "Vietnam", code: "VN" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ];

  // Add these new state variables after the other state declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle email update
  const handleEmailUpdate = () => {
    // Basic email validation
    if (!newEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailLoading(true);
    setEmailError("");

    // Simulate API call
    setTimeout(() => {
      setEmail(newEmail);
      setEmailLoading(false);
      setEditingEmail(false);
      setEmailSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setEmailSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Handle personal details update
  const handlePersonalUpdate = () => {
    setPersonalLoading(true);

    // Simulate API call
    setTimeout(() => {
      setPersonalDetails({ ...newPersonalDetails });
      setPersonalLoading(false);
      setEditingPersonal(false);
      setPersonalSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setPersonalSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Handle password update
  const handlePasswordUpdate = () => {
    // Validate password
    if (!passwordDetails.current) {
      setPasswordError("Current password is required");
      return;
    }

    if (!passwordDetails.new) {
      setPasswordError("New password is required");
      return;
    }

    if (passwordDetails.new !== passwordDetails.confirm) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordDetails.new.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");

    // Simulate API call
    setTimeout(() => {
      setPasswordLoading(false);
      setEditingPassword(false);
      setPasswordSuccess(true);
      setPasswordDetails({
        current: "",
        new: "",
        confirm: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Handle 2FA setup
  const handle2FASetup = () => {
    if (twoFactorSetupStep === 0) {
      setTwoFactorSetupStep(1);
    } else if (twoFactorSetupStep === 1) {
      // Validate code
      if (!twoFactorCode || twoFactorCode.length !== 6) {
        setTwoFactorError("Please enter a valid 6-digit code");
        return;
      }

      setTwoFactorLoading(true);
      setTwoFactorError("");

      // Simulate API call
      setTimeout(() => {
        if (twoFactorCode === "123456") {
          setTwoFactorSetupStep(2);
          setTwoFactorLoading(false);
          setTwoFactorEnabled(true);
        } else {
          setTwoFactorError("Invalid code. Please try again.");
          setTwoFactorLoading(false);
        }
      }, 1000);
    }
  };

  // Handle 2FA disable
  const handle2FADisable = () => {
    setTwoFactorLoading(true);

    // Simulate API call
    setTimeout(() => {
      setTwoFactorEnabled(false);
      setTwoFactorSetupStep(0);
      setTwoFactorLoading(false);
      setConfirmDisable2FA(false);
    }, 1000);
  };

  // Cancel editing functions
  const cancelEditEmail = () => {
    setEditingEmail(false);
    setNewEmail("");
    setEmailError("");
  };

  const cancelEditPersonal = () => {
    setEditingPersonal(false);
    setNewPersonalDetails({ ...personalDetails });
  };

  const cancelEditPassword = () => {
    setEditingPassword(false);
    setPasswordDetails({
      current: "",
      new: "",
      confirm: "",
    });
    setPasswordError("");
  };

  // Copy backup code to clipboard
  const copyBackupCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  // Download backup codes
  const downloadBackupCodes = () => {
    const content = backupCodes.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "2fa-backup-codes.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add this new function before the return statement
  const handleDeleteAccount = () => {
    if (deleteConfirmation !== email) {
      setDeleteError("Please enter your email correctly to confirm deletion");
      return;
    }

    setDeleteLoading(true);
    setDeleteError("");

    // Simulate API call
    setTimeout(() => {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      // In a real app, you would redirect to a logout page or home page
      // window.location.href = "/"
    }, 2000);
  };

  // Theme selector component
  function ThemeSelector() {
    const { theme, setTheme } = useTheme();

    return (
      <div className='space-y-6'>
        <div className='grid sm:grid-cols-3 grid-cols-1 gap-4'>
          {/* Light Theme Option */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 ${
              theme === "light"
                ? "border-emerald-600 dark:border-emerald-400"
                : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            } overflow-hidden transition-all`}
            onClick={() => setTheme("light")}
          >
            <div className='bg-white p-4 flex flex-col items-center'>
              <div className='h-24 w-full rounded-md bg-gray-100 mb-3 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-amber-500'
                >
                  <circle cx='12' cy='12' r='4' />
                  <path d='M12 2v2' />
                  <path d='M12 20v2' />
                  <path d='m4.93 4.93 1.41 1.41' />
                  <path d='m17.66 17.66 1.41 1.41' />
                  <path d='M2 12h2' />
                  <path d='M20 12h2' />
                  <path d='m6.34 17.66-1.41 1.41' />
                  <path d='m19.07 4.93-1.41 1.41' />
                </svg>
              </div>
              <span className='font-medium text-gray-900'>Light</span>
              {theme === "light" && (
                <div className='absolute top-2 right-2 h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center'>
                  <Check className='h-3 w-3 text-emerald-600' />
                </div>
              )}
            </div>
          </div>

          {/* Dark Theme Option */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 ${
              theme === "dark"
                ? "border-emerald-600 dark:border-emerald-400"
                : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            } overflow-hidden transition-all`}
            onClick={() => setTheme("dark")}
          >
            <div className='bg-gray-950 p-4 flex flex-col items-center'>
              <div className='h-24 w-full rounded-md bg-gray-800 mb-3 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='text-indigo-400'
                >
                  <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                </svg>
              </div>
              <span className='font-medium text-gray-200'>Dark</span>
              {theme === "dark" && (
                <div className='absolute top-2 right-2 h-5 w-5 rounded-full bg-emerald-900/50 flex items-center justify-center'>
                  <Check className='h-3 w-3 text-emerald-400' />
                </div>
              )}
            </div>
          </div>

          {/* System Theme Option */}
          <div
            className={`relative cursor-pointer rounded-lg border-2 ${
              theme === "system"
                ? "border-emerald-600 dark:border-emerald-400"
                : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            } overflow-hidden transition-all`}
            onClick={() => setTheme("system")}
          >
            <div className='bg-gradient-to-b from-sky-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4 flex flex-col items-center relative overflow-hidden'>
              {/* Day/Night Cycle Illustration */}
              <div className='h-24 w-full rounded-md bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 mb-3 flex items-center justify-center relative'>
                <div className='absolute inset-0 overflow-hidden'>
                  <div className='absolute top-2 left-2 h-6 w-6 rounded-full bg-yellow-300 dark:bg-indigo-400 opacity-90 dark:opacity-70 shadow-lg'></div>
                  <div className='absolute bottom-2 right-2 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-500 opacity-70'></div>
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='32'
                      height='32'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='text-gray-700 dark:text-gray-300'
                    >
                      <path d='M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16' />
                      <path d='M7 16v-1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v1' />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='flex items-center space-x-1.5'>
                <div className='h-2.5 w-2.5 rounded-full bg-yellow-400 dark:bg-indigo-400'></div>
                <span className='font-medium text-gray-700 dark:text-gray-200'>
                  System
                </span>
              </div>
              {theme === "system" && (
                <div className='absolute top-2 right-2 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center'>
                  <Check className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Linked accounts component
  function LinkedAccounts() {
    const [accounts, setAccounts] = useState([
      {
        id: "google",
        name: "Google",
        email: "hashimtopaz@gmail.com",
        connected: true,
        icon: FcGoogle,
      },
      {
        id: "microsoft",
        name: "Microsoft",
        email: "hashim.topaz@outlook.com",
        connected: true,
        icon: Microsoft,
      },
    ]);

    const [confirmDisconnect, setConfirmDisconnect] = useState<string | null>(
      null
    );
    const [disconnecting, setDisconnecting] = useState(false);

    const handleDisconnect = (accountId: string) => {
      setDisconnecting(true);

      // Simulate API call
      setTimeout(() => {
        setAccounts(
          accounts.map((account) =>
            account.id === accountId
              ? { ...account, connected: false }
              : account
          )
        );
        setDisconnecting(false);
        setConfirmDisconnect(null);
      }, 1000);
    };

    const handleConnect = (accountId: string) => {
      // In a real app, this would redirect to OAuth flow
      alert(`This would redirect to ${accountId} login page`);
    };

    return (
      <div className='space-y-4'>
        {accounts.map((account) => (
          <div
            key={account.id}
            className='flex items-center justify-between p-4 max-sm:flex-col max-sm:items-start gap-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50'
          >
            <div className='flex items-center space-x-4'>
              <div className='h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center'>
                <account.icon className='h-6 w-6' />
              </div>
              <div>
                <h3 className='font-medium'>{account.name}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {account.connected ? account.email : "Not connected"}
                </p>
              </div>
            </div>

            {account.connected ? (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setConfirmDisconnect(account.id)}
                className='text-gray-500 hover:text-red-600 hover:border-red-200 dark:hover:border-red-800'
              >
                <Unlink className='h-4 w-4 mr-2' />
                Disconnect
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleConnect(account.id)}
                className='text-gray-500 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800'
              >
                <LinkIcon className='h-4 w-4 mr-2' />
                Connect
              </Button>
            )}
          </div>
        ))}

        <Dialog
          open={!!confirmDisconnect}
          onOpenChange={() => setConfirmDisconnect(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disconnect Account</DialogTitle>
              <DialogDescription>
                Are you sure you want to disconnect this account? You will need
                to reconnect it later if you want to use it for login.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => setConfirmDisconnect(null)}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() =>
                  confirmDisconnect && handleDisconnect(confirmDisconnect)
                }
                disabled={disconnecting}
              >
                {disconnecting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Disconnecting...
                  </>
                ) : (
                  "Disconnect"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900'>
      {/* Sidebar */}
      <Sidebar activePage='settings' />

      {/* Main content */}
      <main className='flex-1 p-6 lg:p-8 pb-24'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='text-3xl font-bold tracking-tight mb-8 max-md:ml-[52px]'>
            Account Settings
          </h1>

          {/* Email Section */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <Mail className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <CardTitle>Email Address</CardTitle>
                  <CardDescription>Manage your email address</CardDescription>
                </div>
              </div>
              {!editingEmail && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingEmail(true)}
                >
                  <Edit className='h-4 w-4 mr-2' />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {emailSuccess && (
                <Alert className='mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'>
                  <CheckCircle2 className='h-4 w-4' />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your email has been updated successfully.
                  </AlertDescription>
                </Alert>
              )}

              {!editingEmail ? (
                <div className='py-2'>
                  <p className='text-lg'>{email}</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>New Email Address</Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your new email address'
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setEmailError("");
                      }}
                      className={emailError ? "border-red-500" : ""}
                    />
                    {emailError && (
                      <p className='text-sm text-red-500'>{emailError}</p>
                    )}
                  </div>

                  <div className='flex space-x-2'>
                    <Button onClick={handleEmailUpdate} disabled={emailLoading}>
                      {emailLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant='outline' onClick={cancelEditEmail}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Details Section */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <User className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>
                    Manage your personal information
                  </CardDescription>
                </div>
              </div>
              {!editingPersonal && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingPersonal(true)}
                >
                  <Edit className='h-4 w-4 mr-2' />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {personalSuccess && (
                <Alert className='mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'>
                  <CheckCircle2 className='h-4 w-4' />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your personal details have been updated successfully.
                  </AlertDescription>
                </Alert>
              )}

              {!editingPersonal ? (
                <div className='space-y-6'>
                  {/* Profile summary */}
                  <div className='pb-4 border-b border-gray-100 dark:border-gray-800'>
                    <h3 className='text-lg font-medium'>
                      {personalDetails.firstName} {personalDetails.lastName}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {personalDetails.company}
                    </p>
                  </div>

                  {/* Contact information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Contact Information
                      </h4>

                      <div className='space-y-3'>
                        <div className='flex items-start'>
                          <Mail className='h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3' />
                          <div>
                            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                              Email
                            </p>
                            <p className='text-base'>hashimtopaz@gmail.com</p>
                          </div>
                        </div>

                        <div className='flex items-start'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3'
                          >
                            <path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' />
                          </svg>
                          <div>
                            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                              Phone
                            </p>
                            <p className='text-base'>{personalDetails.phone}</p>
                          </div>
                        </div>

                        <div className='flex items-start'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-3'
                          >
                            <path d='M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z' />
                            <path d='M12 21c-5 0-8-3-8-8 0-3.8 2.5-7.2 8-11 5.5 3.8 8 7.2 8 11 0 5-3 8-8 8Z' />
                          </svg>
                          <div>
                            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
                              Company
                            </p>
                            <p className='text-base'>
                              {personalDetails.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Address
                      </h4>

                      <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800'>
                        <div className='space-y-1'>
                          <p className='text-base'>{personalDetails.address}</p>
                          <p className='text-base'>
                            {personalDetails.city}, {personalDetails.state}{" "}
                            {personalDetails.zipCode}
                          </p>
                          <p className='text-base'>
                            {countries.find(
                              (c) => c.code === personalDetails.country
                            )?.name || personalDetails.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='space-y-6'>
                  <div className='bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4 mb-4'>
                    <div className='flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-amber-500 dark:text-amber-400 h-5 w-5 mr-2 flex-shrink-0'
                      >
                        <path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
                        <path d='M12 9v4' />
                        <path d='M12 17h.01' />
                      </svg>
                      <p className='text-sm text-amber-800 dark:text-amber-300'>
                        Your personal information is used to enhance your
                        experience and for billing purposes.
                      </p>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Personal Information
                      </h4>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='firstName'
                            className='text-xs font-medium'
                          >
                            First Name
                          </Label>
                          <Input
                            id='firstName'
                            value={newPersonalDetails.firstName}
                            onChange={(e) =>
                              setNewPersonalDetails({
                                ...newPersonalDetails,
                                firstName: e.target.value,
                              })
                            }
                            className='h-9'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='lastName'
                            className='text-xs font-medium'
                          >
                            Last Name
                          </Label>
                          <Input
                            id='lastName'
                            value={newPersonalDetails.lastName}
                            onChange={(e) =>
                              setNewPersonalDetails({
                                ...newPersonalDetails,
                                lastName: e.target.value,
                              })
                            }
                            className='h-9'
                          />
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <Label
                          htmlFor='company'
                          className='text-xs font-medium'
                        >
                          Company
                        </Label>
                        <Input
                          id='company'
                          value={newPersonalDetails.company}
                          onChange={(e) =>
                            setNewPersonalDetails({
                              ...newPersonalDetails,
                              company: e.target.value,
                            })
                          }
                          className='h-9'
                        />
                      </div>

                      <div className='space-y-2'>
                        <Label htmlFor='phone' className='text-xs font-medium'>
                          Phone
                        </Label>
                        <Input
                          id='phone'
                          value={newPersonalDetails.phone}
                          onChange={(e) =>
                            setNewPersonalDetails({
                              ...newPersonalDetails,
                              phone: e.target.value,
                            })
                          }
                          className='h-9'
                        />
                      </div>
                    </div>

                    <div className='space-y-4'>
                      <h4 className='text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Address
                      </h4>

                      <div className='space-y-2'>
                        <Label
                          htmlFor='address'
                          className='text-xs font-medium'
                        >
                          Street Address
                        </Label>
                        <Input
                          id='address'
                          value={newPersonalDetails.address}
                          onChange={(e) =>
                            setNewPersonalDetails({
                              ...newPersonalDetails,
                              address: e.target.value,
                            })
                          }
                          className='h-9'
                        />
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='city' className='text-xs font-medium'>
                            City
                          </Label>
                          <Input
                            id='city'
                            value={newPersonalDetails.city}
                            onChange={(e) =>
                              setNewPersonalDetails({
                                ...newPersonalDetails,
                                city: e.target.value,
                              })
                            }
                            className='h-9'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='state'
                            className='text-xs font-medium'
                          >
                            State/Province
                          </Label>
                          <Input
                            id='state'
                            value={newPersonalDetails.state}
                            onChange={(e) =>
                              setNewPersonalDetails({
                                ...newPersonalDetails,
                                state: e.target.value,
                              })
                            }
                            className='h-9'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='zipCode'
                            className='text-xs font-medium'
                          >
                            Zip/Postal Code
                          </Label>
                          <Input
                            id='zipCode'
                            value={newPersonalDetails.zipCode}
                            onChange={(e) =>
                              setNewPersonalDetails({
                                ...newPersonalDetails,
                                zipCode: e.target.value,
                              })
                            }
                            className='h-9'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='country'
                            className='text-xs font-medium'
                          >
                            Country
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant='outline'
                                role='combobox'
                                className='h-9 w-full justify-between font-normal'
                              >
                                {newPersonalDetails.country
                                  ? countries.find(
                                      (country) =>
                                        country.code ===
                                        newPersonalDetails.country
                                    )?.name || "Select country"
                                  : "Select country"}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-full p-0'
                              align='start'
                            >
                              <Command>
                                <CommandInput placeholder='Search country...' />
                                <CommandList>
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup className='max-h-[300px] overflow-y-auto'>
                                    {countries.map((country) => (
                                      <CommandItem
                                        key={country.code}
                                        value={country.name}
                                        onSelect={() => {
                                          setNewPersonalDetails({
                                            ...newPersonalDetails,
                                            country: country.code,
                                          });
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            newPersonalDetails.country ===
                                              country.code
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {country.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-start space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800'>
                    <Button variant='outline' onClick={cancelEditPersonal}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePersonalUpdate}
                      disabled={personalLoading}
                      className='min-w-[120px]'
                    >
                      {personalLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <KeyRound className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </div>
              </div>
              {!editingPassword && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setEditingPassword(true)}
                >
                  <Edit className='h-4 w-4 mr-2' />
                  Change
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {passwordSuccess && (
                <Alert className='mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'>
                  <CheckCircle2 className='h-4 w-4' />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your password has been updated successfully.
                  </AlertDescription>
                </Alert>
              )}

              {!editingPassword ? (
                <div className='py-2'>
                  <p className='text-base'>••••••••••••</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    Last updated 30 days ago
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='currentPassword'>Current Password</Label>
                    <div className='relative'>
                      <Input
                        id='currentPassword'
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder='Enter your current password'
                        value={passwordDetails.current}
                        onChange={(e) => {
                          setPasswordDetails({
                            ...passwordDetails,
                            current: e.target.value,
                          });
                          setPasswordError("");
                        }}
                        className={
                          passwordError && !passwordDetails.current
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='h-4 w-4 text-gray-500' />
                        ) : (
                          <Eye className='h-4 w-4 text-gray-500' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <div className='relative'>
                      <Input
                        id='newPassword'
                        type={showNewPassword ? "text" : "password"}
                        placeholder='Enter your new password'
                        value={passwordDetails.new}
                        onChange={(e) => {
                          setPasswordDetails({
                            ...passwordDetails,
                            new: e.target.value,
                          });
                          setPasswordError("");
                        }}
                        className={
                          passwordError && !passwordDetails.new
                            ? "border-red-500"
                            : ""
                        }
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4 text-gray-500' />
                        ) : (
                          <Eye className='h-4 w-4 text-gray-500' />
                        )}
                      </Button>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>
                      Confirm New Password
                    </Label>
                    <Input
                      id='confirmPassword'
                      type='password'
                      placeholder='Confirm your new password'
                      value={passwordDetails.confirm}
                      onChange={(e) => {
                        setPasswordDetails({
                          ...passwordDetails,
                          confirm: e.target.value,
                        });
                        setPasswordError("");
                      }}
                      className={
                        passwordError &&
                        passwordDetails.new !== passwordDetails.confirm
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>

                  {passwordError && (
                    <Alert variant='destructive'>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  <div className='flex space-x-2'>
                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Update Password
                        </>
                      )}
                    </Button>
                    <Button variant='outline' onClick={cancelEditPassword}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Two-Factor Authentication Section */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between flex-wrap gap-3 pb-2'>
              <div className='flex items-center space-x-4 '>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <Shield className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Secure your account with 2FA
                  </CardDescription>
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <span
                  className={`text-sm ${
                    twoFactorEnabled
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {twoFactorEnabled ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTwoFactorSetupStep(0);
                      handle2FASetup();
                    } else {
                      setConfirmDisable2FA(true);
                    }
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              {!twoFactorEnabled && twoFactorSetupStep === 0 && (
                <div className='space-y-4'>
                  <Alert className='bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'>
                    <AlertTriangle className='h-4 w-4' />
                    <AlertTitle>Recommended</AlertTitle>
                    <AlertDescription>
                      Two-factor authentication adds an extra layer of security
                      to your account.
                    </AlertDescription>
                  </Alert>

                  <Button
                    variant='outline'
                    onClick={() => setTwoFactorSetupStep(1)}
                  >
                    <Shield className='mr-2 h-4 w-4' />
                    Set Up Two-Factor Authentication
                  </Button>
                </div>
              )}

              {twoFactorSetupStep === 1 && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-medium mb-2'>
                      Set up authenticator app
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400 mb-4'>
                      Use an authenticator app like Google Authenticator,
                      Microsoft Authenticator, or Authy to get two-factor
                      authentication codes.
                    </p>

                    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center'>
                      <div className='bg-white p-4 rounded-lg mb-4'>
                        {/* This would be a real QR code in production */}
                        <div className='w-48 h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
                          <span className='text-sm text-gray-500 dark:text-gray-400'>
                            QR Code
                          </span>
                        </div>
                      </div>
                      <p className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        Scan this QR code with your authenticator app
                      </p>
                      <p className='text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded'>
                        ABCD-EFGH-IJKL-MNOP
                      </p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='verificationCode'>Verification Code</Label>
                    <Input
                      id='verificationCode'
                      placeholder='Enter 6-digit code'
                      value={twoFactorCode}
                      onChange={(e) => {
                        setTwoFactorCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        );
                        setTwoFactorError("");
                      }}
                      className={twoFactorError ? "border-red-500" : ""}
                    />
                    {twoFactorError && (
                      <p className='text-sm text-red-500'>{twoFactorError}</p>
                    )}
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <div className='flex space-x-2'>
                    <Button
                      onClick={handle2FASetup}
                      disabled={twoFactorLoading}
                    >
                      {twoFactorLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Check className='mr-2 h-4 w-4' />
                          Verify and Enable
                        </>
                      )}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setTwoFactorSetupStep(0)}
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    <p>For testing purposes, use code: 123456</p>
                  </div>
                </div>
              )}

              {twoFactorSetupStep === 2 && (
                <div className='space-y-6'>
                  <Alert className='bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'>
                    <CheckCircle2 className='h-4 w-4' />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Two-factor authentication has been enabled for your
                      account.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <h3 className='text-lg font-medium mb-2'>Backup Codes</h3>
                    <p className='text-gray-500 dark:text-gray-400 mb-4'>
                      Save these backup codes in a safe place. You can use them
                      to access your account if you lose your authenticator
                      device.
                    </p>

                    <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800'>
                      <div className='grid grid-cols-2 gap-2'>
                        {backupCodes.map((code, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700'
                          >
                            <span className='font-mono text-sm'>{code}</span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => copyBackupCode(code)}
                              className='h-6 w-6 p-0'
                            >
                              <Copy className='h-3 w-3' />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className='mt-4 flex justify-end'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={downloadBackupCodes}
                        >
                          <Download className='mr-2 h-4 w-4' />
                          Download Codes
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className='pt-2'>
                    <Button
                      variant='outline'
                      onClick={() => setTwoFactorSetupStep(0)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              )}

              {twoFactorEnabled && twoFactorSetupStep === 0 && (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium'>Authentication Method</h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Authenticator App
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                    >
                      {showBackupCodes
                        ? "Hide Backup Codes"
                        : "View Backup Codes"}
                    </Button>
                  </div>

                  {showBackupCodes && (
                    <div className='bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800'>
                      <h4 className='font-medium mb-2'>Backup Codes</h4>
                      <div className='grid grid-cols-2 gap-2'>
                        {backupCodes.map((code, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700'
                          >
                            <span className='font-mono text-sm'>{code}</span>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => copyBackupCode(code)}
                              className='h-6 w-6 p-0'
                            >
                              <Copy className='h-3 w-3' />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className='mt-4 flex justify-end'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={downloadBackupCodes}
                        >
                          <Download className='mr-2 h-4 w-4' />
                          Download Codes
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    variant='destructive'
                    onClick={() => setConfirmDisable2FA(true)}
                  >
                    Disable Two-Factor Authentication
                  </Button>
                </div>
              )}

              <Dialog
                open={confirmDisable2FA}
                onOpenChange={setConfirmDisable2FA}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Disable Two-Factor Authentication?
                    </DialogTitle>
                    <DialogDescription>
                      This will make your account less secure. Are you sure you
                      want to disable two-factor authentication?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setConfirmDisable2FA(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='destructive'
                      onClick={handle2FADisable}
                      disabled={twoFactorLoading}
                    >
                      {twoFactorLoading ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Disabling...
                        </>
                      ) : (
                        "Disable 2FA"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Linked Accounts Section */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <LinkIcon className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <CardTitle>Linked Accounts</CardTitle>
                  <CardDescription>
                    Connect your Google or Microsoft account for faster,
                    password-free login and enhanced account security.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                <LinkedAccounts />

                <div className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                  <p>
                    You can add more linked accounts to make signing in easier.
                  </p>
                  <p className='mt-1'>
                    We never post to your accounts without your permission.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* One-time code preference */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <Check className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                </div>
                <div>
                  <CardTitle>Login Preferences</CardTitle>
                  <CardDescription>Manage how you sign in</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className='space-y-6'>
                {/* Main toggle section with improved layout */}
                <div className='flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 transition-all hover:bg-gray-100/50 dark:hover:bg-gray-900/70'>
                  <div className='space-y-1.5'>
                    <div className='flex items-center gap-2'>
                      <h3 className='font-medium text-base'>
                        One-time code login
                      </h3>
                      {oneTimeCodeEnabled && (
                        <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'>
                          Active
                        </span>
                      )}
                    </div>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Use a one-time email code as the primary login method
                    </p>
                  </div>
                  <Switch
                    checked={oneTimeCodeEnabled}
                    onCheckedChange={setOneTimeCodeEnabled}
                    aria-label='Toggle one-time code login'
                    className='data-[state=checked]:bg-emerald-600 dark:data-[state=checked]:bg-emerald-600'
                  />
                </div>

                {/* Benefits section with improved visual design */}
                <div className='rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800'>
                  <div className='bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 border-b border-emerald-100 dark:border-emerald-900/30'>
                    <h4 className='font-medium text-emerald-700 dark:text-emerald-400 flex items-center'>
                      <Check className='h-4 w-4 mr-2' />
                      Benefits of one-time code login
                    </h4>
                  </div>

                  <div className='p-4 bg-white dark:bg-gray-950/50'>
                    <ul className='space-y-3'>
                      <li className='flex items-start'>
                        <div className='flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5'>
                          <Check className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
                        </div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          No need to remember passwords
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <div className='flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5'>
                          <Check className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
                        </div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          More secure than password-only authentication
                        </span>
                      </li>
                      <li className='flex items-start'>
                        <div className='flex-shrink-0 h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3 mt-0.5'>
                          <Check className='h-3 w-3 text-emerald-600 dark:text-emerald-400' />
                        </div>
                        <span className='text-sm text-gray-600 dark:text-gray-300'>
                          Faster login on trusted devices
                        </span>
                      </li>
                    </ul>

                    <div className='mt-4 pt-3 border-t border-gray-100 dark:border-gray-800'>
                      <p className='text-xs text-gray-500 dark:text-gray-400 italic'>
                        You can still log in with your password when needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection Section */}
          <Card className='mb-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <div className='flex items-center space-x-4'>
                <div className='h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='text-emerald-600 dark:text-emerald-400'
                  >
                    <circle cx='12' cy='12' r='4' />
                    <path d='M12 2v2' />
                    <path d='M12 20v2' />
                    <path d='m4.93 4.93 1.41 1.41' />
                    <path d='m17.66 17.66 1.41 1.41' />
                    <path d='M2 12h2' />
                    <path d='M20 12h2' />
                    <path d='m6.34 17.66-1.41 1.41' />
                    <path d='m19.07 4.93-1.41 1.41' />
                  </svg>
                </div>
                <div>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription>
                    Customize your visual experience
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='max-w-[40rem] mx-auto p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50 shadow-sm'>
                <ThemeSelector />
              </div>
            </CardContent>
          </Card>

          {/* Email Subscription Section */}
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Email Subscription</CardTitle>
              <CardDescription>Manage your email preferences</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                {/* Newsletter */}
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>
                    Receive Autorefresh Plus newsletter
                  </p>
                  <Switch
                    checked={newsletterEnabled}
                    onCheckedChange={setNewsletterEnabled}
                  />
                </div>

                {/* Transactional emails */}
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>Receive transactional emails</p>
                  <Switch
                    checked={transactionalEnabled}
                    onCheckedChange={setTransactionalEnabled}
                  />
                </div>

                {/* Receipts */}
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>
                    Send receipts to Autorefresh Plus
                  </p>
                  <Switch
                    checked={receiptsEnabled}
                    onCheckedChange={setReceiptsEnabled}
                  />
                </div>

                {/* Language selection */}
                <div className='space-y-2'>
                  <Label htmlFor='language'>Languages for email</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      id='language'
                      className='w-full md:w-[300px]'
                    >
                      <SelectValue placeholder='Select a language' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='en'>English (en)</SelectItem>
                      <SelectItem value='es'>Español (es)</SelectItem>
                      <SelectItem value='fr'>Français (fr)</SelectItem>
                      <SelectItem value='de'>Deutsch (de)</SelectItem>
                      <SelectItem value='ja'>日本語 (ja)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Data Section */}
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Personal Data</CardTitle>
              <CardDescription>Manage your account data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant='destructive'
                className='flex items-center'
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className='h-4 w-4 mr-2' />
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className='max-w-[35rem]'>
              <DialogHeader>
                <DialogTitle className='text-red-600 dark:text-red-500'>
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers.
                </DialogDescription>
              </DialogHeader>

              <div className='py-6'>
                <div className='mb-6 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800/60 overflow-hidden'>
                  <div className='bg-red-100 dark:bg-red-900/30 px-4 py-2 flex items-center'>
                    <AlertTriangle className='h-5 w-5 text-red-600 dark:text-red-400 mr-2' />
                    <h3 className='font-medium text-red-800 dark:text-red-300'>
                      Critical Warning
                    </h3>
                  </div>

                  <div className='p-4'>
                    <p className='text-sm text-red-700 dark:text-red-300 mb-3'>
                      Deleting your account will permanently remove:
                    </p>
                    <ul className='grid gap-2 mb-3'>
                      <li className='flex items-start text-sm'>
                        <div className='mr-2 mt-0.5 h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center'>
                          <span className='text-red-600 dark:text-red-400 text-xs'>
                            1
                          </span>
                        </div>
                        <span className='text-gray-700 dark:text-gray-300'>
                          All your personal information and settings
                        </span>
                      </li>
                      <li className='flex items-start text-sm'>
                        <div className='mr-2 mt-0.5 h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center'>
                          <span className='text-red-600 dark:text-red-400 text-xs'>
                            2
                          </span>
                        </div>
                        <span className='text-gray-700 dark:text-gray-300'>
                          All active subscriptions and billing information
                        </span>
                      </li>
                      <li className='flex items-start text-sm'>
                        <div className='mr-2 mt-0.5 h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center'>
                          <span className='text-red-600 dark:text-red-400 text-xs'>
                            3
                          </span>
                        </div>
                        <span className='text-gray-700 dark:text-gray-300'>
                          All your devices and device configurations
                        </span>
                      </li>
                      <li className='flex items-start text-sm'>
                        <div className='mr-2 mt-0.5 h-5 w-5 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center'>
                          <span className='text-red-600 dark:text-red-400 text-xs'>
                            4
                          </span>
                        </div>
                        <span className='text-gray-700 dark:text-gray-300'>
                          Access to all premium features and services
                        </span>
                      </li>
                    </ul>

                    <p className='text-xs italic text-red-600 dark:text-red-400'>
                      This action cannot be reversed. All data will be
                      permanently deleted.
                    </p>
                  </div>
                </div>

                <div className='border-t border-b border-gray-200 dark:border-gray-800 py-5 mb-5'>
                  <div className='space-y-3'>
                    <Label
                      htmlFor='delete-confirmation'
                      className='text-base font-medium block'
                    >
                      Confirm deletion
                    </Label>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      Please type{" "}
                      <span className='font-bold text-gray-900 dark:text-gray-200'>
                        {email}
                      </span>{" "}
                      to confirm account deletion
                    </p>
                    <Input
                      id='delete-confirmation'
                      value={deleteConfirmation}
                      onChange={(e) => {
                        setDeleteConfirmation(e.target.value);
                        setDeleteError("");
                      }}
                      placeholder='Enter your email address'
                      className={`${
                        deleteError
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:ring-red-500"
                      } border-gray-300 dark:border-gray-700`}
                    />
                    {deleteError && (
                      <div className='flex items-center text-sm text-red-600 dark:text-red-400 mt-1'>
                        <AlertTriangle className='h-3.5 w-3.5 mr-1.5' />
                        {deleteError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className='flex space-x-2 sm:justify-between'>
                <Button
                  variant='outline'
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== email || deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Permanently Delete Account
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
