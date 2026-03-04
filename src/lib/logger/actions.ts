'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { LoggerParams } from '.'

export async function logAction(params: LoggerParams) {
  const payload = await getPayload({ config })
  try {
    await payload.create({
      collection: 'logs',
      data: {
        type: params.type,
        message: params.message,
        stack: params.stack,
        timestamp: new Date().toISOString(),
        user: params.user ?? null,
      },
    })
  } catch (error) {
    console.error('Failed to log message:', error)
  }
}
