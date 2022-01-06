export type LoggerLevels = 'info' | 'error' | 'warn' | 'debug' | 'verbose'

export const DEFAULT_LOG_LEVELS: LoggerLevels[] = [
  'info',
  'error',
  'warn',
  'debug',
  'verbose',
]

export interface LoggerOptions {
  levels?: LoggerLevels[]
}
