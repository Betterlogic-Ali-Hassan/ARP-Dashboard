"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Download, MapPin, Shield, AlertTriangle, FileText, Loader2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CancelSubscriptionDialog } from "@/components/cancel-subscription-dialog"
import { PlanChangeDialog } from "@/components/plan-change-dialog"
import { SubscriptionNotification } from "@/components/subscription-notification"
import { BillingAddressDialog } from "@/components/billing-address-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { PlanCard } from "@/components/plan-card"
import { type PlanType, type BillingPeriodType, PLANS, getPlanAmount } from "@/lib/plan-utils"
import { generateInvoicePDF, downloadPDF, type InvoiceData } from "@/lib/generate-invoice-pdf"
import { InvoiceMissingInfoDialog } from "@/components/invoice-missing-info-dialog"
import { format } from "date-fns"
import { useSubscriptionStore } from "@/stores/subscription-store"
import { useDeviceCountSync } from "@/lib/subscription-store"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock subscription data
const initialSubscription = {
  plan: "team" as PlanType,
  status: "active" as "active" | "canceled" | "scheduled_downgrade" | "past_due",
  billingPeriod: "yearly" as BillingPeriodType,
  startDate: "2023-04-01",
  nextBillingDate: "2024-04-01",
  amount: "$95.88",
  deviceLimit: 5,
  devicesUsed: 7,
  paymentMethod: {
    type: "card",
    last4: "4242",
    expiry: "04/25",
    brand: "visa",
  },
  billingAddress: {
    name: "John Doe",
    line1: "123 Main St",
    line2: "Suite 100",
    city: "San Francisco",
    state: "CA",
    postalCode: "94103",
    country: "US",
  },
  invoices: [
    {
      id: "INV-001",
      date: "2023-04-01",
      amount: "$95.88",
      status: "paid",
      transactionId: "txn_1234567890",
    },
    {
      id: "INV-002",
      date: "2023-05-01",
      amount: "$95.88",
      status: "paid",
      transactionId: "txn_0987654321",
    },
  ],
}

