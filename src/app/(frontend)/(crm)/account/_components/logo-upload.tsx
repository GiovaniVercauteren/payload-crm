'use client'

import { useState } from 'react'
import { Media } from '@/payload-types'
import { uploadMediaAction } from '../../../_providers/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import Image from 'next/image'
import { Loader2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface LogoUploadProps {
  value: number | Media | null | undefined
  onChange: (value: number | Media | null) => void
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const tAccount = useTranslations('account')
  
  const logo = typeof value === 'object' ? (value as Media) : null
  const logoUrl = logo?.url

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const media = await uploadMediaAction(formData)
      onChange(media)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <Field>
      <FieldLabel>{tAccount('logo')}</FieldLabel>
      <div className="flex items-center gap-4 mt-2">
        {logoUrl ? (
          <div className="relative w-24 h-24 border rounded-md overflow-hidden group">
            <Image
              src={logoUrl}
              alt={logo?.alt || 'Logo'}
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 border border-dashed rounded-md flex items-center justify-center bg-muted">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <span className="text-xs text-muted-foreground text-center px-2">
                {tAccount('logoPlaceholder') || 'No logo'}
              </span>
            )}
          </div>
        )}
        
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG or SVG. Max 2MB.
          </p>
        </div>
      </div>
    </Field>
  )
}
