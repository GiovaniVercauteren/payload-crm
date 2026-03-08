import { Invoice, Shift, User, Client, Service, Media } from '@/payload-types'

interface InvoiceTemplateOptions {
  invoice: Invoice
  user: User
  client: Client
  baseUrl?: string
  logoDataUrl?: string
  translations: {
    invoiceNumber: string
    date: string
    client: string
    shifts: string
    totalAmount: string
    service: string
    price: string
    time: string
    startTime: string
    endTime: string
    duration: string
    break: string
    rate: string
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
  baseUrl,
  logoDataUrl,
  translations,
}: InvoiceTemplateOptions): string {
  const shifts = (invoice.shifts as Shift[]) || []
  
  const logo = typeof user.logo === 'object' ? (user.logo as Media) : null
  const logoSrc = logoDataUrl || (logo?.url ? `${baseUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${logo.url}` : null)
  
  const logoHtml = logoSrc 
    ? `<img src="${logoSrc}" alt="${logo?.alt || 'Logo'}" style="max-height: 60px; max-width: 180px; margin-bottom: 5px;" />`
    : `<h1 style="margin: 0; font-size: 20px;">${user.company}</h1>`

  const rows = shifts.map(shift => {
    const service = shift.service as Service
    const start = new Date(shift.startDate)
    const end = new Date(shift.endDate)
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    const breakHours = (shift.breakDuration || 0) / 60
    const netHours = durationHours - breakHours
    
    let rateStr = 'Fixed'
    if (shift.customRateType === 'hourly' || (!shift.customRate && service.rateType === 'hourly')) {
      const rate = shift.customRate || service.rate
      rateStr = `€${rate.toFixed(2)}/h`
    }

    return `
      <tr>
        <td style="white-space: nowrap;">${start.toLocaleDateString()}</td>
        <td style="white-space: nowrap;">${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
        <td style="text-align: center;">${netHours.toFixed(2)}h</td>
        <td style="text-align: center;">${shift.breakDuration || 0}m</td>
        <td>${service.name}</td>
        <td style="text-align: right; white-space: nowrap;">${rateStr}</td>
        <td style="text-align: right; white-space: nowrap;">€${shift.totalPrice.toFixed(2)}</td>
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
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.3; padding: 20px; font-size: 11px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .company-info { text-align: left; }
          .invoice-info { text-align: right; }
          .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .section-title { font-weight: bold; border-bottom: 1px solid #eee; margin-bottom: 5px; padding-bottom: 2px; text-transform: uppercase; font-size: 10px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { text-align: left; background-color: #f9f9f9; border-bottom: 1px solid #ddd; padding: 6px 4px; font-size: 10px; }
          td { padding: 6px 4px; border-bottom: 1px solid #eee; }
          .total { text-align: right; font-size: 14px; font-weight: bold; margin-top: 10px; }
          .footer { margin-top: 30px; font-size: 10px; border-top: 1px solid #eee; padding-top: 10px; color: #666; }
          .footer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
          p { margin: 2px 0; }
          h2 { margin: 0 0 5px 0; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            ${logoHtml}
            <p style="font-weight: bold;">${user.firstName} ${user.lastName}</p>
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
              <strong>${user.company}</strong><br />
              ${user.address.streetAndNumber}<br />
              ${user.address.postalCode} ${user.address.city}<br />
              ${user.phone}<br />
              ${user.email}
            </p>
          </div>
          <div class="details">
            <div class="section-title">${translations.to}</div>
            <p>
              <strong>${client.name}</strong><br />
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
              <th>${translations.time}</th>
              <th style="text-align: center;">${translations.duration}</th>
              <th style="text-align: center;">${translations.break}</th>
              <th>${translations.service}</th>
              <th style="text-align: right;">${translations.rate}</th>
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
              ${user.website || ''}
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}
