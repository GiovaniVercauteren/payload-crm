import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'

const adminsReadAccess: Access<User> = ({ req: { user } }) => {
  // Allow admins to read all, workers cannot read any admin data
  if (!user) return false
  return user.collection === 'admins'
}

const adminsUpdateAccess: Access<User> = ({ req: { user } }) => {
  // Allow admins to update all, workers cannot update any admin data
  if (!user) return false
  return user.collection === 'admins'
}

const adminsDeleteAccess: Access<User> = ({ req: { user } }) => {
  // Allow admins to delete all, workers cannot delete any admin data
  if (!user) return false
  return user.collection === 'admins'
}

export const Admins: CollectionConfig = {
  slug: 'admins',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: adminsReadAccess,
    update: adminsUpdateAccess,
    delete: adminsDeleteAccess,
  },
  fields: [],
}
