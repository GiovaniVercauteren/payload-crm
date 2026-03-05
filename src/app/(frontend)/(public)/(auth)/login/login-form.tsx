'use client'

import { useForm } from '@tanstack/react-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import z from 'zod'
import { useAuth } from '@/app/(frontend)/_providers/auth/auth.provider'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export default function LoginForm() {
  const auth = useAuth()
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value: { email, password } }) => {
      auth.login({ email, password })
      router.push('/dashboard')
    },
  })
  const t = useTranslations('auth')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field
          name="email"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  type="email"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        ></form.Field>
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t(field.name)}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  type="password"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        ></form.Field>
      </FieldGroup>
      <Button type="submit" className="w-full">
        {t('login')}
      </Button>
    </form>
  )
}
