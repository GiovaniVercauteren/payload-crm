'use client'

import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { Service } from '@/payload-types'
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

const rateTypes = ['hourly', 'fixed'] as const
type RateType = (typeof rateTypes)[number]

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  rateType: z.enum(rateTypes),
  rate: z.number().min(0, 'Rate must be a positive number'),
  description: z.string().optional(),
  deprecated: z.boolean().default(false),
  user: z.union([z.number(), z.any()]),
})

interface ServiceFormProps {
  initialValues?: CreateData<Service>
  onSubmit: (values: CreateData<Service>) => Promise<void>
  title: string
  submitText: string
}

export default function ServiceForm({
  initialValues,
  onSubmit,
  title,
  submitText,
}: ServiceFormProps) {
  const router = useRouter()
  const form = useForm({
    defaultValues: (initialValues || {
      name: '',
      rateType: 'hourly',
      rate: 0,
      description: '',
      deprecated: false,
      user: 0,
    }) as CreateData<Service>,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })
  const tCommon = useTranslations('common')
  const tServices = useTranslations('services')
  const tServicesCreate = useTranslations('services.create')

  const handleCancel = () => {
    router.push('/services')
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
                      <FieldLabel htmlFor={field.name}>{tServices('name')}</FieldLabel>
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
                name="rateType"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tServices('rateType')}</FieldLabel>
                      <Select
                        name={field.name}
                        onValueChange={(value: RateType) => field.handleChange(value)}
                        defaultValue={field.state.value}
                        aria-invalid={isInvalid}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={tServicesCreate('selectRateType')} />
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
              />
              <form.Field
                name="rate"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tServices('rate')}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="0.01"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{tServices('description')}</FieldLabel>
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
