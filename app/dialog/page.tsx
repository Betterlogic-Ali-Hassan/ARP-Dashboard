"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanChangeDialog } from "@/components/plan-change-dialog";
import { DeviceLimitUpgradeDialog } from "@/components/device-limit-upgrade-dialog";
import { PaymentMethodDialog } from "@/components/payment-method-dialog";
import { DeviceAssociationDialog } from "@/components/device-association-dialog";
import { DeviceDialog } from "@/components/device-dialog";
import { ProfileEditorDialog } from "@/components/profile-editor-dialog";
import { DowngradeDialog } from "@/components/downgrade-dialog";
import { CancelSubscriptionDialog } from "@/components/cancel-subscription-dialog";
import { BillingAddressDialog } from "@/components/billing-address-dialog";
import { InvoiceMissingInfoDialog } from "@/components/invoice-missing-info-dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TicketChatDialog } from "@/components/ticket-chat-dialog";
import { CreateTicketDialog } from "@/components/create-ticket-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DialogShowcasePage() {
  // State for controlling each dialog
  const [openPlanChange, setOpenPlanChange] = useState(false);
  const [openDeviceLimit, setOpenDeviceLimit] = useState(false);
  const [openPaymentMethod, setOpenPaymentMethod] = useState(false);
  const [openDeviceAssociation, setOpenDeviceAssociation] = useState(false);
  const [openDevice, setOpenDevice] = useState(false);
  const [openProfileEditor, setOpenProfileEditor] = useState(false);
  const [openDowngrade, setOpenDowngrade] = useState(false);
  const [openCancelSubscription, setOpenCancelSubscription] = useState(false);
  const [openBillingAddress, setOpenBillingAddress] = useState(false);
  const [openInvoiceMissing, setOpenInvoiceMissing] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openTicketChat, setOpenTicketChat] = useState(false);
  const [openCreateTicket, setOpenCreateTicket] = useState(false);

  // Mock data for dialogs that require it
  const mockProfile = {
    id: "profile-1",
    name: "Default Profile",
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      theme: "system",
      notifications: true,
      sound: true,
    },
  };

  const mockDevice = {
    id: "device-1",
    name: "MacBook Pro",
    type: "laptop",
    browser: "Chrome",
    browserVersion: "120.0.6099.129",
    os: "macOS",
    lastConnected: new Date().toISOString(),
    status: "online",
    profileId: "profile-1",
  };

  const mockTicket = {
    id: "ticket-1",
    title: "Need help with subscription",
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "msg-1",
        content: "I'm having trouble with my subscription. Can you help?",
        sender: "user",
        timestamp: new Date().toISOString(),
      },
      {
        id: "msg-2",
        content:
          "I'd be happy to help with your subscription issue. Could you please provide more details?",
        sender: "support",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  };

  // Dialog categories for organization
  const subscriptionDialogs = [
    { name: "Plan Change", state: openPlanChange, setState: setOpenPlanChange },
    {
      name: "Device Limit Upgrade",
      state: openDeviceLimit,
      setState: setOpenDeviceLimit,
    },
    { name: "Downgrade", state: openDowngrade, setState: setOpenDowngrade },
    {
      name: "Cancel Subscription",
      state: openCancelSubscription,
      setState: setOpenCancelSubscription,
    },
  ];

  const paymentDialogs = [
    {
      name: "Payment Method",
      state: openPaymentMethod,
      setState: setOpenPaymentMethod,
    },
    {
      name: "Billing Address",
      state: openBillingAddress,
      setState: setOpenBillingAddress,
    },
    {
      name: "Invoice Missing Info",
      state: openInvoiceMissing,
      setState: setOpenInvoiceMissing,
    },
  ];

  const deviceDialogs = [
    { name: "Device", state: openDevice, setState: setOpenDevice },
    {
      name: "Device Association",
      state: openDeviceAssociation,
      setState: setOpenDeviceAssociation,
    },
    {
      name: "Profile Editor",
      state: openProfileEditor,
      setState: setOpenProfileEditor,
    },
  ];

  const supportDialogs = [
    { name: "Ticket Chat", state: openTicketChat, setState: setOpenTicketChat },
    {
      name: "Create Ticket",
      state: openCreateTicket,
      setState: setOpenCreateTicket,
    },
    { name: "Confirm", state: openConfirm, setState: setOpenConfirm },
  ];

  return (
    <div className='container py-10'>
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='text-2xl'>Dialog Component Showcase</CardTitle>
          <CardDescription>
            This page demonstrates all dialog components available in the
            application. Click on any button to open its corresponding dialog.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue='subscription' className='w-full'>
        <TabsList className='grid grid-cols-4 mb-8'>
          <TabsTrigger value='subscription'>Subscription</TabsTrigger>
          <TabsTrigger value='payment'>Payment</TabsTrigger>
          <TabsTrigger value='device'>Device</TabsTrigger>
          <TabsTrigger value='support'>Support</TabsTrigger>
        </TabsList>

        <TabsContent value='subscription'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {subscriptionDialogs.map((dialog) => (
              <Card key={dialog.name} className='overflow-hidden'>
                <CardHeader className='p-4'>
                  <CardTitle className='text-lg'>{dialog.name}</CardTitle>
                </CardHeader>
                <CardContent className='p-4 pt-0'>
                  <Button
                    onClick={() => dialog.setState(true)}
                    className='w-full'
                    variant='default'
                  >
                    Open Dialog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='payment'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {paymentDialogs.map((dialog) => (
              <Card key={dialog.name} className='overflow-hidden'>
                <CardHeader className='p-4'>
                  <CardTitle className='text-lg'>{dialog.name}</CardTitle>
                </CardHeader>
                <CardContent className='p-4 pt-0'>
                  <Button
                    onClick={() => dialog.setState(true)}
                    className='w-full'
                    variant='default'
                  >
                    Open Dialog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='device'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {deviceDialogs.map((dialog) => (
              <Card key={dialog.name} className='overflow-hidden'>
                <CardHeader className='p-4'>
                  <CardTitle className='text-lg'>{dialog.name}</CardTitle>
                </CardHeader>
                <CardContent className='p-4 pt-0'>
                  <Button
                    onClick={() => dialog.setState(true)}
                    className='w-full'
                    variant='default'
                  >
                    Open Dialog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='support'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {supportDialogs.map((dialog) => (
              <Card key={dialog.name} className='overflow-hidden'>
                <CardHeader className='p-4'>
                  <CardTitle className='text-lg'>{dialog.name}</CardTitle>
                </CardHeader>
                <CardContent className='p-4 pt-0'>
                  <Button
                    onClick={() => dialog.setState(true)}
                    className='w-full'
                    variant='default'
                  >
                    Open Dialog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Render all dialogs */}
      <PlanChangeDialog
        open={openPlanChange}
        onOpenChange={setOpenPlanChange}
      />

      <DeviceLimitUpgradeDialog
        open={openDeviceLimit}
        onOpenChange={setOpenDeviceLimit}
        currentDeviceCount={5}
        deviceLimit={5}
      />

      <PaymentMethodDialog
        open={openPaymentMethod}
        onOpenChange={setOpenPaymentMethod}
      />

      <DeviceAssociationDialog
        open={openDeviceAssociation}
        onOpenChange={setOpenDeviceAssociation}
        device={mockDevice}
        profiles={[mockProfile]}
      />

      <DeviceDialog
        open={openDevice}
        onOpenChange={setOpenDevice}
        device={undefined} // For adding a new device
      />

      <ProfileEditorDialog
        open={openProfileEditor}
        onOpenChange={setOpenProfileEditor}
        profile={undefined} // For adding a new profile
      />

      <DowngradeDialog
        open={openDowngrade}
        onOpenChange={setOpenDowngrade}
        currentPlan='team'
        targetPlan='individual'
      />

      <CancelSubscriptionDialog
        open={openCancelSubscription}
        onOpenChange={setOpenCancelSubscription}
      />

      <BillingAddressDialog
        open={openBillingAddress}
        onOpenChange={setOpenBillingAddress}
      />

      <InvoiceMissingInfoDialog
        open={openInvoiceMissing}
        onOpenChange={setOpenInvoiceMissing}
      />

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title='Confirm Action'
        description='Are you sure you want to perform this action? This cannot be undone.'
        onConfirm={() => {
          setOpenConfirm(false);
          alert("Action confirmed!");
        }}
      />

      <TicketChatDialog
        open={openTicketChat}
        onOpenChange={setOpenTicketChat}
        ticket={mockTicket}
      />

      <CreateTicketDialog
        open={openCreateTicket}
        onOpenChange={setOpenCreateTicket}
      />
    </div>
  );
}
