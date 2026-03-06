'use server'

import { Shift } from '@/payload-types'
import { CreateData } from '../../types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers } from 'next/headers'

async function getCurrentPayloadUser() {
  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    throw new Error('Unauthorized')
  }

  return { payload, user }
}

export async function getShiftsAction() {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const shifts = await payload.find({
      collection: 'shifts',
      where: {
        worker: {
          equals: user.id,
        },
      },
      pagination: true,
      sort: '-startDate',
      overrideAccess: false,
      user,
    })
    return shifts
  } catch (error) {
    throw new Error(
      `Failed to fetch shifts: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function getShiftAction(shiftId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const shift = await payload.findByID({
      collection: 'shifts',
      id: shiftId,
      overrideAccess: false,
      user,
    })
    return shift
  } catch (error) {
    throw new Error(
      `Failed to fetch shift: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function createShiftAction(data: CreateData<Shift>) {
  const { payload, user } = await getCurrentPayloadUser()

  try {
    const newShift = await payload.create({
      collection: 'shifts',
      data: {
        ...data,
        worker: user.id,
      } as any,
      overrideAccess: false,
      user,
    })
    return newShift
  } catch (error) {
    throw new Error(
      `Failed to create shift: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function updateShiftAction(shiftId: string | number, data: CreateData<Shift>) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    const updatedShift = await payload.update({
      collection: 'shifts',
      id: shiftId,
      data,
      overrideAccess: false,
      user,
    })
    return updatedShift
  } catch (error) {
    throw new Error(
      `Failed to update shift: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function deleteShiftAction(shiftId: string | number) {
  const { payload, user } = await getCurrentPayloadUser()
  try {
    await payload.delete({
      collection: 'shifts',
      id: shiftId,
      overrideAccess: false,
      user,
    })
  } catch (error) {
    throw new Error(
      `Failed to delete shift: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
