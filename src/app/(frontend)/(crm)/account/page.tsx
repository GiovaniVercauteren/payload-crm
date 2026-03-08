'use client'

import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { useAuth } from '../../_providers/auth/auth.provider'
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
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { updateAccountAction } from '../../_providers/auth/actions'
import { User } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoUpload } from './_components/logo-upload'

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  company: z.string().min(1),
  logo: z.any().optional().nullable(),
  website: z.string().optional().nullable(),
  companyRegistrationNumber: z.string().min(1),
  address: z.object({
    streetAndNumber: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
  }),
  bankDetails: z.object({
    name: z.string().min(1),
    iban: z.string().min(1),
    bic: z.string().min(1),
  }),
})

export default function AccountPage() {
  const { user } = useAuth()
  const tAccount = useTranslations('account')

  if (!user) return null

  if (user.collection === 'admins') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>{tAccount('title')}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Admins can manage their account details in the admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AccountForm user={user as User} />
}

function AccountForm({ user }: { user: User }) {
  const { setUser } = useAuth()
  const tAccount = useTranslations('account')
  const tCommon = useTranslations('common')

  const form = useForm({
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      company: user.company || '',
      logo: user.logo || null,
      website: user.website || '',
      companyRegistrationNumber: user.companyRegistrationNumber || '',
      address: {
        streetAndNumber: user.address?.streetAndNumber || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
      },
      bankDetails: {
        name: user.bankDetails?.name || '',
        iban: user.bankDetails?.iban || '',
        bic: user.bankDetails?.bic || '',
      },
    } as any,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const updatedUser = await updateAccountAction(value)
        setUser(updatedUser)
        toast.success(tAccount('messages.updateSuccess'))
      } catch (error) {
        toast.error(tAccount('messages.updateError'))
      }
    },
  })

  const FormObj = form as any

  return (
    <div className="max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-8">{tAccount('title')}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{tAccount('personalInfo')}</FieldLegend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormObj.Field name="firstName">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('firstName')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
              <FormObj.Field name="lastName">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('lastName')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
              <Field>
                <FieldLabel>{tAccount('email')}</FieldLabel>
                <Input value={user.email} disabled />
              </Field>
              <FormObj.Field name="phone">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('phone')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
            </div>
          </FieldSet>

          <FieldSet>
            <FieldLegend>{tAccount('companyInfo')}</FieldLegend>
            <div className="mb-4">
              <FormObj.Field name="logo">
                {(field: any) => (
                  <LogoUpload value={field.state.value} onChange={(v) => field.handleChange(v)} />
                )}
              </FormObj.Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormObj.Field name="company">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('company')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
              <FormObj.Field name="website">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('website')}</FieldLabel>
                    <Input
                      value={field.state.value || ''}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
              <FormObj.Field name="companyRegistrationNumber">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('companyRegistrationNumber')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-4">{tAccount('address.title')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormObj.Field name="address.streetAndNumber">
                  {(field: any) => (
                    <Field>
                      <FieldLabel>{tAccount('address.street')}</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </FormObj.Field>
                <FormObj.Field name="address.city">
                  {(field: any) => (
                    <Field>
                      <FieldLabel>{tAccount('address.city')}</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </FormObj.Field>
                <FormObj.Field name="address.postalCode">
                  {(field: any) => (
                    <Field>
                      <FieldLabel>{tAccount('address.postalCode')}</FieldLabel>
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </FormObj.Field>
              </div>
            </div>
          </FieldSet>

          <FieldSet>
            <FieldLegend>{tAccount('bankDetails')}</FieldLegend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormObj.Field name="bankDetails.name">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('bank.name')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
              <FormObj.Field name="bankDetails.iban">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('bank.iban')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
              <FormObj.Field name="bankDetails.bic">
                {(field: any) => (
                  <Field>
                    <FieldLabel>{tAccount('bank.bic')}</FieldLabel>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </FormObj.Field>
            </div>
          </FieldSet>

          <div className="flex justify-end pt-4">
            <Button type="submit">{tCommon('save')}</Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
