'use client'

import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { Invoice, Client, Shift } from '@/payload-types'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUninvoicedShiftsAction } from '../actions'
import { getClientsAction } from '../../clients/actions'

const formSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  client: z.number(),
  shifts: z.array(z.number()).min(1, 'Select at least one shift'),
  user: z.union([z.number(), z.any()]),
  totalAmount: z.number(),
})

interface InvoiceFormProps {
  initialValues?: CreateData<Invoice>
  onSubmit: (values: CreateData<Invoice>) => Promise<void>
  title: string
  submitText: string
}

export default function InvoiceForm({
  initialValues,
  onSubmit,
  title,
  submitText,
}: InvoiceFormProps) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [availableShifts, setAvailableShifts] = useState<Shift[]>([])

  const form = useForm({
    defaultValues: (initialValues || {
      invoiceNumber: `OZ-${new Date().getTime()}`,
      client: 0,
      shifts: [],
      user: 0,
      totalAmount: 0,
    }) as CreateData<Invoice>,
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
  const tInvoices = useTranslations('invoices')
  const tInvoicesCreate = useTranslations('invoices.create')

  useEffect(() => {
    const fetchClients = async () => {
      const result = await getClientsAction()
      setClients(result.docs)
    }
    fetchClients()
  }, [])

  const handleCancel = () => {
    router.push('/invoices')
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
              <FormObj.Field name="invoiceNumber">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tInvoices('invoiceNumber')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormObj.Field>
              <FormObj.Field name="client">
                {(field: any) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tInvoices('client')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value) => {
                          const newClientId = Number(value)
                          field.handleChange(newClientId)
                          // Reset shifts when client changes
                          form.setFieldValue('shifts', [])
                          form.setFieldValue('totalAmount', 0)
                        }}
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

              <FormObj.Subscribe selector={(state: any) => state.values.client}>
                {(selectedClient: any) => (
                  <ShiftSelector
                    clientId={
                      typeof selectedClient === 'number'
                        ? selectedClient
                        : (selectedClient as any)?.id
                    }
                    form={FormObj}
                    availableShifts={availableShifts}
                    setAvailableShifts={setAvailableShifts}
                  />
                )}
              </FormObj.Subscribe>
            </FieldGroup>
          </FieldSet>
          <div className="mt-4 p-4 border rounded-md bg-muted/20">
            <FormObj.Subscribe selector={(state: any) => state.values.shifts}>
              {(selectedShiftIds: number[]) => {
                const total = availableShifts
                  .filter((shift) => selectedShiftIds.includes(shift.id))
                  .reduce((sum, shift) => sum + (shift.totalPrice || 0), 0)

                return (
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{tInvoices('totalAmount')}</span>
                    <span className="text-2xl font-bold">€{total.toFixed(2)}</span>
                  </div>
                )
              }}
            </FormObj.Subscribe>
          </div>
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

function ShiftSelector({
  clientId,
  form,
  availableShifts,
  setAvailableShifts,
}: {
  clientId: number
  form: any
  availableShifts: Shift[]
  setAvailableShifts: (shifts: Shift[]) => void
}) {
  const tInvoicesCreate = useTranslations('invoices.create')

  useEffect(() => {
    if (clientId) {
      const fetchShifts = async () => {
        const shifts = await getUninvoicedShiftsAction(clientId)
        setAvailableShifts(shifts)
      }
      fetchShifts()
    } else {
      setAvailableShifts([])
      form.setFieldValue('shifts', [])
      form.setFieldValue('totalAmount', 0)
    }
  }, [clientId, setAvailableShifts, form])

  useEffect(() => {
    const selectedShifts = form.getFieldValue('shifts') as number[]
    const total = availableShifts
      .filter((shift) => selectedShifts.includes(shift.id))
      .reduce((sum, shift) => sum + (shift.totalPrice || 0), 0)
    form.setFieldValue('totalAmount', total)
  }, [availableShifts, form])

  if (availableShifts.length === 0) return null

  return (
    <form.Field name="shifts">
      {(field: any) => {
        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel>{tInvoicesCreate('selectShifts')}</FieldLabel>
            <div className="space-y-2 mt-2">
              {availableShifts.map((shift) => (
                <div key={shift.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`shift-${shift.id}`}
                    checked={field.state.value.includes(shift.id)}
                    onCheckedChange={(checked) => {
                      let newValue: number[]
                      if (checked) {
                        newValue = [...field.state.value, shift.id]
                      } else {
                        newValue = field.state.value.filter((id: number) => id !== shift.id)
                      }
                      field.handleChange(newValue)

                      const total = availableShifts
                        .filter((s) => newValue.includes(s.id))
                        .reduce((sum, s) => sum + (s.totalPrice || 0), 0)
                      form.setFieldValue('totalAmount', total)
                    }}
                  />
                  <label
                    htmlFor={`shift-${shift.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {new Date(shift.startDate).toLocaleString()} - €{shift.totalPrice.toFixed(2)}
                  </label>
                </div>
              ))}
            </div>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}
