import type {
  Access,
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
} from 'payload'
import type { Shift, User } from '@/payload-types'
import { Admins } from './Admins'

// Access control

const invoiceReadAccess: Access<User> = ({ req: { user } }) => {
  // Allow workers to read only their own invoices, admins can read all
  if (!user) return false
  if (user.collection === Admins.slug) return true
  return {
    user: {
      equals: user.id,
    },
  }
}

const canCreateInvoice: Access<User> = ({ req: { user } }) => {
  // Allow authenticated users to create invoices
  return Boolean(user)
}

const invoiceUpdateAccess: Access<User> = ({ req: { user } }) => {
  // Allow workers to update only their own invoices, admins can update all
  if (!user) return false
  if (user.collection === Admins.slug) return true
  return {
    user: {
      equals: user.id,
    },
  }
}

const invoiceDeleteAccess: Access<User> = ({ req: { user } }) => {
  // Allow workers to delete only their own invoices, admins can delete all
  if (!user) return false
  if (user.collection === Admins.slug) return true
  return {
    user: {
      equals: user.id,
    },
  }
}

// Hooks

const setUserOnCreate: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create' && req.user) {
    data.user = req.user.id
  }
  return data
}

const calculateTotalAmount: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  let shiftIds: number[] = []

  if (data.shifts && Array.isArray(data.shifts)) {
    shiftIds = data.shifts.map((s) => (typeof s === 'object' && s !== null ? Number(s.id) : Number(s)))
  } else if (operation === 'update' && originalDoc) {
    if (originalDoc.shifts) {
      shiftIds = (originalDoc.shifts as (number | Shift)[]).map((s) =>
        typeof s === 'object' && s !== null ? Number(s.id) : Number(s),
      )
    }
  }

  if (shiftIds.length > 0) {
    const shifts = await req.payload.find({
      collection: 'shifts',
      where: {
        id: {
          in: shiftIds,
        },
      },
      depth: 0,
      pagination: false,
      req, // Maintain transaction context
    })

    data.totalAmount = shifts.docs.reduce((total, shift) => total + (shift.totalPrice || 0), 0)
  } else {
    data.totalAmount = 0
  }

  return data
}

const createOrUpdateShiftInvoiceRelation: CollectionAfterChangeHook = async ({
  previousDoc,
  doc,
  operation,
  req,
}) => {
  const getIds = (shifts: (Shift | string | number)[]) =>
    (shifts || []).map((s) => (typeof s === 'object' && s !== null ? Number(s.id) : Number(s)))

  const currentShiftIds = getIds(doc.shifts)
  const previousShiftIds = getIds(previousDoc?.shifts)

  if (operation === 'create' || operation === 'update') {
    const addedShiftIds = currentShiftIds.filter((id) => !previousShiftIds.includes(id))

    for (const shiftId of addedShiftIds) {
      if (shiftId) {
        await req.payload.update({
          collection: 'shifts',
          id: shiftId,
          data: {
            invoice: doc.id,
          },
          req, // Maintain transaction context
        })
      }
    }

    if (operation === 'update') {
      const removedShiftIds = previousShiftIds.filter((id) => !currentShiftIds.includes(id))

      for (const shiftId of removedShiftIds) {
        if (shiftId) {
          await req.payload.update({
            collection: 'shifts',
            id: shiftId,
            data: {
              invoice: null,
            },
            req, // Maintain transaction context
          })
        }
      }
    }
  }
}

const deleteInvoiceFromShifts: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const getIds = (shifts: (Shift | string | number)[]) =>
    (shifts || []).map((s) => (typeof s === 'object' && s !== null ? Number(s.id) : Number(s)))

  const shiftIds = getIds(doc.shifts)

  for (const shiftId of shiftIds) {
    if (shiftId) {
      await req.payload.update({
        collection: 'shifts',
        id: shiftId,
        data: {
          invoice: null,
        },
        req, // Maintain transaction context
      })
    }
  }
}

export const Invoices: CollectionConfig<'invoices'> = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'invoiceNumber',
  },
  access: {
    read: invoiceReadAccess,
    create: canCreateInvoice,
    update: invoiceUpdateAccess,
    delete: invoiceDeleteAccess,
  },
  hooks: {
    beforeChange: [setUserOnCreate, calculateTotalAmount],
    afterChange: [createOrUpdateShiftInvoiceRelation],
    afterDelete: [deleteInvoiceFromShifts],
  },
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
    },
    {
      name: 'shifts',
      type: 'relationship',
      relationTo: 'shifts',
      hasMany: true,
      required: true,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
