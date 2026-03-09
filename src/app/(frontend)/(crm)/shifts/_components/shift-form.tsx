'use client'

import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { Shift, Client, Service } from '@/payload-types'
import { CreateData } from '@/app/(frontend)/types'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getClientsAction } from '../../clients/actions'
import { getServicesAction } from '../../services/actions'
import { SplitDateTimePicker } from '@/components/ui/split-date-time-picker'

const statuses = ['scheduled', 'completed', 'cancelled'] as const
type ShiftStatus = (typeof statuses)[number]

const rateTypes = ['hourly', 'fixed'] as const
type RateType = (typeof rateTypes)[number]

const formSchema = z.object({
  client: z.number(),
  service: z.number(),
  customRate: z.number().optional(),
  customRateType: z.enum(rateTypes).optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  breakDuration: z.number().min(0),
  notes: z.string().optional(),
  status: z.enum(statuses),
  worker: z.union([z.number(), z.any()]),
})

interface ShiftFormProps {
  initialValues?: CreateData<Shift>
  onSubmit: (values: CreateData<Shift>) => Promise<void>
  title: string
  submitText: string
}

export default function ShiftForm({ initialValues, onSubmit, title, submitText }: ShiftFormProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])

  const form = useForm({
    defaultValues: (initialValues || {
      client: 0,
      service: 0,
      customRate: undefined,
      customRateType: undefined,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      breakDuration: 0,
      notes: '',
      status: 'scheduled',
      worker: 0,
    }) as any,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  // Cast form to any to avoid deep type instantiation errors
  const FormObj = form as any

  const tCommon = useTranslations('common')
  const tShifts = useTranslations('shifts')
  const tServices = useTranslations('services')
  const tShiftsCreate = useTranslations('shifts.create')
  const tInvoicesCreate = useTranslations('invoices.create')

  useEffect(() => {
    const fetchData = async () => {
      const [clientsRes, servicesRes] = await Promise.all([getClientsAction(), getServicesAction()])
      setClients(clientsRes.docs)
      setServices(servicesRes.docs)
    }
    fetchData()
  }, [])

  const handleCancel = () => {
    router.push('/shifts')
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{title}</FieldLegend>
            <FieldGroup>
              <FormObj.Field name="client">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('client')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value) => field.handleChange(Number(value))}
                        defaultValue={field.state.value ? field.state.value.toString() : undefined}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={tInvoicesCreate('selectClient')} />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="service">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('service')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value) => field.handleChange(Number(value))}
                        defaultValue={field.state.value ? field.state.value.toString() : undefined}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={tShiftsCreate('selectService')} />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="customRate">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('customRate')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        value={field.state.value || ''}
                        onChange={(e) =>
                          field.handleChange(
                            e.target.value === '' ? undefined : Number(e.target.value),
                          )
                        }
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="customRateType">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('customRateType')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value: RateType) => field.handleChange(value)}
                        defaultValue={field.state.value}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={tShiftsCreate('selectRateType') || 'Select rate type'}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {rateTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {tServices(`rateTypes.${type}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="startDate">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('startDate')}</FieldLabel>
                      <SplitDateTimePicker
                        value={field.state.value}
                        onChange={(value) => field.handleChange(value)}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="endDate">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('endDate')}</FieldLabel>
                      <SplitDateTimePicker
                        value={field.state.value}
                        onChange={(value) => field.handleChange(value)}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="breakDuration">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('breakDuration')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="status">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('status')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value: ShiftStatus) => field.handleChange(value)}
                        defaultValue={field.state.value}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {tShifts(`statuses.${status}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>

              <FormObj.Field name="notes">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tShifts('notes')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value || ''}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">{submitText}</Button>
            <Button variant="outline" type="button" onClick={handleCancel}>
              {tCommon('cancel')}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
