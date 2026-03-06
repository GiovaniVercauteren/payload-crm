import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'

const servicesReadAccess: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return {
    user: {
      equals: user.id,
    },
  }
}

const servicesUpdateAccess: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return {
    user: {
      equals: user.id,
    },
  }
}

const servicesDeleteAccess: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return {
    user: {
      equals: user.id,
    },
  }
}

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: servicesReadAccess,
    update: servicesUpdateAccess,
    delete: servicesDeleteAccess,
  },
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hooks: {
        beforeChange: [
          ({ value, operation, req: { user } }) => {
            if (operation === 'create' && !value && user) {
              value = user.id
            }
          },
        ],
      },
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
