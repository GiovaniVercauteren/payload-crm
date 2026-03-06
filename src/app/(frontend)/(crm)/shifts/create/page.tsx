'use client'

import { createShiftAction } from '../actions'
import ShiftForm from '../_components/shift-form'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'

export default function CreateShiftPage() {
  const tShiftsCreate = useTranslations('shifts.create')
  const tMessages = useTranslations('shifts.messages')
  const router = useRouter()
  const auth = useAuth()

  const handleSubmit = async (values: any) => {
    try {
      if (!auth.user) {
        toast.error('You must be logged in to create a shift')
        return
      }
      await createShiftAction({
        ...values,
        worker: auth.user.id,
      })
      toast.success(tMessages('createSuccess'))
      router.push('/shifts')
    } catch (error) {
      toast.error(tMessages('createError'))
    }
  }

  return (
    <div>
      <ShiftForm
        onSubmit={handleSubmit}
        title={tShiftsCreate('createShift')}
        submitText={tShiftsCreate('createShift')}
      />
    </div>
  )
}
