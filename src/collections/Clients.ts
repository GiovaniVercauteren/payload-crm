import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'

const clientsReadAccess: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  if (user.collection === 'admins') {
    return true
  }
  return {
    user: {
      equals: user.id,
    },
  }
}

const clientsUpdateAccess: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  if (user.collection === 'admins') {
    return true
  }
  return {
    user: {
      equals: user.id,
    },
  }
}

const clientsDeleteAccess: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  if (user.collection === 'admins') {
    return true
  }
  return {
    user: {
      equals: user.id,
    },
  }
}

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: clientsReadAccess,
    update: clientsUpdateAccess,
    delete: clientsDeleteAccess,
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
  ],
}
