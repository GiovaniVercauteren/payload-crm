'use client'

import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { Client } from '@/payload-types'
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
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'

const clientTypes = ['individual', 'residential_care_center'] as const
type ClientType = (typeof clientTypes)[number]

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(clientTypes),
  contactInfo: z
    .object({
      email: z.email('Invalid email address').optional().or(z.literal('')),
      phone: z.string().optional(),
    })
    .optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  notes: z.string().optional(),
  defaultRate: z.number().optional(),
})

interface ClientFormProps {
  initialValues?: CreateData<Client>
  onSubmit: (values: CreateData<Client>) => Promise<void>
  title: string
  submitText: string
}

export default function ClientForm({
  initialValues,
  onSubmit,
  title,
  submitText,
}: ClientFormProps) {
  const router = useRouter()
  const form = useForm({
    defaultValues: (initialValues || {
      name: '',
      type: 'residential_care_center',
      contactInfo: {
        email: '',
        phone: '',
      },
      address: {
        street: '',
        city: '',
        postalCode: '',
        country: '',
      },
      notes: '',
      defaultRate: undefined,
    }) as CreateData<Client>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
  const tCommon = useTranslations('common')
  const tClients = useTranslations('clients')
  const tClientsCreate = useTranslations('clients.create')

  const handleCancel = () => {
    router.push('/clients')
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
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('name')}</FieldLabel>
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
              />
              <form.Field
                name="type"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('type')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value: ClientType) => field.handleChange(value)}
                        defaultValue={field.state.value}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={tClientsCreate('selectClientType')} />
                        </SelectTrigger>
                        <SelectContent>
                          {clientTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {tClients(`clientTypes.${type}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </FieldSet>
          <Separator className="my-2" />
          <FieldSet>
            <FieldLegend>{tClientsCreate('contactInfoLegend')}</FieldLegend>
            <FieldGroup>
              <form.Field
                name="contactInfo.email"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('contactInfo.email')}</FieldLabel>
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
              />
              <form.Field
                name="contactInfo.phone"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('contactInfo.phone')}</FieldLabel>
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
              />
            </FieldGroup>
          </FieldSet>
          <Separator className="my-2" />
          <FieldSet>
            <FieldLegend>{tClientsCreate('addressLegend')}</FieldLegend>
            <FieldGroup>
              <form.Field
                name="address.street"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('address.street')}</FieldLabel>
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
              />
              <form.Field
                name="address.city"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('address.city')}</FieldLabel>
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
              />
              <form.Field
                name="address.postalCode"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('address.postalCode')}</FieldLabel>
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
              />
              <form.Field
                name="address.country"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('address.country')}</FieldLabel>
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
              />
            </FieldGroup>
          </FieldSet>
          <Separator className="my-2" />
          <FieldSet>
            <FieldLegend>{tClientsCreate('additionalInfoLegend')}</FieldLegend>
            <FieldGroup>
              <form.Field
                name="notes"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('notes')}</FieldLabel>
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
              />
              <form.Field
                name="defaultRate"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tClients('defaultRate')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        value={field.state.value || ''}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              />
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