export default function SubscriptionPage() {
  const { toast } = useToast()

  // Use the device count sync hook to get the current device count
  const deviceCount = useDeviceCountSync()

  const {
    status: subscriptionStatus,
    currentPlan,
    targetPlan,
    expiryDate,
    billingPeriod,
    deviceLimit,
    updateStatus,
    updatePlan,
    updateTargetPlan,
    reactivateSubscription,
  } = useSubscriptionStore()

  const [subscription, setSubscription] = useState(initialSubscription)

  // Track which invoice is currently being downloaded
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)

  // Create a merged subscription object that combines store values with other needed data
  const mergedSubscription = {
    plan: currentPlan,
    status: subscriptionStatus,
    billingPeriod: billingPeriod,
    nextBillingDate: expiryDate,
    startDate: "2023-04-01", // Keep this from the mock data
    amount: getPlanAmount(currentPlan, billingPeriod),
    deviceLimit: deviceLimit,
    devicesUsed: deviceCount, // Use the synced device count
    paymentMethod: initialSubscription.paymentMethod,
    billingAddress: initialSubscription.billingAddress,
    invoices: initialSubscription.invoices,
  }

  const [planChangeDialogOpen, setPlanChangeDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [billingAddressDialogOpen, setBillingAddressDialogOpen] = useState(false)
  const [invoiceMissingInfoDialogOpen, setInvoiceMissingInfoDialogOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "pm_1",
      type: "card",
      brand: "visa",
      last4: "4242",
      expiry: "04/25",
      name: "John Doe",
      isDefault: true,
    },
  ])

  // Add a new state for the confirmation dialog
  const [confirmDeletePaymentMethod, setConfirmDeletePaymentMethod] = useState<string | null>(null)

  const handleChangePlan = () => {
    setPlanChangeDialogOpen(true)
  }

  const handleCancelSubscription = () => {
    setCancelDialogOpen(true)
  }

  const handleReactivateSubscription = () => {
    reactivateSubscription()

    toast({
      title: "Subscription reactivated",
      description: "Your subscription has been successfully reactivated.",
    })
  }

  const handlePlanChangeComplete = (success: boolean, newPlan: PlanType) => {
    setPlanChangeDialogOpen(false)

    if (success) {
      const planDetails = PLANS[newPlan]
      const isUpgrade =
        newPlan !== "basic" &&
        (currentPlan === "basic" ||
          (newPlan === "team" && currentPlan === "individual") ||
          (newPlan === "enterprise" && (currentPlan === "individual" || currentPlan === "team")))

      // Update subscription data in the store
      updatePlan(newPlan)

      if (isUpgrade) {
        updateStatus("active")
        updateTargetPlan(null)
      } else {
        updateStatus("scheduled_downgrade")
        updateTargetPlan(newPlan)
      }

      toast({
        title: isUpgrade ? "Plan upgraded!" : "Plan downgrade scheduled",
        description: isUpgrade
          ? `Your subscription has been successfully upgraded to the ${planDetails.name} Plan.`
          : `Your plan will be downgraded to ${planDetails.name} on ${expiryDate}.`,
      })
    }
  }

  const handleCancelComplete = (success: boolean, immediate?: boolean) => {
    setCancelDialogOpen(false)

    if (success) {
      // Update subscription status in the store
      if (immediate) {
        // Immediately downgrade to basic plan
        updatePlan("basic")
        updateStatus("active")
        updateTargetPlan(null)

        toast({
          title: "Subscription cancelled immediately",
          description: "Your subscription has been cancelled and your account has been downgraded to the Basic plan.",
        })
      } else {
        // Schedule cancellation at period end
        updateStatus("canceled")

        toast({
          title: "Subscription canceled",
          description: "Your subscription has been canceled and will end at the current billing period.",
        })
      }
    }
  }

  const handleUpdateBillingAddress = () => {
    setBillingAddressDialogOpen(true)
  }

  const handleBillingAddressComplete = (success: boolean, address?: any) => {
    setBillingAddressDialogOpen(false)

    if (success && address) {
      // Update billing address
      setSubscription({
        ...subscription,
        billingAddress: address,
      })

      toast({
        title: "Billing address updated",
        description: "Your billing address has been successfully updated.",
      })

      // If there was a pending invoice download, process it now
      if (selectedInvoiceId) {
        handleDownloadInvoice(selectedInvoiceId)
      }
    }
  }

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prevMethods) =>
      prevMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated.",
    })
  }

  // Modify the handleDeletePaymentMethod function to show the confirmation dialog first
  const handleDeletePaymentMethod = (id: string) => {
    // Get the payment method to be deleted
    const methodToDelete = paymentMethods.find((method) => method.id === id)
    if (!methodToDelete) return

    // Show confirmation dialog with specific card details
    setConfirmDeletePaymentMethod(id)
  }

  // Add a new function to handle the actual deletion after confirmation
  const handleConfirmDeletePaymentMethod = () => {
    if (confirmDeletePaymentMethod) {
      const methodToDelete = paymentMethods.find((method) => method.id === confirmDeletePaymentMethod)

      // Remove the payment method
      setPaymentMethods((prevMethods) => prevMethods.filter((method) => method.id !== confirmDeletePaymentMethod))

      // If this was the default payment method and there are other methods, set a new default
      if (methodToDelete?.isDefault && paymentMethods.length > 1) {
        const newDefault = paymentMethods.find((method) => method.id !== confirmDeletePaymentMethod)
        if (newDefault) {
          setPaymentMethods((prevMethods) =>
            prevMethods.map((method) => ({
              ...method,
              isDefault: method.id === newDefault.id,
            })),
          )
        }
      }

      toast({
        title: "Payment method removed",
        description: "Your payment method has been successfully removed.",
      })

      // Reset the confirmation state
      setConfirmDeletePaymentMethod(null)
    }
  }

  const formatAddress = (address: any) => {
    if (!address) return "No address on file"

    const parts = [
      address.line1,
      address.line2,
      `${address.city}, ${address.state} ${address.postalCode}`,
      address.country,
    ].filter(Boolean)

    return parts.join(", ")
  }

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return (
          <div className="h-8 w-12 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            VISA
          </div>
        )
      case "mastercard":
        return (
          <div className="h-8 w-12 bg-red-500 rounded-md flex items-center justify-center text-white font-bold">MC</div>
        )
      case "amex":
        return (
          <div className="h-8 w-12 bg-blue-400 rounded-md flex items-center justify-center text-white font-bold">
            AMEX
          </div>
        )
      default:
        return <CreditCard className="h-8 w-8" />
    }
  }

  // Check if billing address is complete
  const isBillingAddressComplete = () => {
    const { billingAddress } = subscription
    return !!(
      billingAddress &&
      billingAddress.name &&
      billingAddress.line1 &&
      billingAddress.city &&
      billingAddress.state &&
      billingAddress.postalCode &&
      billingAddress.country
    )
  }

  // Handle invoice download
  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // Set the downloading state
      setDownloadingInvoice(invoiceId)

      // Find the invoice
      const invoice = subscription.invoices.find((inv) => inv.id === invoiceId)
      if (!invoice) {
        throw new Error("Invoice not found")
      }

      // Check if billing address is complete
      if (!isBillingAddressComplete()) {
        setSelectedInvoiceId(invoiceId)
        setInvoiceMissingInfoDialogOpen(true)
        setDownloadingInvoice(null)
        return
      }

      // Get the default payment method
      const defaultPaymentMethod = paymentMethods.find((method) => method.isDefault)
      if (!defaultPaymentMethod) {
        throw new Error("No default payment method found")
      }

      // Parse dates for billing period
      const invoiceDate = new Date(invoice.date)
      const endDate = new Date(invoiceDate)
      endDate.setMonth(endDate.getMonth() + (subscription.billingPeriod === "yearly" ? 12 : 1))

      // Create invoice data
      const invoiceData: InvoiceData = {
        invoiceNumber: invoice.id,
        invoiceDate: format(invoiceDate, "MMM dd, yyyy"),
        customer: {
          name: subscription.billingAddress.name,
          email: "customer@example.com", // In a real app, this would come from user data
          address: subscription.billingAddress,
        },
        subscription: {
          plan: PLANS[subscription.plan].name,
          billingPeriod: subscription.billingPeriod === "yearly" ? "Yearly" : "Monthly",
          startDate: format(invoiceDate, "MMM dd, yyyy"),
          endDate: format(endDate, "MMM dd, yyyy"),
          amount: invoice.amount,
          status: invoice.status.toUpperCase(),
        },
        payment: {
          method: defaultPaymentMethod.brand.charAt(0).toUpperCase() + defaultPaymentMethod.brand.slice(1),
          last4: defaultPaymentMethod.last4,
          transactionId: invoice.transactionId || "N/A",
          nextBillingDate: format(new Date(subscription.nextBillingDate), "MMM dd, yyyy"),
        },
      }

      // Generate the PDF
      const pdfBlob = await generateInvoicePDF(invoiceData)

      // Download the PDF
      const filename = `invoice-${invoice.id}-${format(invoiceDate, "yyyy-MM-dd")}.pdf`
      downloadPDF(pdfBlob, filename)

      // Reset selected invoice
      setSelectedInvoiceId(null)

      toast({
        title: "Invoice downloaded",
        description: `Invoice ${invoice.id} has been downloaded successfully.`,
      })
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast({
        title: "Download failed",
        description: "There was an error downloading your invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Clear the downloading state
      setDownloadingInvoice(null)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "MMM dd, yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar activePage="account" />

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {/* Page-specific notification (for demo purposes) */}
        <div className="mb-6">
          <SubscriptionNotification
            status={subscriptionStatus === "active" ? null : subscriptionStatus}
            currentPlan={currentPlan}
            targetPlan={targetPlan || undefined}
            expiryDate={expiryDate}
            onReactivate={handleReactivateSubscription}
            className="rounded-lg shadow-sm"
          />
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Subscription</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your subscription, billing information, and payment methods.
            </p>
          </div>

          <div className="grid gap-4 md:gap-6">
            {/* Current Plan - Using the PlanCard component */}
            <PlanCard
              plan={mergedSubscription.plan}
              status={mergedSubscription.status}
              billingPeriod={mergedSubscription.billingPeriod}
              nextBillingDate={mergedSubscription.nextBillingDate}
              devicesUsed={mergedSubscription.devicesUsed}
              paymentMethod={mergedSubscription.paymentMethod}
              onUpgrade={handleChangePlan}
              onDowngrade={handleChangePlan}
              onCancel={handleCancelSubscription}
              onReactivate={handleReactivateSubscription}
            />

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Payment History
                </CardTitle>
                <CardDescription>View and download your past invoices.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Desktop table view */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscription.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{invoice.id}</TableCell>
                          <TableCell>{invoice.amount}</TableCell>
                          <TableCell>
                            <Badge variant={invoice.status === "paid" ? "default" : "outline"}>{invoice.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadInvoice(invoice.id)}
                                    disabled={downloadingInvoice === invoice.id}
                                    className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    {downloadingInvoice === invoice.id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <Download className="h-4 w-4 mr-1" />
                                        Download Invoice
                                      </>
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download invoice as PDF</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {subscription.invoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{invoice.id}</div>
                        <Badge variant={invoice.status === "paid" ? "default" : "outline"}>{invoice.status}</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div>{formatDate(invoice.date)}</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{invoice.amount}</div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          disabled={downloadingInvoice === invoice.id}
                          className="h-8 px-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {downloadingInvoice === invoice.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-1" />
                              Download Invoice
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {subscription.invoices.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-1">No invoices yet</p>
                    <p>Your payment history will appear here once you have made a payment.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment methods and billing information.</CardDescription>
                </div>
                <div className="flex items-center">
                  <Badge className="bg-[#635BFF] text-white hover:bg-[#8078FF] flex items-center gap-1.5 py-1.5 px-3">
                    <Shield className="h-3.5 w-3.5" />
                    Managed by Stripe
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-center mb-3 md:mb-0">
                        <div className="mr-4">{getCardIcon(method.brand)}</div>
                        <div>
                          <p className="font-medium">
                            {method.brand.toUpperCase()} •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Expires {method.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-auto">
                        {method.isDefault && <Badge>Default</Badge>}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!method.isDefault && (
                              <DropdownMenuItem onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                                Set as default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeletePaymentMethod(method.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethods.length === 0 && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-red-100 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 dark:border-red-900/50 shadow-sm">
                    <div className="px-5 py-4 flex items-center gap-4">
                      <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-full p-2.5">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-red-800 dark:text-red-300">
                          No payment method on file
                        </h4>
                        <p className="text-sm text-red-700/80 dark:text-red-400/90 mt-1">
                          Please add a payment method to ensure uninterrupted service for your subscription.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-3 bg-gradient-to-r from-red-100/80 to-amber-100/80 dark:from-red-900/20 dark:to-amber-900/20 border-t border-red-100 dark:border-red-900/30 flex justify-end">
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
                        size="sm"
                        onClick={() => {
                          /* Add payment method logic */
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">Billing Address</h4>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{subscription.billingAddress.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                          {formatAddress(subscription.billingAddress)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={handleUpdateBillingAddress} className="w-full md:w-auto">
                  <MapPin className="h-4 w-4 mr-2" />
                  Update Billing Address
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Plan Change Dialog */}
      <PlanChangeDialog
        open={planChangeDialogOpen}
        onOpenChange={setPlanChangeDialogOpen}
        currentPlan={mergedSubscription.plan}
        billingPeriod={mergedSubscription.billingPeriod}
        onComplete={handlePlanChangeComplete}
      />

      {/* Cancel Dialog */}
      <CancelSubscriptionDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onComplete={handleCancelComplete}
      />

      {/* Billing Address Dialog */}
      <BillingAddressDialog
        open={billingAddressDialogOpen}
        onOpenChange={setBillingAddressDialogOpen}
        onComplete={handleBillingAddressComplete}
        initialAddress={subscription.billingAddress}
      />

      {/* Confirm Delete Payment Method Dialog */}
      <ConfirmDialog
        open={confirmDeletePaymentMethod !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeletePaymentMethod(null)
        }}
        title="Remove Payment Method?"
        description={
          confirmDeletePaymentMethod
            ? `You're about to remove your saved payment method (${
                paymentMethods.find((m) => m.id === confirmDeletePaymentMethod)?.brand.toUpperCase() || "Card"
              } •••• ${
                paymentMethods.find((m) => m.id === confirmDeletePaymentMethod)?.last4 || "****"
              }).\n\nPlease make sure to add a new card before your next billing date to avoid interruption of your subscription.`
            : "Are you sure you want to remove this payment method?"
        }
        confirmLabel="Remove Card"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeletePaymentMethod}
        variant="destructive"
      />

      {/* Invoice Missing Info Dialog */}
      <InvoiceMissingInfoDialog
        open={invoiceMissingInfoDialogOpen}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoiceId(null)
          setInvoiceMissingInfoDialogOpen(open)
        }}
        onUpdateBillingInfo={handleUpdateBillingAddress}
      />
    </div>
  )
}
