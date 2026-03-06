'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DateTimePickerProps {
  value?: string
  onChange: (value: string) => void
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const date = value ? new Date(value) : undefined

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return

    const newDate = new Date(selectedDate)
    if (date) {
      newDate.setHours(date.getHours())
      newDate.setMinutes(date.getMinutes())
    }
    onChange(newDate.toISOString())
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number)
    const newDate = date ? new Date(date) : new Date()
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    onChange(newDate.toISOString())
  }

  const timeValue = date
    ? `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
    : '00:00'

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP HH:mm') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="w-[120px]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
