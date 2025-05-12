import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

// Define types for invoice data
export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  customer: {
    name: string
    email: string
    address: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  subscription: {
    plan: string
    billingPeriod: string
    startDate: string
    endDate: string
    amount: string
    status: string
  }
  payment: {
    method: string
    last4?: string
    transactionId: string
    nextBillingDate: string
  }
}

// Function to generate PDF invoice
export const generateInvoicePDF = async (data: InvoiceData): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Use setTimeout to move this work off the main thread
    // In a production app, you would use a proper Web Worker
    setTimeout(() => {
      try {
        // Create new PDF document
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        try {
          // Set font
          doc.setFont("helvetica")

          // Page dimensions
          const pageWidth = doc.internal.pageSize.getWidth()
          const pageHeight = doc.internal.pageSize.getHeight()
          const margin = 20
          const contentWidth = pageWidth - margin * 2

          // Colors
          const primaryColor = [41, 37, 96] // RGB for #292560
          const secondaryColor = [100, 100, 100] // Gray for text

          // Helper function for text alignment
          const textWidth = (text: string, fontSize: number): number => {
            doc.setFontSize(fontSize)
            return (doc.getStringUnitWidth(text) * fontSize) / doc.internal.scaleFactor
          }

          // Current Y position tracker
          let yPos = margin

          // ===== HEADER SECTION =====
          // Company info (left)
          doc.setFontSize(22)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("BetterLogic FZE", margin, yPos + 10)

          doc.setFontSize(10)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.text("support@autorefresh.io", margin, yPos + 18)
          doc.text("www.autorefresh.io", margin, yPos + 24)

          // Invoice info (right)
          doc.setFontSize(14)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("INVOICE", pageWidth - margin - textWidth("INVOICE", 14), yPos + 10)

          doc.setFontSize(10)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          const invoiceNumberText = `Invoice #: ${data.invoiceNumber}`
          doc.text(invoiceNumberText, pageWidth - margin - textWidth(invoiceNumberText, 10), yPos + 18)

          const invoiceDateText = `Date: ${data.invoiceDate}`
          doc.text(invoiceDateText, pageWidth - margin - textWidth(invoiceDateText, 10), yPos + 24)

          yPos += 40

          // ===== TITLE =====
          doc.setFontSize(16)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("Invoice for Auto Refresh Plus Subscription", margin, yPos)

          yPos += 15

          // ===== BILL TO SECTION =====
          doc.setFontSize(12)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("Bill To:", margin, yPos)

          yPos += 8

          doc.setFontSize(10)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.text(data.customer.name, margin, yPos)
          yPos += 5
          doc.text(data.customer.email, margin, yPos)
          yPos += 5
          doc.text(data.customer.address.line1, margin, yPos)
          yPos += 5
          if (data.customer.address.line2) {
            doc.text(data.customer.address.line2, margin, yPos)
            yPos += 5
          }
          doc.text(
            `${data.customer.address.city}, ${data.customer.address.state} ${data.customer.address.postalCode}`,
            margin,
            yPos,
          )
          yPos += 5
          doc.text(data.customer.address.country, margin, yPos)

          yPos += 15

          // ===== PLAN DETAILS =====
          doc.setFontSize(12)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("Plan Details:", margin, yPos)

          yPos += 8

          doc.setFontSize(10)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.text(`Product: Auto Refresh Plus`, margin, yPos)
          yPos += 5
          doc.text(`Plan Name: ${data.subscription.plan}`, margin, yPos)
          yPos += 5
          doc.text(`Billing Period: ${data.subscription.startDate} – ${data.subscription.endDate}`, margin, yPos)
          yPos += 5

          // Status badge
          const statusText = `Status: ${data.subscription.status}`
          doc.text(statusText, margin, yPos)

          // Draw status badge
          const statusWidth = textWidth(data.subscription.status, 10) + 10
          const statusX = margin + textWidth("Status: ", 10) + 2
          const statusY = yPos - 4

          if (data.subscription.status === "PAID") {
            doc.setFillColor(39, 174, 96) // Green
          } else {
            doc.setFillColor(242, 153, 74) // Orange
          }

          doc.roundedRect(statusX, statusY, statusWidth, 6, 2, 2, "F")
          doc.setTextColor(255, 255, 255)
          doc.text(data.subscription.status, statusX + 5, yPos)

          yPos += 20

          // ===== INVOICE TABLE =====
          doc.setTextColor(0, 0, 0)
          doc.setFontSize(10)

          // Use autoTable correctly
          autoTable(doc, {
            startY: yPos,
            head: [["Description", "Quantity", "Unit Price", "Total"]],
            body: [
              [
                `Auto Refresh Plus — ${data.subscription.plan} Subscription`,
                "1",
                data.subscription.amount,
                data.subscription.amount,
              ],
            ],
            theme: "grid",
            headStyles: {
              fillColor: [41, 37, 96],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            styles: {
              fontSize: 10,
              cellPadding: 5,
            },
            columnStyles: {
              0: { cellWidth: "auto" },
              1: { cellWidth: 20, halign: "center" },
              2: { cellWidth: 30, halign: "right" },
              3: { cellWidth: 30, halign: "right" },
            },
            margin: { left: margin, right: margin },
          })

          // Get the last auto table end position
          const tableEndY = (doc as any).lastAutoTable.finalY || yPos + 40
          yPos = tableEndY + 10

          // ===== SUMMARY =====
          const summaryX = pageWidth - margin - 80

          doc.setFontSize(10)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.text("Subtotal:", summaryX, yPos)
          doc.text(data.subscription.amount, pageWidth - margin, yPos, { align: "right" })

          yPos += 6
          doc.text("Tax (0%):", summaryX, yPos)
          doc.text("$0.00", pageWidth - margin, yPos, { align: "right" })

          yPos += 8
          doc.setFontSize(12)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("Total Amount:", summaryX, yPos)
          doc.text(data.subscription.amount, pageWidth - margin, yPos, { align: "right" })

          yPos += 20

          // ===== PAYMENT INFO =====
          doc.setFontSize(12)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("Payment Information:", margin, yPos)

          yPos += 8

          doc.setFontSize(10)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])

          let paymentMethodText = `Payment Method: ${data.payment.method}`
          if (data.payment.last4) {
            paymentMethodText += ` **** ${data.payment.last4}`
          }
          doc.text(paymentMethodText, margin, yPos)

          yPos += 5
          doc.text(`Transaction ID: ${data.payment.transactionId}`, margin, yPos)

          yPos += 5
          doc.text(`Next Billing Date: ${data.payment.nextBillingDate}`, margin, yPos)

          // ===== FOOTER =====
          const footerY = pageHeight - margin

          doc.setFontSize(10)
          doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
          doc.text("Thank you for subscribing to Auto Refresh Plus!", margin, footerY - 10)

          doc.setFontSize(9)
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
          doc.text("For help, contact support@autorefresh.io", margin, footerY - 5)

          // Instead of saving directly, return the blob
          const pdfBlob = doc.output("blob")
          resolve(pdfBlob)
        } catch (error) {
          console.error("Error generating PDF:", error)
          throw new Error("Failed to generate PDF invoice")
        }
      } catch (error) {
        reject(error)
      }
    }, 0)
  })
}

// Add a helper function to download the PDF
export const downloadPDF = (blob: Blob, filename: string): void => {
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href) // Clean up
}
