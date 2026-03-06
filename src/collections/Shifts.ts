import { User } from '@/payload-types'
import { Access, type CollectionConfig } from 'payload'
import { Admins } from './Admins'

const canReadShifts: Access<User> = ({ req: { user } }) => {
  // Allow workers to read only their own shifts, admins can read all
  if (!user) return false
  if (user.collection === Admins.slug) return true
  return {
    worker: {
      equals: user.id,
    },
  }
}

const canCreateShifts: Access<User> = ({ req: { user } }) => {
  // Allow authenticated users to create shifts
  return Boolean(user)
}

const canUpdateShifts: Access<User> = ({ req: { user } }) => {
  // Allow workers to update only their own shifts, admins can update all
  if (!user) return false
  if (user.collection === Admins.slug) return true
  return {
    worker: {
      equals: user.id,
    },
  }
}

const canDeleteShifts: Access<User> = ({ req: { user } }) => {
  // Allow workers to delete only their own shifts, admins can delete all
  if (!user) return false
  if (user.collection === Admins.slug) return true
  return {
    worker: {
      equals: user.id,
    },
  }
}

export const Shifts: CollectionConfig = {
  slug: 'shifts',
  access: {
    read: canReadShifts,
    create: canCreateShifts,
    update: canUpdateShifts,
    delete: canDeleteShifts,
  },
  fields: [
    {
      name: 'worker',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'customRate',
      type: 'number',
      admin: {
        description: 'Override the default service rate for this specific shift',
      },
    },
    {
      name: 'customRateType',
      type: 'select',
      options: [
        {
          label: 'Hourly',
          value: 'hourly',
        },
        {
          label: 'Fixed',
          value: 'fixed',
        },
      ],
      admin: {
        description: 'Required if custom rate is set',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Start date and time of the shift',
        date: {
          displayFormat: 'DD/MM/YYYY HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      admin: {
        description: 'End date and time of the shift',
        date: {
          displayFormat: 'DD/MM/YYYY HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'breakDuration',
      type: 'number',
      required: true,
      admin: {
        description: 'Break duration in minutes',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Scheduled',
          value: 'scheduled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      required: true,
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Calculate total price when creating or updating a shift
        if (!data.startDate || !data.endDate || !data.service) {
          return data
        }

        const start = new Date(data.startDate)
        const end = new Date(data.endDate)
        const durationInHours =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (data.breakDuration || 0) / 60

        let rate = 0
        let rateType = 'hourly'

        if (data.customRate !== undefined && data.customRate !== null) {
          rate = data.customRate
          rateType = data.customRateType || 'hourly'
        } else {
          // Fetch service rate
          const service = await req.payload.findByID({
            collection: 'services',
            id: data.service,
          })

          if (service) {
            rate = service.rate
            rateType = service.rateType
          }
        }

        if (rateType === 'hourly') {
          data.totalPrice = durationInHours * rate
        } else if (rateType === 'fixed') {
          data.totalPrice = rate
        } else {
          data.totalPrice = 0
        }

        return data
      },
    ],
  },
}
