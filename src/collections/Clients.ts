import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        {
          label: 'Individual',
          value: 'individual',
        },
        {
          label: 'Residential care center',
          value: 'residential_care_center',
        },
      ],
      required: true,
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'defaultRate',
      type: 'number',
    },
  ],
}
