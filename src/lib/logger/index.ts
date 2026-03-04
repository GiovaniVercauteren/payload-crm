import { Log } from '@/payload-types'

export type LoggerParams = Omit<Log, 'id' | 'createdAt' | 'updatedAt' | 'timestamp'>

export default class Logger {
  static log(params: LoggerParams) {
    console.log(`[INFO] ${params.message}`, params)
  }

  static error(params: LoggerParams) {
    console.error(`[ERROR] ${params.message}`, params)
  }

  static warn(params: LoggerParams) {
    console.warn(`[WARN] ${params.message}`, params)
  }

  static debug(params: LoggerParams) {
    console.debug(`[DEBUG] ${params.message}`, params)
  }
}
