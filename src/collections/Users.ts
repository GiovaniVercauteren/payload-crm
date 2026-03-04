import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      saveToJWT: true,
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      saveToJWT: true,
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
    },
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'streetAndNumber',
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
      ],
    },
    {
      name: 'companyRegistrationNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'bankDetails',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'iban',
          type: 'text',
          required: true,
        },
        {
          name: 'bic',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
