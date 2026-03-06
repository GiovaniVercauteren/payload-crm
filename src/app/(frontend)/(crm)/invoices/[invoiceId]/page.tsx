export default function InvoicePage({ params }: { params: { invoiceId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Invoice {params.invoiceId}</h1>
      <p>Invoice details coming soon...</p>
    </div>
  )
}
