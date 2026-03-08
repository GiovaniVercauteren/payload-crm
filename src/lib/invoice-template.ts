import { Invoice, Shift, User, Client, Service } from '@/payload-types'

interface InvoiceTemplateOptions {
  invoice: Invoice
  user: User
  client: Client
  translations: {
    invoiceNumber: string
    date: string
    client: string
    shifts: string
    totalAmount: string
    service: string
    price: string
    from: string
    to: string
    bankDetails: string
    iban: string
    bic: string
    companyRegistrationNumber: string
  }
}

export function renderInvoiceHtml({
  invoice,
  user,
  client,
  translations,
}: InvoiceTemplateOptions): string {
  const shifts = (invoice.shifts as Shift[]) || []
  
  const rows = shifts.map(shift => {
    const service = shift.service as Service
    return `
      <tr>
        <td>${new Date(shift.startDate).toLocaleString()}</td>
        <td>${service.name}</td>
        <td style="text-align: right;">€${shift.totalPrice.toFixed(2)}</td>
      </tr>
    `
  }).join('')

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.5; padding: 40px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .company-info { text-align: left; }
          .invoice-info { text-align: right; }
          .details { margin-bottom: 40px; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .section-title { font-weight: bold; border-bottom: 2px solid #eee; margin-bottom: 10px; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { text-align: left; background-color: #f9f9f9; border-bottom: 2px solid #eee; padding: 10px; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
          .total { text-align: right; font-size: 1.2em; font-weight: bold; }
          .footer { margin-top: 60px; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 20px; color: #666; }
          .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>${user.company}</h1>
            <p>${user.firstName} ${user.lastName}</p>
          </div>
          <div class="invoice-info">
            <h2>Invoice</h2>
            <p><strong>${translations.invoiceNumber}:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>${translations.date}:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div class="details-grid">
          <div class="details">
            <div class="section-title">${translations.from}</div>
            <p>
              ${user.company}<br />
              ${user.address.streetAndNumber}<br />
              ${user.address.postalCode} ${user.address.city}<br />
              ${user.phone}<br />
              ${user.email}
            </p>
          </div>
          <div class="details">
            <div class="section-title">${translations.to}</div>
            <p>
              ${client.name}<br />
              ${client.address.street}<br />
              ${client.address.postalCode} ${client.address.city}<br />
              ${client.address.country}
            </p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>${translations.date}</th>
              <th>${translations.service}</th>
              <th style="text-align: right;">${translations.price}</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <div class="total">
          ${translations.totalAmount}: €${invoice.totalAmount.toFixed(2)}
        </div>

        <div class="footer">
          <div class="section-title">${translations.bankDetails}</div>
          <div class="footer-grid">
            <div>
              <strong>${user.bankDetails.name}</strong><br />
              ${translations.iban}: ${user.bankDetails.iban}<br />
              ${translations.bic}: ${user.bankDetails.bic}
            </div>
            <div>
              ${translations.companyRegistrationNumber}: ${user.companyRegistrationNumber}<br />
              ${user.website}
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}
