import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'

const usersReadAccess: Access<User> = ({ req: { user } }) => {
  // Allow users to read their own data, admins can read all
  if (!user) return false
  if (user.collection === 'admins') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

const usersUpdateAccess: Access<User> = ({ req: { user } }) => {
  // Allow users to update their own data, admins can update all
  if (!user) return false
  if (user.collection === 'admins') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

const usersDeleteAccess: Access<User> = ({ req: { user } }) => {
  // Allow users to delete their own data, admins can delete all
  if (!user) return false
  if (user.collection === 'admins') return true
  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: usersReadAccess,
    update: usersUpdateAccess,
    delete: usersDeleteAccess,
  },
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
      saveToJWT: true,
      name: 'nickname',
      type: 'text',
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
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
