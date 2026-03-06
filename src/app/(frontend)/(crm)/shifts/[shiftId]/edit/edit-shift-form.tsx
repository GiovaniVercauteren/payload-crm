'use client'

import { updateShiftAction } from '../../actions'
import ShiftForm from '../../_components/shift-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Shift } from '@/payload-types'
import { CreateData } from '@/app/(frontend)/types'
import { toast } from 'sonner'

interface EditShiftFormProps {
  shift: Shift
}

export default function EditShiftForm({ shift }: EditShiftFormProps) {
  const tShifts = useTranslations('shifts')
  const tMessages = useTranslations('shifts.messages')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const handleSubmit = async (values: CreateData<Shift>) => {
    try {
      await updateShiftAction(shift.id.toString(), values)
      toast.success(tMessages('updateSuccess'))
      router.push(`/shifts/${shift.id}`)
    } catch (error) {
      toast.error(tMessages('updateError'))
    }
  }

  const initialValues: CreateData<Shift> = {
    client: typeof shift.client === 'object' ? shift.client.id : shift.client,
    service: typeof shift.service === 'object' ? shift.service.id : shift.service,
    customRate: shift.customRate || undefined,
    customRateType: shift.customRateType || undefined,
    startDate: shift.startDate,
    endDate: shift.endDate,
    breakDuration: shift.breakDuration,
    notes: shift.notes || '',
    status: shift.status,
    worker: typeof shift.worker === 'object' ? shift.worker.id : shift.worker,
  }

  return (
    <div>
      <ShiftForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        title={tShifts('editShift')}
        submitText={tCommon('save')}
      />
    </div>
  )
}
