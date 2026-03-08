const GOTENBERG_URL = process.env.GOTENBERG_URL || 'http://gotenberg:3000'

export async function generatePDF(htmlContent: string): Promise<Buffer> {
  const formData = new FormData()

  const blob = new Blob([htmlContent], { type: 'text/html' })
  formData.append('index.html', blob, 'index.html')

  console.log('Sending HTML content to Gotenberg for PDF generation...')
  console.log('HTML Content:', htmlContent)

  const response = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/html`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gotenberg error: ${response.statusText} - ${errorText}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
