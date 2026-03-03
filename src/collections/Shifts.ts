import { getPayload, type CollectionConfig } from 'payload'
import config from '@payload-config'

export const Shifts: CollectionConfig = {
  slug: 'shifts',
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
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Start date and time of the shift',
        date: {
          displayFormat: 'DD/MM/YYYY HH:mm',
          pickerAppearance: 'dayAndTime', // Show both date and time in the picker
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
          pickerAppearance: 'dayAndTime', // Show both date and time in the picker
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
        description: 'Calculated total price for the shift',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        const payload = await getPayload({ config })
        // Calculate total price when creating or updating a shift
        if (!data.startDate || !data.endDate || !data.service) {
          return data
        }

        const start = new Date(data.startDate)
        const end = new Date(data.endDate)
        const durationInHours =
          (end.getTime() - start.getTime()) / (1000 * 60 * 60) - data.breakDuration / 60

        // Fetch service rate
        const service = await payload.findByID({
          collection: 'services',
          id: data.service,
        })

        if (service && service.rateType === 'hourly') {
          data.totalPrice = durationInHours * service.rate
        } else if (service && service.rateType === 'fixed') {
          data.totalPrice = service.rate
        } else {
          data.totalPrice = 0
        }

        return data
      },
    ],
  },
}
