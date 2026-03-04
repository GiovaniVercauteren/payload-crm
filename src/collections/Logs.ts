import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'
import { Admins } from './Admins'

const canReadLogs: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return user.collection === Admins.slug
}

const canDeleteLogs: Access<User> = ({ req: { user } }) => {
  if (!user) {
    return false
  }
  return user.collection === Admins.slug
}

const canUpdateLogs: Access<User> = () => {
  // nobody should be able to update log records, even admins, to preserve the integrity of the data
  return false
}

export const Logs: CollectionConfig = {
  slug: 'logs',
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Error', value: 'error' },
        { label: 'Warning', value: 'warning' },
        { label: 'Info', value: 'info' },
        { label: 'Debug', value: 'debug' },
      ],
      required: true,
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'stack',
      type: 'textarea',
      required: false,
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            if (operation === 'create' && !value) {
              value = new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      hooks: {
        beforeChange: [
          ({ value, operation, req: { user } }) => {
            if (operation === 'create' && !value && user) {
              value = user.id
            }
            return value
          },
        ],
      },
    },
  ],
  access: {
    read: canReadLogs,
    update: canUpdateLogs,
    delete: canDeleteLogs,
  },
}
