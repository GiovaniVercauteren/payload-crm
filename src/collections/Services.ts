import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'rateType',
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
      required: true,
    },
    {
      name: 'rate',
      type: 'number',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'deprecated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark service as deprecated',
      },
    },
  ],
}
