'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { useTranslations } from 'next-intl'

interface SplitDateTimePickerProps {
  value?: string
  onChange: (value: string) => void
}

export function SplitDateTimePicker({ value, onChange }: SplitDateTimePickerProps) {
  const tCommon = useTranslations('common')
  const date = value ? new Date(value) : undefined

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)
    if (date) {
      newDate.setHours(date.getHours())
      newDate.setMinutes(date.getMinutes())
      newDate.setSeconds(date.getSeconds())
      newDate.setMilliseconds(date.getMilliseconds())
    } else {
      newDate.setHours(0, 0, 0, 0)
    }
    onChange(newDate.toISOString())
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number)
    const newDate = date ? new Date(date) : new Date()
    newDate.setHours(hours || 0)
    newDate.setMinutes(minutes || 0)
    newDate.setSeconds(0)
    newDate.setMilliseconds(0)
    onChange(newDate.toISOString())
  }

  const timeValue = date
    ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    : ''

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'flex-1 justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>{tCommon('pickDate')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={timeValue}
        onChange={handleTimeChange}
        className="w-[120px]"
      />
    </div>
  )
}
