import { getShiftAction } from '../actions'
import ShiftDetails from './shift-details'
import { notFound } from 'next/navigation'

interface ShiftPageProps {
  params: Promise<{
    shiftId: string
  }>
}

export default async function ShiftPage({ params }: ShiftPageProps) {
  const { shiftId } = await params
  const shift = await getShiftAction(shiftId)

  if (!shift) {
    notFound()
  }

  return (
    <div>
      <ShiftDetails shift={shift} />
    </div>
  )
}
