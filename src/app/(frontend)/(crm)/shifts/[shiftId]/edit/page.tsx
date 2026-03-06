import { getShiftAction } from '../../actions'
import EditShiftForm from './edit-shift-form'
import { notFound } from 'next/navigation'

interface EditShiftPageProps {
  params: Promise<{
    shiftId: string
  }>
}

export default async function EditShiftPage({ params }: EditShiftPageProps) {
  const { shiftId } = await params
  const shift = await getShiftAction(shiftId)

  if (!shift) {
    notFound()
  }

  return (
    <div>
      <EditShiftForm shift={shift} />
    </div>
  )
}
